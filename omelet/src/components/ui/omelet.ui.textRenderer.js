omelet.egg('omelet.ui.textRenderer', function(data, refs) {
    this.text = data.text;
    this.color = data.color;
    this.font = data.font;

    var lastSnap = null;
    var centerX = 0;
    var centerY = 0;
    var width = 0;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
    };

    this.preDraw = function(snapShot) {
        lastSnap = snapShot;
        var rect = snapShot.getRect();
        var left = rect[0];
        var top = rect[1];
        width = rect[2];
        var right = left + width;
        var bottom = top + rect[3];
        centerX = left + (.5 * width);
        centerY = top + (.5 * rect[3]);

        return [[left, top], [right, top], [right, bottom], [left, bottom]];
    };

    this.draw = function() {
        var context = lastSnap.getIdentityContext();

        context.font = this.font;
        context.fillStyle = this.color;
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.fillText(this.text, centerX, centerY, width);
    };
}).defaults({
    text:'New Text',
    color:'black',
    font:'30px sans-serif',
    layer:'default',
    orderInLayer:0
});