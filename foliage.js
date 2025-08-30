const Pattern = (function (/*api*/) {
  var api = {};

  const PATTERNS = {
    "soil": getPatternSoil,
  };

  api.build = function (state) {
    return function (name) {
      // refer to a list of functions to call to generate a pattern
      // ex name = soil

      if (name != "soil") return;
      return PATTERNS[name](state);
      // return "red";
    };
  }

  return api;

  function getPatternSoil(state) {
    // // return soil pattern 
    const k = 9;
    const soil = new OffscreenCanvas(k, k);
    const ctx = soil.getContext("2d");
    // const x = -state.offscreen.width / 2 + state.dx * state.mindim;
    // const y = -state.offscreen.height / 2 + state.dy * state.mindim;
    ctx.fillStyle = colors.tertiary;
    ctx.fillRect(0, 0, k / 3, k / 3);
    ctx.fillRect(k * .25, k * .5, k / 1.5, k / 6);
    

    const image = state.ctx.createPattern(soil, null);

    // return state.ctx.createPattern(image);
    // const pattern = state.ctx.createPattern(image, "repeat");
    // state.ctx.putImageData(image,0,0);
    return image;

  }


}());

