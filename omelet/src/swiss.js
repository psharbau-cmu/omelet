(function() {
    // this function tests if a point is in a convex polygon
    var getSide = function(point, sideStart, sideEnd) {
        var toEnd = [sideEnd[0] - sideStart[0], sideEnd[1] - sideStart[1]];
        var toPoint = [point[0] - sideStart[0], point[1] - sideStart[1]];
        var cross = (toEnd[0] * toPoint[1]) - (toEnd[1] * toPoint[0]);
        return cross < 0 ? 'L' : cross > 0 ? 'R' : 'N';
    };

    // the polygons that are passed in need to be arrays of 2 element arrays like this: [[x1, y1], [x2, y2], [x3, y3]]
    window.omelet.salt(null, function(state) {
        state.testPointInPolygon = function(x, y, poly) {
            var point = [x, y];
            var side = null;
            for (var i = 0; i < poly.length; i += 1) {
                var next = poly[(i + 1) % poly.length];
                var here = poly[i];

                var newSide = getSide(point, here, next);

                if (newSide == 'N') return false;
                else if (!side) side = newSide;
                else if (side != newSide) return false;
            }

            return true;
        };
    });
})();
