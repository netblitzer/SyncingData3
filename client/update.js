const update = (data) => {
  const keys = Object.keys(data);
  
  for (let i = 0; i < keys.length; i++) {
    
    const sq = data[keys[i]];
    
    if(!squares[sq.hash]) {
      squares[sq.hash] = sq;
      return;
    }

    if(squares[sq.hash].lastUpdate >= sq.lastUpdate) {
      console.dir(squares[sq.hash].lastUpdate);
      //console.dir(sq.lastUpdate);
      return;
    }

    const square = squares[sq.hash];
    square.prevX = sq.prevX;
    square.prevY = sq.prevY;
    square.destX = sq.destX;
    square.destY = sq.destY;
    
    //square.movement = sq.movement;
    
    square.alpha = 0.05;
  }
  
};

const removeUser = (data) => {
  if(squares[data.hash]) {
    delete squares[data.hash];
  }
};

const setUser = (data) => {
  hash = data.hash;
  squares[hash] = data;
  requestAnimationFrame(redraw);
};