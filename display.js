const Display = (function (/*api*/) {
  var api = {};

  // public api is a function
  api.draw = function () {
    //console.log(`draw`);
    const state = document.state;
    const ctx = state.ctx;
    const mindim = state.mindim;

    // FIXME: these functions do not need the entire state
    // for most, ctx, mindim, and various screen params should work
    drawBackground(state);
    ctx.save();
    ctx.beginPath();
    drawArc(ctx, 0, 0, 0.5 * mindim);
    ctx.clip();
    drawBorder(state);
    drawActive(state);
    drawNearby(state);
    drawPlayer(state);
    ctx.restore();
    drawRing(state);
    drawGamepad(state);


    if (state.touchCount % 2 == 0) {
      ctx.fillStyle = "blue";
      ctx.fillRect(-state.cx, -state.cy, 100, 100);
    }
  };

  // return the public API
  return api;
}());

var drawGamepad = (state) => {
  const ctx = state.ctx;
  const ratio = state.canvas.height / state.canvas.width;
  const mindim = state.mindim;
  // FIXME: gamepad dimensions
  ctx.lineWidth = 25;
  const x = 0;
  const y = 0;
  const r = (.15) * mindim + ctx.lineWidth / 2;
  ctx.strokeStyle = "lightgray";

  let red = parseInt(ctx.strokeStyle.substring(1, 3), 16);
  let green = parseInt(ctx.strokeStyle.substring(3, 5), 16);
  let blue = parseInt(ctx.strokeStyle.substring(5, 7), 16);

  ctx.strokeStyle = `rgba(${red},${green},${blue},0.25)`;
  ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;

  ctx.beginPath();
  drawArc(ctx, x, y, .1 * mindim);
  ctx.fill();
  ctx.beginPath();
  drawArc(ctx, x, y, r);
  ctx.stroke();

  // FIXME: set this up when the world is created
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

  state.coords = coords;

  // draw 8 buttons

  // draw center button
  ctx.beginPath();

  // make them glow regardless which event is handled
  // keyboard
  ctx.beginPath();
  let rGamepad = .025 * mindim;
  if (findInput(keybinds.up) || isPressing(coords.upper, rGamepad)) {
    drawArc(ctx, coords.upper.x, coords.upper.y, rGamepad);
  }
  if (findInput(keybinds.down) || isPressing(coords.lower, rGamepad)) {
    drawArc(ctx, coords.lower.x, coords.lower.y, rGamepad);
  }
  if (findInput(keybinds.left) || isPressing(coords.cleft, rGamepad)) {
    drawArc(ctx, coords.cleft.x, coords.cleft.y, rGamepad);
  }
  if (findInput(keybinds.right) || isPressing(coords.cright, rGamepad)) {
    drawArc(ctx, coords.cright.x, coords.cright.y, rGamepad);
  }
  rGamepad *= 4;
  if (findInput(keybinds.primary) || isPressing(coords.center, rGamepad)) {
    drawArc(ctx, coords.center.x, coords.center.y, rGamepad);
  }
  ctx.fill();

  drawGamepadInputs(state);

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
  const coords = state.coords;
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
  ctx.clearRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);
  ctx.beginPath();
  ctx.fillStyle = "dimgray";
  ctx.fillRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);
}

var drawBorder = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  ctx.beginPath();
  ctx.strokeStyle = "darkslategray";
  ctx.fillStyle = "sienna";
  ctx.lineWidth = 10;
  const r = mindim;
  const x = state.dx * mindim;
  const y = state.dy * mindim;
  drawArc(ctx, x, y, r);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "darkgreen";
  let red = parseInt(ctx.fillStyle.substring(1, 3), 16);
  let green = parseInt(ctx.fillStyle.substring(3, 5), 16);
  let blue = parseInt(ctx.fillStyle.substring(5, 7), 16);
  ctx.fillStyle = `rgba(${red},${green},${blue},0.5)`;
  ctx.fill();
  ctx.lineWidth = 1;

}

var drawPlayer = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  const r = .05 * mindim;
  ctx.beginPath();
  ctx.fillStyle = "lightgray";
  drawArc(ctx, 0, 0, r);
  ctx.fill();
}

var drawRing = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  ctx.beginPath();
  ctx.strokeStyle = "lightgray";
  // 20% radius ~1m
  drawArc(ctx, 0, 0, 0.1 * mindim);
  // fill unit circle ~5m
  drawArc(ctx, 0, 0, 0.5 * mindim);
  ctx.stroke();
}


var drawActive = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  ctx.beginPath();
  // TODO: make color fade per plant... somehow performantly
  ctx.fillStyle = "lightgray";
  for (plant of state.active) {
    if (plant.frame <= state.frame - (60 * 60)) {
      plant.frame = null;
      // FIXME: remove from active list/set
      continue;
    }
    x = (plant.x + state.dx) * mindim;
    y = (plant.y + state.dy) * mindim;
    r = plant.r * mindim;
    // TODO: hide distant active plants with clipping mask
    // FIXME: store cutoff in state then retrieve from there
    if (Math.hypot(x, y) > mindim / 2) continue;
    drawArc(ctx, x, y, r);
  }
  ctx.fill();

}

var drawNearby = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;

  for (plant of state.nearby) {
    let x = (plant.x + state.dx) * mindim;
    let y = (plant.y + state.dy) * mindim;
    let r = plant.r * mindim;
    let c = (plant.t == "grass") ? "lawngreen" : "darkgreen";
    ctx.beginPath();
    drawArc(ctx, x, y, r);
    ctx.fillStyle = c;
    ctx.fill();
  }

}

var drawArc = (ctx, x, y, r, params = {}) => {
  let start = params.start || 0;
  let end = params.end || Math.PI * 2;
  ctx.moveTo(x + r, y);
  ctx.arc(x, y, r, start, end);
}
