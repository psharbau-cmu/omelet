(function() {
    window.omelet.salt('makeGame', function(state) {
        return function (canvasElement, sceneObj) {
            if (!canvasElement || canvasElement.constructor != HTMLCanvasElement) {
                console.log("Error making game.  Canvas Element must be non-null object of type HTMLCanvasElement.");
                return;
            } else if (!state.checkIsScene(sceneObj)) {
                console.log("Error making game. Scene object must be non-null object of type Scene.");
                return;
            }

            var context = canvasElement.getContext('2d');
            var width = context.width;
            var height = context.height;
            var screenPoly = [];
            var wrapper = state.wrapContext(context);
            var onScreenTree = state.createOnScreenTree();
            var mousePosition = [-10, -10];
            var mouseDown = false;
            var mouseDownSent = false;
            var mouseClickPosition = null;
            var mouseEntity = null;
            var mouseClick = false;
            var started = false;
            var lastTime = 0;
            // get these references so that assigning the properties directly on the scene will break the game
            var camera = sceneObj.camera;
            var assets = sceneObj.assets;
            var the = sceneObj.the;
            var hierarchy = sceneObj.hierarchy;

            var displayRatio = 1; // ratio of canvas size to canvas styled size

            // listen to mouse
            canvasElement.addEventListener('mousedown', function (evt) {
                mouseDown = true;
                evt.preventDefault();
            });
            canvasElement.addEventListener('mouseup', function (evt) {
                mouseDown = false;
                evt.preventDefault();
            });
            canvasElement.addEventListener('mousemove', function (evt) {
                var rect = canvasElement.getBoundingClientRect();
                mousePosition = [displayRatio * (evt.clientX - rect.left), displayRatio * (evt.clientY - rect.top)];
                evt.preventDefault();
            });
            canvasElement.addEventListener('click', function(evt) {
                mouseClick = true;
                var rect = canvasElement.getBoundingClientRect();
                mousePosition = [displayRatio * (evt.clientX - rect.left), displayRatio * (evt.clientY - rect.top)];
                evt.preventDefault();
            });
            canvasElement.addEventListener('touchstart', function(evt) {
                mouseDown = true;
                var rect = canvasElement.getBoundingClientRect();
                var touch = evt.touches[0];
                if (touch) mousePosition = [displayRatio* (touch.clientX - rect.left), displayRatio * (touch.clientY - rect.top)];
                evt.preventDefault();
            });
            canvasElement.addEventListener('touchend', function(evt) {
                mouseDown = false;
                var rect = canvasElement.getBoundingClientRect();
                var touch = evt.touches[0];
                if (touch) mousePosition = [displayRatio* (touch.clientX - rect.left), displayRatio * (touch.clientY - rect.top)];
                evt.preventDefault();
            });
            canvasElement.addEventListener('touchcancel', function(evt) {
                mouseDown = false;
                var rect = canvasElement.getBoundingClientRect();
                var touch = evt.touches[0];
                if (touch) mousePosition = [displayRatio* (touch.clientX - rect.left), displayRatio * (touch.clientY - rect.top)];
                evt.preventDefault();
            });
            canvasElement.addEventListener('touchmove', function(evt) {
                var rect = canvasElement.getBoundingClientRect();
                var touch = evt.touches[0];
                if (touch) mousePosition = [displayRatio* (touch.clientX - rect.left), displayRatio * (touch.clientY - rect.top)];
                evt.preventDefault();
            });


            sceneObj.context = context;
            sceneObj.canvas = canvasElement;

            var transformAndPreDraw = function (entity) {
                // save transform
                wrapper.save();

                // change the transform locally
                if (entity.transform) var snap = entity.transform(wrapper);

                // send a snapshot of the transform to predraw to cache for drawing later
                if (entity.preDraw) {
                    var poly = entity.preDraw(snap || wrapper.getSnapshot());

                    // test if bounding box is on the screen or not, add or remove from tree accordingly
                    if (state.testIntersection(screenPoly, poly)) {
                        if (!entity.onScreenNode) onScreenTree.insert(entity);
                    } else {
                        if (entity.onScreenNode) entity.onScreenNode.remove();
                    }
                }

                // loop through children
                if (entity.hasChildren) entity.children.forEach(transformAndPreDraw);

                // restore transform as if this never happened
                wrapper.restore();
            };

            var processMouseBoxes = function (boxes) {
                // set global state
                sceneObj.mousePosition = mousePosition;
                sceneObj.mouseDown = mouseDown;

                // loop through boxes top to bottom to find one the mouse is over
                while (boxes.length > 0) {
                    var boxSet = boxes.pop();
                    var x = mousePosition[0];
                    var y = mousePosition[1];
                    if (state.testPointInPolygon(x, y, boxSet.box)) {
                        if (mouseEntity != boxSet.entity) {
                            if (mouseEntity && mouseEntity.mouseExit) mouseEntity.mouseExit();
                            mouseEntity = boxSet.entity;
                            mouseClickPosition = null;
                            if (mouseEntity.mouseEnter) mouseEntity.mouseEnter();
                        }

                        if (!mouseDownSent && mouseClick) {
                            if (mouseEntity.mouseClick) mouseEntity.mouseClick();
                        }

                        if (mouseDownSent != mouseDown) {
                            if (mouseDown) mouseClickPosition = mousePosition.slice();

                            if (mouseDown && mouseEntity.mouseDown) mouseEntity.mouseDown();
                            else if (!mouseDown && mouseEntity.mouseUp) mouseEntity.mouseUp();

                            if (!mouseDown &&
                                    mouseClickPosition &&
                                    Math.sqrt(Math.pow(mouseClickPosition[0] - mousePosition[0], 2) + Math.pow(mouseClickPosition[1] - mousePosition[1], 2)) < 25) {
                                if (mouseEntity.mouseClick) mouseEntity.mouseClick();
                            }

                            mouseDownSent = mouseDown;
                        }

                        mouseClick = false;
                        return;
                    }
                }

                if (mouseEntity && mouseEntity.mouseExit) mouseEntity.mouseExit();
                mouseClick = false;
                mouseClickPosition = null;
                mouseEntity = null;
                mouseDownSent = mouseDown;
            };

            var gameLoop = function (doUpdate) {
                // check size, update poly
                width = canvasElement.width;
                height = canvasElement.height;

                screenPoly = [[0, 0], [width, 0], [width, height], [0, height]];

                // update
                if (doUpdate) {
                    var now = new Date().getTime();
                    var deltaTime = (now - (lastTime || now)) / 1000;
                    if (deltaTime > 1) deltaTime = 0.016;
                    lastTime = now;
                    sceneObj.update(deltaTime);
                }

                // move to center
                wrapper.save();
                wrapper.translate(width / 2, height / 2);

                // camera changes
                wrapper.scale(camera.zoom, camera.zoom);
                wrapper.translate(-1 * camera.x, -1 * camera.y);
                if (camera.rotate90) wrapper.rotate(Math.PI / 2);
                if (camera.angle != 0) wrapper.rotate(-1 * camera.angle);

                // set screen rect
                var realWidth = width / camera.zoom;
                var realHeight = height / camera.zoom;
                if (camera.rotate90) wrapper.setRect([realHeight / -2, realWidth / -2, realHeight, realWidth]);
                else wrapper.setRect([realWidth / -2, realHeight / -2, realWidth, realHeight]);

                // transform and preDraw steps
                hierarchy.forEach(transformAndPreDraw);

                // clear the whole screen. In future, just clear what is needed
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, width, height);

                // do draw, get back stack of global polygons for mouse events
                var boxes = onScreenTree.draw();

                // process mouse events
                if (boxes && boxes.length > 0) processMouseBoxes(boxes);

                // restore wrapper to how it started
                wrapper.restore();

                // call next frame
                if (started) window.requestAnimationFrame(gameLoop);
            };

            // initialize everything so they know the refs are good
            sceneObj.initialize();

            // game obj
            return {
                start: function () {
                    if (started) return;
                    started = true;
                    window.requestAnimationFrame(gameLoop);
                },
                stop: function () {
                    started = false;
                },
                doFrameSkipUpdate: function() {
                    started = false;
                    gameLoop(false);
                },
                setDisplayRatio: function(ratio) {
                    displayRatio = ratio;
                }
            };
        };
    });
})();