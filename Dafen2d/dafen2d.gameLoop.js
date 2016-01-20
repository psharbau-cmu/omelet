(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.makeGame = function(canvasElement, sceneObj){
        if (!canvasElement || !sceneObj) return;

        var context = canvasElement.getContext('2d');
        var width = context.width;
        var height = context.height;
        var wrapper = dafen2d.wrapContext(context);

        dafen2d.realizeScene(sceneObj);
        sceneObj.Context = context;

        var testForOnScreen = function(points) {

            points.forEach(function(point) {
                var sign = 0;
                // w, 0
                // 0, h
                // -w, 0
                //

                var
            });
        };


        var transformAndPreDraw = function(entity) {

        };

        var gameLoop = function() {
            // check size
            var width = context.width;
            var height = context.height;

            // update
            sceneObj.update();

            // move to center
            wrapper.save();
            wrapper.translate(context.width / 2, context.height / 2);

            // camera changes
            var cam = sceneObj.Camera;
            wrapper.translate(-1 * cam.x, -1 * cam.y);
            if (cam.angle != 0) wrapper.rotate(-1 * cam.angle);
            wrapper.scale(cam.scale, cam.scale);








        };






    };
})();