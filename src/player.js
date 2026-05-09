// player.js

export const Player = {

  // basically, take the buttons and mouse changes and create vectors
  play(state, input) {

    // take the inputs and normalize them
    // keyboard
    const mk = moveKeyboard(input.keys);

    // mouse
    // touch

    // console.log(input.pointer);

    // dist (x, y)
    // min ( dragMax , dist
    // angle atan2 (y, x)
    // atan2 ( dist, angle )


    // basically, 
    state.player.isWalking = mk.x != 0 || mk.y != 0;
    state.vector = mk;
  },

};

function moveKeyboard(keys) {
  // console.log(keys);

  // ESDF
  // y = D - E
  // x = F - S 


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