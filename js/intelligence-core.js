import * as THREE from "three";

const container = document.getElementById("dnaCoreCanvas");

if (container) {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    scene.add(group);

    const geometry = new THREE.SphereGeometry(0.10, 24, 24);

    const material = new THREE.MeshBasicMaterial({
        color: 0xffb000
    });

 const nodesData = [

    { name:"Growth", x:0, y:2.7 },

    { name:"Leadership", x:-2.1, y:1.5 },

    { name:"Organization", x:2.1, y:1.5 },

    { name:"Culture", x:-3.0, y:0 },

    { name:"Workforce", x:3.0, y:0 },

    { name:"Performance", x:-2.0, y:-1.9 },

    { name:"Learning", x:2.0, y:-1.9 },

    { name:"Rewards", x:-1.0, y:-3.3 },

    { name:"Compliance", x:1.0, y:-3.3 },

    { name:"Customer Success", x:0, y:-4.6 }

];

const nodes = [];

const sphereGeometry = new THREE.SphereGeometry(0.14,32,32);

nodesData.forEach(node=>{

    const material = new THREE.MeshPhongMaterial({

        color:0xffb000,

        emissive:0xff8800,

        emissiveIntensity:.6,

        shininess:120,

        transparent:true,

        opacity:.95

    });

    const sphere = new THREE.Mesh(

        sphereGeometry,

        material

    );

    sphere.position.set(

        node.x,

        node.y,

        0

    );

    group.add(sphere);

    nodes.push(sphere);

});

const ambient = new THREE.AmbientLight(

    0xffffff,

    .7

);

scene.add(ambient);

const pointLight = new THREE.PointLight(

    0xffb000,

    2,

    40

);

pointLight.position.set(

    0,

    2,

    6

);

scene.add(pointLight);

const links=[

[0,1],[0,2],

[1,3],[1,5],

[2,4],[2,6],

[3,5],

[4,6],

[5,7],

[6,8],

[7,9],

[8,9],

[1,2],

[3,4],

[5,6],

[7,8]

];

const lineMaterial = new THREE.LineBasicMaterial({

    color:0x2f80ff,

    transparent:true,

    opacity:.55

});

links.forEach(link=>{

    const points=[

        nodes[link[0]].position,

        nodes[link[1]].position

    ];

    const geometry = new THREE.BufferGeometry()

        .setFromPoints(points);

    group.add(

        new THREE.Line(

            geometry,

            lineMaterial

        )

    );

});
    

    function animate() {

        requestAnimationFrame(animate);

       group.rotation.y += 0.002;

group.rotation.x =

    Math.sin(

        Date.now()*0.0005

    )*0.08;

nodes.forEach((node,index)=>{

    node.scale.setScalar(

        1 +

        Math.sin(

            Date.now()*0.002+

            index

        )*0.08

    );

});

        renderer.render(scene, camera);

    }

    animate();

    window.addEventListener("resize", () => {

        camera.aspect =

            container.clientWidth / container.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(

            container.clientWidth,

            container.clientHeight

        );

    });

}
