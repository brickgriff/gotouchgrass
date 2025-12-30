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
      speed: 0.001,// ><
      zoom: .2, // [0, 1] // ><
      //pitch: 1, // [0, 1]
      //yaw: 0, // [-1, 1]
      frame: 0,
      time: 0,
      seed: 42,
      // experience (leaves & flowers)
      plants: [],
      leaves: 0,
      flowers: 0,
      stamina: 0,
      staminaLimit: 0, // can be an update function
      nearby: [],
      active: [],
      inputs: inputs, // from events.js
      events: {},
      touchCount: 0,
      default: { // so you can always revert
        speed: 0.001,
        color: "FC", // "FC" for full-color or "BW" for black and white
        nearbyUpdate: 90,
        activeUpdate: 3,

      },
    };

    // TODO make a service to read config files 
    // to provide a state object to override the above one

    // TODO make a window service or something
    resize(state);
    // TODO move to its own foliage service
    //createPlants(state);
    createPatches(state);

    document.state = state;
  };

  // update the state
  api.update = function (dt) {
    //console.log(`update(dt=${dt}, fps=${Math.floor(1/dt)})`);
    const state = document.state;

    // TODO Window.update yadda yadda
    if (state.events.isResized) {
      resize(state);
      state.events.isResized = false;
    }

    // ??? interesting.. we're checking player input?
    state.vector = getVector();

    // FIXME: control when the standing frame counter gets updated
    // if (!state.frameStanding && state.vector.x == 0 && state.vector.y == 0) {
    //   state.frameStanding = state.frame;
    // } else if (state.vector.x != 0 || state.vector.y != 0) {
    //   state.frameStanding = null;
    // }
    // TODO leave events to events service (listeners)
    // TODO keyboard service (Keyboard.update)
    if (findInput(keybinds.primary)) {
      state.events.isKeyboard = true;
    } else if (state.events.isKeyboard) {
      state.events.isKeyboard = false;
      state.events.isRingLocked ^= state.events.isRingEnabled;
    }

    // TODO all of these are services, too
    updatePlayer(state);// Player.update
    updatePlants(state);// Foliage.update
    updateNearby(state);// included in Foliage.update

  };

  // return the public api
  return api;
}());

// TODO technically, this is the foliage canvas
var createOffscreenCanvas = (state) => {
  state.terrain = false;
  var offScreenCanvas = document.createElement('canvas');
  const mindim = state.mindim;
  offScreenCanvas.width = 5 * mindim;
  offScreenCanvas.height = 5 * mindim;
  var context = offScreenCanvas.getContext("2d");

  context.translate(offScreenCanvas.width / 2, offScreenCanvas.height / 2);
  return offScreenCanvas; //return canvas element
}

// TODO duplicate this code for creating an offscreen canvas for the secret clover area and the title card at the end (large)
// TODO Window.resize
var resize = (state) => {
  state.canvas.width = self.innerWidth; // px
  state.canvas.height = self.innerHeight; // px
  state.cx = state.canvas.width / 2; // px
  state.cy = state.canvas.height / 2; // px
  // mindim == ~10m
  state.mindim = Math.min(state.canvas.width, state.canvas.height); // - .1 * state.cx;
  state.maxdim = Math.max(state.canvas.width, state.canvas.height); // - .1 * state.cx;
  // const othdim = Math.max(state.canvas.width, state.canvas.height);
  // if (state.cx < state.cy) state.cy = Math.min(othdim * .5, state.mindim * .5 + .1 * state.cx);
  // Math.max(state.mindim * .5 + Math.min((1-(state.cx/state.cy))*10,1) * .1 * state.cx, state.mindim * .5);
  state.ctx.translate(state.cx, state.cy);
  // state.ctx.scale(.9,.7);
  state.offscreen = createOffscreenCanvas(state);
  window.focus();
  // console.log("once");
}

