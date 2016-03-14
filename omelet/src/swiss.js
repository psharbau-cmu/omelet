(function() {
    // this function tests if a point is in a convex polygon
    // iff the point is in the polygon, then the angle between all the edges and the point to the origin of the edge will be less than 90

    // the polygons that are passed in need to be arrays of 2 element arrays like this: [[x1, y1], [x2, y2], [x3, y3]]
    window.omelet.salt(null, function(state) {
        state.testPointInPolygon = function(x, y, poly) {
            for (var i = 0; i < poly.length; i += 1) {
                var next = poly[(i + 1) % poly.length];
                var here = poly[i];

                var edgeX = next[0] - here[0];
                var edgeY = next[1] - here[1];

                var toPointX = x - here[0];
                var toPointy = y - here[1];

                var dot = (edgeX * toPointX) + (edgeY * toPointy);

                if (dot < 0) return false;
            }

            return true;
        };
    });
})();
