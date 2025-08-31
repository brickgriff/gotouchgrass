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
    clear(state);
    drawBackground(state);
    if (!state.terrain) {
      // console.log("once");
      saveTerrain(state);
      state.terrain = true;
    }
    // drawTerrain(state);
    // TODO when drawing glass, clip out the center circle
    // then apply blur and draw the terrain again
    // then draw the glass layer without blur
    // final restore context settings
    // ctx.save();
    // ctx.filter = "blur(4px)";
    // drawBorder(state);
    // ctx.restore();
    // drawNearby(state);
    // drawActive(state);
    drawPlayer(state);
    drawRing(state);
    // Experience.draw();
    // Stamina.draw();
    // drawGamepad(state);
    drawNav(state);
    // drawMinimap(state);
  };

  // return the public API
  return api;

  function drawTerrain(state) {
    const x = -state.offscreen.width / 2 + state.dx * state.mindim;
    const y = -state.offscreen.height / 2 + state.dy * state.mindim;
    state.ctx.drawImage(state.offscreen, x, y);
  }

  function drawMinimap(state) {
    const ctx = state.ctx;
    const k = state.mindim * .5;
    const miniX = -k / 2;
    const miniY = -state.cy + k / 4;
    // ctx.beginPath();
    // ctx.lineWidth = .01 * state.mindim;
    // ctx.fillStyle = colors.tertiary;
    // ctx.strokeStyle = colors.secondary;
    // drawArc(ctx, miniX + k / 2, miniY + k / 2, .2 * state.mindim);
    // ctx.fill();
    // ctx.stroke();
    const miniW = k;
    const miniH = k;
    ctx.drawImage(state.offscreen, miniX, miniY, miniW, miniH);

    const mindim = state.mindim;
    ctx.beginPath();
    ctx.fillStyle = colors.emergent;
    drawArc(ctx, miniX + k / 2 + state.dx * mindim * -.2, miniY + k / 2 + state.dy * mindim * -.2, .01 * state.mindim);
    ctx.fill();
  }

  function saveTerrain(state) {
    // drawBorder(state);
    drawGround(state);
    drawFoliage(state);
    drawLitter(state);
    drawRocks(state);
    drawGate(state);
  }

}());


var drawNav = (state) => {

  const ctx = state.ctx;
  const mindim = state.mindim;
  const mouse = getMouse();

  if (!state.events.isPressed && !state.events.isKeyboard) return;
  
  ctx.strokeStyle = colors.emergent;
  ctx.fillStyle = colors.emergent;
  
  ctx.lineWidth = .002 * mindim; // ~ 1mm, i think

  if (!state.events.isDragged) {
    ctx.beginPath();
    drawArc(ctx, 0, 0, mindim * .1);
    ctx.stroke();
  }

  var r = mindim * .1;
  if (state.events.isKeyboard) {
    mouse.x_ = mouse._x; // state.inputs.keyboard.x_;
    mouse.y_ = mouse._y; // state.inputs.keyboard.y_;
  }

  if ((!state.events.isDragged && state.events.isPressed) || state.events.isKeyboard) {
    r = mindim * .05;
    state.stamina = Math.max(0, state.stamina - .05);
    state.isClicked = false;
  }

  ctx.strokeStyle = colors.emergent;
  ctx.fillStyle = colors.emergent;
  ctx.beginPath();
  drawArc(ctx, mouse.x_, mouse.y_, r);
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
  ctx.strokeStyle = colors.emergent;

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

var clear = (state) => {
  const ctx = state.ctx;
  ctx.clearRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);
}

var drawBackground = (state) => {
  const ctx = state.ctx;//;

  // draw background
  // ctx.fillStyle = colors.emergent;
  // ctx.fillRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);

  // color dot test
  const mindim = state.mindim;
  state.dotTest = true;
  if (state.dotTest) {
    const r = 0.1 * mindim;
    const offsetX = state.dx * mindim;
    const offsetY = state.dy * mindim;

    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    drawArc(ctx, -r * 2.5 + offsetX, offsetY, r); // ~ 1
    ctx.fill();

    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    drawArc(ctx, r * 2.5 + offsetX, offsetY, r); // ~ 1
    ctx.fill();

    ctx.fillStyle = colors.tertiary;
    ctx.beginPath();
    drawArc(ctx, offsetX, -r * 2.5 + offsetY, r); // ~ 1
    ctx.fill();

    ctx.fillStyle = colors.emergent;
    ctx.beginPath();
    drawArc(ctx, offsetX, r * 2.5 + offsetY, r); // ~ 1
    ctx.fill();

    const hypot = Math.hypot(offsetX, r * 2.5 + offsetY);

    if (hypot < .15 * mindim) {
      state.events.isRingEnabled = true;
    } else {
      state.events.isRingEnabled = false;
    }
  }
}

