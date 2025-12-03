export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("src/main.css");
  eleventyConfig.addPassthroughCopy("src/reset.css");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy(
    "posts/**/*.{jpg,jpeg,png,gif,webp,mp4,webm}"
  );
  eleventyConfig.addPassthroughCopy("src/gallery/images");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
