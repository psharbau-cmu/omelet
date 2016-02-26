(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['ballGame.hover'] = {

        createComponent:function(data) {
            data = data || {};

            var component = {
                normalColor: data.normalColor || '#999999',
                hoverColor: data.hoverColor || '#ffffff'
            };

            var roundedRect = null;

            component.ready = function(scene, entity) {
                roundedRect = entity['dafen2d.ui.roundedRect'];
            };

            component.mouseEnter = function() {
                roundedRect.color = component.hoverColor;
            };

            component.mouseExit = function() {
                roundedRect.color = component.normalColor;
            };

            return component;
        }
    };
})();