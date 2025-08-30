const Stamina = (function (/*api*/) {
    var api = {};

    api.draw = function () {

        const state = document.state;
        const ctx = state.ctx;
        const mindim = state.mindim;
        const maxdim = Math.max(state.canvas.height, state.canvas.width);

        state.stamina = state.stamina == undefined ? 0 : state.stamina + .002;
        state.staminaLimit = state.staminaLimit == undefined ? 0 : state.staminaLimit + .005;

        if (state.staminaLimit > 10) state.staminaLimit = 10;
        if (state.stamina > state.staminaLimit) state.stamina = state.staminaLimit;

        const staminaPercent = state.stamina / 10;
        const staminaLimitPercent = state.staminaLimit / 10;

        ctx.lineCap = "round";
        const r = state.cy * 3;
        const offsetY = state.cy * 3.8;
        const coef = .9 * mindim / maxdim;

        if (staminaPercent < .01 || staminaLimitPercent < .025) return;

        // stamina full indicator
        if (staminaPercent >= .99) {
            ctx.beginPath();
            ctx.strokeStyle = colors.emergent;
            ctx.lineWidth = 0.04 * mindim;
            drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = colors.secondary;
            ctx.lineWidth = 0.03 * mindim;
            drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
            ctx.stroke();
        }
        ctx.save();

        // stamina bar border
        ctx.beginPath();
        ctx.strokeStyle = colors.emergent;
        if (staminaPercent < 10) makeTransparent(ctx, "strokeStyle", staminaPercent * 10);
        ctx.lineWidth = 0.02 * mindim;
        drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
        // drawArc(ctx, 0, -offsetY - 5 * ctx.lineWidth, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
        // drawArc(ctx, 0, -offsetY + 5 * ctx.lineWidth, r, { start: (.5 - coef * .05) * Math.PI, end: (.5 + coef * .05) * Math.PI });
        ctx.stroke();

        // stamina limit
        ctx.beginPath();
        ctx.strokeStyle = colors.secondary;
        if (staminaPercent < 10) makeTransparent(ctx, "strokeStyle", staminaPercent * 10);
        ctx.lineWidth = 0.005 * mindim;
        drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * staminaLimitPercent * .05) * Math.PI, end: (.5 + coef * staminaLimitPercent * .05) * Math.PI });
        ctx.stroke();

        // stamina
        ctx.beginPath();
        ctx.strokeStyle = colors.primary;
        if (staminaPercent < 10) makeTransparent(ctx, "strokeStyle", staminaPercent * 5);
        ctx.lineWidth = 0.01 * mindim;
        drawArc(ctx, 0, -offsetY, r, { start: (.5 - coef * staminaPercent * .05) * Math.PI, end: (.5 + coef * staminaPercent * .05) * Math.PI });
        ctx.stroke();

        ctx.restore();
    };

    return api;
}());

