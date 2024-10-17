// canvas is created/configured programmatically now
//<!--canvas-->
//<canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;"></canvas>
let canvas,ctx,state;
let frame = 0, isQuit = false, start = document.timeline.currentTime;

// quit signal (Esc)
window.addEventListener("keydown", (e) =>{
  //e.preventDefault();
  if (e.code==="Escape") isQuit = true;
});  

function gameLoop(now,state) {
  const elapsed = (now - start) / 1000; // deltaTime in seconds
  const dt = elapsed > 1 ? 1 : elapsed; // capped deltaTime
/*const*/ ctx = state.canvas.getContext("2d", { willReadFrequently: true });

  //console.log(`gameLoop(frame=${frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);
  ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

  //World.update(state, dt); // update entities
  //Display.draw(state, ctx); // Display.draw(state, ctx); // draw entities
  if (isQuit) return console.log("quit");
  requestAnimationFrame(now=>gameLoop(now,state));
  // prepare for next frame
  frame++;
  start = now;
}

function main() {
  //console.log("main");
  // ensure there is a global window object
if (typeof window === "undefined") {
  console.log("no window");
  try {
    throw new Error("no window");
  } catch (e) {
    console.log(e.message);
  }
}

/*const*/ canvas = document.createElement("canvas");
/*const*/ state = World.create(canvas); // generate entities (with draw functions)

//const ctxOffscreen = canvas.getContext("2d", { willReadFrequently: true });

// TODO: make this configurable in main()
canvas.width=800;
canvas.height=800;

// TODO: pixelated style?  image-rendering: pixelated; image-rendering: crisp-edges;
// TODO: auto-resize and auto-rescale (resolution)

// suppress system right click menu
canvas.addEventListener("contextmenu", (e)=>{e.preventDefault()});
canvas.style="border:1px solid #cccccc;";

document.body.appendChild(canvas);


  requestAnimationFrame(now=>gameLoop(now,state));
}


