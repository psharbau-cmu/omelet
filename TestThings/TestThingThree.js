var arrayThing = ['a', 'b', 'c', 'd'];
var objThing = {test:'a', lego:'b', drink:'c', flowers:'d'};

objThing.fun = function() {console.log("This is so much fun!"); };
arrayThing.fun = objThing.fun;

var doWork = function(thing) {
    for (var member in thing) {
        console.log(member);
    }
};


doWork(arrayThing);
console.log();
doWork(objThing);