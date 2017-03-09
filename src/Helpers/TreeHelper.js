Lore.TreeHelper = class TreeHelper extends Lore.HelperBase {

    constructor(renderer, geometryName, shaderName, options) {
        super(renderer, geometryName, shaderName);
                
        this.defaults = {
            pointScale: 1.0,
            maxPointSize: 100.0
        }

        this.opts = Lore.Utils.extend(true, this.defaults, options);
        this.indices = null;
        this.geometry.setMode(Lore.DrawModes.lines);
        this.initPointSize();
        this.filters = {};
    }

    getMaxLength(x, y, z) {
        return Math.max(x.length, Math.max(y.length, z.length));
    }

    setPositions(positions) {
        this.setAttribute('position', positions);
    }

    setPositionsXYZ(x, y, z, length) {
        let positions = new Float32Array(length * 3);
        
        for (let i = 0; i < length; i++) {
            let j = 3 * i;
            
            positions[j] = x[i] || 0;
            positions[j + 1] = y[i] || 0;
            positions[j + 2] = z[i] || 0;
        }

        this.setAttribute('position', positions);
    }

    setPositionsXYZHSS(x, y, z, hue, saturation, size) {
        let length = this.getMaxLength(x, y, z);
        
        this.setPositionsXYZ(x, y, z, length);
        this.setHSS(hue, saturation, size, length);
    }

    setColors(colors) {
        this.setAttribute('color', colors);
    }

    updateColors(colors) {
        this.updateAttributeAll('color', colors);
    }

    updateColor(index, color) {
        this.updateAttribute('color', index, color.components);
    }

    setPointSize(size) {
        if (size * this.opts.pointScale > this.opts.maxPointSize) {
            return;
        }

        this.geometry.shader.uniforms.size.value = size * this.opts.pointScale;
    }

    getPointSize() {
        return this.geometry.shader.uniforms.size.value;
    }

    setFogDistance(fogDistance) {
        this.geometry.shader.uniforms.fogDistance.value = fogDistance;
    }

    initPointSize() {
        this.geometry.shader.uniforms.size.value = this.renderer.camera.zoom * this.opts.pointScale;
    }
    
    getCutoff() {
        return this.geometry.shader.uniforms.cutoff.value;
    }

    setCutoff(cutoff) {
        this.geometry.shader.uniforms.cutoff.value = cutoff;
    }

    getHue(index) {
        let colors = this.getAttribute('color');
        
        return colors[index * 3];
    }

    setHSS(hue, saturation, size, length) {
        let c = new Float32Array(length * 3);

        for (let i = 0; i < length * 3; i += 3) {
            c[i] = hue;
            c[i + 1] = saturation;
            c[i + 2] = size;
        }

        this.setColors(c);
    }


    addFilter(name, filter) {
        filter.setGeometry(this.geometry);
        this.filters[name] = filter;
    }

    removeFilter(name) {
        delete this.filters[name];
    }

    getFilter(name) {
        return this.filters[name];
    }
}
