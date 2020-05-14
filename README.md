# Reddit-Visualizer
A p5js project that visualizes my last 100 reddit posts that I liked in a 3D point array. Each point represents one subreddit, and the distance from the center is determined by the number of posts I liked from that subreddit.

![Imgur](https://i.imgur.com/eEJkZ4h.png)

The project does not use any external libraries to render the 3D graphics. 
This is done using just a couple trig tricks to cirumvent complex frustum rendering.
If you would like to know specifically how this is done, go to the Point class within sketch.js.
The function "calcScreenPos" turns the point's 3D coordinates into 2D coordinates on 
the screen using the width and height of the screen as well as the angle of your field of view.

The default position of the points are as close to an equidistributed surface of a sphere as possible. There are a few options for this such as using a polyhedron with the desired vertex count https://en.wikipedia.org/wiki/Rhombic_triacontahedron or various other methods as described here: https://www.maths.unsw.edu.au/about/distributing-points-sphere and https://www.cmu.edu/biolphys/deserno/pdf/sphere_equi.pdf. I chose to go a quick route and use a built in function in Mathematica and export the coordinates. Automating this shouldn't be too difficult however if you can wrap your head around the math (which after a few minutes of reading I decided wasn't worth my time for now). 
