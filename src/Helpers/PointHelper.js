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

    setPositionsXYZHues: function(x, y, z, hues) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setHues(hues, length);
    },

    setPositionsXYZHSL: function(x, y, z, h, s, l) {
      var length = this.getMaxLength(x, y, z);
      this.setPositionsXYZ(x, y, z, length);
      this.setHSL(h, s, l, length);
    },

    setHues: function(hues, length) {
        var colors = new Float32Array(length * 3);

        for(var i = 0; i < length; i++) {
            var hue = hues[i] || 0;
            // Rescale
            hue = Lore.Statistics.scale(hue, 0, 1, 0.2, 1);
            // Invert hue
            hue = 1 - hue;
            hue = this.shiftHue(hue, -0.2);
            var rgb = Lore.Color.hslToRgb(hue, 0.5, 0.5);
            colors[i * 3] = rgb[0];
            colors[i * 3 + 1] = rgb[1];
            colors[i * 3 + 2] = rgb[2];
        }

        this.setColors(colors);
    },

    setHSL: function(h, s, l, length) {
        var colors = new Float32Array(length * 3);

        for(var i = 0; i < length; i++) {
            var hue = h[i] || 0;
            // Rescale
            hue = Lore.Statistics.scale(hue, 0, 1, 0.2, 1);
            // Invert hue
            hue = 1 - hue;
            hue = this.shiftHue(hue, -0.2);
            var rgb = Lore.Color.hslToRgb(hue, s[i], l[i]);
            colors[i * 3] = rgb[0];
            colors[i * 3 + 1] = rgb[1];
            colors[i * 3 + 2] = rgb[2];
        }

        this.setColors(colors);
    },

    shiftHue: function(hue, value) {
        hue += value;
        if(hue > 1) hue = hue - 1;
        if(hue < 0) hue = 1 + hue;

        return hue;
    },

    setColors: function(colors) {
        this.setAttribute('color', colors);
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
