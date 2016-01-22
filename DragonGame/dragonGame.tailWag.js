(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['dragonGame.tailWag'] = {

        createComponent:function(data) {

            data = data || {};

            var tipEntity = data.tip || {};
            var tipTransform = null;
            var thisTransform = null;
            var startAngle = 0;
            var startTipAngle = 0;
            var t = 0;

            var component = {};

            component.ready = function(scene, entity) {
                thisTransform = entity['dafen2d.transform'] || {angle:0};
                tipTransform = tipEntity['dafen2d.transform'] || {angle:0};
                startAngle = thisTransform.angle;
                startTipAngle = tipTransform.angle;
            };

            component.update = function(delta) {
                t = (t + (2 * delta)) % (2 * Math.PI);
                thisTransform.angle = startAngle + (.3 *Math.cos(t));
                tipTransform.angle = startTipAngle + (.5 * Math.sin(t));
            };

            return component;

        }
    }

})();
