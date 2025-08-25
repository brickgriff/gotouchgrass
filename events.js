const inputs = {
  buttons: [],
  mouse: {
    // mouse down
    x_: 0,
    y_: 0,
    // mousemove
    _x: 0,
    _y: 0,
    // to help normalize positions
    // TODO: should these be in terms of mindim units?
    dragMin: 10, // px
    dragMax: 50, // px
  },
};

function clearInputs() {
  inputs.buttons = [];
}
function pushInput(input) {
  const list = inputs.buttons;
  if (!findInput(input)) list.push(input);
}
function dropInput(input) {
  const list = inputs.buttons;
  if (findInput(input)) list.splice(list.indexOf(input), 1);
}
function findInput(input) {
  return (inputs.buttons.includes(input));
}
function getMouse() {
  return inputs.mouse;
}

function isPressing(vector, range) {
  if (!document.state.events.isPressed) return;
  const mouse = getMouse();
  const hypot = Math.hypot(mouse.x_ - vector.x, mouse.y_ - vector.y);
  return hypot < range;
}

// this should return [-1,1] for vector x and y
function getVector() {
  const mouse = getMouse(); //inputs.mouse;
  let dMax = mouse.dragMax;

  const vector = {};

  if (findInput(keybinds.mouseL)) {
    vector.x = mouse._x - mouse.x_;
    vector.y = mouse._y - mouse.y_;
  } else { // keyboard movement have "pointy" diagonals
    vector.x = (findInput(keybinds.right) - findInput(keybinds.left));
    vector.y = (findInput(keybinds.down) - findInput(keybinds.up));
    dMax = 1;
  }

  normalize(vector, dMax);

  return vector;
}

function getNewVector(vector, length, angle) {
  const _vector = {};
  _vector.x = vector.x + (length * Math.cos(angle));
  _vector.y = vector.y + (length * Math.sin(angle));
  return _vector;
}

function normalize(vector, max) {
  // direct length is useful for detecting input
  const hypot = Math.hypot(vector.x, vector.y); // can be as much as 1.4!
  const theta = Math.atan2(vector.y, vector.x); // can be a weird number (~0)

  // we need to normalize diagonals with the angle
  vector.x = Math.min(hypot / max, 1) * Math.cos(theta);
  vector.y = Math.min(hypot / max, 1) * Math.sin(theta);
}


// CHECK BROWSER FEATURES //
// TODO: practice with offscreen canvas
//const ctxOffscreen = canvas.getContext("2d", { willReadFrequently: true });
// TODO: ensure the browser supports innerWidth or clientWidth
if (typeof window === "undefined") {
  console.log("no window");
  try {
    throw new Error("no window");
  } catch (e) {
    console.log(e.message);
  }
}

// HANDLE WINDOW EVENTS //
// suppress system right click menu
window.addEventListener("contextmenu", (e) => { e.preventDefault() });

// trigger resize handler
window.addEventListener("resize", (e) => {
  // inputs.isResized=true;
  // console.log(document.getElementById("inputs").innerHtml);
  //document.getElementById("inputs").isResized=true;
  document.state.events.isResized = true;
});

window.addEventListener("keydown", (e) => {
  // e.preventDefault() 
  pushInput(e.code);
});

window.addEventListener("keyup", (e) => {
  dropInput(e.code);
});

window.addEventListener("mousedown", (e) => {
  e.preventDefault();
  pushInput(e.button);

  const state = document.state;
  const ctx = state.ctx;

  if (e.button === keybinds.mouseL) {
    inputs.mouse.x_ = inputs.mouse._x = e.offsetX - state.cx;
    inputs.mouse.y_ = inputs.mouse._y = e.offsetY - state.cy;

    state.events.isPressed = true;
    state.events.isClicked = false;
    state.events.isDragged = false;
  }

});

window.addEventListener("mouseup", (e) => {
  const state = document.state;
  state.events.isClicked = !state.events.isDragged;

  if (findInput(keybinds.mouseL)) {
    inputs.mouse._x = inputs.mouse.x_ = 0;
    inputs.mouse._y = inputs.mouse.y_ = 0;
    state.events.isDragged = false;
    state.events.isPressed = false;
  }
  dropInput(e.button);
});

