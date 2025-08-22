// canvas is created/configured programmatically now
//<!--canvas-->
//<canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;"></canvas>


  // SCREEN - resolution and color space
  // WINDOW - dimensions and the browser DOM
  // CANVAS - size and position

  // LIGHTS - color palette
  // CAMERA - viewport and HUD
  // ACTION - listeners and timers

  // WORLD - terrain and weather
  // PLAYER - stats and tools
  // ENTITIES - plants, objects, and NPCs


    /*
    var grass = (cells) => { 
      cells.forEach((cell,i) => {
        let x = cellWidth*(Math.floor(i%pointWidth)+Math.random());
        let y = cellHeight*(Math.floor(i/pointHeight)+Math.random());
        cell.push({x:x,y:y,a:0,t:CLADES.GRASS});
      });
    };
    */

/*

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

*/

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

    // check for camera constraints to move player relative the viewport
    // relative position of the center of the world
    //state.player.x=Math.round(state.canvas.width/2);
    //state.player.y=Math.round(state.canvas.height/2);
    // state.cx=state.player.x-state.dx;
    // state.cy=state.player.y-state.dy;
    
    //console.log(angle*180/Math.PI,dist,vector.x,vector.y);
    //console.log(state.player.isLost,state.player.isOnBareGround);

/*    state.cells.forEach(cell => {
      cell.forEach(plant =>{
        plant.a++; // increase age
        // age determines plant size (height and area), needs (costs), and yields (rewards)
      });
    });*/

/*

I plan to source all plants either from an official source, such as BCRP Forestry/TreeBaltimore or Blue Water Baltimore Nursery, or from seeds, cuttings, and divisions mindfully selected from local wild specimens:

- blackhaw viburnum (Viburnum prunifolium), perennial, 1
- elderberry (Sambucus canadensis), perennial, 2
- milkweed (Asclepias sp.), perennial, 3
- clustered mountain mint (Pycnanthemum muticum), perennial, 2
- purple coneflower (Echinacea purpurea), perennial, 5
- black-eyed Susan (Rudbeckia hirta), perennial/biennial, 4
- meadow phlox (Phlox maculata), perennial, 3


*/
/*
cozy - farm and forage 
roguelite - metaprogression
automation/simulation - manage dynamic processes
resource management/city builder - start with nothing and build an empire
vampire survivor - navigate battlefields to collect treasure to outlast endless waves of enemies
reverse vampire survivor - manage a roster of units to prevent the enemy from accessing the goal

what is the goal?
your mycorrhizae?


you are alone in a small field of grass
spore pod idea?
there is trash stuck in the grass
you cannot move, you can only touch grass
you can only touch the grass closest to you
by doing that, you place your first spore
the spore has a radius of one
this extends your range to touch more grass
this places a second spore
this doubles the radius for the first spore
by placing spores, you can reach the trash
trash cans?
keep it simple, silly
you are a small fungus creature
as a decomposer, you eat dead plants
you do this by touching and absorbing them
you can't directly use sunlight energy
you need plants; you need to touch grass
this only yields a small amount of sugars
this slightly  enhances your abilities
the world reacts to you
there is a seed bank in the ground
changing soil conditions, changes what thrives
too much activity causes disturbance
disturbance alters biodiversity


*/


/*
R = SUNLIGHT LEVELS = 0 (total shade) - 255 (total exposure)
G = pH BALANCE = 75 (very acidic) - 125 (very alkaline)
B = MOISTURE LEVELS = 50 (dry) - 100 (wet); 100+ (flooded)
*/
// /*
// window.addEventListener("keyup", (e) =>{
//   e.preventDefault();
//   let oldCamera = {x:camera.x,y:camera.y};
//   if (!e.repeat) {
//     let speed=10;
//     if (e.code==="ArrowUp") camera.y-=speed;
//     if (e.code==="ArrowDown") camera.y+=speed;
//     if (e.code==="ArrowLeft") camera.x-=speed;
//     if (e.code==="ArrowRight") camera.x+=speed;

//     if (e.code==="KeyL") isCameraBoundToPlayer = (isCameraBoundToPlayer^=true)!==0;
//     //console.log("isCameraBoundToPlayer",isCameraBoundToPlayer);
//   }
//   if (camera.x != oldCamera.x || camera.y != oldCamera.y) {
//     mainLoop();
//   }
// });
// */
// /*
// const Player = (() {})();

    // // fill path
    // ctx.fillStyle = COLORS.DARKGRAY;
    // ctx.beginPath();
    // ctx.arc(x,y,325,0,2*Math.PI); // wooded clearing arc @ (0,0) r 325
    // ctx.rect(x-100,y-3000,200,3000); // overgrown trail rect @ (-100,-3000) w 200 h 3000
    // ctx.moveTo(x+1000,y-3000);
    // ctx.arc(x,y-3000,1000,0,2*Math.PI); // meeting place arc @ (0,-3000) r 1000
    // ctx.moveTo(x-490+100,y+140);
    // ctx.arc(x-490,y+140,100,0,Math.PI*2); // secret grove arc @ (-490,140) r 100
    // ctx.fill();

    // separate stroke path to avoid calling stroke() above
    //ctx.strokeStyle=COLORS.DARKGRAY;
    // ctx.lineWidth=100;
    // ctx.beginPath();

    // let angle = Math.atan2(140,-490);
    // let dist = Math.hypot(-490,140);

    // ctx.moveTo(x+(dist*Math.cos(angle)),y+(dist*Math.sin(angle)));
    // ctx.lineTo(x,y); // secret path line (0,0) to (-490,140)
    // //ctx.stroke();



