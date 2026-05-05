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
    // resolveInteractions(state, dt);
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
    resp.push(createPlant("grass",-3+1.5*i,-1,.25*(i+1)));
    resp.push(createPlant("grass", 3-1.5*i, 1, .25*(i+1)));
  }
  return resp;
};

function createPlant(type,x,y,r) {
  return {type, x, y, r};
};

function updatePlants(plants, dt, min=.25) {

  // the time since last tick is given in millis
  // plants have a decay rate based on? millis, for now
  // let's just pick a value for now
  // we want a plant dot to shrink at a rate of roughly
  // 1cm per second or .0001 m/milli

  const rate = .00001*dt;

  for (let plant of plants) {
    let rNew = plant.r * (1 - rate);
    if (rNew <= min) {
      plant.r = min;
    } else {
      plant.r = rNew;
    }
  }

};

function updatePlayer(player, vector, dt) {
  console.log(player, vector);
  player.x += vector.x * player.speed * dt;
  player.y += vector.y * player.speed * dt;
};

function updateCamera(camera, player) {
  console.log(camera, player);
  camera.x = player.x;
  camera.y = player.y;
};