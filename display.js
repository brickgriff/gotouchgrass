const Display = (function (/*api*/) {
  var api = {};

  // public api is a function
  api.draw = function () {
    //console.log(`draw`);
    const state = document.state;
    const ctx = state.ctx;
    const mindim = state.mindim;

    // FIXME: these functions do not need the entire state
    // for most, ctx, mindim, and various screen params should work
    clear(state);
    drawBackground(state);

    drawTest(state);

    // drawRoom(state);
    // drawPark(state);

    if (!state.terrain) {
      // console.log("once");
      saveTerrain(state);
      state.terrain = true;
    }

    // drawTerrain(state);
    // TODO when drawing glass, clip out the center circle
    // then apply blur and draw the terrain again
    // then draw the glass layer without blur
    // final restore context settings
    // ctx.save();
    // ctx.filter = "blur(4px)";
    // drawBorder(state);
    // ctx.restore();
    // drawNearby(state);
    // drawActive(state);

    drawPlayer(state);
    // drawRing(state);

    // Experience.draw();
    // Stamina.draw();
    // drawGamepad(state);

    drawNav(state);

    // drawMinimap(state);
  };

  // return the public API
  return api;

  function drawTerrain(state) {
    const x = -state.offscreen.width / 2 + state.dx * state.mindim;
    const y = -state.offscreen.height / 2 + state.dy * state.mindim;
    state.ctx.drawImage(state.offscreen, x, y);
  }

  function drawMinimap(state) {
    const ctx = state.ctx;
    const k = state.mindim * .5;
    const miniX = -k / 2;
    const miniY = -state.cy + k / 4;
    // ctx.beginPath();
    // ctx.lineWidth = .01 * state.mindim;
    // ctx.fillStyle = colors.tertiary;
    // ctx.strokeStyle = colors.secondary;
    // drawArc(ctx, miniX + k / 2, miniY + k / 2, .2 * state.mindim);
    // ctx.fill();
    // ctx.stroke();
    const miniW = k;
    const miniH = k;
    ctx.drawImage(state.offscreen, miniX, miniY, miniW, miniH);

    const mindim = state.mindim;
    ctx.beginPath();
    ctx.fillStyle = colors.emergent;
    drawArc(ctx, miniX + k / 2 + state.dx * mindim * -.2, miniY + k / 2 + state.dy * mindim * -.2, .01 * state.mindim);
    ctx.fill();
  }

  function saveTerrain(state) {
    // drawBorder(state);
    drawGround(state);
    drawFoliage(state);
    drawLitter(state);
    drawRocks(state);
    drawGate(state);
  }

}());

