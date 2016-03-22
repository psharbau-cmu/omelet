window.omelet.egg('omelet.shapes.polygon', function(data, refs) {
    this.points = data.points;
    this.fillColor = data.fillColor;
    this.strokeColor = data.strokeColor;
    this.strokeWidth = data.strokeWidth;
    this.globalCompositeOperation = data.globalCompositeOperation;

    var convexPointsCache = null;
    var lastSnap = null;
    var lastPoly = null;

    this.ready = function(scene, entity) {
        entity.screenSort = [scene.layers[data.layer] || 0, data.orderInLayer];
    };

    this.preDraw = function(snapShot) {
        if (this.points == null) this.points = [];
        if (convexPointsCache == null || convexPointsCache.cacheKey != this.points.cacheKey) {
            convexPointsCache = buildCache(this.points);
        }

        lastSnap = snapShot;
        lastPoly = [];
        convexPointsCache.points.forEach(function (point) {
            lastPoly.push(snapShot.transformPoint(point[0], point[1]));
        });

        if (this.globalCompositeOperation) context.globalCompositeOperation = 'source-over';
        return lastPoly;
    };

    this.draw = function() {
        if (!lastSnap) return;

        var context = lastSnap.getContext();
        if (this.globalCompositeOperation) context.globalCompositeOperation = this.globalCompositeOperation;

        var position = this.points[0];
        context.beginPath();
        context.moveTo(position[0], position[1]);

        for (var i = 1; i < this.points.length; i += 1) {
            position = this.points[i];
            context.lineTo(position[0], position[1]);
        }

        position = this.points[0];
        context.lineTo(position[0], position[1]);
        context.closePath();


        if (this.fillColor) {
            context.fillStyle = this.fillColor;
            context.fill();
        }

        if (this.strokeColor) {
            context.strokeStyle = this.strokeColor;
            context.lineWidth = this.strokeWidth;
            context.stroke();
        }

        return lastPoly;
    };

     var buildCache = function(points) {
        points.cacheKey = Math.random() * Number.MAX_VALUE;
        var cache = {
            cacheKey: points.cacheKey,
            points:[]
        };

        if (points.length < 3) return cache;

        var leftPoint = [Number.MAX_VALUE];
        var rightPoint = [Number.MIN_VALUE];
        points.forEach(function(point) {
            if (point[0] < leftPoint[0]) leftPoint = point;
            else if (point[0] > rightPoint[0]) rightPoint = point;
        });

        var leftPoints = [];
        var rightPoints = [];

        points.forEach(function(point) {
            if (point == leftPoint || point == rightPoint) return;
            switch (getSide(point, leftPoint, rightPoint)) {
                case 'L':
                    leftPoints.push(point);
                    break;
                case 'R':
                    rightPoints.push(point);
                    break;
            }
        });

        var leftHull = getHalfHull(leftPoints, leftPoint, rightPoint, 'L');
        var rightHull = getHalfHull(rightPoints, leftPoint, rightPoint, 'R');

        for (var i = rightHull.length - 2; i > 0; i -= 1) {
            leftHull.push(rightHull[i]);
        }

        cache.points = leftHull;
        return cache;
    };

    var getHalfHull = function(points, startPoint, endPoint, side) {
        if (points.length < 1) return [startPoint, endPoint];

        var maxPoint = null;
        var maxDist = Number.MIN_VALUE;
        points.forEach(function(point) {
            var dist = distanceToPoint(point, startPoint, endPoint);
            if (dist > maxDist) {
                maxDist = dist;
                maxPoint = point;
            }
        });

        var aPoints = [];
        var bPoints = [];
        points.forEach(function(point) {
            if (point == maxPoint) return;
            if (getSide(point, startPoint, maxPoint) == side) {
                aPoints.push(point);
            } else if (getSide(point, maxPoint, endPoint) == side) {
                bPoints.push(point);
            }
        });

        var aHull = getHalfHull(aPoints, startPoint, maxPoint, side);
        var bHull = getHalfHull(bPoints, maxPoint, endPoint, side);

        for (var i = 1; i < bHull.length; i += 1) {
            aHull.push(bHull[i]);
        }

        return aHull;
    };

    var getSide = function(point, start, end) {
        var toEnd = [end[0] - start[0], end[1] - start[1]];
        var toPoint = [point[0] - start[0], point[1] - start[1]];
        var cross = (toEnd[0] * toPoint[1]) - (toEnd[1] * toPoint[0]);
        return cross < 0 ? 'L' : cross > 0 ? 'R' : 'N';
    };

    var distanceToPoint = function(point, start, end) {
        var width = start[0] - end[0];
        var height = start[1] - end[1];
        return Math.abs((height * point[0]) - (width * point[1]) + (end[0] * start[1]) - (end[1] * start[0])) / Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    }

}).defaults({
    points:[[-10, -10], [10, -10], [0, 20]],
    fillColor:null,
    strokeColor:null,
    strokeWidth:1,
    layer:'default',
    orderInLayer:0,
    globalCompositionOperation:null
}).describe({
    points:{
        type:'array',
        items:{
            type:'array',
            items:{
                type:'number',
                minItems:2,
                maxItems:2
            },
            minItems:2
        }
    },
    fillColor:{type:'string'},
    strokeColor:{type:'string'},
    strokeWidth:{type:'number'},
    globalCompositionOperation:{enum:['source-over', 'source-atop', 'source-in', 'source-out', 'destination-over', 'destination-atop', 'destination-in', 'destination-out', 'lighter', 'copy', 'xor']},
    layer:{type:'string'},
    orderInLayer:{type:'integer'}
});