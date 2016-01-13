window.trackContext = function(context) {

    // using the following transform matrix:
    // |a c e|
    // |b d f|   =   [a, b, c, d, e, f ]
    // |0 0 1|

    var iSetTransform = context.transform;

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

    context.save = function() {
        var copyMatrix = current.matrix.slice();
        current = {
            matrix:copyMatrix,
            last:current
        };
    };

    context.restore = function() {
        if (current.last) {
            current = current.last;
            iSetTransform.apply(context, current.matrix);
        }
    };

    context.scale = function(x, y) {
        current.matrix[0] *= x;
        current.matrix[4] *= y;
        iSetTransform.apply(context, current.matrix);
    };

    context.rotate = function(angle) {
        var cos = Math.cos(angle);
        var sin = Math.cos(angle);

        multiplyCurrent([cos, -1 * sin, sin, cos, 0, 0]);

        iSetTransform.apply(context, current.matrix);
    };

    context.translate = function(x, y) {
        multiplyCurrent([1, 0, 0, 1, x, y]);
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

    context.print = function() {
        var s = ''
        s += current.matrix[0] + ' ' + current.matrix[2] + ' ' + current.matrix[4] + '\n';
        s += current.matrix[1] + ' ' + current.matrix[3] + ' ' + current.matrix[5] + '\n';
        s += '0 0 1';

        console.log(s);
    };
};