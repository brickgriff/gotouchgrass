// main.js

import { state } from './state.js';
import { Viewport } from './viewport.js';
import { Display } from './display.js';
import { World } from './world.js';


function mainLoop(now) {

  // deltaTime in millis, clamped to 1000
  const dt = Math.min(now - (state.time || now),1000);

  // console.log(`gameLoop(now=${now}, frame=${state.frame}, deltaTime=${dt}, framesPerSecond=${dt==0?"START":Math.floor(1000/dt)})`);

  World.update(state, dt); // update entities
  Display.draw(state); // draw entities

  if (state.isQuit) return console.log("quit");

  state.time = now;
  state.frame++;

  requestAnimationFrame(mainLoop);
}

function main() {
  const canvas = document.createElement("canvas"); // default canvas
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // now we can draw

  document.body.appendChild(canvas); // add to body
  state.canvas = canvas;
  state.ctx = ctx;

  Viewport.resize(state);

  window.addEventListener("resize", () => {
    Viewport.resize(state);
  });

  World.create(state); // initialize!

  requestAnimationFrame(mainLoop);
}

main();