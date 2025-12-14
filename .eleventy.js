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

  eleventyConfig.addPlugin(pluginWebc, {
    components: ["src/_components/**/*.webc"],
  });

  eleventyConfig.addAsyncShortcode(
    "image",
    async (src, alt, sizes = "(min-width: 40em) 80vw, 30vw") => {
      const IMAGE_FORMATS = ["avif", "webp", "jpeg"];
      const OUTPUT_DIR = "./_site/image/";
      const URL_PATH = "/image/";

      const widths = sizes === "preview" ? [400] : [750, 1500, 2250];
      const finalSizes = sizes === "preview" ? "400px" : sizes;

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

    const posts = collection.getFilteredByGlob("src/posts/**/*.webc");

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
  };
};
