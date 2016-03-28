window.omelet.egg('duel.flicker', function(data, refs) {

    var timeToFlicker = (Math.random() * 30) + 0.25;
    var timeToReturn;
    var lightOn = true;
    var poly = null;
    
    this.ready = function(scene, entity) {
        poly = entity['omelet.shapes.polygon'];
        var randLight = Math.random() * 3;
        poly.fillColor = randLight < 1 ? "#0c0c03" : randLight < 2 ? "#111100" : "#222211";
    };

    this.update = function(deltaTime) {
        timeToFlicker -= deltaTime;
        if (lightOn && timeToFlicker < 0) {
            poly.fillColor = null;
            lightOn = false;
            timeToReturn = (Math.random() * -15) - 0.25;
        } else if (timeToFlicker < timeToReturn) {
            lightOn = true;
            var randLight = Math.random() * 3;
            poly.fillColor = randLight < 1 ? "#0c0c03" : randLight < 2 ? "#111100" : "#222211";
            timeToFlicker = (Math.random() * 30) + 0.25;
        }
    };

}).requires(['omelet.shapes.polygon']);