var container, camera, scene, light, renderer;
var camera_spherical;

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
    draw_model2();
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
    camera_spherical = new THREE.Spherical(12, Math.PI / 2, 0);
    move_camera();
}

function init_scene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);
}

function init_light() {
    scene.add(new THREE.AmbientLight(0x808080));
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


var pipe_material = new THREE.MeshPhongMaterial({
        color: 0x222222,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
    });

var wood_material = new THREE.MeshPhongMaterial({
        color: 0x835C3B,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0.5
    });

var metal_material = new THREE.MeshPhongMaterial({
        color: 0x808080,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0.5
    });

function draw_model() {
    var material, geometry, cube, cylinder;

    var height = -30;

    draw_legs(height,16);
    draw_cross_bars(height + 4);
    height += 16;
    draw_plywood(height);
    height += 0.75;

    draw_legs(height,16);
    draw_cross_bars(height + 4);
    height += 16;
    draw_plywood(height);
    height += 0.75;

    draw_legs(height,12);
    height += 12;
    draw_plywood(height);
    height += 0.75;

    draw_legs(height,10);
    height += 10;
    draw_plywood(height);
    height += 0.75;
}

function draw_legs(y, length) {
    draw_leg(-22, y, -6, length);
    draw_leg(-22, y,  6, length);
    draw_leg( 22, y, -6, length);
    draw_leg( 22, y,  6, length);
}

function draw_cross_bars(height) {
    draw_tee_y(-22, height, -6, false);
    draw_tee_y(-22, height,  6, true);
    draw_tee_y( 22, height, -6, false);
    draw_tee_y( 22, height,  6, true);

    draw_pipe_z(-22, height+(3.5/2), 0, 12);
    draw_pipe_z( 22, height+(3.5/2), 0, 12);
}

function draw_leg(x, y, z, length) {
    draw_flang( x, y, z, false);
    draw_pipe_y(x, y+0.5, z, length-1.0);
    draw_flang( x, y+length-0.5, z, true);    
}

function draw_plywood(height) {
    geometry = new THREE.BoxGeometry( 48, 0.75, 16 );
    geometry.translate(0, height + 0.375, 0);
    cube = new THREE.Mesh( geometry, wood_material );
    scene.add( cube );    
}

function draw_flang(x, y, z,inverted) {
    var geometry1 = new THREE.CylinderGeometry( 2, 2, 0.25, 64 );
    var geometry2 = new THREE.CylinderGeometry( 1, 1, 0.25, 64 );
    var cylinder;

    if (inverted)
    {
        geometry1.translate(x, y+0.375, z);
        geometry2.translate(x, y+0.125, z);    
    }
    else
    {
        geometry1.translate(x, y+0.125, z);
        geometry2.translate(x, y+0.375, z);
    }
        
    cylinder = new THREE.Mesh( geometry1, pipe_material );
    scene.add( cylinder );

    cylinder = new THREE.Mesh( geometry2, pipe_material );
    scene.add( cylinder );
}

function draw_pipe_y(x, y, z, length) {
    var cylinder, offset;

    geometry = new THREE.CylinderGeometry( 0.75, 0.75, length, 64 );
    offset = length / 2;
    geometry.translate(x, y+offset, z);
    cylinder = new THREE.Mesh( geometry, pipe_material );
    scene.add( cylinder );
}

function draw_pipe_z(x, y, z, length) {
    var cylinder, offset;

    geometry = new THREE.CylinderGeometry( 0.75, 0.75, length, 64 );
    geometry.lookAt(new THREE.Vector3(0,1,0));
    geometry.translate(x, y, z);
    cylinder = new THREE.Mesh( geometry, pipe_material );
    scene.add( cylinder );
}

function draw_tee_y(x, y, z, inverted) {
    var cylinder, height, width, radius;

    height = 3.5;
    width = 1.75;
    radius = 1.0;
    geometry = new THREE.CylinderGeometry( radius, radius, height, 64 );
    geometry.translate(x, y + (height/2), z);
    cylinder = new THREE.Mesh( geometry, pipe_material );
    scene.add( cylinder );

    geometry = new THREE.CylinderGeometry( radius, radius, width, 64 );
    geometry.lookAt(new THREE.Vector3(0,1,0));
    if (inverted)
    {
        geometry.translate(x, y + (height/2), z - (width/2));    
    }
    else
    {
        geometry.translate(x, y + (height/2), z + (width/2));
    }
    cylinder = new THREE.Mesh( geometry, pipe_material );
    scene.add( cylinder );
}

function draw_model2() {
    var material, geometry, cube, cylinder;

    draw_back_flange( );
    draw_top_flange( );
    draw_flange_hole( -3 );
    draw_flange_hole( 0 );
    draw_flange_hole( 3 );
}

function draw_back_flange( ) {
    geometry = new THREE.BoxGeometry( 8, (1/2), (1/16) );
    geometry.translate(0, 0, -((1/4) - (1/32)) );
    cube = new THREE.Mesh( geometry, metal_material );
    scene.add( cube );    
}

function draw_top_flange( ) {
    geometry = new THREE.BoxGeometry( 8, (1/16), (1/2) );
    geometry.translate(0, (1/4) - (1/32), 0);
    cube = new THREE.Mesh( geometry, metal_material );
    scene.add( cube );    
}

function draw_flange_hole( x ) {
    var cylinder, offset;

    geometry = new THREE.CylinderGeometry( (5/64), (5/64), (1/16)+.001, 64, 1, false );
    geometry.translate( x, (1/4) - (1/32), 0 );
    cylinder = new THREE.Mesh( geometry, pipe_material );
    scene.add( cylinder );
}

function animate () {
    //alert("Hello");
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
}

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
}

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

init();
draw();
animate();
