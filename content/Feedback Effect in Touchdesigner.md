---
tags:
state:
  - "0"
type:
publish:
  - public
---
# Quick Feedback Effect in Touchdesigner

#### Feedback loops are simple yet very attractive. This technique offers a wide range of options for creating impressive effects.

![[simpleFeedback-inTd.png]]



**Needed Operators:**
- A source TOP (e.g. a rectangle) 
- Feedback
- Composite
- Some adjustments (e.g. a transform)

**Routing**
1. Rectangle > Composite 
2. Rectangle > Feedback > Transform > Composite
3. *shift+drag* Composite >  Feedback 

This was made following along this 5-minute tutorial:
[Creating a Feedback - Videotutorial](https://learn.derivative.ca/courses/100-fundamentals/lessons/102-tops-working-with-images/topic/creating-a-feedback/)