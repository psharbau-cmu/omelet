window.omelet.egg('omelet.puppet.poses', function(data, refs) {
    this.poses = data.poses;
    var parts = {};
    var children = null;

    var transition = null;

    this.ready = function(scene, entity) {
        children = entity;
        if (data.defaultPose) this.setPose(data.defaultPose);
    };

    this.setPose = function(poseName) {
        transition = null;
        var pose = this.poses[poseName];
        if (!pose) {
            console.warn("No data for a pose named: " + poseName);
        }

        for (var part in pose) {
            if (!parts.hasOwnProperty(part)) {
                parts[part] = children.getChildByName(part, 'omelet.transform');
            }

            if (!parts[part]) {
                console.error("Cannot set pose: " + poseName + " because there is no child part named: " + part);
                return;
            }
        }

        for (var part in pose) {
            var partTransform = parts[part];
            var poseData = pose[part];
            if (poseData.hasOwnProperty("x")) partTransform.x = poseData.x;
            if (poseData.hasOwnProperty("y")) partTransform.y = poseData.y;
            if (poseData.hasOwnProperty("angle")) partTransform.angle = poseData.angle;
        }
    };

    this.transition = function(poseName, duration, ease, easeExp) {
        if (!poseName) return;
        var pose = this.poses[poseName];
        if (!pose) return;

        var transitions = [];

        for (var part in pose) {
            for (var part in pose) {
                if (!parts.hasOwnProperty(part)) {
                    parts[part] = children.getChildByName(part, 'omelet.transform');
                }

                var transform = parts[part];

                if (!transform) {
                    console.error("Cannot set pose: " + poseName + " because there is no child part named: " + part);
                    return;
                }

                var partTransition = {
                    start:{},
                    end:{},
                    transform:transform
                };

                var poseData = pose[part];

                if (poseData.hasOwnProperty("x")) {
                    var start = transform.x;
                    if (start != poseData.x) {
                        partTransition.start.x = start;
                        partTransition.end.x = poseData.x; 
                    }                    
                }

                if (poseData.hasOwnProperty("y")) {
                    var start = transform.y;
                    if (start != poseData.y) {
                        partTransition.start.y = start;
                        partTransition.end.y = poseData.y;
                    }
                }

                if (poseData.hasOwnProperty("angle")) {
                    var start = transform.angle;
                    if (start != poseData.angle) {
                        partTransition.start.angle = start;
                        partTransition.end.angle = poseData.angle;
                    }                    
                }

                transitions.push(partTransition);
            }
        }

        duration = duration || 0.00001;
        if (duration <= 0) duration = 0.00001;
        ease = ease || 'linear';
        easeExp = easeExp || 3;

        if (ease.constructor === String) {
            switch (ease) {
                case 'ease-out':
                    ease = function(linear) { return 1 - Math.pow((1 - linear), easeExp); };
                    break;
                case 'ease-in':
                    ease = function(linear) { return Math.pow(linear, easeExp); };
                    break;
                case 'ease-out-in':
                    ease = function(linear) {
                        return linear < 0.5 ? (1 - Math.pow(1 - (2 * linear), easeExp)) / 2 : (0.5 + Math.pow(2 * (linear - 0.5), easeExp)) / 2;
                    };
                    break;
                case 'ease-in-out':
                    ease = function(linear) {
                        return linear < 0.5 ? Math.pow(2 * linear, easeExp) / 2 : (2 - Math.pow(1 - (2 * (linear - 0.5)), easeExp)) / 2;
                    };
                    break;
                case 'linear':
                default:
                    ease = function(linear) { return linear; };
                    break;
            }
        } else if (ease.constructor !== Function) {
            ease = function(linear) { return linear; };
        }

        transition = {
            progress: 0,
            duration: duration,
            ease: ease,
            parts:transitions
        };
    };

    this.update = function(deltaTime) {
        if (!transition) return;

        transition.progress += deltaTime / transition.duration;
        if (transition.progress > 1) transition.progress = 1;

        var easedProgress = transition.ease(transition.progress);

        transition.parts.forEach(function(part) {
            for (var property in part.start) {
                var s = part.start[property];
                var e = part.end[property];
                part.transform[property] = s + ((e - s) * easedProgress);
            }
        });

        if (transition.progress == 1) transition = null;
    }
}).defaults({
    poses:{},
    defaultPose:null
}).describe({
    "defaultPose":{"type":"string"},
    "poses":{
        "type":"object",
        "patternProperties":{
            ".*":{
                "type":"object",
                "patternProperties":{
                    ".*":{
                        "type":"object",
                        "properties": {
                            "x": {"type": "number"},
                            "y": {"type": "number"},
                            "angle": {"type": "number"}
                        }
                    }
                }
            }
        }
    }
});