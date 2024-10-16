/* LIGHTS */
// colors, shadows
const COLORS = {BLACK:"black", GREEN:"green", GRAY:"gray", LIGHTGRAY: "lightgray",
DARKGRAY:"darkgray", BLUE:"blue", GOLD:"gold", LIGHTBLUE:"lightblue", RED:"red",
SPRINGGREEN: "springgreen", LAWNGREEN: "lawngreen", WHITE: "white", YELLOW: "yellow",
CYAN: "cyan", MAGENTA: "magenta", DIMGRAY: "dimgray", DARKBLUE:"darkblue"};
/* END LIGHTS */

const Display = (function(/*api*/) {

  var api = {};
  
  var background = function (state, ctx) {
    // clear
    //ctx.clearRect(0,0,state.canvas.width,state.canvas.height);
    ctx.fillStyle = state.canopyColor;
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  };

  var fog = function (state, ctx) {
    // clear
    //ctx.clearRect(0,0,state.canvas.width,state.canvas.height);
    // how low on points are you?
    if (state.isDebug) return;
    let ratio = state.player.v > state.player._r ? 1 : state.player.v/state.player._r;
    ctx.save();
    ctx.globalAlpha=1-ratio;
    ctx.fillStyle = COLORS.LIGHTGRAY;
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    ctx.restore();
  };

  var pathConnect = function(parent,child,ctx) {
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
      pathConnect(path,p,ctx);
    });
  };

  var path = function(state,ctx) {
    //let x=state.cx,y=state.cy;

    ctx.fillStyle=state.pathColor;
    ctx.beginPath();
    state.paths.forEach((path)=>pathLoop(state,ctx,path));
    ctx.fill();

    //terrain image data
    state.pImg=ctx.getImageData(state.player.x-5,state.player.y-5,10,10);
  };
  
  // remember the hidden flag on path objects
  var canopySketch=function(state,ctx) {
    let x=state.cx,y=state.cy;

    let path1 = new Path2D();// clipping area
    path1.rect(0,0,state.canvas.width,state.canvas.height);

    path1.moveTo(x+295,y);
    path1.arc(x,y,295,0,2*Math.PI);// canopy hole arc @ (0,0) r ~300
    
    path1.moveTo(x+995,y-3000);
    path1.arc(x,y-3000,995,0,2*Math.PI);
    
    ctx.clip(path1,"evenodd"); // fill clipping area

    ctx.rect(0,0,state.canvas.width,state.canvas.height);
  };

  var canopy = function(state,ctx) {
    ctx.fillStyle = COLORS.DIMGRAY;

    ctx.save();
    ctx.beginPath();
    canopySketch(state,ctx);

    if (state.player.isUnderCanopy) {
      //ctx.moveTo(state.player.x+state.player.r+state.player._r,state.player.y);
      //ctx.arc(state.player.x,state.player.y,state.player.r+state.player._r,0,2*Math.PI,true);
      ctx.globalAlpha=0.1;
    }

    ctx.fill();
    ctx.restore(); // defaults
    state.cImg=ctx.getImageData(state.player.x-5,state.player.y-5,10,10);
  };

  /*
  var ball = function (state, ctx) {
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(state.x-state.dx, state.y-state.dy, state.r,0,Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };
  */

  var player = function (state, ctx) {
    // draw player dot
    ctx.fillStyle = COLORS.LIGHTGRAY;
    ctx.strokeStyle = COLORS.LIGHTGRAY;
    ctx.lineWidth = 5;
    //ctx.save();

    ctx.beginPath();
    // player (r = 0.25m = 25px)
    ctx.arc(state.player.x,state.player.y,state.player.r,0,2*Math.PI);

    ctx.fill();
    
    // draw range circle
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.r+state.player._r,0,2*Math.PI);
    ctx.stroke();
    ctx.setLineDash([]); // reset line dash

  };

  // draw input (debug)
  var debug = function(state, ctx) {
    mouse(state,ctx);
    let x = state.player.x, y = state.player.y;
    // stagger the state images
    ctx.putImageData(state.pImg,x-8,y-8);
    ctx.putImageData(state.fImg,x-5,y-5);
    ctx.putImageData(state.cImg,x-2,y-2);

    ctx.lineWidth = 1;
    ctx.fillStyle = COLORS.GRAY;
    ctx.strokeStyle = COLORS.LIGHTGRAY;
    ctx.beginPath();
    inputMap.forEach((input) => {
      ctx.moveTo(input.x+input.r,input.y);
      ctx.arc(input.x,input.y,input.r,0,2*Math.PI);
    });
    ctx.moveTo(x+state.player.r+state.player._r,y);
    ctx.arc(x,y,state.player.r+state.player._r,0,2*Math.PI);
    ctx.moveTo(x+state.player.r,y);
    ctx.arc(x,y,state.player.r,0,2*Math.PI);
    //ctx.rect(x-5,y-5,10,10);
    ctx.moveTo(x,y);
    let dist = state.player.__r*state.player.s;
    if (state.player.s > 0) ctx.lineTo(x+(dist*Math.cos(state.player.t)),y+(dist*Math.sin(state.player.t)));
    ctx.stroke();

    ctx.beginPath();
    inputMap.forEach((input) => {
      ctx.moveTo(input.x+input.r,input.y);
      if (state.keys.includes(input.k)) ctx.arc(input.x,input.y,input.r,0,2*Math.PI);
    });
    ctx.fill();
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

  var foliage = function(state, ctx) {
    /*ctx.lineWidth = 3;
    ctx.strokeStyle = COLORS.GREEN;

    state.cells.forEach(cell => {
      cell.forEach(plant => {
        var _plant = plant;
        _plant.x -= state.dx;
        _plant.y -= state.dy;      
        plant.t.draw(_plant,ctx,state.player);
      });
    })*/;
    
    state.foliage.forEach(f => {
    ctx.beginPath();
      ctx.fillStyle=f.metadata.color;

      ctx.moveTo(state.cx+f.x+f.r,state.cy+f.y);
      ctx.arc(state.cx+f.x,state.cy+f.y,f.r,0,2*Math.PI);
    ctx.fill();
    });

    //foliage image data
    state.fImg=ctx.getImageData(state.player.x-5,state.player.y-5,10,10);
  };

  //draw mouse lines
  var mouse = function(state, ctx) {
    // black line from player to mousemove
    ctx.lineWidth=5;
    ctx.strokeStyle=COLORS.BLACK;
    ctx.beginPath();
    ctx.moveTo(state.player.x,state.player.y);
    ctx.lineTo(state.mouse._x,state.mouse._y);
    ctx.stroke();
    // white line from mousedown to mousemove
    ctx.lineWidth=5;
    ctx.strokeStyle=COLORS.WHITE;
    ctx.beginPath();
    ctx.moveTo(state.mouse._x,state.mouse._y);
    ctx.lineTo(state.mouse.x,state.mouse.y);
    ctx.stroke();
  };

  var score = function(state,ctx) {
    ctx.lineWidth=1;
    ctx.strokeStyle=COLORS.GREEN;
    ctx.beginPath();
    ctx.moveTo(state.player.x+state.player.r+Math.floor(state.player.v),state.player.y);
    ctx.arc(state.player.x,state.player.y,state.player.r+Math.floor(state.player.v),0,2*Math.PI);
    ctx.stroke();
  };

  // joystick
  var joystick = function(state, ctx) {
    // vector angle in radians from state (keyboard and/or mouse)
    //let vector = getVector(state);

    let limit = state.player.dl,gate=state.player.dg;
    let _x=state.mouse._x,_y=state.mouse._y; // mousemove position
    let x=state.mouse.x,y=state.mouse.y; // mousedown position

    // if mouseleft is pressed, then draw a ring around the mousedown
    if (state.keys.includes(keybinds.mouseL)) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = COLORS.LIGHTGRAY;
      ctx.beginPath();
      ctx.arc(x,y,limit,0,2*Math.PI);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = COLORS.LIGHTGRAY;
      ctx.beginPath();
      ctx.arc(x,y,gate,0,2*Math.PI);
      ctx.stroke();
    }

    // // if mousemove (isDragged), then draw filled dot  
    if (state.mouse.isDragged) {
      // drag distance; length of mousedown to mousemove, in pixels
      let dist = Math.hypot(_x-x,_y-y);
      // MIN (drag distance vs capped distance)
      dist=Math.min(dist, limit);
      //console.log(dist);
      let angle = state.player.t;//Math.atan2(vector.y,vector.x);
      ctx.fillStyle = COLORS.GRAY;
      ctx.beginPath();
      ctx.arc(x + (Math.cos(angle) * dist),y + (Math.sin(angle) * dist),limit*0.75,0,2*Math.PI);
      ctx.fill();
    }
  };

  var getCtxColor = function(ctx,color) {
    ctx.fillStyle=color;
    return ctx.fillStyle;
  }

  var checkTerrain = function (state,ctx) {
    let pd = state.pImg.data;
    let pStyle=getCtxColor(ctx,`rgb(${pd[44*4]} ${pd[44*4+1]} ${pd[44*4+2]} / ${pd[44*4+3]})`);

    let fd = state.fImg.data;
    let fStyle=getCtxColor(ctx,`rgb(${fd[44*4]} ${fd[44*4+1]} ${fd[44*4+2]} / ${fd[44*4+3]})`);

    let cd = state.cImg.data;
    let cStyle=getCtxColor(ctx,`rgb(${cd[44*4]} ${cd[44*4+1]} ${cd[44*4+2]} / ${cd[44*4+3]})`);

    //console.log(state.pathColor,pStyle);
    state.player.isOverGrass=fStyle===state.grassColor;
    if (state.player.isOverGrass)return; // B-)
    state.player.isLost=pStyle!==state.pathColor;
    state.player.isUnderCanopy=cStyle!==state.playerColor;
  };

  // public api is a function
  api.draw = function (state, ctx) {
    //console.log(`draw`);

    state.canopyColor=getCtxColor(ctx,COLORS.DIMGRAY);
    state.playerColor=getCtxColor(ctx,COLORS.LIGHTGRAY);
    state.pathColor=getCtxColor(ctx,COLORS.DARKGRAY);
    state.grassColor=getCtxColor(ctx,COLORS.LAWNGREEN);

    background(state,ctx); // defines any non-path we forget
    path(state, ctx);
    foliage(state,ctx);
    player(state, ctx);
    canopy(state,ctx);
    fog(state,ctx);

    checkTerrain(state,ctx);

    inventory(state,ctx);
    score(state,ctx);
    joystick(state,ctx);

    if (state.isDebug) {
      debug(state,ctx);
    }

    // terrain, plants, player, joystick, score, debug (mouse & inputs)
    // each element type is its own private function from above
    // set up the stroke and fill colors per element type
    // finally do the stroke and fill per element type
    //ctx.save();

    // get image data at the center of the screen
    // if the color equal dimgray, then player is out of bounds
    // let x = state.canvas.width/2-state.dx, y = state.canvas.height/2-state.dy;

    //ctx.restore();        

    //ctx.putImageData(state.bImg,x-590,y+40);

    //ctx.moveTo(x-490+105,y+140);
    //ctx.arc(x-490,y+140,105,0,Math.PI*2);// secret grove arc @ (-490,140) r ~100
    //ctx.rect(x-100,y-2000,200,1700);// overgrown trail rect @ (-100,-2000,200,1700)

    //ctx.fill();

    // canopy layer

    // ctx.globalAlpha=0.1;
    // ctx.moveTo(state.player.x+state.player.r+state.player._r,state.player.y);
    // ctx.arc(state.player.x,state.player.y,state.player.r+state.player._r,0,2*Math.PI);
    // ctx.fill();
    // ctx.globalAlpha=1;

    //ctx.clip();

    //joystick(state,ctx);
    //inventory(state,ctx);
    //score(state,ctx);
  };

  // return the public API
  return api;

}());

