window.omelet.egg('omelet.ui.spriteRenderer', function(data, refs) {
    this.spriteName = data.spriteName;
    this.maintainAspect = data.maintainAspect;
    this.hitTarget = data.hitTarget;

    var lastLeft, lastTop, lastWidth, lastHeight;
    var lastSnap, lastPoly, spriteSheet;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
        spriteSheet = refs.spriteSheet['omelet.sprites.spriteSheet'];
    };

    this.preDraw = function(snapShot) {
        lastSnap = snapShot;
        var rect = snapShot.getRect();
        lastPoly = [];
        if (!spriteSheet || !spriteSheet.loaded) return lastPoly;

        var sprite = spriteSheet.sprites[this.spriteName];
        if (!sprite) return lastPoly;

        lastLeft = rect[0];
        lastTop = rect[1];
        lastWidth = rect[2];
        lastHeight = rect[3];

        if (this.maintainAspect && sprite.height > 0) {
            var aspect = sprite.width / sprite.height;
            var tempHeight = sprite.height;
            var tempWidth = sprite.width;
            if (tempWidth > lastWidth) {
                tempWidth = lastWidth;
                tempHeight = lastWidth / aspect;
            }
            if (tempHeight > lastHeight) {
                tempHeight = lastHeight;
                tempWidth = tempHeight * aspect;
            }

            if (tempWidth < lastWidth) {
                lastLeft += (lastWidth - tempWidth) / 2;
                lastWidth = tempWidth;
            } else if (tempHeight < lastHeight) {
                lastTop += (lastHeight - tempHeight) / 2;
                lastHeight = tempHeight;
            }
        }

        var right = lastLeft + lastWidth;
        var bottom = lastTop + lastHeight;
        lastPoly = [[lastLeft, lastTop], [right, lastTop], [right, bottom], [lastLeft, bottom]];

        return lastPoly;
    };

    this.draw = function() {
        var context = lastSnap.getIdentityContext();
        var sprite = spriteSheet.sprites[this.spriteName];
        context.drawImage(spriteSheet.image, sprite.x, sprite.y, sprite.width, sprite.height, lastLeft, lastTop, lastWidth, lastHeight);
        if (this.hitTarget) return lastPoly;
    };
}).defaults({
    spriteName:'Default',
    maintainAspect:false,
    hitTarget:false,
    layer:'default',
    orderInLayer:0
}).references({
    spriteSheet:'omelet.sprites.spriteSheet'
});