// //let keys = [];

/*
        ctx.beginPath();
        ctx.moveTo(state.player.x+state.player._r,state.player.y);
        ctx.arc(state.player.x,state.player.y,state.player.r,0,2*Math.PI);
        ctx.fill();
*/

// */
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

// /*
// function findAngle(keys) {
//   let dx = keys.includes(keybinds.right) - keys.includes(keybinds.left); 
//   let dy = keys.includes(keybinds.down) - keys.includes(keybinds.up);
//   if (dx == 0 && dy == 0) return;
//   let radians = Math.atan2(dy,dx);
//   //console.log(radians*180/Math.PI);
//   return radians
// }
// */

    //background(state, ctx);
    //garden(state,ctx);
    //ball(state, ctx);
    //player(state, ctx);
    //joystick(state, ctx)
    // score(state,ctx);
    // leaves? chlorophyll? seeds? area? acreage?
    //inputs(state, ctx);


    // up: {code: isUsingWASD ? "KeyW" : "KeyE", x:100,y:100,r:10},
    // down: {code: isUsingWASD ? "KeyS" : "KeyD", x:75,y:120,r:10},
    // left: {code: isUsingWASD ? "KeyA" : "KeyS", x:100,y:120,r:10},
    // right: {code: isUsingWASD ? "KeyD" : "KeyF", x:125,y:120,r:10}

    /*
    var per = state.frame / state.maxFrame,
    bias = 1 - Math.abs(0.5 - per) / 0.5,
    
    cx = state.canvas.width / 2,
    cy = state.canvas.height / 2,
    
    a = Math.PI * 2 * bias;
    
    // move x and y by a and bias
    state.x = cx + Math.cos(a) * 100 * bias;
    state.y = cy + Math.sin(a) * 50;
    
    // step frame
    state.f += state.fps * dt;
    state.f = state.f % state.maxFrame;
    state.frame = Math.floor(state.f);
    */

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


/* CANVAS */
/*
// TODO: package canvas methods in a class
// size, events (click, move, etc)
// create a gray box, centered

// function getVectorMouse(mouse) {
//   //console.log(mouse);
//   //let vx = mouse._x-mouse.x;//canvas.width/2;
//   //let vy = mouse._y-mouse.y;//canvas.height/2;
//   ///return {vx,vy};
//   return {x:mouse._x,y:mouse._y};
// }

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
*/
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
/*
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
*/
/* END CAMERA */




/* WORLD */
// world xyz
/*
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
  */
  /*
  if (getValueAtPoint(player.x,player.y) !== 0) {
    ctx.beginPath();
    ctx.fillStyle = COLORS.GREEN;
    ctx.fillRect(x1,y1,1,1);
  }
  */
/*
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
/*
const entities = new Map();

function getValueAtPoint(x,y) {
  if (!entities.has(x) || !entities.get(x).has(y)) return undefined;
  return entities.get(x).get(y);
}

function setValueAtPoint(x,y,v) {
  if (!entities.has(x)) entities.set(x,new Map());
  entities.get(x).set(y,v);
}

// grass entities are simple green dots
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

  // draw a set of grass entities
  //drawGrass();
  // draw a set of clover entities
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

  // TODO: create 100 grass entities with regular x,y
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

  // TODO: create 100 grass entities with regular x,y
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
*/
  // TODO: create 50 grass entities with random x & y
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
/*
  ctx.fillStyle = grass.c;
  ctx.fill();
}
*/
// TODO: create a map of <type:properties> (<grass:{color,maxRadius, etc})
/* --- */


/* NOTES */

/*
  // draw crosses within the visible canvas, 20px wide/tall
  let crossHori = canvas.width/unit;
  let crossVert = canvas.height/unit;
  let offsetHori = (crossHori % 2 === 0) ? 0 : unit/2;
  let offsetVert = (crossVert % 2 === 0) ? 0 : unit/2;
  let extraCol = offsetHori>0?1:0;
  let extraRow = offsetVert>0?1:0;
*/
  /* 
  fn (camera) {
    camera = {x:0, y:0}
    numCols = 7
    numRows = 10
    // offset nonsense
    // extra cols and rows nonsense
    (0,50) = (-300,-400)
    + + + + + + +
    + + + + + + +
    + + + + + + +
    + + + + + + +
    + + + o + + +
    + + + + + + +
    + + + + + + +
    + + + + + + +
    + + + + + + +
    ... offset row due to even number of rows

    when camera = {x:-50, y:0}
    (-100,50) = (-400,-400)
    when camera = {x:-150, y:0}
    (-200,50) = (-500,-400)
  }
  */
