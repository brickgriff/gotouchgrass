/*
  @Author: BrickGriff@GitHub.Com
*/

function mainLoop(now) {
  const state = document.state;

  // time tracking
  if (state.frame == undefined) state.frame = 0; // init frame
  const elapsed = (now - (state.time || now)); // deltaTime in millis
  const dt = elapsed > 1000 ? 1000 : elapsed; // cap deltaTime @ 1000ms

  // console.log(`gameLoop(now=${now}, frame=${state.frame++}, deltaTime=${dt}, framesPerSecond=${dt==0?"START":Math.floor(1000/dt)})`);

  /* most of this code should go in world.js and should only run on a resize event */
  // minimum-dimension
  const mindim = Math.min(self.innerWidth, self.innerHeight);
  state.canvas.width = self.innerWidth;
  state.canvas.height = self.innerHeight;
  const ctx = state.ctx;
  const cx = state.canvas.width / 2;
  const cy = state.canvas.height / 2;
  ctx.translate(cx, cy); // minimize translate calls 

  // init displacement vector
  if (state.dx == undefined || state.dy == undefined) { state.dx = 0; state.dy = 0; }
  const speed = 0.005; // some percent of mindim (0.5%)

  const vx = (state.inputs.buttons.includes(keybinds.right) - state.inputs.buttons.includes(keybinds.left));
  const vy = (state.inputs.buttons.includes(keybinds.down) - state.inputs.buttons.includes(keybinds.up));

  const displacement = Math.hypot(vx, vy);
  const angle = Math.atan2(vy, vx);

  state.dx -= speed * (displacement == 0 ? 0 : 1) * Math.cos(angle);
  state.dy -= speed * (displacement == 0 ? 0 : 1) * Math.sin(angle);

  if (state.plants == undefined) {
    const plants = [];
    var num = 1000;
    while (num--) {
      let x1 = (Math.random()-0.5);
      let y1 = (Math.random()-0.5);
      let r1 = Math.random()*0.025;
      plants.push({x:x1,y:y1,r:r1});  
    }
    state.plants = plants;
  }

  /* this code should go in display.js */
  // draw background
  ctx.fillStyle = "dimgray";
  ctx.fillRect(-cx, -cy, state.canvas.width, state.canvas.height);


  // draw plant circles
  ctx.beginPath();
  ctx.strokeStyle = "lawngreen";

  let x = 0;
  let y = 0;
  let r = 0;

  for (plant of state.plants) {

    x=(plant.x + state.dx) * mindim;
    y=(plant.y + state.dy) * mindim;
    r=plant.r * mindim;
    ctx.moveTo(x+r,y);
    ctx.arc(x,y,r,0,Math.PI*2);
  }
  x = (.1 + state.dx) * mindim;
  y = (-.1 + state.dy) * mindim;
  r = .01 * mindim;
  ctx.moveTo(x + r, y);
  ctx.arc(x, y, r, 0, Math.PI * 2);
  // x-=.5*mindim;
  // y+=.44*mindim;
  // r+=.01*mindim;
  // ctx.moveTo(x+r,y);
  // ctx.arc(x,y,r,0,Math.PI*2);
  // r-=.008 * mindim;
  // x-=6;
  // y-=54;
  // ctx.moveTo(x+r,y);
  // ctx.arc(x,y,r,0,Math.PI*2);
  ctx.stroke();

  // draw center dot
  const pr = .05 * mindim;
  ctx.beginPath();
  ctx.fillStyle = "lightgray";
  ctx.arc(0, 0, pr, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(0 + 0.5 * mindim, 0);
  ctx.arc(0, 0, 0.5 * mindim, 0, Math.PI * 2);
  ctx.stroke();

  // TODO: switch back
  // world can create entities
  // display can draw them
  // they both share player position and velocity
  //World.update(state, dt); // update entities
  //Display.draw(state, state.ctx); // draw entities

  if (state.isQuit) return console.log("quit");

  state.time = now;
  requestAnimationFrame(now => mainLoop(now));
}

/* ENTRY POINT */
/*
- state management, 
- ecosystem simulation, 
- debug menu, dev console,
- worker services, and 
- off-screen canvas for 
sprites and collision detection (you'll see)
*/

function main() {
  const canvas = document.createElement("canvas"); // default canvas
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // now we can draw

  document.body.appendChild(canvas); // add to body

  // TODO: switch back to the standard state initializer...
  //const state = World.create(canvas,ctx); // initialize!
  const state = { canvas: canvas, ctx: ctx }; // minimum requirement
  state.inputs = inputs; // from events.js
  document.state = state;

  requestAnimationFrame(now => mainLoop(now));
}