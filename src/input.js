// input.js

export const input = {
  buttons: [],
  keyboard: {},
  mouse: {
    // mouse down
    x_: 0,
    y_: 0,
    // mousemove
    _x: 0,
    _y: 0,
    // to help normalize positions
    // TODO: should these be in terms of mindim units?
    dragMin: .01, // mindim
    dragMax: 1, // mindim
  },
};

// catch keyboard events
// store/remove keys accordingly
// when the player asks, give them input state

window.addEventListener("keydown", (e) => {
  // dev
  // e.preventDefault()
  if (!input.buttons.includes(e.code)) input.buttons.push(e.code);

  // if (e.code !== keybinds.primary) return;

  // inputs.keyboard.x_ = inputs.keyboard._x = inputs.mouse._x || 0;
  // inputs.keyboard.y_ = inputs.keyboard._y = inputs.mouse._y || 0;

});

window.addEventListener("keyup", (e) => {
  if (input.buttons.includes(e.code)) input.buttons.splice(input.buttons.indexOf(e.code), 1);

});

