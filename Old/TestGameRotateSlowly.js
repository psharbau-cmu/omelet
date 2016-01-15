(function() {

    if (!window.componentTypes) window.componentTypes = {};
    window.componentTypes['TestGame.RotateSlowly'] = {

        createComponent:function(entity, data) {

            if (!data) data = {};

            var component = {
                speed:data.speed ||.5
            };

            var myTransform = null;

            component.ready = function() {
                myTransform = entity['Simcoach.Transform'];
            };

            component.update = function(deltaTime) {
                myTransform.angle = (myTransform.angle + (component.speed * 2 * deltaTime * Math.PI)) % (2 * Math.PI);
            };

            return component;
        }
    };
})();
