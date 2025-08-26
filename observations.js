const Observations = (function (/*api*/) {
  var api = {};

  api.draw = function () {

    const state = document.state;
    // console.log("Observations.draw()");
    const ctx = state.ctx;
    const offset = .5;
    const offsetX = .85 * state.cx;
    const mindim = state.mindim;
    const radius = .06 * mindim;
    const offsetY = Math.min(offsetX, state.cy - radius - .05 * mindim);
    ctx.lineWidth = 2;

    if (state.leaves >= 0) {

      ctx.beginPath();
      ctx.strokeStyle = "forestgreen";
      drawArc(ctx, -offsetX + radius * .5, offsetY, radius - 3);
      drawArc(ctx, -offsetX - radius * .2, offsetY - 1, radius, { start: -.25 * Math.PI, end: Math.PI * .25 });
      drawArc(ctx, -offsetX + radius * 1.2, offsetY - 1, radius, { start: .75 * Math.PI, end: -Math.PI * .75 });
      ctx.moveTo(-offsetX + radius * .5, offsetY - radius * .6);
      ctx.lineTo(-offsetX + radius * .5, offsetY + radius * .8);
      ctx.stroke();
    }

    const leaves = Math.floor(state.leaves);
    if (leaves >= 1) {
      ctx.beginPath();
      const llevel = Math.floor(Math.log(leaves) / Math.log(10)); // 1
      const lremainder = leaves % (10 ** (llevel + 1)); // 10 % 100 = 0
      const langle = lremainder / (10 ** (llevel + 1) - 1); // 0 / 90 = 0%
      ctx.strokeStyle = "lightgray";
      drawArc(ctx, -offsetX + radius * .5, offsetX, radius - 3, {
        start: (offset + langle) * Math.PI,
        end: (offset - langle) * Math.PI,
        acw: langle < 1
      });
      for (let i = 0; i < llevel; i++) {
        drawArc(ctx, -offsetX + radius * .5, offsetX, i * (ctx.lineWidth + 1) + radius);
      }
      ctx.stroke();
    }

    if (state.flowers >= 0) {

      ctx.beginPath();
      ctx.strokeStyle = "violet";
      drawArc(ctx, offsetX - radius * .5, offsetY, radius - 3);
      const foffset = 1 / 12;
      for (let i = 0; i < 6; i++) {
        let fLogoAngle = foffset + i * 1 / 6;

        let fLogoX = .35 * radius * Math.cos(fLogoAngle * Math.PI * 2);
        let fLogoY = .35 * radius * Math.sin(fLogoAngle * Math.PI * 2);
        drawArc(ctx, offsetX - radius * .5 + fLogoX, offsetY + fLogoY, radius * .3);

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
      drawArc(ctx, offsetX - radius * .5, offsetX, radius - 3, {
        start: (offset + fangle) * Math.PI,
        end: (offset - fangle) * Math.PI,
        acw: fangle < 1
      });
      for (let i = 0; i < flevel; i++) {
        drawArc(ctx, offsetX - radius * .5, offsetX, i * (ctx.lineWidth + 1) + radius);
      }
      ctx.stroke();

    }

    if (state.active.length > 0) {

      ctx.beginPath();
      ctx.lineWidth = 5;
      const alevel = Math.log(state.active.length) / Math.log(10);
      //const aremainder = state.active.length % (10 ** (alevel + 1));
      const aangle = alevel / 10;
      ctx.strokeStyle = "gold";
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
