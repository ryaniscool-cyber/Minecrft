import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.161.0/examples/jsm/controls/PointerLockControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // bright blue sky

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 15, 30); // start high above terrain

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Simple lighting (strong to ensure visibility)
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(50, 100, 50);
scene.add(sun);

// Terrain generation
const blockSize = 1;
const terrainWidth = 20;
const terrainDepth = 20;

const blockGeo = new THREE.BoxGeometry(blockSize, blockSize, blockSize);

for (let x = -terrainWidth / 2; x < terrainWidth / 2; x++) {
  for (let z = -terrainDepth / 2; z < terrainDepth / 2; z++) {
    const height = Math.floor(Math.random() * 4); // small hills
    for (let y = 0; y <= height; y++) {
      const mat = new THREE.MeshLambertMaterial({
        color: y === height ? 0x55aa33 : 0x8b5a2b // grass or dirt
      });
      const cube = new THREE.Mesh(blockGeo, mat);
      cube.position.set(x, y, z);
      scene.add(cube);
    }
  }
}

// Ground plane (big fallback surface)
const groundGeo = new THREE.PlaneGeometry(200, 200);
const groundMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

// Pointer lock controls
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => controls.lock());

// Movement
const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

let velocityY = 0;
let canJump = true;
const gravity = 0.1;

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked) {
    const moveSpeed = 0.25;
    const dir = new THREE.Vector3();

    if (keys['KeyW']) dir.z -= moveSpeed;
    if (keys['KeyS']) dir.z += moveSpeed;
    if (keys['KeyA']) dir.x -= moveSpeed;
    if (keys['KeyD']) dir.x += moveSpeed;

    controls.moveRight(dir.x);
    controls.moveForward(dir.z);

    velocityY -= gravity;
    controls.getObject().position.y += velocityY;

    if (controls.getObject().position.y < 5) {
      controls.getObject().position.y = 5;
      velocityY = 0;
      canJump = true;
    }

    if (keys['Space'] && canJump) {
      velocityY = 0.4;
      canJump = false;
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
