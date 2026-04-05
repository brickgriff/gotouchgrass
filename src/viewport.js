// viewport.js

export const Viewport = {
  resize(state) {

    console.log("resize");

    const canvas = state.canvas;
    const ctx = state.ctx;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // CSS size ???
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // pixel buffer ???
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // reset transform ???
    ctx.resetTransform();
    // no need to use identity matrix

    // DPI scale ???
    ctx.scale(dpr, dpr);
    // also probably not necessary right now


    // center origin
    const vp = state.viewport;
    vp.cx = width/2;
    vp.cy = height/2;
    ctx.translate(vp.cx, vp.cy);

    state.width = width;
    state.height = height;

    vp.unit = Math.min(width, height);
    vp.pixels = vp.unit / vp.meters;
  },

  worldToScreen(state, wx, wy) {

    const cam = state.camera;
    const vp = state.viewport;

    const scale = vp.pixels * cam.zoom;

    const sx = (wx - cam.x) * scale;
    const sy = (wy - cam.y) * scale;

    return [sx, sy];
  },

};