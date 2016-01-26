(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['ballGame.followCursor'] = {

        createComponent:function(data) {
            var component = {};
            var thisScene = null;
            var transform = null;

            component.ready = function(scene, entity) {
                thisScene = scene;
                transform = entity['dafen2d.transform'];
            };

            component.update = function(deltaTime) {
                transform.setGlobalPosition(thisScene.MousePosition[0], thisScene.MousePosition[1]);
                console.log(thisScene.MousePosition + '\t\t' + transform.getGlobalPosition());
                return;

                var globalPosition = transform.getGlobalPosition();

                var toMouseX = thisScene.MousePosition[0] - globalPosition[0];
                var toMouseY = thisScene.MousePosition[1] - globalPosition[1];

                var magnitude = Math.sqrt(Math.pow(toMouseX, 2) + Math.pow(toMouseY, 2));
                if (magnitude < 1) {
                    return;
                } else if (magnitude < 5) {
                    console.log('Tada!');
                    transform.setGlobalPosition(thisScene.MousePosition[0], thisScene.MousePosition[1]);
                } else {
                    var newX = globalPosition[0] + (3 * toMouseX * deltaTime);
                    var newY = globalPosition[1] + (3 * toMouseY * deltaTime);
                    transform.setGlobalPosition(newX, newY);
                }
            };

            return component;
        }
    };
})();
