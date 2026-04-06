// display.js

import { Viewport } from './viewport.js';
import { colors } from './colors.js';

export const Display = {

  draw(state) {

    const ctx = state.ctx;
    // const vp = state.viewport;

    // clear screen
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0,0,state.canvas.width,state.canvas.height);
    this.drawBackground(state);
    ctx.restore();

    this.drawPlayer(state);
  },

  drawPlayer(state) {
    const ctx = state.ctx;
    const vp = state.viewport;
    const cam = state.camera;
    const p = state.player;

    const [sx, sy] = Viewport.worldToScreen(state, p.x, p.y);
    const scale = vp.pixels * cam.zoom;

    ctx.beginPath();
    ctx.fillStyle = colors.player;
    ctx.arc(sx, sy, p.r * scale, 0, Math.PI * 2);
    ctx.fill();
  },

  drawBackground(state) {

    const ctx = state.ctx;

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
  },
};