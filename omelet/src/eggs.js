var EggData = function(name, constructor) {
    var referenceNeeds = null;
    var defaultValues = null;
    var requirements = null;

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
                if (!refs.hasOwnProperty(p)) {
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

    this.references = function(refNeeds) {
        referenceNeeds = refNeeds;
        return this;
    };

    this.requires = function(selfNeeds) {
        requirements = selfNeeds;
        return this;
    };

    this.defaults = function(dataDefaults) {
        defaultValues = dataDefaults;
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