const Observations = (function (/*api*/) {
  var api = {};

  api.draw = function () {

    const state = document.state;
    // console.log("Observations.draw()");
    const ctx = state.ctx;

    ctx.beginPath();
    ctx.lineWidth = 1;

    drawArc(ctx, -.9 * state.cx + 50, .9 * state.cx, 25 - ctx.lineWidth * .5);
    drawArc(ctx, .9 * state.cx - 50, .9 * state.cx, 25 - ctx.lineWidth * .5);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    const offset = .5;

    if (state.leaves) { // 10
      // const start = offset;
      // const end = offset;
      const level = Math.floor(Math.log(state.leaves) / Math.log(10)); // 1
      const remainder = state.leaves % (10 ** (level + 1)); // 10 % 100 = 0
      const angle = remainder / (9 * 10 ** level); // 0 / 90 = 0%

      drawArc(ctx, -.9 * state.cx + 50, .9 * state.cx, 25 - ctx.lineWidth, {
        start: (offset + angle) * Math.PI,
        end: (offset - angle) * Math.PI,
        acw: angle < 1
      });
      for (let i = 0; i < level; i++) {
        drawArc(ctx, -.9 * state.cx + 50, .9 * state.cx, i * (ctx.lineWidth + 1) + 25);
      }
    }
    if (state.flowers) {
      const start = 0 + offset;
      const end = Math.PI * 2 + offset;
      const level = Math.floor(Math.log(state.flowers) / Math.log(10));
      const remainder = state.flowers % (10 ** level);
      const angle = Math.PI * remainder / (10 ** level);
      drawArc(ctx, .9 * state.cx - 50, .9 * state.cx, 25 - ctx.lineWidth, { start: start + angle, end: end - angle, acw: true });
      for (let i = 0; i < level; i++) {
        drawArc(ctx, .9 * state.cx - 50, .9 * state.cx, i * (ctx.lineWidth + 1) + 25);
      }
    }
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  return api;
}());
