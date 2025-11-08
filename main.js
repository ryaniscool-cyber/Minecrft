import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.161.0/examples/jsm/controls/PointerLockControls.js';

// Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // blue sky

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

// Basic ground generation (simple terrain)
const blockSize = 1;
const worldWidth = 40;
const worldDepth = 40;
const maxHeight = 5;

const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
const material = new THREE.MeshLambertMaterial({ color: 0x228b22 }); // green grass

for (let x = -worldWidth / 2; x < worldWidth / 2; x++) {
  for (let z = -worldDepth / 2; z < worldDepth / 2; z++) {
    const height = Math.floor(Math.random() * maxHeight);
    for (let y = 0; y <= height; y++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x * blockSize, y * blockSize, z * blockSize);
      scene.add(cube);
    }
  }
}

// Controls
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

camera.position.set(0, 10, 10);
controls.getObject().position.y = 10;

// Movement
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const move = { forward: false, backward: false, left: false, right: false, jump: false };

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW': move.forward = true; break;
    case 'KeyS': move.backward = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
    case 'Space': move.jump = true; break;
  }
});
document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW': move.forward = false; break;
    case 'KeyS': move.backward = false; break;
    case 'KeyA': move.left = false; break;
    case 'KeyD': move.right = false; break;
    case 'Space': move.jump = false; break;
  }
});

// Game loop
const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();

  if (controls.isLocked) {
    direction.z = Number(move.forward) - Number(move.backward);
    direction.x = Number(move.right) - Number(move.left);
    direction.normalize();

    const speed = 5.0;
    velocity.x = direction.x * speed * delta;
    velocity.z = direction.z * speed * delta;

    controls.moveRight(velocity.x);
    controls.moveForward(velocity.z);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
