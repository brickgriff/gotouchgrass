// canvas is created/configured programmatically now
//<!--canvas-->
//<canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;"></canvas>

// ensure there is a global window object
if (typeof window === "undefined") {
  console.log("no window");
  try {
    throw new Error("no window");
  } catch (e) {
    console.log(e.message);
  }
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// TODO: practice with offscreen canvas
//const ctxOffscreen = canvas.getContext("2d", { willReadFrequently: true });
// TODO: make this configurable in main()
// canvas.width=800;
// canvas.height=800;

var resize = (canvas) => {
  canvas.width=document.body.clientWidth;
  canvas.height=document.body.clientHeight;
}

// TODO: pixelated style?  image-rendering: pixelated; image-rendering: crisp-edges;
// TODO: auto-resize and auto-rescale (resolution)

// suppress system right click menu
canvas.addEventListener("contextmenu", (e)=>{e.preventDefault()});
canvas.style="border:1px solid #cccccc;";

document.body.appendChild(canvas);

let frame = 0, isQuit = false, start = document.timeline.currentTime;
resize(canvas);
const state = World.create(canvas);
// TODO: give entities their own draw functions

// quit signal (Esc)
window.addEventListener("keydown", (e) =>{
  //e.preventDefault();
  if (e.code==="Escape") isQuit = true;
});  

// TODO: try a window/cavnas resize listener

function gameLoop(now) {
  const elapsed = (now - start) / 1000; // deltaTime in seconds
  const dt = elapsed > 1 ? 1 : elapsed; // capped deltaTime

  //console.log(`gameLoop(frame=${frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);
  //console.log(document.body.clientWidth,document.body.clientHeight,state.player.x,state.player.y);
  resize(state.canvas); // TODO: only on resize event!  
  
  //ctx.clearRect(0, 0, canvas.width, canvas.height);

  World.update(state, dt); // update entities
  Display.draw(state, ctx); // Display.draw(state, ctx); // draw entities
  if (isQuit) return console.log("quit");
  requestAnimationFrame(gameLoop);
  // prepare for next frame
  frame++;
  start = now;
}

function main() {
  //console.log("main");
  requestAnimationFrame(gameLoop);
}


