(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['dafen2d.ui.roundedRect'] = {

        createComponent:function(data) {
            if (!data) data = {};

            var component = {
                color:data.color || '#000000',
                cornerRadius:data.cornerRadius || 10,
                layer:data.layer || 'default'
            };

            var lastSnap = null;
            var lastPoly = null;
            var lastL, lastT, lastR, lastB, lastW, lastH;

            component.ready = function(scene, entity) {
                entity.screenSort = [scene.Layers[component.layer] || 0];
            };

            component.preDraw = function(snapShot) {
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

            component.draw = function() {
                if (!lastSnap) return;

                var radius = component.cornerRadius;
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


                context.fillStyle = component.color;
                context.fill();

                return lastPoly;
            };

            return component;
        }

    };
})();
