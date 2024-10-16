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
    state.mouse.isDragged = (dist>=state.player.dg);
    //console.log(dist,state.mouse.isDragged);
  }
});

window.addEventListener("touchstart",(e)=>{
  e.preventDefault()
  for(let i=0; i<e.changedTouches.length; i++) {
    pushKey({keys:state.keys, key:ongoingTouches.length});
    ongoingTouches.push(copyTouch(e.touches[i]));
  }

  if (ongoingTouches.length > keybinds.mouseL) return;

  state.mouse.x=e.screenX;
  state.mouse.y=e.screenY;

  state.mouse._x=state.mouse.x;
  state.mouse._y=state.mouse.y;
});

var handleTouchFinish = (e)=>{
  e.preventDefault()
  for(let i=0; i<e.changedTouches.length; i++) {
    let index = ongoingTouchIndexById(e.changedTouches.identifier);
    //let touch=ongoingTouches[index];
    if (index===keybinds.mouseL) {
      state.mouse.x=state.player.x;
      state.mouse.y=state.player.y;
      state.mouse._x=state.mouse.x; 
      state.mouse._y=state.mouse.y;
      state.mouse.isDragged = false;
    }

    dropKey({key:index,keys:state.keys});
    ongoingTouches.splice(index,1);
  }
};

window.addEventListener("touchend",handleTouchFinish);
window.addEventListener("touchcancel",handleTouchFinish);

window.addEventListener("touchmove",(e)=>{
  e.preventDefault()
  for(let i=0; i<e.changedTouches.length; i++) {
    let index = ongoingTouchIndexById(e.changedTouches.identifier);
    //let touch=ongoingTouches[index];
    if (index===keybinds.mouseL) {
      state.mouse._x=e.offsetX;
      state.mouse._y=e.offsetY;

      let dist = Math.hypot(state.mouse._x-state.mouse.x,state.mouse._y-state.mouse.y);
      state.mouse.isDragged = (dist>=state.player.dg);
      //console.log(dist,state.mouse.isDragged);
    }

    dropKey({key:index,keys:state.keys});
    ongoingTouches.splice(index,1);
  }

});

const ongoingTouches = [];

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id === idToFind) {
      return i;
    }
  }
  return -1; // not found
}

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
