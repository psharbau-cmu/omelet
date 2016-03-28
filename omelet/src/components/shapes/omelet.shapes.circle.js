window.omelet.egg('omelet.shapes.circle', function(data, refs) {
    this.fillColor = data.fillColor;
    this.strokeColor = data.strokeColor;
    this.strokeWidth = data.strokeWidth;
    this.radius = data.radius;
    this.globalCompositeOperation = data.globalCompositeOperation;
    
    var lastSnap = null;
    var lastPoly = null;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
    };

    this.preDraw = function(snapShot) {
        lastSnap = snapShot;
        lastPoly = [];

        for (var a = 0; a < 2 * Math.PI; a += Math.PI / 5) {
            lastPoly.push(snapShot.transformPoint(this.radius * Math.cos(a), this.radius * Math.sin(a)));
        }

        return lastPoly;
    };

    this.draw = function() {
        if (!lastSnap) return;

        var context = lastSnap.getContext();
        if (this.globalCompositeOperation) context.globalCompositeOperation = this.globalCompositeOperation;

        context.beginPath();
        context.arc(0, 0, this.radius, 0, 2 * Math.PI);

        if (this.fillColor) {
            context.fillStyle = this.fillColor;
            context.fill();
        }

        if (this.strokeColor) {
            context.strokeColor = this.strokeColor;
            context.lineWidth = this.strokeWidth;
            context.stroke();
        }

        if (this.globalCompositeOperation) context.globalCompositeOperation = 'source-over';

        return lastPoly;
    };
}).defaults({
    fillColor:null,
    strokeColor:null,
    strokeWidth:1,
    radius: 15,
    layer:'default',
    orderInLayer:0,
    globalCompositionOperation:null
}).describe({
    fillColor:{type:'string'},
    strokeColor:{type:'string'},
    strokeWidth:{type:'number'},
    radius:{type:'number'},
    globalCompositionOperation:{enum:['source-over', 'source-atop', 'source-in', 'source-out', 'destination-over', 'destination-atop', 'destination-in', 'destination-out', 'lighter', 'copy', 'xor']},
    layer:{type:'string'},
    orderInLayer:{type:'integer'}
});