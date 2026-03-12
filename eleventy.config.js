import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default function (eleventyConfig) {
    // Global Data
    // eleventyConfig.addGlobalData("metadata", {
    //     title: "CrossDocu",
    //     language: "en",
    //     description: "Project and process documentation simplified."
    // });

    // Shortcodes
    // eleventyConfig.addShortcode("currentBuildDate", () => {
    //     return (new Date()).toISOString();
    // });

    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Paged.js und CSS in den Output kopieren
    eleventyConfig.addPassthroughCopy({
        "node_modules/pagedjs/dist/paged.esm.js": "js/paged.esm.js",
        "content/_includes/style.css": "style.css"
    });

    // Input Directory
    eleventyConfig.setInputDirectory("content");
};