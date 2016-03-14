(function() {
    var TrieNode = function(entity, trie) {
        entity.onScreenNode = this;
        this.entity = entity;
        this.parent = trie;
    };

    TrieNode.prototype.remove = function() {
        this.entity.onScreenNode = null;
        this.parent.removeNode(this);
    };

    var Trie = function(key, parent) {
        this.key = key;
        this.parent = parent;
        this.keys = [];
        this.children = {};
        this.nodes = [];
    };

    Trie.prototype.insert = function(entity, keyPart) {
        if (!entity) return;
        if (keyPart === undefined) keyPart = entity.screenSort ? entity.screenSort.slice() : [0];
        if (keyPart.length < 1) {
            this.nodes.push(new TrieNode(entity, this));
        } else {
            var key = keyPart.shift();

            if (!this.children[key]) {
                var oldKeys = this.keys;
                this.keys = [];
                var position = 0;
                var addedKey = false;
                while (position < oldKeys.length) {
                    if (!addedKey && oldKeys[position] > key) {
                        this.keys.push(key);
                        addedKey = true;
                    }
                    this.keys.push(oldKeys[position]);
                    position += 1;
                }
                if (!addedKey) this.keys.push(key);
                this.children[key] = new Trie(key, this);
            }

            this.children[key].insert(entity, keyPart);
        }
    };

    Trie.prototype.removeNode = function(node) {
        var position = 0;
        while (position < this.nodes.length) {

            if (this.nodes[position] === node) {
                this.nodes.splice(position, 1);
                if (this.keys.length < 1 && this.nodes.length < 1 && this.parent) this.parent.removeTrie(this.key);
                return;
            }

            position += 1;
        }
    };

    Trie.prototype.removeTrie = function(trieKey) {
        delete this.children[trieKey];

        var position = 0;
        while (position < this.keys.length) {
            if (this.keys[position] == trieKey) {
                this.keys.splice(position, 1);
                if (this.keys.length < 1 && this.nodes.length < 1 && this.parent) this.parent.removeTrie(this.key);
                return;
            }

            position += 1;
        }
    };

    Trie.prototype.drawNodes = function(results) {
        this.nodes.forEach(function(node) {
            var result = node.entity.draw();
            if (result) results.push({box:result, entity: node.entity});
        });
    };

    Trie.prototype.draw = function(results) {
        var position = 0;
        var drewNodes = false;
        while (position < this.keys.length) {
            var key = this.keys[position];

            if (!drewNodes && key > 0) {
                drewNodes = true;
                this.drawNodes(results);
            }

            this.children[key].draw(results);
            position += 1;
        }

        if (!drewNodes) this.drawNodes(results);
    };

    window.omelet.salt(null, function(state) {
        state.createOnScreenTree = function() {
            var root = new Trie();

            return {
                insert:function(entity) {
                    root.insert(entity);
                },

                draw:function() {
                    var boxes = [];
                    root.draw(boxes);
                    return boxes;
                }
            };
        };
    });
});
