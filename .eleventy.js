export default (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy(
    "posts/**/*.{jpg,jpeg,png,gif,webp,mp4,webm}"
  );

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
  };
};
