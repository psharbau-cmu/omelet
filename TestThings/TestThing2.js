var a = "snake";
var b = 1;
var c = true;
var d = [];
var e = [3, "snake", true, []];
var f = {};
var g = {a:"snake", b:1, c:true};

var things = [a, b, c, d, e, f, g];

things.forEach(function(thing) {
    console.log(thing);
    console.log(thing.constructor);
});