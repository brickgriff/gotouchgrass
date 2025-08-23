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
  state.mindim = Math.min(self.innerWidth, self.innerHeight);
  state.ctx.translate(state.cx, state.cy);
}

var createPlants = (state) => {
  const plants = [];
  var num = 50000; // 50K plants!
  while (num--) {
    let x = (Math.random() * 5 - 2.5);
    let y = (Math.random() * 5 - 2.5);
    let r = (Math.random() * .6 + .4) * 0.025;
    let c = (Math.random() < .2) ? "darkgreen" : "lawngreen";

    plants.push({ x: x, y: y, r: r, c: c });
  }
  state.plants = plants;
}

// this should return [-1,1] for vector x and y
var getVector = () => {
  const mouse = getMouse(); //inputs.mouse;
  let dMax = mouse.dragMax;

  const vector = {};

  if (findInput(keybinds.mouseL)) {
    vector.x = mouse._x - mouse.x_;
    vector.y = mouse._y - mouse.y_;
  } else { // keyboard movement have "pointy" diagonals
    vector.x = (findInput(keybinds.right) - findInput(keybinds.left));
    vector.y = (findInput(keybinds.down) - findInput(keybinds.up));
    dMax = 1;
  }

  normalize(vector, dMax);

  return vector;
};

var normalize = (vector, max) => {
  // direct length is useful for detecting input
  const length = Math.hypot(vector.x, vector.y); // can be as much as 1.4!
  const angle = Math.atan2(vector.y, vector.x); // can be a weird number (~0)

  // we need to normalize diagonals with the angle
  vector.x = Math.min(length / max, 1) * Math.cos(angle);
  vector.y = Math.min(length / max, 1) * Math.sin(angle);
}


var updatePlayer = (state) => {

  const vector = getVector();
  const hypot = Math.hypot(vector.x, vector.y); // percent max speed
  const theta = Math.atan2(vector.y, vector.x); // angle

  // save the current "unit-space"
  //const mindim = Math.min(self.innerWidth, self.innerHdeight);

  state.dx -= hypot * state.speed * Math.cos(theta);
  state.dy -= hypot * state.speed * Math.sin(theta);
}

var updatePlants = (state) => {
  if (state.frame % 8 !== 0) return;
  const plants = state.plants;
  const nearby = [];
  for (plant of plants) {
    const hypot = Math.hypot(plant.x+state.dx, plant.y+state.dy); // percent max speed
    // const theta = Math.atan2(vector.y, vector.x); // angle
    if (hypot > .1) continue;
    nearby.push(plant);
  }
  state.nearby = nearby;
}