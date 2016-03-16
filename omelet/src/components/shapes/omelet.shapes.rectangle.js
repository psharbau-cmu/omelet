omelet.egg('omelet.shapes.rectangle', function(data, refs) {
    this.fillStyle = data.fillStyle;
    this.strokeStyle = data.strokeStyle;
    this.width = data.width;
    this.height = data.height;

    var halfWidth = 0;
    var halfHeight = 0;
    var lastSnap = null;
    var lastPoly = null;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.Layers[data.layer] || 0, data.orderInLayer];
    };

    this.preDraw = function(snapShot) {
        lastSnap = snapShot;
        lastPoly = [];
        halfWidth = this.width / 2;
        halfHeight = this.height / 2;
        lastPoly.push(snapShot.transformPoint(-1 * halfWidth, -1 * halfHeight));
        lastPoly.push(snapShot.transformPoint(halfWidth, -1 * halfHeight));
        lastPoly.push(snapShot.transformPoint(halfWidth, halfHeight));
        lastPoly.push(snapShot.transformPoint(-1 * halfWidth, halfHeight));

        return lastPoly;
    };

    this.draw = function() {
        if (!lastSnap) return;

        var context = lastSnap.getContext();

        if (this.fillStyle) {
            context.fillStyle = this.fillStyle;
            context.fillRect(-1 * halfWidth, -1 * halfHeight, this.width, this.height);
        }

        if (this.strokeStyle) {
            context.strokeStyle = this.strokeStyle;
            context.strokeRect(-1 * halfWidth, -1 * halfHeight, this.width, this.height);
        }

        return lastPoly;
    };
}).defaults({
    fillStyle:null,
    strokeStyle:null,
    width: 15,
    height:15,
    layer:'default',
    orderInLayer:0
});