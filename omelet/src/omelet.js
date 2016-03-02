// Copyright 2016 Patrick Sharbaugh

(function() {
    // internal state object
    var state = {};

    window.omelet = {
        salt:function(name, builder) {
            if (!builder) return;
            var thing = builder(state);
            if (name && thing) window.omelet[name] = thing;
        }
    };
})();

