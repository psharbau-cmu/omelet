var types = {};

(function() {

    var construct = function(dataObj, refsObj) {

        var privateTestVal = 0;

        this.publicTestVal = 10;

        this.update = function() {
            privateTestVal += this.publicTestVal;
        };

        this.getPrivate = function() {
            return privateTestVal;
        };

        this.printRefs = function() {
            console.log(JSON.stringify(refsObj));
        };
    };

    types['testType'] = { createComponent:construct };
})();

var testInstanceA = new types['testType'].createComponent({}, 'test!');
var testInstanceB = new types['testType'].createComponent(null, {value:3});

testInstanceB.publicTestVal = 200;

testInstanceA.update();
testInstanceB.update();
testInstanceA.update();
testInstanceB.update();

console.log(testInstanceA.getPrivate());
console.log(testInstanceB.getPrivate());

console.log(JSON.stringify(testInstanceA));
console.log(JSON.stringify(testInstanceB));

testInstanceA.printRefs();
testInstanceB.printRefs();