var drawBorder = (state) => {
  const ctx = state.ctx; //offscreen.getContext("2d");
  const mindim = state.mindim;

  const r = mindim;
  const x = state.dx * mindim;
  const y = state.dy * mindim;

  ctx.beginPath();
  ctx.strokeStyle = colors.secondary; // weed barrier
  ctx.lineWidth = .01 * mindim;
  const animLength = 25;
  const seriesGap = .5 * ctx.lineWidth;
  const limit = .02 * ctx.lineWidth * animLength + seriesGap * (animLength - 2);
  for (let i = 0; i < animLength; i++) {
    const rate = .01;
    const dr = (seriesGap * i + ctx.lineWidth * state.frame * rate) % limit;
    // if (r1 > limit) r1 - limit;
    drawArc(ctx, x, y, r + dr ** 2);
  }
  ctx.stroke();


}

var drawPlayer = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  const r = .05 * mindim;
  ctx.beginPath();
  ctx.fillStyle = colors.emergent;
  ctx.strokeStyle = colors.umbral;
  ctx.lineWidth = .01 * r;
  drawArc(ctx, 0, 0, r);
  ctx.fill();
  ctx.stroke();
}

var drawRing = (state) => {

  if (!state.events.isRingEnabled && !state.events.isRingLocked) return;

  const ctx = state.ctx;
  const mindim = state.mindim; // mindim ~ 10m
  ctx.lineWidth = .003 * mindim; // ~ 1mm, i think
  ctx.strokeStyle = colors.umbral;
  ctx.beginPath();
  // drawArc(ctx, 0, 0, 0.5 * mindim);
  drawArc(ctx, 0, 0, 0.1 * mindim);
  ctx.stroke();

  ctx.strokeStyle = colors.emergent;
  ctx.lineWidth = .002 * mindim; // ~ 1mm, i think
  ctx.beginPath();
  // drawArc(ctx, 0, 0, 0.5 * mindim);
  drawArc(ctx, 0, 0, 0.1 * mindim);
  ctx.stroke();


}


var drawActive = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  ctx.beginPath();
  ctx.lineWidth = .002 * mindim;
  // TODO: make color fade per plant... somehow performantly
  ctx.fillStyle = colors.primary; // with a pattern mask?
  ctx.strokeStyle = colors.emergent; // tertiary with stamina system
  for (plant of state.active) {
    if (!plant.leaves || plant.leaves < 0.09) continue;
    x = (plant.x + state.dx) * mindim;
    y = (plant.y + state.dy) * mindim;
    r = plant.r * mindim;
    drawArc(ctx, x, y, r);
  }
  ctx.fill();
  ctx.stroke();


}

