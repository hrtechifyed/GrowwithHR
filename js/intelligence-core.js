import * as THREE from "three";

const container = document.getElementById("dnaCoreCanvas");

if (container) {

    /* ==========================================================
       SCENE
    ========================================================== */

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 11;

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

    /* ==========================================================
       GROUP
    ========================================================== */

    const group = new THREE.Group();

    scene.add(group);

    /* ==========================================================
       COMPANY DNA NODES
    ========================================================== */

    const nodesData = [

        { name:"Growth",             x: 0.0,  y: 3.2 },

        { name:"Leadership",         x:-2.2,  y: 2.0 },

        { name:"Organization",       x: 2.2,  y: 2.0 },

        { name:"Culture",            x:-3.2,  y: 0.2 },

        { name:"Workforce",          x: 3.2,  y: 0.2 },

        { name:"Performance",        x:-2.3,  y:-2.0 },

        { name:"Learning",           x: 2.3,  y:-2.0 },

        { name:"Rewards",            x:-1.2,  y:-3.8 },

        { name:"Compliance",         x: 1.2,  y:-3.8 },

        { name:"Customer Success",   x: 0.0,  y:-5.2 }

    ];

    const sphereGeometry = new THREE.SphereGeometry(
        0.14,
        32,
        32
    );

    const nodes = [];

    nodesData.forEach(node => {

        const material = new THREE.MeshPhysicalMaterial({

            color:0xffb347,

            emissive:0xff8800,

            emissiveIntensity:1,

            roughness:0.08,

            metalness:0.25,

            transmission:0.55,

            thickness:0.7,

            clearcoat:1,

            clearcoatRoughness:0,

            transparent:true,

            opacity:0.96

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

    /* ==========================================================
       LIGHTING
    ========================================================== */

    const ambient = new THREE.AmbientLight(

        0xffffff,

        0.70

    );

    scene.add(ambient);

    const pointLight = new THREE.PointLight(

        0xffb347,

        4,

        60

    );

    pointLight.position.set(

        0,

        3,

        8

    );

    scene.add(pointLight);

    const blueLight = new THREE.PointLight(

        0x2563eb,

        2,

        40

    );

    blueLight.position.set(

        -5,

        -2,

        6

    );

    scene.add(blueLight);

    /* ==========================================================
       COMPANY DNA CONNECTIONS
    ========================================================== */

    const links = [

        [0,1],
        [0,2],

        [1,2],

        [1,3],
        [1,5],

        [2,4],
        [2,6],

        [3,4],

        [3,5],

        [4,6],

        [5,6],

        [5,7],

        [6,8],

        [7,8],

        [7,9],

        [8,9],

        [5,9],

        [6,9]

    ];

    /* ==========================================================
   INTELLIGENCE FLOW
========================================================== */

const flowGeometry = new THREE.SphereGeometry(

    0.045,

    16,

    16

);

const flowMaterial = new THREE.MeshBasicMaterial({

    color:0xffffff,

    transparent:true,

    opacity:0.9

});

const flowParticles=[];

links.forEach(link=>{

    const particle = new THREE.Mesh(

        flowGeometry,

        flowMaterial

    );

    particle.userData={

        start:nodes[link[0]].position.clone(),

        end:nodes[link[1]].position.clone(),

        offset:Math.random()

    };

   group.add(particle);

    flowParticles.push(particle);

});

    const lineMaterial = new THREE.LineBasicMaterial({

        color:0x5aa8ff,

        transparent:true,

        opacity:0.72

    });

    links.forEach(link => {

        const points = [

            nodes[link[0]].position,

            nodes[link[1]].position

        ];

        const lineGeometry = new THREE.BufferGeometry()

            .setFromPoints(points);

        const line = new THREE.Line(

            lineGeometry,

            lineMaterial

        );

        group.add(line);

    });

    /* ==========================================================
       ANIMATION
    ========================================================== */

    function animate(){

        requestAnimationFrame(animate);

        group.rotation.set(

            0,

            0,

            0

        );

        nodes.forEach((node,index)=>{

            const pulse =

                1 +

                Math.sin(

                    Date.now()*0.002 +

                    index

                ) * 0.05;

            node.scale.set(

                pulse,

                pulse,

                pulse

            );

        });

        flowParticles.forEach((particle,index)=>{

  const progress = (

    Date.now() * 0.00035 +

    particle.userData.offset

) % 1;

   particle.position.lerpVectors(

    particle.userData.start,

    particle.userData.end,

    progress

);

});

        const t = Date.now()*0.001;

        pointLight.intensity =

            3.8 +

            Math.sin(t*2) * 0.30;

        blueLight.intensity =

            2 +

            Math.cos(t*1.6) * 0.20;

        renderer.render(

            scene,

            camera

        );

    }

    animate();

    /* ==========================================================
       RESIZE
    ========================================================== */

    window.addEventListener("resize",()=>{

        camera.aspect =

            container.clientWidth /

            container.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(

            container.clientWidth,

            container.clientHeight

        );

    });

}
