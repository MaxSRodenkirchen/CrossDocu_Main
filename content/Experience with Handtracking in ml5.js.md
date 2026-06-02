---
tags:
  - CreativeCoding
  - AI
state:
  - "9"
type:
publish:
  - public
---
# Experiences and issues using the HandPose model in ml5.js

Following questions lead into testing ml5.js:
**Can you build an Interface that gets controlled by the users webcam input? Does ml5.js and their hand-tracking model work for that?**

<iframe src="https://archive.org/embed/experience-with-the-hand-pose-model-in-ml-5" width="100%" height="100%" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>

### Test: Building a small UI controlled by users finger tips 👆

1. Webcam input gets loaded into p5.js
2. Webcam gets send to ml5.js 
3. ml5.js returns Object with position data of points on your hands
4. take only the finger tip x and y position
5. check if those positions are in between the ui fields
6. if so change their color (or do anything else 🙂)

### Issue 1: Camera takes seconds to load

This is acceptable for Installations that get started once, but if you implement this in a web page users will need to wait. I am not sure why that is. I have tried to constrain the video input in its dimensions and framerate but that didn't change much. 

  `let constraints = {`
    `video: {`
      `width: { min: 640, ideal: 640 },`
      `height: { min: 480, ideal: 480 },`
      `frameRate: { max: 25 },`
    `}`
  `};`
  
Is it p5.js or is it a problem with some WebAPI?

### Issue 2: Performance issues with the tfjs model

There were **strong performance issues with the tfjs model.** First of all it took a long time to load and it was also stuttering. It was tested on a good Laptop and an even better PC with the same results. This is strange, because in Video tutorials it seams to work for people. Using the models live demo also works fine. But why doesn't it in this test with p5.js and ml5.js? [^1]

[Live demo for Tensorflow](https://storage.googleapis.com/tfjs-models/demos/hand-pose-detection/index.html?model=mediapipe_hands)

#### Finding Solutions

What helped was changing the runtime model to the older **mediapipe** [^2] and switching from full to light mode. Light mode runs a smaller version of the model which is enough for just tracking a finger tip. And also the mediapipe model returned much more satisfactory results. It loads much quicker and has no stuttering. Sometimes it does detect other parts of the hand as a finger tip and glitches. This is most probably because it is an older and less trained model. In the end mediapipe did the job with acceptable performance and just some glitching. 


`let options = {`
  `maxHands: 2,`
  `flipped: true,`
  `runtime: "mediapipe",
  `modelType: "lite",`
`};`

---

*2026-05-31* 
My first impression is that it technically works, but the AI tracking seams to be really slow. With such delays it's kind of not usable. I will research on methods to speed up the ml5.js processes. Maybe we can run it locally?    

---

[^1]: More info on options [here](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection/src/tfjs#create-a-detector) for "tfjs" runtime.

[^2]: More info on options [here](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection/src/mediapipe#create-a-detector) for "mediapipe" runtime.
