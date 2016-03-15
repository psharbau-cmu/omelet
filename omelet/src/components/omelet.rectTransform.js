omelet.egg('omelet.rectTransform', function(data, refs) {
    this.left = data.left;
    this.top = data.top;
    this.right = data.right;
    this.bottom = data.bottom;
    this.offsetLeft = data.offsetLeft;
    this.offsetTop = data.offsetTop;
    this.offsetRight = data.offsetRight;
    this.offsetBottom = data.offsetBottom;
    
    this.transform = function(wrapper) {
        var rect = wrapper.getRect();
        var x = (this.left * rect[2]) + this.offsetLeft;
        var y = (this.top * rect[3]) + this.offsetTop;
        var w = (this.right * rect[2]) -  this.offsetRight - x;
        var h = (this.bottom * rect[3]) - this.offsetBottom - y;
        rect = [rect[0] + x, rect[1] + y, w, h];
        wrapper.setRect(rect);
    };
}).defaults({
    left:0,
    top:0,
    right:1,
    bottom:1,
    offsetLeft:10,
    offsetTop:10,
    offsetRight:10,
    offsetBottom:10
});
