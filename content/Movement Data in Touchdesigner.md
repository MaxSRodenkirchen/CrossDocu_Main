---
tags:
  - Body-Movement-Data
  - Learning-TouchDesigner
---
# Body Controls - Movement Data in Touchdesigner
#### How can we use movement data from the webcam to control parameters in Touchdesigner?


### 2026-06-02

Starting point was this very fast-paced tutorial for using the webcam input. Unfortunately the tutorial stops before they use that data. But there are definitely ways to get that data into single channels (which represent values over time). First tests are made at the end of the operator chain. So far no success, but it's on the way to get there. 

[Easy movement detection](https://www.youtube.com/watch?v=FThxsRnnXl0)  (Touchdesigner tutorial) by "noones img"

There is a more simple way to achieve a similar result. And this tutorial explains it way better. 
[Tracking motion without a Kinect](https://www.youtube.com/watch?v=HIn2IBBhxXk&t=31s)

Under the second video **v.rtx_void** comments: 
*I really like that approach, but unfortunately it only works with white skin and bright colored or white clothes. However you could use Math TOP's for limiting and normalizing instead of Level TOP's, and also adding some feedback at the end of the chain is improving this a little :)*
	

![[capturingMovementWebcam_Touchdesigner.png]]