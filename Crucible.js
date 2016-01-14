(function() {

    var context = null;
    var state = null;
    var updateFunctions = [];
    var drawFunctions = [];
    var lastTime = 0;
    var canceled = false;

    var initialize = function(entity) {
        // get list of non-children properties
        var props = [];
        for(var p in entity) if (p != 'children') props.push(p);

        // replace stubs with created components
        props.forEach(function(prop) {
            entity[prop] = componentTypes[prop].createComponent(entity, entity[prop].data);
        });

        // recurse through children
        if (entity.children) entity.children.forEach(initialize);
    };

    var doReady = function(entity) {
        // loop through components, looking for ready functions
        for(var p in entity) {
            if (p != 'children' && entity[p].ready) entity[p].ready();
        }

        // recurse through children
        if (entity.children) entity.children.forEach(doReady);
    };

    var saveContext = function(passedContext) {
        passedContext.save();
    };

    var restoreContext = function(passedContext) {
        passedContext.restore();
    };

    var clearCanvas = function(passedContext) {
        passedContext.clearRect(0, 0, passedContext.width, passedContext.height);
    };

    var buildFunctionLists = function() {
        // clear lists
        updateFunctions = [];
        drawFunctions = [clearCanvas];

        // rebuild lists
        state.hierarchy.forEach(addToFunctionLists);
    };

    var addToFunctionLists = function(entity) {
        // save transform
        drawFunctions.push(saveContext);

        // loop through components for update and preDraw
        for (var p in entity) {
            if (p != 'children') {
                if (entity[p].update) updateFunctions.push(entity[p].update);
                if (entity[p].preDraw) drawFunctions.push(entity[p].preDraw);
            }
        }

        // loop through components for draw
        for (var p in entity) {
            if (p != 'children') {
                if (entity[p].draw) drawFunctions.push(entity[p].draw);
            }
        }

        // recurse through children
        if (entity.children) entity.children.forEach(addToFunctionLists);

        // restore transform
        drawFunctions.push(restoreContext);
    };

    var gameLoop = function() {
        // calculate delta time
        var now = new Date().getTime();
        var deltaTime = (now - (lastTime || now)) / 1000;
        lastTime = now;

        // call update on everything
        updateFunctions.forEach(function(update) {
            update(deltaTime);
        });

        // redraw
        drawFunctions.forEach(function(draw) {
            draw(context);
        });

        if (!canceled) requestAnimationFrame(gameLoop);
    };

    var start = function(canvas, uninitialzedState) {
        // get 2d context from canvas
        context = canvas.getContext('2d');
        fixContext(context);

        // get state object's hierarchy, or create a blank one
        state = uninitialzedState || {};
        state.hierarchy = state.hierarchy || [];

        // initialize the hierarchy
        state.hierarchy.forEach(initialize);

        // let each component know we're ready to go
        state.hierarchy.forEach(doReady);

        // build function lists
        buildFunctionLists();

        // request animation
        window.requestAnimationFrame(gameLoop);
    };

    // create crucible object on page
    window.crucible = {

        start:start,
        cancel:function() {
            canceled = true;
        }

    };
})();