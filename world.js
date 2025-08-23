const World = (function (/*api*/) {
  var api = {};


  // A Site is a collection of Points
  // point size (5mX5m)
  let pointWidth = 5, pointHeight = 5;

  // A Point is a collection of Cells
  // cell size (1mX1m; ~100pxX100px)
  let cellWidth = 100, cellHeight = 100;

  api.create = function (canvas, ctx) {
    var state = {
      canvas: canvas,
      ctx: ctx,
      cx: 0,
      cy: 0,
      dx: 0,
      dy: 0,
      frame: 0,
      time: 0,
      events: [],
    };

    const plants = [];
    var num = 50000;
    while (num--) {
      let x1 = (Math.random() * 5 - 2.5);
      let y1 = (Math.random() * 5 - 2.5);
      let r1 = (Math.random() * .6 + .4) * 0.025;
      plants.push({ x: x1, y: y1, r: r1 });
    }
    state.plants = plants;

    resize(state);

    return state;
  };

  // this should return [-1,1] for vector x and y
  var getVector = () => {
    const mouse = getMouse();//inputs.mouse;
    const dMax = mouse.dragMax;
    const vector = {};

    if (findInput(keybinds.mouseL)) {
      vector.x = mouse._x - mouse.x_;
      vector.y = mouse._y - mouse.y_;
    } else { // keyboard movement have "pointy" diagonals
      vector.x = (findInput(keybinds.right) - findInput(keybinds.left));
      vector.y = (findInput(keybinds.down) - findInput(keybinds.up));
    }

    // direct length is useful for detecting input
    const length = Math.hypot(vector.x, vector.y);
    const angle = Math.atan2(vector.y, vector.x);

    // but we need to normalize it with the angle
    vector.x = (length == 0 ? 0 : 1) * Math.cos(angle);
    vector.y = (length == 0 ? 0 : 1) * Math.sin(angle);

    return vector;
  };

  var resize = (state) => {
    state.canvas.width = self.innerWidth;
    state.canvas.height = self.innerHeight;
    state.cx = state.canvas.width / 2;
    state.cy = state.canvas.height / 2;
    state.ctx.translate(state.cx, state.cy);
  }

  // update the state
  api.update = function (dt) {
    const state = document.state;
    //console.log(`update(frame=${state.frame}, dt=${dt}, fps=${Math.floor(1/dt)})`);

    if (state.events.isResized) {
      resize(state);
      state.events.isResized = false;
    }
    const vector = getVector();
    const hypot = Math.hypot(vector.x,vector.y);
    const theta = Math.atan2(vector.y,vector.x);

    const mindim = Math.min(self.innerWidth, self.innerHdeight);

    state.dx-=hypot*.003*Math.cos(theta);
    state.dy-=hypot*.003*Math.sin(theta);
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
    state.frame++;
    state.time += dt;

  };
  // return the public api
  return api;
}());
