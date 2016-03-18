(function() {

    var processThings = function(arrayOfThings, eggs, scene) {
        var topLevelEntities = [];
        var keyToEntityMap = {};

        arrayOfThings.forEach(function(thing) {
           if (thing) {
               var entity = new OmeletEntity();
               if (entity.matchData(thing, keyToEntityMap)) topLevelEntities.push(entity);
           }
        });

        topLevelEntities.forEach(function(entity) {
            if (scene) {
                entity.realize(keyToEntityMap, eggs, scene.assets, scene.the);
            } else {
                entity.realize(keyToEntityMap, eggs);
            }
        });

        return topLevelEntities;
    };

    var runtimeOnlyProperties = {
        components      :true,
        onScreenNode    :true,
        screenSort      :true,
        hasChildren     :true,
        children        :false,
        key             :false,
        name            :false,
        update          :true,
        preDraw         :true,
        draw            :true,
        transform       :true,
        mouseEnter      :true,
        mouseExit       :true,
        mouseUp         :true,
        mouseDown       :true,
        mouseClick      :true
    };

    var OmeletEntity = function() {
        this.components = []; // array of string component names
        this.onScreenNode = null; // reference to on screen sort node
        this.screenSort = []; // array of numbers that represent sorting layer, most significant first
        this.hasChildren = false; // if the entity has children
        this.children = []; // list of children entities
        this.key = ''; // string key unique to this entity
        this.name = ''; // string name of entity, does not need to be unique
    };

    OmeletEntity.prototype.matchData = function(data, keyMap) {
        if (!data || !keyMap || data.constructor !== Object || keyMap.constructor !== Object) {
            console.log('Error matching data.  Data obj or key map is falsy or not an Object.');
            return false;
        }

        // process name
        if (data.name) {
            if (data.name.constructor === String) {
                this.name = data.name;
            } else {
                console.log("Error matching data.  Non-string name ignored.");
            }
        }

        // process key
        if (data.key) {
            if (data.key.constructor === String) {
                this.key = data.key;
                keyMap[data.key] = this;
            } else {
                console.log("Error matching data.  Non-string key ignored.");
            }
        }

        // process children
        if (data.children) {
            if (data.children.constructor === Array) {
                var entity = this;
                data.children.forEach(function(childData) {
                    var child = new OmeletEntity();
                    if (child.matchData(childData, keyMap)) {
                        entity.hasChildren = true;
                        entity.children.push(child);
                    }
                });
            } else {
                console.log("Error matching data.  Non-array children ignored.");
            }
        }

        // process component types
        for (var property in data) {
            if (runtimeOnlyProperties[property]) {
                console.log("Error matching data. Data contains a runtime only property: " + property);
                return false;
            } else if (!runtimeOnlyProperties.hasOwnProperty(property)) {
                if (this[property]) {
                    console.log("Error matching data.  Duplicate component type on entity not allowed: " + property);
                } else {
                    this.components.push(property);
                    this[property] = data[property];
                }
            }
        }

        return true;
    };

    OmeletEntity.prototype.realize = function(keyMap, eggs, assets, the) {
        if (!keyMap || !eggs || keyMap.constructor !== Object || eggs.constructor !== Object) {
            console.log('Error realizing entity.  Key map or egg carton is falsy or not an Object.');
            return;
        }

        var transform       = null,
            preDraw         = null,
            draw            = null;
        var updateList      = [],
            mouseEnterList  = [],
            mouseExitList   = [],
            mouseDownList   = [],
            mouseUpList     = [],
            mouseClickList  = [];

        // loop through component types
        var entity = this;
        this.components.forEach(function(component) {
            if (!eggs[component]) {
                console.log('Error realizing component.  No egg registered for type: ' + component);
                return;
            }

            var dataObj = entity[component];
            var data = dataObj != null ? dataObj.data : null;
            var refs = dataObj != null ? dataObj.refs : null;

            if (refs != null && refs.constructor === Object) {
                for (var ref in refs) {
                    var refedKey = refs[ref];
                    if (refedKey && refedKey.constructor !== String) {
                        console.log("Error realizing component.  Referenced value is not a string.");
                    } else if (keyMap[refedKey]) {
                        refs[ref] = keyMap[refedKey];
                    } else if (assets && assets[refedKey]) {
                        refs[ref] = assets[refedKey];
                    } else if (the && the[refedKey]) {
                        refs[ref] = the[refedKey];
                    } else {
                        console.log("Error realizing component.  An entity with name: " + this.name + " references an entity for: " + ref + " with missing key: " + refedKey);
                    }
                };
            }

            // create runtime egg
            var createdEgg = eggs[component].create(data, refs, entity) || {};
            entity[component] = createdEgg;

            // check egg for "abstractions"
            if (createdEgg.transform && createdEgg.transform.constructor === Function) {
                if (transform) {
                    console.log("Error realizing component.  Entity contains two eggs with transform functions.  Only one allowed.  Name: " + this.name + "  Key: " + this.key);
                } else {
                    transform = createdEgg;
                }
            }
            if (createdEgg.preDraw && createdEgg.preDraw.constructor === Function) {
                if (preDraw) {
                    console.log("Error realizing component.  Entity contains two eggs with preDraw functions.  Only one allowed.  Name: " + this.name + "  Key: " + this.key);
                } else {
                    preDraw = createdEgg;
                }
            }
            if (createdEgg.draw && createdEgg.draw.constructor === Function) {
                if (draw) {
                    console.log("Error realizing component.  Entity contains two eggs with draw functions.  Only one allowed.  Name: " + this.name + "  Key: " + this.key);
                } else {
                    draw = createdEgg;
                }
            }
            if (createdEgg.update && createdEgg.update.constructor === Function) updateList.push(createdEgg);
            if (createdEgg.mouseEnter && createdEgg.mouseEnter.constructor === Function) mouseEnterList.push(createdEgg);
            if (createdEgg.mouseExit && createdEgg.mouseExit.constructor === Function) mouseExitList.push(createdEgg);
            if (createdEgg.mouseUp && createdEgg.mouseUp.constructor === Function) mouseUpList.push(createdEgg);
            if (createdEgg.mouseDown && createdEgg.mouseDown.constructor === Function) mouseDownList.push(createdEgg);
            if (createdEgg.mouseClick && createdEgg.mouseClick.constructor === Function) mouseClickList.push(createdEgg);
        });

        // build shortcut functions if "abstractions" are present
        if (transform){
            this.transform = function(wrappedContext) {
                try {
                    return transform.transform(wrappedContext);
                } catch (err) {
                    console.error(err);
                }
            };
        }
        if (preDraw && draw) {
            this.preDraw = function(snapShot) {
                try {
                    return preDraw.preDraw(snapShot);
                } catch (err) {
                    console.error(err);
                }
            };
            this.draw = function() {
                try {
                    return draw.draw();
                } catch (err) {
                    console.error(err);
                }
            };
        } else if (preDraw || draw) {
            console.log("Error realizing component.  Component must define both preDraw and draw, or neither.");
        }
        if (updateList.length > 0) this.update = function(deltaTime) {
            updateList.forEach(function(thing) {
                try {
                    thing.update(deltaTime);
                } catch (err) {
                    console.error(err);
                }
            });
        };
        if (mouseEnterList.length > 0) this.mouseEnter = function() {
            mouseEnterList.forEach(function(thing) {
                try {
                    thing.mouseEnter();
                } catch (err) {
                    console.error(err);
                }
            });
        };
        if (mouseExitList.length > 0) this.mouseExit = function() {
            mouseExitList.forEach(function(thing) {
                try {
                    thing.mouseExit();
                } catch (err) {
                    console.error(err);
                }
            });
        };
        if (mouseUpList.length > 0) this.mouseUp = function() {
            mouseUpList.forEach(function(thing) {
                try {
                    thing.mouseUp();
                } catch (err) {
                    console.error(err);
                }
            });
        };
        if (mouseDownList.length > 0) this.mouseDown = function() {
            mouseDownList.forEach(function(thing) {
                try {
                    thing.mouseDown();
                } catch (err) {
                    console.error(err);
                }
            });
        };
        if (mouseClickList.length > 0) this.mouseClick = function() {
            mouseClickList.forEach(function(thing) {
                try {
                    thing.mouseClick();
                } catch (err) {
                    console.error(err);
                }
            });
        };

        if (this.hasChildren) {
            this.children.forEach(function(child) {
                child.realize(keyMap, eggs, assets, the);
            });
        }
    };

    window.omelet.salt(null, function(state) {
        state.realize = function(toBeRealized, scene) {
            if (!toBeRealized) {
                console.log("Error realizing data.  Falsy input cannot be realized.");
            } else if (toBeRealized.constructor === String) {
                try {
                    var parsed = JSON.parse(toBeRealized);
                    if (parsed.constructor !== Array) {
                        console.log("Error realizing data, input must be JSON representation of array.");
                    } else {
                        return processThings(parsed, state.eggs, scene);
                    }
                } catch (err) {
                    console.log("Error realizing data.  JSON parse failed: " + err);
                }
            } else {
                console.log('Error realizing data.  Data Objects are not supported with prototypes of: ' + toBeRealized.constructor);
            }
        };
    });

    window.omelet.salt(null, function(state) {
        state.checkIsEntity = function(maybeEntity) {
            return maybeEntity && maybeEntity.constructor === OmeletEntity;
        };
    });
})();