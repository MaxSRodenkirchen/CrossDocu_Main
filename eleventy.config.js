import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import wikilinksPlus from "markdown-it-wikilinks-plus";


export default function (eleventyConfig) {


    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Wikilinks Plugin aktivieren ([[seite]] und ![[bild.png]])
    eleventyConfig.amendLibrary("md", (mdLib) => {
        mdLib.use(wikilinksPlus, {
            pageLink: {
                relativeBaseURL: './',
                absoluteBaseURL: './',
                forceAllLinksAbsolute: true
            },
            imageEmbed: {
                defaultAltText: true,
                absoluteBaseURL: '/images/',
                forceAllImageUrlsAbsolute: true
            },
        });
    });

    // Paged.js und CSS in den Output kopieren
    eleventyConfig.addPassthroughCopy({
        "node_modules/pagedjs/dist/paged.esm.js": "js/paged.esm.js",
        "js": "js"
    });

    eleventyConfig.addPassthroughCopy('content/images');
    eleventyConfig.addPassthroughCopy('fonts');
    eleventyConfig.addPassthroughCopy('styles');

    eleventyConfig.addCollection('posts', (collection) => {
        return collection
            .getFilteredByGlob('./content/*.md')
    })


    eleventyConfig.addFilter("log", (value) => {
        console.log(value);
        // return value;
    });

    eleventyConfig.addFilter("firstImage", (content) => {
        const match = content.match(/<img[^>]+>/); //Regular Expression, only take the first img tag
        return match ? match[0] : '<img src="https://images.unsplash.com/photo-1560015534-cee980ba7e13?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">';


    });

    // console.log(collection.creativecoding)
    // Input Directory
    // eleventyConfig.setInputDirectory(content);
};

export const config = {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
        "md",
        "njk",
        "html",
        "liquid",
        "11ty.js",
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // These are all optional:
    dir: {
        input: "content",          // default: "."
        includes: "../_includes",  // default: "_includes" (`input` relative)
        data: "../_data",          // default: "_data" (`input` relative)
        output: "_site"
    },
};