(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['dafen2d.spriteRenderer'] = {

        createComponent:function(data) {
            if (!data) data = {};

            var component = {
                layer:data.layer || 'default',
                orderInLayer:data.orderInLayer || 0,
                sheetName:data.sheetName || '',
                spriteName:data.spriteName
            };

            var lastSnap = null;
            var lastPoly = null;
            var assets = null;

            component.ready = function(scene, entity) {
                entity.screenSort = [scene.Layers[component.layer] || 0, component.orderInLayer];
                assets = scene.Assets;
            };

            component.preDraw = function(snapShot) {
                lastSnap = snapShot;
                lastPoly = [];

                var sheet = assets[component.sheetName];
                if (!sheet) return lastPoly;
                var sprite = sheet.sprites[component.spriteName];
                if (!sprite) return lastPoly;

                lastPoly.push(snapShot.transformPoint(-1 * sprite.pivotX, -1 * sprite.pivotY));
                lastPoly.push(snapShot.transformPoint(sprite.width - sprite.pivotX, -1 * sprite.pivotY));
                lastPoly.push(snapShot.transformPoint(sprite.width - sprite.pivotX, sprite.height - sprite.pivotY));
                lastPoly.push(snapShot.transformPoint(-1 * sprite.pivotX, sprite.height - sprite.pivotY));

                return lastPoly;
            };

            component.draw = function() {
                if (!lastSnap) return;

                var context = lastSnap.getContext();

                var sheet = assets[component.sheetName];
                if (!sheet) return;
                var sprite = sheet.sprites[component.spriteName];
                if (!sprite) return;

                context.drawImage(sheet.image, sprite.x, sprite.y, sprite.width, sprite.height, -1 * sprite.pivotX, -1 * sprite.pivotY, sprite.width, sprite.height);
                return lastPoly;
            };

            return component;
        }

    };
})();
