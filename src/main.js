// main.js

import { state } from './state.js';
import { input } from './input.js';
import { Viewport } from './viewport.js';
import { Display } from './display.js';
import { World } from './world.js';
import { Player } from './player.js';


function mainLoop(now) {

  // FIXME: use performance.now()
  // deltaTime in millis, clamped to 1000
  const dt = Math.min(now - (state.time || now),1000);

  // console.log(`gameLoop(now=${now}, frame=${state.frame}, deltaTime=${dt}, framesPerSecond=${dt==0?"START":Math.floor(1000/dt)})`);

  Player.play(state, input);
  World.update(state, dt); // update entities
  Display.draw(state); // draw entities

  if (state.isQuit) return console.log("quit");

  state.time = now;
  state.frame++;

  requestAnimationFrame(mainLoop);
}

export function main() {
  const canvas = document.createElement("canvas"); // default canvas
  const ctx = canvas.getContext("2d", { willReadFrequently: true }); // now we can draw

  document.body.appendChild(canvas); // add to body
  state.canvas = canvas;
  state.ctx = ctx;

  Viewport.resize(state);

  window.addEventListener("resize", () => {
    Viewport.resize(state);
  });

  // suppress system right click menu
  window.addEventListener("contextmenu", (e) => { e.preventDefault() });

  World.create(state); // initialize!

  requestAnimationFrame(mainLoop);
}

// main();
window.addEventListener("DOMContentLoaded",main);
