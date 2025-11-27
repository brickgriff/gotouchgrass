const Color = (function (/*api*/) {
    var api = {};


    return api;
}());

const colors = true ? {
    "primary": "#88b24b", //"darkgreen",
    "secondary": "#5f4c8b", //"darkviolet"
    "tertiary": "#fe6f61", //"saddlebrown"
    "emergent": "#f7cac8", //"darkgray"
    "rewarding": "gold",
    "hostile": "firebrick",
    "mercurial": "navy",
    "umbral": "#3c3c3c",
} : {
    "primary": "gray",
    "secondary": "dimgray",
    "tertiary": "darkgray",
    "emergent": "lightgray",
    "rewarding": "black",
    "hostile": "white",
    "mercurial": "silver",

};
