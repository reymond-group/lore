Lore.PointHelper = class PointHelper extends Lore.HelperBase {
    constructor(renderer, geometryName, shaderName, options) {
        super(renderer, geometryName, shaderName);

        let defaults = {
            octree: true,
            octreeThreshold: 500.0,
            octreeMaxDepth: 8,
            pointScale: 1.0,
            maxPointSize: 100.0
        };

        this.opts = Lore.Utils.extend(true, defaults, options);
        this.indices = null;
        this.octree = null;
        this.geometry.setMode(Lore.DrawModes.points);
        this.initPointSize();
        this.filters = {};
        this.pointSize = 1.0 * this.opts.pointScale;
    }

    getMaxLength(x, y, z) {
        return Math.max(x.length, Math.max(y.length, z.length));

        return this;
    }

    setPositions(positions) {
        this.setAttribute('position', positions);

        return this;
    }

    setPositionsXYZ(x, y, z, length) {
        let positions = new Float32Array(length * 3);
        
        for (let i = 0; i < length; i++) {
            let j = 3 * i;
            
            positions[j] = x[i] || 0;
            positions[j + 1] = y[i] || 0;
            positions[j + 2] = z[i] || 0;
        }

        if (this.opts.octree) {
            let initialBounds = Lore.AABB.fromPoints(positions);
            let indices = new Uint32Array(length);
            
            for (let i = 0; i < length; i++) {
                indices[i] = i;
            }

            this.octree = new Lore.Octree(this.opts.octreeThreshold, this.opts.octreeMaxDepth);
            this.octree.build(indices, positions, initialBounds);
        }

        this.setAttribute('position', positions);

        return this;
    }

    setPositionsXYZHSS(x, y, z, hue, saturation, size) {
        let length = this.getMaxLength(x, y, z);

        this.setPositionsXYZ(x, y, z, length);
        
        if (typeof hue === 'number' && typeof saturation === 'number' && typeof size === 'number') {
            this.setHSS(hue, saturation, size, length);
        } else if (typeof hue !== 'number' && typeof saturation !== 'number' && typeof size !== 'number') {
            this.setHSSFromArrays(hue, saturation, size, length);
        } else {
            if (typeof hue === 'number') {
                let hueTmp = new Float32Array(length);
                hueTmp.fill(hue);
                hue = hueTmp;
            }

            if (typeof saturation === 'number') {
                let saturationTmp = new Float32Array(length);
                saturationTmp.fill(saturation);
                saturation = saturationTmp;
            }

            if (typeof size === 'number') {
                let sizeTmp = new Float32Array(length);
                sizeTmp.fill(size);
                size = sizeTmp;
            }

            this.setHSSFromArrays(hue, saturation, size, length);
        }

        // TODO: Check why the projection matrix update is needed
        this.renderer.camera.updateProjectionMatrix();
        this.renderer.camera.updateViewMatrix();

        return this;
    }

    setRGB(r, g, b) {
        let c = new Float32Array(r.length * 3);
        let colors = this.getAttribute('color');

        for (let i = 0; i < r.length; i++) {
            let j = 3 * i;
            
            c[j] = r[i];
            c[j + 1] = g[i];
            c[j + 2] = b[i];
        }

        // Convert to HOS (Hue, Opacity, Size)
        for (let i = 0; i < c.length; i += 3) {
            let r = c[i];
            let g = c[i + 1];
            let b = c[i + 2];

            c[i] = Lore.Color.rgbToHsl(r, g, b)[0];
            c[i + 1] = colors[1];
            c[i + 2] = colors[2];
        }

        this.updateColors(c);

        return this;
    }

    setColors(colors) {
        this.setAttribute('color', colors);

        return this;
    }

    updateColors(colors) {
        this.updateAttributeAll('color', colors);

        return this;
    }

    updateColor(index, color) {
        this.updateAttribute('color', index, color.components);

        return this;
    }

    // Returns the threshold for the raycaster
    setPointSize(size) {
        let pointSize = size * this.opts.pointScale;
        
        if (pointSize > this.opts.maxPointSize) {
            this.pointSize = this.opts.maxPointSize;
        } else {
            this.pointSize = pointSize;
        }

        this.geometry.shader.uniforms.size.value = this.pointSize;
        
        if (pointSize > this.opts.maxPointSize) {
            return 0.5 * (this.opts.maxPointSize / pointSize);
        } else {
            return 0.5;
        }
    }

    getPointSize() {
        return this.geometry.shader.uniforms.size.value;
    }

    getPointScale() {
        return this.opts.pointScale;
    }

    setFogDistance(fogStart, fogEnd) {
        this.geometry.shader.uniforms.fogStart.value = fogStart;
        this.geometry.shader.uniforms.fogEnd.value = fogEnd;

        return this;
    }

    initPointSize() {
        this.setPointSize(this.renderer.camera.zoom + 0.1);

        return this;
    }

    getCutoff() {
        return this.geometry.shader.uniforms.cutoff.value;
    }

    setCutoff(cutoff) {
        this.geometry.shader.uniforms.cutoff.value = cutoff;

        return this;
    }

    getHue(index) {
        let colors = this.getAttribute('color');

        return colors[index * 3];
    }

    getPosition(index) {
        let positions = this.getAttribute('position');

        return new Lore.Vector3f(positions[index * 3], positions[index * 3 + 1],
            positions[index * 3 + 2]);
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

    setHSSFromArrays(hue, saturation, size, length) {
        let c = new Float32Array(length * 3);
        let index = 0;

        if (hue.length !== length && saturation.length !== length && size.length !== length) {
            throw 'Hue, saturation and size have to be arrays of length "length" (' + length +').';
        }

        for (let i = 0; i < length * 3; i += 3) {
            c[i] = hue[index];
            c[i + 1] = saturation[index];
            c[i + 2] = size[index];

            index++;
        }

        this.setColors(c);
    }

    addFilter(name, filter) {
        filter.setGeometry(this.geometry);
        this.filters[name] = filter;

        return this;
    }

    removeFilter(name) {
        delete this.filters[name];

        return this;
    }

    getFilter(name) {
        return this.filters[name];
    }
}
