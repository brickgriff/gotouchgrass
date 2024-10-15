/* ACTION */
function pushKey({keys, key}) {
  if (!keys.includes(key)) keys.push(key);
}  
function dropKey({keys, key}) {
  if (keys.includes(key)) keys.splice(keys.indexOf(key),1);
}

window.addEventListener("keydown", (e) =>{
  pushKey({keys:state.keys, key:e.code});
});

window.addEventListener("keyup", (e) =>{
  dropKey({keys:state.keys, key:e.code});
});

window.addEventListener("mousedown", (e) =>{
  pushKey({keys:state.keys, key:e.button});
  if (e.button===keybinds.mouseL) {
    state.mouse.x=e.offsetX;
    state.mouse.y=e.offsetY;

    state.mouse._x=state.mouse.x;
    state.mouse._y=state.mouse.y;
  }

});

window.addEventListener("mouseup", (e) =>{
  //if (!state.mouse.isDragged && keys.includes(keybinds.mouseL)) state.mouse.isTapped =true;
  dropKey({keys:state.keys, key:e.button});
  if (e.button===keybinds.mouseL) {
    state.mouse.x=state.player.x;
    state.mouse.y=state.player.y;
    state.mouse._x=state.mouse.x; 
    state.mouse._y=state.mouse.y;
    state.mouse.isDragged = false;
  }
});

window.addEventListener("mousemove", (e) =>{
  if (state.keys.includes(keybinds.mouseL)) {
    state.mouse._x=e.offsetX;
    state.mouse._y=e.offsetY;

    let dist = Math.hypot(state.mouse._x-state.mouse.x,state.mouse._y-state.mouse.y);
    state.mouse.isDragged = (dist>=state.player.__r);
    //console.log(dist,state.mouse.isDragged);
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

    debug: "Backquote",

    mouseL: 0,
    mouseM: 1,
    mouseR: 2,

};

/* --- */
