(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['dragonGame.spriteSwap'] = {

        createComponent:function(data) {

            data = data || {};

            var component = {
                hover:data.hover || '',
                normal:data.normal || ''
            };

            var spriteRenderer;

            component.ready = function(scene, entity) {
                spriteRenderer = entity['dafen2d.spriteRenderer'] || {spriteName:''};
            };

            component.mouseEnter = function() {
                spriteRenderer.spriteName = component.hover;
            };

            component.mouseExit = function() {
                spriteRenderer.spriteName = component.normal;
            };

            return component;
        }
    }

})();
