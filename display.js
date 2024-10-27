const Display = (function(/*api*/) {
  var api = {};
  
  var background = function (state, ctx) {
    // center of screen is (0,0)
    ctx.fillStyle = COLORS.SOIL;
    let x=-state.cx, y=-state.cy;
    let w=state.canvas.width, h=state.canvas.height;
    //ctx.clearRect(x,y,w,h);
    ctx.fillRect(x,y,w,h);
  };

  // TODO: experiment with polygons and loops
  var pathConnect = function(state,parent,child,ctx) {
    let x1=parent.x-state.dx,y1=parent.y-state.dy;
    let x2=child.x-state.dx,y2=child.y-state.dy;
    let x=(x1+x2)/2,y=(y1+y2)/2;

    let rx=Math.hypot(x2-x1,y2-y1)/2;
    let ry=Math.min(parent.r,child.r)/2;

    let rot=Math.atan2(y2-y1,x2-x1);

    ctx.moveTo(x,y);
    ctx.ellipse(x,y,rx,ry,rot,0,Math.PI*2);
  };

  var pathLoop = function(state,ctx,path) {
    let x=path.x-state.dx,y=path.y-state.dy;

    ctx.moveTo(x+path.r,y);
    ctx.arc(x,y,path.r,0,Math.PI*2);
    if (!path.metadata || !path.metadata.children) return;
    path.metadata.children.forEach(child=>{
      p=state.paths[child];
      if (!p) return;
      pathLoop(state,ctx,p);
      pathConnect(state,path,p,ctx);
    });
  };

  var path = function(state,ctx) {
    ctx.fillStyle=state.pathColor;
    ctx.beginPath();
    state.paths.forEach((path)=>pathLoop(state,ctx,path));
    ctx.fill();

    //terrain image data
    state.pImg=ctx.getImageData(state.player.x-5,state.player.y-5,10,10);
  };

  var foliage = function(state, ctx) {
    ctx.strokeStyle=COLORS.GREEN;
    ctx.lineWidth=2;
    state.foliage.forEach(f => {
      let x=f.x-state.dx,y=f.y-state.dy;

      ctx.fillStyle=f.metadata.color;
      ctx.beginPath();
      ctx.moveTo(x+f.r,y);
      ctx.arc(x,y,f.r,0,2*Math.PI);
      ctx.fill();
      ctx.stroke();
    
      // TODO: bring this back with touch support works
      if(state.player.isOverGrass && inputs.mouse.isClicked
        && Math.hypot(inputs.mouse._x-x,inputs.mouse._y-y)<f.r
        && Math.hypot(state.player.x-x,state.player.y-y)<f.r) {

        //console.log(state.player.x,state.player.y);

        state.player.isTouchedGrass = true;
        state.player.grassValue = Math.PI*Math.pow(state.player._r,2)/100;
        inputs.mouse.isClicked=false;

        // state.foliage.push({
        //   x:state.player.x-state.cx,
        //   y:state.player.y-state.cy,
        //   r:state.player._r,
        //   metadata:{color:COLORS.GREEN,label:""}
        // });
      }

    });

    //foliage image data
    state.fImg=ctx.getImageData(state.player.x-5,state.player.y-5,10,10);
  };

  var walls = function (state, ctx) {
    ctx.save();

    let path1 = new Path2D();// clipping area
    path1.rect(-state.cx,-state.cy,state.canvas.width,state.canvas.height);

    //console.log(state.walls);
    state.walls.forEach(w => {
      // punch an even-odd hole in the fog the size of the player wallet
      let x=w.x-state.dx,y=w.y-state.dy;
      path1.moveTo(x+w.r+x,y);
      path1.arc(x,y,w.r,0,2*Math.PI);
    });

    ctx.beginPath();    
    ctx.clip(path1,"evenodd"); // fill clipping area
    ctx.fillStyle = state.canopyColor;
    ctx.rect(-state.cx,-state.cy,state.canvas.width,state.canvas.height);
    ctx.fill();
    ctx.restore();

    //foliage image data
    state.fImg=ctx.getImageData(state.player.x-5,state.player.y-5,10,10);
  };

  var player = function (state, ctx) {
    ctx.fillStyle = COLORS.LIGHTGRAY;
    ctx.strokeStyle = COLORS.LIGHTGRAY;
    ctx.lineWidth = 5;

    const x=Math.round(state.player.x),y=Math.round(state.player.y),
    r=state.player.radius,_r=state.player.reach,
    s=state.player.speed,t=state.player.theta;

    // draw pointer line
    const dist = s>0 ? r+5 : 0;
    
    const vector={
      x:Math.round(r*Math.cos(t)),
      y:Math.round(r*Math.sin(t))
    };
    const x1=x+vector.x,y1=y+vector.y;

    vector.x=Math.round(dist*Math.cos(t));
    vector.y=Math.round(dist*Math.sin(t));
    const x2=x+vector.x,y2=y+vector.y;

    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();

    // draw player dot
    ctx.beginPath();
    // player (r = 0.25m = 25px)
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
    
    // draw reach circle
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.arc(x, y,_r,0,2*Math.PI);

    ctx.stroke();
    ctx.setLineDash([]); // reset line dash

  };

  var canopySketch=function(state,ctx) {
    let path1 = new Path2D();// clipping area
    path1.rect(-state.cx,-state.cy,state.canvas.width,state.canvas.height);
    //console.log(state.paths);
    state.paths.forEach(p => {
      let x=p.x-state.dx,y=p.y-state.dy;
      if (p.metadata && p.metadata.hidden) return;
      path1.moveTo(x+p.r,y);
      path1.arc(x,y,p.r,0,2*Math.PI);
    });

    ctx.clip(path1,"evenodd"); // fill clipping area

    ctx.rect(-state.cx,-state.cy,state.canvas.width,state.canvas.height);
  };

  var canopy = function(state,ctx) {
    ctx.save();
    ctx.fillStyle=state.canopyColor;
    ctx.beginPath();
    canopySketch(state,ctx);
    if (state.player.isUnderCanopy) {
      ctx.globalAlpha=0.5;
    }
    ctx.fill();
    ctx.restore(); // defaults

    let x=state.player.x,y=state.player.y;
    state.cImg=ctx.getImageData(x-5,y-5,10,10);

    if (!state.player.isUnderCanopy) return;

    ctx.save();
    ctx.fillStyle=state.canopyColor;
    ctx.beginPath();
    canopySketch(state,ctx);
    //if (state.player.isUnderCanopy) {
    ctx.moveTo(x+Math.floor(state.player.r+state.player.points),y);
    ctx.arc(x,y,Math.floor(state.player.r+state.player.points),0,2*Math.PI,true);
    //}
    ctx.fill();
    ctx.restore(); // defaults
  };
    
  var labels = function(state,ctx) {
    ctx.font="bold italic 50px Arial";
    ctx.textAlign="center";
    ctx.strokeStyle=COLORS.GREEN;
    ctx.lineWidth=1;

    state.foliage.forEach(f => {
      ctx.fillStyle=f.metadata.color;
      let x1=f.x-state.dx,y1=f.y-state.dy,x2=state.player.x,y2=state.player.y;
      if (Math.hypot(x1-x2,y1-y2) < f.r) {
        ctx.fillText(f.metadata.label,-state.dx+f.x,-state.dy+f.y+f.r+50);
        ctx.strokeText(f.metadata.label,-state.dx+f.x,-state.dy+f.y+f.r+50);
      }
    });
  };

  var fog = function (state, ctx) {
    // how low on points are you?
    if (state.isDebug) return;
    let ratio = state.player.points > state.player.reach-state.player.radius ? 1 : state.player.points/(state.player.reach-state.player.radius);
    ctx.save();
    ctx.globalAlpha=1-ratio/2;

    // punch an even-odd hole in the fog the size of the player wallet
    let x=state.player.x,y=state.player.y;

    let path1 = new Path2D();// clipping area
    path1.rect(-state.cx,-state.cy,state.canvas.width,state.canvas.height);
    
    path1.moveTo(x+state.player.radius+state.player.points,y);
    path1.arc(x,y,state.player.radius+state.player.points,0,2*Math.PI);
    
    ctx.clip(path1,"evenodd"); // fill clipping area

    ctx.fillStyle = state.playerColor;
    ctx.rect(-state.cx,-state.cy,state.canvas.width,state.canvas.height);
    ctx.fill();
    ctx.restore();
  };

  var checkTerrain = function (state,ctx) {
    // paths
    let pd = state.pImg.data;
    let pStyle=getCtxColor(ctx,`rgb(${pd[44*4]} ${pd[44*4+1]} ${pd[44*4+2]} / ${pd[44*4+3]})`);
    // foliage
    let fd = state.fImg.data;
    let fStyle=getCtxColor(ctx,`rgb(${fd[44*4]} ${fd[44*4+1]} ${fd[44*4+2]} / ${fd[44*4+3]})`);
    // canopy
    let cd = state.cImg.data;
    let cStyle=getCtxColor(ctx,`rgb(${cd[44*4]} ${cd[44*4+1]} ${cd[44*4+2]} / ${cd[44*4+3]})`);

    //console.log(state.playerColor,pStyle,cStyle);
    state.player.isOverGrass=fStyle===state.grassColor;
    if (state.player.isOverGrass)return; // B-)
    state.player.isInsideWall=fStyle===state.wallColor;
    state.player.isLost=pStyle!==state.pathColor;
    state.player.isUnderCanopy=cStyle!==state.playerColor;
  };

  // draw inventory
  var inventory = function(state, ctx) {
    // TODO: move vector normalization to util api
    //ctx.restore();
    // if mouse isDragged or the distance is not 0 (due to keyboard inputs)
    ctx.beginPath();
    ctx.fillStyle=COLORS.DARKGRAY;
    ctx.strokeStyle=COLORS.LIGHTGRAY;
    let x=state.player.x,y=state.player.y,_x=x,_y=y;
    //console.log(state.player.s);
    if (state.player.s > 0) {
      let dist = Math.min(state.player.r,state.player.r*state.player.s*state.player.sf/state.player.dl);
      //console.log(dist);
      // calc vector components
      let vector={
        x:Math.round(dist*Math.cos(state.player.t)),
        y:Math.round(dist*Math.sin(state.player.t))
      };
      //console.log(vector);

      // draw pointer line
      //x=state.player.x, y=state.player.y; // (canvas.w/2,canvas.h/2)
      _x+=vector.x,_y+=vector.y;
    }

    //ctx.moveTo(x,y);
    //ctx.lineTo(_x,_y);
    ctx.moveTo(_x+5,_y);
    ctx.arc(_x,_y,5,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();  
    //console.log(_x,_y);  
  };

  // joystick
  var joystick = function(state, ctx) {
    // vector angle in radians from state (keyboard and/or mouse)
    //let vector = getVector(state);

    const mouse = getMouse();
    const dMax = mouse.dragMax,dMin=mouse.dragMin;
    const x_=mouse.x_,y_=mouse.y_; // mousedown position
    const _x=mouse._x,_y=mouse._y; // mousemove position

    // if mouseleft is pressed, then draw a ring around the mousedown
    if (findInput(keybinds.mouseL) || findInput(keybinds.primary)) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = COLORS.LIGHTGRAY;
      ctx.beginPath();
      ctx.arc(x_,y_,dMax,0,2*Math.PI);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = COLORS.LIGHTGRAY;
      ctx.beginPath();
      ctx.arc(x_,y_,dMin,0,2*Math.PI);
      ctx.stroke();
    }

    // // if mousemove (isDragged), then draw filled dot  
    if (mouse.isDragged) {
      // drag distance; length of mousedown to mousemove, in pixels
      // MIN (drag distance vs capped distance)
      const dist=Math.min(Math.hypot(_x-x_,_y-y_), dMax);
      const angle=state.player.theta;
      ctx.fillStyle=COLORS.GRAY;
      ctx.beginPath();
      ctx.arc(x_ + (Math.cos(angle) * dist),y_ + (Math.sin(angle) * dist),dMax*0.75,0,2*Math.PI);
      ctx.fill();
    }
  };

  var score = function(state,ctx) {
    ctx.lineWidth=1;
    ctx.strokeStyle=COLORS.GOLD;
    ctx.beginPath();
    ctx.moveTo(state.player.x+Math.floor(state.player.radius+state.player.points),state.player.y);
    ctx.arc(state.player.x,state.player.y,Math.floor(state.player.radius+state.player.points),0,2*Math.PI);
    ctx.stroke();
  };
  
  var debugMouse = function(state, ctx) {
    // black line from player to mousemove (distance)
    ctx.lineWidth=5;
    ctx.strokeStyle=COLORS.BLACK;
    ctx.beginPath();
    ctx.moveTo(state.player.x,state.player.y);
    ctx.lineTo(inputs.mouse._x,inputs.mouse._y);
    ctx.stroke();
    // white line from mousedown to mousemove (vector)
    ctx.lineWidth=5;
    ctx.strokeStyle=COLORS.WHITE;
    ctx.beginPath();
    ctx.moveTo(inputs.mouse._x,inputs.mouse._y);
    ctx.lineTo(inputs.mouse.x_,inputs.mouse.y_);
    ctx.stroke();
  };

  // draw input (debug)
  var debug = function(state, ctx) {
    let message="";

    debugMouse(state,ctx);

    let px = state.player.x, py = state.player.y;
    // add player position to output text
    message+=`player: {\n  x:${px},\n  y:${py},\n`;
    message+=`  radius:${state.player.radius},\n`
    message+=`  reach:${state.player.reach},\n`;
    message+=`  score:${state.player.points},\n`;
    message+=`}`;
    //console.log(state.player);

    // stagger the state images
    // ctx.putImageData(state.pImg,x-8,y-8);
    // ctx.putImageData(state.fImg,x-5,y-5);
    // ctx.putImageData(state.cImg,x-2,y-2);
    // TODO: while I do want to use pixel colors
    // to drive state changes, this is inelegant

    // assume under canopy to hide shadows while debugging
    state.player.isUnderCanopy=true;

    ctx.lineWidth = 1;
    ctx.fillStyle = COLORS.GRAY;
    ctx.strokeStyle = COLORS.LIGHTGRAY;

    ctx.beginPath();
    inputMap.forEach((input) => {
      ctx.moveTo(input.x-state.cx+500+input.r,input.y-state.cy);
      ctx.arc(input.x-state.cx+500,input.y-state.cy,input.r,0,2*Math.PI);
    });
    ctx.moveTo(px+state.player.reach,py);
    ctx.arc(px,py,state.player.reach,0,2*Math.PI);
    ctx.moveTo(px+state.player.radius,py);
    ctx.arc(px,py,state.player.radius,0,2*Math.PI);
    //ctx.rect(x-5,y-5,10,10);
    ctx.moveTo(px,py);
    let dist = inputs.mouse.dragMax*state.player.speed;
    if (state.player.speed > 0) ctx.lineTo(px+(dist*Math.cos(state.player.theta)),py+(dist*Math.sin(state.player.theta)));
    ctx.stroke();

    ctx.beginPath();
    inputMap.forEach((input) => {
      ctx.moveTo(input.x-state.cx+500+input.r,input.y-state.cy);
      if (findInput(input.k)) ctx.arc(input.x-state.cx+500,input.y-state.cy,input.r,0,2*Math.PI);
    });
    ctx.fill();

    // debug window?
    let lw=ctx.lineWidth=1;
    let rw=250,rh=500;
    let rx=-state.cx,ry=-state.cy;
    ctx.strokeStyle="red";
    ctx.beginPath();
    ctx.rect(rx,ry,rw,rh);
    ctx.stroke();
  };

  var getCtxColor = function(ctx,color) {
    ctx.fillStyle=color;
    return ctx.fillStyle;
  }

  // public api is a function
  api.draw = function (state, ctx) {
    //console.log(`draw`);

    state.canopyColor=getCtxColor(ctx,COLORS.DIMGRAY);
    state.playerColor=getCtxColor(ctx,COLORS.LIGHTGRAY);
    state.pathColor=getCtxColor(ctx,COLORS.DARKGRAY);
    state.grassColor=getCtxColor(ctx,COLORS.LAWNGREEN);
    state.wallColor=getCtxColor(ctx,COLORS.DARKSLATEGRAY);

    // TODO: give entities their own draw functions

    background(state,ctx); // defines any non-path we forget
    //path(state, ctx);

    state.entities.filter(e=>e.metadata.type==="plant").forEach(p=>{
      ctx.beginPath();
      ctx.lineWidth=2;
      ctx.strokeStyle=p.metadata.color;
      ctx.fillStyle=p.metadata.color;
      let r = Math.round(p.r)
      ctx.moveTo(p.x-state.dx+r,p.y-state.dy);
      ctx.arc(p.x-state.dx,p.y-state.dy,r,0,2*Math.PI);
      ctx.stroke();
      ctx.fill();
    });

    //foliage(state,ctx);
    //walls(state,ctx);
    player(state, ctx);
    //canopy(state,ctx);
    state.cImg=ctx.getImageData(state.player.x-5,state.player.y-5,10,10);
    //labels(state, ctx);
    //fog(state,ctx);

    //checkTerrain(state,ctx);

    //inventory(state,ctx);
    joystick(state,ctx);

    if (state.isDebug) {
      score(state,ctx);
      debug(state,ctx);
    }

  };

  // return the public API
  return api;
}());