var drawTest = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  const roomX = (state.dx + state.ox) * mindim;
  const roomY = (state.dy + state.oy) * mindim;
  const roomR = mindim * .5; // 5m radius; TODO set on state
  const fineLine = .005 * mindim;
  const boldLine = .01 * mindim;
  const wideLine = .05 * mindim;
  ctx.lineCap = "round";








  // terrain layer
  // draw a large round base for soil
  // a large "pale" dot with a "dark" outline
  ctx.beginPath();
  ctx.fillStyle = colors.soilmain;
  drawArc(ctx, roomX, roomY, roomR);
  ctx.fill();





  //
  const plantTypes = ["grass", "clover"];
  const noxiousTypes = ["clover"];

  // foliage layer
  // all plants as "cool" dots
  // helps segregate plants w/o either:
  // - plant only array
  // - yet another type flag or class
  // - classifying by main color 
  ctx.lineWidth = fineLine;
  ctx.strokeStyle = colors.herbline;
  ctx.fillStyle = colors.herbmain;
  ctx.beginPath();
  for (plant of state.plants) {
    // TODO stop using state.plants list for Structures (locks and gates)
    if (!plantTypes.includes(plant.t)) continue;
    const plantX = roomX + plant.x * mindim;
    const plantY = roomY + plant.y * mindim;
    const plantR = plant.r * mindim;
    drawArc(ctx, plantX, plantY, plantR);
  }
  if (state.outline) ctx.stroke(); // outline
  ctx.fill();


  // TODO: save to offscreen canvas or image data then crop and load
  // show all unlocked locks
  // maybe should be a lil higher

  ctx.beginPath();
  ctx.strokeStyle = colors.lockmain;
  ctx.lineWidth = wideLine;
  for (plant of state.active) {

    if (plant.t == "gate" && plant.l.isUnlocked) {
      ctx.moveTo(roomX + plant.x * mindim, roomY + plant.y * mindim);
      ctx.lineTo(roomX + plant.l.x * mindim, roomY + plant.l.y * mindim);
    }
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = colors.lockline;
  ctx.strokeStyle = colors.lockmain;
  ctx.lineWidth = boldLine;

  for (plant of state.plants) {

    if (!plant.isUnlocked) continue;
    drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, wideLine);

  }

  ctx.stroke();
  ctx.fill();


















  // info layer
  // draw "pale" or "warm" lines
  // for nearby active node connections
  // shows outbound edges when touching
  ctx.strokeStyle = colors.viewline;
  if (state.activeLock && (state.activeLock.l.isBroken || state.activeLock.l.wasBroken)) ctx.strokeStyle = colors.nullline;
  ctx.lineWidth = fineLine;

  ctx.beginPath();
  // either active only or all with the sees-edges skill
  for (plant of state.skills.includes("sees-edges") ? state.plants : state.active) {

    const hypot = Math.hypot((state.dx + plant.x) * mindim, (state.dy + plant.y) * mindim);

    if (hypot > .025 * mindim) continue;
    // only closer than 50cm

    if (!plant.n) continue;
    for (neighbor of plant.n) {
      ctx.moveTo(roomX + neighbor.x * mindim, roomY + neighbor.y * mindim);
      ctx.lineTo(roomX + plant.x * mindim, roomY + plant.y * mindim);
    }
  }
  ctx.stroke();











  // draw small pale rings
  // for nearby neutral objects
  // warm rings if active lock is broken
  // rings expand if touching
  ctx.strokeStyle = colors.emergent;
  ctx.fillStyle = colors.primary;
  if (state.activeLock && (state.activeLock.l.isBroken || state.activeLock.l.wasBroken)) ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = fineLine;
  ctx.beginPath();

  var isTouching = false;
  // touching = new Set();
  touching = [];

  for (plant of state.plants) {
    if (!plantTypes.includes(plant.t)) continue;
    // FIXME keep a separate lock list

    const hypot = Math.hypot((state.dx + plant.x) * mindim, (state.dy + plant.y) * mindim);
    if (hypot > (plant.r + .025) * mindim) continue;
    // only closer than radius + 50cm

    if (hypot > .025 * mindim) {
      // only closer than 50cm
      drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, fineLine * 1.5);

    } else {
      isTouching = true;
      if (!touching.includes(plant)) touching.push(plant);
      // console.log("touching", plant.t, "@", plant.x, plant.y, state.score);

      drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, (plant.r * mindim - 1.5 * fineLine));
      if (noxiousTypes.includes(plant.t) || !state.activeLock || (state.activeLock.l.isBroken || state.activeLock.l.wasBroken) || !(state.activeLock.n.includes(plant) || state.activeLock.l.n.includes(plant))) continue;
      // add to active list, if not already update latest active node

      if (!state.active.includes(plant)) state.active.push(plant);
      plant.l = state.activeLock.l;
      state.activeLock = plant;
    }

    state.isTouching = isTouching;
    state.touching = touching;
    // console.log(touching.length);
  }
  ctx.fill();
  ctx.stroke();

















  // when lock status
  if (state.activeLock) {





    const active = state.activeLock;
    const alhypot = Math.hypot((state.dx + active.x) * mindim, (state.dy + active.y) * mindim);
    const allhypot = Math.hypot((state.dx + active.l.x) * mindim, (state.dy + active.l.y) * mindim);













    // draw pale lines from nearby grass
    ctx.beginPath();
    ctx.strokeStyle = colors.req;
    ctx.lineWidth = fineLine;

    for (neighbor of state.activeLock.n) {
      if (noxiousTypes.includes(neighbor.t)) continue;
      const hypot = Math.hypot((state.dx + neighbor.x) * mindim, (state.dy + neighbor.y) * mindim);
      if (hypot > (neighbor.r + .025) * mindim && alhypot > (.025) * mindim) continue;
      ctx.moveTo(roomX + neighbor.x * mindim, roomY + neighbor.y * mindim);
      ctx.lineTo(roomX + state.activeLock.x * mindim, roomY + state.activeLock.y * mindim);
    }

    for (neighbor of state.activeLock.l.n) {
      if (noxiousTypes.includes(neighbor.t)) continue;
      const hypot = Math.hypot((state.dx + neighbor.x) * mindim, (state.dy + neighbor.y) * mindim);
      if (hypot > (neighbor.r + .025) * mindim && allhypot > (.025) * mindim) continue;
      ctx.moveTo(roomX + neighbor.x * mindim, roomY + neighbor.y * mindim);
      ctx.lineTo(roomX + state.activeLock.l.x * mindim, roomY + state.activeLock.l.y * mindim);
    }

    ctx.stroke();


    // draw warm lines from nearby weeds
    ctx.beginPath();
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = fineLine;

    for (neighbor of state.activeLock.n) {
      if (!noxiousTypes.includes(neighbor.t)) continue;
      const hypot = Math.hypot((state.dx + neighbor.x) * mindim, (state.dy + neighbor.y) * mindim);
      if (hypot > (neighbor.r + .025) * mindim && alhypot > (.025) * mindim) continue;
      ctx.moveTo(roomX + neighbor.x * mindim, roomY + neighbor.y * mindim);
      ctx.lineTo(roomX + state.activeLock.x * mindim, roomY + state.activeLock.y * mindim);
    }


    for (neighbor of state.activeLock.l.n) {
      if (!noxiousTypes.includes(neighbor.t)) continue;
      const hypot = Math.hypot((state.dx + neighbor.x) * mindim, (state.dy + neighbor.y) * mindim);
      if (hypot > (neighbor.r + .025) * mindim && allhypot > (.025) * mindim) continue;
      ctx.moveTo(roomX + neighbor.x * mindim, roomY + neighbor.y * mindim);
      ctx.lineTo(roomX + state.activeLock.l.x * mindim, roomY + state.activeLock.l.y * mindim);
    }

    ctx.stroke();














    // draw pale/warm dots
    // for each neighbor of the latest active node
    ctx.beginPath();
    ctx.fillStyle = colors.primary;
    ctx.strokeStyle = colors.emergent;
    if (state.activeLock.l.isBroken || state.activeLock.l.wasBroken) ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = fineLine;

    for (neighbor of state.activeLock.n) {
      if (!plantTypes.includes(neighbor.t) || noxiousTypes.includes(neighbor.t)) continue;
      const hypot = Math.hypot((state.dx + neighbor.x) * mindim, (state.dy + neighbor.y) * mindim);
      if (hypot > (neighbor.r + .025) * mindim) {
        drawArc(ctx, roomX + neighbor.x * mindim, roomY + neighbor.y * mindim, 1.5 * fineLine);
      } else {
        drawArc(ctx, roomX + neighbor.x * mindim, roomY + neighbor.y * mindim, (neighbor.r * mindim - 1.5 * fineLine));
      }
    }

    // and the active lock
    for (neighbor of state.activeLock.l.n) {
      if (noxiousTypes.includes(neighbor.t)) continue;
      const hypot = Math.hypot((state.dx + neighbor.x) * mindim, (state.dy + neighbor.y) * mindim);
      if (hypot > (neighbor.r + .025) * mindim) {
        drawArc(ctx, roomX + neighbor.x * mindim, roomY + neighbor.y * mindim, 1.5 * fineLine);
      } else {
        drawArc(ctx, roomX + neighbor.x * mindim, roomY + neighbor.y * mindim, (neighbor.r * mindim - 1.5 * fineLine));
      }
    }

    ctx.fill();
    ctx.stroke();


    // warm dots for noxious neighbors
    ctx.beginPath();
    ctx.fillStyle = colors.primary;
    ctx.strokeStyle = colors.nullline;
    ctx.lineWidth = fineLine;

    for (neighbor of state.activeLock.n) {
      if (!noxiousTypes.includes(neighbor.t)) continue;
      const hypot = Math.hypot((state.dx + neighbor.x) * mindim, (state.dy + neighbor.y) * mindim);
      if (hypot > (neighbor.r + .025) * mindim) {
        drawArc(ctx, roomX + neighbor.x * mindim, roomY + neighbor.y * mindim, 1.5 * fineLine);
      } else {
        if (hypot < .025 * mindim) state.activeLock.l.isBroken = true;

        drawArc(ctx, roomX + neighbor.x * mindim, roomY + neighbor.y * mindim, (neighbor.r * mindim - 1.5 * fineLine));
      }
    }

    for (neighbor of state.activeLock.l.n) {
      if (!noxiousTypes.includes(neighbor.t)) continue;
      const hypot = Math.hypot((state.dx + neighbor.x) * mindim, (state.dy + neighbor.y) * mindim);
      if (hypot > (neighbor.r + .025) * mindim) {
        drawArc(ctx, roomX + neighbor.x * mindim, roomY + neighbor.y * mindim, 1.5 * fineLine);
      } else {
        if (hypot < .025 * mindim) state.activeLock.l.isBroken = true;

        drawArc(ctx, roomX + neighbor.x * mindim, roomY + neighbor.y * mindim, (neighbor.r * mindim - 1.5 * fineLine));
      }
    }




    ctx.fill();
    ctx.stroke();





    // draw dark / warm lines between active plants
    ctx.strokeStyle = colors.tertiary;
    if (state.activeLock && state.activeLock.l.isBroken) {
      ctx.strokeStyle = colors.secondary;
      ctx.setLineDash([boldLine, boldLine, fineLine, boldLine, wideLine, boldLine]);
    }
    ctx.lineWidth = fineLine;

    ctx.beginPath();
    for (plant of state.active) {
      if (!plant.n) continue;
      for (neighbor of plant.n) {
        // only other active neighbors (if locked)
        if (!state.active.includes(neighbor)) continue;
        ctx.moveTo(roomX + neighbor.x * mindim, roomY + neighbor.y * mindim);
        ctx.lineTo(roomX + plant.x * mindim, roomY + plant.y * mindim);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);







    // draw dark arcs at active grass
    ctx.beginPath();
    ctx.fillStyle = colors.herbmain;
    ctx.strokeStyle = colors.joinline;
    if (state.activeLock && state.activeLock.l.isBroken) {
      ctx.strokeStyle = colors.secondary;
      ctx.setLineDash([boldLine, boldLine, fineLine, boldLine, wideLine, boldLine]);
    }
    ctx.lineWidth = fineLine;
    for (plant of state.active) {
      const hypot = Math.hypot((state.dx + plant.x) * mindim, (state.dy + plant.y) * mindim);
      if (!plantTypes.includes(plant.t)) continue;

      if (hypot > (plant.r + .025) * mindim) {
        drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, 4.5 * fineLine);
      } else if (hypot > (.025) * mindim) {
        drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, (plant.r * mindim - 1.5 * fineLine))
      } else {
        // for (neighbor of state.activeLock.n) {
        //   if (neighbor == plant || !plantTypes.includes(neighbor.t)) continue;
        //   if (!(noxiousTypes.includes(neighbor.t) && neighbor.n.includes(plant))) continue;
        //   neighbor.t = "grass";
        //   break;
        // }
        if (state.activeLock != plant) state.activeLock = plant;
        drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, (plant.r * mindim - 1.5 * fineLine));
      }
    }
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);











    // draw dark double-rings on active lock

    ctx.strokeStyle = colors.joinline;
    if (state.activeLock && state.activeLock.l.isBroken) {
      ctx.strokeStyle = colors.nullline;
      ctx.setLineDash([boldLine, boldLine, fineLine, boldLine, wideLine, boldLine]);
    }

    ctx.beginPath();
    ctx.fillStyle = colors.emergent;
    ctx.lineWidth = fineLine;

    // active lock (home base)
    if (allhypot > .025 * mindim) {
      drawArc(ctx, roomX + active.l.x * mindim, roomY + active.l.y * mindim, fineLine * 3);
    } else {
      drawArc(ctx, roomX + active.l.x * mindim, roomY + active.l.y * mindim, fineLine * 4.5);
    }
    ctx.fill();
    ctx.stroke();


    // latest active node (leader node)
    if (!plantTypes.includes(active.t)) {
    } else {
      ctx.beginPath();
      ctx.fillStyle = colors.primary;
      ctx.lineWidth = fineLine;

      //if (alhypot > (active.r + .025) * mindim) {
      //drawArc(ctx, roomX + active.x * mindim, roomY + active.y * mindim, fineLine * 3);
      //} else if (alhypot > (active.r - .025) * mindim) {
      // drawArc(ctx, roomX + active.x * mindim, roomY + active.y * mindim, (active.r * mindim));
      //} else if (alhypot > (.025) * mindim) {
      if (alhypot > (.025) * mindim) {
        drawArc(ctx, roomX + active.x * mindim, roomY + active.y * mindim, fineLine * 3);
      } else {
        drawArc(ctx, roomX + active.x * mindim, roomY + active.y * mindim, (active.r * mindim - 3 * fineLine));
      }
      ctx.fill();
      ctx.stroke();
    }
    ctx.setLineDash([]);





  }










  // show "have" and "need" for all locks
  for (plant of state.plants) {
    if (plant.t != "lock") continue;
    ctx.lineCap = "butt";

    let radius = (plant.r) * mindim - wideLine;
    let circ = Math.PI * radius;
    let seg = circ / plant.v;

    // show "need" level
    ctx.beginPath();
    if (!plant.l.isSolved) ctx.setLineDash([seg, seg]);
    ctx.strokeStyle = colors.lockline;
    ctx.lineWidth = wideLine * (state.activeLock && state.activeLock.l == plant ? 1 : .5);
    drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, radius);
    ctx.stroke();
    ctx.setLineDash([]);

    // show haves
    ctx.beginPath();
    const percent = ((!state.goal || state.goal <= 0) ? 0 : (state.score / state.goal));
    ctx.setLineDash([seg - .25 * seg, seg + .25 * seg]);
    ctx.strokeStyle = colors.lockbeam;
    ctx.lineWidth = 3.5 * boldLine;
    drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, radius, { end: percent * 2 * Math.PI, offset: 2.125 * seg / radius });
    ctx.stroke();
    ctx.setLineDash([]);

    // show capacity
    if (!(state.activeLock && state.activeLock.l == plant)) continue;
    ctx.beginPath();
    ctx.setLineDash([seg - .25 * seg, seg + .25 * seg]);
    ctx.strokeStyle = colors.lockbeam;
    ctx.lineWidth = boldLine;
    drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, radius, { offset: .125 * seg / radius });
    ctx.stroke();
    ctx.setLineDash([]);

    // solved beam ring
    if (plant.l.isSolved) {
      ctx.beginPath();
      ctx.strokeStyle = colors.lockbeam;
      ctx.lineWidth = 3 * boldLine;
      drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, radius);
      ctx.stroke();


    }

    // show broken warning
    if (plant.l.isBroken) {
      ctx.beginPath();
      ctx.setLineDash([seg, seg]);
      ctx.strokeStyle = colors.nullline;
      ctx.lineWidth = boldLine;
      drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, radius);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.lineCap = "round";

  }








  // dark ring for lock
  ctx.beginPath();
  ctx.lineWidth = fineLine;
  ctx.strokeStyle = colors.lockline;
  ctx.fillStyle = colors.lockmain;
  if (state.activeLock && state.activeLock.l.isBroken) {
    ctx.strokeStyle = colors.nullline;
    ctx.setLineDash([boldLine, boldLine, fineLine, boldLine, wideLine, boldLine]);
  }

  for (plant of state.plants) {
    if (plant.t != "lock") continue;

    const hypot = Math.hypot((state.dx + plant.x) * mindim, (state.dy + plant.y) * mindim);
    if (hypot > (.025) * mindim) {

      drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, fineLine * 1.5);

      if (plant.wasBroken) plant.wasBroken = false;
      else if (plant.wasSolved) plant.wasSolved = false;
      else if (plant.wasUnlocked) plant.wasUnlocked = false;


    } else if (plant.l.isBroken) {

      plant.l.isBroken = false;
      plant.l.isSolved = false;
      state.activeLock = null;
      state.goal = 0;
      state.active = [];
      plant.l.wasBroken = true;

    } else if (plant.l.isSolved) {

      plant.l.isUnlocked = true;
      plant.l.isSolved = false;
      pattern = { active: [...state.active], l: plant.l };

      state.patterns.push(pattern);
      state.active.push(plant.g);

      if (!state.highscore) state.highscore = 0;
      console.log(state.patterns.length, state.score, state.goal, state.score / state.goal, state.highscore, state.highscore < state.score / state.goal ? "HIGH SCORE" : "TRY AGAIN");
      if (state.highscore < state.score / state.goal) state.highscore = state.score / state.goal;

      state.activeLock = null;
      state.goal = 0;
      plant.l.wasSolved = true; // solved?

    } else if (plant.l.isUnlocked && !plant.l.wasSolved) {

      plant.l.isUnlocked = false;
      plant.l.wasUnlocked = true;
      //state.active = [];


    } else if (!plant.wasBroken && !plant.wasSolved && !plant.wasUnlocked) {
      if (!state.activeLock || state.activeLock.l != plant) {
        plant.l = plant;
        state.activeLock = plant;
        state.goal = plant.v;
        state.active = [];
      }
      if (!state.active.includes(plant)) state.active.push(plant);
      // console.log("touching", plant.t, "@", plant.x, plant.y, state.score);

      drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, 1.5 * boldLine);
    }
  }
  ctx.fill();
  ctx.stroke();









  if (state.activeLock && !state.activeLock.l.isBroken && state.activeLock.l.isSolved) {
    ctx.fillStyle = colors.lockline; // not a mistake
    ctx.beginPath();
    drawArc(ctx, roomX + state.activeLock.l.x * mindim, roomY + state.activeLock.l.y * mindim, boldLine);
    ctx.fill();
  }












  if (state.activeLock && state.activeLock.l.isBroken) {

    ctx.beginPath();
    ctx.strokeStyle = colors.nullline;
    ctx.fillStyle = colors.herbmain;
    ctx.lineWidth = boldLine;
    for (plant of state.activeLock.n) {
      if (plant.t == "lock") continue;
      const hypot = Math.hypot(roomX + plant.x * mindim, roomY + plant.y * mindim);
      const isNearby = (hypot <= .05 * mindim);

      drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim,
        (isNearby ? (plant.r * mindim) :
          fineLine));

      if (!(isNearby && state.activeLock.n.includes(plant))) continue;
      plant.r = Math.max(5 * fineLine / mindim, .9995 * plant.r);
      // console.log("shrank by ", .0005 * plant.r);
    }
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = colors.nullline;
    ctx.fillStyle = colors.lockmain;
    ctx.lineWidth = boldLine;
    for (plant of state.activeLock.n) {
      if (plant.t != "lock") continue;
      drawArc(ctx, roomX + plant.x * mindim, roomY + plant.y * mindim, fineLine);
    }
    ctx.stroke();
    ctx.fill();
  }

}