var drawGround = (state) => {
  const ctx = state.offscreen.getContext("2d");
  const mindim = state.mindim;
  const r = mindim;
  const x = state.dx;
  const y = state.dy;

  ctx.beginPath();
  ctx.fillStyle = colors.emergent; // soil
  ctx.lineWidth = .05 * mindim;
  drawArc(ctx, x, y, r);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  drawArc(ctx, x, y, r * .97);
  ctx.clip();

  // ctx.beginPath();
  // ctx.fillStyle = "#151";
  // drawArc(ctx, x, y, r);
  // ctx.fill();
  ctx.beginPath();
  ctx.lineWidth = .02 * mindim;
  ctx.strokeStyle = colors.tertiary;
  for (let i = -50; i < 50; i++) {
    ctx.lineTo(mindim + x - (i * mindim / 30), -mindim + y);
    ctx.lineTo(x - (i * mindim / 30), mindim + y);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = .05 * mindim;
  ctx.strokeStyle = colors.primary;
  for (let i = -20; i < 20; i++) {
    ctx.lineTo(-mindim + x - (2 * i * mindim / 10), -mindim + y);
    ctx.lineTo(x - (2 * i * mindim / 10), mindim + y);
  }
  ctx.stroke();

  ctx.restore();

}

var drawRocks = (state) => {

}
var drawRocks = (state) => {

}
var drawLitter = (state) => {

}
var drawGate = (state) => {
  const ctx = state.offscreen.getContext("2d");
  const mindim = state.mindim;
  const r = .3 * mindim;
  const x = state.dx * mindim;
  const y = state.dy * mindim;

  ctx.fillStyle = colors.emergent;
  ctx.fillRect(-r / 2, -mindim - r * .1, r, r * .4);
}

var drawFoliage = (state) => {
  const ctx = state.offscreen.getContext("2d");
  const mindim = state.mindim;

  var r1 = .1 * state.mindim;
  ctx.lineWidth = .05 * state.mindim;
  ctx.strokeStyle = colors.tertiary;
  // context.beginPath();
  // context.arc(0, 0, r * .71, 0, Math.PI * 2);
  // context.stroke();
  // TODO alternate the pattern

  // tree stump
  ctx.beginPath();
  ctx.arc(0, 0, r1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colors.emergent;
  ctx.lineWidth = .004 * state.mindim;

  ctx.beginPath();
  drawArc(ctx, 0, 0, r1 + .025 * mindim);
  ctx.stroke();

  ctx.lineWidth = .002 * state.mindim;

  ctx.beginPath();
  drawArc(ctx, 0, 0, r1 + .019 * mindim);
  drawArc(ctx, 0, .003 * mindim, r1 - .020 * mindim);
  drawArc(ctx, 0, -.002 * mindim, r1 + .014 * mindim);
  drawArc(ctx, -.001 * mindim, 0, r1 - .009 * mindim);
  drawArc(ctx, 0, 0, r1 + .005 * mindim);
  ctx.stroke();

  ctx.beginPath();
  for (plant of state.plants || []) {
    let x = (plant.x) * mindim;
    let y = (plant.y) * mindim;
    let r = plant.r * mindim;
    let c = colors.primary;//(plant.t == "grass") ? "lawngreen" : "darkgreen";
    ctx.fillStyle = c;

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
    let c = colors.primary;//(plant.t == "grass") ? "lawngreen" : "darkgreen";
    ctx.beginPath();
    drawArc(ctx, x, y, r);
    ctx.fillStyle = c;
    // ctx.strokeStyle = "lawngreen";
    // ctx.fill();
    // ctx.stroke();
  }

}

function makeTransparent(ctx, style, alpha) {
  let red = parseInt(ctx[style].substring(1, 3), 16);
  let green = parseInt(ctx[style].substring(3, 5), 16);
  let blue = parseInt(ctx[style].substring(5, 7), 16);
  // let alpha = Math.min(1, (ratio));
  ctx[style] = `rgba(${red},${green},${blue},${alpha})`;
}


var drawArc = (ctx, x, y, r, params = {}) => {
  let start = params.start !== undefined ? params.start : 0;
  let end = params.end !== undefined ? params.end : Math.PI * 2;

  let theta = Math.atan2(Math.sin(start), Math.cos(start));
  ctx.moveTo(x + r * Math.cos(theta), y + r * Math.sin(theta));
  ctx.arc(x, y, r, start, end, params.acw || false);
}

/*
 * #####   #####   #####   #####     #
 * #         #     #   #   #   #     #
 * #####     #     #   #   #####     #
 *     #     #     #   #   #
 * #####     #     #####   #         #
 *
 * #####   #####   #   #   #   #   #####   #   #   #####   #####     #
 * #       #   #   ## ##   ## ##   #       ##  #     #     #         #
 * #       #   #   # # #   # # #   ###     # # #     #     #####     #
 * #       #   #   #   #   #   #   #       #  ##     #         #
 * #####   #####   #   #   #   #   #####   #   #     #     #####     #
 */


// ctx.beginPath();
// ctx.strokeStyle = colors.secondary; // with a pattern mask?
// for (plant of state.active) {
//   if (!plant.flowers || plant.flowers < 0.009) continue;
//   x = (plant.x + state.dx) * mindim;
//   y = (plant.y + state.dy) * mindim;
//   r = plant.r * mindim;
//   drawArc(ctx, x, y, r);
// }
// ctx.stroke();


// ctx.strokeStyle = colors.emergent; // weed barrier
// ctx.beginPath();
// ctx.lineWidth = .05 * mindim;
// drawArc(ctx, x, y, r + ctx.lineWidth * 2);
// ctx.stroke();


// // something about drawing the border

// var offScreenCanvas = state.offscreen;
// var context = offScreenCanvas.getContext("2d");
// context.lineWidth = .1 * state.mindim;

// context.fillStyle = colors.primary;
// context.strokeStyle = colors.tertiary;
// context.save();
// context.beginPath();
// context.rect(-offScreenCanvas.width / 2, -offScreenCanvas.height / 2, offScreenCanvas.width, offScreenCanvas.height);
// context.arc(0, 0, mindim * 1.1, 0, Math.PI * 2, true);
// context.clip();
// context.fillRect(-offScreenCanvas.width / 2, -offScreenCanvas.height / 2, offScreenCanvas.width, offScreenCanvas.height);
// context.strokeRect(-offScreenCanvas.width / 2, -offScreenCanvas.height / 2, offScreenCanvas.width, offScreenCanvas.height);
// context.restore();

// // -- glass panel --
// if (state.glassLayer = true) {
//   ctx.save();
//   ctx.beginPath();
//   ctx.rect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);
//   drawArc(ctx, 0, 0, mindim*.5, { acw: true });
//   ctx.clip();
//   ctx.filter = "blur(5px)";
//   ctx.beginPath();
//   ctx.lineWidth = .005 * mindim;
//   ctx.fillStyle = colors.emergent;//"lightgray";
//   ctx.strokeStyle = colors.emergent;//"lightgray";
//   let red = parseInt(ctx.fillStyle.substring(1, 3), 16);
//   let green = parseInt(ctx.fillStyle.substring(3, 5), 16);
//   let blue = parseInt(ctx.fillStyle.substring(5, 7), 16);
//   ctx.fillStyle = `rgba(${red},${green},${blue},0.75)`;
//   ctx.fillRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height / 8);
//   drawArc(ctx, 0, 0, 0.5 * mindim, { acw: false });
//   ctx.stroke();
//   ctx.restore();
// }

// // -- trackpad --
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

