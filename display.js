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
    drawBorder(state);
    drawNearby(state);
    drawActive(state);
    // ctx.save();
    // ctx.beginPath();
    // ctx.rect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);
    // drawArc(ctx, 0, 0, 0.5 * mindim, { acw: true });
    // ctx.clip();
    // ctx.beginPath();
    // ctx.fillStyle = "lightgray";
    // let red = parseInt(ctx.fillStyle.substring(1, 3), 16);
    // let green = parseInt(ctx.fillStyle.substring(3, 5), 16);
    // let blue = parseInt(ctx.fillStyle.substring(5, 7), 16);
    // ctx.fillStyle = `rgba(${red},${green},${blue},0.75)`;
    // ctx.fillRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);
    // ctx.restore();

    Observations.draw();

    drawPlayer(state);
    drawRing(state);

    // let rectX = -.9 * state.cx;
    // let rectY = mindim * .5 + .1 * state.cx;
    // let rectW = 1.8 * state.cx;
    // let rectH = state.canvas.height - (state.cy + rectY + .1 * state.cx);

    // if (rectW > 100 && rectH > 100) {
    //   ctx.save();
    //   // ctx.strokeStyle = "#444";
    //   // ctx.strokeRect(rectX, rectY, rectW, rectH);
    //   ctx.fillStyle = "#444";
    //   ctx.strokeStyle = "#444";
    //   ctx.fillRect(rectX + 5, rectY + 5, rectW - 10, rectH - 10);
    //   ctx.lineWidth = 10;
    //   ctx.lineCap = "round";
    //   ctx.beginPath();
    //   ctx.moveTo(rectX + 5, rectY + 5);
    //   ctx.lineTo(rectX + rectW - 5, rectY + 5);
    //   ctx.moveTo(rectX + rectW - 5, rectY + 5);
    //   ctx.lineTo(rectX + rectW - 5, rectY + rectH - 5);
    //   ctx.moveTo(rectX + rectW - 5, rectY + rectH - 5);
    //   ctx.lineTo(rectX + 5, rectY + rectH - 5);
    //   ctx.moveTo(rectX + 5, rectY + rectH - 5);
    //   ctx.lineTo(rectX + 5, rectY + 5);

    //   ctx.stroke();
    //   ctx.restore();
    // }

    // drawGamepad(state);
    drawNav(state);

  };

  // return the public API
  return api;
}());

var drawNav = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  const mouse = getMouse();
  if (!state.events.isPressed) return;
  ctx.strokeStyle = "lightgray";
  ctx.fillStyle = "lightgray";
  ctx.beginPath();
  drawArc(ctx, mouse.x_, mouse.y_, mindim * .1);
  ctx.stroke();
  // ctx.save();
  // ctx.beginPath();
  // drawArc(ctx, mouse.x_, mouse.y_, mindim * .1);
  // ctx.clip();
  if (!state.events.isDragged) return;
  ctx.beginPath();
  const hypot = Math.min(mindim * .1, Math.hypot(mouse._x - mouse.x_, mouse._y - mouse.y_));
  const angle = Math.atan2(mouse._y - mouse.y_, mouse._x - mouse.x_);

  const x = hypot * Math.cos(angle);
  const y = hypot * Math.sin(angle);
  drawArc(ctx, x + mouse.x_, y + mouse.y_, mindim * .05);
  ctx.fill();
  // ctx.restore();
}

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

  // let red = parseInt(ctx.strokeStyle.substring(1, 3), 16);
  // let green = parseInt(ctx.strokeStyle.substring(3, 5), 16);
  // let blue = parseInt(ctx.strokeStyle.substring(5, 7), 16);

  // ctx.strokeStyle = `rgba(${red},${green},${blue},0.25)`;
  // ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;

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

  // mouse
  // touch
  // const highlight = state.gamepad.highlight
  // make this area glow

  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  drawGamepadInputs(state);

}

var drawGamepadInputs = (state) => {
  const ctx = state.ctx;
  const coords = state.coords;
  ctx.beginPath();
  ctx.fillStyle = "lightgray";
  ctx.strokeStyle = "dimgray";
  ctx.lineWidth = 1;
  ctx.font = "25px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  outlineText(ctx, "Space", coords.center.x, coords.center.y);
  outlineText(ctx, "E", coords.upper.x, coords.upper.y);
  outlineText(ctx, "S", coords.cleft.x, coords.cleft.y);
  outlineText(ctx, "D", coords.lower.x, coords.lower.y);
  outlineText(ctx, "F", coords.cright.x, coords.cright.y);
}

var outlineText = (ctx, text, x, y) => {
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);
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
  ctx.strokeStyle = "darkslategray"; // weed barrier
  ctx.fillStyle = "sienna"; // soil
  ctx.lineWidth = 25;
  const r = mindim;
  const x = state.dx * mindim;
  const y = state.dy * mindim;
  drawArc(ctx, x, y, r);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  drawArc(ctx, x, y, r * .97);
  ctx.clip();

  ctx.beginPath();
  ctx.fillStyle = "#151";
  drawArc(ctx, x, y, r * .97);
  ctx.fill();
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "darkolivegreen";
  for (let i = -20; i < 20; i++) {
    ctx.lineTo(-mindim + x - (2 * i * mindim / 10), -mindim + y);
    ctx.lineTo(x - (2 * i * mindim / 10), mindim + y);
  }
  ctx.stroke();

  ctx.restore();
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
  ctx.strokeStyle = "lightgray";
  // ctx.lineWidth = 3;
  // ctx.beginPath();
  // // fill unit circle ~5m
  // drawArc(ctx, 0, 0, 0.5 * mindim);
  // ctx.stroke();
  // ctx.lineWidth = 1;
  ctx.beginPath();
  // 20% radius ~1m
  drawArc(ctx, 0, 0, 0.1 * mindim);
  ctx.stroke();
}


var drawActive = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  ctx.beginPath();
  ctx.lineWidth = 1;
  // TODO: make color fade per plant... somehow performantly
  ctx.fillStyle = "darkgreen";
  ctx.strokeStyle = "darkolivegreen";
  for (plant of state.active) {
    x = (plant.x + state.dx) * mindim;
    y = (plant.y + state.dy) * mindim;
    r = plant.r * mindim;
    if (Math.hypot(x, y) > mindim * .5) continue;
    drawArc(ctx, x, y, r);
  }
  ctx.fill();
  ctx.stroke();

}

var drawNearby = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;

  for (plant of state.nearby) {
    let x = (plant.x + state.dx) * mindim;
    let y = (plant.y + state.dy) * mindim;
    let r = plant.r * mindim;
    let c = "darkgreen";//(plant.t == "grass") ? "lawngreen" : "darkgreen";
    ctx.beginPath();
    drawArc(ctx, x, y, r);
    ctx.fillStyle = c;
    // ctx.strokeStyle = "lawngreen";
    ctx.fill();
    // ctx.stroke();
  }

}

var drawArc = (ctx, x, y, r, params = {}) => {
  let start = params.start || 0;
  let end = params.end || Math.PI * 2;

  let theta = Math.atan2(Math.sin(start), Math.cos(start));
  ctx.moveTo(x + r * Math.cos(theta), y + r * Math.sin(theta));
  ctx.arc(x, y, r, start, end, params.acw || false);
}