const COLORS = {
  BLACK:"black", GREEN:"green", GRAY:"gray", LIGHTGRAY: "lightgray",
  DARKGRAY:"darkgray", BLUE:"blue", GOLD:"gold", LIGHTBLUE:"lightblue", RED:"red",
  SPRINGGREEN: "springgreen", LAWNGREEN: "lawngreen", WHITE: "white", YELLOW: "yellow",
  CYAN: "cyan", MAGENTA: "magenta", DIMGRAY: "dimgray", DARKBLUE:"darkblue",
  DARKSLATEGRAY:"darkslategray",SOIL:"#7d644b",DEFAULT:"#cccccc"
};

const inputMap = [
  {x:100,y:100,r:10,k:keybinds.up},
  {x:75,y:125,r:10,k:keybinds.left},
  {x:100,y:125,r:10,k:keybinds.down},
  {x:125,y:125,r:10,k:keybinds.right},
  {x:75,y:100,r:10,k:keybinds.loosen},
  {x:125,y:100,r:10,k:keybinds.tighten},

  {x:175,y:100,r:10,k:keybinds.secondary},
  {x:150,y:100,r:10,k:keybinds.primary},
  {x:200,y:100,r:10,k:keybinds.tertiary},
  {x:150,y:125,r:10,k:keybinds.mouseL},
  {x:175,y:125,r:10,k:keybinds.mouseM},
  {x:200,y:125,r:10,k:keybinds.mouseR},

];

