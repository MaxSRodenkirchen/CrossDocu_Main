---
tags:
  - Creative-Coding
state:
  - "9"
type:
  - Explaining
  - Teaching
publish:
  - public
---

# Introduction to Creative Coding with p5.js

This presentation is part of an **introduction into p5.js and Creative Coding** for fellow students at FH Aachen in June 2026. The workshop was conducted in German and later translated into English.
## Previous Experience

Who has done Creative Coding before?
What might have held you back?

## What I’d like to show you

- Provide an overview of the field
- Why programming is fun
- What you / we can do with it

## Creative Coding

- Understanding technical programming as a creative practice
- Embrace the Process - compared to using AI
- Engaging with technologies

- Using different programming languages and tools
- Depending on what you want to do


## Showcase

- [WestBam - Monkey Say, Monkey Do](https://www.youtube.com/watch?v=w-egxgmM7Cs&list=PLIZ01VQ6n_lzbQEstI-lFTmeLI8e1U2zJ&index=27) *Frühe Computergrafik*
- [Waldemar Cordeiro, A Mulher que não ê B.B., 1971](https://zkm.de/en/artworks/a-mulher-que-nao-e-bb) Das ZKM Archiv bietet noch mehr!
- [Farbrausch - fr-025: the.popular.demo ](https://www.youtube.com/watch?v=YBpo5GHcmsE&list=RDYBpo5GHcmsE&start_radio=1) Demoszene
- [Land Lines](https://lines.chromeexperiments.com/)
- [I made maps that show time instead of space](https://www.youtube.com/watch?v=rC2VQ-oyDG0&list=PLIZ01VQ6n_ly_7Astt4BhuPCstYi3sX2P&index=47)
- [Spacetime maps](https://maps.vvolhejn.com/?ref=youtube)
- [cablesCircleText](https://cables.gl/p/cYb19E)
- [Cables Patches - Top of the Month](https://cables.gl/patches#topMonth)
- [Zach Liebermann](http://zach.li/)
- [NIKE - Paint with your feet](https://www.yesyesno.com/nike-collab-paint-with-your-feet/)
- [eCLOUD](https://www.behance.net/gallery/1515727/eCLOUD?locale=de_DE)
- [Evolving Logo by Michael Schmitz](https://interaktivegestaltung.net/evolving-logo-2/)
- [Genotyp 2 by Michael Schmitz](https://interaktivegestaltung.net/genotyp2/)
- [Gradient Truchet ](https://openprocessing.org/sketch/2518786)
- [Tidal Cycle first test](https://www.youtube.com/watch?v=HZUgYgjIi6Y&list=PLIZ01VQ6n_lzbQEstI-lFTmeLI8e1U2zJ&index=9)
- [Insomina - Node-based Music](https://www.youtube.com/watch?v=yp3PnQMM3rA&list=PLIZ01VQ6n_lzbQEstI-lFTmeLI8e1U2zJ&index=8)
- [Pure Data algorithmic IDM](https://www.youtube.com/watch?v=n9C58n7FC5c&list=RDn9C58n7FC5c&start_radio=1&pp=oAcB)
- [DJ_Dave & Char Stiles Livecoding Performance @ Algowave Algorave](https://www.youtube.com/watch?v=7qfCeIgtllY&list=RD7qfCeIgtllY&start_radio=1&t=248s)
- [Algorave at Iterations 2025](https://www.youtube.com/watch?v=AJakiTK5Z-I)
- [Flor de Fuego - Live A/V](https://www.youtube.com/watch?v=Qrv0QDWdfDY&list=RDQrv0QDWdfDY&start_radio=1)
- [Coding Trance Music from Scratch (Again )](https://www.youtube.com/watch?v=iu5rnQkfO6M)
- ...


## Tools

### Node-based Programming

- [Touchdesigner - Multimedia Installationen](https://derivative.ca/showcase)
- [Cables - Web-based Multimedia](https://cables.gl/patches#topMonth)
- [Max DSP - Musik](https://www.youtube.com/watch?v=auj4406RPQw&list=RDauj4406RPQw&start_radio=1)
- [Pure Data - music](https://www.youtube.com/watch?v=yp3PnQMM3rA&list=PLIZ01VQ6n_lzbQEstI-lFTmeLI8e1U2zJ&index=8)
- ...

### Coding with code?!

- [p5.js](https://p5js.org/examples/)
- [Processing](https://processing.org/examples/)
- [d3.js - Datenvisualisierungen](https://d3js.org/)
- ...

### Live coding

- [Hydra - Visuals](https://hydra.ojack.xyz/?sketch_id=rangga_4)
- [Tidal Cycles - Music](https://www.youtube.com/watch?v=HZUgYgjIi6Y&list=PLIZ01VQ6n_lzbQEstI-lFTmeLI8e1U2zJ&index=9)
- [Strudel - Music](https://www.youtube.com/watch?v=KWIotFWVOi4&list=PLaA8NIuqRmKFYwM4eceWCcyjOEYoT7cFA)
- [P5LIVE](https://www.youtube.com/watch?v=bF8ybSVDUKM&t=754s)
- ...

## What is p5.js?

- Successor to Processing (Java)
- Still maintained by the Processing Foundation
- Now based on JavaScript
- Web-based, runs in the browser
- This makes it much more accessible
- Compatible with other JavaScript libraries (d3.js, ml5.js)
- p5.js Editor = Its own web-based development environment
- For larger projects, be sure to work in VS Code or similar
 
## Exercise 1: The Editor and Basic p5.js Functions

**Clean p5.js Editor but with SVG-Export:** 
A good place to start if you want vector graphics! Otherwise, SVG export isn't supported natively.
[Clean SVG Editor](https://editor.p5js.org/MaxRodenkirchen/sketches/3p51ODyP_)

How is the editor structured, and how does p5.js work?
- Setup
- Draw
- Canvas
- File structure
- Shape using (mouseX and mouseY)

We create SVGs after sorting them and load them into the image raster
- Coordinate system
- Create shape
- Colors

- [Tool for image rastering in p5.js](https://editor.p5js.org/MaxRodenkirchen/full/SvzL0yFP2)
- [Image raster by Linda](https://editor.p5js.org/infovisAA/sketches/eNDSPuX3y)

## Exercise 2: More Complex Shapes

**Create forms for the L-Tree**
Use the prepared editor, change "Vorlage" images, and hide them for export

- [Editor for creating templates for the branches in the Fractal Tool ](https://editor.p5js.org/MaxRodenkirchen/sketches/erjxztiEy)

*For some reason there are some gaps between SVGs in Firefox.*
- [L-Tree / Fractal Tool](https://editor.p5js.org/MaxRodenkirchen/full/r7Uk1zHQN)


## Exercise 3: Animation

**Introduction into some p5.js functions that can be used for animating.** See them in use in the example-sketch. 

**Loop Animation Example**

<iframe src="https://archive.org/embed/beispiel-funktionen-animation-loop" width="100%" height="100%" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>


I've put together a sketch that summarizes all the features shown today. You could experiment with different colors, shapes, or line thicknesses. I've also included some brief explanations.

https://editor.p5js.org/MaxRodenkirchen/sketches/UekJ1KBvX


## Good learning resources for p5.js

Good learning resources include:
- [https://p5js.org/reference/]() 
  The p5.js documentation — The website also features tutorials and examples
- [https://thecodingtrain.com/]() A really funny guy—my go-to resource and a must-try!
- [https://natureofcode.com/ ]()
- [https://trcc.timrodenbroeker.de/]() I’m not sure how much of it is free
- [http://www.generative-gestaltung.de/ ]()
- [https://stigmollerhansen.dk/resume/learning-creative-coding/]() I haven’t read this one myself yet. The Book is available for free digitally!