(function() {
    var Scene = function(state) {
        var nextRandomKey = 42;
        var initialized = false;

        this.camera = {
            x:0,
            y:0,
            angle:0,
            zoom:1,
            rotate90:false
        };
        this.assets = {};
        this.layers = {};
        this.the = {};
        this.hierarchy = [];
        this.mousePosition = [0, 0];
        this.mouseDown = false;

        this.setLayers = function(layerObj) {
            if (!layerObj || !layerObj.constructor === Object) return;
            for (var layer in this.layers) delete this.layers[layer];
            for (var layer in layerObj) {
                if (layerObj.hasOwnProperty(layer)) {
                    var layerValue = layerObj[layer];
                    if (layerValue && layerValue.constructor === Number) this.layers[layer] = layerObj[layer];
                }
            }
        };

        this.addData = function(stringData) {
            var dataObj = state.realize(stringData, this) || {};
            if (dataObj.assets) addAssets(dataObj.assets, this);
            if (dataObj.the) addToThe(dataObj.the, this);
            if (dataObj.hierarchy) addToHierarchy(dataObj.hierarchy, this);
        };

        var addAssets = function(realized, scene) {
            if (!realized) return;
            realized.forEach(function(entity) {
                var place = entity.key || entity.name;
                if (!place || scene.assets[place]) {
                    place = nextRandomKey.toString();
                    nextRandomKey += 1; // pretty evenly distributed over time
                }
                scene.assets[place] = entity;
            });

            var scene = this;
            if (initialized) realized.forEach(function(entity) {
                callPreReady(entity, scene);
                callReady(entity, scene);
            });
        };

        var addToThe = function(realized, scene) {
            if (!realized) return;
            realized.forEach(function(entity) {
                entity.components.forEach(function(componentName) {
                    if (scene.the[componentName]) {
                        console.log("Error adding component to the, the already contains a component of type: " + componentName);
                    } else {
                        scene.the[componentName] = entity[componentName];
                    }
                });
            });

            if (initialized) realized.forEach(function(entity) {
                callPreReady(entity, scene);
                callReady(entity, scene);
            });
        };

        var addToHierarchy = function(realized, scene) {
            if (!realized) return;
            realized.forEach(function(entity) {
                scene.hierarchy.push(entity);
            });

            if (initialized) realized.forEach(function(entity) {
                callPreReady(entity, scene);
                callReady(entity, scene);
            });
        };

        this.removeFromHierarchy = function(entity) {
            if (!state.checkIsEntity(entity)) {
                console.log("Error removing entity from hierarchy.  Argument entity is not of type OmeletEntity.");
                return;
            }

            checkForOnScreenNodeAndRemove(entity);
            if (!removeFromList(this.hierarchy, entity)) {
                console.log("Error removing entity from hierarchy.  Entity could not be found in this scene.");
                return;
            }
        };

        this.clearHeirarchy = function() {
            this.hierarchy.forEach(checkForOnScreenNodeAndRemove);
            while (this.hierarchy.length > 0) this.hierarchy.pop();
        };

        this.initialize = function() {
            if (initialized) return;
            initialized = true;
            for (var p in this.assets) {
                callPreReady(this.assets[p], scene);
                callReady(this.assets[p], this);
            }
            for (var p in this.the) {
                callPreReady(this.the[p], scene);
                callReady(this.the[p], this);
            }
            var scene = this;
            this.hierarchy.forEach(function(entity) {
                callPreReady(entity, scene);
                callReady(entity, scene);
            });
        };

        this.update = function(deltaTime) {
            for (var componentKey in this.the) {
                var component = this.the[componentKey];
                if (component.update && component.update.constructor === Function) {
                    try {
                        component.update(deltaTime);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }

            this.hierarchy.forEach(function(entity) {
                callUpdate(entity, deltaTime);
            });
        };

        this.findEntityForKey = function(key) {
            if (this.assets.hasOwnProperty(key)) return this.assets[key];
            if (this.the.hasOwnProperty(key)) return this.the[key];
            var searchListForKey = function(listOfEntities) {
                for (var i = 0; i < listOfEntities.length; i++) {
                    var thisEntity = listOfEntities[i];
                    if (thisEntity.key === key) return thisEntity;
                    if (thisEntity.hasChildren) {
                        var found = searchListForKey(thisEntity.children);
                        if (found) return found;
                    }
                }
            };

            return searchListForKey(this.hierarchy);
        };

        var removeFromList = function(listOfEntities, entity) {
            for (var i = 0; i < listOfEntities.length; i++) {
                if (listOfEntities[i] === entity) {
                    listOfEntities.splice(i, 1);
                    return true;
                } else if (listOfEntities[i].hasChildren) {
                    if (removeFromList(listOfEntities[i].children, entity)) return true;
                }
            }
            return false;
        };

        var checkForOnScreenNodeAndRemove = function(entity) {
            if (entity.onScreenNode) entity.onScreenNode.remove();
            if (entity.hasChildren) {
                entity.children.forEach(checkForOnScreenNodeAndRemove);
            }
        };

        var callUpdate = function(entity, deltaTime) {
            if (entity.update) entity.update(deltaTime);
            if (entity.hasChildren) entity.children.forEach(function(child) {
                callUpdate(child, deltaTime);
            });
        };

        var callPreReady = function(entity, scene) {
            entity.components.forEach(function(componentKey) {
                var component = entity[componentKey];

                if (component.constructor === Array) {
                    var instance = component[0];
                    var needs = component[1];
                    var refsObj = component[2];

                    for (var need in needs) {
                        var satisfier = refsObj[need][needs[need]];
                        if (satisfier.constructor === Array) satisfier = satisfier[0];
                        refsObj[need] = satisfier;
                    }

                    entity[componentKey] = instance;
                }
            });

            if (entity.hasChildren) entity.children.forEach(function(child) {
                callPreReady(child, scene);
            });
        };

        var callReady = function(entity, scene) {
            entity.components.forEach(function(componentKey) {
                var component = entity[componentKey];

                if (component.ready && component.ready.constructor === Function) {
                    component.ready(scene, entity);
                }
            });
            if (entity.hasChildren) entity.children.forEach(function(child) {
                callReady(child, scene);
            });
        };
    };

    window.omelet.salt('createEmptyScene', function(state) {
        return function() {
            return new Scene(state);
        };
    });

    window.omelet.salt(null, function(state) {
        state.checkIsScene = function(maybeScene) {
            return maybeScene && maybeScene.constructor === Scene;
        };
    });
})();