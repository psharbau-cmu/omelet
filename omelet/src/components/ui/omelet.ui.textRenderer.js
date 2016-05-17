(function() {
    // shared workspace for all text renderers
    var workCanvas = document.createElement('canvas');
    var workContext = workCanvas.getContext('2d');

    window.omelet.egg('omelet.ui.textRenderer', function (data, refs) {
        this.text = data.text;
        this.color = data.color;
        this.font = data.font;
        this.lineHeight = data.lineHeight;
        this.align = data.align;
        this.verticalAlign = data.verticalAlign;
        this.wrapText = data.wrapText;
        this.globalCompositeOperation = data.globalCompositeOperation;

        var lastSnap = null;
        var left = 0;
        var top = 0;
        var width = 0;
        var height = 0;

        var workImage = new Image();
        var lastCache = null;

        this.ready = function (scene, entity) {
            entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
        };

        this.preDraw = function (snapShot) {
            lastSnap = snapShot;
            var rect = snapShot.getRect();
            left = rect[0];
            top = rect[1];
            width = rect[2];
            height = rect[3];
            if (width <= 0 || height <= 0 || this.text == "") return;
            var right = left + width;
            var bottom = top + height;

            return [snapShot.transformPoint(left, top), snapShot.transformPoint(right, top), snapShot.transformPoint(right, bottom), snapShot.transformPoint(left, bottom)];
        };

        this.draw = function () {

            if (!lastCache ||
                lastCache.width != width ||
                lastCache.height != height ||
                lastCache.text != this.text ||
                lastCache.color != this.color ||
                lastCache.font != this.font ||
                lastCache.lineHeight != this.lineHeight ||
                lastCache.align != this.align ||
                lastCache.verticalAlign != this.verticalAlign ||
                lastCache.wrapText != this.wrapText) {

                lastCache = {
                    width: width,
                    height: height,
                    text: this.text,
                    color: this.color,
                    font: this.font,
                    lineHeight: this.lineHeight,
                    align: this.align,
                    verticalAlign: this.verticalAlign,
                    wrapText: this.wrapText
                };

                buildImage(lastCache);
            }


            var context = lastSnap.getContext();
            if (this.globalCompositionOperation) context.globalCompositeOperation = this.globalCompositeOperation;
            context.drawImage(workImage, left, top);
            if (this.globalCompositionOperation) context.globalCompositeOperation = 'source-over';
        };


        var buildImage = function (cacheData, scaleFraction) {
            workCanvas.width = cacheData.width;
            workCanvas.height = cacheData.height;

            workContext.setTransform(1, 0, 0, 1, 0, 0);
            workContext.clearRect(0, 0, width, height);
            if (scaleFraction) workContext.scale(scaleFraction, scaleFraction);
            else scaleFraction = 1;
            var textWidth = cacheData.width / scaleFraction;
            var textHeight = cacheData.height / scaleFraction;

            workContext.font = cacheData.font;
            workContext.textBaseline = 'middle';
            workContext.textAlign = cacheData.align;
            workContext.fillStyle = cacheData.color;

            var lines = [];

            if (cacheData.wrapText) {
                var text = cacheData.text || '';
                var words = text.split(' ');
                var line = '';
                var wordPosition = 0;
                while (wordPosition < words.length) {
                    var testLine = line + ' ' + words[wordPosition];
                    var measuredLength = workContext.measureText(testLine);
                    if (measuredLength.width > textWidth) {
                        if (line != '') lines.push(line);
                        line = words[wordPosition];
                    } else {
                        line = testLine;
                    }

                    wordPosition += 1;
                }
                lines.push(line);
            } else {
                lines.push(cacheData.text || '');
            }

            var measuredHeight = lines.length * cacheData.lineHeight;

            if (measuredHeight > textHeight && textHeight != 0) {
                var fraction = 0.5 * scaleFraction;
                var measuredFraction = textHeight / measuredHeight;
                if (measuredFraction > .5) fraction = measuredFraction * scaleFraction;
                buildImage(cacheData, fraction);
                return;
            }

            var x = cacheData.align == 'left' ? 0 : cacheData.align == 'right' ? textWidth : textWidth / 2;
            var y = cacheData.verticalAlign == 'top' ? cacheData.lineHeight / 2 :
                        cacheData.verticalAlign == 'bottom' ? textHeight - measuredHeight + (cacheData.lineHeight / 2) :
                        (textHeight - measuredHeight + cacheData.lineHeight) / 2;
            lines.forEach(function (line) {
                workContext.fillText(line, x, y, textWidth);
                y += cacheData.lineHeight;
            });

            workImage.width = cacheData.width;
            workImage.height = cacheData.height;
            workImage.src = workCanvas.toDataURL();
        };
    }).defaults({
        text: 'New Text',
        color: 'black',
        font: '30px sans-serif',
        lineHeight: 35,
        align: 'center',
        verticalAlign: 'center',
        layer: 'default',
        orderInLayer: 0,
        wrapText: true,
        globalCompositeOperation:null
    }).describe({
        text:{type:'string'},
        color: {type:'string'},
        font: {type:'string'},
        lineHeight: {type:'number'},
        align: {enum:['left', 'center', 'right']},
        verticalAlign:{ enum:[ 'top', 'center', 'bottom']},
        wrapText:{type:'boolean'},
        layer:{type:'string'},
        orderInLayer:{type:'integer'},
        globalCompositeOperation:{type:'string'}
    });
})();