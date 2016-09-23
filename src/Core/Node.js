// This is more or less the same implementation of a 3d node that
// THREE.js uses

Lore.Node = function() {
    this.type = 'Lore.Node';
    this.id = Lore.Node.createGUID();
    this.isVisible = true;
    this.position = new Lore.Vector3f();
    this.rotation = new Lore.Quaternion();
    this.scale = new Lore.Vector3f(1.0, 1.0, 1.0);
    this.up = new Lore.Vector3f(0.0, 1.0, 0.0);
    this.normalMatrix = new Lore.Matrix3f();
    this.modelMatrix = new Lore.Matrix4f();
    this.isStale = false;

    this.children = new Array();
    this.parent = null;
}

Lore.Node.prototype = {
    constructor: Lore.Node,

    applyMatrix: function(matrix) {
        this.modelMatrix.multiplyB(matrix);
    },

    getUpVector: function() {
        var v = new Lore.Vector3f(0, 1, 0);
        return v.applyQuaternion(this.rotation);
    },

    getForwardVector: function() {
        var v = new Lore.Vector3f(0, 0, 1);
        return v.applyQuaternion(this.rotation);
    },

    getRightVector: function() {
        var v = new Lore.Vector3f(1, 0, 0);
        return v.applyQuaternion(this.rotation);
    },

    translateOnAxis: function(axis, distance) {
        // Axis should be normalized, following THREE.js
        var v = new Lore.Vector3f(axis.components[0], axis.components[1],
                                  axis.components[2]);
        v.applyQuaternion(this.rotation);
        v.multiplyScalar(distance);
        this.position.add(v);
        return this;
    },

    translateX: function(distance) {
        this.position.components[0] = this.position.components[0] + distance;
        return this;
    },

    translateY: function(distance) {
        this.position.components[1] = this.position.components[1] + distance;
        return this;
    },

    translateZ: function(distance) {
        this.position.components[2] = this.position.components[2] + distance;
        return this;
    },

    setTranslation: function(v) {
        this.position = v;
        return this;
    },

    setRotation: function(axis, angle) {
        this.rotation.setFromAxisAngle(axis, angle);
        return this;
    },

    rotate: function(axis, angle) {
        var q = new Lore.Quaternion(axis, angle);
        this.rotation.multiplyA(q);
        return this;
    },

    rotateX: function(angle) {
        this.rotation.rotateX(angle);
        return this;
    },

    rotateY: function(angle) {
        this.rotation.rotateY(angle);
        return this;
    },

    rotateZ: function(angle) {
        this.rotation.rotateZ(angle);
        return this;
    },

    getRotationMatrix: function() {
        return this.rotation.toRotationMatrix();
    },

    update: function() {
        this.modelMatrix.compose(this.position, this.rotation, this.scale);
        // if parent... this.modelMatrix = Lore.Matrix4f.multiply(this.parent.modelMatrix, this.modelMatrix);
        this.isStale = true;
    },

    getModelMatrix: function() {
        return this.modelMatrix.entries;
    }
}

Lore.Node.createGUID = function() {
    // See:
    // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
