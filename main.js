import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { PointerLockControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/PointerLockControls.js";

let scene, camera, renderer, controls;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let objects = [];
let prevTime = performance.now();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // sky blue

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(50, 100, 50);
  scene.add(directionalLight);

  // Terrain generation
  const blockSize = 1;
  const terrainWidth = 30;
  const terrainDepth = 30;
  const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
  const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });

  for (let x = -terrainWidth / 2; x < terrainWidth / 2; x++) {
    for (let z = -terrainDepth / 2; z < terrainDepth / 2; z++) {
      const height = Math.floor(Math.random() * 3); // random hills
      for (let y = 0; y <= height; y++) {
        const cube = new THREE.Mesh(geometry, grassMaterial);
        cube.position.set(x * blockSize, y * blockSize, z * blockSize);
        scene.add(cube);
        objects.push(cube);
      }
    }
  }

  // Controls
  controls = new PointerLockControls(camera, document.body);
  document.addEventListener("click", () => controls.lock());
  scene.add(controls.getObject());

  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
      case "Space":
        if (canJump === true) velocity.y += 5;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 10.0 * delta; // gravity

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  if (moveForward || moveBackward) velocity.z -= direction.z * 100.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 100.0 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);

  controls.getObject().position.y += velocity.y * delta;

  if (controls.getObject().position.y < 2) {
    velocity.y = 0;
    controls.getObject().position.y = 2;
    canJump = true;
  }

  renderer.render(scene, camera);
  prevTime = time;
}
