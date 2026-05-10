// input.js

export const input = {
  keys: new Set(),
  // keyboard: {},
  mouse: {
    // mouse down
    originX: 0,
    originY: 0,
    // mousemove
    currentX: 0,
    currentY: 0,
    dragMin: .1,
    dragMax: 1,
  },
  pointer: {
    pointerId: null,
    // mouse down
    originX: 0,
    originY: 0,
    // mousemove
    currentX: 0,
    currentY: 0,
    dragMin: .5,
    dragMax: 5,
  },
};

// catch keyboard events
// store/remove keys accordingly
// when the player asks, give them input state

window.addEventListener("keydown", (e) => {
  // dev
  // e.preventDefault()
  if (!input.keys.has(e.code)) input.keys.add(e.code);

  // if (e.code !== keybinds.primary) return;

  // inputs.keyboard.x_ = inputs.keyboard._x = inputs.mouse._x || 0;
  // inputs.keyboard.y_ = inputs.keyboard._y = inputs.mouse._y || 0;

});

window.addEventListener("keyup", (e) => {
  if (input.keys.has(e.code)) input.keys.delete(e.code);

});

window.addEventListener("pointerdown", e => {
    // e.preventDefault()
  if (input.pointer.pointerId !== null) return;

  input.pointer.pointerId = e.pointerId;

  input.pointer.down = true;

  input.pointer.originX = e.clientX;
  input.pointer.originY = e.clientY;

  input.pointer.currentX = e.clientX;
  input.pointer.currentY = e.clientY;

});

window.addEventListener("pointerup", e => {
  if (input.pointer.pointerId === null) return;

  input.pointer.pointerId = null;

  input.pointer.down = false;

  input.pointer.originX = 0;
  input.pointer.originY = 0;

  input.pointer.currentX = 0;
  input.pointer.currentY = 0;

});

window.addEventListener("pointermove", e => {
  if (input.pointer.pointerId === null) return;

  // input.pointer.pointerId = null;

  // input.pointer.down = false;

  // input.pointer.originX = 0;
  // input.pointer.originY = 0;

  input.pointer.currentX = e.clientX;
  input.pointer.currentY = e.clientY;

});


