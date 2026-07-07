import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165/build/three.module.js';

import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.165/examples/jsm/loaders/GLTFLoader.js';

let mixer;
let headBone;
let spineBone;
let leftArmBone;
let rightArmBone;

window.addEventListener('load', () => {

    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // -----------------------
    // SCENE
    // -----------------------

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const sizes = {
        width: canvas.clientWidth || 500,
        height: canvas.clientHeight || 500
    };

    renderer.setSize(sizes.width, sizes.height, false);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // -----------------------
    // CAMERA
    // -----------------------

    const camera = new THREE.PerspectiveCamera(
        35,
        sizes.width / sizes.height,
        0.1,
        100
    );

    camera.position.set(0, 1.4, 4);

    scene.add(camera);

    // -----------------------
    // LIGHTS
    // -----------------------

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);

    dirLight.position.set(5, 5, 5);

    dirLight.castShadow = true;

    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xc8501a, 1);

    rimLight.position.set(-5, 3, -2);

    scene.add(rimLight);

    // -----------------------
    // PLATFORM
    // -----------------------

    const platformGeo = new THREE.CylinderGeometry(1.3, 1.5, 0.2, 64);

    const platformMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3
    });

    const platform = new THREE.Mesh(platformGeo, platformMat);

    platform.position.y = -1.15;

    platform.receiveShadow = true;

    scene.add(platform);

    // -----------------------
    // MODEL
    // -----------------------

    const loader = new GLTFLoader();

    let model;

    loader.load(
        './models/animeGirl.glb',

        (gltf) => {

            model = gltf.scene;

            // scale
            model.scale.set( 1.5, 1.5, 1.5);

            // starting position (for falling animation)
            model.position.set(0, 1, 0);

            // slight rotation
            model.rotation.y = Math.PI * 0.05;

            // shadows
            model.traverse((child) => {

                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

            });

            scene.add(model);
            console.log("MODEL LOADED");

        }
    );

    // -----------------------
    // MOUSE TRACKING
    // -----------------------

    const mouse = {
        x: 0,
        y: 0
    };

    window.addEventListener('mousemove', (e) => {

        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;

        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    });

    // -----------------------
    // ANIMATION
    // -----------------------

    const clock = new THREE.Clock();

    let velocity = 0;

    let landed = false;

    function animate() {

        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // -----------------------
        // FALL ANIMATION
        // -----------------------

        if (model && !landed) {

            velocity += 0.015;

            model.position.y -= velocity;

            if (model.position.y <= -1) {

                model.position.y = -1;

                velocity = 0;

                landed = true;

            }

        }

        // -----------------------
        // LOOK AT CURSOR
        // -----------------------

        if (model) {

            const targetRotationY = mouse.x * 0.5;

            const targetRotationX = mouse.y * 0.2;

            model.rotation.y += (
                targetRotationY - model.rotation.y
            ) * 0.05;

            model.rotation.x += (
                targetRotationX - model.rotation.x
            ) * 0.05;

            // floating idle
            model.position.y += Math.sin(elapsedTime * 2) * 0.002;

        }

        platform.rotation.y += 0.002;

        renderer.render(scene, camera);

    }

    animate();

    // -----------------------
    // RESIZE
    // -----------------------

    window.addEventListener('resize', () => {

        sizes.width = canvas.clientWidth;
        sizes.height = canvas.clientHeight;

        camera.aspect = sizes.width / sizes.height;

        camera.updateProjectionMatrix();

        renderer.setSize(
            sizes.width,
            sizes.height,
            false
        );

    });

});