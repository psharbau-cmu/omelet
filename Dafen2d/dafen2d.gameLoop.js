(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.makeGame = function(canvasElement, sceneObj){
        if (!canvasElement || !sceneObj) return;

        var context = canvasElement.getContext('2d');
        var width = context.width;
        var height = context.height;
        var wrapper = dafen2d.wrapContext(context);
        var onScreenTree = dafen2d.createOnScreenTree();
        var mouseEntity = null;
        var started = false;
        var lastTime = 0;

        dafen2d.realizeScene(sceneObj);
        sceneObj.Context = context;

        var testForOnScreen = function(points) {
            var onScreen = false;
            points.forEach(function(point) {
                if (onScreen) return;

                // (0,0) -> (width, 0)
                var sign = width * point[0];

                // (width, 0) -> (width, height)
                var dot2 = height * point[1];
                if (sign == 0) sign = dot2;
                else if (sign * dot2 < 0) return;

                // (width, height) -> (0, height)
                var dot3 = -1 * width * (point[0] - width);
                if (sign == 0) sign = dot3;
                else if (sign * dot3 < 0) return;

                //(0, height) -> (0, 0)
                var dot4 = -1 * height * (point[1] - height);
                if (sign * dot4 < 0) return;

                onScreen = true;
            });

            return onScreen;

            // TODO: if the polygon completely surrounds the canvas, this will say false, but it's true
        };


        var transformAndPreDraw = function(entity) {
            // save transform
            wrapper.save();

            // change the transform locally
            if (entity.transform) entity.transform(wrapper);

            // send a snapshot of the transform to predraw to cache for drawing later
            if (entity.preDraw) {
                var poly = entity.preDraw(wrapper.getSnapshot());

                // test if bounding box is on the screen or not, add or remove from tree accordingly
                if (testForOnScreen(poly)) {
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
            while (boxes.lengh > 0) {
                var boxSet = boxes.pop();
                // todo: test mouse stuff
            }
        };

        var gameLoop = function() {
            // check size
            width = canvasElement.width;
            height = canvasElement.height;

            // update
            var now = new Date().getTime();
            var deltaTime = (now - (lastTime || now)) / 1000;
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