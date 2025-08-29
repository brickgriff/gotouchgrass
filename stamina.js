const Stamina = (function (/*api*/) {
    var api = {};

    api.draw = function () {

        const state = document.state;
        const ctx = state.ctx;
        const mindim = state.mindim;
        const maxdim = Math.max(state.canvas.height, state.canvas.width);

        state.stamina = 2.75;

        const staminaPercent = state.stamina * 10 / 100;

        ctx.lineCap = "round";
        const r = state.cy * 3;
        const offsetY = state.cy * 3.8;

        ctx.beginPath();
        ctx.strokeStyle = colors.emergent;
        ctx.lineWidth = 0.02 * mindim;
        const coef = mindim / maxdim;
        drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = colors.tertiary;
        ctx.lineWidth = 0.01 * mindim;
        drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * staminaPercent * .05) * Math.PI, end: (.5 + coef * staminaPercent * .05) * Math.PI });
        ctx.stroke();
    };

    return api;
}());

