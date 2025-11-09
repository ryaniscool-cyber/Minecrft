// main.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/PointerLockControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// Controls
const controls = new PointerLockControls(camera, document.body);
camera.position.set(0, 2, 5);

// Overlay handling
const overlay = document.getElementById('overlay');
overlay.addEventListener('click', () => {
  controls.lock();
});
controls.addEventListener('lock', () => {
  overlay.classList.add('hidden');
});
controls.addEventListener('unlock', () => {
  overlay.classList.remove('hidden');
});

// Movement
const keys = { w: false, a: false, s: false, d: false, space: false };
document.addEventListener('keydown', e => {
  if (e.code === 'KeyW') keys.w = true;
  if (e.code === 'KeyS') keys.s = true;
  if (e.code === 'KeyA') keys.a = true;
  if (e.code === 'KeyD') keys.d = true;
  if (e.code === 'Space') keys.space = true;
});
document.addEventListener('keyup', e => {
  if (e.code === 'KeyW') keys.w = false;
  if (e.code === 'KeyS') keys.s = false;
  if (e.code === 'KeyA') keys.a = false;
  if (e.code === 'KeyD') keys.d = false;
  if (e.code === 'Space') keys.space = false;
});

// Ground
const ground = new THREE.Mesh(
  new THREE.BoxGeometry(100, 1, 100),
  new THREE.MeshLambertMaterial({ color: 0x228b22 })
);
ground.position.y = -0.5;
scene.add(ground);

// Cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshLambertMaterial({ color: 0xff0000 })
);
cube.position.y = 0.5;
scene.add(cube);

// Physics and animation
let velocityY = 0;
let canJump = true;
const gravity = 9.8;
const speed = 5;

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const delta = 0.016;

    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward).normalize();

    if (keys.w) direction.add(forward);
    if (keys.s) direction.sub(forward);
    if (keys.a) direction.sub(right);
    if (keys.d) direction.add(right);
    direction.normalize();

    controls.getObject().position.addScaledVector(direction, speed * delta);

    // Jumping
    velocityY -= gravity * delta;
    if (keys.space && canJump) {
      velocityY = 5;
      canJump = false;
    }
    controls.getObject().position.y += velocityY * delta;
    if (controls.getObject().position.y < 2) {
      velocityY = 0;
      controls.getObject().position.y = 2;
      canJump = true;
    }
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
