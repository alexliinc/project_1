

// Defining an object to hold all images
 var imageRepository = new function() {
   // Define images
   this.background = new Image();
   this.spaceship = new Image();
   this.enemy = new Image();

   // Making sure all images have loaded before starting the game
   var numImages = 3;
   var numLoaded = 0;
   function imgLoaded(){
     numLoaded++;
     if (numLoaded === numImages) {
			window.init();
		}
   }
   this.background.onload = function(){
     imgLoaded();
   }
   this.spaceship.onload = function(){
     imgLoaded();
   }
   this.enemy.onload =function(){
     imgLoaded();
   }
   this.background.src = "img/bg.png";
   this.spaceship.src = "img/ship.png";
   this.enemy.src = "img/enemy.png";
 };

// Creating a drawable object to create the images
// function Drawable() {
//   this.init = function(x,y,width,height){
//       // Default variables;
//       this.x = x;
//       this.y = y;
//       this.width = width;
//       this.height = height;
//   };
//   this.speed = 0;
//   this.canvasWidth = 0;
//   this.canvasHeight = 0;
//
//   // Defining abstract funtion to be implented to child objects
//   this.draw = function(){
//   };
// };
function Drawable() {
	this.init = function(x, y, width, height) {
		// Defualt variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}


// Creating background object
function Background(){
  this.speed = 1; // Redefine the speed of background
  this.draw = function() {
    // Panning background
    this.y += this.speed;
    this.context.drawImage(imageRepository.background,this.x,this.y);
    // Draw another image on top edge of the first image
    this.context.drawImage(imageRepository.background,this.x,this.y - this.canvasHeight);

    // If the image scrolled off the screen, reset
    if (this.y >= this.canvasHeight){
      this.y = 0;
    };
  };
};

Background.prototype = new Drawable();

// Create the enemy
function Enemy(){
  this.alive = false;
  this.spawn = function(x, y, speed){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.speedX = 0;
    this.speedY = speed;
    this.alive = true;
    this.leftEdge = this.x - 90;
    this.rightEdge = this.x + 90;
    this.bottomEdge = this.y + 140;
  }
  // drawing the enemy
  this.draw = function() {
    this.context.clearRect(this.x-1, this.y, this.width+1, this.height);
    this.x += this.speedX;
    this.y += this.speedY;
    this.context.drawImage(imageRepository.enemy, this.x, this.y);
  }

  // reset enemy values
  this.clear = function(){
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.alive = false;
  };
};
Enemy.prototype = new Drawable();

// Pool of objects enemies
function Pool(maxSize){
  var size = maxSize;
  var pool = [];

  this.init = function(object) {
    if (object == "enemy"){
      for (var i = 0; i < size; i++){
        var enemy = new Enemy();
        enemy.init(0,0,imageRepository.enemy.width, imageRepository.enemy.height);
        pool[i] = enemy;
      }
    }
  };
};

// Create Ship object
function Ship(){
  this.speed = 3;
  this.draw = function() {
    this.context.drawImage(imageRepository.spaceship, this.x, this.y);
  };
  // Determine if the action is a move action
  this.move = function(){
    if (KEY_STATUS.left || KEY_STATUS.right){
          // Remove image and redraw new image
          this.context.clearRect(this.x, this.y, this.width, this.height);
          // Update x according to the direction to move and
    			// redraw the ship.
          if (KEY_STATUS.left) {
            this.x -= this.speed
            if (this.x <= 0){
              // Keep player within the screen
              this.x = 0;
            }
          } else
          if (KEY_STATUS.right) {
            this.x += this.speed
    				if (this.x >= 360 - this.width){
              // Keep player within the screen
              this.x = 360 - this.width;
            }
          }
      // Finish by redrawing the ship
			this.draw();
    }
  };
};
Ship.prototype = new Drawable();

KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}

// Creating array to hold the KEY_CODES and set the al to false
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}

// When key is pushed down
document.onkeydown = function(e){
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]){
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  };
};

// When key is let go of or up
document.onkeyup = function(e){
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]){
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  };
};

// Creates the game object that holds all the objects and data for game
function Game(){
  // Gets the canvas information for init set up
  this.init = function(){

    // Get the canvas element this.bgCanvas is background of the canvas
    this.bgCanvas = document.getElementById('background');
    this.shipCanvas = document.getElementById('ship');
    this.mainCanvas = document.getElementById('main');
    // Test to see if canvas is supported
    if (this.bgCanvas.getContext){
      // This is basically telling Js that the context of the drawing is going to be one of 2 dimensional
      this.bgContext = this.bgCanvas.getContext('2d');
      this.shipContext = this.shipCanvas.getContext('2d');
      this.mainContext = this.mainCanvas.getContext('2d');
      // Initalize object to contain their context and canvas
      // Background
      Background.prototype.context = this.bgContext;
      Background.prototype.canvasWidth = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;
      // Ship
      Ship.prototype.context = this.shipContext;
      Ship.prototype.canvasWidth = this.shipContext.width;
      Ship.prototype.canvasHeight = this.shipContext.height;
      // Enemy
      Enemy.prototype.context = this.mainContext;
      Enemy.prototype.canvasWidth = this.mainContext.width;
      Enemy.prototype.canvasHeight = this.mainContext.height;


      // Initalizethe background object
      this.background = new Background();
      this.background.init(0,0);

      // Initalize ship object
      this.ship = new Ship();
      var shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
      var shipStartY = this.shipCanvas.height/4 * 3 + imageRepository.spaceship.height;
      this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width, imageRepository.spaceship.height);

      return true;
    } else {
        return false;
    }
  };

  // Start the animation loop
  this.start = function(){
    this.ship.draw();
    animate();
  };
};


// animation loop
function animate() {
  requestAnimeFrame( animate );
  game.background.draw();
  game.ship.move();
}

window.requestAnimeFrame = (function(){
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
		};
})();

//Initalize the GAME and starts it
var game = new Game();

function init(){
  if(game.init()){
    game.start();
  }
}
