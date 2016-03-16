omelet.egg('omelet.ui.pillRectangle', function(data, refs) {
    this.fillStyle = data.fillStyle;
    this.strokeStyle = data.strokeStyle;

    var lastSnap = null;
    var lastPoly = null;
    var lastL, lastT, lastR, lastB, lastW, lastH, lastRadius;

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
            lastPoly = [[centerX, lastT], [centerX + lastRadius, centerY], [centerX, lastB], [centerX - lastRadius, centerY]];
        } else {
            lastL = rect[0] + lastH;
            lastR = lastL + lastW;
            lastPoly = [[lastL, lastT], [lastR, lastT], [lastR + lastRadius, centerY], [lastR, lastB], [lastL, lastB], [lastL - lastRadius, centerY]];
        }

        return lastPoly;
    };

    this.draw = function() {
        if (!lastSnap) return;

        var context = lastSnap.getIdentityContext();

        context.beginPath();
        context.moveTo(lastL, lastT);
        context.lineTo(lastR, lastT);
        context.arcTo(lastR + lastRadius, lastT, lastR + lastRadius, lastT + lastRadius, lastRadius);
        context.arcTo(lastR + lastRadius, lastB, lastR, lastB, lastRadius);
        context.lineTo(lastL, lastB);
        context.arcTo(lastL - lastRadius, lastB, lastL - lastRadius, lastT + lastRadius, lastRadius);
        context.arcTo(lastL - lastRadius, lastT, lastL, lastT, lastRadius);
        context.closePath();

        if (this.fillStyle) {
            context.fillStyle = this.fillStyle;
            context.fill();
        }
        if (this.strokeStyle) {
            context.strokeStyle = this.strokeStyle;
            context.stroke();
        }

        return lastPoly;
    };
}).defaults({
    fillStyle:null,
    strokeStyle:null,
    layer:'default',
    orderInLayer:0
});
