

// Defining an object to hold all images
 var imageRepository = new function() {
   // Define images
   this.background = new Image();
   this.spaceship = new Image();
   //this.bullet = new Image();

   // Making sure all images have loaded before starting the game
   var numImages = 2;//3
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

  //  this.bullet.onload = function(){
  //    imgLoaded();
  //  }

   // Set images src
   this.background.src = "img/bg.png";
   this.spaceship.src = "img/ship.png";
   //this.bullet.src = "img/bg.png";
 };

// Creating a drawable object to create the images
function Drawable() {
  this.init = function(x,y,width,height){
      // Default variables;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  };
  this.speed = 0;
  this.canvasWidth = 0;
  this.canvasHeight = 0;

  // Defining abstract funtion to be implented to child objects
  this.draw = function(){
  };
};

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

// Create Ship object
function Ship(){
  this.speed = 3;
  this.draw = function() {
    this.context.drawImage(imageRepository.spaceship, this.x, this.y);
  };
  // Determine if the action is a move action
  this.move = function(){
    if (KEY_STATUS.left || KEY_STATUS.right ||
			  KEY_STATUS.down || KEY_STATUS.up){
          // Remove image and redraw new image
          this.context.clearRect(this.x, this.y, this.width, this.length);

    }
  };
}

// Creates the game object that holds all the objects and data for game
function Game(){
  // Gets the canvas information for init set up
  this.init = function(){
    // Get the canvas element this.bgCanvas is background of the canvas
    this.bgCanvas = document.getElementById('background');
    // Test to see if canvas is supported
    if (this.bgCanvas.getContext){
      // This is basically telling Js that the context of the drawing is going to be one of 2 dimensional
      this.bgContext = this.bgCanvas.getContext('2d');
      // Initalize object to contain their context and canvas
      Background.prototype.context = this.bgContext;
      Background.prototype.canvasWidth = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;

      // Initalizethe background object
      this.background = new Background();
      this.background.init(0,0);
      return true;
    } else {
        return false;
    }
  };

  // Start the animation loop
  this.start = function(){
    animate();
  };
};


// animation loop
function animate() {
  requestAnimeFrame( animate );
  game.background.draw();
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
