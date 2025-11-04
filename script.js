const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// World settings
const worldSize = 50;
const blockSize = 50;

// Generate world data (simple flat terrain)
const world = [];
for (let x = 0; x < worldSize; x++) {
  world[x] = [];
  for (let y = 0; y < worldSize; y++) {
    world[x][y] = Math.random() < 0.2 ? 'block' : null;
  }
}

// Player state
const player = {
  x: worldSize/2,
  y: worldSize/2,
  z: 1,
  velocityY: 0,
  size: 10,
  onGround: false,
};

// Movement controls
const keys = {};
window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

// Mouse for block interaction
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

let mouseDown = false;
window.addEventListener('mousedown', () => { mouseDown = true; });
window.addEventListener('mouseup', () => { mouseDown = false; });

// Utility functions
function worldToScreen(x, y, z) {
  // Simple pseudo-3D projection
  const scale = 300 / (z + 1);
  const screenX = (x - player.x) * blockSize * scale + canvas.width/2;
  const screenY = (y - player.y) * blockSize * scale + canvas.height/2 - z * 10;
  return { x: screenX, y: screenY, scale };
}

function drawBlock(x, y, z, color='brown') {
  const { x: sx, y: sy, scale } = worldToScreen(x, y, z);
  ctx.fillStyle = color;
  ctx.fillRect(sx, sy, blockSize * scale, blockSize * scale);
}

// Main game loop
function gameLoop() {
  // Handle movement
  const speed = 0.05;
  if (keys['a']) player.x -= speed;
  if (keys['d']) player.x += speed;
  if (keys['w']) player.y -= speed;
  if (keys['s']) player.y += speed;

  // Jump
  if (keys[' '] && player.onGround) {
    player.velocityY = -0.5;
    player.onGround = false;
  }

  // Gravity
  player.velocityY += 0.01;
  player.z += player.velocityY;

  // Ground collision
  if (player.z < 1) {
    player.z = 1;
    player.velocityY = 0;
    player.onGround = true;
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw world blocks
  for (let x = 0; x < worldSize; x++) {
    for (let y = 0; y < worldSize; y++) {
      if (world[x][y]) {
        drawBlock(x, y, 0);
      }
    }
  }

  // Draw player
  ctx.fillStyle = 'red';
  const playerScreen = worldToScreen(player.x, player.y, player.z);
  ctx.fillRect(playerScreen.x - player.size/2, playerScreen.y - player.size/2, player.size, player.size);

  // Handle block placement/removal
  if (mouseDown) {
    // Convert mouse position to world coordinates
    const worldX = Math.round(player.x + (mouseX - canvas.width/2) / (300 / (player.z + 1)) / blockSize);
    const worldY = Math.round(player.y + (mouseY - canvas.height/2 + player.z * 10) / (300 / (player.z + 1)) / blockSize);
    if (world[worldX] && world[worldX][worldY] !== undefined) {
      if (keys['e']) {
        // Place block
        world[worldX][worldY] = 'block';
      }
      if (keys['q']) {
        // Remove block
        world[worldX][worldY] = null;
      }
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