var drawNav = (state) => {

  const ctx = state.ctx;
  const mindim = state.mindim;
  const mouse = getMouse();

  if (!state.events.isPressed && !state.events.isKeyboard) return;

  // if (!state.events.isDragged) {
  //   ctx.strokeStyle = colors.tertiary;
  //   // ctx.fillStyle = colors.emergent;  
  //   ctx.lineWidth = .001 * mindim; // ~ 5mm, i think

  //     ctx.beginPath();
  //   drawArc(ctx, 0, 0, mindim * .1);
  //   ctx.stroke();

  //   ctx.strokeStyle = colors.tertiary;
  //   // ctx.fillStyle = colors.emergent;  
  //   // ctx.lineWidth = .005 * mindim; // ~ 5mm, i think
  //   // ctx.setLineDash([.005 * mindim, .005 * mindim]);

  //   //   ctx.beginPath();
  //   // drawArc(ctx, 0, 0, mindim * .1);
  //   // ctx.stroke();
  //   // ctx.setLineDash([]);
  // }

  if (state.events.isKeyboard) {
    mouse.x_ = mouse._x; // state.inputs.keyboard.x_;
    mouse.y_ = mouse._y; // state.inputs.keyboard.y_;
  }

  if ((!state.events.isDragged && state.events.isPressed) || state.events.isKeyboard) {
    state.stamina = Math.max(0, state.stamina - .05);
    state.isClicked = false;
  }

  var r = .1 * mindim;
  const hypot = Math.min(r * .75, Math.hypot(mouse._x - mouse.x_, mouse._y - mouse.y_));
  const angle = Math.atan2(mouse._y - mouse.y_, mouse._x - mouse.x_);

  const x = hypot * Math.cos(angle);
  const y = hypot * Math.sin(angle);

  ctx.lineWidth = .08 * r;
  ctx.strokeStyle = colors.playline;
  ctx.beginPath();
  drawArc(ctx, mouse.x_, mouse.y_, r * 1);
  drawArc(ctx, x + mouse.x_, y + mouse.y_, .25 * r);
  ctx.stroke();

  ctx.lineWidth = .05 * r;
  ctx.strokeStyle = colors.playmain;
  ctx.beginPath();
  drawArc(ctx, mouse.x_, mouse.y_, r * 1);
  drawArc(ctx, x + mouse.x_, y + mouse.y_, .25 * r);
  ctx.stroke();

  // if (!state.events.isDragged) return;

  // ctx.fillStyle = colors.playmain;
  // ctx.beginPath();
  // drawArc(ctx, mouse.x_, mouse.y_, .25 * r/*, { start: .5*Math.PI, end: 1.5 * Math.PI, offset: angle }*/);
  // ctx.fill();

  // ctx.lineWidth = 0.28 * r;
  // ctx.strokeStyle = colors.playline;
  // ctx.beginPath();
  // ctx.moveTo(mouse.x_, mouse.y_);
  // ctx.lineTo(x + mouse.x_, y + mouse.y_);
  // ctx.stroke();

  // ctx.lineWidth = 0.25 * r;
  // ctx.strokeStyle = colors.playmain;
  // ctx.beginPath();
  // ctx.moveTo(x + mouse.x_, y + mouse.y_);
  // const newx = hypot * 1.01 * Math.cos(angle);
  // const newy = hypot * 1.01 * Math.sin(angle);
  // ctx.lineTo(x + mouse.x_ - newx, y + mouse.y_ - newy);
  // ctx.stroke();

  // ctx.lineWidth = .03 * r;
  // ctx.strokeStyle = colors.playline;
  // ctx.beginPath();
  // drawArc(ctx, x + mouse.x_, y + mouse.y_, .5 * r);
  // ctx.stroke()
  // ctx.fill();
  // ctx.restore();
}

