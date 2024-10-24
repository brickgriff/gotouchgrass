// CREATE GLOBAL CANVAS AND CONTEXT //
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });


// CHECK BROWSER FEATURES //
// TODO: practice with offscreen canvas
//const ctxOffscreen = canvas.getContext("2d", { willReadFrequently: true });
// TODO: ensure the browser supports innerWidth or clientWidth
if (typeof window === "undefined") {
  console.log("no window");
  try {
    throw new Error("no window");
  } catch (e) {
    console.log(e.message);
  }
}


// HANDLE WINDOW EVENTS //
// suppress system right click menu
window.addEventListener("contextmenu", (e)=>{e.preventDefault()});
// trigger quit signal (Esc)
window.addEventListener("keydown", (e)=>{isQuit=(e.code==="Escape")});
// trigger resize handler
window.addEventListener("resize", resize);

var resize = () => {
  // fill the full document body (screen>window>document>body)
  canvas.width=document.body.clientWidth;
  canvas.height=document.body.clientHeight;
  // translate to center (0,0)
  ctx.translate(canvas.width/2,canvas.height/2);
}


// CONFIGURE CANVAS //
canvas.style="border:1px solid #cccccc";
resize(); // initial resize
document.body.appendChild(canvas);


// SET GLOBAL VARS AND GAME STATE //
let frame = 0, isQuit = false, start = document.timeline.currentTime;
const state = World.create(canvas);


// RUN GAME LOOP //
function gameLoop(now) {
  const elapsed = (now - start) / 1000; // deltaTime in seconds
  const dt = elapsed > 1 ? 1 : elapsed; // cap deltaTime @ 1s

  //console.log(`gameLoop(frame=${frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);  

  World.update(state, dt); // update entities
  Display.draw(state, ctx); // draw entities

  if (isQuit) return console.log("quit");
  requestAnimationFrame(gameLoop);
  // prepare for next frame
  frame++;
  start = now;
}


// MAIN FUNCTION //
function main() {
  //console.log("main");
  requestAnimationFrame(gameLoop);
}