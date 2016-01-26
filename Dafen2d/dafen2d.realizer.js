(function() {
    var findComponents = function(entity) {
        var props = [];
        for(var p in entity) if (dafen2d.componentTypes[p]) props.push(p);
        entity.components = props;
        if (entity.children) entity.children.forEach(findComponents);
    };


    var initialize = function(entity) {
        // replace stubs with created components
        entity.components.forEach(function(prop) {
            entity[prop] = dafen2d.componentTypes[prop].createComponent(entity[prop].data);
        });

        // recurse through children
        if (entity.children) entity.children.forEach(initialize);
    };

    var addEntityMethods = function(entity) {
        var enter = [];
        var exit = [];
        var down = [];
        var up = [];

        entity.components.forEach(function(prop) {
            var component = entity[prop];
            if (!component) return;

            if (component.transform) entity.transform = component.transform;
            if (component.preDraw && component.draw) {
                entity.preDraw = component.preDraw;
                entity.draw = component.draw;
            }
            if (component.mouseEnter) enter.push(component.mouseEnter);
            if (component.mouseExit) exit.push(component.mouseExit);
            if (component.mouseDown) down.push(component.mouseDown);
            if (component.mouseUp) up.push(component.mouseUp);
        });

        if (enter.length > 0) entity.mouseEnter = function() {enter.forEach(function(f) { f(); }); };
        if (exit.length > 0) entity.mouseExit = function() { exit.forEach(function(f) { f(); }); };
        if (down.length > 0) entity.mouseDown = function() { down.forEach(function(f) { f(); }); };
        if (up.length > 0) entity.mouseUp = function() { up.forEach(function(f) { f(); }); };

        if (entity.children) entity.children.forEach(addEntityMethods);
    };

    window.dafen2d = window.dafen2d || {};
    window.dafen2d.assetTypes = window.dafen2d.assetTypes || [];
    window.dafen2d.componentTypes = window.dafen2d.componentTypes || [];

    window.dafen2d.realizeScene = function(scene) {
        scene = scene || {};

        scene.Camera = scene.Camera || {
                x:0,
                y:0,
                angle:0,
                zoom:1
            };

        scene.MousePosition = [0, 0];
        scene.MouseDown = false;

        scene.Layers = scene.Layers || {};

        scene.The = scene.The || {};
        findComponents(scene.The);
        initialize(scene.The);

        scene.Hierarchy = scene.Hierarchy || [];
        scene.Assets = scene.Assets || [];

        var refs = {};
        var addRefs = function(entity) {
            if (entity.key) refs[entity.key] = entity;
            if (entity.children) entity.children.forEach(addRefs);
        };
        var setRefs = function(entity) {
            entity.components.forEach(function(p) {
                if (!entity[p].refs) return;
                entity[p].data = entity[p].data || {};
                for (var r in entity[p].refs) if (refs[r]) entity[p].data[entity[p].refs[r]] = refs[r];
            });
            if (entity.children) entity.children.forEach(setRefs);
        };

        scene.Hierarchy.forEach(findComponents);
        scene.Hierarchy.forEach(addRefs);
        scene.Hierarchy.forEach(setRefs);
        scene.Hierarchy.forEach(initialize);
        scene.Hierarchy.forEach(addEntityMethods);

        var addToUpdateList = function(entity) {
            entity.components.forEach(function(c) {
                if (entity[c].update) updateList.push(entity[c].update);
            });
            if (entity.children) entity.children.forEach(addToUpdateList);
        };

        var callReady = function(entity) {
            entity.components.forEach(function(c) {
                if (entity[c].ready) entity[c].ready(scene, entity);
            });
            if (entity.children) entity.children.forEach(callReady);
        };

        var removeFromScreenTree = function(entity) {
            if (entity.onScreenNode) entity.onScreenNode.remove();
            entity.onScreenNode = null;
            if (entity.children) entity.children.forEach(removeFromScreenTree);
        };

        var removeFromList = function(list, entity) {
            for (var i = 0; i < list.length; i++) {
                if (list[i] === entity) {
                    list.splice(i, 1);
                    return true;
                } else if (list[i].children) {
                    if (removeFromList(list[i].children, entity)) return true;
                }
            }
            return false;
        };

        var updateList = [];
        addToUpdateList(scene.The);
        scene.Hierarchy.forEach(addToUpdateList);

        scene.update = function(delta) { updateList.forEach(function(f) {f(delta);}); };
        scene.addEntity = function(rawEntity, parent) {
            findComponents(rawEntity);
            initialize(rawEntity);
            addEntityMethods(rawEntity);
            addToUpdateList(rawEntity);

            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(rawEntity);
            } else {
                scene.Hierarchy.push(rawEntity);
            }

            callReady(rawEntity);
        };
        scene.removeEntity = function(entity) {
            removeFromList(scene.Hierarchy, entity);
            removeFromScreenTree(entity);
            updateList = [];
            addToUpdateList(scene.The);
            scene.Hierarchy.forEach(addToUpdateList);
        };

        for (var a in scene.Assets) {
            var obj = scene.Assets[a];
            if (obj && dafen2d.assetTypes[obj.type]) {
                scene.Assets[a] = dafen2d.assetTypes[obj.type].createAsset(obj.data);
            }
        }

        callReady(scene.The);
        scene.Hierarchy.forEach(callReady);
    };
})();