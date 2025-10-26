const player = document.getElementById('player');
const gameContainer = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverText = document.getElementById('gameOverText');
const restartBtn = document.getElementById('restartBtn');
const scoreTime = document.getElementById('scoreTime');

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

let enemies = [];
let items = [];

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

// Update UI
function updateUI(){
  if(gameOver) return;
  const seconds = Math.floor((Date.now()-startTime)/1000);
  document.getElementById('timeBoard').textContent = `เวลา: ${seconds} วินาที`;
  document.getElementById('scoreBoard').textContent = `แต้ม: ${score}`;
  requestAnimationFrame(updateUI);
}
updateUI();

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
  enemies.push(enemy);

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
      enemy.remove();
      enemies = enemies.filter(e => e !== enemy);
    }
  }
  moveEnemy();
}

// Spawn enemy
let currentInterval = 1200;
let spawnTimeout;
function spawnLoop(){
  if(gameOver) return;
  createEnemy();
  currentInterval = Math.max(300, 1200 - score*30);
  spawnTimeout = setTimeout(spawnLoop, currentInterval);
}
spawnLoop();

// Create item (fall like worm)
function createItem(isBonus){
  if(gameOver) return;
  const item = document.createElement('div');
  let val;
  if(isBonus){
  val = Math.floor(Math.random()*3)+1;
  item.textContent = `${val}`;
  item.classList.add('item');
  item.style.background = 'linear-gradient(135deg, #a0f0a0, #00b000)';
} else {
  val = -1*(Math.floor(Math.random()*3)+3);
  item.textContent = `${val}`;
  item.classList.add('item','red'); // ใช้ class red
}

  item.classList.add('item');
  const size = 25;
  let startX = Math.random()*(containerWidth-size);
  let itemY = 0;
  let sway = Math.random()*Math.PI*2;
  const swayAmplitude = 20;
  const swaySpeed = 0.05;
  const fallSpeed = 1 + Math.random()*2;

  item.style.position = 'absolute';
  item.style.left = startX + 'px';
  item.style.top = itemY + 'px';
  item.style.fontSize = '1.5rem';
  gameContainer.appendChild(item);
  items.push({el:item,val:val});

  function moveItem(){
    if(gameOver) return;
    sway += swaySpeed;
    itemY += fallSpeed;
    const swayX = startX + Math.sin(sway)*swayAmplitude;
    item.style.top = itemY + 'px';
    item.style.left = swayX + 'px';

    // ตรวจสอบชน
    const playerTop = containerHeight - playerHeight;
    const playerBottom = containerHeight;
    const playerLeft = playerX;
    const playerRight = playerX + playerWidth;

    const itemTop = itemY;
    const itemBottom = itemY + size;
    const itemLeft = swayX;
    const itemRight = itemLeft + size;

    const hit = !(playerRight < itemLeft || playerLeft > itemRight || playerBottom < itemTop || playerTop > itemBottom);

    if(hit || itemY>containerHeight){
      if(hit) score += val;
      items = items.filter(i => i.el !== item);
      item.remove();
      return;
    }

    requestAnimationFrame(moveItem);
  }

  moveItem();
}

// เรียกไอเท็มแบบสุ่มตามเวลาที่กำหนด

// Spawn items
setInterval(()=>{ if(!gameOver) createItem(true); },10000);
setInterval(()=>{ if(!gameOver) createItem(false); },4000);

function endGame(){
  if(gameOver) return;
  gameOver = true;

  clearTimeout(spawnTimeout);

  enemies.forEach(e => e.remove());
  enemies = [];

  items.forEach(i => i.el.remove());
  items = [];

  const playTime = Math.floor((Date.now()-startTime)/1000);
  // สมดุลคะแนนเฉลี่ย: ใช้สูตร log + rate
  let avgScore = score / ((playTime+1)/3) * 5; // playTime เป็นวินาที
  avgScore = Math.min(Math.max(avgScore, 1), 20); // จำกัด 1–20

  gameOverText.textContent = `เกมจบ!`;
  scoreTime.textContent = `เวลาเล่น: ${playTime} s `;
  scoreP.textContent = `หลบได้: ${score} ตัว `;
  scoreA.textContent = `คะแนนเฉลี่ย: ${avgScore.toFixed(2)} P `;
  
  gameOverScreen.style.display = 'flex';
}

// Restart
restartBtn.addEventListener('click', ()=>{
  window.location.href = "game.html";
});