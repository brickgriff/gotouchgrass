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
    ctx.fillStyle = COLORS.DIMGRAY;
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  };

  var path = function(state,ctx) {
    let x=state.cx,y=state.cy;

    // fill path
    ctx.fillStyle = COLORS.DARKGRAY;
    ctx.beginPath();
    ctx.arc(x,y,325,0,2*Math.PI); // wooded clearing arc @ (0,0) r 325
    ctx.rect(x-100,y-3000,200,3000); // overgrown trail rect @ (-100,-3000) w 200 h 3000
    ctx.moveTo(x+1000,y-3000);
    ctx.arc(x,y-3000,1000,0,2*Math.PI); // meeting place arc @ (0,-3000) r 1000
    ctx.moveTo(x-490+100,y+140);
    ctx.arc(x-490,y+140,100,0,Math.PI*2); // secret grove arc @ (-490,140) r 100
    ctx.fill();

    // separate stroke path to avoid calling stroke() above
    ctx.strokeStyle=COLORS.DARKGRAY;
    ctx.lineWidth=100;
    ctx.beginPath();

    let angle = Math.atan2(140,-490);
    let dist = Math.hypot(-490,140);

    ctx.moveTo(x+(dist*Math.cos(angle)),y+(dist*Math.sin(angle)));
    ctx.lineTo(x,y); // secret path line (0,0) to (-490,140)
    ctx.stroke();
  };
  
  var secret = function(state,ctx) {
    let x=state.cx,y=state.cy;

    // secret layer
    ctx.fillStyle = COLORS.DIMGRAY;

    ctx.save();
    ctx.beginPath();

    ctx.moveTo(state.player.x+state.player.r+state.player._r,state.player.y);
    ctx.arc(state.player.x,state.player.y,state.player.r+state.player._r,0,2*Math.PI,true);// canopy ring arc @ (0,0) r 500

    let path1 = new Path2D();// clipping area
    path1.rect(0,0,state.canvas.width,state.canvas.height);

    path1.moveTo(x+295,y);
    path1.arc(x,y,295,0,2*Math.PI);// canopy hole arc @ (0,0) r ~300
    
    path1.moveTo(x+995,y-3000);
    path1.arc(x,y-3000,995,0,2*Math.PI);
    
    ctx.clip(path1,"evenodd"); // fill clipping area
    ctx.rect(0,0,state.canvas.width,state.canvas.height);

    ctx.fill();
    
    ctx.restore(); // defaults
  };

  var terrain = function (state, ctx) {
    //ctx.save();
    let x=state.cx,y=state.cy;
    path(state,ctx);
    // terrain image (1cm^2=100px^2)
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
    
    // TODO: move vector normalization to util api
    //ctx.restore();
    // if mouse isDragged or the distance is not 0 (due to keyboard inputs)
    ctx.beginPath();
    ctx.fillStyle=COLORS.DARKGRAY;
    let x,y,_x=state.player.x,_y=state.player.y;
    //console.log(state.player.s);
    if (state.player.s > 0) {
      let dist = state.player.r*(state.player.s*0.20);
      // calc vector components
      vector={
        x:Math.round(dist*Math.cos(state.player.t)),
        y:Math.round(dist*Math.sin(state.player.t))
      };

      // draw pointer line
      x=state.player.x, y=state.player.y; // (canvas.w/2,canvas.h/2)
      _x=x+vector.x,_y=y+vector.y;
    }
    ctx.moveTo(_x+5,_y);
    //ctx.lineTo(_x,_y);
    ctx.arc(_x,_y,5,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();    

    // draw range circle
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.r+state.player._r,0,2*Math.PI);
    ctx.stroke();
    ctx.setLineDash([]); // reset line dash

    // terrain test

    ctx.fillStyle=COLORS.DIMGRAY;
    let dimgray=ctx.fillStyle;
    ctx.fillStyle=COLORS.DARKGRAY;
    let darkgray=ctx.fillStyle, td = state.tImg.data;
    ctx.fillStyle=`rgb(${td[0]} ${td[1]} ${td[2]} / ${td[3]})`;
    // TODO: try to get a pixel from the center of the image
    let tStyle=ctx.fillStyle;

    ctx.fillStyle=COLORS.LAWNGREEN;
    let lawngreen=ctx.fillStyle, fd = state.fImg.data;
    ctx.fillStyle=`rgb(${fd[0]} ${fd[1]} ${fd[2]} / ${fd[3]})`;
    let fStyle=ctx.fillStyle;
    //console.log(tStyle,dimgray);

    state.player.isLost=tStyle!==darkgray;
    state.player.isUnderCanopy=tStyle===dimgray;
    //console.log(state.player.isLost);
    //console.log(pStyle,lawngreen);
    state.player.isOverGrass=fStyle===lawngreen;
    
  };

  // draw input (debug)
  var debug = function(state, ctx) {
    mouse(state,ctx);
    let x = state.player.x, y = state.player.y;
    ctx.putImageData(state.tImg,x-7,y-8);
    ctx.putImageData(state.fImg,x-3,y-2);

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
    ctx.rect(x-5,y-5,10,10);
    ctx.moveTo(x,y);
    let dist = state.player.r*state.player.s*0.20;
    if (state.player.s > 0)
    ctx.lineTo(x+(dist*Math.cos(state.player.t)),y+(dist*Math.sin(state.player.t)));
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

  };
  // draw garden
  var plants = function(state, ctx) {
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
    ctx.fillStyle=COLORS.LAWNGREEN;
    ctx.beginPath();
    grassList.forEach(grass => {

      ctx.moveTo(state.cx+grass.x+grass.r,state.cy+grass.y);
      ctx.arc(state.cx+grass.x,state.cy+grass.y,grass.r,0,2*Math.PI);

    });
    ctx.fill();
    ctx.fillStyle=COLORS.SPRINGGREEN;
    ctx.beginPath();
    cloverList.forEach(clover => {

      ctx.moveTo(state.cx+clover.x+clover.r,state.cy+clover.y);
      ctx.arc(state.cx+clover.x,state.cy+clover.y,clover.r,0,2*Math.PI);

    });
    ctx.fill();
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

  // joystick
  var joystick = function(state, ctx) {
    // vector angle in radians from state (keyboard and/or mouse)
    let vector = getVector(state);

    let limit = state.player.r+state.player._r;
    let _x=state.mouse._x,_y=state.mouse._y; // mousemove position
    let x=state.mouse.x,y=state.mouse.y; // mousedown position

    // if mouseleft is pressed, then draw a ring around the mousedown
    if (state.keys.includes(keybinds.mouseL)) {
      ctx.lineWidth = 5;
      ctx.strokeStyle = COLORS.LIGHTGRAY;
      ctx.beginPath();
      ctx.arc(x,y,limit,0,2*Math.PI);
      ctx.stroke();
    }

    // if mousemove (isDragged), then draw filled dot    
    if (state.mouse.isDragged) {
      // drag distance; length of mousedown to mousemove, in pixels
      let dist = Math.hypot(_x-x,_y-y);
      // MIN (drag distance vs capped distance)
      dist=Math.min(dist, limit);
      //console.log(dist);
      let angle = Math.atan2(vector.y,vector.x);
      ctx.fillStyle = COLORS.GRAY;
      ctx.beginPath();
      // displace filled dot, 75% the size of the ring
      ctx.arc(x + (Math.cos(angle) * dist),y + (Math.sin(angle) * dist),limit*0.75,0,2*Math.PI);
      ctx.fill();
    }
  };
  const grassList = [
    {x:0,y:0,r:150},
    {x:5,y:-1000,r:150},
    {x:-490,y:140,r:55},
    {x:0,y:-3000,r:500},
  ];
  const cloverList = [
    {x:150,y:250,r:70},
    {x:-65,y:-1200,r:80},
  ];
  // public api is a function
  api.draw = function (state, ctx) {
    //console.log(`draw`);

    background(state,ctx);
    path(state, ctx);
    //terrain image data
    state.tImg=ctx.getImageData(state.player.x-5,state.player.y-5,10,10);
    plants(state,ctx);
    //foliage image data
    state.fImg=ctx.getImageData(state.player.x-5,state.player.y-5,10,10);

    player(state, ctx);
    secret(state,ctx);
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

// TODO: move vector determination to event api
function getVector(state) {
  if (state.keys.includes(keybinds.mouseL)) {
    return {x:state.mouse._x-state.mouse.x,y:state.mouse._y-state.mouse.y};
  } else {
    return {
      x:(state.keys.includes(keybinds.right) - state.keys.includes(keybinds.left))*state.player.r*2,
      y:(state.keys.includes(keybinds.down) - state.keys.includes(keybinds.up))*state.player.r*2
    };
  }
  return vector;
}


// function getVectorMouse(mouse) {
//   //console.log(mouse);
//   //let vx = mouse._x-mouse.x;//canvas.width/2;
//   //let vy = mouse._y-mouse.y;//canvas.height/2;
//   ///return {vx,vy};
//   return {x:mouse._x,y:mouse._y};
// }

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
