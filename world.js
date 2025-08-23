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
  var num = 10000//50000; // 50K plants!
  while (num--) {
    let x = (Math.random() * 2 - 1);
    let y = (Math.random() * 2 - 1);
    let r = (Math.random() * .6 + .4) * 0.025;
    let vector = { x: x, y: y };
    normalize(vector, 1);
    x = vector.x;
    y = vector.y;
    // let c = (Math.random() < .2) ? "darkgreen" : "lawngreen";
    let t = (Math.random() < .2) ? "clover" : "grass";

    plants.push({ x: x, y: y, r: r, t: t });
  }
  state.plants = plants;
}

var updatePlayer = (state) => {

  const vector = getVector();
  state.dx -= vector.x * state.speed;
  state.dy -= vector.y * state.speed;
}

var updatePlants = (state) => {
  if (state.frame % 3 !== 0) return;
  const plants = state.plants;
  const nearby = [];
  if (state.active == undefined) state.active = [];
  for (plant of plants) {
    const hypot = Math.hypot(plant.x + state.dx, plant.y + state.dy); // percent max speed
    // const theta = Math.atan2(vector.y, vector.x); // angle
    if (hypot > .1) continue;
    nearby.push(plant);
    const isMatch = state.active.some(p => p.x == plant.x && p.y == plant.y && p.r == plant.r && p.c == plant.c);
    if (plant.t == "grass" && hypot < .025 && !isMatch) state.active.push(plant);
  }
  state.nearby = nearby;
}