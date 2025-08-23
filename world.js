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
      events: [],
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
    const state = document.state;
    //console.log(`update(frame=${state.frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);

    if (state.events.isResized) {
      resize(state);
      state.events.isResized = false;
    }
    state.vector = getVector();
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
  const plants = [];
  var num = 10000//50000; // 50K plants!
  while (num--) {
    let x = (Math.random() * 2 - 1);
    let y = (Math.random() * 2 - 1);
    let r = (Math.random() * .6 + .4) * 0.025;
    let vector = { x: x, y: y };
    normalize(vector, 1);
    x = vector.x;
    y = vector.y;
    let c = (Math.random() < .2) ? "darkgreen" : "lawngreen";
    let t = (Math.random() < .2) ? "clover" : "grass";

    plants.push({ x: x, y: y, r: r, t: t, c: c });
  }
  state.plants = plants;
}

var updateGamepad = (state) => {
  // console.log(state.events.isPressed);
  if (!state.events.isPressed) {
    clearInputs();
  }
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
  if (state.active == undefined) state.active = [];

  for (plant of plants) {
    const hypot = Math.hypot(plant.x + state.dx, plant.y + state.dy); // percent max speed
    // const theta = Math.atan2(vector.y, vector.x); // angle
    //if (plant.frame) {
    // TODO: try to get control of active list for deletions
    // }
    if (hypot > .1) continue;
    nearby.push(plant);

    const isActive = state.active.some(
      p => p.x == plant.x
        && p.y == plant.y
        && p.r == plant.r
        && p.c == plant.c
        && p.t == plant.t
    );
    if (plant.t == "grass" && hypot < .025 && !isActive) {
      if (!plant.frame) plant.frame = state.frame;
      state.active.push(plant);
    }
  }
  state.nearby = nearby;

  // TODO: if the player stands still for 30 frames
  // all grass w/i the inner ring goes active
}