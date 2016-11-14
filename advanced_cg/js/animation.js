function animate() {


  requestAnimationFrame( animate );

  render();

}


function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
  camera.position.z = 20;
  camera.lookAt(scene.position);
  scene.add( camera );

  con = new THREE.Object3D();
  scene.add(con);

  // balls
  var ballImage = THREE.ImageUtils.loadTexture( "bob.png" );
  var ballMaterial = new THREE.SpriteMaterial( { color: 0xff66ff, map: ballImage, useScreenCoordinates: false, blending: THREE.NormalBlending } );
  ball = new THREE.Sprite( ballMaterial );
  ball.scale.set(0.7,0.7,0);
  con.add(ball);

  ball2 = new THREE.Sprite( ballMaterial );
  ball2.scale.set(0.7,0.7,0);
  con.add(ball2);

  var loader = new THREE.JSONLoader();
  loader.load("models/bunny.js", modelLoaded );

  try {
    // renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    THREEx.WindowResize(renderer, camera);

    container.appendChild( renderer.domElement );
    has_gl = true;
  }
  catch (e) {
    // need webgl
    document.getElementById('info').innerHTML = "Web GL is not supprted in this browser";
    document.getElementById('info').style.display = "block";
    return;
  }

}

function render() {

				time = Date.now();
				delta = time - oldTime;
				oldTime = time;

				if (isNaN(delta) || delta > 1000 || delta == 0 ) {
					delta = 1000/60;
				}

				camera.position.x = (Math.sin(time/2000)*0.3)*17;
				camera.position.z = 17;

				camera.lookAt(scene.position);

				/* ball 2 rotation */
				ball.position.x = Math.sin(time/2000)*4;
				ball.position.y = Math.cos(time/2000)*4;
				ball.position.z = Math.sin(time/1000)*3;

				/*ball 1 rotation */
				ball2.position.x = Math.cos(time/2000)*4;
				ball2.position.y = Math.sin(time/1800)*4;
				ball2.position.z = Math.sin(time/800)*3;

				if (uniforms) {
					uniforms.globalTime.value += delta * 0.00005;
					uniforms.effector.value = ball.position;
					uniforms.effector2.value = ball2.position;
				}

				if (has_gl) {
					renderer.render( scene, camera );
				}

			}


function modelLoaded(ico) {


    attributes = {

        customColor: {
            type: 'c',
            value: []
        },
        time: {
            type: 'f',
            value: []
        },
        seed: {
            type: 'f',
            value: []
        },
        normals: {
            type: 'v3',
            value: []
        },

    };

    uniforms = {

        color: {
            type: "c",
            value: new THREE.Color(0xffffff)
        },
        globalTime: {
            type: "f",
            value: 0.0
        },
        light: {
            type: "v3",
            value: new THREE.Vector3(0.0, 1.0, 0.2)
        },
        effector: {
            type: "v3",
            value: new THREE.Vector3(0.0, 0.0, 0.0)
        },
        effector2: {
            type: "v3",
            value: new THREE.Vector3(0.0, 0.0, 0.0)
        },
        lightDistance: {
            type: "f",
            value: 5.0
        },

    };

    var material = new THREE.ShaderMaterial({

        uniforms: uniforms,
        attributes: attributes,
        wireframe: false,
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        shading: THREE.FlatShading,

    });

    var m = new THREE.MeshBasicMaterial();

    var regularColor = new THREE.Color(0xffc4ef);
    var glowColor = new THREE.Color(0xff00ba);

    var majorGeometry = new THREE.Geometry();

    var normalArray = [];
    var colorArray = [];

    for (var i = 0; i < ico.faces.length; i++) {

        var face = ico.faces[i];
        var vertices = ico.vertices;
        var v0 = vertices[face.a];
        var v1 = vertices[face.b];
        var v2 = vertices[face.c];
        var center = new THREE.Vector3().copy(v0).add(v1).add(v2);
        center.divideScalar(3);


        var tetra = new THREE.TetrahedronGeometry(1, 0);

        tetra.vertices[3] = v0;
        tetra.vertices[0] = v1;
        tetra.vertices[1] = v2;
        tetra.vertices[2] = center;

        tetra.computeFaceNormals();

        var normal = tetra.faces[2].normal;
        tetra.vertices[2] = center.add(normal.multiplyScalar(-0.8 * Math.random()));

        colorArray.push(regularColor);
        colorArray.push(regularColor);
        colorArray.push(glowColor);
        colorArray.push(regularColor);

        tetra.computeFaceNormals();
        tetra.computeVertexNormals();

        var mesh = new THREE.Mesh(tetra, m);

        mesh.position = new THREE.Vector3().copy(face.centroid).multiplyScalar(0.000001);

        THREE.GeometryUtils.merge(majorGeometry, mesh);

        normalArray.push(normal);

    }


    // for shader
    var vertices = majorGeometry.vertices;
    var values_time = attributes.time.value;
    var values_colors = attributes.customColor.value;
    var values_seed = attributes.seed.value;
    var values_normals = attributes.normals.value;

    for (var v = 0; v < vertices.length; v += 4) {

        var t = Math.random();

        values_time[v] = t;
        values_time[v + 1] = t;
        values_time[v + 2] = t;
        values_time[v + 3] = t;

        values_colors[v] = colorArray[v];
        values_colors[v + 1] = colorArray[v + 1];
        values_colors[v + 2] = colorArray[v + 2];
        values_colors[v + 3] = colorArray[v + 3];

        var s = Math.random();
        values_seed[v] = s;
        values_seed[v + 1] = s;
        values_seed[v + 2] = s;
        values_seed[v + 3] = s;

        var normal = normalArray[Math.floor(v / 4)];

        values_normals[v] = normal;
        values_normals[v + 1] = normal;
        values_normals[v + 2] = normal;
        values_normals[v + 3] = normal;

    }

    var mesh = new THREE.Mesh(majorGeometry, material);
    con.add(mesh);

}
