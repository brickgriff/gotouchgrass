const Display = (function (/*api*/) {
  var api = {};

  // public api is a function
  api.draw = function () {
    //console.log(`draw`);
    const state = document.state;

    // these functions do not need the entire state
    // for most, ctx, mindim, and various screen params should work
    drawBackground(state);
    drawBorder(state);
    drawActive(state);
    drawNearby(state);
    drawPlayer(state);
    drawRing(state);
    drawGamepad(state);
  };

  // return the public API
  return api;
}());

var drawGamepad = (state) => {
  const ctx = state.ctx;
  const ratio = state.canvas.height / state.canvas.width;
  const mindim = state.mindim;
  const r = .1 * Math.max(0, Math.min(2, ratio)) * mindim;
  const x = 0;
  const y = state.cy - (r + 50);

  ctx.lineWidth = 50;

  ctx.strokeStyle = "lightgray";

  let red = parseInt(ctx.strokeStyle.substring(1, 3), 16);
  let green = parseInt(ctx.strokeStyle.substring(3, 5), 16);
  let blue = parseInt(ctx.strokeStyle.substring(5, 7), 16);

  ctx.beginPath();
  ctx.strokeStyle = `rgba(${red},${green},${blue},0.25)`;
  ctx.moveTo(x + r, y);
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();


  // save the eight points on gamepad for mouse/touch events
  // so that state knows where event listeners should be
  // GOTO world.js
  const coords = {};
  coords.center = { x: x, y: y };

  // 0 +/- 22.5 => right
  coords.cright = getNewVector(coords.center, r, (0));
  // 45 +/- 22.5 => upperright
  coords.uright = getNewVector(coords.center, r, -0.25 * Math.PI);
  // 90 +/- 22.5 => up
  coords.upper = getNewVector(coords.center, r, -0.5 * Math.PI);
  // ...
  coords.uleft = getNewVector(coords.center, r, -0.75 * Math.PI);
  coords.cleft = getNewVector(coords.center, r, 1 * Math.PI);
  coords.lleft = getNewVector(coords.center, r, .75 * Math.PI);
  // 315 +/- 22.5 => lowerright
  coords.lower = getNewVector(coords.center, r, 0.5 * Math.PI);
  coords.lright = getNewVector(coords.center, r, 0.25 * Math.PI);

  state.gamepad = {};
  state.gamepad.coords = coords;
  state.gamepad.innerRadius = r / 2;
  state.gamepad.outerRadius = r;
  // draw 8 buttons

  // draw center button
  ctx.beginPath();
  ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;
  ctx.moveTo(x + r / 2, y);
  ctx.arc(x, y, r / 2, 0, Math.PI * 2);
  ctx.fill();

  drawGamepadInputs(state);

  // make them glow regardless which event is handled
  // keyboard
  if (findInput(keybinds.up) || isPressing(coords.upper, r / 2)) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;
    ctx.moveTo(coords.upper.x + r / 2, coords.upper.y);
    ctx.arc(coords.upper.x, coords.upper.y, r / 2, 0, Math.PI * 2);
    ctx.fill();
    pushInput(keybinds.up);
  }
  if (findInput(keybinds.down) || isPressing(coords.lower, r / 2)) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;
    ctx.moveTo(coords.lower.x + r / 2, coords.lower.y);
    ctx.arc(coords.lower.x, coords.lower.y, r / 2, 0, Math.PI * 2);
    ctx.fill();
    pushInput(keybinds.down);
  }
  if (findInput(keybinds.left) || isPressing(coords.cleft, r / 2)) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;
    ctx.moveTo(coords.cleft.x + r / 2, coords.cleft.y);
    ctx.arc(coords.cleft.x, coords.cleft.y, r / 2, 0, Math.PI * 2);
    ctx.fill();
    pushInput(keybinds.left);
  }
  if (findInput(keybinds.right) || isPressing(coords.cright, r / 2)) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;
    ctx.moveTo(coords.cright.x + r / 2, coords.cright.y);
    ctx.arc(coords.cright.x, coords.cright.y, r / 2, 0, Math.PI * 2);
    ctx.fill();
    pushInput(keybinds.right);
  }
  if (findInput(keybinds.primary) || isPressing(coords.center, r / 2)) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;
    ctx.moveTo(coords.center.x + r / 2, coords.center.y);
    ctx.arc(coords.center.x, coords.center.y, r / 2, 0, Math.PI * 2);
    ctx.fill();
    pushInput(keybinds.primary);
  }

  // mouse
  // touch
  // const highlight = state.gamepad.highlight
  // make this area glow

  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";

}

var drawGamepadInputs = (state) => {
  const ctx = state.ctx;
  const coords = state.gamepad.coords;
  ctx.beginPath();
  ctx.fillStyle = "lightgray";
  ctx.font = "25px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Space", coords.center.x, coords.center.y);
  ctx.fillText("E", coords.upper.x, coords.upper.y);
  ctx.fillText("S", coords.cleft.x, coords.cleft.y);
  ctx.fillText("D", coords.lower.x, coords.lower.y);
  ctx.fillText("F", coords.cright.x, coords.cright.y);
}

var drawBackground = (state) => {
  // draw background
  const ctx = state.ctx;
  ctx.fillStyle = "dimgray";
  ctx.fillRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);
}

var drawBorder = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  ctx.beginPath();
  ctx.strokeStyle = "darkslategray";
  ctx.lineWidth = 10;
  const r = mindim;
  const x = state.dx * mindim;
  const y = state.dy * mindim;
  ctx.moveTo(r + x, y);
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1;

}

var drawPlayer = (state) => {
  // draw center dot
  const ctx = state.ctx;
  const mindim = state.mindim;
  const pr = .05 * mindim;
  ctx.beginPath();
  ctx.fillStyle = "lightgray";
  ctx.arc(0, 0, pr, 0, Math.PI * 2);
  ctx.fill();

}

var drawRing = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  ctx.beginPath();
  ctx.strokeStyle = "lightgray";
  ctx.moveTo(0 + 0.5 * mindim, 0);
  ctx.arc(0, 0, 0.5 * mindim, 0, Math.PI * 2);
  ctx.moveTo(0 + 0.1 * mindim, 0);
  ctx.arc(0, 0, 0.1 * mindim, 0, Math.PI * 2);
  ctx.stroke();
}

var drawActive = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  ctx.beginPath();
  ctx.fillStyle = "lightgray";
  for (plant of state.active) {
    if (plant.frame <= state.frame - 6 * 360) {
      plant.frame = null;
      continue;
    }
    x = (plant.x + state.dx) * mindim;
    y = (plant.y + state.dy) * mindim;
    r = plant.r * mindim;
    if (Math.hypot(x, y) > mindim / 2) continue;
    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }
  ctx.fill();

}

// TODO: break this up if possible
var drawNearby = (state) => {
  // draw plant circles
  const ctx = state.ctx;
  const mindim = state.mindim;

  let x = 0;
  let y = 0;
  let r = 0;

  x = (.1 + state.dx) * mindim;
  y = (-.1 + state.dy) * mindim;
  r = .01 * mindim;

  if (Math.hypot(x, y) < mindim / 2) {
    ctx.beginPath();
    ctx.strokeStyle = "lawngreen";
    ctx.fillStyle = "lawngreen";
    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }

  for (plant of state.nearby) {

    x = (plant.x + state.dx) * mindim;
    y = (plant.y + state.dy) * mindim;
    r = plant.r * mindim;
    let c = plant.t == "grass" ? "lawngreen" : "darkgreen";
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.fillStyle = c;
    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }

}
