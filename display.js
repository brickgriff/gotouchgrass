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

  ctx.beginPath();
  ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;
  ctx.moveTo(x + r/2, y);
  ctx.arc(x, y, r/2, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";

  // save the eight points on gamepad for mouse/touch events

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
    if (plant.frame <= state.frame - 360) {
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
