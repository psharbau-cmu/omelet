
// based on: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree
(function() {

    var TreeNode = function(tree) {
        this.value = null;
        this.color = true;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.tree = tree;
    };

    TreeNode.prototype.grandparent = function() {
        if (!this.parent) return null;
        else return this.parent.parent;
    };

    TreeNode.prototype.sibling = function() {
        if (!this.parent) return null;

        if (this == this.parent.left) return this.parent.right;
        else return this.parent.left;
    };

    TreeNode.prototype.uncle = function() {
        if (!this.parent) return null;
        else return this.parent.sibling();
    };

    TreeNode.prototype.rotateRight = function() {
        var p = this.parent;
        var l = this.left;
        var nl = l.right;

        if (!p) this.tree.root = l;
        else if (this == p.left) p.left = l;
        else p.right = l;

        l.parent = p;
        this.left = nl;
        nl.parent = this;
        l.right = this;
        this.parent = l;
    };

    TreeNode.prototype.rotateLeft = function() {
        var p = this.parent;
        var r = this.right;
        var nr = r.left;

        if (!p) this.tree.root = r;
        else if (this == p.left) p.left = r;
        else p.right = r;

        r.parent = p;
        this.right = nr;
        nr.parent = this;
        r.left = this;
        this.parent = r;
    };

    TreeNode.prototype.insertFix1 = function() {
        if (!this.parent) this.color = false;
        else this.insertFix2();
    }

    TreeNode.prototype.insertFix2 = function() {
        if (!this.parent.color) return;
        else this.insertFix3();
    };

    TreeNode.prototype.insertFix3 = function() {
        var u = this.uncle();
        var g = this.grandparent();

        if (u && u.color) {
            this.parent.color = false;
            u.color = false;
            g.color = true;
            g.insertFix1();
        } else {
            this.insertFix4(g);
        }
    };

    TreeNode.prototype.insertFix4 = function(g) {
        var p = this.parent;
        if (this == p.right && p == g.left) {
            var l = this.left;
            g.left = this;
            this.parent = g;
            this.left = p;
            p.parent = this;
            p.right = l;
            l.parent = p;
            p.insertFix5();
        } else if (this == p.left && p == g.right) {
            var r = this.right;
            g.right = this;
            this.parent = g;
            this.right = p;
            p.parent = this;
            p.left = r;
            r.parent = p;
            p.insertFix5();
        } else {
            this.insertFix5();
        }
    };

    TreeNode.prototype.insertFix5 = function() {
        var g = this.grandparent();
        var p = this.parent;
        p.color = false;
        g.color = true;
        if (this == p.left) {
            g.rotateRight();
        } else {
            g.rotateLeft();
        }
    };

    TreeNode.prototype.remove = function() {
        if (this.left != this.tree.nil && this.right != this.tree.nil) {
            var n = this.right;
            while (n.left != this.tree.nil) n = n.left;
            this.value = n.value;
            n.remove();
            return;
        }

        var c = this.right == this.tree.nil ? this.left : this.right;
        var p = this.parent;
        c.parent = p;
        if (!p) this.tree.root = c;
        else if (this == p.left) p.left = c;
        else p.right = c;

        if (this.color) return;

        if (c.color) c.color = false;
        else c.removeFix1();
    };

    TreeNode.prototype.removeFix1 = function() {
        if (this.parent) this.removeFix2();
    };

    TreeNode.prototype.removeFix2 = function() {
        var s = this.sibling();

        if (s.color) {
            var p = this.parent;
            p.color = true;
            s.color = false;
            if (this == p.left) p.rotateLeft();
            else p.rotateRight();
        }

        this.removeFix3();
    };

    TreeNode.prototype.removeFix3 = function() {
        var s = this.sibling();
        var p = this.parent;
        if (!p.color && !s.color && !s.left.color && !s.right.color) {
            s.color = true;
            p.removeFix1();
        } else {
            this.removeFix4();
        }
    };

    TreeNode.prototype.removeFix4 = function() {
        var s = this.sibling();
        var p = this.parent;
        if (p.color && !s.color && !s.left.color && !s.right.color) {
            s.color = true;
            p.color = false;
        } else {
            this.removeFix5();
        }
    };

    TreeNode.prototype.removeFix5 = function() {
        var s = this.sibling();

        if (this == this.parent.left && !s.right.color) {
            s.color = true;
            s.left.color = false;
            s.rotateRight();
        } else if (this == this.parent.right && !s.left.color) {
            s.color = true;
            s.right.color = false;
            s.rotateLeft();
        }

        this.removeFix6();
    };

    TreeNode.prototype.removeFix6 = function() {
        var s = this.sibling();

        s.color = this.parent.color;
        this.parent.color = false;

        if (this == this.parent.left) {
            s.right.color = false;
            this.parent.rotateLeft();
        } else {
            s.left.color = false;
            this.parent.rotateRight();
        }
    };

    window.dafen2d = window.dafen2d || {};
    window.dafen2d.createTree = function(compareFunc) {

        var tree = { };

        var nil = new TreeNode(tree);
        nil.color = false;

        tree.nil = nil;
        tree.root = nil;

        var insert = function(v) {
            var n = new TreeNode();
            n.value = v;
            n.left = nil;
            n.right = nil;

            if (tree.root == nil) { // first insertion
                tree.root = n;
                n.color = false;
                return n;
            }

            var c = tree.root;
            while (true) {
                if (compareFunc(c.value, v)) {
                    if (c.right == nil) {
                        c.right = n;
                        n.parent = c;
                        n.insertFix2(tree);
                        return n;
                    } else {
                        c = c.right;
                    }
                } else {
                    if (c.left == nil) {
                        c.left = n;
                        n.parent = c;
                        n.insertFix2(tree);
                        return n;
                    } else {
                        c = c.left;
                    }
                }
            }
        };

        var traverse = function(n) {
            if (n == nil) return;
            traverse(n.left);
            console.log(n.value);
            traverse(n.right);
        };

        return {
            insert:insert,
            traverse:function() { traverse(tree.root); }
        };
    };
})();