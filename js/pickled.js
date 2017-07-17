// Project Name: Space Shooter
// Author: Alex Li
// Developer @GA in DENVER

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
var enemyTotal = 4;
var enemies = [];
var enemy_x = 50;
var enemy_y = -45;
var enemy_w = 101;
var enemy_h = 143;
var speed = 6;
var enemy;
var ship;
var laserTotal = 2;
var lasers = [];
var score = 0;
var alive = true;
var lives = 3;
var highscore = localStorage.getItem("highscore");
var starfield;
var starX = 0;
var starY = 0;
var starY2 = -600;
var gameStarted = false;
// ----------------------------------------------------------------------------

// Clears canvas board
function clearCanvas() {
  ctx.clearRect(0,0,width,height);
}

// Creating enemies in an array
for (var i = 0; i < enemyTotal; i++) {
  enemies.push([enemy_x, enemy_y, enemy_w, enemy_h, speed]);
  enemy_x += enemy_w + 60; // spreading out enemies
}

// Draws each enemy
function drawEnemies(){
  for (var i = 0; i < enemies.length; i++){
    ctx.drawImage(enemy, enemies[i][0], enemies[i][1])
  }
}

// Moving the enemies by changing there height
function moveEnemies(){
  for (var i = 0; i < enemies.length; i++){
    if (enemies[i][1] < height){
      enemies[i][1] += enemies[i][4] // speed being entered
    } else if (enemies[i][1] > height - 1){
      enemies[i][1] = -45;
    }
  }
}

// Drawing ship when button is arrow button is clicked
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

// Drawing lasers
function drawLaser(){
  if (lasers.length){
    for (var i = 0; i < lasers.length; i++){
      ctx.fillStyle = 'red';
      ctx.fillRect(lasers[i][0],lasers[i][1],lasers[i][2],lasers[i][3])// for each position x, y, width, height
    }
  }
}

// Moving lasers
function moveLaser(){
  for (var i = 0; i < lasers.length; i++){
    if (lasers[i][1] > -11){
      lasers[i][1] -= 10;
    } else if (lasers[i][1] < -10){
      lasers.splice(i, 1);
    }
  }
}

// Saying when arrow key is clicked
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
        break;
        //console.log('not correct button')
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
        break;
        //console.log('not correct button')
  }
}

// Once enemy is hit remove laser and enemy and increase points
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

// Collision dectection
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

// Reset postions of ship and enemies
function reset(){
  var enemy_reset_x = 10;
  ship_x = (width / 2) - 25;
  ship_y = height - 75;
  ship_w = 40;
  ship_h = 26;
  for (var i = 0; i < enemies.length; i++){
    enemies[i][0] = enemy_reset_x;
    enemies[i][1] = -45;
    enemy_reset_x = enemy_reset_x + enemy_w + 60;
  }
}

// See if player is alive
function checkLives(){
  lives--;
  if (lives>0){
    reset();
  } else if (lives == 0) {
    alive = false;
  }
}

// See if player wants to continue
function continueButton(){
  alive = true;
  lives = 3;
  reset();
  canvas.removeEventListener('click', continueButton, false);
}

// Drawing the background having two images that overlay
function drawStarfield(){
  ctx.drawImage(starfield, starX, starY);
  ctx.drawImage(starfield, starX, starY2);
  if (starY > 600){
    starY = -599;
  }
  if (starY2 > 600){
    starY2 = -599;
  }
  starY += 1;
  starY2 += 1;
}

// Way of keeping track of score
function scoreTotal(){
  ctx.font = 'bold 20px VT323';
  ctx.fillStyle = 'white';
  // ctx.fillText(content, x position, y position)
  ctx.fillText('Score: ', 440, 30);
  ctx.fillText(score, 500, 30);
  ctx.fillText('Lives: ', 10, 30);
  ctx.fillText(lives, 68, 30);
  // How highscore is tracked
  if (highscore !== null){
    if (score > highscore){
      localStorage.setItem("highscore", score);
    }
  }
  else {
    localStorage.setItem("highscore", 0);
  }
  ctx.fillText('Highscore: ', 440, 50);
  ctx.fillText(highscore, 540, 50);
  // When game is not started
  if (!gameStarted){
    ctx.font = 'bold 50px VT323';
    ctx.fillText('Pickle Shooter', width / 2 - 130, height / 2);
    ctx.font = 'bold 20px VT323';
    ctx.fillText('Click to Play', width / 2 - 56, height / 2 + 30);
    ctx.fillText('Use arrow keys to move', width / 2 - 100, height / 2 + 60);
    ctx.fillText('Use the space bar key to shoot', width / 2 - 100, height / 2 + 90);
  }
  // When you lose
  if (!alive)
  {
    ctx.fillText('Game Over!', 252, height/2);
    // context.fillRect(x,y,width,height);
    ctx.fillRect((width/2) - 60, (height / 2) + 10, 100, 40);
    ctx.fillStyle = 'black';
    ctx.fillText('Continue?', 252, (height / 2) + 35);
    canvas.addEventListener('click',continueButton,false);
    score = 0;
    highscore = localStorage.getItem("highscore");
  }
}

// Starting game
function gameStart(){
  gameStarted = true;
  canvas.removeEventListener('clicked', gameStart, false);
}

// When game is started
function init() {
  canvas = document.getElementById('gameBoard');
  ctx = canvas.getContext('2d');
  enemy = new Image();
  enemy.src = 'img/jar.png';
  ship = new Image();
  ship.src = 'img/pickle.png';
  starfield = new Image();
  starfield.src = 'img/starfield.png';
  //setInterval(gameLoop, 25);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
  canvas.addEventListener('click', gameStart, false);
  gameLoop();
}

function gameLoop() {
  clearCanvas();
  drawStarfield();
  if (alive && gameStarted){
    hitTest();
    shipCollision();
    moveEnemies();
    moveLaser();
    drawEnemies();
    drawShip();
    drawLaser();
  }
  scoreTotal();
  game = setTimeout(gameLoop,1000 / 30);
}

window.onload = init;
