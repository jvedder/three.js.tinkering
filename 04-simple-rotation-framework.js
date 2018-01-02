var container, camera, scene, light, renderer;
var camera_spherical;

init();
draw();
animate();

function init() {
    init_renderer();
    init_container();
    init_camera();
    init_scene();
    init_light();
    init_events();
}

function draw() {
    draw_axes();
    draw_model();
}

function init_renderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function init_container() {
    container = document.getElementById("container");
    container.appendChild(renderer.domElement);
    //document.body.appendChild(renderer.domElement);
}

function init_camera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    // camera.position.set(10, 10, 100);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));

    // initialize the campera's position
    camera_spherical = new THREE.Spherical(100, Math.PI / 2, 0);
    move_camera();
}

function init_scene() {
    scene = new THREE.Scene();
}

function init_light() {
    scene.add(new THREE.AmbientLight(0x555555));
    light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 500, 2000);
    scene.add(light);   
}

function init_events() {
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onMouseScroll);
}

function move_camera(){
    camera.position.setFromSpherical(camera_spherical);
    camera.lookAt(0,0,0);    
}


function draw_axes() {
    var material, geometry, line;

    // Red X-Axis
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(10, 0, 0));
    material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    line = new THREE.Line(geometry, material);
    scene.add(line);

    // Green Y-Axis
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 10, 0));
    material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    line = new THREE.Line(geometry, material);
    scene.add(line);


    // Blue Z-Axis
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 10));
    material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    line = new THREE.Line(geometry, material);
    scene.add(line);
}

function draw_model() {
    var material, geometry, cube, cylinder;

    // geometry = new THREE.BoxGeometry( 5, 5, 5 );
    // geometry.translate(2.5, 2.5, 2.5);
    // material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // cube = new THREE.Mesh( geometry, material );
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

    cylinder = new THREE.Mesh( geometry, material );
    scene.add( cylinder );
}


function animate () {
    //alert("Hello");
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
};

function onMouseMove(e) {

    // mouse position scaled to 0.0 to 1.0 of window
    var mouse_x = e.clientX / window.innerWidth;
    var mouse_y = e.clientY / window.innerHeight;

    // NOTE: Mouse movements are inverted here.  For example, move the 
    // camera down to make the model appear to rotate up, etc. 

    // latitude: pi (mouse at top) to 0 (mouse at bottom) 
    camera_spherical.phi = (1 - mouse_y) * Math.PI; 

    // longitude: +pi (mouse at left) to -pi (mouse at right)
    camera_spherical.theta = (1 - (2*mouse_x)) * Math.PI;

    move_camera();
    show_camera_postion();

    renderer.render(scene, camera);
}

function onMouseScroll(e) {
    var scroll_amount = e.deltaY;
    var scroll_speed = 0.01;
    var radius = camera_spherical.radius * (1 + (scroll_speed * scroll_amount));
    if (radius < 10) radius = 10;
    if (radius > 10000) radius = 10000;
    camera_spherical.radius = radius;

    move_camera();
    show_camera_postion();

    renderer.render(scene, camera);
};

function onCommandKeyDown(e) 
{
};

function show_camera_postion() {
    // show long/lat in degrees, not radians
    document.getElementById('camera-radius').textContent = (camera_spherical.radius).toFixed(2);
    document.getElementById('camera-lat').textContent = (camera_spherical.phi * 180 / Math.PI).toFixed(2);
    document.getElementById('camera-long').textContent = (camera_spherical.theta * 180 / Math.PI).toFixed(2);

    //Show (x,y,z) of camera
    document.getElementById('camera-x').textContent = camera.position.x.toFixed(2);
    document.getElementById('camera-y').textContent = camera.position.y.toFixed(2);
    document.getElementById('camera-z').textContent = camera.position.z.toFixed(2);    
}