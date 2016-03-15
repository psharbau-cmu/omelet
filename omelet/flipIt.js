var fs = require('fs');
var uglifyjs = require('uglify-js');

var files = [
    '.\\src\\omelet.js',        // An omelet is salted with
    '.\\src\\eggs.js',          //  eggs,
    '.\\src\\onion.js',         //   onion,
    '.\\src\\oregano.js',       //    oregano,
    '.\\src\\pepperJack.js',    //     pepperJack,
    '.\\src\\swiss.js',         //    swiss,
    '.\\src\\butter.js',        //   butter,
    '.\\src\\love.js',          //  love, and
    '.\\src\\bacon.js'];        // bacon.
var directories = [             // ...and also all this other stuff you might want.
    '.\\src\\components\\',
    '.\\src\\components\\ui\\',
    '.\\src\\components\\shapes\\',
    '.\\src\\components\\sprites\\'];

var regex = new RegExp('(omelet.)(ui.|shapes.|sprites.)?[^.]*(.js)');

var ifMatchAdd = function(dir, file) {
    if (file && file.match && file.match(regex)) files.push(dir + file);
};

var checkdir = function(dir, callback) {
    fs.readdir(dir, function(err, results) {
        if (err) console.log(err);
        else results.forEach(function(f) {ifMatchAdd(dir, f); });
        callback();
    });
};

var finish = function() {
    console.log(files);
    var result = uglifyjs.minify(files);

    fs.writeFile('.\\out\\omelet.min.js', result.code, 'utf8', function (err) {
        if (err) console.log(err);
        else console.log('Minified file written.');
    });
};

var build = finish;

directories.forEach(function(dir) {
    var oldBuild = build;
    build = function() {
        checkdir(dir, oldBuild);
    };
});

build();