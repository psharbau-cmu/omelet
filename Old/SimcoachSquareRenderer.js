(function() {

    if (!window.componentTypes) window.componentTypes = {};
    window.componentTypes['Simcoach.SquareRenderer'] = {

        createComponent:function(entity, data) {

            if (!data) data = {};

            var component = {
                color:data.color || '#000000',
                width:data.width || 15,
                height:data.height || 15,
                clickable:data.clickable || false
            };

            component.draw = function(context) {
                context.fillStyle = component.color;
                context.fillRect(0 - (component.width / 2), 0 - (component.height / 2), component.width, component.height);

                if (!component.clickable) return;

                var points = [];
                var halfWidth = component.width / 2;
                var halfHeight = component.height / 2;
                points.push(context.transformPoint(-1*halfWidth, -1*halfHeight));
                points.push(context.transformPoint(halfWidth, -1*halfHeight));
                points.push(context.transformPoint(halfWidth, halfHeight));
                points.push(context.transformPoint(-1*halfWidth,halfHeight));

                return points;
            };

            return component;
        }

    };
})();
