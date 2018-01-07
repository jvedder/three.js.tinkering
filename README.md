### three.js.tinkering
Started tinkering with the [THREE.js](https://threejs.org/) framework. Ended up rendering a black iron pipe shelf to 
visualize the proportions before building it.

Rotation is accomplished by moving the camera.  The (x,y) position of the mouse on the HTML view port is mapped to the
(longitude, latitude) on a sphere.  The camera is postioned there and pointed at the origin.  This allows up/down rotation +/-90 degrees 
to the top/bottom and +/-180 degrees in left/right to see the modeled object from all sides.  One footnote is that the polarity of x and
y are swapped: move the camera down to make model appear to rotate up, etc.

One side effect of using a spehere is that the geometric center of the model must be at the origin to make the rotation appear correct.

The mouse scroll wheel sets the diameter of the camera's sphere, which is effectively the zoom.

The model orientation is the x-y plane is the screen (x to right, y is up) while z is out of the screen towards the viewer (right-hand rule).  
The displayed axes colors are: (x,y,z) = (Red,Green,Blue).