// TODO Foliage.create
var createPatches = (state) => {

  // essentially i'm going to pull in the patches from display.js
  // whether we randomize them or not, we get to color them as crop or weed
  // we want several large circles (about 50cm~1m in diameter)
  // circle packing? cellular automata? somehow both?
  // just create, sort, place, check (collisions)
  const random = Random.seed(state.seed);
  const plants = state.plants;
  plants.push({ x: .25, y: -.25, r: .1, t: "lock", c: colors.emergent});

  var num = 100;
  const rMax = .1;
  const rMin = .05;
  const hMax = .5;
  const hMin = .05;
  const hBleed = .25;
  var retries = 0;
  var prevR = 0;
  while (num--) {
    let r = random() * (rMax - rMin) + rMin;
    if (prevR != 0) r = prevR;
    if (Math.floor(r*100) % 2 != 0) r-=.01;
    let d = random() * (hMax - hMin - (2 - hBleed) * r) + hMin + r;
    let a = random() * Math.PI * 2;

    let x = d * Math.cos(a); // (random() * max * 2 - max);
    let y = d * Math.sin(a); // (random() * max * 2 - max);
    let isOverlap = false;

    for (var plant of plants) {
      const allowedOverlap = .7; // % of combined radii
      const distMin = (r + plant.r) * allowedOverlap;
      const dist = Math.hypot(x - plant.x, y - plant.y);
      if (dist > distMin) continue;
      // plant.t = colors.secondary;
      // add 1 to num and spin again
      // if collision, then retry

      num++;
      retries++;
      if (retries == 100) {
        if (r > rMin) {
          prevR = r - .02;
        } else {
          prevR = 0;
          num--; // skip this number
        }
        retries = 0;
      }
      isOverlap = true;
      break;
    }

    if (isOverlap) continue;
    prevR = 0;

    let c = colors.primary;//(random() < .2) ? colors.primary : colors.tertiary;
    const isOuterWeed = (d > .3 && r < .1 && random() <= .9);
    const isInnerWeed = (d > .1 && r < .08 && random() <= .4);
    let t = isOuterWeed || isInnerWeed ? "clover" : "grass";
    // "grass";//(random() < .2) ? "clover" : "grass";
    // TODO: extract the above as a function to create rings of objects
    // TODO: offer num, max, min, etc but try adding density

    // even less so soil layer is visible
    // iteratively condense, if desired

    const p = { x: x, y: y, r: r, t: t, c: c };
    plants.push(p);
  }

}

var createPlants = (state) => {
  const random = Random.seed(state.seed);
  const plants = [];
  state.plants = plants;
  // state.nearby = [];
  // state.active = [];
  // state.leaves = 0;
  // state.flowers = 0;
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

    let c = (random() < .2) ? colors.primary : colors.tertiary;
    let t = (random() < .2) ? "clover" : "grass";
    const plant = { x: x, y: y, r: r, t: t, c: c };
    plants.push(plant);
  }
}

// TODO Player.update
var updatePlayer = (state) => {
  const vector = state.vector;
  state.events.isDragged = (vector.x != 0 || vector.y != 0);
  state.dx -= vector.x * state.speed;
  state.dy -= vector.y * state.speed;
}
// TODO Foliage.update
var updatePlants = (state) => {
  if (state.frame % 6 !== 0) return;

  state.active = [];

  for (plant of state.nearby) {
    const hypot = Math.hypot(plant.x + state.dx, plant.y + state.dy);
    // FIXME: maybe using a set will make this step simpler
    const isActive = checkActive(plant, state.frame - 150);

    if (isActive) {
      state.active.push(plant);
    } else if (hypot < .025 || (((!state.events.isDragged && state.events.isPressed) || state.events.isKeyboard) && hypot < .1)) {
      if (plant.frame == undefined) {
        const lp = Math.random() * 0.1;
        const fp = Math.random() * 0.01;

        state.leaves += lp;
        state.flowers += fp;

        plant.leaves = lp;
        plant.flowers = fp;
      }

      state.staminaLimit += plant.flowers * .05;
      state.stamina += plant.leaves * .05;

      plant.frame = state.frame;
    } else if (plant.frame != undefined) {
      plant.frame = -1;
    }
  }

}
// TODO Foliage.update
var updateNearby = (state) => {
  if (state.frame % 60 !== 0) return;

  const plants = state.plants;
  if (!plants) return;
  state.nearby = [];

  for (plant of plants) {
    const hypot = Math.hypot(plant.x + state.dx, plant.y + state.dy);
    const mindim = state.mindim;
    const maxdim = state.canvas.height > state.mindim ? state.canvas.height : state.canvas.width;
    if (hypot > 1 / 5) continue;
    state.nearby.push(plant);

    // TODO: if the player stands still for 30 frames
    // all grass w/i the inner ring goes active
  }

}
// TODO helpers for either Foliage or maybe Player
var checkActive = (plant, limit) => {
  return plant.frame != undefined && plant.frame > 0 && plant.frame > limit;
}

var checkStanding = (frame_, _frame) => { return _frame - frame_ > (3 * 60) }

