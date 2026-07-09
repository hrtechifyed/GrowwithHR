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

    const positions = [
        [-2.2, 0, 0],
        [-1.1, 1.6, 0],
        [1.3, 1.8, 0],
        [2.3, 0.1, 0],
        [1.6, -1.7, 0],
        [-0.6, -2.1, 0],
        [-2.1, -1.0, 0],
        [0, 0, 0],
        [0.2, 2.8, 0],
        [-0.3, -3, 0]
    ];

    const nodes = [];

    positions.forEach((p) => {

        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.set(...p);

        group.add(sphere);

        nodes.push(sphere);

    });

    const lineMaterial = new THREE.LineBasicMaterial({

        color: 0x2563eb,

        transparent: true,

        opacity: 0.45

    });

    for (let i = 0; i < nodes.length; i++) {

        for (let j = i + 1; j < nodes.length; j++) {

            if (Math.random() > 0.72) continue;

            const points = [

                nodes[i].position,

                nodes[j].position

            ];

            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            group.add(new THREE.Line(geometry, lineMaterial));

        }

    }

    function animate() {

        requestAnimationFrame(animate);

        group.rotation.y += 0.003;

        group.rotation.x += 0.0015;

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