window.addEventListener("mousemove", (e) => {
  const state = document.state;
  if (findInput(keybinds.mouseL)) {
    inputs.mouse._x = e.offsetX - state.cx;
    inputs.mouse._y = e.offsetY - state.cy;

    const dist = Math.hypot(inputs.mouse._x - inputs.mouse.x_, inputs.mouse._y - inputs.mouse.y_);
    inputs.mouse.isDragged = (dist >= inputs.mouse.dragMin);
  }
});


// FIXME: touch events

const ongoingTouches = [];

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id === idToFind) {
      return i;
    }
  }
  return -1; // not found
}


window.addEventListener("touchstart", (e) => {
  e.preventDefault();
  // pushInput(keybinds.mouseL);
  const state = document.state;
  const touch = e.changedTouches[0];

  const mouseEvent = new MouseEvent("mousedown", {
    button: keybinds.mouseL,
    offsetX: touch.screenX - state.cx,
    offsetY: touch.screenY - state.cy
  });
  state.canvas.dispatchEvent(mouseEvent);

  // if (e.changedTouches.length === 1) {
  //   const touch = e.changedTouches[0];
  //   inputs.mouse.x_ = inputs.mouse._x = touch.screenX - state.cx;
  //   inputs.mouse.y_ = inputs.mouse._y = touch.screenY - state.cy;

  //   state.events.isPressed = true;
  //   state.events.isClicked = false;
  //   state.events.isDragged = false;
  // }

});

var handleTouchFinish = (e) => {
  e.preventDefault()
  const state = document.state;

  const mouseEvent = new MouseEvent("mouseup", {
  });
  state.canvas.dispatchEvent(mouseEvent);
  // for (let i = 0; i < e.changedTouches.length; i++) {
  //   let index = ongoingTouchIndexById(e.changedTouches.identifier);
  //   //let touch=ongoingTouches[index];
  //   if (index === keybinds.mouseL) {
  //     inputs.mouse.x_ = inputs.mouse.x = state.player.x;
  //     inputs.mouse.y_ = inputs.mouse.y = state.player.y;
  //     //inputs.mouse._x=inputs.mouse.x_; 
  //     //inputs.mouse._y=inputs.mouse.y_;
  //     inputs.mouse.isDragged = false;
  //   }

  //   dropKey(index, state.keys);
  //   ongoingTouches.splice(index, 1);
  // }
};

window.addEventListener("touchend", handleTouchFinish);
window.addEventListener("touchcancel", handleTouchFinish);

window.addEventListener("touchmove", (e) => {
  e.preventDefault()
  const state = document.state;
  const touch = e.changedTouches[0];

  const mouseEvent = new MouseEvent("mousemove", {
    button: keybinds.mouseL,
    offsetX: touch.screenX - state.cx,
    offsetY: touch.screenY - state.cy
  });
  state.canvas.dispatchEvent(mouseEvent);
  // for (let i = 0; i < e.changedTouches.length; i++) {
  //   let index = ongoingTouchIndexById(e.changedTouches.identifier);
  //   //let touch=ongoingTouches[index];
  //   if (index === keybinds.mouseL) {
  //     inputs.mouse._x = e.offsetX;
  //     inputs.mouse._y = e.offsetY;

  //     let dist = Math.hypot(inputs.mouse._x - inputs.mouse.x_, inputs.mouse._y - inputs.mouse.y_);
  //     inputs.mouse.isDragged = (dist >= inputs.mouse.dragMin);
  //     //console.log(dist,inputs.mouse.isDragged);
  //   }

  //   dropKey(index, state.keys);
  //   ongoingTouches.splice(index, 1);
  // }

});

// FIXME: how to switch bw WASD and ESDF
let isUsingWASD = false;
const keybinds = {
  up: isUsingWASD ? "KeyW" : "KeyE",
  down: isUsingWASD ? "KeyS" : "KeyD",
  left: isUsingWASD ? "KeyA" : "KeyS",
  right: isUsingWASD ? "KeyD" : "KeyF",

  loosen: isUsingWASD ? "KeyQ" : "KeyW",
  tighten: isUsingWASD ? "KeyE" : "KeyR",
  tertiary: "ShiftLeft",
  secondary: "KeyF",
  primary: "Space",

  debug: "Backquote",
  menu: "Escape",

  mouseL: 0,
  mouseM: 1,
  mouseR: 2,

};
