const World = (function (/*api*/) {
  var api = {};


  // A Site is a collection of Points
  // point size (5mX5m)
  let pointWidth=5,pointHeight=5;

  // A Point is a collection of Cells
  // cell size (1mX1m; ~100pxX100px)
  let cellWidth=100,cellHeight=100;

  api.create = function (canvas,ctx) {
/*
    var paths = []; // boosts walking speed
    var walls = []; // prevents movement
    var foliage = []; // generates resources

    const start=document.timeline.currentTime;
    //const cx=canvas.width/2,cy=canvas.height/2;

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
      speed:0,
      // TODO: apply this to the framerate, rather than the speed
      speedFactor: 25,
      theta:0,
      points:0, // "score"? "value"? "experience"?

      isLost:false,
      isOverGrass:true,
      isUnderCanopy:false,
      isInsideWall:false,
      isTouchingGrass:false,
  
      touches : {},
    };

    var mouse = {
      // mousedown
      x_:player.x,
      y_:player.y,
      // mouseup
      _x:player.x,
      _y:player.y,

      frames:0,
      maxFrames:6,
      
      isHeld:false,
      isDragged:false,
      isClicked:false,
    };
*/

    var state = {
      canvas: canvas,
      ctx: ctx,
      // player: player,
      // mouse: mouse,
      // paths: paths,
      // walls: walls,
      // foliage: foliage,
      // entities:[],

      // old
      // for centering translations on resize
      cx: 0,
      cy: 0,

      // world offset
      // dx: 0,
      // dy: 0,

      frame: 0,
      time:0,

      // fps: 30, // 60

      // pImg:null,fImg:null,cImg:null,
      // isDebug:false,
      // isQuit:false,

      // pathColor:null,
      // canopyColor:null,
      // grassColor:null,
      // playerColor:null,
      // wallColor:null,
    };

    resize(state);
/*
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
      //[0,-3000,1000,{type:"path"}],
      //[-490,140,100,{hidden:true}],
    ]);
    pushEntities(walls, [
      [0,-2200,3000],
      [-490,140,75],
    ]);
    pushEntities(foliage, [
      ...grassList.map(grass=>foliageHelper(grass,"grass")),
      ...cloverList.map(clover=>foliageHelper(clover,"clover")),
    ]);

    // TODO: limit simulation steps per frame/second
    // TODO: create more plant variety!!!
    // TODO: simulate light, water, and humus competition
    pushEntities(state.entities,(()=>{
      let list = [];//,w=canvas.width,h=canvas.height;
      //console.log(w,h);
      let I=10000,R=100,W=100,H=100;
      //let maxX = Math.floor((I-1)%W);
      //let maxY = Math.floor((I-1)/W);
      //console.log("num:",I,"maxX:",maxX,"maxY:",maxY);
      let id=0;

      // TODO: use a worker thread past 1K plants
      for (let i = 0; i < I; i++) {
        list.push(addEntityToList(i,R,W,H,id++));
      }

      return list;

    })());

*/
    // load plant sprites with offscreen canvas and save to bitmaps

    return state;
  };

/*
    var createEntity = (x,y,r,metadata) => {
      return {x:x,y:y,r:r,metadata:metadata};
    };

    var pushEntities = (list,entities) => {
      //console.log("list:",list,"entities:",entities);
      entities.forEach(e=>list.push(createEntity(...e)));
    };

    var addEntityToList = (i,R,W,H,id) => {
      let r = 0;//Math.random()*R; // pick a radius
      let offset = Math.random()*2*R-(R/2);
      let x=Math.floor((i%W)-(W/2))*2*R+offset;
      offset = Math.random()*2*R-(R/2);
      let y=Math.floor((i/W)-(H/2))*2*R+offset;
      

      let color = Math.random()*100;
      if (color>10) color = "limegreen";
      else if (color>8) color = "springgreen";
      else if (color>5) color = "lawngreen";
      else color = "green";

      //console.log({i:i,x:x,y:y,r:r});
      return [
        x,
        y,
        r,
        {type:"plant",color:color,label:"grass",id:id} //metadata
      ];
    };


  // this should return [-1,1] for vector x and y
  var getVector = () => {
    const mouse = getMouse();//inputs.mouse;
    const dMax = mouse.dragMax;
    const vector = {};

    if (findInput(keybinds.mouseL)) {
        vector.x=mouse._x-mouse.x_;
        vector.y=mouse._y-mouse.y_;
    } else {
        vector.x=(findInput(keybinds.right) - findInput(keybinds.left))*dMax;
        vector.y=(findInput(keybinds.down) - findInput(keybinds.up))*dMax;
    }

    const dist=Math.hypot(vector.x,vector.y);
    const angle=Math.atan2(vector.y,vector.x);

    return vector;
  };
*/
  var resize = (state) => {
    //console.log("resize");
    state.canvas.width=document.body.clientWidth;
    state.canvas.height=document.body.clientHeight;
    state.cx=state.canvas.width/2;
    state.cy=state.canvas.height/2;
    state.ctx.translate(state.cx,state.cy);
  }

  // update the state
  api.update = function (state, dt) {
    //console.log(`update(frame=${state.frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);

    //var inputsEl=document.getElementById("inputs");
    var inputsEl=document.inputs;
    console.log(inputsEl);
    if (inputsEl.isResized) {
      resize(state);
      //inputs.isResized=false;
      inputsEl.isResized=false;
    }
/*
    if (findInput(keybinds.debug)) {
      state.isDebug = (state.isDebug^=true)!==0;
      // FIXME: flickering
    }

    if (findInput(keybinds.menu)) {
      state.isQuit = (state.isQuit^=true)!==0;
      // TODO: set state to menu then draw the menu
      // TODO: let the menu state changes set state to quit
    }

    // primary keypress is the same as clicking at player position
    const mouse = getMouse();
    if (findInput(keybinds.primary)) {
      mouse.isClicked=true;
      mouse.x_=mouse._x=state.player.x;
      mouse.y_=mouse._y=state.player.y;
    }

    // TODO: use a worker thread!!!
    // TODO: count simulation steps then space out calculations by at least 6-30 frames
    state.entities.filter(e=>e.metadata.type==="plant").forEach((p,i)=>{
      if (p.t===undefined) p.t=100;
      //if (p.metadata.id===100) console.log(i,p.r,p.t);
      let rand = Math.random();
      let isGrowing=rand>0.6;
      if (p.metadata.color==="limegreen")isGrowing=rand>.4;
      if (isGrowing) {
        p.r+=1/100;
        if (p.r > 100) p.t--;
        if (p.t<=0) {
          state.entities.splice(i,1);
          pushEntities(state.entities, [addEntityToList(i,100,100,100,state.entities[state.entities.findLastIndex(e=>e.metadata.type==="plant"&&e.metadata.id>0)].metadata.id+1)]);
        }
      }
    });

    const score = Math.PI * Math.pow(state.player.radius,2) * dt;
    state.player.isTouchingGrass=false;
    if (state.player.isOverGrass) {
      state.player.isLost=false;
      state.player.points+=score;
    } else {
      state.player.points-=(state.player.isUnderCanopy?2:1)*(state.player.isLost?2:1)*score;
    }

    // revive!
    if (state.player.points < 0) {
      state.dx=state.dy=0;
      state.player.x=state.player.y=0;
      state.player.isUnderCanopy=false;
      state.player.isLost=false;
      state.player.isInsideWall=false;
      state.player.isOverGrass=true;
      state.player.isTouchingGrass=false;
    }

    state.player.points=state.player.points*(state.player.points>=0);

    // use mouse or keyboard
    const vector = getVector();
    const hypot = Math.hypot(vector.x,vector.y);
    const dMin = mouse.dragMin;

    // vector length
    const dist=Math.min(hypot * (hypot >= dMin),inputs.mouse.dragMax);

    state.player.speed=dist/state.player.speedFactor;
    if (state.player.isLost) state.player.speed/=2;
    // angle from deltaY and deltaX
    state.player.theta=Math.atan2(vector.y,vector.x);
    // TODO: turn the player away from the wall, not just away from their intended vector
    if (state.player.isInsideWall) state.player.theta=(state.player.theta+Math.PI)%(2*Math.PI);

    // cummulative vector changes
    const speed = state.player.speed;
    const theta = state.player.theta;
    state.dx+=speed*Math.cos(theta);
    state.dy+=speed*Math.sin(theta);
*/
    // prepare for next frame
    state.frame++;
    state.time+=dt;
    
  };
  // return the public api
  return api;
}());