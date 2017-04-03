const xxh = require('xxhashjs');
const child = require('child_process');
const Character = require('./messages/Character.js');
const Message = require('./messages/Message.js');

let charList = {};

let io;

const directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2,
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5,
  UPRIGHT: 6,
  UP: 7,
};

const physics = child.fork('./server/physics.js');

physics.on('message', (m) => {
  switch (m.type) {
    case 'charList': {
      io.sockets.in('room1').emit('updatedMovement', m.data);
      charList = m.data;
      break;
    }
    default: {
      console.log('received unknown type');
    }
  }
});

physics.on('error', (error) => {
  console.dir(error);
});

physics.on('close', (code, signal) => {
  console.log('Child closed');
});

physics.on('exit', (code, signal) => {
  console.log('Child exited');
});


const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    socket.join('room1');

    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

    charList[hash] = new Character(hash);

    socket.hash = hash;

    socket.emit('joined', charList[hash]);
    
    physics.send(new Message('char', charList[hash]));
    

    socket.on('movementUpdate', (data) => {
      if (charList[socket.hash] === undefined) {
        socket.join('room1');

        const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

        charList[hash] = new Character(hash);

        socket.hash = hash;

        socket.emit('joined', charList[hash]);

        physics.send(new Message('char', charList[hash]));
      }
      
      charList[socket.hash].movement = data;
      charList[socket.hash].lastUpdate = new Date().getTime();
      
      physics.send(new Message('charMoved', { hash: socket.hash, movement: charList[socket.hash].movement }));
    });

    socket.on('disconnect', () => {
      io.sockets.in('room1').emit('left', charList[socket.hash]);
      delete charList[socket.hash];
      
      physics.send(new Message('charList', charList));

      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
