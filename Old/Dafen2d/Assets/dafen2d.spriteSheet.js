(function() {
    window.dafen2d = window.dafen2d || {};
    window.dafen2d.assetTypes = window.dafen2d.assetTypes || [];
    window.dafen2d.assetTypes['dafen2d.spriteSheet'] = {

        createAsset:function(data) {
            if (!data) data = {};

            var image = new Image();

            var asset = {
                image:image,
                sprites:data.sprites || {},
                loaded:false
            };

            image.src = data.src;
            image.onload = function() {
                asset.loaded = true;
            }

            return asset;
        }

    };
})();