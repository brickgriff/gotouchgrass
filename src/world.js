// world.js

export const World = {

  create(state) {
    // create game objects

    // create plants
    for (let i = 0; i < 5; i++) {      
      state.plants.push(createPlant("grass",-2+i,-1,.2*(i+1)));
      state.plants.push(createPlant("grass", 2-i, 1, .2*(i+1)));
    }

  },
  update(state, dt) {
    // update game objects

  },  
  // TODO: positionGrid for faster overlap checks
  // TODO: entityPool for faster respawning
};

function createPlant(type,x,y,r) {
  return {type, x, y, r};
};