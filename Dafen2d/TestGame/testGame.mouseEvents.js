(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['testGame.mouseEvents'] = {

        createComponent:function(data) {
            var component = {};

            component.mouseEnter = function() {
                console.log("ENTER!");
            };

            component.mouseExit = function() {
                console.log("EXIT!");
            };

            component.mouseDown = function() {
                console.log("DOWN!");
            };

            component.mouseUp = function() {
                console.log("UP!");
            };

            return component;
        }

    };
})();
