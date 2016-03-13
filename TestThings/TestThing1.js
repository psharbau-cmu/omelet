var createThingWithoutNew = function() {
    var privateVariable = "snake";

    return {
        getThing: function() {return privateVariable;},
        setThing: function(value) { privateVariable = value; }
    };
};

var a = createThingWithoutNew() ;
var b = createThingWithoutNew();

b.setThing("badger");

console.log(a.getThing());
console.log(b.getThing());
