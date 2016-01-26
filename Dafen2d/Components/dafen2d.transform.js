(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['dafen2d.transform'] = {

        createComponent:function(data) {
            if (!data) data = {};

            var component = {
                x:data.x || 0,
                y:data.y || 0,
                angle:data.angle || 0,
                snapShot:null
            };

            component.transform = function(wrapper) {
                wrapper.translate(component.x, component.y);
                wrapper.rotate(component.angle);
                component.snapShot = wrapper.getSnapshot();
                return component.snapShot;
            };

            component.getGlobalPosition = function() {
                if (component.snapShot) return component.snapShot.transformPoint(0, 0);
                else return [0, 0];
            };

            component.setGlobalPosition = function(x, y) {
                var point = component.snapShot ? component.snapShot.inverseTransformInParentSpace(x, y) : [x, y];
                component.x = point[0];
                component.y = point[1];
            };

            return component;
        }

    };
})();