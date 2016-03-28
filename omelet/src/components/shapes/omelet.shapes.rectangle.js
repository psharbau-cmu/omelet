window.omelet.egg('omelet.shapes.rectangle', function(data, refs) {
    this.fillColor = data.fillColor;
    this.strokeColor = data.strokeColor;
    this.strokeWidth = data.strokeWidth;
    this.width = data.width;
    this.height = data.height;
    this.globalCompositeOperation = data.globalCompositeOperation;

    var halfWidth = 0;
    var halfHeight = 0;
    var lastSnap = null;
    var lastPoly = null;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
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
        if (this.globalCompositeOperation) context.globalCompositeOperation = this.globalCompositeOperation;

        if (this.fillColor) {
            context.fillStyle = this.fillColor;
            context.fillRect(-1 * halfWidth, -1 * halfHeight, this.width, this.height);
        }

        if (this.strokeColor) {
            context.strokeColor = this.strokeColor;
            context.lineWidth = this.strokeWidth;
            context.strokeRect(-1 * halfWidth, -1 * halfHeight, this.width, this.height);
        }

        if (this.globalCompositeOperation) context.globalCompositeOperation = 'source-over';

        return lastPoly;
    };
}).defaults({
    fillColor:null,
    strokeColor:null,
    strokeWidth:1,
    width: 15,
    height:15,
    layer:'default',
    orderInLayer:0,
    globalCompositionOperation:null
}).describe({
    fillColor:{type:'string'},
    strokeColor:{type:'string'},
    strokeWidth:{type:'number'},
    width:{type:'number'},
    height:{type:'number'},
    globalCompositionOperation:{enum:['source-over', 'source-atop', 'source-in', 'source-out', 'destination-over', 'destination-atop', 'destination-in', 'destination-out', 'lighter', 'copy', 'xor']},
    layer:{type:'string'},
    orderInLayer:{type:'integer'}
});