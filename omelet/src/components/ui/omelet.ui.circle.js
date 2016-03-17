omelet.egg('omelet.ui.circle', function(data, refs) {
    this.fillStyle = data.fillStyle;
    this.strokeStyle = data.strokeStyle;
    this.strokeWidth = data.strokeWidth;
    this.hitTarget = data.hitTarget;
    this.shadowDistance = data.shadowDistance;
    this.shadowColor = data.shadowColor;

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
            lastPoly.push([centerX + (lastRadius * Math.cos(a)), centerY + (lastRadius * Math.sin(a))]);
        }

        return lastPoly;
    };

    this.draw = function(shadowDraw) {
        if (!lastSnap) return;

        if (!shadowDraw && this.shadowDistance != 0) this.draw(true);

        var context = lastSnap.getIdentityContext();

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
        if (!shadowDraw && this.strokeStyle) {
            context.lineWidth = this.strokeWidth;
            context.strokeStyle = this.strokeStyle;
            context.stroke();
        }

        if (this.hitTarget) return lastPoly;
    };
}).defaults({
    fillStyle:null,
    strokeStyle:null,
    strokeWidth:1,
    layer:'default',
    orderInLayer:0,
    hitTarget:true,
    shadowDistance:0,
    shadowColor:"rgba(0, 0, 0, .3)"
});