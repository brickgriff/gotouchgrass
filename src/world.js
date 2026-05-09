// world.js

export const World = {

  create(state) {
    // create game objects

    // create plants
    state.plants = createPlants();
    state.map = updateMap(state.plants, state.viewport.cell);
  },
  update(state, dt) {
    // update game objects

    // console.log(Input.buttons);
    // updateVector(state.vector, state.player.speed, dt);
    resolveInteractions(state, dt);
    updatePlayer(state.player, state.vector, dt); 
    // updateMap ??
    updatePlants(state.plants, dt, state.player.v===state.player.vMax);
    // remove above dt after updateVector is made
    updateCamera(state.camera, state.player);

  },  
  // TODO: positionGrid for faster overlap checks
  // TODO: entityPool for faster respawning
};

function createPlants() {
  const resp = [];
  const jitter = 1;
  for (let i = 0; i < 21; i++) {      
    for (let j = 0; j < 11; j++) {

    const x = i+Math.sin(j*.1)*.05 + (Math.random() - 0.5) * jitter;
    const y = j+Math.sin(i*.1)*.05 + (Math.random() - 0.5) * jitter;    
    resp.push(createPlant("grass",(-10+x)/1.2,(-5+y)/1.2,.1));
    }
  }
  return resp;
};

function updateMap(plants, cell) {
  const map = new Map();
  for (let plant of plants) {
    const cellX = Math.floor(plant.x/cell);
    const cellY = Math.floor(plant.y/cell);
    const key = `${cellX},${cellY}`;
    if (!map.get(key)) map.set(key,[]);
    map.get(key).push(plant);
  }
  console.log(map);
  return map;
};

function createPlant(type,x,y,r) {
  return {type, x, y, r, isStopped:false};
};

function resolveInteractions(state, dt) {
  // for each plant, check if the player vision range touches the plant dot
  // this is actually the grass effect
  // this should go into interaction resolution

  const p = state.player;
  const plants = state.plants;

  if (!state.player.isWalking) {state.player.v += .0001*dt;}
  else if (state.player.isWalking) {state.player.v -= .001*dt;}

  if (state.player.v > state.player.vMax) state.player.v = state.player.vMax;
  else if (state.player.v < state.player.vMin) state.player.v = state.player.vMin;

  // check map for growth suppression
  for (let plant of plants) {
    const neighbors = getNeighbors(plant,state.map, state.viewport.cell);
    plant.isStopped = false;

    for (let neighbor of neighbors) {

      const distX = neighbor.x - plant.x;
      const distY = neighbor.y - plant.y;

      const coreDistanceSq = distX*distX + distY*distY; // point-to-point distance

      const combinedRadius = (neighbor.r + plant.r)*.8; // radius1 + radius2 for overlap checks
      const combinedRadiusSq = combinedRadius*combinedRadius;


      // console.log(plant,neighbor, coreDistanceSq, combinedRadiusSq);
      // const combinedCoreRange; // range1 + range2 for neighbor checks

      // as soon as coreDistance <= combinedCoreRadius
      // both plants should stop growing... wait... what if we don't?
      if (plant!==neighbor && coreDistanceSq <= combinedRadiusSq) {
        // console.log(plant,nearby, coreDistanceSq, combinedRadiusSq);
        plant.isStopped = true;
        break;
      }
      // if ((plant.x===-2 && plant.y===1) || (plant.x===-3 && plant.y===1)) 
        // console.log(plant, neighbor);

      // if (coreDistance <= combinedCoreRange) plant.neighbors.push(nearby);
    }
    // if plant is colliding with player
    // shrink a bit
    const pX = p.x - plant.x;
    const pY = p.y - plant.y;

    const pDistSq = pX*pX + pY*pY;
    const pCombinedR = p.r+plant.r;
    const pCombinedRSq = pCombinedR*pCombinedR;
    plant.isPlayerNearby = false;
    plant.isPlayerNearbyWalking = false;

    if (pDistSq <= pCombinedRSq) {
      // console.log(`player! @(${plant.x},${plant.y})`);
      plant.isPlayerNearby = true;
      if (p.isWalking) plant.isPlayerNearbyWalking = true;
    }

  }
};

function getNeighbors(plant, map, cell) {

  const results = [];

  const cellX = Math.floor(plant.x/cell);
  const cellY = Math.floor(plant.y/cell);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const key = `${cellX+dx},${cellY+dy}`;
      const cell = map.get(key);

      if (!cell) continue;

      results.push(...cell);
    }
  }

  return results;
};

function updatePlants(plants, dt, isVisionFull=false, min=.1, max=1.5) {

  // the time since last tick is given in millis
  // plants have a decay rate based on? millis, for now
  // let's just pick a value for now
  // we want a plant dot to shrink at a rate of roughly
  // 1cm per second or .0001 m/milli

  const rate = .00005*dt;
  // pause plant shrink until resources exist in the terrain
  // add a small shrink penalty for disturbance
  // then add the seed bank

  // assume these plants are all connected to the same terrain
  // this will prevent too many neighborhood checks
  // try to keep the overall population of terrain entities reasonable

  for (let i=0; i < plants.length; i++) {

    const plant = plants[i];
    // figure out if this plant overlaps another dot by at least 50%
    // meaning no plant dot edge may extend w/i 50% of this dot's radius
    // find the plant that is the most restrictive; 
    // don't give up after the first collision

    // for (let j=0; j < plants.length; j++) {
    //   const neighbor = plants[j];
    //   // dist
    //   const limit = plant.r*0.5;
    //   const x = neighbor.x - plant.x;
    //   const y = neighbor.y - plant.y;
    //   const distSq = x*x + y*y;      
    // }

    const rateNew = plant.isStopped ? 0 : rate;
    const playerPenalty = (plant.isPlayerNearby && !isVisionFull ? 
      (.00002 + (plant.isPlayerNearbyWalking ? .00004 : 0)) * dt : 0 );
      
    let rNew = plant.r * (1 + (rateNew - playerPenalty));
    if (rNew <= min) {
      plant.r = min;
    } else if (rNew > max) {
      plant.r = max;
    } else {
      plant.r = rNew;
    }
  }

};

function updatePlayer(player, vector, dt) {
  // console.log(player, vector);
  // console.log(player.isPulsing);
  player.x += vector.x * player.speed * dt;
  player.y += vector.y * player.speed * dt;

  player.current += dt;
  if (player.isPulsing && player.current > 500) {
    player.current = 0;
    player.isPulsing = false;
  }

  if (player.isWalking) {
   if (player.cycle == 3000) player.current = 0;
   player.cycle = 2000;
  } else {
    if (player.cycle == 2000) player.current = 0;
    player.cycle = 3000;
  }

  if (!player.isPulsing && player.current > player.cycle) {
    player.current -= player.cycle;
    player.isPulsing = true;
  }
  

};

function updateCamera(camera, player) {
  // console.log(camera, player);
  camera.x = player.x;
  camera.y = player.y;
};

function hash(n) {
  return Math.sin(n * 127.1) * 43758.5453 % 1;
};

/*

const jx = hash(i * 12.9898 + j * 78.233);
const jy = hash(i * 91.123 + j * 45.164);

x += (jx - 0.5) * jitter;
y += (jy - 0.5) * jitter; */