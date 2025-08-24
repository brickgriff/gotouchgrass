const Random = (function (/*api*/) {
  var api = {};

  api.seed = function (seed) {
    return function () {
      seed = (seed == undefined || seed == null || seed == "") ? Date.now() : asNum(seed);
      seed = Math.sin(seed * 1000000007);
      return Math.abs(seed);
    };
  }

  return api;
}());

var asNum = (string) => {
  if (typeof string === "number") return string; // parseInt?
  let res = 0;
  for (let i = 0; i < string.length; i++) {
    let ch = string.charCodeAt(i);
    res = ((res << 5) - res + ch) % Number.MAX_SAFE_INTEGER;
  }
  return res;
}