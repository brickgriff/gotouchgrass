const World = (function (/*api*/) {
  var api = {};


  // A Site is a collection of Points
  // point size (5mX5m)
  let pointWidth=5,pointHeight=5;

  // A Point is a collection of Cells
  // cell size (1mX1m; ~100pxX100px)
  let cellWidth=100,cellHeight=100;


  api.create = function (canvas) {

    var paths = []; // boosts walking speed
    var walls = []; // prevents movement
    var foliage = []; // generates resources

    const x=canvas.width/2,y=canvas.height/2;

    var player = {
      // player is normally at screen center
      // if camera is stopped by a wall,
      // then player moves relative to camera
      x: 0,
      y: 0,

      // the player is about 50cm wide (average for a human)
      // their reach starts at another 10cm
      radius: 25,
      reach: 35,
      angle:0,
      speed:0,
      speedFactor: 25,
      score: 0,

      // old
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
      isInsideWall:false,
      isTouchingGrass:false,
      isTouchedGrass:false, // old
  
      touches : {},
    };

    var mouse = {
      // old
      x: player.x,
      y: player.y,

      // mousedown
      x_:player.x,
      y_:player.y,
      // mouseup
      _x:player.x,
      _y:player.y,

      frames:0,
      maxFrames:6,
      dragMin: 10,
      dragMax: 50,
      
      isTapped:false,
      isHeld:false,
      isDragged:false,
      isClicked:false,
      // TODO: combine clicked and tapped?
    };

    var state = {
      canvas: canvas,
      player: player,
      keys: [],
      mouse: mouse,
      paths: paths,
      walls: walls,
      foliage: foliage,

      // old
      cx: 0,
      cy: 0,

      // world offset
      dx: 0,
      dy: 0,

      r: 25,

      f: 0,
      frame: 0,
      maxFrame: 120,
      fps: 30, // 60

      pImg:null,fImg:null,cImg:null,
      isDebug:false,

      pathColor:null,
      canopyColor:null,
      grassColor:null,
      playerColor:null,
      wallColor:null,
    };


    var createEntity = (x,y,r,metadata) => {
      return {x:x,y:y,r:r,metadata:metadata};
    };

    var pushEntities = (list,entities) => {
      entities.forEach(e=>list.push(createEntity(...e)));
    };

    const grassList = [
      {x:0,y:0,r:150,l:"Poa annua"},
      {x:5,y:-1000,r:150,l:"Panicum virgatum"},
      {x:-490,y:140,r:100,l:"Carex blanda"},
      {x:0,y:-3000,r:500,l:"Andropogon gerardii"},
    ];
    const cloverList = [
      {x:150,y:250,r:70,l:"Trifolium repens"},
      {x:-65,y:-1200,r:80,l:"Indigofera caroliniana"},
    ];

    const foliageColors = {
      grass:COLORS.LAWNGREEN,
      clover:COLORS.SPRINGGREEN,
      disturbed:COLORS.GREEN,
      soil:COLORS.SOIL,
    };

    var foliageHelper = (plant,type) => {
      return[plant.x,plant.y,plant.r,{color:foliageColors[type],label:plant.l}];
    };

    pushEntities(paths,[
      [0,0,300,{type:"path",children:[1,2]}],
      [0,-3000,1000,{type:"path"}],
      [-490,140,100,{hidden:true}],
    ]);
    pushEntities(walls, [
      [0,-2200,3000],
      [-490,140,75],
    ]);
    pushEntities(foliage, [
      ...grassList.map(grass=>foliageHelper(grass,"grass")),
      ...cloverList.map(clover=>foliageHelper(clover,"clover")),
    ]);

    // load plant sprites with offscreen canvas and save to bitmaps

    return state;
  };


  var getVector = (state) => {
    let dMax = state.mouse.dragMax;
    if (state.keys.includes(keybinds.mouseL)) {
      return {x:state.mouse._x-state.mouse.x_,y:state.mouse._y-state.mouse.y_};
    } else {
      let vector = {
        x:(state.keys.includes(keybinds.right) - state.keys.includes(keybinds.left))*dMax,
        y:(state.keys.includes(keybinds.down) - state.keys.includes(keybinds.up))*dMax
      };
      let angle = Math.atan2(vector.y,vector.x);
      let dist = Math.min(Math.hypot(vector.x,vector.y),dMax);
      vector.x=dist*Math.cos(angle);
      vector.y=dist*Math.sin(angle);
      return vector;
    }
  };


  // update the state
  api.update = function (state, dt) {
    //console.log(`update`);

    // toggle debug
    if (state.keys.includes(keybinds.debug)) {
      state.isDebug = (state.isDebug^=true)!==0;
      // FIXME: prevent rapid toggling!
      //state.player.isUnderCanopy=false;
    }

    // primary keypress is the same as clicking at player position
    //console.log(state.keys.includes(keybinds.primary));
    if (state.keys.includes(keybinds.primary)) {
      state.mouse.isClicked=true;
      state.mouse._x = state.player.x;
      state.mouse._y = state.player.y;
    }

    // use mouse or keyboard
    let vector = getVector(state);
    //console.log(vector);
    // distance from vector
    let dist=Math.min(Math.hypot(vector.x,vector.y),state.player.dl);    
    if (dist<state.mouse.dragMin) dist = 0;
    //console.log("distUpdate", dist);

    let score = (dist+1)*dt;
    state.player.isTouchingGrass=false;
    //state.player.grassValue=0;
    if (state.player.isOverGrass) {
      state.player.isLost=false;
      state.player.score+=score;
    } else {
      state.player.score-=(state.player.isUnderCanopy?2:1)*(state.player.isLost?2:1)*score;
    }

    // revive!
    if (state.player.score < 0) {
      state.dx=state.dy=0;
      state.player.isUnderCanopy=false;
      state.player.isLost=false;
      state.player.isInsideWall=false;
      state.player.isOverGrass=true;
      state.player.isTouchedGrass=false;
    }

    state.player.score=state.player.v=Math.max(state.player.score,0);

    if (state.player.isLost) dist/=2;
    state.player.speed=state.player.s=dist=dist/state.player.sf;//*state.player._s); // save player speed as well as translation vector
    // angle from deltaY and deltaX
    //let angle;
    state.player.angle=state.player.t=angle=Math.atan2(vector.y,vector.x);
    if (state.player.isInsideWall) dist=5,angle+=Math.PI;

    //state.vector={x:,y:);
    //console.log(state.player.v);

    // cummulative vector changes
    state.dx+=Math.round(dist*Math.cos(angle));
    state.dy+=Math.round(dist*Math.sin(angle));
    // relative position of the center of the world
    //state.player.x=Math.round(state.canvas.width/2);
    //state.player.y=Math.round(state.canvas.height/2);
    state.cx=state.player.x-state.dx;
    state.cy=state.player.y-state.dy;


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