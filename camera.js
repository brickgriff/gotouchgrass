var draw = (function () {
  // draw background
  var background = function (state, ctx) {
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  };

  // draw ball
  var ball = function (state, ctx) {
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  };

  var player = function (state, ctx) {
    ctx.beginPath();
    ctx.arc(state.player.x,state.player.y,state.player.r,0,2*Math.PI);
    ctx.fillStyle = COLORS.LIGHTGRAY;
    ctx.fill();

  }

  // public api is a function
  var api = function (state, ctx) {
    console.log(`draw`);
    background(state, ctx);
    ball(state, ctx);
    player(state, ctx);
  };

  // return the public API
  return api;
}
());





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