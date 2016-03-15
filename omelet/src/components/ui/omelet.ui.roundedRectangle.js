omelet.egg('omelet.ui.roundedRectangle', function(data, refs) {
    this.fillStyle = data.fillStyle;
    this.strokeStyle = data.strokeStyle;
    this.cornerRadius = data.cornerRadius;

    var lastSnap = null;
    var lastPoly = null;
    var lastL, lastT, lastR, lastB, lastW, lastH;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer], data.orderInLayer];
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

    this.draw = function() {
        if (!lastSnap) return;

        var radius = this.cornerRadius;
        if (radius > .5 * lastW) radius = .5 * lastW;
        if (radius > .5 * lastH) radius = .5 * lastH;

        var context = lastSnap.getIdentityContext();

        context.beginPath();
        context.moveTo(lastL + radius, lastT);
        context.lineTo(lastR - radius, lastT);
        context.quadraticCurveTo(lastR, lastT, lastR, lastT + radius);
        context.lineTo(lastR, lastB - radius);
        context.quadraticCurveTo(lastR, lastB, lastR - radius, lastB);
        context.lineTo(lastL + radius, lastB);
        context.quadraticCurveTo(lastL, lastB, lastL, lastB - radius);
        context.lineTo(lastL, lastT + radius);
        context.quadraticCurveTo(lastL, lastT, lastL + radius, lastT);
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
    cornerRadius:10,
    layer:'default',
    orderInLayer:0
});
