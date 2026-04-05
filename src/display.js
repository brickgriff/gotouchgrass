// display.js

import { Viewport } from './viewport.js';
import { colors } from './colors.js';

export const Display = {

  draw(state) {

    const ctx = state.ctx;
    // const vp = state.viewport;

    // clear screen
    ctx.save(); // why save ???
    ctx.resetTransform();
    ctx.clearRect(0,0,state.canvas.width,state.canvas.height);
    ctx.restore(); // why restore ???

    this.drawBackground(state);
    this.drawPlayer(state,0,0,.25); // radius = .25m 
  },

  drawPlayer(state, x, y, r) {
    const ctx = state.ctx;
    const vp = state.viewport;
    const cam = state.camera;

    const [sx, sy] = Viewport.worldToScreen(state, x, y);
    const scale = vp.pixels * cam.zoom;

    ctx.beginPath();
    ctx.fillStyle = colors.player;
    ctx.arc(sx, sy, r * scale, 0, Math.PI * 2);
    ctx.fill();
  },

  drawBackground(state) {

    const ctx = state.ctx;
    const vp = state.viewport;
    const cam = state.camera;

    const [sx, sy] = Viewport.worldToScreen(state, -vp.cx, -vp.cy);
    const scale = vp.pixels * cam.zoom;

    ctx.fillStyle = colors.background;
    ctx.fillRect(sx, sy, state.canvas.width * scale, state.canvas.height * scale);
  },
};