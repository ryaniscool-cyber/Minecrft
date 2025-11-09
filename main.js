import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

console.log("✅ Three.js test running");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground plane
const geometry = new THREE.PlaneGeometry(100, 100, 10, 10);
const material = new THREE.MeshStandardMaterial({ color: 0x228b22 });
const ground = new THREE.Mesh(geometry, material);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Simple cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = 1;
scene.add(cube);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Camera & controls
camera.position.y = 2;
const controls = new PointerLockControls(camera, document.body);

document.addEventListener("click", () => {
  controls.lock();
});

const move = { forward: 0, backward: 0, left: 0, right: 0 };
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyW") move.forward = 1;
  if (e.code === "KeyS") move.backward = 1;
  if (e.code === "KeyA") move.left = 1;
  if (e.code === "KeyD") move.right = 1;
});
document.addEventListener("keyup", (e) => {
  if (e.code === "KeyW") move.forward = 0;
  if (e.code === "KeyS") move.backward = 0;
  if (e.code === "KeyA") move.left = 0;
  if (e.code === "KeyD") move.right = 0;
});

function animate() {
  requestAnimationFrame(animate);

  const speed = 0.05;
  if (controls.isLocked) {
    const direction = new THREE.Vector3();
    if (move.forward) direction.z -= speed;
    if (move.backward) direction.z += speed;
    if (move.left) direction.x -= speed;
    if (move.right) direction.x += speed;
    controls.moveRight(direction.x);
    controls.moveForward(direction.z);
  }

  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
