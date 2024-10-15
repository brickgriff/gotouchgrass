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
      r: 25, // radius
      _r: 10, // + range (radius modifier)
      __r: 15, // / radius (range modifier)
      v:0, // value
      s:0,// speed
      _s:0, // stamina (speed modifier)
      t:0, // theta
      isLost:false,
      isOverGrass:false,
      isUnderCanopy:false,
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

      cx: 0,
      cy: 0,
      dx: 0,
      dy: 0,
      r: 25,

      f: 0,
      frame: 0,
      maxFrame: 120,

      fps: 30, // 60

      tImg:null,fImg:null,bImg:null,isDebug:false,
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

    if (state.keys.includes(keybinds.debug)) state.isDebug = (state.isDebug^=true)!==0;
    dropKey({keys:state.keys,key:keybinds.debug});

    // use mouse or keyboard
    let vector = getVector(state);
    // angle from deltaY and deltaX
    let angle = Math.atan2(vector.y,vector.x);
    // distance from deltaX and deltaY
    let dist=Math.min(Math.hypot(vector.x,vector.y),state.player.r*3);    

    // 15px ~ 50px
    if (dist<state.player.__r) dist = 0;
    dist=dist*((1/state.player.__r)+state.player._s); // player speed modifier
    //console.log("distUpdate", dist);

    state.player.v-=(1/60);
    if (state.player.isOverGrass) state.player.v+=(2/60);
    if (state.player.isUnderCanopy) state.player.v-=(1/60);
    state.player.v=Math.max(state.player.v,0);
    state.player._v=Math.floor(state.player.v);
    if (state.player.isLost) dist/=2;


    state.player.s=dist; // save player speed as well as translation vector
    state.player.t=angle;
    //state.vector={x:,y:);

    state.dx+=Math.round(dist*Math.cos(angle));
    state.dy+=Math.round(dist*Math.sin(angle));
    state.cx=state.canvas.width/2-state.dx;
    state.cy=state.canvas.height/2-state.dy;
    //console.log(angle*180/Math.PI,dist,vector.x,vector.y);
    //console.log(state.player.isLost,state.player.isOnBareGround);

    console.log(state.player._v, state.player.s);
/*    state.cells.forEach(cell => {
      cell.forEach(plant =>{
        plant.a++; // increase age
        // age determines plant size (height and area), needs (costs), and yields (rewards)
      });
    });*/
  };

  // return the public api
  return api;
}
());