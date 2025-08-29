const Observations = (function (/*api*/) {
  var api = {};

  const ICON_FUNCTION = {
    "leaves": drawLeavesIcon,
    "flowers": drawFlowersIcon,
  };
  const ICON_COLOR = {
    "leaves": colors.primary,
    "flowers": colors.secondary,
  };

  api.draw = function () {
    // console.log("Observations.draw()");

    const state = document.state;
    const ctx = state.ctx;

    const mindim = state.mindim;
    const radius = .1 * mindim; // ~ 1m

    const offsetX = state.cx - radius * 2;
    const offsetY = state.cy - radius * 2;

    ctx.lineWidth = .02 * radius; // ~ 5cm
    ctx.lineCap = "round";

    // ctx.beginPath();
    // drawArrowAt(state, "flowers", mindim, mindim);
    // ctx.fill();
    // ctx.stroke();

    // ctx.beginPath();
    // drawArrowAt(state, "leaves", -mindim / 2, mindim / 2);
    // ctx.fill();
    // ctx.stroke();

    // ctx.beginPath();
    // for (plant of state.nearby) {
    //   const hypot = Math.hypot((plant.x + state.dx) * mindim, (plant.y + state.dy) * mindim);
    //   if (hypot > .1 * mindim) continue;
    //   drawArrowAt(state, "leaves", plant.x, plant.y, plant.r);
    // }
    // ctx.fill();
    // ctx.stroke();

    ctx.fillStyle = colors.emergent; // common

    // // "Area of plant matter, in cm^2"
    drawObservation(state, "leaves", offsetX, offsetY);
    drawObservation(state, "flowers", -offsetX, offsetY);
    // console.log(state.leaves, state.flowers);

    ctx.lineWidth = 1;
    ctx.lineCap = "butt";
  }

  return api;


  function drawObservation(state, name, offsetX, offsetY) {
    // if (!Math.floor(state[name])) state[name] = 123;
    // state[name] += .01 * (10 ** Math.floor(Math.log(state[name]) / Math.log(10)) + 1);

    const ctx = state.ctx;
    const mindim = state.mindim;
    const radius = .1 * mindim; // ~ 1m

    const value = Math.floor(state[name]);
    ctx.strokeStyle = ICON_COLOR[name];
    ctx.lineWidth = .005 * mindim;

    ctx.save();

    if (value < 10) {
      makeTransparent(ctx, "strokeStyle", value / 10);
      makeTransparent(ctx, "fillStyle", value / 10);
    }

    ICON_FUNCTION[name](ctx, -offsetX, -offsetY, radius);

    if (value > 0) {
      drawLevelRings(ctx, value, -offsetX, -offsetY, radius);
    }
    ctx.restore();

  }

  function drawLevelRings(ctx, value, offsetX, offsetY, radius, offsetA = .5) {
    // I want 10 to count as level 0, 100 as level 1, and so on
    // but I also want 0 to count as level 0, not level -1!
    const level = Math.max(0, Math.floor(Math.max(0, Math.log(value - 1)) / Math.log(10)));
    const remainder = (value - (10 ** level)) % (10 ** (level + 1));
    const angle = remainder / (9 * 10 ** (level));
    // const angle = .01;
    // console.log(value, level, remainder, angle+offsetA);

    // if (level) {
    ctx.save();

    ctx.beginPath();
    const origLine = ctx.lineWidth;
    ctx.lineWidth = origLine * (level) * 1.5 + .1 * radius;
    drawArc(ctx, offsetX, offsetY, radius + ctx.lineWidth * .5 - (.75 * origLine + .1 * radius));
    ctx.stroke();

    ctx.restore();
    // }  

    ctx.beginPath();
    ctx.strokeStyle = colors.emergent;
    drawArc(ctx, offsetX, offsetY, radius - .1 * radius, {
      start: (offsetA + angle) * Math.PI,
      end: (offsetA - angle) * Math.PI,
      acw: true,
    });

    for (let i = 0; i < level; i++) {
      drawArc(ctx, offsetX, offsetY, i * 1.5 * ctx.lineWidth + radius);
    }
    ctx.stroke();
  }

  function drawLeavesIcon(ctx, offsetX, offsetY, radius) {
    ctx.beginPath();
    drawArc(ctx, offsetX, offsetY, radius - (ctx.lineWidth * .5 + .1 * radius));
    ctx.fill();

    ctx.beginPath();
    ctx.save();
    ctx.lineWidth = .02 * radius;
    drawArc(ctx, offsetX - radius * .71, offsetY - .1 * radius, radius, { start: -.25 * Math.PI, end: Math.PI * .25 });
    drawArc(ctx, offsetX + radius * .71, offsetY - .1 * radius, radius, { start: .75 * Math.PI, end: -Math.PI * .75 });
    ctx.moveTo(offsetX, offsetY - radius * .8);
    ctx.lineTo(offsetX, offsetY + radius * .8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawFlowersIcon(ctx, offsetX, offsetY, radius) {
    ctx.beginPath();
    drawArc(ctx, offsetX, offsetY, radius - (ctx.lineWidth * .5 + .1 * radius));
    ctx.fill();

    ctx.beginPath();
    ctx.save();
    ctx.lineWidth = .02 * radius;
    const foffset = 1 / 12;
    for (let i = 0; i < 6; i++) {
      let fLogoAngle = foffset + i * 1 / 6;

      let fLogoX = .35 * radius * Math.cos(fLogoAngle * Math.PI * 2);
      let fLogoY = .35 * radius * Math.sin(fLogoAngle * Math.PI * 2);
      drawArc(ctx, offsetX + fLogoX, offsetY + fLogoY, radius * .35);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function makeTransparent(ctx, style, alpha) {
    let red = parseInt(ctx[style].substring(1, 3), 16);
    let green = parseInt(ctx[style].substring(3, 5), 16);
    let blue = parseInt(ctx[style].substring(5, 7), 16);
    // let alpha = Math.min(1, (ratio));
    ctx[style] = `rgba(${red},${green},${blue},${alpha})`;
  }

  // function drawArrowTo(ctx, style, theta) {

  // }

  function drawArrowAt(state, style, x, y, r = null) {
    const ctx = state.ctx;
    const mindim = state.mindim;
    const maxdim = Math.max(state.canvas.width, state.canvas.height);

    if (r == null) r = .01;
    r *= mindim * .5;
    // ctx.beginPath();

    ctx.strokeStyle = colors.emergent;
    ctx.fillStyle = ICON_COLOR[style];

    x = (x + state.dx) * mindim;
    y = (y + state.dy) * mindim;

    const hypot = Math.hypot(x, y);
    const angle = Math.atan2(y, x);
    var d = hypot;

    if (hypot > mindim * .5) {
      d = .1;
    }
    if (hypot < mindim * .05) {
      d = .05;
    } else if (hypot < maxdim / mindim * mindim) {
      drawArc(ctx, x, y, r);
    }

    if (d != hypot) {
      var x2 = d * Math.cos(angle);
      var y2 = d * Math.sin(angle);
    }

    drawArc(ctx, x2 * mindim, y2 * mindim, r);

    // ctx.fill();
    // ctx.stroke();
  }

  // ctx.lineWidth = 5;
  // const alevel = Math.log(state.active.length) / Math.log(10);
  // //const aremainder = state.active.length % (10 ** (alevel + 1));
  // const aangle = alevel / 10;
  // ctx.strokeStyle = "lightgray";
  // ctx.beginPath();
  // drawArc(ctx, 0, 0, state.mindim / 2);
  // ctx.stroke();

  // ctx.strokeStyle = "gold";
  // ctx.beginPath();
  // drawArc(ctx, 0, 0, state.mindim / 2, {
  //   start: (offset + aangle) * Math.PI,
  //   end: (offset - aangle) * Math.PI,
  //   acw: aangle < 1
  // });
  // ctx.stroke();
}());
