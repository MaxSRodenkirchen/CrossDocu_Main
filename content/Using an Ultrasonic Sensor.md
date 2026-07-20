---
tags:
  - Physical-Computing
  - Multimedia-Installation
---

# Using a Ultrasonic Sensor 1PC with an Arduino

After setting up a [[Arduino Motor Control]] for the [[Installation for Exhibition]] the question was how to control the motors rotation manually. An ultrasonic sensor measures distances and can therefore function as a type of controller or input device.

### Setting Up

Setting up the sensor on its own was pretty straight forward. [This video tutorial](https://www.youtube.com/watch?v=n-gJ00GTsNg) explains how to setup the sensor. Problems came up when trying to combine the sensor's logic with that of the motor. The problem is that the program codes have delays of different lengths in the loop. This means that the motor has to wait until the sensor’s logic has run through again. What we actually want is for these two logic sequences to run in parallel, but that’s not really possible with the single core on the Arduino.

### Solution

The solution for that is to not use global delays in the loop. Instead we use timing. We just say: If that amount of time has past, then... For that we use a time variable like millis() subtract it with the last timestamp and ask if its bigger than the wanted delay / interval. In our code it looks like this:

if (millis() - letzteSensorMessung >= sensorIntervall) {}


### The Code

This is the combined code where the Ultrasonic sensor is controlling the rotation speed of the motor. (It is actually controlling the timing of the motors logic)
<iframe src="https://app.arduino.cc/sketches/fa8c8330-f8ed-4e55-8a4f-b5c0fc89606b?view-mode=embed" style="height:510px;width:100%;margin:10px 0" border=0></iframe>