var drawPark = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  const w = 5 * mindim;
  const h = 2 * mindim;
  const dx = state.dx * mindim;
  const dy = state.dy * mindim;
  const x = 0, y = 1.75 * mindim;

  ctx.beginPath();
  ctx.fillStyle = colors.primary;
  ctx.rect(-.5 * w - x + dx, -.5 * h - y + dy, w, h);
  ctx.fill();

  ctx.beginPath();
  ctx.lineWidth = .3 * mindim;
  ctx.strokeStyle = colors.tertiary;
  ctx.rect(-.5 * w - x + dx - (.5 * ctx.lineWidth), -.5 * h - y + dy - (.5 * ctx.lineWidth), w + ctx.lineWidth, h + ctx.lineWidth);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = colors.secondary;
  ctx.setLineDash([.28 * mindim, .01 * mindim]);
  ctx.rect(-.5 * w - x + dx - (.5 * ctx.lineWidth), -.5 * h - y + dy - (.5 * ctx.lineWidth), w + ctx.lineWidth, h + ctx.lineWidth);
  ctx.lineWidth = .28 * mindim;
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = .01 * mindim;
  ctx.strokeStyle = colors.emergent;
  ctx.setLineDash([.1 * mindim, .1 * mindim]);
  ctx.rect(-.3 * w - .6 * x + dx - (.5 * ctx.lineWidth), -.3 * h - .6 * y + dy - (.5 * ctx.lineWidth), .85 * w + ctx.lineWidth, .85 * h + ctx.lineWidth);
  ctx.stroke();

  ctx.setLineDash([]);

}
var drawGamepad = (state) => {
  const ctx = state.ctx;
  const ratio = state.canvas.height / state.canvas.width;
  const mindim = state.mindim;
  // FIXME: gamepad dimensions
  ctx.lineWidth = 25;
  const x = 0;
  const y = 0;
  const r = (.15) * mindim + ctx.lineWidth / 2;
  ctx.strokeStyle = colors.emergent;

  // let red = parseInt(ctx.strokeStyle.substring(1, 3), 16);
  // let green = parseInt(ctx.strokeStyle.substring(3, 5), 16);
  // let blue = parseInt(ctx.strokeStyle.substring(5, 7), 16);

  // ctx.strokeStyle = `rgba(${red},${green},${blue},0.25)`;
  // ctx.fillStyle = `rgba(${red},${green},${blue},0.25)`;

  ctx.beginPath();
  drawArc(ctx, x, y, .1 * mindim);
  ctx.fill();
  ctx.beginPath();
  drawArc(ctx, x, y, r);
  ctx.stroke();

  // FIXME: set this up when the world is created
  // save the eight points on gamepad for mouse/touch events
  // so that state knows where event listeners should be
  // GOTO world.js
  const coords = {};
  coords.center = { x: x, y: y };
  // 0 +/- 22.5 => right
  coords.cright = getNewVector(coords.center, r, (0));
  // 45 +/- 22.5 => upperright
  coords.uright = getNewVector(coords.center, r, -0.25 * Math.PI);
  // 90 +/- 22.5 => up
  coords.upper = getNewVector(coords.center, r, -0.5 * Math.PI);
  // ...
  coords.uleft = getNewVector(coords.center, r, -0.75 * Math.PI);
  coords.cleft = getNewVector(coords.center, r, 1 * Math.PI);
  coords.lleft = getNewVector(coords.center, r, .75 * Math.PI);
  // 315 +/- 22.5 => lowerright
  coords.lower = getNewVector(coords.center, r, 0.5 * Math.PI);
  coords.lright = getNewVector(coords.center, r, 0.25 * Math.PI);

  state.coords = coords;

  // draw 8 buttons

  // draw center button
  ctx.beginPath();

  // make them glow regardless which event is handled
  // keyboard
  ctx.beginPath();
  let rGamepad = .025 * mindim;
  if (findInput(keybinds.up) || isPressing(coords.upper, rGamepad)) {
    drawArc(ctx, coords.upper.x, coords.upper.y, rGamepad);
  }
  if (findInput(keybinds.down) || isPressing(coords.lower, rGamepad)) {
    drawArc(ctx, coords.lower.x, coords.lower.y, rGamepad);
  }
  if (findInput(keybinds.left) || isPressing(coords.cleft, rGamepad)) {
    drawArc(ctx, coords.cleft.x, coords.cleft.y, rGamepad);
  }
  if (findInput(keybinds.right) || isPressing(coords.cright, rGamepad)) {
    drawArc(ctx, coords.cright.x, coords.cright.y, rGamepad);
  }
  rGamepad *= 4;
  if (findInput(keybinds.primary) || isPressing(coords.center, rGamepad)) {
    drawArc(ctx, coords.center.x, coords.center.y, rGamepad);
  }
  ctx.fill();

  // mouse
  // touch
  // const highlight = state.gamepad.highlight
  // make this area glow

  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  drawGamepadInputs(state);

}

