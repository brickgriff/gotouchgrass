/* LIGHTS */
// colors, shadows
const COLORS = {BLACK:"black", GREEN:"green", GRAY:"gray", LIGHTGRAY: "lightgray",
DARKGRAY:"darkgray", BLUE:"blue", GOLD:"gold", LIGHTBLUE:"lightblue", RED:"red",
SPRINGGREEN: "springgreen", LAWNGREEN: "lawngreen", WHITE: "white", YELLOW: "yellow",
CYAN: "cyan", MAGENTA: "magenta", DIMGRAY: "dimgray"};
/* END LIGHTS */


const Display = (function(/*api*/) {

    var api = {};

  /*
  var background = function (state, ctx) {
    ctx.fillStyle = COLORS.DARKGRAY;
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  };
  */

  var terrain = function (state, ctx) {
    ctx.fillStyle = COLORS.DIMGRAY;
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    ctx.fillStyle = COLORS.DARKGRAY;
    ctx.beginPath();
    let x=(state.canvas.width/2)-state.dx,y=(state.canvas.height/2)-state.dy;
    ctx.arc(x,y,300,0,2*Math.PI);
    ctx.moveTo(x+1000,y-3000);
    ctx.arc(x,y-3000,1000,0,2*Math.PI);
    ctx.moveTo(state.player.x+state.player.r+state.player._r,state.player.y);
    ctx.arc(state.player.x,state.player.y,state.player.r+state.player._r,0,2*Math.PI);
    ctx.moveTo(x-285+3,y+100);
    ctx.arc(x-285,y+95,3,0,2*Math.PI);
    ctx.rect(
      x-100,y-3000,200,3000

    );
    ctx.fill();
    ctx.clip();
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
    ctx.strokeStyle = COLORS.LIGHTGRAY;
    ctx.strokeStyle = "dashed";
    ctx.fillStyle = COLORS.LIGHTGRAY;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(state.player.x,state.player.y,state.player.r,0,2*Math.PI);
    ctx.fill();

    // TODO: move vector normalization to util api
    let vector = getVector(state);
    let angle = Math.atan2(vector.y,vector.x);
    let dist = 0.75*(state.player.r+state.player._r);
    // use the following for a stretchy pointer
    // let dist = Math.min(Math.hypot(vector.x,vector.y), state.player.r+state.player._r);
    if (vector.x===0 && vector.y===0)dist=0;
    vector={x:dist*Math.cos(angle),y:dist*Math.sin(angle)};

    if (dist != 0) {
      // draw pointer line
      let x=state.player.x, y=state.player.y; // (canvas.w/2,canvas.h/2)
      let _x=x+vector.x,_y=y+vector.y;
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(_x,_y);
      ctx.stroke();    
    }

    // draw range circle
    ctx.setLineDash([10, 16]);
    ctx.beginPath();
    ctx.arc(state.player.x, state.player.y, state.player.r+state.player._r,0,2*Math.PI);
    ctx.stroke();
    ctx.setLineDash([]); // reset line dash

  };

  // draw input (debug)
  var inputs = function(state, ctx) {
    ctx.lineWidth = 1;
    ctx.fillStyle = COLORS.GRAY;
    ctx.strokeStyle = COLORS.LIGHTGRAY;

    inputMap.forEach((input) => {
      ctx.beginPath();
      // TODO: input labels
      // TODO: draw callbacks per input
      ctx.arc(input.x,input.y,input.r,0,2*Math.PI);
      if (state.keys.includes(input.k)) ctx.fill();
      ctx.stroke();
    });
  };
  // draw inventory
  var inventory = function(state, ctx) {

  };
  // draw garden
  var garden = function(state, ctx) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = COLORS.GREEN;

    state.cells.forEach(cell => {
      cell.forEach(plant => {
        var _plant = plant;
        _plant.x -= state.dx;
        _plant.y -= state.dy;      
        plant.t.draw(_plant,ctx,state.player);
      });
    });
  };

  //draw mouse lines
  var mouse = function(state, ctx) {
    // black line from player to mousemove
    ctx.lineWidth=5;
    ctx.strokeStyle=COLORS.BLACK;
    ctx.beginPath();
    ctx.moveTo(state.player.x,state.player.y);
    ctx.lineTo(state.mouse.x,state.mouse.y);
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

    let limit = 50;
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

    // terrain, plants, player, joystick, score, debug (mouse & inputs)
    // each element type is its own private function from above
    // set up the stroke and fill colors per element type
    // finally do the stroke and fill per element type
    ctx.save();
    terrain(state, ctx);

    let x = state.canvas.width/2-state.dx, y = state.canvas.height/2-state.dy;

    ctx.fillStyle=COLORS.LAWNGREEN;
    ctx.globalAlpha=0.5;
    ctx.beginPath();
    grassList.forEach(grass => {

      ctx.moveTo(x+grass.x+grass.r,y+grass.y);
      ctx.arc(x+grass.x,y+grass.y,grass.r,0,2*Math.PI);

    });
    ctx.fill();
    ctx.fillStyle=COLORS.SPRINGGREEN;
    ctx.beginPath();
    cloverList.forEach(clover => {

      ctx.moveTo(x+clover.x+clover.r,y+clover.y);
      ctx.arc(x+clover.x,y+clover.y,clover.r,0,2*Math.PI);

    });
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha=1;

    //mouse(state, ctx);
    player(state, ctx);
    joystick(state,ctx);
    //inventory(state,ctx);
    //score(state,ctx);
    //debug(state,ctx);
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
      x:state.keys.includes(keybinds.right) - state.keys.includes(keybinds.left),
      y:state.keys.includes(keybinds.down) - state.keys.includes(keybinds.up)
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
