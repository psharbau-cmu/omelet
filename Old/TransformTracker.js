window.fixContext = function(context) {

    // using the following transform matrix:
    // |a c e|
    // |b d f|   =   [a, b, c, d, e, f]
    // |0 0 1|
    //
    // inverse representation will be:
    // |A C E|
    // |B D F|   =   [A, B, C, D, E, F]
    // |0 0 Y|

    var iSetTransform = context.setTransform;

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

        if (current.inverse) current.inverse = null;
    };

    var computeInverse = function() {
        var m = current.matrix;
        var i = [];

        i.push(m[3]);                      // A
        i.push(-1 * m[1]);                 // B
        i.push(-1 * m[2]);                 // C
        i.push(m[0]);                      // D
        i.push((m[2]*m[5]) - (m[4]*m[3])); // E
        i.push((m[4]*m[2]) - (m[0]*m[5])); // F

        var det = (m[0]*i[0]) + (m[2]*i[1]);
        for (var index = 0; index < 6; index += 1) i[index] /= det;

        current.inverse = i;
    };

    context.save = function() {
        var copyMatrix = current.matrix.slice();
        var copyInverse = current.matrix.inverse ? current.matrix.inverse.slice() : null;
        current = {
            matrix:copyMatrix,
            last:current
        };

        if (copyInverse) current.inverse = copyInverse;
    };

    context.restore = function() {
        if (current.last) {
            current = current.last;
            iSetTransform.apply(context, current.matrix);
        }
    };

    context.scale = function(x, y) {
        multiplyCurrent([x, 0, 0, y, 0, 0]);
        iSetTransform.apply(context, current.matrix);
    };

    context.rotate = function(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        multiplyCurrent([cos, sin, -1 * sin, cos, 0, 0]);

        iSetTransform.apply(context, current.matrix);
    };

    context.translate = function(x, y) {
        multiplyCurrent([1, 0, 0, 1, x, y]);
        iSetTransform.apply(context, current.matrix);
    };

    context.shear = function(x, y) {
        multiplyCurrent([1, y, x, 1, 0, 0]);
        iSetTransform.apply(context, current.matrix);
    };

    context.transform = function(a, b, c, d, e, f) {
        multiplyCurrent([a, b, c, d, e, f]);
        iSetTransform.apply(context, current.matrix);
    };

    context.setTransform = function(a, b, c, d, e, f) {
        current.matrix = [a, b, c, d, e, f];
        iSetTransform.apply(context, current.matrix);
    };

    context.transformPoint = function(x, y) {
        var m = current.matrix;

        var xPrime = (m[0]*x) + (m[2]*y) + m[4];
        var yPrime = (m[1]*x) + (m[3]*y) + m[5];

        return [xPrime, yPrime];
    };

    context.inverseTransformPoint = function(x, y) {
        if (!current.inverse) computeInverse();
        var m = current.inverse;

        var xPrime = (m[0]*x) + (m[2]*y) + m[4];
        var yPrime = (m[1]*x) + (m[3]*y) + m[5];

        return [xPrime, yPrime];
    };
};
