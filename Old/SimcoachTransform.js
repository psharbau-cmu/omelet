(function() {

    if (!window.componentTypes) window.componentTypes = {};
    window.componentTypes['Simcoach.Transform'] = {

        createComponent:function(entity, data) {

            if (!data) data = {};

            var component = {
                x:data.x || 0,
                y:data.y || 0,
                angle:data.angle || 0
            };

            component.preDraw = function(context) {
                context.translate(component.x, component.y);
                context.rotate(component.angle);
            };

            return component;
        }

    };
})();