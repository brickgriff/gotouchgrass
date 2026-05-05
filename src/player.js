// player.js

export const Player = {

  // basically, take the buttons and mouse changes and create vectors
  play(state, input) {

    // take the inputs and normalize them
    // keyboard
    const vKeyboard = keyboard(input.buttons);
    // mouse
    // touch

    // dist (x, y)
    // min ( dragMax , dist
    // angle atan2 (y, x)
    // atan2 ( dist, angle )


    // basically, 
    state.vector = {};
  },

};

function keyboard(buttons) {

  console.log(buttons);

  return {x:0, y:0};
};