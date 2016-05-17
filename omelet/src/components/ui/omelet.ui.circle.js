window.omelet.egg('omelet.ui.circle', function(data, refs) {
    this.fillStyle = data.fillStyle;
    this.strokeColor = data.strokeColor;
    this.strokeWidth = data.strokeWidth;
    this.hitTarget = data.hitTarget;
    this.shadowDistance = data.shadowDistance;
    this.shadowColor = data.shadowColor;
    this.globalCompositeOperation = data.globalCompositeOperation;

    var lastSnap = null;
    var lastPoly = null;
    var centerX, centerY, lastRadius;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
    };

    this.preDraw = function(snapShot) {
        lastSnap = snapShot;
        var rect = snapShot.getRect();

        var left = rect[0];
        var top = rect[1];
        var width = rect[2];
        var height = rect[3];

        var diameter = width < height ? width : height;

        if (diameter < width) {
            left += (width - diameter) / 2;
        } else if (diameter < height) {
            top += (height - diameter) / 2;
        }

        lastRadius = diameter / 2;
        centerX  = left + lastRadius;
        centerY = top + lastRadius;

        lastPoly = [];
        for (var a = 0; a < 2 * Math.PI; a += Math.PI / 5) {
            lastPoly.push(snapShot.transformPoint(centerX + (lastRadius * Math.cos(a)), centerY + (lastRadius * Math.sin(a))));
        }

        return lastPoly;
    };

    this.draw = function(shadowDraw) {
        if (!lastSnap) return;

        if (!shadowDraw && this.shadowDistance != 0) this.draw(true);

        var context = lastSnap.getContext();
        if (this.globalCompositionOperation) context.globalCompositeOperation = this.globalCompositeOperation;

        var x = shadowDraw ? centerX + this.shadowDistance : centerX;
        var y = shadowDraw ? centerY + this.shadowDistance : centerY;

        context.beginPath();
        context.arc(x, y, lastRadius, 0, 2 * Math.PI);
        context.closePath();

        var fill = shadowDraw ? this.shadowColor : this.fillStyle;

        if (fill) {
            context.fillStyle = fill;
            context.fill();
        }
        if (!shadowDraw && this.strokeColor) {
            context.lineWidth = this.strokeWidth;
            context.strokeStyle = this.strokeColor;
            context.stroke();
        }

        if (this.globalCompositionOperation) context.globalCompositeOperation = 'source-over';
        if (this.hitTarget) return lastPoly;
    };
}).defaults({
    fillStyle:null,
    strokeColor:null,
    strokeWidth:1,
    layer:'default',
    orderInLayer:0,
    hitTarget:false,
    shadowDistance:0,
    shadowColor:"rgba(0, 0, 0, .3)",
    globalCompositeOperation:null
}).describe({
    fillStyle:{
        oneOf:[
            { type:'string'},
            { type:'object', properties:{'top':{type:'string', 'bottom':{type:'string'}}}, required:['top', 'bottom']},
            { type:'object', properties:{'left':{type:'string', 'right':{type:'string'}}}, required:['left', 'right']}
        ]
    },
    strokeColor:{type:'string'},
    strokeWidth:{type:'number'},
    layer:{type:'string'},
    orderInLayer:{type:'integer'},
    shadowDistance:{type:'number'},
    shadowColor:{type:'string'},
    hitTarget:{type:'boolean'},
    globalCompositeOperation:{type:'string'}
});
