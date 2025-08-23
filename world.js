const World = (function (/*api*/) {
  var api = {};

  api.create = function (canvas, ctx) {
    var state = {
      canvas: canvas,
      ctx: ctx,
      // cx,cy : the centerpoint of the available play space 
      cx: 0,
      cy: 0,
      // dx,dy : how _much_ the player moved this frame 
      // NOTE: how _much_ , not how _fast_
      dx: 0,
      dy: 0,
      speed: 0.003,
      frame: 0,
      time: 0,
      events: [],
      defaults: { // so you can always revert
        speed: 0.003,
      },
    };

    createPlants(state);
    resize(state);

    return state;
  };

  // this should return [-1,1] for vector x and y
  var getVector = () => {
    const mouse = getMouse(); //inputs.mouse;
    let dMax = mouse.dragMax;

    const vector = {};

    if (findInput(keybinds.mouseL)) {
      vector.x = mouse._x - mouse.x_;
      vector.y = mouse._y - mouse.y_;
    } else { // keyboard movement have "pointy" diagonals
      vector.x = (findInput(keybinds.right) - findInput(keybinds.left));
      vector.y = (findInput(keybinds.down) - findInput(keybinds.up));
      dMax = 1;
    }

    normalize(vector,dMax);

    return vector;
  };

  var normalize = (vector,max) => {
    // direct length is useful for detecting input
    const length = Math.hypot(vector.x, vector.y); // can be as much as 1.4!
    const angle = Math.atan2(vector.y, vector.x); // can be a weird number (~0)

    // we need to normalize diagonals with the angle
    vector.x = Math.min(length/max,1) * Math.cos(angle);
    vector.y = Math.min(length/max,1) * Math.sin(angle);
  }

  var resize = (state) => {
    state.canvas.width = self.innerWidth;
    state.canvas.height = self.innerHeight;
    state.cx = state.canvas.width / 2;
    state.cy = state.canvas.height / 2;
    state.ctx.translate(state.cx, state.cy);
  }

  var createPlants = (state) => {
    const plants = [];
    var num = 50000; // 50K plants!
    while (num--) {
      let x1 = (Math.random() * 5 - 2.5);
      let y1 = (Math.random() * 5 - 2.5);
      let r1 = (Math.random() * .6 + .4) * 0.025;
      plants.push({ x: x1, y: y1, r: r1 });
    }
    state.plants = plants;
  }

  var updatePlayer = (state) => {

    const vector = getVector();
    const hypot = Math.hypot(vector.x, vector.y); // percent max speed
    const theta = Math.atan2(vector.y, vector.x); // angle

    // save the current "unit-space"
    //const mindim = Math.min(self.innerWidth, self.innerHdeight);

    state.dx -= hypot * state.speed * Math.cos(theta);
    state.dy -= hypot * state.speed * Math.sin(theta);
  }

  // update the state
  api.update = function (dt) {
    const state = document.state;
    //console.log(`update(frame=${state.frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);

    if (state.events.isResized) {
      resize(state);
      state.events.isResized = false;
    }

    updatePlayer(state);
    // now that it's in state, we can change it with events
    /*
        if (findInput(keybinds.debug)) {
          state.isDebug = (state.isDebug^=true)!==0;
          // FIXME: flickering
        }
    
        if (findInput(keybinds.menu)) {
          state.isQuit = (state.isQuit^=true)!==0;
          // TODO: set state to menu then draw the menu
          // TODO: let the menu state changes set state to quit
        }
    
        // primary keypress is the same as clicking at player position
        const mouse = getMouse();
        if (findInput(keybinds.primary)) {
          mouse.isClicked=true;
          mouse.x_=mouse._x=state.player.x;
          mouse.y_=mouse._y=state.player.y;
        }
    
        // TODO: use a worker thread!!!
        // TODO: count simulation steps then space out calculations by at least 6-30 frames
        state.entities.filter(e=>e.metadata.type==="plant").forEach((p,i)=>{
          if (p.t===undefined) p.t=100;
          //if (p.metadata.id===100) console.log(i,p.r,p.t);
          let rand = Math.random();
          let isGrowing=rand>0.6;
          if (p.metadata.color==="limegreen")isGrowing=rand>.4;
          if (isGrowing) {
            p.r+=1/100;
            if (p.r > 100) p.t--;
            if (p.t<=0) {
              state.entities.splice(i,1);
              pushEntities(state.entities, [addEntityToList(i,100,100,100,state.entities[state.entities.findLastIndex(e=>e.metadata.type==="plant"&&e.metadata.id>0)].metadata.id+1)]);
            }
          }
        });
    
        const score = Math.PI * Math.pow(state.player.radius,2) * dt;
        state.player.isTouchingGrass=false;
        if (state.player.isOverGrass) {
          state.player.isLost=false;
          state.player.points+=score;
        } else {
          state.player.points-=(state.player.isUnderCanopy?2:1)*(state.player.isLost?2:1)*score;
        }
    
        // revive!
        if (state.player.points < 0) {
          state.dx=state.dy=0;
          state.player.x=state.player.y=0;
          state.player.isUnderCanopy=false;
          state.player.isLost=false;
          state.player.isInsideWall=false;
          state.player.isOverGrass=true;
          state.player.isTouchingGrass=false;
        }
    
        state.player.points=state.player.points*(state.player.points>=0);
    
        // use mouse or keyboard
        const vector = getVector();
        const hypot = Math.hypot(vector.x,vector.y);
        const dMin = mouse.dragMin;
    
        // vector length
        const dist=Math.min(hypot * (hypot >= dMin),inputs.mouse.dragMax);
    
        state.player.speed=dist/state.player.speedFactor;
        if (state.player.isLost) state.player.speed/=2;
        // angle from deltaY and deltaX
        state.player.theta=Math.atan2(vector.y,vector.x);
        // TODO: turn the player away from the wall, not just away from their intended vector
        if (state.player.isInsideWall) state.player.theta=(state.player.theta+Math.PI)%(2*Math.PI);
    
        // cummulative vector changes
        const speed = state.player.speed;
        const theta = state.player.theta;
        state.dx+=speed*Math.cos(theta);
        state.dy+=speed*Math.sin(theta);
    */
    // prepare for next frame

    
  };
  // return the public api
  return api;
}());
