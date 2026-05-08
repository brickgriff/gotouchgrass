// display.js

import { Viewport } from './viewport.js';
import { Colors } from './colors.js';

export const Display = {

  draw(state) {
    clear(state);
    drawBackground(state);
    // drawDebug(state);
    // drawTerrain(state); // draw soil layer under foliage
    drawPlants(state);
    drawRings(state);
    drawPlayer(state);
  },


};

function clear(state) {
  const ctx = state.ctx;
  //ctx.save();
  //ctx.resetTransform();
  ctx.clearRect(0,0,state.canvas.width,state.canvas.height);
  //ctx.restore();
};

function drawBackground(state) {
  const ctx = state.ctx;

  ctx.fillStyle = Colors.background;
  ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
 
 };

function drawDebug(state) {
  
  const ctx = state.ctx;
  const vp = state.viewport;
  const cam = state.camera;
  const p = state.player;

  const [sx, sy] = Viewport.worldToScreen(state, p.x, p.y);
  const scale = vp.pixels * cam.zoom;

  // draw four circles around the player dot
  ctx.beginPath();
  ctx.fillStyle = Colors.crop;
  ctx.arc(sx,2*scale+sy,scale,0,2*Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = Colors.weed;
  ctx.arc(sx,-2*scale+sy,scale,0,2*Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = Colors.grass;
  ctx.arc(2*scale+sx,sy,scale,0,2*Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = Colors.player;
  ctx.arc(-2*scale+sx,sy,scale,0,2*Math.PI);
  ctx.fill();

  // ctx.beginPath();
  // ctx.strokeStyle = Colors.grass;
  // ctx.lineWidth = .05 * scale;

  // for (let plant of state.plants) {
  //   if (!plant.isStopped) continue;
  //   const [sx, sy] = Viewport.worldToScreen(state, plant.x, plant.y);
  //   ctx.moveTo(sx + (plant.r + .03) * scale, sy);
  //   ctx.arc(sx, sy, (plant.r + .03) * scale, 0, Math.PI * 2);

  // }
  // ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = Colors.player;
  ctx.lineWidth = .1 * scale;

  for (let plant of state.plants) {
    if (!plant.isPlayerNearby) continue;
    const [sx, sy] = Viewport.worldToScreen(state, plant.x, plant.y);
    ctx.moveTo(sx + (plant.r + .08) * scale, sy);
    ctx.arc(sx, sy, (plant.r + .08) * scale, 0, Math.PI * 2);

  }

  ctx.stroke();

      ctx.beginPath();
  ctx.strokeStyle = Colors.weed;
  ctx.lineWidth = .05 * scale;

  for (let plant of state.plants) {
    if (!plant.isPlayerNearbyWalking) continue;
    const [sx, sy] = Viewport.worldToScreen(state, plant.x, plant.y);
    ctx.moveTo(sx + (plant.r + .03) * scale, sy);
    ctx.arc(sx, sy, (plant.r + .03) * scale, 0, Math.PI * 2);

  }

  ctx.stroke();

  //   ctx.beginPath();
  // ctx.strokeStyle = Colors.crop;
  // ctx.lineWidth = .01 * scale;

  // for (let plant of state.plants) {
  //   if (plant.isStopped) continue;
  //   const [sx, sy] = Viewport.worldToScreen(state, plant.x, plant.y);
  //   ctx.moveTo(sx + (plant.r + .02) * scale, sy);
  //   ctx.arc(sx, sy, (plant.r + .02) * scale, 0, Math.PI * 2);

  // }

  // ctx.stroke();

};

function drawPlants(state) {

  const ctx = state.ctx;
  const scale = state.viewport.pixels * state.camera.zoom;

  ctx.beginPath();
  ctx.fillStyle = Colors.grass;

  for (let plant of state.plants) {
    const [sx, sy] = Viewport.worldToScreen(state, plant.x, plant.y);
    ctx.moveTo(sx+plant.r, sy);
    ctx.arc(sx, sy, plant.r * scale, 0, Math.PI * 2);

  }

  ctx.fill();

};

function drawRings(state) {
  const ctx = state.ctx;
  const scale = state.viewport.pixels * state.camera.zoom;

  ctx.beginPath();
  ctx.strokeStyle = Colors.crop;
  ctx.lineWidth = .05*scale;

  for (let plant of state.plants) {
    const [sx, sy] = Viewport.worldToScreen(state, plant.x, plant.y);
    if (!plant.isPlayerNearby) {
      ctx.moveTo(sx+ctx.lineWidth*2.5, sy);
      ctx.arc(sx, sy, ctx.lineWidth*2.5, 0, Math.PI * 2);
    }else {
      ctx.moveTo(sx+plant.r * scale-ctx.lineWidth*2.5, sy);
      ctx.arc(sx, sy, plant.r * scale-ctx.lineWidth*2.5, 0, Math.PI * 2);
    }
  }

  // ctx.stroke();

  // ctx.beginPath();
  // ctx.fillStyle = Colors.grass;

  // for (let plant of state.plants) {
  //   const [sx, sy] = Viewport.worldToScreen(state, plant.x, plant.y);
  //   ctx.moveTo(sx+plant.r * scale-ctx.lineWidth*3, sy);
  //   ctx.arc(sx, sy, plant.r * scale-ctx.lineWidth*3, 0, Math.PI * 2);
  // }
  // ctx.fill();

  // ctx.beginPath();

  ctx.stroke();

};

function drawPlayer(state) {
  const ctx = state.ctx;
  const vp = state.viewport;
  const cam = state.camera;
  const p = state.player;

  const [sx, sy] = Viewport.worldToScreen(state, p.x, p.y);
  const scale = vp.pixels * cam.zoom;

  ctx.fillStyle = Colors.player;
  ctx.strokeStyle = Colors.player;

  ctx.beginPath();
  ctx.arc(sx, sy, p.r * scale, 0, Math.PI * 2);
  ctx.fill();

  if (false && p.isForcedPerspective) {
    ctx.beginPath();
    ctx.lineWidth = 2 * p.r * scale;
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy - p.r * scale / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(sx, sy - p.r * scale / 2, p.r * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.lineWidth = .05*scale;
  ctx.arc(sx, sy, p.v * scale, 0, Math.PI * 2);
  ctx.stroke();


  if (false && p.isPulsing) {
    ctx.beginPath();
    ctx.strokeStyle = Colors.player;
    ctx.lineWidth = .01 * scale;
    ctx.moveTo(sx + p.r * scale + .03 * scale, sy);
    ctx.arc(sx, sy, p.r * scale + .03 * scale, 0, 2*Math.PI);
    ctx.moveTo(sx + p.v * scale - .05 * scale, sy);
    ctx.arc(sx, sy, p.v * scale - .05 * scale, 0, 2*Math.PI);
    ctx.stroke();
  }

};

