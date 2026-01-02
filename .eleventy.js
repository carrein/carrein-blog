import Image from "@11ty/eleventy-img";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import { readdirSync } from "fs";
import path from "path";

export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({
    "src/styles": "styles",
    "src/assets": "assets",
    "src/images/gallery": "images/gallery",
  });

  eleventyConfig.addPassthroughCopy(
    "src/posts/**/*.{jpg,jpeg,png,webp,avif,gif,svg}"
  );

  eleventyConfig.addPlugin(pluginWebc, {
    components: ["src/_components/**/*.webc"],
  });

  eleventyConfig.addAsyncShortcode(
    "image",
    async (src, size = "default", alt = "") => {
      const IMAGE_FORMATS = ["avif", "webp", "jpeg"];
      const OUTPUT_DIR = "./_site/image/";
      const URL_PATH = "/image/";

      // Define width and sizes for each type
      const sizeMap = {
        thumbnail: { widths: [200], finalSizes: "200px" },
        preview: { widths: [960], finalSizes: "960px" },
        default: {
          widths: [1280, 1920],
          finalSizes: "(min-width: 40em) 50vw, 30vw",
        },
      };

      const { widths, finalSizes } = sizeMap[size] || sizeMap.default;

      const metadata = await Image(src, {
        widths,
        formats: IMAGE_FORMATS,
        outputDir: OUTPUT_DIR,
        urlPath: URL_PATH,
      });

      return Image.generateHTML(metadata, {
        alt,
        sizes: finalSizes,
        loading: "lazy",
        decoding: "async",
      });
    }
  );

  eleventyConfig.addCollection("posts", (collection) => {
    const formatMonthYear = (d) =>
      new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
        new Date(d)
      );

    const posts = collection.getFilteredByGlob("src/posts/**/*.md");

    posts.forEach((post) => {
      post.data = {
        ...post.data,
        displayDate: post.date ? formatMonthYear(post.date) : null,
        datetime: post.date || null,
      };
    });

    return posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  });

  eleventyConfig.addCollection("gallery", () => {
    const galleryPath = path.join(eleventyConfig.dir.input, "images/gallery");
    return readdirSync(galleryPath)
      .filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file))
      .map((file) => ({
        src: `src/images/gallery/${file}`,
        outputSrc: `/images/gallery/${file}`,
        alt: file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      }));
  });

  eleventyConfig.addCollection("tagList", (collection) => {
    const tags = new Set(
      collection.getAll().flatMap((item) => item.data.tags || [])
    );
    return [...tags];
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "webc",
  };
};
