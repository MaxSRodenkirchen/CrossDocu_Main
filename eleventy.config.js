import eleventyBacklinks from 'eleventy-plugin-backlinks';

export default function (eleventyConfig) {
    eleventyConfig.setInputDirectory('src');
    eleventyConfig.setOutputDirectory('_site');
    eleventyConfig.addPlugin(eleventyBacklinks, {
        folder: '/content', // The folder with your notes
        // getData(note) {
        //     return {
        //         url: note.url,
        //         title: note.data.title,
        //     };
        // },
    });
}

export const config = {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',

    dir: {
        input: "content",          // default: "."
        includes: "../_includes",  // default: "_includes" (`input` relative)
        data: "../_data",          // default: "_data" (`input` relative)
        output: "_site"
    },
};