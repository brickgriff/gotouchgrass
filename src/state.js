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
    cell: 5,
  },

  camera: {
    x: 0,
    y: 0,
    zoom: 1,
    tilt: 0,
  },

  player: {
    x: 0,
    y: 0,
    r: .25, // radius
    v: .5, // vision
    vMin: .5,
    vMax: 1,
    speed: .0005,
    cycle: 3000, // millis per breath (resting)
    current: 0,
  },

  plants: [],
  fields: [], // disturbance, resource, etc.
  vector: {x:0,y:0},
  
};