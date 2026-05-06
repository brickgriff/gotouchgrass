// player.js

export const Player = {

  // basically, take the buttons and mouse changes and create vectors
  play(state, input) {

    // take the inputs and normalize them
    // keyboard
    const mk = moveKeyboard(input.buttons);

    // mouse
    // touch

    // dist (x, y)
    // min ( dragMax , dist
    // angle atan2 (y, x)
    // atan2 ( dist, angle )


    // basically, 
    state.vector = mk;
  },

};

function moveKeyboard(buttons) {
  // console.log(buttons);

  // ESDF
  // y = D - E
  // x = F - S 


  return normalize ({
    x: buttons.includes("KeyF") - buttons.includes("KeyS"),
    y: buttons.includes("KeyD") - buttons.includes("KeyE")
  });
};

function normalize(vect={x:0, y:0}) {
  let lengthSq = vect.x*vect.x + vect.y*vect.y;
  if (lengthSq > 1) {
    let invLen = 1 / Math.sqrt(lengthSq);
    vect.x *= invLen;
    vect.y *= invLen;
  }
  return {x:vect.x,y:vect.y};
};