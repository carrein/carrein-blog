import eleventyImage from "@11ty/eleventy-img";
import pluginWebc from "@11ty/eleventy-plugin-webc";

export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("src/main.css");
  eleventyConfig.addPassthroughCopy("src/reset.css");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy(
    "posts/**/*.{jpg,jpeg,png,gif,webp,mp4,webm}"
  );
  eleventyConfig.addPassthroughCopy("src/gallery/images");

  eleventyConfig.addPlugin(pluginWebc, {
    components: "src/_components/**/*.webc",
  });

  // Make page URL available to WebC
  eleventyConfig.addJavaScriptFunction("isCurrentPage", function (href) {
    return this.page.url === href;
  });

  eleventyConfig.addAsyncShortcode("galleryImage", async (src) => {
    const metadata = await eleventyImage(src, {
      widths: [400],
      formats: ["jpeg"],
      outputDir: "./_site/gallery/images/",
      urlPath: "/gallery/images/",
    });

    const thumb = metadata.jpeg[0];
    return `<a href="${src.replace("src/", "/")}"><img src="${
      thumb.url
    }" loading="lazy" alt=""></a>`;
  });

  eleventyConfig.addAsyncShortcode("writingHero", async (src, alt) => {
    const metadata = await eleventyImage(src, {
      widths: [800, 1200], // full size options
      formats: ["jpeg", "webp"],
      outputDir: "./_site/writings/images",
      urlPath: "/writings/images",
    });

    const jpeg = metadata.jpeg[metadata.jpeg.length - 1]; // largest
    const webp = metadata.webp?.[metadata.webp.length - 1];

    return `<picture>
    ${webp ? `<source type="image/webp" srcset="${webp.url}">` : ""}
    <img src="${jpeg.url}" width="${jpeg.width}" height="${
      jpeg.height
    }" alt="${alt}" loading="lazy">
  </picture>`;
  });

  eleventyConfig.addCollection("writings", (collection) => {
    return collection
      .getFilteredByGlob("src/writings/*.md")
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
