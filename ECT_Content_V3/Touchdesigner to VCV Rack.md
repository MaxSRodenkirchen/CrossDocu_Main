---
tags:
  - Audio-Synthesis
  - Multimedia-Installation
  - Learning-TouchDesigner
  - Alternative-Interfaces
---
# TouchDesigner to VCV Rack

How can we control the software synthesizer [[VCV Rack]] via inputs coming from TouchDesigner?  

There are multiple options to do this. One very good way for sending data from TouchDesigner to VCV Rack is by using **[OSC (Open Sound Control)](https://en.wikipedia.org/wiki/Open_Sound_Control)** which is a protocol made for sending data between electronic devices, especially electronic instruments. It actually works over the local network which enables connecting devices wireless. Following this YouTube tutorial it took less than one hour to make it work: [TouchDesigner / VCV Rack OSC Communication](https://www.youtube.com/watch?v=_2bgXrMPRxc). 

### Set Up

Basically you need only two things:

1. The OSC Out Chop in TouchDesigner
2. An OSC module in VCV Rack (cvOSCcv for example)

Then just check that you are on the same port and that channel names are matching.