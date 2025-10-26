const player = document.getElementById('player');
const gameContainer = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverText = document.getElementById('gameOverText');
const restartBtn = document.getElementById('restartBtn');

let score = 0;
let gameOver = false;
const containerWidth = 350;
const containerHeight = 500;
const playerWidth = 30;
const playerHeight = 30;
let playerX = (containerWidth - playerWidth)/2;

let startTime = Date.now();
const playerSpeed = 15;
let enemySpeedBase = 2;

let enemies = []; // เก็บ enemy ทั้งหมด

// Player - Arrow
document.addEventListener('keydown', e => {
  if(gameOver) return;
  if(e.key === 'ArrowLeft') playerX -= playerSpeed;
  if(e.key === 'ArrowRight') playerX += playerSpeed;
  playerX = Math.max(0, Math.min(containerWidth - playerWidth, playerX));
  player.style.left = playerX + 'px';
});

// Player - Drag/Touch
let dragging = false;
gameContainer.addEventListener('mousedown', e => { dragging = true; movePlayer(e); });
gameContainer.addEventListener('mousemove', e => { if(dragging) movePlayer(e); });
gameContainer.addEventListener('mouseup', e => dragging = false);
gameContainer.addEventListener('touchstart', e => movePlayer(e.touches[0]));
gameContainer.addEventListener('touchmove', e => { e.preventDefault(); movePlayer(e.touches[0]); }, {passive:false});

function movePlayer(e){
  if(gameOver) return;
  let rect = gameContainer.getBoundingClientRect();
  playerX = e.clientX - rect.left - playerWidth/2;
  playerX = Math.max(0, Math.min(containerWidth - playerWidth, playerX));
  player.style.left = playerX + 'px';
}

// Update time
function updateTime(){
  if(gameOver) return;
  let seconds = Math.floor((Date.now()-startTime)/1000);
  document.getElementById('timeBoard').textContent = `เวลา: ${seconds} วินาที`;
  requestAnimationFrame(updateTime);
}
updateTime();

// Create enemy
function createEnemy(){
  if(gameOver) return;
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.textContent = '🐛';
  const enemyWidth = 30;
  const enemyHeight = 30;
  let enemyX = Math.random()*(containerWidth-enemyWidth);
  let enemyY = 0;
  enemy.style.left = enemyX + 'px';
  enemy.style.top = enemyY + 'px';
  gameContainer.appendChild(enemy);
  enemies.push(enemy); // เก็บ enemy

  const fallSpeed = enemySpeedBase + score*0.2 + Math.random()*0.5;

  function moveEnemy(){
    if(gameOver) return;
    enemyY += fallSpeed;
    enemy.style.top = enemyY + 'px';

    const playerTop = containerHeight - playerHeight;
    const playerBottom = containerHeight;
    const playerLeft = playerX;
    const playerRight = playerX + playerWidth;

    const enemyTop = enemyY;
    const enemyBottom = enemyY + enemyHeight;
    const enemyLeft = enemyX;
    const enemyRight = enemyX + enemyWidth;

    const hit = !(playerRight < enemyLeft || playerLeft > enemyRight || playerBottom < enemyTop || playerTop > enemyBottom);

    if(hit){
      endGame();
      return;
    }

    if(enemyY < containerHeight){
      requestAnimationFrame(moveEnemy);
    } else {
      score++;
      document.getElementById('scoreBoard').textContent = `คะแนน: ${score}`;
      enemy.remove();
      enemies = enemies.filter(e => e !== enemy);
    }
  }
  moveEnemy();
}

// Spawn loop
let currentInterval = 1200;
let spawnTimeout;
function spawnLoop(){
  if(gameOver) return;
  createEnemy();
  currentInterval = Math.max(300, 1200 - score*30);
  spawnTimeout = setTimeout(spawnLoop, currentInterval);
}
spawnLoop();

function endGame(){
  if(gameOver) return;
  gameOver = true;

  // หยุด spawn
  clearTimeout(spawnTimeout);

  // ลบ enemy ทั้งหมด
  enemies.forEach(e => e.remove());
  enemies = [];

  // แสดง Game Over
  const playTime = Math.floor((Date.now()-startTime)/1000);
  gameOverText.textContent = `เกมจบ!`;
  scoreTime.textContent = `เวลาเล่น: ${playTime} วินาที | คะแนน: ${score}`;
  gameOverScreen.style.display = 'flex';
}

// เริ่มใหม่
restartBtn.addEventListener('click', ()=>{
  window.location.href = "game.html"; // โหลดเกมซ้ำ
});