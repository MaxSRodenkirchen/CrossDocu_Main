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

        // Eigene Regel hinzufügen, um -> in → umzuwandeln
        mdLib.core.ruler.push('replace_arrow', function (state) {
            for (let i = state.tokens.length - 1; i >= 0; i--) {
                if (state.tokens[i].type !== 'inline') continue;
                let tokens = state.tokens[i].children;
                for (let j = tokens.length - 1; j >= 0; j--) {
                    if (tokens[j].type === 'text') {
                        tokens[j].content = tokens[j].content.replace(/->/g, '→');
                    }
                }
            }
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

    eleventyConfig.addCollection('mocs', (collection) => {
        return collection.getFilteredByGlob('./content/*.md')
    })

    // Transform to parse %% comments %% and turn them into HTML comments <!-- -->
    // Transform to parse %% comments %% and turn them into HTML comments <!-- -->
    eleventyConfig.addTransform("markdown-comments", function(content) {
        if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
            // Replace block comments (wrapped in <p>)
            let replaced = content.replace(/<p>\s*%%([\s\S]*?)%%\s*<\/p>/g, "<!-- $1 -->");
            // Replace inline comments
            replaced = replaced.replace(/%%([\s\S]*?)%%/g, "<!-- $1 -->");
            return replaced;
        }
        return content;
    });

    // Filter to add slugified IDs to h1, h2, h3 tags for table of contents navigation
    eleventyConfig.addFilter("addHeadingIds", function(content) {
        if (typeof content !== 'string') return '';
        const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\u00df-\u00ff]+/gi, '-').replace(/(^-|-$)/g, '');
        return content.replace(/<h([1-3])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, text) => {
            if (attrs.includes('id=')) {
                return match;
            }
            const cleanText = text.replace(/<[^>]+>/g, '').trim();
            const id = slugify(cleanText);
            return `<h${level} id="${id}" ${attrs}>${text}</h${level}>`;
        });
    });


    eleventyConfig.addFilter("log", (value) => {
        console.log(value);
        // return value;
    });

    eleventyConfig.addFilter("firstImage", (content) => {
        const match = content.match(/<img[^>]+>/); //Regular Expression, only take the first img tag
        return match ? match[0] : '<img src="https://images.unsplash.com/photo-1560015534-cee980ba7e13?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">';

    });

    eleventyConfig.addFilter("injectTags", function(content, tags) {
        if (!tags || !Array.isArray(tags) || tags.length === 0) return content;

        const tagsHtml = `<div class="content-tags">${tags.map(tag => `<span class="content-tag">${tag}</span>`).join('')}</div>`;

        // Erste Überschrift (h1, h2 oder h3) finden
        const match = content.match(/<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/i);
        if (match) {
            const insertIndex = match.index + match[0].length;
            return content.slice(0, insertIndex) + tagsHtml + content.slice(insertIndex);
        }
        return tagsHtml + content;
    });

    eleventyConfig.addFilter("mocSidebar", function(content, collectionsAll) {
        if (!content) return "";
        const collections = collectionsAll || (this.ctx && this.ctx.collections && this.ctx.collections.all) || [];

        // Matcht <li><a href="...">Linktext</a></li> und fängt href und Linktext ab
        const regex = /<li>\s*<a\s*[^>]*?href="([^"]+)"[^>]*?>([^<]+)<\/a>\s*<\/li>/gi;
        
        return content.replace(regex, (match, href, linkText) => {

            // Finde die Seite anhand der URL statt des Linktextes
            const page = collections.find(p => {
                // Normalisiere URLs
                const pageUrl = p.url?.replace(/\/$/, '').replace(/%20/g, ' ');
                const hrefUrl = href?.replace(/\/\.\//g, '/').replace(/\/$/, '').replace(/%20/g, ' ');
                
                
                return pageUrl === hrefUrl;
            });
            
            
            // Hole das erste Bild der Seite (HTML oder Wikilink)
            let imgHtml = '';
            
            if (page?.templateContent) {
                // Versuche HTML img-Tag zu finden
                const imgMatch = page.templateContent.match(/<img[^>]+>/);
                if (imgMatch) {
                    imgHtml = imgMatch[0];
                } else {
                    // Fallback: Versuche Wikilink-Bild zu finden
                    const wikiMatch = page.templateContent.match(/!\[\[([^\]]+\.(png|jpg|jpeg|gif|webp))\]\]/i);
                    if (wikiMatch) {
                        imgHtml = `<img src="/images/${wikiMatch[1]}" alt="${wikiMatch[1]}">`;
                    }
                }
            }
            
            // Fallback auf Placeholder wenn kein Bild gefunden (Entfernt, stattdessen bleibt imgHtml leer für weißen Hintergrund)
            // if (!imgHtml) {
            //     imgHtml = '<img src="https://images.unsplash.com/photo-1560015534-cee980ba7e13?q=80&w=1035&auto=format&fit=crop">';
            // }

            return `<li>
                <a href="${href}">
                    ${imgHtml}
                    <p>${linkText}</p>
                </a>
            </li>`;
        });
    });

    eleventyConfig.addFilter("linkClass", (content) => {
        if (typeof content !== 'string') return '';
        
        // If the content looks like HTML, process all <a> tags inside it
        if (/<[a-z][\s\S]*>/i.test(content)) {
            return content.replace(/<a\s+([^>]*href=["']([^"']*)["']([^>]*))>/gi, (match, body, href) => {
                const isExternal = /^(https?:)?\/\//.test(href);
                const className = isExternal ? 'externalLink' : 'internalLink';
                
                if (/class=["']/i.test(body)) {
                    return `<a ${body.replace(/class=(["'])(.*?)\1/gi, `class=$1$2 ${className}$1`)}>`;
                } else {
                    return `<a class="${className}" ${body}>`;
                }
            });
        }

        // Otherwise, treat as a single URL string and return the class name
        const isExternal = /^(https?:)?\/\//.test(content);
        return isExternal ? 'externalLink' : 'internalLink';
    });
    
    eleventyConfig.addFilter("getSections", (content) => {
        if (typeof content !== 'string') return '';
        
        const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\u00df-\u00ff]+/gi, '-').replace(/(^-|-$)/g, '');
        const headingRegex = /<h([1-3])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
        const headings = [];
        let match;
        
        while ((match = headingRegex.exec(content)) !== null) {
            const level = parseInt(match[1], 10);
            const attrs = match[2];
            const rawText = match[3];
            
            // Extract ID attribute or generate it
            const idMatch = attrs.match(/id=["']([^"']+)["']/i);
            const text = rawText.replace(/<[^>]+>/g, '').trim();
            const id = idMatch ? idMatch[1] : slugify(text);
            
            if (text) {
                headings.push({ level, text, id });
            }
        }
        
        if (headings.length === 0) return '';
        
        // Build the nested ordered lists using a stack
        let html = "";
        const stack = [];
        
        for (const h of headings) {
            const link = `<a href="#${h.id}">${h.text}</a>`;
            
            if (stack.length === 0) {
                html += "<ol>";
                stack.push(h.level);
            } else {
                let lastLevel = stack[stack.length - 1];
                if (h.level > lastLevel) {
                    html += "<ol>";
                    stack.push(h.level);
                } else {
                    while (stack.length > 0 && h.level < stack[stack.length - 1]) {
                        html += "</li></ol>";
                        stack.pop();
                    }
                    if (stack.length > 0 && h.level === stack[stack.length - 1]) {
                        html += "</li>";
                    } else {
                        html += "<ol>";
                        stack.push(h.level);
                    }
                }
            }
            
            html += `<li>${link}`;
        }
        
        while (stack.length > 0) {
            html += "</li></ol>";
            stack.pop();
        }
        
        return html;
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