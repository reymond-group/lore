Lore.Matrix3f = function(entries) {
    this.entries = entries || new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]);
}

Lore.Matrix3f.prototype = {
    constructor: Lore.Matrix3f,

    clone: function() {
        return new Lore.Matrix3f(new Float32Array(this.entries));
    },

    equals: function(m) {
        for (var i = 0; i < this.entries.length; i++) {
            if (this.entries[i] !== m.entries[i]) return false;
        }

        return true;
    }
}
