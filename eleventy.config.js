// ---------------------------------------------------------------------------
// Wikilinks: converts [[Page Name]] and [[Page Name|Alias]] to <a> tags
// Uses amendLibrary so we don't need to import markdown-it separately —
// Eleventy already has it internally.
// ---------------------------------------------------------------------------
function wikilinkPlugin(md) {
    const wikilinkRegex = /\[\[\s*([^\[\]|]+?)\s*(?:\|\s*([^\[\]]+?)\s*)?\]\]/g;

    md.core.ruler.push('wikilinks', (state) => {
        for (const token of state.tokens) {
            if (token.type !== 'inline' || !token.children) continue;

            const newChildren = [];
            for (const child of token.children) {
                if (child.type !== 'text') {
                    newChildren.push(child);
                    continue;
                }

                let lastIndex = 0;
                let match;
                wikilinkRegex.lastIndex = 0;

                while ((match = wikilinkRegex.exec(child.content)) !== null) {
                    if (match.index > lastIndex) {
                        const before = new state.Token('text', '', 0);
                        before.content = child.content.slice(lastIndex, match.index);
                        newChildren.push(before);
                    }

                    const pageName = match[1].trim();
                    const alias = match[2] ? match[2].trim() : pageName;
                    const href = '/' + encodeURIComponent(pageName) + '/';

                    const link = new state.Token('html_inline', '', 0);
                    link.content = `<a href="${href}">${alias}</a>`;
                    newChildren.push(link);

                    lastIndex = match.index + match[0].length;
                }

                if (lastIndex < child.content.length) {
                    const after = new state.Token('text', '', 0);
                    after.content = child.content.slice(lastIndex);
                    newChildren.push(after);
                }
            }
            token.children = newChildren;
        }
    });
}

// ---------------------------------------------------------------------------
// Eleventy config
// ---------------------------------------------------------------------------
export default function (eleventyConfig) {

    // Wikilinks — hooks into Eleventy's built-in markdown-it instance
    eleventyConfig.amendLibrary('md', wikilinkPlugin);

    // All markdown pages as a collection (used for backlinks scanning)
    eleventyConfig.addCollection('allPages', (collection) => {
        return collection.getAll().filter(t => t.inputPath.endsWith('.md'));
    });

    // Backlinks: for each page, find all OTHER pages that [[link]] to it
    eleventyConfig.addGlobalData('eleventyComputed', {
        async backlinks({ collections, page }) {
            const allPages = collections.allPages;
            if (!allPages || !page?.fileSlug) return [];

            const result = [];
            const escapedSlug = page.fileSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // matches [[Page Name]] and [[Page Name|Alias]]
            const regex = new RegExp(
                `\\[\\[\\s*${escapedSlug}(?:\\s*\\|[^\\[\\]]+)?\\s*\\]\\]`,
                'gi'
            );

            for (const note of allPages) {
                if (note.url === page.url) continue; // skip self
                const { content } = await note.template.read();
                // strip code blocks to avoid false positives
                const stripped = content
                    .replace(/```[\s\S]*?```/g, '')
                    .replace(/`[^`]+`/g, '');
                if (regex.test(stripped)) {
                    result.push({
                        url: note.url,
                        title: note.data.title || note.fileSlug,
                    });
                }
            }

            return result;
        },
    });
}

export const config = {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',

    dir: {
        input: 'ECT_Content_V3',   // all notes live directly here
        includes: '../_includes',
        data: '../_data',
        output: '_site',
    },
};