(function() {
    var Scene = function(state) {
        var nextRandomKey = 42;

        this.camera = {
            x:0,
            y:0,
            angle:0,
            zoom:1
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

        this.addAssets = function(assetList) {
            var realized = state.realize(assetList);
            if (!realized) return;
            realized.forEach(function(entity) {
                var place = entity.name || entity.key;
                if (!place || this.assets[place]) {
                    place = nextRandomKey.toString();
                    nextRandomKey += 1; // pretty evenly distributed over time
                }
                this.assets[place] = entity;
            });
        };

        this.addToThe = function(theList) {
            var realized = state.realize(theList);
            if (!realized) return;
            realized.forEach(function(entity) {
                var place = entity.name || entity.key;
                if (!place || this.the[place]) {
                    place = nextRandomKey.toString();
                    nextRandomKey += 1; // pretty evenly distributed over time
                }
                this.the[place] = entity;
            });
        };

        this.addToHierarchy = function(hierarchyList) {
            var realized = state.realize(hierarchyList);
            if (!realized) return;
            realized.forEach(function(entity) {
                this.hierarchy.push(entity);
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
            while (this.hierarchy.count > 0) this.hierarchy.pop();
        };

        this.update = function(deltaTime) {
            for (var entityKey in this.the) {
                var entity = this.the[entityKey];
                callUpdate(entity, deltaTime);
            }

            this.hierarchy.forEach(function(entity) {
                callUpdate(entitiy, deltaTime);
            });
        };

        var removeFromList = function(listOfEntities, entity) {
            for (var i = 0; i < list.length; i++) {
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