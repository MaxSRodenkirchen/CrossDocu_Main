import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import wikilinksPlus from "markdown-it-wikilinks-plus";
import fs from "fs";
import path from "path";

export default function (eleventyConfig) {


    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    // Wikilinks Plugin aktivieren ([[seite]] und ![[bild.png]])
    eleventyConfig.amendLibrary("md", (mdLib) => {
        mdLib.set({ breaks: true }); //enable single line breaks - like in Obsidian and VS-Code etc. 

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
    eleventyConfig.addPassthroughCopy('content/icons');
    eleventyConfig.addPassthroughCopy('fonts');
    eleventyConfig.addPassthroughCopy('styles');

    eleventyConfig.addShortcode("icon", function (iconName) {
        return `<svg class="i i-${iconName}"><use href="/fonts/icons/svg-sprite.svg#${iconName}"/></svg>`;
    });

    eleventyConfig.addCollection('posts', (collection) => {
        return collection
            .getFilteredByGlob('./content/*.md')
    })

    eleventyConfig.addCollection('backlinksMap', (collectionApi) => {
        const allItems = collectionApi.getAll();
        const backlinks = {};

        allItems.forEach(item => {
            let rawText = item.rawInput || (item.page ? item.page.rawInput : '') || '';
            if (!rawText) return;

            // Strip code blocks to avoid false positives
            rawText = rawText.replace(/```[\s\S]*?```/g, '');
            rawText = rawText.replace(/`[^`]*`/g, '');

            allItems.forEach(targetItem => {
                if (item.url === targetItem.url || !targetItem.url) return;

                let targetPageName = targetItem.fileSlug;
                if (!targetPageName && targetItem.url === '/') {
                    targetPageName = 'index';
                }

                if (!targetPageName) return;

                let isLinked = false;
                const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const escapedName = escapeRegExp(targetPageName);

                // Wikilinks: [[name]] or [[name|alias]] with optional spaces
                const wikiRegex = new RegExp(`\\[\\[\\s*${escapedName}\\s*(?:\\]\\]|\\|)`, 'i');
                if (wikiRegex.test(rawText)) {
                    isLinked = true;
                }

                // Standard Markdown links
                if (!isLinked) {
                    const encodedName = encodeURIComponent(targetPageName);
                    const escapedEncoded = escapeRegExp(encodedName);
                    const mdRegex = new RegExp(`\\]\\(\\s*(?:\\.\\/)?(?:${escapedName}|${escapedEncoded})(?:\\.md)?\\s*\\)`, 'i');
                    if (mdRegex.test(rawText)) {
                        isLinked = true;
                    }
                }

                if (isLinked) {
                    if (!backlinks[targetItem.url]) {
                        backlinks[targetItem.url] = [];
                    }
                    if (!backlinks[targetItem.url].some(bl => bl.url === item.url)) {
                        backlinks[targetItem.url].push({
                            url: item.url,
                            title: item.data.title || item.fileSlug,
                            tags: item.data.tags || []
                        });
                    }
                }
            });
        });
        return backlinks;
    });

    eleventyConfig.addCollection('mocs', (collection) => {
        return collection.getFilteredByGlob('./content/*.md')
    })

    // Transform to parse %% comments %% and turn them into HTML comments <!-- -->
    eleventyConfig.addTransform("markdown-comments", function (content) {
        if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
            // Replace block comments (wrapped in <p>)
            let replaced = content.replace(/<p>\s*%%([\s\S]*?)%%\s*<\/p>/g, "<!-- $1 -->");
            // Replace inline comments
            replaced = replaced.replace(/%%([\s\S]*?)%%/g, "<!-- $1 -->");
            return replaced;
        }
        return content;
    });

    // Transform to generate print/slide fallbacks for iframes
    eleventyConfig.addTransform("iframe-fallbacks", function (content) {
        if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
            return content.replace(/<iframe\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)>[\s\S]*?<\/iframe>/gi, (match, beforeSrc, src, afterSrc) => {
                let isYouTube = false;

                let videoId = "";
                let thumbUrl = "";

                // Check for YouTube
                let ytMatch = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
                if (!ytMatch) {
                    ytMatch = src.match(/youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)/);
                }

                let linkHref = src;

                if (ytMatch) {
                    isYouTube = true;
                    videoId = ytMatch[1];
                    thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    linkHref = `https://www.youtube.com/watch?v=${videoId}`;
                } else {
                    // Clean up other iframe URLs (e.g. Arduino ?view-mode=embed)
                    try {
                        const urlObj = new URL(linkHref);
                        urlObj.searchParams.delete('view-mode');
                        // Optional: remove other embed-specific query params if they exist
                        linkHref = urlObj.toString();
                    } catch (e) {
                        // In case src is not a valid URL (e.g. relative path), fallback to simple string replace
                        linkHref = linkHref.replace('?view-mode=embed', '').replace('&view-mode=embed', '');
                    }
                }

                // Check for explicit pixel height
                const explicitHeightMatch = match.match(/height\s*[:=]\s*["']?(\d+)px["']?/);

                // Removed Archive.org thumbnail check due to low-res images
                const iframeHTML = `<iframe${beforeSrc}src="${src}"${afterSrc}></iframe>`;

                if (isYouTube) {
                    return `
<div class="iframe-container has-thumbnail">
    <div class="iframe-interactive">
        ${iframeHTML}
    </div>
    <div class="iframe-print-fallback">
        <img src="${thumbUrl}" alt="Video Thumbnail" class="iframe-thumbnail" />
    </div>
</div>
<div class="iframe-print-fallback-link-only">
    <a href="${linkHref}" target="_blank" class="externalLink">${linkHref}</a>
</div>`;
                } else if (explicitHeightMatch) {
                    // If the iframe has a fixed pixel height (like Arduino), do not use the 16:9 container.
                    return `
<div class="iframe-wrapper-native">
    ${iframeHTML}
    <div class="iframe-print-fallback-link-only">
        <a href="${linkHref}" target="_blank" class="externalLink">${linkHref}</a>
    </div>
</div>`;
                } else {
                    // For p5.js and others (without explicit height): use the 16:9 container.
                    return `
<div class="iframe-container no-thumbnail">
    <div class="iframe-interactive">
        ${iframeHTML}
    </div>
</div>
<div class="iframe-print-fallback-link-only">
    <a href="${linkHref}" target="_blank" class="externalLink">${linkHref}</a>
</div>`;
                }
            });
        }
        return content;
    });

    // Filter to ensure there is an h1 at the start of the content
    eleventyConfig.addFilter("ensureH1", function (content, fallbackTitle) {
        if (typeof content !== 'string') return '';
        const title = fallbackTitle || this.ctx.title || 'Untitled';
        // Remove HTML comments and leading whitespace to check the first tag
        const stripped = content.replace(/<!--[\s\S]*?-->/g, '').trim();
        if (!stripped.startsWith('<h1')) {
            return `<h1>${title}</h1>\n${content}`;
        }
        return content;
    });

    // Filter to add slugified IDs to h1, h2, h3 tags for table of contents navigation
    eleventyConfig.addFilter("addHeadingIds", function (content, prefix = "", chapterTitle = "") {
        if (typeof content !== 'string') return '';
        const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\u00df-\u00ff]+/gi, '-').replace(/(^-|-$)/g, '');
        return content.replace(/<h([1-3])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, text) => {
            // Remove existing ID if we are prefixing (to overwrite)
            if (prefix) {
                attrs = attrs.replace(/id=["'][^"']*["']/gi, '');
            } else if (attrs.includes('id=')) {
                return match;
            }
            const cleanText = text.replace(/<[^>]+>/g, '').trim();
            let id = slugify(cleanText);
            if (prefix) {
                id = `${slugify(prefix)}-${id}`;
            }

            let titleAttr = "";
            if (level === "1" && chapterTitle) {
                titleAttr = ` data-chapter-title="${chapterTitle.replace(/"/g, '&quot;')}"`;
            }

            return `<h${level} id="${id}" ${attrs}${titleAttr}>${text}</h${level}>`;
        });
    });

    // Extract book items from the parent page's content
    eleventyConfig.addFilter("extractBookItems", function (htmlContent, allCollections) {
        if (!htmlContent) return [];

        const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
        const linkedSlugs = [];
        let match;

        while ((match = linkRegex.exec(htmlContent)) !== null) {
            const href = match[1];
            if (href && !href.startsWith('#') && !/^(https?:)?\/\//.test(href)) {
                let slug = decodeURIComponent(href).replace(/^\/?\.\//, '').replace(/\/$/, '');
                if (slug && !linkedSlugs.includes(slug)) {
                    linkedSlugs.push(slug);
                }
            }
        }

        const chapters = [];
        for (const slug of linkedSlugs) {
            const foundPage = allCollections.find(item => item.fileSlug === slug || (slug === 'index' && item.url === '/'));
            if (foundPage) {
                chapters.push(foundPage);
            }
        }
        return chapters;
    });

    // Inject Table of Contents after ### Table of Content and remove original list
    eleventyConfig.addFilter("injectToC", function (content) {
        if (!content) return "";

        const headingRegex = /<h([1-3])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
        let match;

        // Build a mapping from data-chapter-title (fileSlug) to the generated h1 id
        const slugToIdMap = {};
        let tocHtml = '<div class="toc">\n';

        while ((match = headingRegex.exec(content)) !== null) {
            const level = parseInt(match[1], 10);
            if (level === 1) { // Only h1 for main chapters
                const attrs = match[2];
                let text = match[3].replace(/<[^>]+>/g, '').trim();

                const titleMatch = attrs.match(/data-chapter-title=["']([^"']+)["']/i);
                if (titleMatch && titleMatch[1]) {
                    text = titleMatch[1];
                }

                const idMatch = attrs.match(/id=["']([^"']+)["']/i);
                if (idMatch && idMatch[1]) {
                    tocHtml += `<div class="toc-item"><a href="#${idMatch[1]}"><span>${text}</span></a></div>\n`;
                    if (titleMatch && titleMatch[1]) {
                        slugToIdMap[titleMatch[1]] = idMatch[1];
                    }
                }
            }
        }
        tocHtml += '</div>\n';

        // Find the "Table of Content" heading block entirely
        const tocContainerRegex = /(<div class="contentContainer)("?[^>]*>)\s*(<h3[^>]*>Table of Content<\/h3>)([\s\S]*?)(<\/div>)/i;
        const tocMatch = content.match(tocContainerRegex);

        if (tocMatch && tocMatch[4].includes('<ul')) {
            let tocContent = tocMatch[4];

            // 1. Transform internal links to point to anchor IDs
            tocContent = tocContent.replace(/<a\s+([^>]*href=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi, (aMatch, attrs, href, linkText) => {
                if (href && !href.startsWith('#') && !/^(https?:)?\/\//.test(href)) {
                    let slug = decodeURIComponent(href).replace(/^\/?\.\//, '').replace(/\/$/, '');
                    if (slugToIdMap[slug]) {
                        return `<a href="#${slugToIdMap[slug]}"><span>${linkText.replace(/<[^>]+>/g, '').trim()}</span></a>`;
                    }
                }
                return aMatch;
            });

            // 2. Change <ul>/<li> to <div class="toc">/<div class="toc-item">
            tocContent = tocContent.replace(/<ul[^>]*>/gi, '<div class="toc">');
            tocContent = tocContent.replace(/<\/ul>/gi, '</div>');
            tocContent = tocContent.replace(/<li[^>]*>/gi, '<div class="toc-item">');
            tocContent = tocContent.replace(/<\/li>/gi, '</div>');

            if (content.match(/id=["']link-directory["']/i)) {
                tocContent += `\n<div class="toc" style="margin-top: 1em;">\n<div class="toc-item"><a href="#link-directory"><span>Link Directory</span></a></div>\n</div>\n`;
            }

            const newBlock = `${tocMatch[1]} toc-container" style="break-inside: auto; page-break-inside: auto; box-decoration-break: clone; -webkit-box-decoration-break: clone; padding-top: var(--gapSmall); padding-bottom: var(--gapSmall);">${tocMatch[3]}\n${tocContent}</div>`;

            return content.replace(tocContainerRegex, newBlock);
        } else {
            // Fallback 1: Maybe there's no ul
            const tocRegexNoUl = /(<div class="contentContainer)(">\n?<h3[^>]*>Table of Content<\/h3>)/i;
            if (tocRegexNoUl.test(content)) {
                return content.replace(tocRegexNoUl, `$1 toc-container" style="break-inside: auto; page-break-inside: auto; box-decoration-break: clone; -webkit-box-decoration-break: clone; padding-top: var(--gapSmall); padding-bottom: var(--gapSmall);$2\n${tocHtml}`);
            }

            // Fallback 2: Just insert after the heading
            const tocHeaderRegex = /<h3[^>]*>Table of Content<\/h3>/i;
            const tocHeaderMatch = content.match(tocHeaderRegex);

            if (tocHeaderMatch) {
                const insertPos = tocHeaderMatch.index + tocHeaderMatch[0].length;
                return content.slice(0, insertPos) + '\n' + tocHtml + '\n' + content.slice(insertPos);
            }
        }

        return content;
    });


    eleventyConfig.addFilter("log", (value) => {
        console.log(value);
        // return value;
    });

    eleventyConfig.addFilter("injectAfterH1", function (content, htmlToInject) {
        if (!htmlToInject || typeof htmlToInject !== 'string') return content;

        // Find first heading
        const match = content.match(/<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/i);
        if (match) {
            const insertIndex = match.index + match[0].length;
            return content.slice(0, insertIndex) + htmlToInject + content.slice(insertIndex);
        }
        return htmlToInject + content;
    });

    eleventyConfig.addFilter("mocSidebar", function (content) {
        if (!content) return "";

        let html = content;

        // Paragraphs get the listSection class
        html = html.replace(/<p>/gi, '<p class="listSection">');

        // Nested lists get contentSections class (matching <ol> and <ul> with optional attributes)
        html = html.replace(/<ol([^>]*)>/gi, '<ol class="contentSections"$1>');
        html = html.replace(/<ul([^>]*)>/gi, '<ul class="contentSections"$1>');

        const chevronIcon = `<svg class="i "><use href="/fonts/icons/svg-sprite.svg#choose-item"/></svg>`;

        // All list items get contentLink initially
        html = html.replace(/<li([^>]*)>/gi, `<li class="contentLink"$1>\n${chevronIcon} `);

        // Remove top-level list wrappers (assuming they start at the beginning of a line from markdown-it)
        html = html.replace(/^<(ol|ul) class="contentSections"[^>]*>[\r\n]*/gm, '');
        html = html.replace(/^<\/(ol|ul)>[\r\n]*/gm, '');

        return html;
    });

    eleventyConfig.addFilter("linkClass", (content) => {
        if (typeof content !== 'string') return '';

        // If the content looks like HTML, process all <a> tags inside it
        if (/<[a-z][\s\S]*>/i.test(content)) {
            return content.replace(/<a\s+([^>]*href=["']([^"']*)["']([^>]*))>/gi, (match, body, href) => {
                const isExternal = /^(https?:)?\/\//.test(href);
                let className = isExternal ? 'externalLink' : 'internalLink';
                let extraAttrs = '';
                let isInactive = false;

                if (isExternal) {
                    extraAttrs += ' target="_blank" rel="noopener noreferrer"';
                }

                if (!isExternal && href && !href.startsWith('#')) {
                    let pageName = decodeURIComponent(href).replace(/^\/?\.\//, '').replace(/\/$/, '');
                    if (pageName && pageName !== '/') {
                        const filePathMd = path.join(process.cwd(), 'content', pageName + '.md');
                        const filePathExact = path.join(process.cwd(), 'content', pageName);
                        if (!fs.existsSync(filePathMd) && !fs.existsSync(filePathExact)) {
                            className += ' linkInactive';
                            extraAttrs = ' title="To be Written"';
                            body = body.replace(/href=["'][^"']*["']/i, '');
                            isInactive = true;
                        }
                    }
                }

                if (!isInactive && !/title=["']/i.test(body) && href && !href.startsWith('#')) {
                    extraAttrs += ` title="${href}"`;
                }

                if (/class=["']/i.test(body)) {
                    return `<a ${body.replace(/class=(["'])(.*?)\1/gi, `class=$1$2 ${className}$1`)}${extraAttrs}>`;
                } else {
                    return `<a class="${className}"${extraAttrs} ${body}>`;
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

    const normalizeHref = (href) => {
        if (/^(https?:)?\/\//.test(href)) return href;
        let clean = decodeURIComponent(href);
        clean = clean.replace(/^\/?\.\//, ''); // remove leading ./ or /./
        clean = clean.replace(/^\//, ''); // remove leading /
        clean = clean.replace(/\/$/, ''); // remove trailing /
        clean = clean.replace(/\.html$|\.md$/i, ''); // remove extensions
        return '/' + clean + '/';
    };

    const generateLinkDirectoryHtml = (allLinks, forceClasses = false) => {
        if (allLinks.length === 0) return '';

        const isExternalUrl = (url) => /^(https?:)?\/\//.test(url);
        const externalLinks = allLinks.filter(l => isExternalUrl(l.href));
        const internalLinks = allLinks.filter(l => !isExternalUrl(l.href));

        externalLinks.sort((a, b) => a.text.localeCompare(b.text));
        internalLinks.sort((a, b) => a.text.localeCompare(b.text));

        const renderLinkRow = (l, isExternal) => {
            const linkClass = isExternal ? 'externalLink' : 'internalLink';
            const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
            const inlineStyle = ' style="text-decoration: underline dotted !important;"';

            let displayHref = isExternal ? l.href : l.href.replace(/\//g, '');

            let anchorHtml;
            if (forceClasses) {
                anchorHtml = `<a href="${l.href}" class="${linkClass}"${targetAttr} title="${l.href}"${inlineStyle}>${displayHref}</a>`;
            } else {
                anchorHtml = `<a href="${l.href}"${inlineStyle}>${displayHref}</a>`;
            }

            return `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.5rem; break-inside: avoid; page-break-inside: avoid;">
                <div style="text-align: left; padding-right: 1rem; word-break: break-word;">${l.text}:</div>
                <div style="text-align: left; overflow-wrap: anywhere; min-width: 0;">${anchorHtml}</div>
            </div>\n`;
        };

        let html = `\n<div class="contentContainer print-only-links" style="display: none; break-inside: auto; page-break-inside: auto; box-decoration-break: clone; -webkit-box-decoration-break: clone; padding-top: var(--gapSmall); padding-bottom: var(--gapSmall);">\n<h1 id="link-directory">Link Directory</h1>\n`;

        if (internalLinks.length > 0) {
            html += `<p class="toc-chapter">Internal Links</p>\n<div style="margin-bottom: 1rem;">\n`;
            internalLinks.forEach(l => {
                html += renderLinkRow(l, false);
            });
            html += `</div>\n`;
        }

        if (externalLinks.length > 0) {
            html += `<p class="toc-chapter">External Links</p>\n<div>\n`;
            externalLinks.forEach(l => {
                html += renderLinkRow(l, true);
            });
            html += `</div>\n`;
        }

        html += `</div>\n`;
        return html;
    };

    eleventyConfig.addFilter("contentContainer", function (content, disableLinkDirectory = false) {
        if (typeof content !== 'string') return '';

        const firstHeadingMatch = content.match(/<h[1-3]\b|<hr\b/i);

        let prefix = '';
        let rest = content;

        if (firstHeadingMatch && firstHeadingMatch.index > 0) {
            prefix = content.substring(0, firstHeadingMatch.index);
            rest = content.substring(firstHeadingMatch.index);
        } else if (!firstHeadingMatch) {
            prefix = content;
            rest = '';
        }

        const allLinks = [];

        const extractLinks = (htmlBlock) => {
            const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
            let match;
            while ((match = linkRegex.exec(htmlBlock)) !== null) {
                const originalHref = match[1];
                const text = match[2].replace(/<[^>]+>/g, '').trim();
                if (originalHref && !originalHref.startsWith('#') && text) {
                    const href = normalizeHref(originalHref);
                    if (!allLinks.find(l => l.href === href)) {
                        allLinks.push({ href, text });
                    }
                }
            }
        };

        let result = '';
        if (prefix.trim() !== '') {
            extractLinks(prefix);
            result += `<div class="contentContainer">\n${prefix}\n</div>\n`;
        }

        if (rest.trim() !== '') {
            result += rest.replace(/(<h[1-3]\b[^>]*>[\s\S]*?<\/h[1-3]>|<hr\b[^>]*>)([\s\S]*?)(?=<h[1-3]\b|<hr\b|$)/gi, (match, heading, innerContent) => {
                let block = heading + '\n' + innerContent;
                extractLinks(block);
                return `<div class="contentContainer">\n${block}\n</div>`;
            });
        }

        if (!disableLinkDirectory) {
            result += generateLinkDirectoryHtml(allLinks, false);
        }

        return result;
    });

    eleventyConfig.addFilter("appendLinkDirectory", function (content) {
        if (typeof content !== 'string') return content;

        const allLinks = [];
        const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
            const originalHref = match[1];
            const text = match[2].replace(/<[^>]+>/g, '').trim();
            if (originalHref && !originalHref.startsWith('#') && text) {
                const href = normalizeHref(originalHref);
                if (!allLinks.find(l => l.href === href)) {
                    allLinks.push({ href, text });
                }
            }
        }

        return content + `\n<article class="book-chapter">\n` + generateLinkDirectoryHtml(allLinks, true) + `\n</article>\n`;
    });

    eleventyConfig.addFilter("generateLinkDataJSON", function (allCollection, backlinksMap) {
        const linkData = [];
        allCollection.forEach(item => {
            if (!item.url || !item.inputPath.endsWith('.md')) return;
            if (item.data.tags && item.data.tags.includes('private')) return;

            const name = item.fileSlug || 'index';

            // Backlinks: who links TO this item
            const itemBacklinks = backlinksMap[item.url] || [];
            const backlinksNames = itemBacklinks.map(bl => {
                const sourceItem = allCollection.find(i => i.url === bl.url);
                return sourceItem ? (sourceItem.fileSlug || 'index') : bl.url;
            });

            // Internal Links: who this item links TO
            const internalLinksNames = [];
            allCollection.forEach(targetItem => {
                if (targetItem.url === item.url) return;
                const targetBacklinks = backlinksMap[targetItem.url] || [];
                if (targetBacklinks.some(bl => bl.url === item.url)) {
                    internalLinksNames.push(targetItem.fileSlug || 'index');
                }
            });

            linkData.push({
                id: name,
                title: item.data.title || name,
                url: item.url,
                tags: item.data.tags || [],
                backlinks: backlinksNames,
                internalLinks: internalLinksNames
            });
        });
        return JSON.stringify(linkData, null, 2);
    });

    eleventyConfig.addFilter("cleanTags", function (content) {
        if (typeof content !== 'string') return content;
        return content.replace(/-/g, ' ');
    });

    eleventyConfig.addFilter("sortTagsByCount", function (collections) {
        let tagsArray = [];
        for (let tag in collections) {
            if (tag !== "all" && tag !== "post" && tag !== "posts" && tag !== "moc" && tag !== "mocs" && tag !== "private" && tag !== "book" && tag !== "Book") {
                if (collections[tag].length > 0) {
                    tagsArray.push({ tag: tag, posts: collections[tag] });
                }
            }
        }
        tagsArray.sort((a, b) => b.posts.length - a.posts.length);
        return tagsArray;
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
