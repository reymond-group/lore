Lore.PointHelper = function(renderer, geometryName, shaderName, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.PointHelper.defaults, options);
    this.indices = null;
    this.octree = null;
    this.geometry.setMode(Lore.DrawModes.points);
}

Lore.PointHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.PointHelper,

    getMaxLength: function(x, y, z) {
        return Math.max(x.length, Math.max(y.length, z.length));
    },

    setPositions: function(positions) {
        this.setAttribute('position', positions);
    },

    setPositionsXYZ: function(x, y, z, length) {
        var positions = new Float32Array(length * 3);
        for(var i = 0; i < length; i++) {
            var j = 3 * i;
            positions[j] = x[i] || 0;
            positions[j + 1] = y[i] || 0;
            positions[j + 2] = z[i] || 0;
        }

        if(this.opts.octree) {
            var initialBounds = Lore.AABB.fromPoints(positions);
            var indices = new Uint32Array(length);
            for(var i = 0; i < length; i++) indices[i] = i;

            this.octree = new Lore.Octree();
            this.octree.build(indices, positions, initialBounds);
        }



        this.setAttribute('position', positions);
    },

    setPositionsXYZColor: function(x, y, z, color) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setColor(color, length);
    },

    setPositionsXYZRGB: function(x, y, z, r, g, b) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setRGB(r, g, b, length);
    },

    setPositionsXYZHues: function(x, y, z, hues) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setHues(hues, length);
    },

    setHues: function(hues, length) {
        var colors = new Float32Array(length * 3);

        for(var i = 0; i < length; i++) {
            var hue = hues[i] || 0;
            var rgb = Lore.Color.hslToRgb(hue, 0.5, 0.5);
            colors[i * 3] = rgb[0];
            colors[i * 3 + 1] = rgb[1];
            colors[i * 3 + 2] = rgb[2];
        }

        this.setColors(colors);
    },

    setColors: function(colors) {
        this.setAttribute('color', colors);
    },

    setRGB: function(r, g, b, length) {
        var c = new Float32Array(length * 3);

        for(var i = 0; i < length; i++) {
            var j = 3 * i;
            c[j] = r[i];
            c[j + 1] = g[i];
            c[j + 2] = b[i];
        }
        
        this.setColors(c);
    },

    setColor: function(color, length) {
        var c = new Float32Array(length * 3);

        for(var i = 0; i < length * 3; i += 3) {
            c[i] = color.components[0];
            c[i + 1] = color.components[1];
            c[i + 2] = color.components[2];
        }

        this.setColors(c);
    }
});

Lore.PointHelper.defaults = {
    octree: true
}
