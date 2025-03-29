/*
  @Author: BrickGriff@GitHub.com
*/

function mainLoop(now,state) {
  // time tracking
  const elapsed = (now - state.time||0); // deltaTime in millis
  const dt = elapsed > 1000 ? 1000 : elapsed; // cap deltaTime @ 1000ms
  
  console.log(`gameLoop(now=${now}, frame=${state.frame}, deltaTime=${dt}, framesPerSecond=${Math.floor(1000/dt)})`);

  World.update(state, dt); // update entities
  Display.draw(state, state.ctx); // draw entities

  // FIXME: the above may be unnecessary since state.ctx is inside state...
  // maybe Display is allowed to use other canvas contexts to draw
  // ... like maybe an offscreen canvas context

  if (state.isQuit) return console.log("quit");

  requestAnimationFrame(now=>mainLoop(now,state)); // keep state private
}

function main() {  
  const canvas = document.createElement("canvas"); // default canvas
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // now we can draw

  document.body.appendChild(canvas); // add to body

  const state = World.create(canvas,ctx); // initialize!
  //const state = {canvas:canvas,ctx:ctx,time:0,frame:0}; // minimum requirement

  /*const inputsPara = document.createElement("p");
  inputsPara.id="inputs";
  inputsPara.inputs=inputs;
  */
  document.inputs=inputs;

  /*const statePara = document.createElement("p");
  statePara.id="state";
  statePara.state=state;
  */
  document.state=state;

  requestAnimationFrame(now=>mainLoop(now,state)); // keep state private
}

// x() -> xLoop(acc,cur)