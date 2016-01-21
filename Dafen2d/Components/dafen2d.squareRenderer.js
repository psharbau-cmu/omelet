(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['dafen2d.squareRenderer'] = {

        createComponent:function(data) {
            if (!data) data = {};

            var component = {
                color:data.color || '#000000',
                width:data.width || 15,
                height:data.height || 15
            };

            var halfWidth = 0;
            var halfHeight = 0;
            var lastSnap = null;
            var lastPoly = null;

            component.preDraw = function(snapShot) {
                lastSnap = snapShot;
                lastPoly = [];
                halfWidth = component.width / 2;
                halfHeight = component.height / 2;
                lastPoly.push(snapShot.transformPoint(-1 * halfWidth, -1 * halfHeight));
                lastPoly.push(snapShot.transformPoint(halfWidth, -1 * halfHeight));
                lastPoly.push(snapShot.transformPoint(halfWidth, halfHeight));
                lastPoly.push(snapShot.transformPoint(-1 * halfWidth, halfHeight));

                return lastPoly;
            };

            component.draw = function() {
                if (!lastSnap) return;

                var context = lastSnap.getContext();

                context.fillStyle = component.color;
                context.fillRect(-1 * halfWidth, -1 * halfHeight, component.width, component.height);

                return lastPoly;
            };

            return component;
        }

    };
})();