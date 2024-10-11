// quit signal (Esc)
window.addEventListener("keydown", (e) =>{
  //e.preventDefault();
  if (e.code==="Escape") isQuit = true;
});  

let frame = 0, isQuit = false, start = document.timeline.currentTime;
let state = World.create(canvas);
// let createKeybinds = (function(){
  
// }());

function gameLoop(now) {
  
  const elapsed = (now - start) / 1000; // deltaTime in seconds
  const dt = elapsed > 1 ? 1 : elapsed; // capped deltaTime

  //console.log(`gameLoop(frame=${frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);

  //console.log(function(){
    World.update(state, dt);
    draw(state, ctx);

    if (isQuit) return console.log("quit");
    requestAnimationFrame(gameLoop);
    frame++;
    start = now;
    return "next";
  
  //}());

}

function main() {
  //console.log("main");

  // SCREEN - resolution and color space
  // WINDOW - dimensions and the browser DOM
  // CANVAS - size and position

  // LIGHTS - color palette
  // CAMERA - viewport and HUD
  // ACTION - listeners and timers

  // WORLD - terrain and weather
  // PLAYER - stats and tools
  // ENTITIES - plants, objects, and NPCs

  requestAnimationFrame(gameLoop);
}

/* NOTES */

/*
  // draw crosses within the visible canvas, 20px wide/tall
  let crossHori = canvas.width/unit;
  let crossVert = canvas.height/unit;
  let offsetHori = (crossHori % 2 === 0) ? 0 : unit/2;
  let offsetVert = (crossVert % 2 === 0) ? 0 : unit/2;
  let extraCol = offsetHori>0?1:0;
  let extraRow = offsetVert>0?1:0;
*/
  /* 
  fn (camera) {
    camera = {x:0, y:0}
    numCols = 7
    numRows = 10
    // offset nonsense
    // extra cols and rows nonsense
    (0,50) = (-300,-400)
    + + + + + + +
    + + + + + + +
    + + + + + + +
    + + + + + + +
    + + + o + + +
    + + + + + + +
    + + + + + + +
    + + + + + + +
    + + + + + + +
    ... offset row due to even number of rows

    when camera = {x:-50, y:0}
    (-100,50) = (-400,-400)
    when camera = {x:-150, y:0}
    (-200,50) = (-500,-400)
  }
  */
