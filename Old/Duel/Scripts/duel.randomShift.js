(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];
    window.dafen2d.componentTypes['duel.randomShift'] = {
        properties:{
            'distance':'number',
            'period':'number'
        },

        references:{},

        requiredComponents:['dafen2d.transform'],

        requiredGlobals:[],

        createComponent:function(data) {
            data = data || {};

            var component = {
                distance : data.distance || 10,
                period : data.period || 4
            };

            var startX;
            var transform;
            var t;

            component.ready = function(scene, entity) {
                transform = entity['dafen2d.transform'];
                startX = transform.x;
                t = Math.random() * Math.PI * 2;
            };

            component.update = function(delta) {
                t = (t + (delta / component.period)) % (2 * Math.PI);
                transform.x = startX + (component.distance * Math.sin(t));
            };

            return component;
        }
    };
})();