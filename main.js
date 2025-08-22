/*
  @Author: BrickGriff@GitHub.Com
*/

function mainLoop(now) {
  const state = document.state;

  // time tracking
  const elapsed = (now - state.time||0); // deltaTime in millis
  const dt = elapsed > 1000 ? 1000 : elapsed; // cap deltaTime @ 1000ms
  
  //console.log(`gameLoop(now=${now}, frame=${state.frame}, deltaTime=${dt}, framesPerSecond=${Math.floor(1000/dt)})`);

   // minimum-dimension
  //const mindim = Math.min(self.innerWidth,self.innerHeight);

  state.canvas.width = self.innerWidth;//mindim;
  state.canvas.height = self.innerHeight;//mindim;

  const ctx = state.ctx;
  const cx = state.canvas.width/2;
  const cy = state.canvas.height/2;

  ctx.fillStyle = "#555"; // gray 0.31
  ctx.fillRect(0,0,state.canvas.width,state.canvas.height);
  
  //ctx.fillStyle = "#000"; // black
  //ctx.fillRect(10,10,10,10);

  ctx.beginPath();
  ctx.fillStyle = "#EEE"; // gray 0.94
  ctx.strokeStyle = "#AAA"; // gray 0.06
  ctx.arc(cx,cy,15,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // draw three circles
  ctx.beginPath();
  ctx.strokeStyle = "green";
  let x = cx+19;
  let y = cy-23;
  let r = 4;
  ctx.moveTo(x+r,y);
  ctx.arc(x,y,r,0,Math.PI*2);
  x-=41;
  y+=49;
  r+=2;
  ctx.moveTo(x+r,y);
  ctx.arc(x,y,r,0,Math.PI*2);
  r-=3;
  x-=6;
  y+=4;
  ctx.moveTo(x+r,y);
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.stroke();

  //World.update(state, dt); // update entities
  //Display.draw(state, state.ctx); // draw entities

  // FIXME: the above may be unnecessary since state.ctx is inside state...
  // maybe Display is allowed to use other canvas contexts to draw
  // ... like maybe an offscreen canvas context

  if (state.isQuit) return console.log("quit");

  requestAnimationFrame(now=>mainLoop(now,state)); // keep state private
}

/* ENTRY POINT */
/*
here's what I remember:
I had a world manager system that worked with a frame drawing service
the two of them would share updates via the event manager
the README will help but it's gonna be vague
- player interaction: events! events! events!
- some more key points: state management, 
ecosystem simulation, debug menu, dev console,
worker services, and off-screen canvas for 
sprites and collision detection (you'll see)
*/

/* RANDOM NOTES */
/*
try to keep style config in the css
*/
function main() {
  const canvas = document.createElement("canvas"); // default canvas
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // now we can draw

  document.body.appendChild(canvas); // add to body

  // before we switch back to the standard state initializer
  //const state = World.create(canvas,ctx); // initialize!
  const state = {canvas:canvas,ctx:ctx,time:0,frame:0}; // minimum requirement
  document.state = state;
  document.inputs = inputs;

  /*const inputsPara = document.createElement("p");
  inputsPara.id="inputs";
  inputsPara.inputs=inputs;
  */
  //document.inputs=inputs;

  /*const statePara = document.createElement("p");
  statePara.id="state";
  statePara.state=state;
  */

  // do we need to pass state around or can we add it to the document?
  requestAnimationFrame(now=>mainLoop(now)); // keep state private
}