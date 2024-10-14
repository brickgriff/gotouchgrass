// A simple Model example
const World = (function (/*api*/) {
  
  // public api
  var api = {};

  // area size (5mX5m)
  let pointWidth=5,pointHeight=5;
  // square size (1mX1m; ~100pxX100px)
  let cellWidth=100,cellHeight=100;
  // TODO: configure in main and init with create(canvas)

  // create a new state
  api.create = function (canvas) {

    var player = {
      x: canvas.width/2,
      y: canvas.height/2,
      r: 50, // radius
      _r: 25, // + range (radius modifier)
      v:0, // value
      s:10,// speed
    };

    var mouse = {
      x: player.x,
      y: player.y,
      _x:player.x,
      _y:player.y,
      isTapped:false,
      frames:0,
      maxFrames:6,
      isHeld:false,
      isDragged:false,
    };

    var cells=new Array(pointWidth*pointHeight).fill([]), zones=[];
    //grass(cells);
    //zones.push({x:canvas.width/2,y:canvas.height/2,r:400,c:COLORS.LAWNGREEN,v:1,t:CLADES.GRASS});
    //zones.push({x:canvas.width/2+250,y:canvas.height/2+250,r:120,c:COLORS.SPRINGGREEN,v:3,t:CLADES.CLOVER});
    var state = {
      canvas: canvas,
      player: player,
      keys: [],
      mouse: mouse,
      zones: zones,
      cells: cells,

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

  function grass(cells) { 
    cells.forEach((cell,i) => {
      let x = cellWidth*(Math.floor(i%pointWidth)+Math.random());
      let y = cellHeight*(Math.floor(i/pointHeight)+Math.random());
      cell.push({x:x,y:y,a:0,t:CLADES.GRASS});
    });
  } 

  // update the state
  api.update = function (state, dt) {
    //console.log(`update`);

    // process input flags in state
    // move the player (change dx & dy)
    // each element type should also know how to move itself
    // currently that's just the player
    // technically the player just sets the global offset for the world
    // the player stays at the center point
    // control zones are light, water, energy, and health for plants in the area
    // control zones also need to move themselves based on game state
    // game state is modified by the control layer which are event listeners
    // these listeners are currently in player.js
    // player.js is mostly concerned with state.player

    // if the player is occupying or clicking a green pixel, score a point
    // rules for spawning new plants

    // use mouse 
    let vector = getVector(state);
    let angle = Math.atan2(vector.y,vector.x);
    let dist = state.player.s;
    if (vector.x===0 && vector.y===0)dist=0;
    vector={x:dist*Math.cos(angle),y:dist*Math.sin(angle)};

    state.dx+=vector.x;
    state.dy+=vector.y;

    state.cells.forEach(cell => {
      cell.forEach(plant =>{
        plant.a++; // increase age
        // age determines plant size (height and area), needs (costs), and yields (rewards)
      });
    });
  };

  // return the public api
  return api;
}
());