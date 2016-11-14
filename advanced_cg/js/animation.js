function animate() {


    requestAnimationFrame(animate);

    render();

}


function init() {

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
        color: 0xff66ff,
        map: ballImage,
        useScreenCoordinates: false,
        blending: THREE.NormalBlending
    });
    ball = new THREE.Sprite(ballMaterial);
    ball.scale.set(0.7, 0.7, 0);
    con.add(ball);

    ball2 = new THREE.Sprite(ballMaterial);
    ball2.scale.set(0.7, 0.7, 0);
    con.add(ball2);

    var loader = new THREE.JSONLoader();
    loader.load("models/bunny.js", modelLoaded);

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

    camera.position.x = (Math.sin(time / 2000) * 0.3) * 17;
    camera.position.z = 17;

    camera.lookAt(scene.position);

    if (music_is_active ) {
    //     var nBarHalf = Math.ceil(nBar / 2)
        histo = sound.makeHistogram(30);
        amplitude =d.amplitude();
        console.log([render_counter, amplitude , histo , Math.sin(time / 2000)]);


    /* ball 2 rotation */
    ball.position.x = (amplitude + Math.sin(time / 2000)) * 4;
    ball.position.y = (amplitude + Math.sin(time / 2000)) * 4;
    ball.position.z = (amplitude + Math.sin(time / 2000)) * 3;

    /*ball 1 rotation */
    ball2.position.x = (amplitude + Math.cos(time / 2000)) * 4;
    ball2.position.y = (amplitude + Math.cos(time / 2000)) * 4;
    ball2.position.z = (amplitude + Math.cos(time / 2000)) * 3;

    }
    if (uniforms) {
        uniforms.globalTime.value += delta * 0.00005;
        uniforms.effector.value = ball.position;
        uniforms.effector2.value = ball2.position;
    }


    if (has_gl) {
        renderer.render(scene, camera);
    }


}
