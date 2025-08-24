const Random = (function (/*api*/) {
  var api = {};

  api.seed = function (seed) {
    return function () {
      // take in a string
      // translate that as a number
      seed = (seed == undefined || seed == null || seed == "") ? Date.now() : asNum(seed);
      // use that as an angle in a sin call
      seed = ((Math.sin(seed) * 1000000007) % Number.MAX_SAFE_INTEGER) % 1;
      return Math.abs(seed);
      // use the decimal part as a random number
      // then use that to generate a new seed
      // as long as the process remains the same
      // a starting seed will always generate
      // random numbers in the same sequence

    };

  }

  return api;
}());

var asNum = (string) => {
  // TODO check the type, return numbers and cast numeric strings
  // console.log(!isNaN(string));
  if (typeof string === "number") return string;
  let res = 0;
  for (let i = 0; i < string.length; i++) {
    let ch = string.charCodeAt(i);
    res = ((res << 5) - res + ch) % Number.MAX_SAFE_INTEGER;
  }
  return res;
}