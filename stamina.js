const Stamina = (function (/*api*/) {
    var api = {};

    api.draw = function () {

        const state = document.state;
        const ctx = state.ctx;
        const mindim = state.mindim;
        const maxdim = Math.max(state.canvas.height, state.canvas.width);

        state.stamina = 3;
        state.staminaLimit = 7;

        const staminaPercent = state.stamina * 10 / 100;
        const staminaLimitPercent = state.staminaLimit * 10 / 100;

        ctx.lineCap = "round";
        const r = state.cy * 3;
        const offsetY = state.cy * 3.8;
        const coef = mindim / maxdim;

        // stamina full indicator
        if (staminaPercent >= .1) {
            ctx.beginPath();
            ctx.strokeStyle = colors.secondary;
            ctx.lineWidth = 0.025 * mindim;
            drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
            ctx.stroke();
        }

        // stamina bar border
        ctx.beginPath();
        ctx.strokeStyle = colors.emergent;
        ctx.lineWidth = 0.02 * mindim;
        drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
        // drawArc(ctx, 0, -offsetY - 5 * ctx.lineWidth, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
        // drawArc(ctx, 0, -offsetY + 5 * ctx.lineWidth, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
        ctx.stroke();

        // stamina limit
        ctx.beginPath();
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 0.01 * mindim;
        drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * staminaLimitPercent * .05) * Math.PI, end: (.5 + coef * staminaLimitPercent * .05) * Math.PI });
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = colors.emergent;
        ctx.lineWidth = 0.005 * mindim;
        drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * staminaLimitPercent * .05) * Math.PI, end: (.5 + coef * staminaLimitPercent * .05) * Math.PI });
        ctx.stroke();

        // stamina
        ctx.beginPath();
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 0.015 * mindim;
        drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * staminaPercent * .05) * Math.PI, end: (.5 + coef * staminaPercent * .05) * Math.PI });
        ctx.stroke();
    };

    return api;
}());

