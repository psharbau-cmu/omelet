var fs = require('fs');

var omeletSource = '..\\omelet\\out\\omelet.min.js';
var gameSource = '.\\Game\\empathyGame.min.js';

var window = {};
var document = {createElement:function() {return {getContext:function() {return {};}}}};

fs.readFile(omeletSource, 'utf8', function(err, omeletCode) {
    if (err) {
        console.log(err);
    } else {
        eval(omeletCode);
        var schema = window.omelet.getJSONSchema();
        fs.writeFile('.\\omelet.json', JSON.stringify(schema), function(err) {
            if (err) console.log(err);
            else console.log('done.');
        });
    }
});