# Reddit-Visualizer
A p5js project that visualizes various reddit data in a 3D point array.

![Imgur](https://i.imgur.com/eEJkZ4h.png)

The project does not use any external libraries to render the 3D graphics. 
This is done using just a couple trig tricks to cirumvent complex frustum rendering.
If you would like to know specifically how this is done, go to the Point class within sketch.js.
The function "calcScreenPos" turns the point's 3D coordinates into 2D coordinates on 
the screen using the width and height of the screen as well as the angle of your field of view.
