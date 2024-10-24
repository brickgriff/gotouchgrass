function pushKey(keys, key) {
  if (!keys.includes(key)) keys.push(key);
}  

function dropKey(keys, key) {
  if (keys.includes(key)) keys.splice(keys.indexOf(key),1);
}  

window.addEventListener("keydown", (e) =>{
  pushKey(state.keys,e.code);
});

window.addEventListener("keyup", (e) =>{
  dropKey(state.keys,e.code);
});

window.addEventListener("mousedown", (e) =>{
  pushKey(state.keys,e.button);
  if (e.button===keybinds.mouseL) {
    state.mouse.x_=state.mouse.x=e.offsetX;
    state.mouse.y_=state.mouse.y=e.offsetY;
    
    state.mouse._x=state.mouse.x_;
    state.mouse._y=state.mouse.y_;

    state.mouse.isClicked=false;
  }
});

window.addEventListener("mouseup", (e) =>{
  //if (!state.mouse.isDragged && keys.includes(keybinds.mouseL)) state.mouse.isTapped =true;
  dropKey(state.keys,e.button);
  state.mouse.isClicked=!state.mouse.isDragged;
  //console.log(state.mouse.isClicked);
  if (e.button===keybinds.mouseL) {
    state.mouse.x_=state.mouse.x=state.player.x;
    state.mouse.y_=state.mouse.y=state.player.y;
    //state.mouse._x=state.mouse.x_;
    //state.mouse._y=state.mouse.y_;
    state.mouse.isDragged = false;
  }
});

window.addEventListener("mousemove", (e) =>{
  if (state.keys.includes(keybinds.mouseL)) {
    state.mouse._x=e.offsetX;
    state.mouse._y=e.offsetY;

    let dist = Math.hypot(state.mouse._x-state.mouse.x_,state.mouse._y-state.mouse.y_);
    state.mouse.isDragged = (dist>=state.mouse.dragMin);
    //console.log(dist,state.mouse.isDragged);
  }
});

window.addEventListener("touchstart",(e)=>{
  e.preventDefault()
  for(let i=0; i<e.changedTouches.length; i++) {
    pushKey(state.keys,ongoingTouches.length);
    ongoingTouches.push(copyTouch(e.touches[i]));
  }

  if (ongoingTouches.length > keybinds.mouseL) return;

  state.mouse.x_=state.mouse.x=e.screenX;
  state.mouse.y_=state.mouse.y=e.screenY;
  state.mouse._x=state.mouse.x_;
  state.mouse._y=state.mouse.y_;
});

var handleTouchFinish = (e)=>{
  e.preventDefault()
  for(let i=0; i<e.changedTouches.length; i++) {
    let index = ongoingTouchIndexById(e.changedTouches.identifier);
    //let touch=ongoingTouches[index];
    if (index===keybinds.mouseL) {
      state.mouse.x_=state.mouse.x=state.player.x;
      state.mouse.y_=state.mouse.y=state.player.y;
      //state.mouse._x=state.mouse.x_; 
      //state.mouse._y=state.mouse.y_;
      state.mouse.isDragged = false;
    }

    dropKey(index,state.keys);
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

      let dist = Math.hypot(state.mouse._x-state.mouse.x_,state.mouse._y-state.mouse.y_);
      state.mouse.isDragged = (dist>=state.mouse.dragMin);
      //console.log(dist,state.mouse.isDragged);
    }

    dropKey(index,state.keys);
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
    tertiary: "ShiftLeft",
    secondary: "KeyF",
    primary: "Space",

    debug: "Backquote",

    mouseL: 0,
    mouseM: 1,
    mouseR: 2,

};

/* --- */
