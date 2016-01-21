(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['dafen2d.transform'] = {

        createComponent:function(data) {
            if (!data) data = {};

            var component = {
                x:data.x || 0,
                y:data.y || 0,
                angle:data.angle || 0
            };

            component.transform = function(wrapper) {
                wrapper.translate(component.x, component.y);
                wrapper.rotate(component.angle);
            };

            return component;
        }

    };
})();