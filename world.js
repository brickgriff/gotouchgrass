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
      _r: 35, // range
      dg: 10, // drag gate
      dl: 50, // drag limit
      sf: 25, // speed factor
      v:0, // value
      s:0,// speed
      t:0, // theta
      isLost:false,
      isOverGrass:true,
      isUnderCanopy:false,
      isOnWall:false,
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

    //var cells=new Array(pointWidth*pointHeight).fill([]), zones=[];
    //grass(cells);
    //zones.push({x:canvas.width/2,y:canvas.height/2,r:400,c:COLORS.LAWNGREEN,v:1,t:CLADES.GRASS});
    //zones.push({x:canvas.width/2+250,y:canvas.height/2+250,r:120,c:COLORS.SPRINGGREEN,v:3,t:CLADES.CLOVER});

    var paths = [];
    var walls = [];
    var foliage = [];

    var state = {
      canvas: canvas,
      player: player,
      keys: [],
      mouse: mouse,
      //zones: zones,
      //cells: cells,
      paths: paths,
      walls: walls,
      foliage: foliage,

      cx: 0,
      cy: 0,
      dx: 0,
      dy: 0,
      r: 25,

      f: 0,
      frame: 0,
      maxFrame: 120,

      fps: 30, // 60

      pImg:null,fImg:null,cImg:null,isDebug:false,
      pathColor:null,canopyColor:null,grassColor:null,playerColor:null,wallColor:null
    };

    const x=canvas.width/2,y=canvas.height/2;

    var createEntity = (x,y,r,metadata) => {
      return {x:x,y:y,r:r,metadata:metadata};
    };

    ((paths) => {
      paths.push(createEntity(x,y,300,{children:[1,2]}));
      paths.push(createEntity(x,y-3000,1000));
      paths.push(createEntity(x-490,y+140,100,{hidden:true}));
    })(paths);

    ((walls) => {
      walls.push(createEntity(x,y-2200,3000));
      walls.push(createEntity(x-490,y+140,75));
    })(walls);

    const grassList = [
      {x:0,y:0,r:150,l:"Poa annua"},
      {x:5,y:-1000,r:150,l:"Poa annua"},
      {x:-490,y:140,r:100,l:"Carex blanda"},
      {x:0,y:-3000,r:500,l:"Poa annua"},
    ];
    const cloverList = [
      {x:150,y:250,r:70,l:"Trifolium repens"},
      {x:-65,y:-1200,r:80,l:"Trifolium repens"},
    ];
    const foliageColors = {
      grass:COLORS.LAWNGREEN,
      clover:COLORS.SPRINGGREEN,
    };

    var foliageHelper = (plant,type) => {
      foliage.push(createEntity(plant.x,plant.y,plant.r,{color:foliageColors[type],label:plant.l}));
    };
    ((foliage) => {
      grassList.forEach(grass => foliageHelper(grass,"grass"));
      cloverList.forEach(clover => foliageHelper(clover,"clover"));
    })(foliage);

    /*
    var grass = (cells) => { 
      cells.forEach((cell,i) => {
        let x = cellWidth*(Math.floor(i%pointWidth)+Math.random());
        let y = cellHeight*(Math.floor(i/pointHeight)+Math.random());
        cell.push({x:x,y:y,a:0,t:CLADES.GRASS});
      });
    };
    */

    return state;
  };

  // TODO: move to World
  var getVector = (state) => {
    if (state.keys.includes(keybinds.mouseL)) {
      return {x:state.mouse._x-state.mouse.x,y:state.mouse._y-state.mouse.y};
    } else {
      let vector = {
        x:(state.keys.includes(keybinds.right) - state.keys.includes(keybinds.left))*state.player.dl,
        y:(state.keys.includes(keybinds.down) - state.keys.includes(keybinds.up))*state.player.dl
      };
      let angle = Math.atan2(vector.y,vector.x);
      let dist = Math.min(Math.hypot(vector.x,vector.y),state.player.dl);
      vector.x=dist*Math.cos(angle);
      vector.y=dist*Math.sin(angle);
      return vector;
    }
  };

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
    //console.log(vector);
    // distance from deltaX and deltaY
    let dist=Math.min(Math.hypot(vector.x,vector.y),state.player.dl);    
    if (dist<state.player.dg) dist = 0;
    //console.log("distUpdate", dist);

    let score = (dist+1)*dt;

    if (state.player.isOverGrass) {
      state.player.v+=score;
    } else {
      state.player.v-=(state.player.isUnderCanopy?2:1)*(state.player.isLost?2:1)*score;
    }

    // revive!
    if (state.player.v < 0) {
      state.dx=state.dy=0;
      state.player.isUnderCanopy=false;
      state.player.isLost=false;
      state.player.isOnWall=false;
      state.player.isOverGrass=true;
    }

    state.player.v=Math.max(state.player.v,0);

    if (state.player.isLost) dist/=2;
    if (state.player.isOnWall) dist=5;
    state.player.s=dist=dist/state.player.sf;//*state.player._s); // save player speed as well as translation vector
    // angle from deltaY and deltaX
    //let angle;
    state.player.t=angle=Math.atan2(vector.y,vector.x);
    //state.vector={x:,y:);
    //console.log(state.player.v);

    // cummulative vector changes
    state.dx+=Math.round(dist*Math.cos(angle));
    state.dy+=Math.round(dist*Math.sin(angle));
    // relative position of the center of the world
    state.cx=state.canvas.width/2-state.dx;
    state.cy=state.canvas.height/2-state.dy;

    //console.log(angle*180/Math.PI,dist,vector.x,vector.y);
    //console.log(state.player.isLost,state.player.isOnBareGround);

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