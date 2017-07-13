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
// ------------------------------------------------------

for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 60; // spreading out enemies
}

function drawEnemies(){
  for (var i = 0; i < enemies.length; i++){
    ctx.fillStyle = "blue";
    ctx.fillRect(enemies[i][0],enemies[i][1],enemy_w,enemy_h);
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

function clearCanvas() {
  ctx.clearRect(0,0,width,height);
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
  ctx.drawImage(ship, ship_x, ship_y);
}

function init() {
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext('2d');
  enemy = new Image();
  enemy.src = "";
  ship = new Image();
  ship.src = "";
  setInterval(gameLoop, 25);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
}

function gameLoop() {
  clearCanvas();
  moveEnemies();
  drawEnemies();
  drawShip();
}



window.onload = init;
