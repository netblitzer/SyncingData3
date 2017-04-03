let canvas;
let ctx;
let walkImage;
let slashImage;
//our websocket connection
let socket; 
let hash;
let animationFrame;

let squares = {};

const keyDownHandler = (e) => {
  var keyPressed = e.which;
  const square = squares[hash];

  
  // A OR LEFT
  if(keyPressed === 65 || keyPressed === 37) {
    square.movement.left = true;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    square.movement.right = true;
  }
  // SPACE
  else if(keyPressed === 32) {
    square.movement.space = true;
  }
};

const keyUpHandler = (e) => {
  var keyPressed = e.which;
  const square = squares[hash];
  
  
  // A OR LEFT
  if(keyPressed === 65 || keyPressed === 37) {
    square.movement.left = false;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    square.movement.right = false;
  }
  // SPACE
  else if(keyPressed === 32) {
    square.movement.space = false;
  }

};

const init = () => {
  walkImage = document.querySelector('#walk');
  slashImage = document.querySelector('#slash');
  
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('joined', setUser);
  socket.on('updatedMovement', update);
  socket.on('left', removeUser);

  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
};

window.onload = init;