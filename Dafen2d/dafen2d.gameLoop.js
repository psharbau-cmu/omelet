(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.makeGame = function(canvasElement, sceneObj){
        if (!canvasElement || !sceneObj) return;

        var context = canvasElement.getContext('2d');
        var width = context.width;
        var height = context.height;
        var screenPoly = [];
        var wrapper = dafen2d.wrapContext(context);
        var onScreenTree = dafen2d.createOnScreenTree();
        var mousePosition = [-10, -10];
        var mouseDown = false;
        var mouseDownSent = false;
        var mouseEntity = null;
        var started = false;
        var lastTime = 0;

        // listen to mouse
        canvasElement.addEventListener('mousedown', function(evt) { mouseDown = true; });
        canvasElement.addEventListener('mouseup', function(evt) { mouseDown = false; });
        canvasElement.addEventListener('mousemove', function(evt) {
            var rect = canvasElement.getBoundingClientRect();
            mousePosition = [evt.clientX - rect.left, evt.clientY - rect.top];
        });

        dafen2d.realizeScene(sceneObj);
        sceneObj.Context = context;

        var transformAndPreDraw = function(entity) {
            // save transform
            wrapper.save();

            // change the transform locally
            if (entity.transform) var snap = entity.transform(wrapper);

            // send a snapshot of the transform to predraw to cache for drawing later
            if (entity.preDraw) {
                var poly = entity.preDraw(snap || wrapper.getSnapshot());

                // test if bounding box is on the screen or not, add or remove from tree accordingly
                if (dafen2d.testIntersection(screenPoly, poly)) {
                    if (!entity.onScreenNode) onScreenTree.insert(entity);
                } else {
                    if (entity.onScreenNode) entity.onScreenNode.remove();
                    entity.onScreenNode = null;
                }
            }

            // loop through children
            if (entity.children) entity.children.forEach(transformAndPreDraw);

            // restore transform as if this never happened
            wrapper.restore();
        };

        var processMouseBoxes = function(boxes) {
            // set global state
            sceneObj.MousePosition = mousePosition;
            sceneObj.MouseDown = mouseDown;

            // loop through boxes top to bottom to find one the mouse is over
            while (boxes.length > 0) {
                var boxSet = boxes.pop();
                var x = mousePosition[0];
                var y = mousePosition[1];
                if (dafen2d.testPointInPolygon(x, y, boxSet.box)) {
                    if (mouseEntity != boxSet.entity) {
                        if (mouseEntity && mouseEntity.mouseExit) mouseEntity.mouseExit();
                        mouseEntity = boxSet.entity;
                        if (mouseEntity.mouseEnter) mouseEntity.mouseEnter();
                    }

                    if (mouseDownSent != mouseDown) {
                        if (mouseDown && mouseEntity.mouseDown) mouseEntity.mouseDown();
                        else if (!mouseDown && mouseEntity.mouseUp) mouseEntity.mouseUp();
                        mouseDownSent = mouseDown;
                    }

                    return;
                }
            }

            if (mouseEntity && mouseEntity.mouseExit) mouseEntity.mouseExit();
            mouseEntity = null;
            mouseDownSent = mouseDown;
        };

        var gameLoop = function() {
            // check size, update poly
            width = canvasElement.width;
            height = canvasElement.height;
            screenPoly = [[0, 0], [width, 0], [width, height], [0, height]];

            // update
            var now = new Date().getTime();
            var deltaTime = (now - (lastTime || now)) / 1000;
            if (deltaTime > 1) deltaTime = 0.016;
            lastTime = now;
            sceneObj.update(deltaTime);

            // move to center
            wrapper.save();
            wrapper.translate(width / 2, height / 2);

            // camera changes
            var cam = sceneObj.Camera;
            wrapper.translate(-1 * cam.x, -1 * cam.y);
            if (cam.angle != 0) wrapper.rotate(-1 * cam.angle);
            wrapper.scale(cam.zoom, cam.zoom);

            // transform and preDraw steps
            sceneObj.Hierarchy.forEach(transformAndPreDraw);

            // clear the whole screen, in future, just clear what is needed
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, width, height);

            // do draw, get back stack of global polygons for mouse events
            var boxes = onScreenTree.draw();

            // process mouse events
            if (boxes && boxes.length > 0) {
                processMouseBoxes(boxes);
            }

            // restore wrapper to how it started
            wrapper.restore();

            // call next frame
            if (started) window.requestAnimationFrame(gameLoop);
        };

        // game obj
        return {
            start:function() {
                if (started) return;
                started = true;
                window.requestAnimationFrame(gameLoop);
            },
            stop:function() { started = false; }
        };
    };
})();