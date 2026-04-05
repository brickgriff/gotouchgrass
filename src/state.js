// state.js

export const state = {
  frame: 0,
  time: 0,
  isQuit: false,
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,

  viewport: {
    cx: 0,
    cy: 0,
    unit: 0, // unit distance in pixels
    pixels: 0, // pixels per single meter
    meters: 5, // initial unit distance in meters
  },

  camera: {
    x: 0,
    y: 0,
    zoom: 1,
    tilt: 0,
  }
};