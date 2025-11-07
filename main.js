import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.161.0/examples/jsm/controls/PointerLockControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

// Pointer lock controls
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => controls.lock());

// Keyboard input
const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

// Generate Minecraft-style terrain
const blockSize = 1;
const terrainWidth = 20;
const terrainDepth = 20;

const blockGeo = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
const blockMat = new THREE.MeshLambertMaterial({ color: 0x55aa33 });

for (let x = -terrainWidth / 2; x < terrainWidth / 2; x++) {
  for (let z = -terrainDepth / 2; z < terrainDepth / 2; z++) {
    const height = Math.floor(Math.random() * 4); // random hills
    for (let y = 0; y <= height; y++) {
      const cube = new THREE.Mesh(blockGeo, blockMat);
      cube.position.set(x, y, z);
      scene.add(cube);
    }
  }
}

// Camera setup
camera.position.set(0, 5, 10);
controls.getObject().position.set(0, 5, 10);

// Movement
let velocityY = 0;
let canJump = false;
const gravity = 0.15;

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked) {
    let moveSpeed = 0.15;
    const dir = new THREE.Vector3();

    if (keys['KeyW']) dir.z -= moveSpeed;
    if (keys['KeyS']) dir.z += moveSpeed;
    if (keys['KeyA']) dir.x -= moveSpeed;
    if (keys['KeyD']) dir.x += moveSpeed;

    // Gravity and jump
    velocityY -= gravity;
    if (keys['Space'] && canJump) {
      velocityY = 0.3;
      canJump = false;
    }

    controls.moveRight(dir.x);
    controls.moveForward(dir.z);
    controls.getObject().position.y += velocityY;

    if (controls.getObject().position.y < 3) {
      controls.getObject().position.y = 3;
      velocityY = 0;
      canJump = true;
    }
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
