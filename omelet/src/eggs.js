(function() {
    var EggData = function(name, constructor) {
        var referenceNeeds = null;
        var defaultValues = null;
        var requirements = null;
        var propertyDefs = null;

        // check constructor inputs and call constructor
        this.create = function(data, refs, self) {
            if (!self) return;

            data = data || {};
            refs = refs || {};

            if (requirements) {
                requirements.forEach(function(requirement) {
                    if (!self.hasOwnProperty(requirement)) {
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

            try {
                return referenceNeeds ? [new constructor(data, refs), referenceNeeds , refs] : new constructor(data, refs);
            } catch (err) {
                console.log("Error calling constructor for type: " + name + " error: " + err);
            }
        };

        // object with name -> component type
        this.references = function(refNeeds) {
            if (!refNeeds || refNeeds.constructor !== Object) console.log('Error setting references.  Must be non-null object with name -> component types.');
            referenceNeeds = referenceNeeds || refNeeds;
            return this;
        };

        // array of component types needed on this entity
        this.requires = function(selfNeeds) {
            if (!selfNeeds || selfNeeds.constructor !== Array) console.log('Error setting requirements.  Must be an array of required types for this entity.');
            requirements = requirements || selfNeeds;
            return this;
        };

        // object that has default values for everything that will be passed into data
        this.defaults = function(dataDefaults) {
            if (!dataDefaults || dataDefaults.constructor !== Object) console.log('Error setting defaults.  Must be non-null object with name -> default values.');
            defaultValues = defaultValues || dataDefaults;
            return this;
        };

        // describe properties and allowed values with json schema
        this.describe = function(propertyDefinitions) {
            if (!propertyDefinitions || propertyDefinitions.constructor !== Object) console.log('Error describing properties.  Must be a non-null object representing data properties in json schema format.');
            propertyDefs = propertyDefs || propertyDefinitions;
            return this;
        };

        this.getMetaData = function() {
            return {
                defaults:defaultValues,
                requires:requirements,
                references:referenceNeeds,
                propertyDefinitions:propertyDefs
            };
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