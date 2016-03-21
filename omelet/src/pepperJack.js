(function() {
    // this function tests if two convex polygons intersect by projecting the points to lines perpendicular to the edges of the polys.
    // iff an edge exists where the projected points from each polygon lie in distinct line segments, the shapes do not intersect.
    // based on this web page: http://content.gpwiki.org/index.php/Polygon_Collision

    // the polygons that are passed in need to be arrays of 2 element arrays like this: [[x1, y1], [x2, y2], [x3, y3]]
    // the order of the points need to be an in-order traversal of the polygon.  It does not matter if this is clockwise or counter-clockwise.
    window.omelet.salt(null, function(state) {
        state.testIntersection = function(polyA, polyB) {
            return testHalf(polyA, polyB) && testHalf(polyB, polyA);
        };
    });

    var testHalf = function(a, b) {
        if (!a || !b) return false;
        var i, j;
        var minA, maxA, minB, maxB;
        var aLength = a.length;
        var bLength = b.length;

        for (i = 0; i < aLength; i += 1) {
            var next = a[(i + 1) % aLength];
            var here = a[i];
            // vector from here to next would be (next[0] - here[0], next[1] - here[1])
            // perpendicular of (x, y) is (-y, x);
            var px = -1 * (next[1] - here[1]);
            var py = next[0] - here[0];

            // a points
            minA = Number.MAX_VALUE;
            maxA = Number.MIN_VALUE;
            for (j = 0; j < aLength; j += 1) {
                var dot = (px * a[j][0]) + (py * a[j][1]);
                if (dot < minA) minA = dot;
                if (dot > maxA) maxA = dot;
            }

            // b points
            minB = Number.MAX_VALUE;
            maxB = Number.MIN_VALUE;
            for (j = 0; j < bLength; j += 1) {
                var dot = (px * b[j][0]) + (py * b[j][1]);
                if (dot < minB) minB = dot;
                if (dot > maxB) maxB = dot;
            }

            if (maxB < minA || maxA < minB) return false;
        }

        return true;
    };
})();
