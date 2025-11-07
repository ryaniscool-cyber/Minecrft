import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Controls
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => controls.lock());

// Terrain generator
const blockSize = 1;
const worldSize = 20;
const noiseScale = 0.2;

function generateHeight(x, z) {
  return Math.floor(Math.sin(x * noiseScale) * Math.cos(z * noiseScale) * 3 + 3);
}

const blockGeo = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
const blockMat = new THREE.MeshLambertMaterial({ color: 0x55aa33 });

for (let x = -worldSize / 2; x < worldSize / 2; x++) {
  for (let z = -worldSize / 2; z < worldSize / 2; z++) {
    const h = generateHeight(x, z);
    for (let y = 0; y < h; y++) {
      const block = new THREE.Mesh(blockGeo, blockMat);
      block.position.set(x, y * blockSize, z);
      scene.add(block);
    }
  }
}

camera.position.set(0, 5, 10);

// Movement
const keys = { w: false, a: false, s: false, d: false, space: false };
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

let velocityY = 0;
let canJump = false;

function animate() {
  requestAnimationFrame(animate);
  const delta = 0.016;
  const moveSpeed = 5;

  const direction = new THREE.Vector3();
  if (keys.w) direction.z -= 1;
  if (keys.s) direction.z += 1;
  if (keys.a) direction.x -= 1;
  if (keys.d) direction.x += 1;
  direction.normalize();

  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  const move = new THREE.Vector3();
  move.addScaledVector(forward, direction.z * moveSpeed * delta);
  move.addScaledVector(right, direction.x * moveSpeed * delta);
  controls.getObject().position.add(move);

  // Gravity
  velocityY -= 9.8 * delta;
  if (keys.space && canJump) {
    velocityY = 5;
    canJump = false;
  }
  controls.getObject().position.y += velocityY * delta;
  if (controls.getObject().position.y < 2) {
    controls.getObject().position.y = 2;
    velocityY = 0;
    canJump = true;
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