var drawGamepadInputs = (state) => {
  const ctx = state.ctx;
  const coords = state.coords;
  ctx.beginPath();
  ctx.fillStyle = "lightgray";
  ctx.strokeStyle = "dimgray";
  ctx.lineWidth = 1;
  ctx.font = "25px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  outlineText(ctx, "Space", coords.center.x, coords.center.y);
  outlineText(ctx, "E", coords.upper.x, coords.upper.y);
  outlineText(ctx, "S", coords.cleft.x, coords.cleft.y);
  outlineText(ctx, "D", coords.lower.x, coords.lower.y);
  outlineText(ctx, "F", coords.cright.x, coords.cright.y);
}

var outlineText = (ctx, text, x, y) => {
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);
}

var clear = (state) => {
  const ctx = state.ctx;
  ctx.clearRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);
}

var drawBackground = (state) => {
  const ctx = state.ctx;//;

  // draw background
  ctx.fillStyle = colors.tertiary;
  ctx.fillRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);

  // color dot test
  const mindim = state.mindim;
  state.dotTest = true;
  if (state.dotTest) {
    const r = 0.1 * mindim;
    const offsetX = (state.dx + state.ox) * mindim;
    const offsetY = (state.dy + state.oy) * mindim;

    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    drawArc(ctx, -r * 2.5 + offsetX, offsetY, r); // ~ 1
    ctx.fill();

    // draw violet

    ctx.fillStyle = colors.tertiary;
    ctx.beginPath();
    drawArc(ctx, r * 2.5 + offsetX, offsetY, r); // ~ 1
    ctx.fill();

    // draw dandelion
    // drawDandelion(state,x,y,r);

    ctx.fillStyle = colors.emergent;
    ctx.strokeStyle = colors.primary;
    ctx.setLineDash([.05 * r, .05 * r]);
    ctx.lineWidth = .3 * r;
    ctx.beginPath();
    drawArc(ctx, r * 2.5 + offsetX + .5 * r, offsetY, .15 * r);
    ctx.stroke();
    ctx.fill();

    // ctx.strokeStyle = colors.secondary;
    // ctx.setLineDash([.01 * r, .03 * r]);
    // ctx.lineWidth = .07 * r;
    // ctx.beginPath();
    // drawArc(ctx, r * 2.5 + offsetX + .5 * r, offsetY, .07 * r);
    // ctx.stroke();
    // ctx.fillStyle = colors.secondary;
    // ctx.beginPath();
    // drawArc(ctx, r * 2.5 + offsetX + .5 * r, offsetY, .03 * r);
    // ctx.fill();

    ctx.setLineDash([]);


    ctx.fillStyle = colors.secondary;
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = mindim * .01;
    ctx.beginPath();
    drawArc(ctx, offsetX, -r * 2.5 + offsetY, r); // ~ 1
    ctx.stroke();
    ctx.fill();

    // draw clover
    drawClover(state, offsetX, offsetY - 2.5 * r, .05 * r);
    drawClover(state, offsetX + .3 * r, offsetY - 2.5 * r - .2 * r, .03 * r, { offset: .6 });
    drawClover(state, offsetX + .1 * r, offsetY - 2.5 * r + .3 * r, .05 * r, { offset: .9 });
    drawClover(state, offsetX - .4 * r, offsetY - 2.5 * r - .2 * r, .07 * r, { offset: 1.2, stage: 2 });
    drawClover(state, offsetX - .3 * r, offsetY - 2.5 * r + .4 * r, .03 * r, { offset: 1.7 });
    drawClover(state, offsetX + .4 * r, offsetY - 2.5 * r - .5 * r, .05 * r, { offset: .9 });
    drawClover(state, offsetX - .3 * r, offsetY - 2.5 * r + .6 * r, .07 * r, { offset: 1.2, stage: 2 });
    drawClover(state, offsetX - .5 * r, offsetY - 2.5 * r - .4 * r, .03 * r, { offset: 1.7 });

    ctx.fillStyle = colors.emergent;
    ctx.strokeStyle = colors.tertiary;
    ctx.lineWidth = mindim * .01;
    ctx.beginPath();
    drawArc(ctx, offsetX, r * 2.5 + offsetY, r); // ~ 1
    ctx.stroke();
    ctx.fill();

    // draw grass
    drawGrass(state, offsetX, offsetY + 2.5 * r, .1 * r);
    drawGrass(state, offsetX + .2 * r, offsetY + 2.5 * r + .3 * r, .12 * r, { offset: .8 });
    drawGrass(state, offsetX - .3 * r, offsetY + 2.5 * r - .2 * r, .14 * r, { offset: 1.3 });
    drawGrass(state, offsetX + .2 * r, offsetY + 2.5 * r - .3 * r, .12 * r, { offset: .4 });
    drawGrass(state, offsetX - .4 * r, offsetY + 2.5 * r + .2 * r, .1 * r, { offset: 1.5 });

    // const hypot = Math.hypot(offsetX, r * 2.5 + offsetY);

    // if (hypot < .15 * mindim) {
    //   state.events.isRingEnabled = true;
    // } else {
    //   state.events.isRingEnabled = false;
    // }
  }
}
var drawDandelion = (state, x, y, r, options = {}) => {
  ctx.fillStyle = colors.secondary;
  ctx.strokeStyle = colors.primary;
  ctx.setLineDash([.05 * r, .05 * r]);
  ctx.lineWidth = .3 * r;
  ctx.beginPath();
  drawArc(ctx, r * 2.5 + offsetX - .5 * r, offsetY, .1 * r);
  ctx.stroke();
  ctx.fill();

  // ctx.strokeStyle = colors.emergent;
  // ctx.setLineDash([.03 * r, .01 * r]);
  // ctx.lineWidth = .04 * r;
  // ctx.beginPath();
  // drawArc(ctx, r * 2.5 + offsetX - .5 * r, offsetY, .08 * r);
  // ctx.stroke();
  // ctx.fillStyle = colors.emergent;
  // ctx.beginPath();
  // drawArc(ctx, r * 2.5 + offsetX - .5 * r, offsetY, .04 * r);
  // ctx.fill();

}

