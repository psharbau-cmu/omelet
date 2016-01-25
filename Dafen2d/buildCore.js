var fs = require('fs');
var uglifyjs = require('uglify-js');

(function() {
    var files = [];
    var regex = new RegExp('(dafen2d.)[^.]*(.js)');

    var ifMatchAdd = function(dir, file) {
        if (file && file.match && file.match(regex)) files.push(dir + file);
    };

    var checkdir = function(dir, call) {
        fs.readdir(dir, function(err, results) {
            if (err) console.log(err);
            else results.forEach(function(f) {ifMatchAdd(dir, f); });
            call();
        });
    };

    var directories = ['.\\', '.\\Assets\\', '.\\Components\\'];

    var buildList = function() {
        console.log(files);
        var result = uglifyjs.minify(files);
        fs.writeFile('.\\Out\\dafen2d.min.js', result.code, 'utf8', function(err) {
            if (err) console.log(err);
        });
    };

    var appendBuildList = function(dir) {
        var oldBuildList = buildList;
        buildList = function() { checkdir(dir, oldBuildList); };
    };

    while (directories.length > 0) {
       appendBuildList(directories.pop());
    }

    buildList();

})();