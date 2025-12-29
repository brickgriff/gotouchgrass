/*
  @Author: BrickGriff@GitHub.Com
*/

function mainLoop(now) {
  const state = document.state;

  // time tracking
  if (state.frame == undefined) state.frame = 0; // init frame
  const elapsed = (now - (state.time || now)); // deltaTime in millis
  const dt = elapsed > 1000 ? 1000 : elapsed; // cap deltaTime @ 1000ms

  // console.log(`gameLoop(now=${now}, frame=${state.frame}, deltaTime=${dt}, framesPerSecond=${dt==0?"START":Math.floor(1000/dt)})`);

  World.update(dt); // update entities
  Display.draw(); // draw entities

  if (state.isQuit) return console.log("quit");

  // update time for tracking
  state.time = now;
  state.frame++;
  requestAnimationFrame(now => mainLoop(now));
}

function main() {
  const canvas = document.createElement("canvas"); // default canvas
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // now we can draw

  document.body.appendChild(canvas); // add to body

  // const state = { canvas: canvas, ctx: ctx }; // minimum requirement
  World.create(canvas, ctx); // initialize!

  requestAnimationFrame(now => mainLoop(now));
}
