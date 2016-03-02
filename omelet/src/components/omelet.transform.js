omelet.egg('omelet.transform', function(data, refs) {
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;

    this.update = function(delta) {

    };
}).defaults({
    x:0,
    y:0,
    angle:0
});
