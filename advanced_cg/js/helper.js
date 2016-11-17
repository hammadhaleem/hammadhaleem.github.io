
function modelLoaded(ico) {


    attributes = {

                    customColor: { type: 'c', value: [] },
                    time:        { type: 'f', value: [] },
                    seed:        { type: 'f', value: [] },
                    normals: { type: 'v3', value: [] },
                    
                };

    uniforms = {

                    color:      { type: "c", value: new THREE.Color( 0xffffff ) },
                    globalTime: { type: "f", value: 0.0 },
                    light:      { type: "v3", value: new THREE.Vector3( 0.0, 1.0, 0.2 ) },
                    effector:   { type: "v3", value: new THREE.Vector3( 0.0, 0.0, 0.0 ) },
                    effector2:  { type: "v3", value: new THREE.Vector3( 0.0, 0.0, 0.0 ) },
                    lightDistance: { type: "f", value: 5.0 },

                };

    var material = new THREE.ShaderMaterial( {

                    uniforms:       uniforms,
                    attributes:     attributes,
                    vertexShader:   document.getElementById( 'vertexshader' ).textContent,
                    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
                    wireframe:      false,
                    shading:        THREE.FlatShading,
                    
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
