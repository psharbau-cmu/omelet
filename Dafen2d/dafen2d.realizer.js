(function() {
    window.dafen2d = window.dafen2d || {};

    var initialize = function(entity) {
        // get list of non-children properties
        var props = [];
        for(var p in entity) if (dafen2d.componentTypes[p]) props.push(p);

        // replace stubs with created components
        props.forEach(function(prop) {
            entity[prop] = dafen2d.componentTypes[prop].createComponent(entity, entity[prop].data);
        });

        // recurse through children
        if (entity.children) entity.children.forEach(initialize);
    };

    window.dafen2d.realize = function(raw) {
        initialize(raw);
    };
})();