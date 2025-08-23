const Display = (function (/*api*/) {
  var api = {};

  // public api is a function
  api.draw = function () {
    //console.log(`draw`);
    const state = document.state;

    drawBackground(state);
    drawBorder(state);
    drawActive(state);
    drawNearby(state);
    drawPlayer(state);
    drawRing(state);
  };

  // return the public API
  return api;
}());

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

    x = (plant.x + state.dx) * mindim;
    y = (plant.y + state.dy) * mindim;
    r = plant.r * mindim;
    if (Math.hypot(x, y) > mindim / 2) continue;
    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }
  ctx.fill();

}

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

const COLORS = {
  BLACK: "black", GREEN: "green", GRAY: "gray", LIGHTGRAY: "lightgray",
  DARKGRAY: "darkgray", BLUE: "blue", GOLD: "gold", LIGHTBLUE: "lightblue", RED: "red",
  SPRINGGREEN: "springgreen", LAWNGREEN: "lawngreen", WHITE: "white", YELLOW: "yellow",
  CYAN: "cyan", MAGENTA: "magenta", DIMGRAY: "dimgray", DARKBLUE: "darkblue",
  DARKSLATEGRAY: "darkslategray", SOIL: "#7d644b", DEFAULT: "#cccccc"
};

const inputMap = [
  { x: 100, y: 100, r: 10, k: keybinds.up },
  { x: 75, y: 125, r: 10, k: keybinds.left },
  { x: 100, y: 125, r: 10, k: keybinds.down },
  { x: 125, y: 125, r: 10, k: keybinds.right },
  { x: 75, y: 100, r: 10, k: keybinds.loosen },
  { x: 125, y: 100, r: 10, k: keybinds.tighten },

  { x: 175, y: 100, r: 10, k: keybinds.secondary },
  { x: 150, y: 100, r: 10, k: keybinds.primary },
  { x: 200, y: 100, r: 10, k: keybinds.tertiary },
  { x: 150, y: 125, r: 10, k: keybinds.mouseL },
  { x: 175, y: 125, r: 10, k: keybinds.mouseM },
  { x: 200, y: 125, r: 10, k: keybinds.mouseR },

];

