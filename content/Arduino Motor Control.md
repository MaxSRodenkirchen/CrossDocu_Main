---
tags:
  - Physical-Computing
  - Multimedia-Installation
---
# Controlling a Stepper Motor With an Arduino

This was tested for the [[Installation for Exhibition]] to bring a slight rotation onto a prism. With some minimal prior knowledge from the [[Arduino Beginners Workshop]] it took about **less than one hour** to make this work. 
### Motor connected to a 3D printed adapter

![[Arduino Prism.jpeg]]

![[Arduino Set Up.jpeg]]

The components were rendered, 3D printed and laser cutted by [Markus Bartz](https://www.instagram.com/makkes.mukke/).

### Why would you use an Arduino for that?

That's a valid question, because the same thing could be achieved with a regular motor and a simple electrical circuit. The advantage is that you can now control the motor's rotation using additional sensors via the Arduino. For example, you could now control the rotation using an ultrasonic sensor, or write a generative, randomization algorithm for the rotation. 

### Circuit Diagram for 28BYJ-48 Stepper Motor with Arduino

Main components used
1. 28BYJ-48 stepper motor
2. ULN2003 driver board
3. Arduino Uno Rev3

![Circuit Diagram ](https://diyprojectslabs.com/wp-content/uploads/2022/05/28BYJ-48-Stepper-Motor-With-Arduino-Using-ULN2003-Driver-e1654420962464.jpg)

Read more about how this motor works and how to set it up here: 
[28BYJ-48 Stepper Motor With Arduino Using ULN2003 Driver](https://diyprojectslabs.com/28byj-48-stepper-motor-with-arduino/)
