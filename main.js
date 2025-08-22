/*
  @Author: BrickGriff@GitHub.Com
*/

function mainLoop(now) {
  const state = document.state;
  
  // time tracking
  const elapsed = (now - (state.time||now)); // deltaTime in millis
  const dt = elapsed > 1000 ? 1000 : elapsed; // cap deltaTime @ 1000ms
  
  //console.log(`gameLoop(now=${now}, frame=${state.frame++}, deltaTime=${dt}, framesPerSecond=${dt==0?"START":Math.floor(1000/dt)})`);

  if (state.inputs.buttons.includes(keybinds.up)) {
    state.dy+=5;
  }
  if (state.inputs.buttons.includes(keybinds.down)) {
    state.dy-=5;
  }
  if (state.inputs.buttons.includes(keybinds.left)) {
    state.dx+=5;
  }
  if (state.inputs.buttons.includes(keybinds.right)) {
    state.dx-=5;
  }

   // minimum-dimension
  //const mindim = Math.min(self.innerWidth,self.innerHeight);
  state.canvas.width = self.innerWidth;//mindim;
  state.canvas.height = self.innerHeight;//mindim;

  const ctx = state.ctx;
  const cx = state.canvas.width/2;
  const cy = state.canvas.height/2;

  ctx.translate(cx,cy);
  
  // draw background
  ctx.fillStyle = "dimgray";
  ctx.fillRect(-cx,-cy,state.canvas.width,state.canvas.height);

  // draw center dot
  ctx.beginPath();
  ctx.fillStyle = "lightgray";
  ctx.arc(0,0,15,0,Math.PI*2);
  ctx.fill();

  // draw three circles
  ctx.beginPath();
  ctx.strokeStyle = "lawngreen";
  let x = 19+state.dx;
  let y = -23+state.dy;
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
  y-=54;
  ctx.moveTo(x+r,y);
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.stroke();

  //World.update(state, dt); // update entities
  //Display.draw(state, state.ctx); // draw entities

  // FIXME: the above may be unnecessary since state.ctx is inside state...
  // maybe Display is allowed to use other canvas contexts to draw
  // ... like maybe an offscreen canvas context

  if (state.isQuit) return console.log("quit");
  state.time = now;
  requestAnimationFrame(now=>mainLoop(now)); // keep state private
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
  const state = {canvas:canvas,ctx:ctx,frame:0,dx:0,dy:0,inputs:inputs}; // minimum requirement
  document.state = state;

  /*const inputsPara = document.createElement("p");
  inputsPara.id="inputs";
  inputsPara.inputs=inputs;
  */
  /*const statePara = document.createElement("p");
  statePara.id="state";
  statePara.state=state;
  */

  // do we need to pass state around or can we add it to the document?
  requestAnimationFrame(now=>mainLoop(now)); // keep state private
}