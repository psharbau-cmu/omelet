omelet.egg('omelet.ui.circle', function(data, refs) {
    this.fillStyle = data.fillStyle;
    this.strokeStyle = data.strokeStyle;
    this.strokeWidth = data.strokeWidth;
    this.hitTarget = data.hitTarget;

    var lastSnap = null;
    var lastPoly = null;
    var centerX, centerY, lastRadius;
    var gradientCache = null;

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

    this.draw = function() {
        if (!lastSnap) return;

        var context = lastSnap.getIdentityContext();

        context.beginPath();
        context.arc(centerX, centerY, lastRadius, 0, 2 * Math.PI);
        context.closePath();

        if (this.fillStyle) {
            if (this.fillStyle.constructor === String) {
                context.fillStyle = this.fillStyle;
            } else if (!gradientCache ||
                    gradientCache.startPoint != lastT ||
                    gradientCache.endPoint != lastB ||
                    gradientCache.topColor != this.fillStyle.top ||
                    gradientCache.bottomColor != this.fillStyle.bottom){
                var gradient = context.createLinearGradient(0, lastT, 0, lastB);
                gradient.addColorStop(0, this.fillStyle.top);
                gradient.addColorStop(1, this.fillStyle.bottom);

                gradientCache = {
                    gradient:gradient,
                    startPoint:lastT,
                    endPoint:lastB,
                    topColor:this.fillStyle.top,
                    bottomColor:this.fillStyle.bottom
                };

                context.fillStyle = gradient;
            } else {
                context.fillStyle = gradientCache.gradient;
            }

            context.fill();
        }
        if (this.strokeStyle) {
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
    hitTarget:true
});
