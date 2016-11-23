function animate() {
    requestAnimationFrame(animate);
    render();
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function init(object_to_load) {

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.z = 20;
    camera.lookAt(scene.position);
    scene.add(camera);

    con = new THREE.Object3D();
    scene.add(con);

    // balls
    var ballImage = THREE.ImageUtils.loadTexture("bob.png");

    var ballMaterial = new THREE.SpriteMaterial({
        color: ball_color,
        map: ballImage,
        useScreenCoordinates: false,
        blending: THREE.NormalBlending
    });


    var loader = new THREE.JSONLoader();
    loader.load("models/" + object_to_load, modelLoaded);

    ball = new THREE.Sprite(ballMaterial);
    ball.scale.set(ball_radius, ball_radius, 0);
    con.add(ball);


    ball1 = new THREE.Sprite(ballMaterial);
    ball1.scale.set(ball_radius, ball_radius, 0);
    con.add(ball1);

    ball2 = new THREE.Sprite(ballMaterial);
    ball2.scale.set(ball_radius, ball_radius, 0);
    con.add(ball2);

    ball3 = new THREE.Sprite(ballMaterial);
    ball3.scale.set(ball_radius, ball_radius, 0);
    con.add(ball3);


    try {
        // renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        THREEx.WindowResize(renderer, camera);

        container.appendChild(renderer.domElement);
        has_gl = true;

    } catch (e) {
        // need webgl
        document.getElementById('info').innerHTML = "Web GL is not supprted in this browser";
        document.getElementById('info').style.display = "block";
        return false;
    }



}

function render() {

    render_counter = render_counter + 1
    time = Date.now();
    delta = time - oldTime;
    oldTime = time;

    if (isNaN(delta) || delta > 1000 || delta == 0) {
        delta = 1000 / 60;
    }

    if(camera_rotate == true)
        camera.position.x = (Math.sin(time / 2000)) * camera_position_z * 0.5;
    
    camera.position.z = camera_position_z;
    camera.lookAt(scene.position);

    stack_time_delta = stack_time_delta + delta;

    if (uniforms && music_is_active) {
        amplitude_stack =  uniforms.sound_queue.value;
        
        amplitude = sound.amplitude();

        if(stack_time_delta >  100 ){
                amplitude_stack.push((10.0 * amplitude));
                amplitude_stack.shift();

                uniforms.sound_queue.value =  amplitude_stack; 
                stack_time_delta= 0;
        }

        ball.position.x = Math.sin(time/2000) * max_x * 0.5;
        ball.position.y = Math.sin(time/2000) * max_y * 0.5;
        ball.position.z = Math.sin(time/2000) * max_z * 0.5;

        ball1.position.x = Math.sin(time/2000) * Math.cos(time/2000) * max_x * 0.5;
        ball1.position.y = Math.sin(time/2000) * Math.cos(time/2000) * -max_y * 0.5;
        ball1.position.z = Math.sin(time/2000) * Math.cos(time/2000) * max_z * 0.5;

        ball2.position.x = Math.cos(time/2000)  * -max_x * 0.5;
        ball2.position.y = Math.cos(time/2000)  * -max_y * 0.5;
        ball2.position.z = Math.cos(time/2000)  * -max_z * 0.5;

        ball3.position.x = Math.sin(time/2000) * Math.cos(time/2000) * -max_x * 0.5;
        ball3.position.y = Math.sin(time/2000) * Math.cos(time/2000) * max_y * 0.5;
        ball3.position.z = Math.sin(time/2000) * Math.cos(time/2000) * -max_z* 0.5;

    }
    if (uniforms && music_is_active) {

        uniforms.song_amplitude.value = amplitude;
        uniforms.globalTime.value += delta * 0.00005;
        uniforms.effector.value  = ball.position;
        uniforms.effector1.value = ball1.position;
        uniforms.effector2.value = ball2.position;
        uniforms.effector3.value = ball3.position;

    }


    if (has_gl) {
        renderer.render(scene, camera);
    }


}