var drawClover = (state, x, y, r, options = { offset: 0, stage: false }) => {
  const ctx = state.ctx;
  ctx.fillStyle = colors.primary;
  const offset = options.offset ? options.offset : 0;
  const angle1 = Math.PI * (-(.5) + offset);
  const angle2 = Math.PI * ((5 / 6) + offset);
  const angle3 = Math.PI * ((1 / 6) + offset);

  ctx.beginPath();
  drawArc(ctx, x + Math.cos(angle1) * r, y + Math.sin(angle1) * r, r);
  drawArc(ctx, x + Math.cos(angle2) * r, y + Math.sin(angle2) * r, r);
  drawArc(ctx, x + Math.cos(angle3) * r, y + Math.sin(angle3) * r, r);
  ctx.fill();

  if (options.stage === 2) {
    ctx.beginPath();
    ctx.fillStyle = colors.emergent;
    ctx.strokeStyle = colors.tertiary;
    ctx.lineWidth = .1 * r;
    drawArc(ctx, x, y, 1 * r);
    ctx.fill();
    // ctx.stroke();
    // drawArc(ctx, x, y, .7 * r);
    // ctx.stroke();
    // drawArc(ctx, x, y, .3 * r);
    // ctx.stroke();
  }

}

var drawGrass = (state, x, y, r, options = { offset: 0 }) => {
  const ctx = state.ctx;
  ctx.strokeStyle = colors.primary;
  const offset = options.offset ? options.offset : 0;
  ctx.setLineDash([.2 * r, .2 * r]);
  ctx.lineWidth = r;
  ctx.beginPath();
  drawArc(ctx, x, y, r, { start: Math.PI * offset, end: Math.PI * (2 + offset) });
  ctx.stroke();
  ctx.setLineDash([]);

}


