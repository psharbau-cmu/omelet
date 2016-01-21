(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['testGame.shootAcross'] = {

        createComponent:function(data) {
            var transform = null;
            var position = -500;

            var component = {};

            component.ready = function(scene, entity) {
                transform = entity['dafen2d.transform'] || {x:0, y:0};
            };

            component.update = function(delta) {
                position += delta * 250;
                if (position > 500) position = -500;
                transform.x = position;
            };

            return component;
        }

    };
})();
