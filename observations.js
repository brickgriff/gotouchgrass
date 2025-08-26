const Observations = (function (/*api*/) {
  var api = {};

  api.draw = function () {

    const state = document.state;
    // console.log("Observations.draw()");
    const ctx = state.ctx;
    const offset = .5;
    ctx.lineWidth = 2;

    if (state.leaves >= 0) {

      ctx.beginPath();
      ctx.strokeStyle = "forestgreen";
      drawArc(ctx, -.9 * state.cx + 50, .9 * state.cx, 25 - 3);
      drawArc(ctx, -.9 * state.cx + 32, .9 * state.cx - 1, 25, { start: -.25 * Math.PI, end: Math.PI * .25 });
      drawArc(ctx, -.9 * state.cx + 68, .9 * state.cx - 1, 25, { start: .75 * Math.PI, end: -Math.PI * .75 });
      ctx.moveTo(-.9 * state.cx + 50, .9 * state.cx - 19);
      ctx.lineTo(-.9 * state.cx + 50, .9 * state.cx + 19);
      ctx.stroke();
    }

    const leaves = Math.floor(state.leaves);
    if (leaves >= 1) {
      ctx.beginPath();
      const llevel = Math.floor(Math.log(leaves) / Math.log(10)); // 1
      const lremainder = leaves % (10 ** (llevel + 1)); // 10 % 100 = 0
      const langle = lremainder / (10 ** (llevel + 1) - 1); // 0 / 90 = 0%
      ctx.strokeStyle = "lightgray";
      drawArc(ctx, -.9 * state.cx + 50, .9 * state.cx, 25 - 3, {
        start: (offset + langle) * Math.PI,
        end: (offset - langle) * Math.PI,
        acw: langle < 1
      });
      for (let i = 0; i < llevel; i++) {
        drawArc(ctx, -.9 * state.cx + 50, .9 * state.cx, i * (ctx.lineWidth + 1) + 25);
      }
      ctx.stroke();
    }

    if (state.flowers >= 0) {

      ctx.beginPath();
      ctx.strokeStyle = "violet";
      drawArc(ctx, .9 * state.cx - 50, .9 * state.cx, 25 - 3);
      const foffset = 1 / 12;
      for (let i = 0; i < 6; i++) {
        let fLogoAngle = foffset + i * 1 / 6;

        let fLogoX = 8 * Math.cos(fLogoAngle * Math.PI * 2);
        let fLogoY = 8 * Math.sin(fLogoAngle * Math.PI * 2);
        drawArc(ctx, .9 * state.cx - 50 + fLogoX, .9 * state.cx + fLogoY, 7);

      }
      ctx.stroke();
    }

    const flowers = Math.floor(state.flowers);
    if (flowers >= 1) {

      ctx.beginPath();
      const flevel = Math.floor(Math.log(flowers) / Math.log(10));
      const fremainder = flowers % (10 ** (flevel + 1));
      const fangle = fremainder / (10 ** (flevel + 1) - 1);
      ctx.strokeStyle = "lightgray";
      drawArc(ctx, .9 * state.cx - 50, .9 * state.cx, 25 - 3, {
        start: (offset + fangle) * Math.PI,
        end: (offset - fangle) * Math.PI,
        acw: fangle < 1
      });
      for (let i = 0; i < flevel; i++) {
        drawArc(ctx, .9 * state.cx - 50, .9 * state.cx, i * (ctx.lineWidth + 1) + 25);
      }
      ctx.stroke();

    }

    if (state.active.length > 0) {

      ctx.beginPath();
      ctx.lineWidth = 5;
      const alevel = Math.log(state.active.length) / Math.log(10);
      //const aremainder = state.active.length % (10 ** (alevel + 1));
      const aangle = alevel / 10;
      ctx.strokeStyle = "lightgray";
      drawArc(ctx, 0, 0, state.mindim / 2, {
        start: (offset + aangle) * Math.PI,
        end: (offset - aangle) * Math.PI,
        acw: aangle < 1
      });
      ctx.stroke();

    }

    ctx.lineWidth = 1;
  }

  return api;
}());
