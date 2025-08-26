const Observations = (function (/*api*/) {
  var api = {};

  api.draw = function () {

    const state = document.state;
    // console.log("Observations.draw()");
    const ctx = state.ctx;
    const offset = .5;
    ctx.lineWidth = 2;

    if (state.leaves > 9) {

      ctx.beginPath();
      ctx.strokeStyle = "darkgray";
      drawArc(ctx, -.9 * state.cx + 50, .9 * state.cx, 25 - 3);
      ctx.stroke();

      ctx.beginPath();
      const llevel = Math.floor(Math.log(state.leaves) / Math.log(10)); // 1
      const lremainder = state.leaves % (10 ** (llevel + 1)); // 10 % 100 = 0
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
    if (state.flowers > 9) {

      ctx.beginPath();
      ctx.strokeStyle = "darkgray";
      drawArc(ctx, .9 * state.cx - 50, .9 * state.cx, 25 - 3);
      ctx.stroke();

      ctx.beginPath();
      const flevel = Math.floor(Math.log(state.flowers) / Math.log(10));
      const fremainder = state.flowers % (10 ** (flevel + 1));
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
    ctx.lineWidth = 1;
  }

  return api;
}());