var drawBorder = (state) => {
  const ctx = state.ctx; //offscreen.getContext("2d");
  const mindim = state.mindim;

  const r = mindim;
  const x = state.dx * mindim;
  const y = state.dy * mindim;

  ctx.beginPath();
  ctx.strokeStyle = colors.secondary; // weed barrier
  ctx.lineWidth = .01 * mindim;
  const animLength = 25;
  const seriesGap = .5 * ctx.lineWidth;
  const limit = .02 * ctx.lineWidth * animLength + seriesGap * (animLength - 2);
  for (let i = 0; i < animLength; i++) {
    const rate = .01;
    const dr = (seriesGap * i + ctx.lineWidth * state.frame * rate) % limit;
    // if (r1 > limit) r1 - limit;
    drawArc(ctx, x, y, r + dr ** 2);
  }
  ctx.stroke();


}

var drawPlayer = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  const r = state.size * mindim;
  const height = state.size * mindim;
  ctx.setLineDash([]);
  ctx.fillStyle = colors.playmain;
  ctx.strokeStyle = colors.playline;
  ctx.lineWidth = .01 * mindim;
  // ctx.save();
  // ctx.scale(1,1.5);
  ctx.beginPath();
  // console.log(state.dx,state.dy);
  drawArc(ctx, (state.ox) * mindim, (state.oy) * mindim, r);
  ctx.stroke();
  ctx.fill();

  // ctx.beginPath();
  // drawArc(ctx, 0, 0, .1*r);
  // ctx.stroke();

  // const offsetY = -.025 * mindim

  // ctx.beginPath();
  // ctx.strokeStyle=colors.playmain;
  // ctx.lineWidth = .005 * mindim;
  // drawArc(ctx,state.ox*mindim,state.oy*mindim,r*1.5);
  // ctx.stroke();
  // // use an ellipse 
  // // with a checkerboard pattern 
  // // for drop shadow

  // ctx.beginPath();
  // // drawArc(ctx, 0, 0, .1*r);
  // // ctx.stroke();
  // ctx.strokeStyle=colors.playline;
  // ctx.lineCap = "round";
  // ctx.lineWidth = (r*2.5);
  // ctx.moveTo(state.ox*mindim,state.oy*mindim+offsetY);
  // ctx.lineTo(state.ox*mindim,height+offsetY+state.oy*mindim);
  // ctx.stroke();

  // ctx.beginPath();
  // // drawArc(ctx, 0, 0, .1*r);
  // // ctx.stroke();
  // ctx.strokeStyle=colors.playmain;
  // ctx.lineCap = "round";
  // ctx.lineWidth = (r*2);
  // ctx.moveTo(state.ox*mindim,state.oy*mindim+offsetY);
  // ctx.lineTo(state.ox*mindim,height+offsetY+state.oy*mindim);
  // ctx.stroke();
}


var drawRing = (state) => {

  //if (!state.events.isRingEnabled && !state.events.isRingLocked) return;

  const ctx = state.ctx;
  const mindim = state.mindim; // mindim ~ 10m
  ctx.setLineDash([10, 20]);
  ctx.lineWidth = .002 * mindim; // ~ 1mm, i think
  ctx.strokeStyle = colors.secondary;
  ctx.beginPath();
  // drawArc(ctx, 0, 0, 0.5 * mindim);
  drawArc(ctx, 0, 0, 0.1 * mindim);
  ctx.stroke();
  ctx.strokeStyle = colors.emergent;
  ctx.lineWidth = .001 * mindim; // ~ 1mm, i think
  ctx.beginPath();
  // drawArc(ctx, 0, 0, 0.5 * mindim);
  drawArc(ctx, 0, 0, 0.1 * mindim);
  ctx.stroke();
  ctx.setLineDash([]);

}

var drawActive = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;
  ctx.beginPath();
  ctx.lineWidth = .002 * mindim;
  // TODO: make color fade per plant... somehow performantly
  ctx.fillStyle = colors.primary; // with a pattern mask?
  ctx.strokeStyle = colors.emergent; // tertiary with stamina system
  for (plant of state.active) {
    if (!plant.leaves || plant.leaves < 0.09) continue;
    x = (plant.x + state.dx) * mindim;
    y = (plant.y + state.dy) * mindim;
    r = plant.r * mindim;
    drawArc(ctx, x, y, r);
  }
  ctx.fill();
  ctx.stroke();

}

