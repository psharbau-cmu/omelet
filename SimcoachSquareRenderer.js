(function() {

    if (!window.componentTypes) window.componentTypes = {};
    window.componentTypes['Simcoach.SquareRenderer'] = {

        createComponent:function(entity, data) {

            if (!data) data = {};

            var component = {
                color:data.color || '#000000',
                width:data.width || 15,
                height:data.height || 15
            };

            component.draw = function(context) {
                context.fillStyle = component.color;
                context.fillRect(0 - (component.width / 2), 0 - (component.height / 2), component.width, component.height);
            };

            return component;
        }

    };
})();
