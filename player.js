/* ACTION */

window.addEventListener("keyup", (e) =>{
  e.preventDefault();
  let oldCamera = {x:camera.x,y:camera.y};
  if (!e.repeat) {
    let speed=10;
    if (e.code==="ArrowUp") camera.y-=speed;
    if (e.code==="ArrowDown") camera.y+=speed;
    if (e.code==="ArrowLeft") camera.x-=speed;
    if (e.code==="ArrowRight") camera.x+=speed;

    if (e.code==="KeyL") isCameraBoundToPlayer = (isCameraBoundToPlayer^=true)!==0;
    //console.log("isCameraBoundToPlayer",isCameraBoundToPlayer);
  }
  if (camera.x != oldCamera.x || camera.y != oldCamera.y) {
    mainLoop();
  }
});

//let keys = [];
function pushKey(keys, key) {
  if (!keys.includes(key)) keys.push(key);
}  
function dropKey(keys, key) {
  if (keys.includes(key)) keys.splice(keys.indexOf(key),1);
}

function findAngle(keys) {
  let dx = keys.includes(keybinds.right) - keys.includes(keybinds.left); 
  let dy = keys.includes(keybinds.down) - keys.includes(keybinds.up);
  if (dx == 0 && dy == 0) return;
  let radians = Math.atan2(dy,dx);
  //console.log(radians*180/Math.PI);
  return radians
}

window.addEventListener("keydown", (e) =>{
  //e.preventDefault();
  //let player = state.player;
  let keys = state.keys;
  //let oldPlayer = {x:player.x,y:player.y};
  //let speed=2;

  //console.log(keys);

  // TODO: loop over keybinds (up, down, left, right)

  // TODO: toggle to ESDF or WASD controls
  pushKey(keys, e.code);
  /*
  if (e.code===keybinds.up) pushKey(e.code);
  if (e.code===keybinds.down) pushKey(e.code);
  if (e.code===keybinds.left) pushKey(e.code);
  if (e.code===keybinds.right) pushKey(e.code);
  */
/*
  let angle = findAngle(keys);
  if (angle !== undefined) {
    player.dx = 50*Math.cos(angle);
    player.dy = 50*Math.sin(angle);
  }
*/
  //state.player = player;
  state.keys = keys;  
});

window.addEventListener("keyup", (e) =>{
  //e.preventDefault();
  //let player = state.player;
  let keys = state.keys;
  //let oldPlayer = {x:player.x,y:player.y};
  //let speed=2;

  // TODO: loop over keybinds (up, down, left, right)

  // TODO: toggle to ESDF or WASD controls
  dropKey(keys, e.code);
  /*
  if (e.code===keybinds.up) dropKey(e.code);
  if (e.code===keybinds.down) dropKey(e.code);
  if (e.code===keybinds.left) dropKey(e.code);
  if (e.code===keybinds.right) dropKey(e.code);
  */

  //keys.length = 0;
  //player.dx = 0;
  //player.dy = 0;

  //state.player = player;
  state.keys = keys;

  // TODO: use keybinds map {key: code, value: callback}

  //if (e.code==="Backquote") isUsingWASD = (isUsingWASD^=true)!==0;
  //console.log("isUsingWASD",isUsingWASD);
  //console.log(player.keybinds.up);
  // TODO: reset keybinds on change
  
});

window.addEventListener("mousedown", (e) =>{
  e.preventDefault();

  // TODO: limit mouse interactions to the canvas

  let keys = state.keys;
  pushKey(keys, "M"+e.button);
  state.keys = keys;  
  if (keys.includes(keybinds.mouseL)) state.mouse = {
    x:e.offsetX,y:e.offsetY,
    _x:e.offsetX,_y:e.offsetY
  };
});

window.addEventListener("mouseup", (e) =>{
  e.preventDefault();
  let keys = state.keys;
  if (!state.mouse.isDragged && keys.includes(keybinds.mouseL)) state.mouse.isTapped =true;
  dropKey(keys, "M"+e.button);
  state.keys = keys;  
  if (!keys.includes(keybinds.mouseL)) {
    state.mouse.x =state.player.x;
    state.mouse.y =state.player.y;
    state.mouse._x =state.player.x; 
    state.mouse._y =state.player.y;
    state.mouse.isDragged =false;
  }
});

window.addEventListener("mousemove", (e) =>{
  if (state.keys.includes(keybinds.mouseL)) {
    state.mouse.isDragged = true;
    state.mouse.x = e.offsetX
    state.mouse.y = e.offsetY;

  }
});

/* --- */




/* PLAYER */
// control xyz
let isUsingWASD = true;
let  keybinds = {
    up: isUsingWASD ? "KeyW" : "KeyE",
    down: isUsingWASD ? "KeyS" : "KeyD",
    left: isUsingWASD ? "KeyA" : "KeyS",
    right: isUsingWASD ? "KeyD" : "KeyF",

    loosen: isUsingWASD ? "KeyQ" : "KeyW",
    tighten: isUsingWASD ? "KeyE" : "KeyR",
    primary: "ShiftLeft",
    secondary: "KeyF",
    tertiary: "Space",

    mouseL: "M0",
    mouseM: "M1",
    mouseR: "M2",

};

function drawPlayer() {

}
/* --- */