var drawGround = (state) => {
  const ctx = state.offscreen.getContext("2d");
  const mindim = state.mindim;
  const r = mindim;
  const x = state.dx;
  const y = state.dy;

  ctx.beginPath();
  ctx.fillStyle = colors.emergent; // soil
  ctx.lineWidth = .05 * mindim;
  drawArc(ctx, x, y, r);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  drawArc(ctx, x, y, r * .97);
  ctx.clip();

  // ctx.beginPath();
  // ctx.fillStyle = "#151";
  // drawArc(ctx, x, y, r);
  // ctx.fill();

  ctx.beginPath();
  ctx.lineWidth = .02 * mindim;
  ctx.strokeStyle = colors.tertiary;
  for (let i = -50; i < 50; i++) {
    ctx.lineTo(mindim + x - (i * mindim / 30), -mindim + y);
    ctx.lineTo(x - (i * mindim / 30), mindim + y);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = .05 * mindim;
  ctx.strokeStyle = colors.primary;
  for (let i = -20; i < 20; i++) {
    ctx.lineTo(-mindim + x - (2 * i * mindim / 10), -mindim + y);
    ctx.lineTo(x - (2 * i * mindim / 10), mindim + y);
  }
  ctx.stroke();

  ctx.restore();

}

var drawRocks = (state) => {

}

var drawLitter = (state) => {

}

var drawGate = (state) => {
  const ctx = state.offscreen.getContext("2d");
  const mindim = state.mindim;
  const r = .3 * mindim;
  const x = state.dx * mindim;
  const y = state.dy * mindim;

  ctx.fillStyle = colors.emergent;
  ctx.fillRect(-r / 2, -mindim - r * .1, r, r * .4);
}

var drawFoliage = (state) => {
  const ctx = state.offscreen.getContext("2d");
  const mindim = state.mindim;

  var r1 = .1 * state.mindim;
  ctx.lineWidth = .05 * state.mindim;
  ctx.strokeStyle = colors.tertiary;
  // context.beginPath();
  // context.arc(0, 0, r * .71, 0, Math.PI * 2);
  // context.stroke();
  // TODO alternate the pattern

  // tree stump
  ctx.beginPath();
  ctx.arc(0, 0, r1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = colors.emergent;
  ctx.lineWidth = .004 * state.mindim;

  ctx.beginPath();
  drawArc(ctx, 0, 0, r1 + .025 * mindim);
  ctx.stroke();

  ctx.lineWidth = .002 * state.mindim;

  ctx.beginPath();
  drawArc(ctx, 0, 0, r1 + .019 * mindim);
  drawArc(ctx, 0, .003 * mindim, r1 - .020 * mindim);
  drawArc(ctx, 0, -.002 * mindim, r1 + .014 * mindim);
  drawArc(ctx, -.001 * mindim, 0, r1 - .009 * mindim);
  drawArc(ctx, 0, 0, r1 + .005 * mindim);
  ctx.stroke();

  ctx.beginPath();
  for (plant of state.plants || []) {
    let x = (plant.x) * mindim;
    let y = (plant.y) * mindim;
    let r = plant.r * mindim;
    let c = colors.primary;//(plant.t == "grass") ? "lawngreen" : "darkgreen";
    ctx.fillStyle = c;

    drawArc(ctx, x, y, r);
  }
  ctx.fill();
}

var drawNearby = (state) => {
  const ctx = state.ctx;
  const mindim = state.mindim;

  for (plant of state.nearby) {
    let x = (plant.x + state.dx) * mindim;
    let y = (plant.y + state.dy) * mindim;
    let r = plant.r * mindim;
    let c = colors.primary;//(plant.t == "grass") ? "lawngreen" : "darkgreen";
    ctx.beginPath();
    drawArc(ctx, x, y, r);
    ctx.fillStyle = c;
    // ctx.strokeStyle = "lawngreen";
    // ctx.fill();
    // ctx.stroke();
  }

}

function makeTransparent(ctx, style, alpha) {
  let red = parseInt(ctx[style].substring(1, 3), 16);
  let green = parseInt(ctx[style].substring(3, 5), 16);
  let blue = parseInt(ctx[style].substring(5, 7), 16);
  // let alpha = Math.min(1, (ratio));
  ctx[style] = `rgba(${red},${green},${blue},${alpha})`;
}


var drawArc = (ctx, x, y, r, params = {}) => {
  let offset = params.offset !== undefined ? params.offset : 0;
  let start = offset + (params.start !== undefined ? params.start : 0);
  let end = offset + (params.end !== undefined ? params.end : Math.PI * 2);

  let theta = Math.atan2(Math.sin(start), Math.cos(start));
  ctx.moveTo(x + r * Math.cos(theta), y + r * Math.sin(theta));
  ctx.arc(x, y, r, start, end, params.acw || false);
}

/*
 * #####   #####   #####   #####     #
 * #         #     #   #   #   #     #
 * #####     #     #   #   #####     #
 *     #     #     #   #   #
 * #####     #     #####   #         #
 *
 * #####   #####   #   #   #   #   #####   #   #   #####   #####     #
 * #       #   #   ## ##   ## ##   #       ##  #     #     #         #
 * #       #   #   # # #   # # #   ###     # # #     #     #####     #
 * #       #   #   #   #   #   #   #       #  ##     #         #
 * #####   #####   #   #   #   #   #####   #   #     #     #####     #
 */


// ctx.beginPath();
// ctx.strokeStyle = colors.secondary; // with a pattern mask?
// for (plant of state.active) {
//   if (!plant.flowers || plant.flowers < 0.009) continue;
//   x = (plant.x + state.dx) * mindim;
//   y = (plant.y + state.dy) * mindim;
//   r = plant.r * mindim;
//   drawArc(ctx, x, y, r);
// }
// ctx.stroke();


// ctx.strokeStyle = colors.emergent; // weed barrier
// ctx.beginPath();
// ctx.lineWidth = .05 * mindim;
// drawArc(ctx, x, y, r + ctx.lineWidth * 2);
// ctx.stroke();


// // something about drawing the border

// var offScreenCanvas = state.offscreen;
// var context = offScreenCanvas.getContext("2d");
// context.lineWidth = .1 * state.mindim;

// context.fillStyle = colors.primary;
// context.strokeStyle = colors.tertiary;
// context.save();
// context.beginPath();
// context.rect(-offScreenCanvas.width / 2, -offScreenCanvas.height / 2, offScreenCanvas.width, offScreenCanvas.height);
// context.arc(0, 0, mindim * 1.1, 0, Math.PI * 2, true);
// context.clip();
// context.fillRect(-offScreenCanvas.width / 2, -offScreenCanvas.height / 2, offScreenCanvas.width, offScreenCanvas.height);
// context.strokeRect(-offScreenCanvas.width / 2, -offScreenCanvas.height / 2, offScreenCanvas.width, offScreenCanvas.height);
// context.restore();

// // -- glass panel --
// if (state.glassLayer = true) {
//   ctx.save();
//   ctx.beginPath();
//   ctx.rect(-state.cx, -state.cy, state.canvas.width, state.canvas.height);
//   drawArc(ctx, 0, 0, mindim*.5, { acw: true });
//   ctx.clip();
//   ctx.filter = "blur(5px)";
//   ctx.beginPath();
//   ctx.lineWidth = .005 * mindim;
//   ctx.fillStyle = colors.emergent;//"lightgray";
//   ctx.strokeStyle = colors.emergent;//"lightgray";
//   let red = parseInt(ctx.fillStyle.substring(1, 3), 16);
//   let green = parseInt(ctx.fillStyle.substring(3, 5), 16);
//   let blue = parseInt(ctx.fillStyle.substring(5, 7), 16);
//   ctx.fillStyle = `rgba(${red},${green},${blue},0.75)`;
//   ctx.fillRect(-state.cx, -state.cy, state.canvas.width, state.canvas.height / 8);
//   drawArc(ctx, 0, 0, 0.5 * mindim, { acw: false });
//   ctx.stroke();
//   ctx.restore();
// }

// // -- trackpad --
// let rectX = -.9 * state.cx;
// let rectY = mindim * .5 + .1 * state.cx;
// let rectW = 1.8 * state.cx;
// let rectH = state.canvas.height - (state.cy + rectY + .1 * state.cx);

// if (rectW > 100 && rectH > 100) {
//   ctx.save();
//   // ctx.strokeStyle = "#444";
//   // ctx.strokeRect(rectX, rectY, rectW, rectH);
//   ctx.fillStyle = "#444";
//   ctx.strokeStyle = "#444";
//   ctx.fillRect(rectX + 5, rectY + 5, rectW - 10, rectH - 10);
//   ctx.lineWidth = 10;
//   ctx.lineCap = "round";
//   ctx.beginPath();
//   ctx.moveTo(rectX + 5, rectY + 5);
//   ctx.lineTo(rectX + rectW - 5, rectY + 5);
//   ctx.moveTo(rectX + rectW - 5, rectY + 5);
//   ctx.lineTo(rectX + rectW - 5, rectY + rectH - 5);
//   ctx.moveTo(rectX + rectW - 5, rectY + rectH - 5);
//   ctx.lineTo(rectX + 5, rectY + rectH - 5);
//   ctx.moveTo(rectX + 5, rectY + rectH - 5);
//   ctx.lineTo(rectX + 5, rectY + 5);

//   ctx.stroke();
//   ctx.restore();
// }

