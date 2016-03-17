omelet.egg('omelet.ui.rectangle', function(data, refs) {
    this.fillStyle = data.fillStyle;
    this.strokeStyle = data.strokeStyle;
    this.strokeWidth = data.strokeWidth;
    this.cornerRadius = data.cornerRadius;
    this.hitTarget = data.hitTarget;
    this.shadowDistance = data.shadowDistance;
    this.shadowColor = data.shadowColor;

    var lastSnap = null;
    var lastPoly = null;
    var lastL, lastT, lastR, lastB, lastW, lastH;
    var gradientCache;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
    };

    this.preDraw = function(snapShot) {
        lastSnap = snapShot;
        var rect = snapShot.getRect();
        lastL = rect[0]; // left
        lastT = rect[1]; // top
        lastW = rect[2]; // width
        lastH = rect[3]; // height
        lastR = lastL + lastW; // right
        lastB = lastT + lastH; // bottom
        lastPoly = [[lastL, lastT], [lastR, lastT], [lastR, lastB], [lastL, lastB]];
        return lastPoly;
    };

    this.draw = function(shadowDraw) {
        if (!lastSnap) return;

        if (!shadowDraw && this.shadowDistance != 0) this.draw(true);

        var context = lastSnap.getIdentityContext();
        if (shadowDraw) context.translate(this.shadowDistance, this.shadowDistance);

        context.beginPath();
        context.moveTo(lastL, lastT);
        context.lineTo(lastR , lastT);
        context.lineTo(lastR, lastB);
        context.lineTo(lastL, lastB);
        context.lineTo(lastL, lastT);
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
    hitTarget:true,
    shadowDistance:0,
    shadowColor:"rgba(0, 0, 0, .3)"
});