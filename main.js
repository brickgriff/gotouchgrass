// RUN GAME LOOP //
function mainLoop(now,state) {
  const elapsed = (now - state.start) / 1000; // deltaTime in seconds
  const dt = elapsed > 1 ? 1 : elapsed; // cap deltaTime @ 1s
  
  //console.log(`gameLoop(frame=${state.frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);

  World.update(state, dt); // update entities
  Display.draw(state, state.ctx); // draw entities

  if (state.isQuit) return console.log("quit");
  requestAnimationFrame(now=>mainLoop(now,state));
}

// MAIN FUNCTION //
function main() {  
  const canvas = document.createElement("canvas"); // default canvas
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // now we can draw

  document.body.appendChild(canvas); // add it to body

  const state = World.create(canvas,ctx); // initialize!

  requestAnimationFrame(now=>mainLoop(now,state));
}