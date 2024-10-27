/*
  @Author: BrickGriff@GitHub.com
*/

// RUN GAME LOOP //
function mainLoop(now,state) {
  const elapsed = (now - state.start) / 1000; // deltaTime in seconds
  const dt = elapsed > 1 ? 1 : elapsed; // cap deltaTime @ 1s
  
  //console.log(`gameLoop(frame=${state.frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);

  World.update(state, dt); // update entities
  Display.draw(state, state.ctx); // draw entities
  // FIXME: the above may be unnecessary since state.ctx is inside state...
  // maybe Display is allowed to use other canvas contexts to draw
  // ... like maybe an offscreen canvas context

  if (state.isQuit) return console.log("quit");

  requestAnimationFrame(now=>mainLoop(now,state)); // keep state private
}

// MAIN FUNCTION //
function main() {  
  const canvas = document.createElement("canvas"); // default canvas
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // now we can draw
  const state = World.create(canvas,ctx); // initialize!

  document.body.appendChild(canvas); // add it to body

  requestAnimationFrame(now=>mainLoop(now,state)); // keep state private
}