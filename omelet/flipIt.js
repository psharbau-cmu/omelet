var fs = require('fs');
var uglifyjs = require('uglify-js');

var files = [
    '.\\src\\omelet.js',
    '.\\src\\eggs.js',
    '.\\src\\onion.js',
    '.\\src\\oregano.js',
    '.\\src\\pepperJack.js',
    '.\\src\\swiss.js',
    '.\\src\\butter.js',
    '.\\src\\bacon.js'];

var directories = ['.\\src\\components\\'];

var regex = new RegExp('(omelet.)(ui.)?[^.]*(.js)');

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

var buildProcess = finish;

directories.forEach(function(dir) {
    var oldBuild = buildProcess;
    buildProcess = function() {
        checkdir(dir, oldBuild);
    };
});

buildProcess();
