// world.js

export const World = {

  create(state) {
    // create game objects

    // create plants
    state.plants = createPlants();
  },
  update(state, dt) {
    // update game objects

    // console.log(Input.buttons);
    // updateVector(state.vector, state.player.speed, dt);
    resolveInteractions(state, dt);
    updatePlayer(state.player, state.vector, dt); 
    updatePlants(state.plants, dt);
    // remove above dt after updateVector is made
    updateCamera(state.camera, state.player);

  },  
  // TODO: positionGrid for faster overlap checks
  // TODO: entityPool for faster respawning
};

function createPlants() {
  const resp = [];
  for (let i = 0; i < 5; i++) {      
    // resp.push(createPlant("grass",-3+1.5*i,-1,.25*(i+1)));
    // resp.push(createPlant("grass", 3-1.5*i, 1, .25*(i+1)));
    resp.push(createPlant("grass",-3+1.5*i,-1,.25));
    resp.push(createPlant("grass", 3-1.5*i, 1, .25));
  }
  return resp;
};

function createPlant(type,x,y,r) {
  return {type, x, y, r};
};

function resolveInteractions(state, dt) {
  // for each plant, check if the player vision range touches the plant dot
  // this is actually the grass effect
  // this should go into interaction resolution

  if (!state.player.isWalking) {state.player.v *= 1.001;}
  else if (state.player.isWalking) {state.player.v *= .9;}

  if (state.player.v > state.player.vMax) state.player.v = state.player.vMax;
  else if (state.player.v < state.player.vMin) state.player.v = state.player.vMin;

};

function updatePlants(plants, dt, min=.25, max=2.5) {

  // the time since last tick is given in millis
  // plants have a decay rate based on? millis, for now
  // let's just pick a value for now
  // we want a plant dot to shrink at a rate of roughly
  // 1cm per second or .0001 m/milli

  const rate = .00001*dt;
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

    for (let j=0; j < plants.length; j++) {
      const neighbor = plants[j];
      // dist
      const limit = plant.r*0.5;
      const x = neighbor.x - plant.x;
      const y = neighbor.y - plant.y;
      const distSq = x*x + y*y;

      
    }

    let rNew = plant.r * (1 + rate);
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