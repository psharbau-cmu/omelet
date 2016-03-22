window.omelet.egg('omelet.sprites.spriteSheet', function(data, refs) {
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
}).describe({
    src:{type:'string'},
    sprites:{
        type:'object',
        patternProperties:{
            '.*':{
                type:'object',
                required:['x', 'y', 'width', 'height', 'pivotX', 'pivotY'],
                properties: {
                    'x':{type:'number'},
                    'y':{type:'number'},
                    'width':{type:'number'},
                    'height':{type:'number'},
                    'pivotX':{type:'number'},
                    'pivotY':{type:'number'}
                }
            }
        }
    }
});