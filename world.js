const World = (function (/*api*/) {
  var api = {};

  api.create = function (canvas, ctx) {
    var state = {
      canvas: canvas,
      ctx: ctx,
      // cx,cy : the centerpoint of the available play space 
      cx: 0,
      cy: 0,
      // dx,dy : how _much_ the player moved this frame 
      // NOTE: how _much_ , not how _fast_
      dx: 0,
      dy: 0,
      speed: 0.003,
      frame: 0,
      time: 0,
      seed: 42,
      // active: [],
      events: {},
      touchCount: 0,
      default: { // so you can always revert
        speed: 0.003,
      },
    };

    resize(state);
    createPlants(state);

    return state;
  };

  // update the state
  api.update = function (dt) {
    //console.log(`update(dt=${dt}, fps=${Math.floor(1/dt)})`);
    const state = document.state;

    if (state.events.isResized) {
      resize(state);
      state.events.isResized = false;
    }

    state.vector = getVector();

    // FIXME: control when the standing frame counter gets updated
    if (!state.frameStanding && state.vector.x == 0 && state.vector.y == 0) {
      state.frameStanding = state.frame;
    } else if (state.vector.x != 0 || state.vector.y != 0) {
      state.frameStanding = null;
    }

    //console.log(state.frame - state.frameStanding > 60 * 3);

    updateGamepad(state);
    updatePlayer(state);
    updatePlants(state);
    updateNearby(state);
    // updateScore(state);

    // console.log(state.active.length, state.leaves, state.flowers);

  };

  // return the public api
  return api;
}());

var createOffscreenCanvas = (state) => {
  state.terrain = false;
  var offScreenCanvas = document.createElement('canvas');
  const mindim = state.mindim;
  offScreenCanvas.width = 2 * mindim;
  offScreenCanvas.height = 2 * mindim;
  var context = offScreenCanvas.getContext("2d");

  context.translate(offScreenCanvas.width / 2, offScreenCanvas.height / 2);
  context.strokeStyle = "gold";
  var r = .1 * state.mindim;
  context.lineWidth = .05 * state.mindim;

  context.beginPath();
  context.arc(0, 0, r, 0, Math.PI * 2);
  context.stroke();

  return offScreenCanvas; //return canvas element
}

var resize = (state) => {
  state.canvas.width = self.innerWidth;
  state.canvas.height = self.innerHeight;
  state.cx = state.canvas.width / 2;
  state.cy = state.canvas.height / 2;
  state.mindim = Math.min(state.canvas.width, state.canvas.height) * .95; // - .1 * state.cx;
  // const othdim = Math.max(state.canvas.width, state.canvas.height);
  // if (state.cx < state.cy) state.cy = Math.min(othdim * .5, state.mindim * .5 + .1 * state.cx);
  // Math.max(state.mindim * .5 + Math.min((1-(state.cx/state.cy))*10,1) * .1 * state.cx, state.mindim * .5);
  state.ctx.translate(state.cx, state.cy);

  state.offscreen = createOffscreenCanvas(state);
  // console.log("once");
}

var createPlants = (state) => {
  const random = Random.seed(state.seed);
  const plants = [];
  state.plants = plants;
  state.nearby = [];
  state.active = [];
  state.leaves = 0;
  state.flowers = 0;
  state.nearbyUpdate = 90;
  state.activeUpdate = 3;
  state.default.activeUpdate = state.activeUpdate;
  state.default.nearbyUpdate = state.nearbyUpdate;

  var num = 5000//50000; // 50K plants!
  const max = .96;
  const min = .03;
  while (num--) {
    let hypot = random() * (max - min) + min;
    let theta = random() * Math.PI * 2;

    let x = hypot * Math.cos(theta); // (random() * max * 2 - max);
    let y = hypot * Math.sin(theta); // (random() * max * 2 - max);
    let r = (random() * .6 + .4) * 0.025;

    let c = (random() < .2) ? "darkgreen" : "lawngreen";
    let t = (random() < .2) ? "clover" : "grass";
    const plant = { x: x, y: y, r: r, t: t, c: c };
    plants.push(plant);
  }
}

var updatePlayer = (state) => {
  const vector = state.vector;
  state.dx -= vector.x * state.speed;
  state.dy -= vector.y * state.speed;
}

var updatePlants = (state) => {
  if (state.frame % 3 !== 0) return;

  state.active = [];

  for (plant of state.nearby) {
    const hypot = Math.hypot(plant.x + state.dx, plant.y + state.dy);
    // FIXME: maybe using a set will make this step simpler
    const isActive = checkActive(plant, state.frame - 1 * 60);

    if (isActive) {
      state.active.push(plant);
    } else if (hypot < .025) {
      if (plant.frame < 0) {
        state.leaves += Math.random() * 0.1;
        state.flowers += Math.random() * 0.01;
      }
      plant.frame = state.frame;
      // state.active.push(plant);
    } else {
      plant.frame = -1000;
    }
  }

}

var updateNearby = (state) => {
  if (state.frame % 60 !== 0) return;

  const plants = state.plants;
  if (!plants) return;
  state.nearby = [];

  for (plant of plants) {
    const hypot = Math.hypot(plant.x + state.dx, plant.y + state.dy);
    const mindim = state.mindim;
    const maxdim = state.canvas.height > state.mindim ? state.canvas.height : state.canvas.width;
    if (hypot > maxdim / mindim) continue;
    state.nearby.push(plant);

    // TODO: if the player stands still for 30 frames
    // all grass w/i the inner ring goes active
  }

}

var checkActive = (plant, limit) => {
  return plant.frame > 0 && plant.frame > limit;
}

var checkStanding = (frame_, _frame) => { return _frame - frame_ > (3 * 60) }

var updateGamepad = (state) => {
  // console.log(state.events.isPressed);
  //if (!state.events.isPressed) {
  //  clearInputs();
  //}
  // check mouse pos
  // if near the gamepad extents
  // check which button it is near
  // if w/i center button
  // or
  // check vector angle
  // check which button should be active
  // 0 +/- 22.5 => right
  // 45 +/- 22.5 => upperright
  // 90 +/- 22.5 => up
  // ...
  // 315 +/- 22.5 => lowerright
  // add it to the animation list
}

var updateScore = (state) => {
  console.log(state.leaves, state.flowers);
}
