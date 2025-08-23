const Display = (function(/*api*/) {
  var api = {};

  // public api is a function
  api.draw = function () {
    //console.log(`draw`);
  const state = document.state;
  const ctx = state.ctx;
  const cx = state.canvas.width / 2;
  const cy = state.canvas.height / 2;
  const mindim = Math.min(self.innerWidth, self.innerHeight);

  // draw background
  ctx.fillStyle = "dimgray";
  ctx.fillRect(-cx, -cy, state.canvas.width, state.canvas.height);

  // draw plant circles
  ctx.beginPath();
  ctx.strokeStyle = "lawngreen";
  ctx.fillStyle = "lawngreen";

  let x = 0;
  let y = 0;
  let r = 0;

  for (plant of state.plants) {

    x = (plant.x + state.dx) * mindim;
    y = (plant.y + state.dy) * mindim;
    r = plant.r * mindim;

    if (Math.hypot(x, y) > .1 * mindim) {
      continue;
    }

    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }

  x = (.1 + state.dx) * mindim;
  y = (-.1 + state.dy) * mindim;
  r = .01 * mindim;

  if (Math.hypot(x, y) < mindim / 2) {
    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }
  ctx.stroke();
  ctx.fill();


  for (plant of state.plants) {

    x = (plant.x + state.dx) * mindim;
    y = (plant.y + state.dy) * mindim;
    r = plant.r * mindim;
  
    if (Math.hypot(x, y) > .1 * mindim) {
      continue;
    }

    ctx.beginPath();
    ctx.strokeStyle = plant.c;
    ctx.fillStyle = plant.c;
    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  
  }


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

  };

  // return the public API
  return api;
}());

const COLORS = {
  BLACK:"black", GREEN:"green", GRAY:"gray", LIGHTGRAY: "lightgray",
  DARKGRAY:"darkgray", BLUE:"blue", GOLD:"gold", LIGHTBLUE:"lightblue", RED:"red",
  SPRINGGREEN: "springgreen", LAWNGREEN: "lawngreen", WHITE: "white", YELLOW: "yellow",
  CYAN: "cyan", MAGENTA: "magenta", DIMGRAY: "dimgray", DARKBLUE:"darkblue",
  DARKSLATEGRAY:"darkslategray",SOIL:"#7d644b",DEFAULT:"#cccccc"
};

const inputMap = [
  {x:100,y:100,r:10,k:keybinds.up},
  {x:75,y:125,r:10,k:keybinds.left},
  {x:100,y:125,r:10,k:keybinds.down},
  {x:125,y:125,r:10,k:keybinds.right},
  {x:75,y:100,r:10,k:keybinds.loosen},
  {x:125,y:100,r:10,k:keybinds.tighten},

  {x:175,y:100,r:10,k:keybinds.secondary},
  {x:150,y:100,r:10,k:keybinds.primary},
  {x:200,y:100,r:10,k:keybinds.tertiary},
  {x:150,y:125,r:10,k:keybinds.mouseL},
  {x:175,y:125,r:10,k:keybinds.mouseM},
  {x:200,y:125,r:10,k:keybinds.mouseR},

];

