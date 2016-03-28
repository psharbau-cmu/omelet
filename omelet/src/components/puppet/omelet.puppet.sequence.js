window.omelet.egg('omelet.puppet.sequence', function(data, refs) {
    this.sequences = data.sequences;

    var poser = null;
    var sequence = null;
    var time, position;

    this.ready = function(scene, entity) {
        poser = entity["omelet.puppet.poses"];
    };

    this.playSequence = function(sequenceName) {
        sequence = this.sequences[sequenceName];
        time = 0;
        position = 0;
    };

    this.update = function(deltaTime) {
        if (!sequence) return;

        time += deltaTime;
        if (time >= sequence[position].atTime) {
            var data = sequence[position];
            poser.transition(data.pose, data.duration, data.ease, data.easeExp);

            position += 1;
            if (position == sequence.length) sequence = null;
        }
    };
}).defaults({
    sequences:{}
}).requires([
    "omelet.puppet.poses"
]).describe({
    "sequences":{
        "type":"object",
        "patternProperties":{
            ".*":{
                "type":"array",
                "items":{
                    "type":"object",
                    "required":["atTime", "pose", "duration", "ease", "easeExp"],
                    "properties":{
                        "atTime":{"type":"number"},
                        "pose":{"type":"string"},
                        "duration":{"type":"number"},
                        "ease":{"type":"string"},
                        "easeExp":{"type":"number"}
                    }
                }
            }
        }
    }
});