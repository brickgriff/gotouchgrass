// canvas is created/configured programmatically now
//<!--canvas-->
//<canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;"></canvas>

if (typeof window === "undefined") {
  console.log("no window");
  try {
    throw new Error("no window");
  } catch (e) {
    console.log(e.message);
  }
}

/* LIGHTS */
// colors, shadows
const COLORS = {BLACK:"black", GREEN:"green", GRAY:"gray", LIGHTGRAY: "lightgray",
DARKGRAY:"darkgray", BLUE:"blue", GOLD:"gold", LIGHTBLUE:"lightblue", RED:"red",
SPRINGGREEN: "springgreen", LAWNGREEN: "lawngreen", WHITE: "white"};
/* END LIGHTS */

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width=800;
canvas.height=800;

// TODO: pixelated style?  image-rendering: pixelated; image-rendering: crisp-edges;
// TODO: auto-resize and auto-rescale (resolution)

// suppress system right click menu
canvas.addEventListener("contextmenu", (e)=>{e.preventDefault()});
canvas.style="border:1px solid #cccccc;";

document.body.appendChild(canvas);

var draw = (function () {
  // draw background
  var background = function (state, ctx) {
    ctx.fillStyle = COLORS.DARKGRAY;
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  };

  // draw ball
  var ball = function (state, ctx) {
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(state.x-state.dx, state.y-state.dy, state.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  var player = function (state, ctx) {
    ctx.beginPath();
    ctx.arc(state.player.x,state.player.y,state.player.r,0,2*Math.PI);
    ctx.fillStyle = COLORS.LIGHTGRAY;
    ctx.fill();

    ctx.strokeStyle = "dashed";
    ctx.strokeStyle = COLORS.LIGHTGRAY;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.arc(state.player.x, state.player.y, state.player._r, 0, 2*Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  var keyboard = function(state, ctx) {
    ctx.lineWidth = 1;
    ctx.fillStyle = COLORS.GRAY;
    ctx.strokeStyle = COLORS.LIGHTGRAY;

    buttons.forEach((button) => {
      ctx.beginPath();
      // TODO: label keys
      ctx.arc(button.x,button.y,button.r,0,2*Math.PI);
      if (state.keys.includes(button.k)) ctx.fill();
      ctx.stroke();
    });
  }

  var garden = function(state, ctx) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = COLORS.GREEN;

    state.plants.forEach((plant, index)=>{
      console.log(state.plants[index]);
      ctx.fillStyle = plant.c;
      ctx.globalAlpha = 0.05;

      ctx.beginPath();
      ctx.arc(plant.x-state.dx,plant.y-state.dy,plant.r,0,2*Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 1;
  
      let area = Math.PI * Math.pow(plant.r,2);
      let count = 10;//area * 0.01;
      for (let i = 0; i < count; i++) {
        //ctx.beginPath();
        // create a plant at a random point
        // only if the plant is in range
        //ctx.arc(plant.x-state.dx,plant.y-state.dy,1,0,2*Math.PI);
        //ctx.fill();
        //ctx.stroke();

        plant.t.draw(state, ctx, index, i);
      }
    });
  }

  var mouse = function(state, ctx) {
    ctx.lineWidth=5;
    ctx.strokeStyle=COLORS.BLACK;
    ctx.beginPath();
    ctx.moveTo(state.player.x,state.player.y);
    ctx.lineTo(state.mouse.x,state.mouse.y);
    ctx.stroke();

    ctx.lineWidth=5;
    ctx.strokeStyle=COLORS.WHITE;
    ctx.beginPath();
    ctx.moveTo(state.mouse._x,state.mouse._y);
    ctx.lineTo(state.mouse.x,state.mouse.y);
    ctx.stroke();

  }

  var joystick = function(state, ctx) {
    let vector = getVector(state);
    //console.log(vector);
    let vx =0, vy =0;
    if (vector !== undefined) vx = Math.cos(vector), vy = Math.sin(vector);
    let speed = 0.5, factor = 100;
    
    if (state.keys.includes(keybinds.mouseL)) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = COLORS.LIGHTGRAY;

      ctx.beginPath();
      ctx.arc(state.mouse._x,state.mouse._y,speed*factor,0,2*Math.PI);
      ctx.stroke();
    }

    let x=state.mouse._x,y=state.mouse._y;
    //console.log(vx,vy);
    let movement = Math.hypot(x-state.mouse.x,y-state.mouse.y);
    
    if (state.mouse.isDragged) {
      ctx.beginPath();
      
      movement=Math.min(movement, speed*factor);
      //console.log(movement,speed*factor);
      x = x + vx * movement;
      y = y + vy * movement;
    
      //console.log(distance);
      ctx.arc(x,y,speed*factor*0.75,0,2*Math.PI);
      ctx.fill();

    }

    if (state.mouse.isTapped) console.log("TAPPED");
    state.mouse.isTapped = false;

    if (state.keys.includes(keybinds.mouseL)) {
      speed = Math.min(movement/factor,speed);
    }
    // TODO: modify speed when at the boundary
    state.dx += speed*vx;
    state.dy += speed*vy;

    let length = 15;
    state.player.dx = length*vx;
    state.player.dy = length*vy;

    ctx.strokeStyle = COLORS.LIGHTGRAY;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(state.player.x,state.player.y);
    ctx.lineTo(state.player.x+state.player.dx,state.player.y+state.player.dy);
    ctx.stroke();    

  }

  // public api is a function
  var api = function (state, ctx) {
    //console.log(`draw`);
    background(state, ctx);
    garden(state,ctx);
    //ball(state, ctx);
    //mouse(state, ctx);
    player(state, ctx);
    joystick(state, ctx)
    // score;
    // leaves? chlorophyll? seeds? area? acreage?

    //keyboard(state, ctx);
  };

  // return the public API
  return api;
}
());

let buttons = [
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


function getVector(state) {
  let vector;
  if (state.keys.includes(keybinds.mouseL)) {
    vector = getVectorMouse(state.mouse);
  } else {
    vector = getVectorKeyboard(state.keys);
  }
  if (vector.dx === 0 && vector.dy === 0) return;
  let radians = Math.atan2(vector.dy,vector.dx);
  //console.log(radians*180/Math.PI);
  return radians;

}

function getVectorKeyboard(keys) {
  let dx = keys.includes(keybinds.right) - keys.includes(keybinds.left); 
  let dy = keys.includes(keybinds.down) - keys.includes(keybinds.up);
  return {dx,dy};
}

function getVectorMouse(mouse) {
  let dx = mouse.x-mouse._x;//canvas.width/2;
  let dy = mouse.y-mouse._y;//canvas.height/2;
  return {dx,dy};
}



    // up: {code: isUsingWASD ? "KeyW" : "KeyE", x:100,y:100,r:10},
    // down: {code: isUsingWASD ? "KeyS" : "KeyD", x:75,y:120,r:10},
    // left: {code: isUsingWASD ? "KeyA" : "KeyS", x:100,y:120,r:10},
    // right: {code: isUsingWASD ? "KeyD" : "KeyF", x:125,y:120,r:10}











/* CANVAS */

// TODO: package canvas methods in a class
// size, events (click, move, etc)
// create a gray box, centered

function clearCanvas() {
  console.log(`configCanvas()`);
  // move the viewport (canvas) based on
  // camera position and the center point of the viewport
  // console.log(camera.x+canvas.width/2,-camera.y-canvas.height/2);
  ctx.reset();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // TODO: ctx.translate based on camera.x, camera.y
  // TODO: ctx.scale based on camera.z
}

function worldToCanvas(x,y) {
  return {x:x+canvas.width/2-camera.x,y:y+canvas.height/2-camera.y};
}

function canvasToWorld(x,y) {
  // go from (canvas.w/2, canvas.h/2) to (0,0)
  return {x:x-canvas.width/2+camera.x,y:y-canvas.height/2+camera.y};
}

function drawCanvas() {
  console.log(`drawCanvas()`);
  // paint width x height around the camera (center)
  ctx.beginPath();
  ctx.fillStyle = COLORS.GRAY;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // draw background
  //clearCanvas(); // translations, rotations, zoom, pitch
  //drawCanvas();
  // draw plants

  // draw player
  // draw HUD
}

/*
function drawPattern() {
  console.log(`drawPattern()`);
  // for loop
  let length = 25;
  let unit = 100;

  console.log(camera, getOffset(canvas.width,camera.x,unit),
    getOffset(canvas.height,camera.y,unit));

  for (let i = -canvas.width/2; i <= canvas.width/unit; i++) {
    for (let j = -canvas.height/2; j <= canvas.height/unit; j++) {
      drawCross(i*unit+getOffset(canvas.width,camera.x,unit), 
        j*unit+getOffset(canvas.height,camera.y,unit), 
        length);
    }
  }
}

// TODO: REFACTOR THIS!!!
function getOffset(canvasAxis,cameraAxis,unit) {
  let sign = Math.sign(cameraAxis);
  let numPatterns = canvasAxis/unit;
  let centerOffset = numPatterns%2===0 ? 0 : unit/2;

  let x = Math.abs( cameraAxis ) + unit * (3/4); // FIXME: rename!!!
  let offset = sign*Math.floor( x / unit ) * unit + centerOffset;
  return offset;
}

function drawCross(x,y,l) {
  ctx.beginPath();
  //console.log(`drawCross(${x},${y},${l})`);
  ctx.moveTo(x-l/2, y);
  ctx.lineTo(x+l/2, y);
  ctx.moveTo(x, y-l/2);
  ctx.lineTo(x, y+l/2);

  //ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.LIGHTGRAY;
  ctx.stroke();
}
*/
/* END CANVAS */





/* CAMERA */
// view xyz
const camera = {x: 0, y:0, z:1, r:15, c: COLORS.DARKGRAY};
let isCameraBoundToPlayer = false;

function drawCamera() {
  console.log(`drawCamera()`);

  if (isCameraBoundToPlayer) {
    camera.x = player.x;
    camera.y = player.y;
  }

  //ctx.beginPath();
  ctx.moveTo(camera.x+camera.r,camera.y);
  ctx.arc(camera.x,camera.y,camera.r,0,2*Math.PI);
  ctx.strokeStyle = camera.c;
  //ctx.stroke();
}
/* END CAMERA */





/* WORLD */
// world xyz

// TODO: a large circular park
// TODO: score system - one touch = one point
function drawScore() {
  const text = `${player.s.toString().padStart(4,'0')}`;
  ctx.beginPath();
  ctx.fillStyle = COLORS.GOLD;
  ctx.font = "50px Arial";
  ctx.fillText(text,-canvas.width/2+camera.x,-canvas.height/2+camera.y+50);
}

function updateScore() {
  //console.log(`(${player.x}, ${player.y}) : ${valueAtPoint(player.x,player.y)}`);
  
  let canvasCamera = worldToCanvas(camera.x, camera.y);
  let x0 = canvasCamera.x;
  let y0 = canvasCamera.y;
  let targetData = ctx.getImageData(
    x0-player.r,y0-player.r,
    player.r*2, player.r*2
  );

  let canvasPlayer = worldToCanvas(player.x,player.y);
  let x1 = canvasPlayer.x;
  let y1 = canvasPlayer.y;
  let sourceData = ctx.getImageData(
    x1-player.r,y1-player.r,
    player.r*2, player.r*2
  );
  console.log(`Player: (${x1}, ${y1})`);
  
  /*
  if (getValueAtPoint(player.x,player.y) !== 0) {
    ctx.beginPath();
    ctx.fillStyle = COLORS.GREEN;
    ctx.fillRect(x1,y1,1,1);
  }
  */

  for (let i = 0; i < sourceData.data.length; i+=4) {
    let x2 = i/4%(player.r*2)+x1-player.r;
    let y2 = Math.floor(i/4/(player.r*2))+y1-player.r;

    let r = Math.hypot(x2-x1, y2-y1);
    let isInside = r <= player.r; // inside the radius
    if (!isInside) continue;

    targetData.data[i+0] = sourceData.data[i+0];
    targetData.data[i+1] = sourceData.data[i+1];
    targetData.data[i+2] = sourceData.data[i+2];
    targetData.data[i+3] = sourceData.data[i+3];

    //console.log(`ImgData #${(i/4).toString().padStart(3,'0')} (${x2},${y2}): ${sourceData.data[i+0]},${sourceData.data[i+1]},${sourceData.data[i+2]},${sourceData.data[i+3]}\n`);
    let isGreen = sourceData.data[i+1] >= 0 && sourceData.data[i+1] === Math.max(sourceData.data[i+0],sourceData.data[i+1],sourceData.data[i+2]);
    if (!isGreen)continue;


    let worldPixel = canvasToWorld(x2,y2);
    let worldPixelValue = getValueAtPoint(worldPixel.x, worldPixel.y);

    //console.log(`WorldPixel #${(i/4+1).toString().padStart(3,'0')}: (${worldPixel.x}, ${worldPixel.y}): ${worldPixelValue}`);
    //console.log(`isNear:${isNear}, isGreen:${isGreen}`);

    if (worldPixelValue !== undefined && worldPixelValue !== 0 ) {
      //console.log(`Pixel #${(i/4+1).toString().padStart(3,'0')}: (${x2}, ${y2}) : ${worldPixelValue}`);
      
      targetData.data[i+0] = 255;
      targetData.data[i+1] = 0;
      targetData.data[i+2] = 0;
      targetData.data[i+3] = 255;

      setValueAtPoint(worldPixel.x,worldPixel.y,0);
      //console.log("value at point changed:",`(${worldPixel.x},${worldPixel.y})`,getValueAtPoint(worldPixel.x,worldPixel.y));

      player.s = Math.max(0,player.s+worldPixelValue);
    } else if (worldPixelValue === 0) {
      //console.log(`Pixel #${(i/4+1).toString().padStart(3,'0')}: (${x2}, ${y2}) : ${worldPixelValue}`);

      setValueAtPoint(worldPixel.x,worldPixel.y,-1);
    }
  }
  // FIXME: use a virtual canvas to getImageData that is out-of-frame
  ctx.putImageData(targetData,x0-player.r,y0-player.r);
  //ctx.beginPath();
  ctx.moveTo(camera.x+player.r,camera.y);
  ctx.arc(camera.x,camera.y,player.r,0,2*Math.PI);
  ctx.strokeStyle = COLORS.RED;
  //ctx.stroke();

  for(let [x,col] of plants) {
    for (let [y,v] of col) {
      if (v === 0) {
        ctx.beginPath();
        ctx.fillStyle = COLORS.RED;
        ctx.fillRect(x,y,1,1);        
      }
    }
  }
}
/* --- */

/* ENTITIES */
//    plants.push({x:canvas.width/2,y:canvas.height/2,r:400,c:COLORS.LAWNGREEN,v:1,t:CLADES.GRASS});
//    plants.push({x:canvas.width/2+250,y:canvas.height/2+250,r:120,c:COLORS.SPRINGGREEN,v:3,t:CLADES.CLOVER});

const CLADES = {
  GRASS:{
    n:"grass",v:1, 
    draw:(state, ctx, index, id)=>{
      let x=state.plants[index].x,y=state.plants[index].y,r=state.plants[index].v;
      ctx.beginPath();
      ctx.fillStyle = COLORS.LAWNGREEN;
      ctx.strokeStyle = COLORS.GREEN;

      ctx.moveTo(x+r,y);
      ctx.arc(x,y,r,0,2*Math.PI);

      ctx.fill();
      ctx.stroke();

      // a loose cluster of green dots
      //let r = 5;
      //ctx.moveTo(x+r,y);
      //ctx.arc(x,y,r,0,2*Math.PI);
    }
  }, 
  CLOVER:{
    n:"clover",v:3, 
    draw:(state, ctx, index, id)=>{
      let x=state.plants[index].x,y=state.plants[index].y,r=state.plants[index].v;
      let angle = 2*Math.PI/3; // 120deg
      let k = 3; // 360/120 = 2PI / (2PI/3) = 3

      let offset = angle * ((x*y) % 3)/3;//Math.random();
      let offsetX = x / (x*y);
      let offsetY = y / (x*y);

      ctx.beginPath();
      ctx.fillStyle = COLORS.SPRINGGREEN;
      ctx.strokeStyle = COLORS.GREEN;

      for (let i = 0; i < k; i++) {
        let _angle=(angle * i)+offset;
        _x = x - state.dx +offsetX + Math.cos(_angle) * r;
        _y = y - state.dy +offsetY + Math.sin(_angle) * r;

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

const plants = new Map();

function getValueAtPoint(x,y) {
  if (!plants.has(x) || !plants.get(x).has(y)) return undefined;
  return plants.get(x).get(y);
}

function setValueAtPoint(x,y,v) {
  if (!plants.has(x)) plants.set(x,new Map());
  plants.get(x).set(y,v);
}

// grass plants are simple green dots
// they slowly grow in both number and size
// they disappear if touched by the player
// then the score increases
function drawPlants() {

  // TODO: convert to Promises

  function normalize(g,h) {
    g = g<0?0:g>canvas.width?canvas.width:g;
    h = h<0?0:h>canvas.height?canvas.height:h;
    return {x:g,y:h};
  }

  for (let l = 0; l < 100; l++) {

    let point = {x:Math.random() * canvas.width, y:Math.random() * canvas.height};
    let normalPoint = normalize(point.x,point.y);
    let worldPoint = canvasToWorld(normalPoint.x,normalPoint.y);
    for (let m = 0; m < 200; m++ ) {
      let dx = (Math.random() * 2 - 1) * 200;
      let dy = (Math.random() * 2 - 1) * 200;
      let normalPoint2 = normalize(normalPoint.x + dx,normalPoint.y + dy);
      let worldPoint2 = canvasToWorld(normalPoint2.x, normalPoint2.y);
      CLADES.GRASS.draw(worldPoint2.x,worldPoint2.y,1);
    }
    CLADES.CLOVER.draw(worldPoint.x,worldPoint.y,3);
  }

  // draw a set of grass plants
  //drawGrass();
  // draw a set of clover plants
  //drawClover();

  // TODO: use math to determine what gets planted where
  // essentially, each plant has a chance of growing in soil
  // the chance is determined by:
  //   A) the general prevelance  of the seed
  //   B) the combination of sand, clay, and loam (silt)
  //   C) the levels of light, water, and humus
}

function drawClover() {
  ctx.beginPath();

  // TODO: create 100 grass plants with regular x,y
  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j <= 10; j++) {
      let x = -canvas.width/2+i*20+50+(j%2)*10;
      let y = -canvas.height/2+j*16+50;

      ctx.moveTo(x+2*grass.r,y);
      ctx.arc(x,y,2*grass.r,0,2*Math.PI);
      //console.log(`(${x},${y})`,getValueAtPoint(x,y));
      if (getValueAtPoint(x,y)===undefined) setValueAtPoint(x,y,-3);
    }
  }

  ctx.fillStyle = grass.c;
  ctx.fill();
}
const grass = {r: 2, v:1, c:COLORS.GREEN};
function drawGrass() {
  ctx.beginPath();

  // TODO: create 100 grass plants with regular x,y
  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j <= 90; j++) {
      let x = i*10+50;
      let y = -canvas.height/2+j*10+50;

      ctx.moveTo(x+grass.r,y);
      ctx.arc(x,y,grass.r,0,2*Math.PI);
      //console.log(`(${x},${y})`,getValueAtPoint(x,y));
      if (getValueAtPoint(x,y)===undefined) setValueAtPoint(x,y,grass.v);
    }
  }

  // TODO: create 50 grass plants with random x & y
  // TODO: give them random radii less than the maxRadius
  /*
  ctx.moveTo(60+grass.r,60);
  ctx.arc(60,60,grass.r,0,2*Math.PI);
  console.log("(60,60)",getValueAtPoint(60,60));
  if (getValueAtPoint(60,60)==undefined) setValueAtPoint(60,60,grass.v);
  console.log("(60,60)",getValueAtPoint(60,60));
  ctx.moveTo(-90+grass.r,-30);
  ctx.arc(-90,-30,grass.r,0,2*Math.PI);
  //console.log("(-90,-30)",getValueAtPoint(-90,-30));
  if (getValueAtPoint(-90,-30)==undefined) setValueAtPoint(-90,-30,grass.v);
  */
  ctx.fillStyle = grass.c;
  ctx.fill();
}

// TODO: create a map of <type:properties> (<grass:{color,maxRadius, etc})
/* --- */
