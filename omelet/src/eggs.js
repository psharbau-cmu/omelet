(function() {
    var EggData = function(name, constructor) {
        var referenceNeeds = null;
        var defaultValues = null;
        var requirements = null;

        // check constructor inputs and call constructor
        this.create = function(data, refs, self) {
            if (!self) return;

            data = data || {};
            refs = refs || {};

            if (requirements) {
                requirements.forEach(function(requirement) {
                    if (!self[requirement]) {
                        console.log('Entity missing required component: ' + name + ' needs ' + requirement);
                        return;
                    }
                });
            }

            if (referenceNeeds) {
                for (var p in referenceNeeds) {
                    if (!refs.hasOwnProperty(p) || !refs[p]) {
                        console.log('Entity missing needed reference: ' + name + ' references an entity for ' + p + ' needing a ' + referenceNeeds[p]);
                        return;
                    } else if (!refs[p][referenceNeeds[p]]) {
                        console.log('Referenced entity missing needed component: ' + name + ' references an entity for ' + p + ' that needs a ' + referenceNeeds[p]);
                        return;
                    }
                }
            }

            if (defaultValues) {
                for (var p in defaultValues) {
                    if (!data.hasOwnProperty(p)) data[p] = defaultValues[p];
                }
            }

            return new constructor(data, refs);
        };

        // object with name -> component type
        this.references = function(refNeeds) {
            referenceNeeds = referenceNeeds || refNeeds;
            return this;
        };

        // array of component types needed on this entity
        this.requires = function(selfNeeds) {
            requirements = requirements || selfNeeds;
            return this;
        };

        // object that has default values for everything that will be passed into data
        this.defaults = function(dataDefaults) {
            defaultValues = defaultValues || dataDefaults;
            return this;
        };
    };

    window.omelet.salt('egg', function(state) {
        var eggs = {};
        state.eggs = eggs;

        return function(name, constructor) {
            if (!name || !constructor) return;
            var newEgg = new EggData(name, constructor);
            eggs[name] = newEgg;
            return newEgg;
        };
    });
})();