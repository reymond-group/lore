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

            this.octree = new Lore.Octree(this.opts.octreeThreshold, this.opts.octreeMaxDepth);
            this.octree.build(indices, positions, initialBounds);
        }



        this.setAttribute('position', positions);
    },

    setPositionsXYZHSS: function (x, y, z, hue, saturation, size) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setHSS(hue, saturation, size, length);
    },

    setRGB: function (r, g, b) {
        var c = new Float32Array(r.length * 3);
        var colors = this.getAttribute('color');

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
            c[i + 1] = colors[1];
            c[i + 2] = colors[2];
        }

        this.updateColors(c);
    },
    
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

    getPointScale: function() {
        return this.opts.pointScale;
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

    getHue: function (index) {
        var colors = this.getAttribute('color');
        return colors[index * 3];
    },

    setHSS: function (hue, saturation, size, length) {
        var c = new Float32Array(length * 3);

        for (var i = 0; i < length * 3; i += 3) {
            c[i] = hue;
            c[i + 1] = saturation;
            c[i + 2] = size;
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
    octreeThreshold: 500.0,
    octreeMaxDepth: 8,
    pointScale: 1.0,
    maxPointSize: 100.0
}
