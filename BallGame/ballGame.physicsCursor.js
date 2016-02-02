(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['ballGame.physicsCursor'] = {

        createComponent:function(data) {
            var component = {};
            var thisScene = null;
            var transform = null;

            component.ready = function(scene, entity) {
                thisScene = scene;
                transform = entity['dafen2d.transform'];
            };

            var velocity = [0, 0];

            component.update = function(deltaTime) {
                var globalPosition = transform.getGlobalPosition();

                // dampen
                velocity[0] *= (1 - (4 * deltaTime));
                velocity[1] *= (1 - (4 * deltaTime));

                // accelerate
                if (thisScene.MouseDown) {
                    var toMouseX = thisScene.MousePosition[0] - globalPosition[0];
                    var toMouseY = thisScene.MousePosition[1] - globalPosition[1];
                    velocity[0] += 8 * deltaTime * toMouseX;
                    velocity[1] += 8 * deltaTime * toMouseY;
                }

                // move
                var newX = globalPosition[0] + (3 * deltaTime * velocity[0]);
                var newY = globalPosition[1] + (3 * deltaTime * velocity[1]);
                transform.setGlobalPosition(newX, newY);
            };

            return component;
        }
    };
})();
