omelet.egg('omelet.sprites.spriteRenderer', function(data, refs) {
    this.spriteName = data.spriteName;

    var lastSnap = null;
    var lastPoly = null;
    var spriteSheet = refs.spriteSheet;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.Layers[data.layer], data.orderInLayer];
    };

    this.preDraw = function(snapShot) {
        lastSnap = snapShot;
        lastPoly = [];
        if (!spriteSheet.loaded) return lastPoly;

        var sprite = spriteSheet.sprites[this.spriteName];
        if (!sprite) return lastPoly;

        lastPoly.push(snapShot.transformPoint(-1 * sprite.pivotX, -1 * sprite.pivotY));
        lastPoly.push(snapShot.transformPoint(sprite.width - sprite.pivotX, -1 * sprite.pivotY));
        lastPoly.push(snapShot.transformPoint(sprite.width - sprite.pivotX, sprite.height - sprite.pivotY));
        lastPoly.push(snapShot.transformPoint(-1 * sprite.pivotX, sprite.height - sprite.pivotY));

        return lastPoly;
    };

    this.draw = function() {
        if (!lastSnap || !spriteSheet.loaded) return;

        var context = lastSnap.getContext();

        var sprite = spriteSheet.sprites[this.spriteName];
        if (!sprite) return;

        context.drawImage(spriteSheet.image, sprite.x, sprite.y, sprite.width, sprite.height, -1 * sprite.pivotX, -1 * sprite.pivotY, sprite.width, sprite.height);
        return lastPoly;
    };
}).defaults({
    spriteName:'Default',
    layer:'default',
    orderInLayer:0
}).references({
    spriteSheet:'omelet.sprites.spriteSheet'
});