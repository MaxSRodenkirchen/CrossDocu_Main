---
tags:
  - CrossDocu
---
# Writing Conventions in CrossDocu

Monday, July 20th 2026

H1-Elements are Titles 
H2-Elements are Subtitles
H3-Elements are Chapters

Regular **Bold** *Italic*

- unordered
- lists

1. ordered
2. lists

Try to keep the original URL of an internal link: [[This Gardens System]]
Try to not use long URLs from external links. Instead embed them: [Max Rodenkirchen](https://linktree.max-rodenkirchen.de/)  

You can use images from the images folder:

![[CrossDocu_Grafik.png]]

For videos and other interactive media use the respective embeds:

<iframe width="560" height="315" src="https://www.youtube.com/embed/zIM1DPUw8jU?si=ANaAmKeXc15lSiq2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<iframe src="https://editor.p5js.org/MaxRodenkirchen/full/kB4i3pS0X" width="100%" height="100%" style="border: none;"></iframe>



**Only for the above mentioned Markdown formats CSS styling exists!**  

### Future Syntax

Complex writing conventions such as callouts should be optional for more advanced CrossDocu users. There should be a default mode which works fine. 

**Comment out long Textblocks**
From the TLDR-concept (too long don't read). That way longer text passages will be styled differently, or to get mod-notes in slides view.

Every native [Obsidian Syntax](https://obsidian.md/help/syntax) should be implemented in CrossDocu.


**Levels of Formatting**
Level 1 – Page Level: YAML Frontmatter
Level 2 – Block Level: Obsidian Callouts as Layout Containers
Level 3 – Element Level: Alt Text Conventions for Images
