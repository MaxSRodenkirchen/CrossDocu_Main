---
title: Backlinks
tags:
  - CrossDocu
  - AI-Techniques
---

# Backlinks in Eleventy

**Attention! This is a AI written documentation for a techniqual pattern created by Gemini 3.1 Pro (High).**

In our custom CrossDocu setup, we implemented a robust, native solution to generate backlinks (or "Linked Mentions") without relying on external plugins. This guarantees full control over how links are parsed and ensures compatibility with Obsidian-style Wikilinks (`[[Link]]`).

## How it works

The core of our backlink logic resides in `eleventy.config.js` via a custom Eleventy Collection called `backlinksMap`.

### 1. Global Scanning before Rendering

Before Eleventy renders any page, the `backlinksMap` collection iterates through every single markdown file in the project. It extracts the raw Markdown content (`rawInput`) from each file.

### 2. Preventing False Positives

To ensure we only find actual links and not code examples, the script first strips out all code blocks from the raw text. This prevents false positives when documenting code or explaining how to write links.

### 3. Regex Pattern Matching

For every file, we check if its filename (`fileSlug`) appears as a link in the raw text of *other* files. We use a case-insensitive Regular Expression (Regex) that looks for two types of links:

- **Wikilinks:** `[[Page Name]]` or `[[Page Name | Alias]]`
- **Standard Markdown Links:** `[Alias](Page Name.md)` or `[Alias](./Page Name)`

The regex is designed to be highly flexible, allowing for optional whitespace around the page names to catch variations like `[[ Page Name | Alias ]]`.

### 4. Creating the Map

If a match is found, the linking page's URL and title are added to a central "Map" (a JavaScript object). This map uses the target page's URL as the key, and stores an array of all pages that link to it.

### 5. UI Rendering

Finally, during the rendering phase, the `base.njk` layout includes a Nunjucks partial (`metaData.njk`). This partial checks if the current page's URL exists in our pre-calculated `backlinksMap`. If it does, it dynamically generates an HTML list of "Linked Mentions" and injects it right below the main `<h1>` title using a custom Nunjucks filter (`injectAfterH1`).
