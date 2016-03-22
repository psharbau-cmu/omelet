window.omelet.salt('getJSONSchema', function(state) {
    return function() {
        var baseObj = {
            '$schema':'http://json-schema.org/draft-04/schema#',
            'title':'OmeletEntityList',
            'description':'Schema for a list of omelet entities using loaded eggs.',
            'type':'object',
            'properties':{
                'assets':{'type':'array', 'items':{'$ref':'#/definitions/Entity'}},
                'the':{'type':'array', 'items':{'$ref':'#/definitions/Entity'}},
                'hierarchy':{'type':'array', 'items':{'$ref':'#/definitions/Entity'}}
            },
            'definitions':{
                'Entity':{
                    'type':'object',
                    'properties':{
                        'key':{'type':'string'},
                        'name':{'type':'string'},
                        'children':{
                            'type':'array',
                            'items':{'$ref':'#/definitions/Entity'}
                        }
                    }
                }
            }
        };

        var entityProperties = baseObj.definitions.Entity.properties;

        var addToEntities = function(name, meta) {
            var propertyObj = {
                'type':'object',
                'properties':{
                    'data':{'type':'object', 'properties':{}},
                    'refs':{'type':'object', 'required':[], 'properties':{}}
                }
            };

            if (meta && meta.propertyDefinitions) {
                propertyObj.properties.data.properties = meta.propertyDefinitions;
            }

            if (meta && meta.references) {
                for (var r in meta.references) {
                    propertyObj.properties.refs.required.push(r);
                    propertyObj.properties.refs.properties[r] = {'type':'string'};
                }
            }

            entityProperties[name] = propertyObj;
        };

        for (var egg in state.eggs) {
            addToEntities(egg, state.eggs[egg].getMetaData());
        }

        return baseObj;
    };
});
