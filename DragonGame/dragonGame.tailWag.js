(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['dragonGame.tailWag'] = {

        createComponent:function(data) {

            data = data || {};

            var tipEntity = data.tip || {};
            console.log(tipEntity);
            var tipTransform = null;
            var thisTransform = null;

            var component = {};

            component.update = function(delta) {

            };

            return component;

        }
    }

})();
