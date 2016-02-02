(function() {
    var clamp = function(value) {
        if (value > 1) return 1;
        else if (value < 0) return 0;
        else return value || 0;
    };


    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['dafen2d.rectTransform'] = {
        createComponent:function(data) {
            data = data || {};

            var component = {
                left:clamp(data.left),
                top:clamp(data.top),
                right:clamp(data.right),
                bottom:clamp(data.bottom),
                offsetLeft:data.offsetLeft || 0,
                offsetTop:data.offsetTop || 0,
                offsetRight:data.offsetRight || 0,
                offsetBottom:data.offsetBottom || 0
            };

            component.transform = function(wrapper) {
                var rect = wrapper.getRect();
                var x = (component.left * rect[2]) + component.offsetLeft;
                var y = (component.top * rect[3]) + component.offsetTop;
                var w = (component.right * rect[2]) -  component.offsetRight - x;
                var h = (component.bottom * rect[3]) - component.offsetBottom - y;
                rect = [rect[0] + x, rect[1] + y, w, h];
                wrapper.setRect(rect);
            };

            return component;
        }
    };
})();
