(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['testGame.rotateSlowly'] = {

        createComponent:function(data) {
            if (!data) data = {};

            var component = {
                speed:data.speed || 1
            };

            var transform = null;

            component.ready = function(scene, entity) {
                transform = entity['dafen2d.transform'] || {angle:0};
            };

            component.update = function(delta) {
                transform.angle += component.speed * delta * Math.PI * 2;
            };

            return component;
        }

    };
})();
