const Message = require('./messages/Message.js');

let charList = {};

const gravity = () => {
  const keys = Object.keys(charList);
  const characters = charList;

  for (let k = 0; k < keys.length; k++) {
    const char1 = characters[keys[k]];


    if (char1.movement.left) {
      char1.force.x -= 500;
    }
    if (char1.movement.right) {
      char1.force.x += 500;
    }

    if (char1.movement.space && char1.destY === 379 && char1.velocity.y <= 0.1) {
      char1.force.y += 50000;
    }

    char1.prevX = char1.destX;
    char1.prevY = char1.destY;

    // friction
    char1.force.x += char1.velocity.x * -1;

    char1.force.y += 169;

    char1.acceleration.x = char1.force.x;
    char1.acceleration.y = char1.force.y;

    char1.velocity.x += char1.acceleration.x * 0.02;
    char1.velocity.y += char1.acceleration.y * 0.02;

    char1.destX += char1.velocity.x * 0.02;
    char1.destY += char1.velocity.y * 0.02;


    if (char1.destY > 379) {
      char1.velocity.y *= -0.3;
      char1.destY = 379;
    }
    if (char1.destX > 439) {
      char1.velocity.x *= -0.5;
      char1.destX = 439;
    }
    if (char1.destX < 0) {
      char1.velocity.x *= -0.5;
      char1.destX = 0;
    }

    // console.log(char1.force);

    char1.acceleration = {
      x: 0,
      y: 0,
    };
    char1.force = {
      x: 0,
      y: 0,
    };


    char1.lastUpdate = new Date().getTime();
  }

  process.send(new Message('charList', charList));
};

setInterval(() => {
  gravity();
}, 20);


process.on('message', (messageObject) => {
  switch (messageObject.type) {
    case 'charList': {
      charList = messageObject.data;
      break;
    }
    case 'charMoved': {
      charList[messageObject.data.hash].movement = messageObject.data.movement;
      break;
    }
    case 'char': {
      const character = messageObject.data;
      charList[character.hash] = character;
      break;
    }
    default: {
      console.log('type not recognized');
    }
  }
});

