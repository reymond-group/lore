Lore.TreeHelper = function (renderer, geometryName, shaderName, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.TreeHelper.defaults, options);
    this.indices = null;
    this.geometry.setMode(Lore.DrawModes.lines);
    this.initPointSize();
    this.filters = {};
}

Lore.TreeHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.TreeHelper,

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

        this.setAttribute('position', positions);
    },

    setPositionsXYZHSS: function (x, y, z, hue, saturation, size) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setHSS(hue, saturation, size, length);
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

Lore.TreeHelper.defaults = {
    pointScale: 1.0,
    maxPointSize: 100.0
}
