omelet.egg('omelet.sprites.spriteSheet', function(data, refs) {
    this.image = new Image();
    this.sprites = data.sprites;
    this.loaded = false;

    var sheet = this;
    this.image.addEventListener('load', function() {
        sheet.loaded = true;
    });

    this.image.src = data.src;
}).defaults({
    src:'./Omelet.png',
    sprites:{
        'Default':{
            x:0,
            y:0,
            width:400,
            height:400,
            pivotX:200,
            pivotY:200
        }
    }
});