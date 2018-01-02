var lines = [];

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
var container = document.getElementById("container");
container.appendChild(renderer.domElement);
//document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(10, 10, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var scene = new THREE.Scene();

scene.add(new THREE.AmbientLight(0x555555));
var light = new THREE.SpotLight(0xffffff, 1.5);
light.position.set(0, 500, 2000);
scene.add(light);   


var material, geometry, line;

// Red X-Axis
geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(0, 0, 0));
geometry.vertices.push(new THREE.Vector3(10, 0, 0));
material = new THREE.LineBasicMaterial({ color: 0xff0000 });
line = new THREE.Line(geometry, material);
scene.add(line);
lines.push(line);

// Green Y-Axis
geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(0, 0, 0));
geometry.vertices.push(new THREE.Vector3(0, 10, 0));
material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
line = new THREE.Line(geometry, material);
scene.add(line);
lines.push(line);


// Blue Z-Axis
geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(0, 0, 0));
geometry.vertices.push(new THREE.Vector3(0, 0, 10));
material = new THREE.LineBasicMaterial({ color: 0x0000ff });
line = new THREE.Line(geometry, material);
scene.add(line);
lines.push(line);

// geometry = new THREE.BoxGeometry( 5, 5, 5 );
// geometry.translate(2.5, 2.5, 2.5);
// material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

geometry = new THREE.CylinderGeometry( 2.5, 2.5, 5, 64 );
//geometry.translate(5, 5, 5);
//material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
material = new THREE.MeshPhongMaterial({
    color: 0xffff00,
    flatShading: true,
    vertexColors: THREE.VertexColors,
    shininess: 0
});

var cylinder = new THREE.Mesh( geometry, material );
scene.add( cylinder );


renderer.render(scene, camera);

renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('wheel', onMouseScroll);

var command = document.getElementById("command");
document.addEventListener("keydown", onCommandKeyDown, false);




function animate () {
    //alert("Hello");
    requestAnimationFrame( animate );

    // for (l of lines)
    // {
    //     l.rotation.x += 0.1;
    //     l.rotation.y += 0.1;    
    // }

    renderer.render(scene, camera);
};

animate();


function onMouseMove(e) {

    // mouse position scaled to 0.0 to 1.0 of window
    var mouse_x = e.clientX / window.innerWidth;
    var mouse_y = e.clientY / window.innerHeight;

    // latitude: pi (mouse at top) to 0 (mouse at bottom) 
    var phi = (1 - mouse_y) * Math.PI; 

    // longitude: +pi (mouse at left) to -pi (mouse at right)
    var theta = (1 - (2*mouse_x)) * Math.PI;


    // position camera at latitude / longitude
    var s = new THREE.Spherical(100, phi, theta);
    camera.position.setFromSpherical(s);
    camera.lookAt(0,0,0);

    // var rotation_amount = 0.1;
    // for (l of lines)
    // {
    //     l.rotation.x += mouse_y * rotation_amount;
    //     l.rotation.y += mouse_x * rotation_amount;
    // }

    // var move_x = document.getElementById('move-x');
    // var move_y = document.getElementById('move-y');   
    // var move_z = document.getElementById('move-z');   
    // move_x.textContent = phi * 180 / Math.PI;
    // move_y.textContent = theta  * 180 / Math.PI;
    // move_y.textContent = theta  * 180 / Math.PI;

    // show long/lat in degrees, not radians
    document.getElementById('lat').textContent = (phi * 180 / Math.PI).toFixed(2);
    document.getElementById('long').textContent = (theta * 180 / Math.PI).toFixed(2);

    //Show (x,y,z) of camera
    document.getElementById('move-x').textContent = camera.position.x.toFixed(2);
    document.getElementById('move-y').textContent = camera.position.y.toFixed(2);
    document.getElementById('move-z').textContent = camera.position.z.toFixed(2);

    renderer.render(scene, camera);
}

function onMouseScroll(e) {
    var deltaY = e.deltaY;

    var scroll = document.getElementById('scroll');

    scroll.textContent = deltaY;

    // var e = window.event || e;
    // var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail || -e.deltaY)));
    // var scale_amount = 0.1;
    // for (l of lines)
    //  {
    //     l.scale.x *= (1 + scale_amount * delta);
    //     l.scale.y *= (1 + scale_amount * delta);
    //     l.scale.z *= (1 + scale_amount * delta);
    // }
};

function onCommandKeyDown(e) 
{
    var keyCode = e.keyCode;
    //alert(keyCode);
    return false;
};