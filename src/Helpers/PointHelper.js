Lore.PointHelper = function (renderer, geometryName, shaderName, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.PointHelper.defaults, options);
    this.indices = null;
    this.octree = null;
    this.geometry.setMode(Lore.DrawModes.points);
    this.initPointSize();
    this.filters = {};
}

Lore.PointHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.PointHelper,

    getMaxLength: function (x, y, z) {
        return Math.max(x.length, Math.max(y.length, z.length));
    },

    setPositions: function (positions) {
        this.setAttribute('position', positions);
    },

    setPositionsXYZ: function (x, y, z, length) {
        var positions = new Float32Array(length * 3);
        for (var i = 0; i < length; i++) {
            var j = 3 * i;
            positions[j] = x[i] || 0;
            positions[j + 1] = y[i] || 0;
            positions[j + 2] = z[i] || 0;
        }

        if (this.opts.octree) {
            var initialBounds = Lore.AABB.fromPoints(positions);
            var indices = new Uint32Array(length);
            for (var i = 0; i < length; i++) indices[i] = i;

            this.octree = new Lore.Octree();
            this.octree.build(indices, positions, initialBounds);
        }



        this.setAttribute('position', positions);
    },

    setPositionsXYZColor: function (x, y, z, color) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setColor(color, length);
    },

    setPositionsXYZRGB: function (x, y, z, r, g, b, normalize) {
        normalize = normalize ? true : false;

        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setRGB(r, g, b, length, normalize);
    },

    /*
    setPositionsXYZHues: function (x, y, z, hues) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setHues(hues, length);
    },

    setPositionsXYZHSL: function (x, y, z, h, s, l) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setHSL(h, s, l, length);
    },
   

    setHues: function (hues, length) {
        var colors = new Float32Array(length * 3);

        for (var i = 0; i < length; i++) {
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

    setHSL: function (h, s, l, length) {
        var colors = new Float32Array(length * 3);

        for (var i = 0; i < length; i++) {
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

    shiftHue: function (hue, value) {
        hue += value;
        if (hue > 1) hue = hue - 1;
        if (hue < 0) hue = 1 + hue;

        return hue;
    },
    */

    setColors: function (colors) {
        this.setAttribute('color', colors);
    },

    updateColors: function (colors) {
        this.updateAttributeAll('color', colors);
    },

    updateColor: function (index, color) {
        this.updateAttribute('color', index, color.components);
    },

    setPointSize: function (size) {
        if(size * this.opts.pointScale > this.opts.maxPointSize) return;
        this.geometry.shader.uniforms.size.value = size * this.opts.pointScale;
    },

    getPointSize: function () {
        return this.geometry.shader.uniforms.size.value;
    },

    setFogDistance: function (fogDistance) {
        this.geometry.shader.uniforms.fogDistance.value = fogDistance;
    },

    initPointSize: function () {
        this.geometry.shader.uniforms.size.value = this.renderer.camera.zoom * this.opts.pointScale;
    },
    
    getCutoff: function() {
        return this.geometry.shader.uniforms.cutoff.value;
    },

    setCutoff: function (cutoff) {
        this.geometry.shader.uniforms.cutoff.value = cutoff;
    },

    setRGB: function (r, g, b, length, normalize) {
        var c = new Float32Array(length * 3);

        if (normalize) {
            for (var i = 0; i < length; i++) {
                var j = 3 * i;
                c[j] = r[i] / 255.0;
                c[j + 1] = g[i] / 255.0;
                c[j + 2] = b[i] / 255.0;
            }
        } else {
            for (var i = 0; i < length; i++) {
                var j = 3 * i;
                c[j] = r[i];
                c[j + 1] = g[i];
                c[j + 2] = b[i];
            }
        }

        // Convert to HOS (Hue, Opacity, Size)
        for(var i = 0; i < c.length; i += 3) {
            var r = c[i];
            var g = c[i + 1];
            var b = c[i + 2];

            c[i] = Lore.Color.rgbToHsl(r, g, b)[0];
            c[i + 1] = 1.0;
            c[i + 2] = 1.0;
        }

        this.setColors(c);
    },

    getHue: function (index) {
        var colors = this.getAttribute('color');
        return colors[index * 3];
    },

    updateRGB: function (r, g, b) {
        var c = new Float32Array(r.length * 3);

        for (var i = 0; i < r.length; i++) {
            var j = 3 * i;
            c[j] = r[i];
            c[j + 1] = g[i];
            c[j + 2] = b[i];
        }

        // Convert to HOS (Hue, Opacity, Size)
        for(var i = 0; i < c.length; i += 3) {
            var r = c[i];
            var g = c[i + 1];
            var b = c[i + 2];

            c[i] = Lore.Color.rgbToHsl(r, g, b)[0];
            c[i + 1] = 1.0;
            c[i + 2] = 1.0;
        }

        this.updateColors(c);
    },

    setColor: function (color, length) {
        var c = new Float32Array(length * 3);

        for (var i = 0; i < length * 3; i += 3) {
            c[i] = color.components[0];
            c[i + 1] = color.components[1];
            c[i + 2] = color.components[2];
        }

        this.setColors(c);
    },

    addFilter: function (name, filter) {
        filter.setGeometry(this.geometry);
        this.filters[name] = filter;
    },

    removeFilter: function (name) {
        delete this.filters[name];
    },

    getFilter: function (name) {
        return this.filters[name];
    }
});

Lore.PointHelper.defaults = {
    octree: true,
    pointScale: 1.0,
    maxPointSize: 100.0
}
