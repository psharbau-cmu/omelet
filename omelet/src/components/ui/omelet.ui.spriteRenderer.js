window.omelet.egg('omelet.ui.spriteRenderer', function(data, refs) {
    this.spriteName = data.spriteName;
    this.maintainAspect = data.maintainAspect;
    this.alignment = data.alignment;
    this.hitTarget = data.hitTarget;
    this.globalCompositeOperation = data.globalCompositeOperation;

    var lastLeft, lastTop, lastWidth, lastHeight;
    var lastSnap, lastPoly, spriteSheet;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
        spriteSheet = refs.spriteSheet;
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

            switch (this.alignment) {
                case 'top-left':
                    break;
                case 'top':
                    lastLeft += (lastWidth - tempWidth) / 2;
                    break;
                case 'top-right':
                    lastLeft += (lastWidth - tempWidth);
                    break;
                case 'left':
                    lastTop += (lastHeight - tempHeight) / 2;
                    break;
                case 'center':
                    lastLeft += (lastWidth - tempWidth) / 2;
                    lastTop += (lastHeight - tempHeight) / 2;
                    break;
                case 'right':
                    lastLeft += (lastWidth - tempWidth);
                    lastTop += (lastHeight - tempHeight) / 2;
                    break;
                case 'bottom-left':
                    lastTop += (lastHeight - tempHeight);
                    break;
                case 'bottom':
                    lastLeft += (lastWidth - tempWidth) / 2;
                    lastTop += (lastHeight - tempHeight);
                case 'bottom-right':
                    lastLeft += (lastWidth - tempWidth);
                    lastTop += (lastHeight - tempHeight);
                    break;
            }

            lastWidth = tempWidth;
            lastHeight = tempHeight;
        }

        var right = lastLeft + lastWidth;
        var bottom = lastTop + lastHeight;
        lastPoly = [snapShot.transformPoint(lastLeft, lastTop), snapShot.transformPoint(right, lastTop),
            snapShot.transformPoint(right, bottom), snapShot.transformPoint(lastLeft, bottom)];

        return lastPoly;
    };

    this.draw = function() {
        var context = lastSnap.getContext();
        if (this.globalCompositionOperation) context.globalCompositeOperation = this.globalCompositeOperation;

        var sprite = spriteSheet.sprites[this.spriteName];
        context.drawImage(spriteSheet.image, sprite.x, sprite.y, sprite.width, sprite.height, lastLeft, lastTop, lastWidth, lastHeight);
        if (this.hitTarget) return lastPoly;

        if (this.globalCompositionOperation) context.globalCompositeOperation = 'source-over';
    };
}).defaults({
    spriteName:'Default',
    maintainAspect:false,
    alignment:'center',
    hitTarget:false,
    layer:'default',
    orderInLayer:0,
    globalCompositionOperation:null
}).references({
    spriteSheet:'omelet.sprites.spriteSheet'
}).describe({
    spriteName:{type:'string'},
    maintainAspect:{type:'boolean'},
    alignment:{enum:['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']},
    layer:{type:'string'},
    orderInLayer:{type:'integer'},
    hitTarget:{type:'boolean'},
    globalCompositionOperation:{type:'string'}
});
