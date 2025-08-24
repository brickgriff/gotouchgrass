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
      events: {},
      defaults: { // so you can always revert
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
  };

  // return the public api
  return api;
}());

var resize = (state) => {
  state.canvas.width = self.innerWidth;
  state.canvas.height = self.innerHeight;
  state.cx = state.canvas.width / 2;
  state.cy = state.canvas.height / 2;
  state.mindim = Math.min(state.canvas.width, state.canvas.height);
  state.ctx.translate(state.cx, state.cy);
}

var createPlants = (state) => {
  const random = Random.seed(state.seed);
  const plants = [];
  state.plants = plants;

  var num = 10000//50000; // 50K plants!
  while (num--) {
    let x = (random() * 2 - 1);
    let y = (random() * 2 - 1);
    let r = (random() * .6 + .4) * 0.025;
    let vector = { x: x, y: y };
    normalize(vector, 1);
    x = vector.x;
    y = vector.y;
    // FIXME: why not start with a hypot and theta?
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

// TODO break this up if possible
var updatePlants = (state) => {
  if (state.frame % 3 !== 0) return;
  const plants = state.plants;
  const nearby = [];
  state.nearby = nearby;

  if (state.active == undefined) state.active = [];
  if (!plants) return;

  for (plant of plants) {
    const hypot = Math.hypot(plant.x + state.dx, plant.y + state.dy); // percent max speed
    // const theta = Math.atan2(vector.y, vector.x); // angle
    //if (plant.frame) {
    // FIXME: try to get control of active list for deletions
    // FIXME: make most/all lists into sets
    // }
    if (hypot > .1) continue;
    nearby.push(plant);

    // FIXME: maybe using a set will make this step simpler
    const isActive = checkActive(plant, state.active);
    const isStanding = false;//checkStanding(state.frameStanding, state.frame);
    // TODO: if the player stands still for 30 frames
    // all grass w/i the inner ring goes active
    if (plant.t == "grass" && !isActive && ((hypot < .025) || isStanding)) {
      if (!plant.frame) plant.frame = state.frame;
      state.active.push(plant);
    }
  }
}

var checkActive = (plant, active) => {
  return active.some(
    p => p.x == plant.x
      && p.y == plant.y
      && p.r == plant.r
      && p.c == plant.c
      && p.t == plant.t
  );
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
