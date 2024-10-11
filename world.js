// A simple Model example
const World = (function (/*api*/) {
  
  // public api
  var api = {};

  // create a new state
  api.create = function (canvas) {
    var player = {

      x: canvas.width/2,
      y: canvas.height/2,
      r: 10, // size of the player radius
      _r: 15, // size of the player reach

      dx: 0,
      dy: 0,

      s:0 // score
    };
    var mouse = {
      x: player.x,
      y: player.y,
      _x:player.x,
      _y:player.y,
      isDragged:false,
      isTapped:false
    };
    var plants = [];
    plants.push({x:canvas.width/2,y:canvas.height/2,r:400,c:COLORS.LAWNGREEN,v:1,t:CLADES.GRASS});
    plants.push({x:canvas.width/2+250,y:canvas.height/2+250,r:120,c:COLORS.SPRINGGREEN,v:3,t:CLADES.CLOVER});
    var state = {
      canvas: canvas,
      player: player,
      keys: [],
      mouse: mouse,
      plants: plants,

      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      r: 25,

      f: 0,
      frame: 0,
      maxFrame: 120,

      fps: 30 // 60
    };

    return state;
  };

  // update the state
  api.update = function (state, dt) {
    //console.log(`update`);
    var per = state.frame / state.maxFrame,
    bias = 1 - Math.abs(0.5 - per) / 0.5,
    
    cx = state.canvas.width / 2,
    cy = state.canvas.height / 2,
    
    a = Math.PI * 2 * bias;
    
    // move x and y by a and bias
    state.x = cx + Math.cos(a) * 100 * bias;
    state.y = cy + Math.sin(a) * 50;
    
    // step frame
    state.f += state.fps * dt;
    state.f = state.f % state.maxFrame;
    state.frame = Math.floor(state.f);


    // if the player is occupying or clicking a green pixel, score a point


    // rules for spawning new plants
  };

  // return the public api
  return api;
}
());