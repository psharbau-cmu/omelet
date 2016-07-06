window.omelet.egg('omelet.rectTransform', function(data, refs) {
    this.left = data.left;  // \
    this.top = data.top;    //  \       this code
    this.right = data.right; //  \_
    this.bottom = data.bottom; //  \_____    looks like it
    this.offsetLeft = data.offsetLeft; //\
    this.offsetTop = data.offsetTop;   // \      would be a fun hill
    this.offsetRight = data.offsetRight;// \
    this.offsetBottom = data.offsetBottom;//\___
    this.minWidthPixels = data.minWidthPixels;//\_        to roll down.
    this.minHeightPixels = data.minHeightPixels;//\
    this.maxWidthPercent = data.maxWidthPercent; //|
    this.maxHeightPercent = data.maxHeightPercent;//\
    
    this.transform = function(wrapper) {
        var rect = wrapper.getRect();
        var parentWidth = rect[2];
        var parentHeight = rect[3];

        var x = (this.left * parentWidth) + this.offsetLeft;
        var y = (this.top * parentHeight) + this.offsetTop;
        var w = (this.right * parentWidth) -  this.offsetRight - x;
        var h = (this.bottom * parentHeight) - this.offsetBottom - y;

        if (w < this.minWidthPixels) {
            x -= (this.minWidthPixels - w) / 2;
            w = this.minWidthPixels;
        }
        if (h < this.minHeightPixels) {
            y -= (this.minHeightPixels - h) / 2;
            h = this.minHeightPixels;
        }
        if (parentWidth != 0 && (w / parentWidth) > this.maxWidthPercent) {
            var dw = this.maxWidthPercent * parentWidth;
            x += (w - dw) / 2;
            w = dw;
        }
        if (parentHeight != 0 && (h / parentHeight) > this.maxHeightPercent) {
            var dh = this.maxHeightPercent * parentHeight;
            y += (h - dh) / 2;
            h = dh;
        }

        rect = [rect[0] + x, rect[1] + y, w, h];
        this.actualWidth = w;
        this.actualHeight = h;
        wrapper.setRect(rect);
    };
}).defaults({
    left:0,
    top:0,
    right:1,
    bottom:1,
    offsetLeft:0,
    offsetTop:0,
    offsetRight:0,
    offsetBottom:0,
    minWidthPixels:0,
    minHeightPixels:0,
    maxWidthPercent:2,
    maxHeightPercent:2
}).describe({
    left:{type:'number'},
    top:{type:'number'},
    right:{type:'number'},
    bottom:{type:'number'},
    offsetLeft:{type:'number'},
    offsetTop:{type:'number'},
    offsetRight:{type:'number'},
    offsetBottom:{type:'number'},
    minWidthPixels:{type:'number'},
    minHeightPixels:{type:'number'},
    maxWidthPercent:{type:'number'},
    maxHeightPercent:{type:'number'}
});
