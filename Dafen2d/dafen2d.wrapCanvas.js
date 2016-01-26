(function() {
    // using the following transform matrix:
    // |a c e|
    // |b d f|   =   [a, b, c, d, e, f]
    // |0 0 1|
    //
    // inverse representation will be:
    // |A C E|
    // |B D F|   =   [A, B, C, D, E, F]
    // |0 0 Y|
    var computeInverse = function(m) {
        var i = [];

        i.push(m[3]);                      // A
        i.push(-1 * m[1]);                 // B
        i.push(-1 * m[2]);                 // C
        i.push(m[0]);                      // D
        i.push((m[2]*m[5]) - (m[4]*m[3])); // E
        i.push((m[4]*m[2]) - (m[0]*m[5])); // F

        var det = (m[0]*i[0]) + (m[2]*i[1]);
        for (var index = 0; index < 6; index += 1) i[index] /= det;

        return i;
    };

    var calcTransformPoint = function (x, y, m) {
        var xPrime = (m[0] * x) + (m[2] * y) + m[4];
        var yPrime = (m[1] * x) + (m[3] * y) + m[5];
        return [xPrime, yPrime];
    };

    var calcInverseTransformPoint = function (x, y, m) {
        var i =  computeInverse(m);
        var xPrime = (i[0] * x) + (i[2] * y) + i[4];
        var yPrime = (i[1] * x) + (i[3] * y) + i[5];
        return [xPrime, yPrime];
    };


    // SnapShot constructor and methods
    var SnapShot = function(m, c, p) {
        this.currentMatrix = m.slice();
        this.context2d = c;
        this.parent = p ? p.slice() : null;
    };

    SnapShot.prototype.getContext = function() {
        this.context2d.setTransform.apply(this.context2d, this.currentMatrix);
        return this.context2d;
    };

    SnapShot.prototype.transformPoint = function(x, y) {
        return calcTransformPoint(x, y, this.currentMatrix);
    };

    SnapShot.prototype.inverseTransformPoint = function(x, y) {
        return calcInverseTransformPoint(x, y, this.currentMatrix);
    };

    SnapShot.prototype.inverseTransformInParentSpace = function(x, y) {
        if (!this.parent) return [x, y];
        else return calcInverseTransformPoint(x, y, this.parent);
    };

    // get context wrapper to track transform and provide snapshots
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.wrapContext = function(context) {

        var current = {
            matrix:[1,0,0,1,0,0],
            last: null
        };

        var multiplyCurrent = function(right) {
            var left = current.matrix.slice();

            current.matrix[0] = (left[0] * right[0]) + (left[2] * right[1]);
            current.matrix[1] = (left[1] * right[0]) + (left[3] * right[1]);
            current.matrix[2] = (left[0] * right[2]) + (left[2] * right[3]);
            current.matrix[3] = (left[1] * right[2]) + (left[3] * right[3]);
            current.matrix[4] = (left[0] * right[4]) + (left[2] * right[5]) + left[4];
            current.matrix[5] = (left[1] * right[4]) + (left[3] * right[5]) + left[5];
        };

        return {
            save: function () {
                var copyMatrix = current.matrix.slice();
                current = {
                    matrix: copyMatrix,
                    last: current
                };
            },

            restore: function () {
                if (current.last) current = current.last;
            },

            scale: function (x, y) {
                multiplyCurrent([x, 0, 0, y, 0, 0]);
            },

            rotate: function (angle) {
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                multiplyCurrent([cos, sin, -1 * sin, cos, 0, 0]);
            },

            translate: function (x, y) {
                multiplyCurrent([1, 0, 0, 1, x, y]);
            },

            shear: function (x, y) {
                multiplyCurrent([1, y, x, 1, 0, 0]);
            },

            transform: function (a, b, c, d, e, f) {
                multiplyCurrent([a, b, c, d, e, f]);
            },

            setTransform: function (a, b, c, d, e, f) {
                current.matrix = [a, b, c, d, e, f];
            },

            reset: function() {
                current = {
                    matrix:[1,0,0,1,0,0],
                    last: null
                };
            },

            transformPoint: function (x, y) {
                return calcTransformPoint(x, y, current.matrix);
            },

            inverseTransformPoint: function (x, y) {
                return calcInverseTransformPoint(x, y, current.matrix);
            },

            getSnapshot: function() {
                return new SnapShot(current.matrix, context, current.last ? current.last.matrix : null);
            }
        };
    };
})();


