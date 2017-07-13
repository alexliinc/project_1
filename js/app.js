// Variable declaration
var canvas;
var ctx;
var width = 600;
var height = 600;
var ship_x = (width/2) - 25;
var ship_y = height -75;
var ship_w = 40;
var ship_h = 26;
var rightKey = false;
var leftKey = false;
var upKey = false;
var downKey = false;
var enemyTotal = 5;
var enemies = [];
var enemy_x = 50;
var enemy_y = -45;
var enemy_w = 128;
var enemy_h = 128;
var speed = 3;
var enemy;
var ship;
var laserTotal = 2;
var lasers = [];
var score = 0;
var alive = true;
var lives = 3;
// ------------------------------------------------------

function clearCanvas() {
  ctx.clearRect(0,0,width,height);
}

for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 60; // spreading out enemies
}

function drawEnemies(){
  for (var i = 0; i < enemies.length; i++){
    ctx.drawImage(enemy, enemies[i][0], enemies[i][1])
  }
}

function moveEnemies(){
  for (var i = 0; i < enemies.length; i++){
    if (enemies[i][1] < height){
      enemies[i][1] += enemies[i][4] // speed being entered
    } else if (enemies[i][1] > height - 1){
      enemies[i][1] = -45;
    }
  }
}

function drawShip() {
  if (rightKey){
    ship_x += 5;
  }
  else if (leftKey){
    ship_x -= 5;
  }
  if (upKey) {
    ship_y -= 5;
  }
  else if (downKey){
    ship_y += 5;
  }
  if (ship_x <= 0) {
    ship_x = 0;
  }
  if ((ship_x + ship_w) >= width){
    ship_x = width - ship_w;
  }
  if (ship_y <= 0){
    ship_y = 0;
  }
  if ((ship_y + ship_h) >= height){
    ship_y = height - ship_h;
  }
  ctx.drawImage(ship, ship_x, ship_y); //img postionX postionY
}

function drawLaser(){
  if (lasers.length){
    for (var i = 0; i < lasers.length; i++){
      ctx.fillStyle = 'red';
      ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])// for each position x, y, width, height
    }
  }
}

function moveLaser(){
  for (var i = 0; i < lasers.length; i++){
    if (lasers[i][1] > -11){
      lasers[i][1] -= 10;
    } else if (lasers[i][1] < -10){
      lasers.splice(i, 1);
    }
  }
}

function keyDown(e){
  switch(e.keyCode) {
    case 39:
        rightKey = true;
        break;
    case 37:
        leftKey = true;
        break;
    case 38:
        upKey = true;
        break;
    case 40:
        downKey = true;
        break;
    case 32:
        if (lasers.length < laserTotal)
        {
          lasers.push([ship_x + 25, ship_y - 20, 4, 20]);
          break;
        }
        else {
          break;
        }
    default:
        console.log('not correct button')
  }
}

function keyUp(e){
  switch(e.keyCode) {
    case 39:
        rightKey = false;
        break;
    case 37:
        leftKey = false;
        break;
    case 38:
        upKey = false;
        break;
    case 40:
        downKey = false;
        break;
    default:
        console.log('not correct button')
  }
}

function hitTest(){
  var remove = false;
  for (var i = 0; i < lasers.length; i++){
    for (var j = 0; j < enemies.length; j++){
      if (lasers[i][1] <= (enemies[j][1] + enemies[j][3]) // is laser y less then or equal enemies y and its height
      &&  lasers[i][0] >= enemies[j][0] // is laser x >= to enemies x
      &&  lasers[i][0] <= (enemies[j][0] + enemies[j][2])){ // is laser x less then or equal enemies x and its height
        remove = true;
        score += 10;
        enemies.splice(j,1);
        enemies.push([Math.random() * 500 + 50,-45,enemy_w,enemy_h,speed]);// creating new enemy random spawn
      }
    }
    if (remove == true){
      lasers.splice(i,1);
      remove = false;
    }
  }
}

function shipCollision() {
  var ship_xw = ship_x + ship_w,
      ship_yh = ship_y + ship_h;
  for (var i = 0; i < enemies.length; i++) {
    if (ship_x > enemies[i][0] &&
       ship_x < enemies[i][0] + enemy_w &&
       ship_y > enemies[i][1] &&
       ship_y < enemies[i][1] + enemy_h)
    {
      checkLives();
    }
    if (ship_xw < enemies[i][0] + enemy_w &&
       ship_xw > enemies[i][0] &&
       ship_y > enemies[i][1] &&
       ship_y < enemies[i][1] + enemy_h)
    {
      checkLives();
    }
    if (ship_yh > enemies[i][1] &&
       ship_yh < enemies[i][1] + enemy_h &&
       ship_x > enemies[i][0] &&
       ship_x < enemies[i][0] + enemy_w)
    {
      checkLives();
    }
    if (ship_yh > enemies[i][1] &&
       ship_yh < enemies[i][1] + enemy_h &&
       ship_xw < enemies[i][0] + enemy_w &&
       ship_xw > enemies[i][0])
    {
      checkLives();
    }
  }
}

function checkLives(){
  lives--;
  if (lives>0){
    reset();
  } else if (lives == 0) {
    alive = false;
  }
}

function scoreTotal(){
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = 'yellow';
  // ctx.fillText(content, x position, y position)
  ctx.fillText('Score: ', 490, 30);
  ctx.fillText(score, 550, 30);
  ctx.fillText('Lives: ', 10, 30);
  ctx.fillText(lives, 68, 30);
  if (!alive)
  {
    ctx.fillText('Game Over!', width/2, height/2)
  }
}

function init() {
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext('2d');
  enemy = new Image();
  enemy.src = 'img/enemy.png';
  ship = new Image();
  ship.src = 'img/ship.png';
  starfield = new Image();
  starfield.src = 'img/space.jpg';
  //setInterval(gameLoop, 25);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
  gameLoop();
}

function gameLoop() {
  clearCanvas();
  if (alive){
    hitTest();
    shipCollision();
    moveEnemies();
    moveLaser();
    drawEnemies();
    drawShip();
    drawLaser();
    scoreTotal();
  }
  scoreTotal();
  game = setTimeout(gameLoop,1000 / 30);
}



window.onload = init;
