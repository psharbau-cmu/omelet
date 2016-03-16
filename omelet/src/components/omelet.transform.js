omelet.egg('omelet.transform', function(data, refs) {
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;

    var snapShot = null;

    this.transform = function(wrapper) {
        wrapper.translate(this.x, this.y);
        wrapper.rotate(this.angle);
        snapShot = wrapper.getSnapshot();
        return snapShot;
    };

    this.getPosition = function() {
        if (snapShot) return snapShot.transformPoint(0, 0);
        else return [0, 0];
    };

    this.setPosition = function(x, y) {
        var point = snapShot ? snapShot.inverseTransformInParentSpace(x, y) : [x, y];
        this.x = point[0];
        this.y = point[1];
    };

}).defaults({
    x:0,
    y:0,
    angle:0
});