let inputMap = [
  {x:100,y:100,r:10,k:keybinds.up},
  {x:75,y:125,r:10,k:keybinds.left},
  {x:100,y:125,r:10,k:keybinds.down},
  {x:125,y:125,r:10,k:keybinds.right},
  {x:75,y:100,r:10,k:keybinds.loosen},
  {x:125,y:100,r:10,k:keybinds.tighten},

  {x:175,y:100,r:10,k:keybinds.primary},
  {x:150,y:100,r:10,k:keybinds.secondary},
  {x:200,y:100,r:10,k:keybinds.tertiary},
  {x:150,y:125,r:10,k:keybinds.mouseL},
  {x:175,y:125,r:10,k:keybinds.mouseM},
  {x:200,y:125,r:10,k:keybinds.mouseR},

];

/* ENTITIES */

const CLADES = {
  GRASS:{
    n:"grass",v:1, r:1, g:5,
    draw:(plant, ctx, player)=>{
        ctx.fillStyle = COLORS.LAWNGREEN;
        ctx.fillStyle=plant.t.c;
        let dist =Math.hypot(plant.x-player.x,plant.y-player.y);
        if (dist < player._r) {
          //ctx.fillStyle = COLORS.RED;
          // TODO: increase points
        }
        ctx.beginPath();
        ctx.arc(plant.x,plant.y,plant.t.r,0,2*Math.PI);
        ctx.stroke();
        ctx.fill();
        // TODO: copy a static image (created during the create phase)
    }
  }, 
  CLOVER:{
    n:"clover",v:3, r:3, g:1,
    draw:(state, ctx, index, id)=>{
      let x=state.zones[index].x,y=state.zones[index].y,r=state.zones[index].v;
      let angle = 2*Math.PI/3; // 120deg
      let k = 3; // 360/120 = 2PI / (2PI/3) = 3

      let offset = angle * ((x*y*id) % 3)/3;//Math.random();
      let offsetX = (x+id) / (x*y);
      let offsetY = (y+id) / (x*y);

      ctx.beginPath();
      ctx.fillStyle = COLORS.SPRINGGREEN;
      ctx.strokeStyle = COLORS.GREEN;

      for (let i = 0; i < k; i++) {
        let _angle=(angle * i)+offset;
        let _x = x - state.dx + offsetX + Math.cos(_angle) * r + (10 * id);
        let _y = y - state.dy + offsetY + Math.sin(_angle) * r + (10 * id);

        ctx.moveTo(_x+r,_y);
        ctx.arc(_x,_y,r,0,2*Math.PI);
      }

      ctx.fill();
      ctx.stroke();

      // a trio of dark green circles
      //let r = 10;
      //ctx.moveTo(x+r,y);
      //ctx.arc(x,y,r,0,2*Math.PI);
      // choose random angle
      //let angle = Math.random() * 2 * Math.PI;
    }
  }
};
