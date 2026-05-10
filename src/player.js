// player.js

export const Player = {

  // basically, take the buttons and mouse changes and create vectors
  play(state, input) {

    // take the inputs and normalize them
    // keyboard
    const mk = moveKeyboard(input.keys);
    const mp = movePointer(input.pointer);
    // mouse
    // touch

    // console.log(input.pointer);

    // dist (x, y)
    // min ( dragMax , dist
    // angle atan2 (y, x)
    // atan2 ( dist, angle )

    // state.player.isWalking=false;
    state.vector = {x:0,y:0};

    if (mk) {
      // basically, 
      state.vector = mk;
    } else if (mp) {

      console.log(mp);
      state.vector = mp;
    }

    state.player.isWalking = state.vector.x != 0 || state.vector.y != 0;
      
  },

};

function movePointer(pointer) {

  const distX = pointer.currentX - pointer.originX;
  const distY = pointer.currentY - pointer.originY;

  const distSq = distX*distX + distY*distY;
  const distRatio = Math.min((pointer.dragMax)/Math.sqrt(distSq), 1);

  if (pointer.pointerId===null || distSq <= pointer.dragMin * pointer.dragMin) return null;
  return normalize({x:distX*distRatio, y:distY*distRatio});


  // calculate the distance between origin and current
  // find dragMin and dragMax
  // tweak speed by percent of dragMax as a vector
};

function moveKeyboard(keys) {
  // console.log(keys);

  // ESDF
  // y = D - E
  // x = F - S 

  if (!(keys.has("KeyF")||keys.has("ArrowRight")||keys.has("KeyS")||keys.has("ArrowLeft")||
    keys.has("KeyD")||keys.has("ArrowDown")||keys.has("KeyE")||keys.has("ArrowUp"))) {

    return null;
  }

  return normalize ({
    x: (keys.has("KeyF")||keys.has("ArrowRight")) 
    - (keys.has("KeyS")||keys.has("ArrowLeft")),
    y: (keys.has("KeyD")||keys.has("ArrowDown")) 
      - (keys.has("KeyE")||keys.has("ArrowUp"))
  });
};

function normalize(vect={x:0, y:0}) {
  let lengthSq = vect.x*vect.x + vect.y*vect.y;
  if (lengthSq > 1) {
    let invLen = 1 / Math.sqrt(lengthSq);
    vect.x *= invLen;
    vect.y *= invLen;
  }
  return {x:vect.x, y:vect.y};
};