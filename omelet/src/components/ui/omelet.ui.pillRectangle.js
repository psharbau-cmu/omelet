omelet.egg('omelet.ui.pillRectangle', function(data, refs) {
    this.fillStyle = data.fillStyle;
    this.strokeStyle = data.strokeStyle;
    this.strokeWidth = data.strokeWidth;
    this.hitTarget = data.hitTarget;
    this.shadowDistance = data.shadowDistance;
    this.shadowColor = data.shadowColor;

    var lastSnap = null;
    var lastPoly = null;
    var lastL, lastT, lastR, lastB, lastW, lastH, lastRadius;
    var gradientCache = null;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
    };

    this.preDraw = function(snapShot) {
        lastSnap = snapShot;
        var rect = snapShot.getRect();
        lastT = rect[1]; // top
        lastH = rect[3]; // height
        lastB = lastT + lastH; // bottom

        lastRadius = .5 * lastH; // radius of circles on end
        var centerY = lastT + lastRadius;

        lastW = rect[2]; // width
        lastW = lastW - lastH; // cut out the corners

        if (lastW < 0) {
            lastW = 0;
            var centerX = rect[0] + (.5 * rect[2]);
            lastL = centerX;
            lastR = centerX;
        } else {
            lastL = rect[0] + lastRadius;
            lastR = lastL + lastW;
        }

        lastPoly = [];
        for (var a = Math.PI / 2; a >= Math.PI / -2; a -= Math.PI / 5) {
            lastPoly.push([lastR + (lastRadius * Math.cos(a)), centerY - (lastRadius * Math.sin(a))]);
        }
        for (var a = Math.PI / -2; a >= -3 * Math.PI / 2; a -= Math.PI / 5) {
            lastPoly.push([lastL + (lastRadius * Math.cos(a)), centerY - (lastRadius * Math.sin(a))]);
        }

        return lastPoly;
    };

    this.draw = function(shadowDraw) {
        if (!lastSnap) return;

        if (!shadowDraw && this.shadowDistance != 0) this.draw(true);

        var context = lastSnap.getIdentityContext();
        if (shadowDraw) context.translate(this.shadowDistance, this.shadowDistance);

        context.beginPath();
        context.moveTo(lastL, lastT);
        context.lineTo(lastR, lastT);
        context.arcTo(lastR + lastRadius, lastT, lastR + lastRadius, lastT + lastRadius, lastRadius);
        context.arcTo(lastR + lastRadius, lastB, lastR, lastB, lastRadius);
        context.lineTo(lastL, lastB);
        context.arcTo(lastL - lastRadius, lastB, lastL - lastRadius, lastT + lastRadius, lastRadius);
        context.arcTo(lastL - lastRadius, lastT, lastL, lastT, lastRadius);
        context.closePath();

        if (shadowDraw) {
            context.fillStyle = this.shadowColor;
            context.fill();
        } else if (this.fillStyle) {
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
    hitTarget:false,
    shadowDistance:0,
    shadowColor:"rgba(0, 0, 0, .3)"
});
