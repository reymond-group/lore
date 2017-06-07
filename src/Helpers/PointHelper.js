/** 
 * A helper class wrapping a point cloud.
 * 
 * @property {Object} opts An object containing options.
 * @property {Number[]} indices Indices associated with the data.
 * @property {Lore.Octree} octree The octree associated with the point cloud.
 * @property {Object} filters A map mapping filter names to Lore.Filter instances associated with this helper class.
 * @property {Number} pointSize The default point size of this data.
 * @property {Object} dimensions An object with the properties min and max, each a 3D vector containing the extremes.
 */
Lore.PointHelper = class PointHelper extends Lore.HelperBase {
    /**
     * Creates an instance of PointHelper.
     * @param {Lore.Renderer} renderer An instance of Lore.Renderer.
     * @param {String} geometryName The name of this geometry.
     * @param {String} shaderName The name of the shader used to render the geometry.
     * @param {Object} options An object containing options.
     */
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

        this.dimensions = {
            min: new Lore.Vector3f(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
            max: new Lore.Vector3f(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
        };
    }

    /**
     * Get the max length of the length of three arrays.
     * 
     * @param {Array} x 
     * @param {Array} y 
     * @param {Array} z 
     * @returns {Number} The length of the largest array.
     */
    getMaxLength(x, y, z) {
        return Math.max(x.length, Math.max(y.length, z.length));
    }

    /**
     * Returns an object containing the dimensions of this point cloud.
     * 
     * @returns {Object} An object with the properties min and max, each a 3D vector containing the extremes.
     */
    getDimensions() {
        return this.dimensions;
    }

    /**
     * Get the center (average) of the point cloud.
     * 
     * @returns {Lore.Vector3f} The center (average) of the point cloud.
     */
    getCenter() {
        return new Lore.Vector3f((this.dimensions.max.getX() + this.dimensions.min.getX()) / 2.0, 
            (this.dimensions.max.getY() + this.dimensions.min.getY()) / 2.0,
            (this.dimensions.max.getZ() + this.dimensions.min.getZ()) / 2.0);
    }

    /**
     * Set the positions of points in this point cloud.
     * 
     * @param {TypedArray} positions The positions (linear array).
     * @returns {Lore.PointHelper} Itself.
     */
    setPositions(positions) {
        // Min, max will NOT be calculated as of now!
        // TODO?

        this.setAttribute('position', positions);

        return this;
    }

    /**
     * Set the positions of points in this point clouds.
     * 
     * @param {TypedArray} x An array containing the x components.
     * @param {TypedArray} y An array containing the y components.
     * @param {TypedArray} z An array containing the z components.
     * @param {Number} length The length of the arrays.
     * @returns {Lore.PointHelper} Itself.
     */
    setPositionsXYZ(x, y, z, length) {
        let positions = new Float32Array(length * 3);
        
        for (var i = 0; i < length; i++) {
            let j = 3 * i;
            
            positions[j] = x[i] || 0;
            positions[j + 1] = y[i] || 0;
            positions[j + 2] = z[i] || 0;

            if (x[i] > this.dimensions.max.getX()) {
                this.dimensions.max.setX(x[i]);
            }

            if (x[i] < this.dimensions.min.getX()) {
                this.dimensions.min.setX(x[i]);
            }

            if (y[i] > this.dimensions.max.getY()) {
                this.dimensions.max.setY(y[i]);
            }

            if (y[i] < this.dimensions.min.getY()) {
                this.dimensions.min.setY(y[i]);
            }

            if (z[i] > this.dimensions.max.getZ()) {
                this.dimensions.max.setZ(z[i]);
            }

            if (z[i] < this.dimensions.min.getZ()) {
                this.dimensions.min.setZ(z[i]);
            }
        }

        if (this.opts.octree) {
            let initialBounds = Lore.AABB.fromPoints(positions);
            let indices = new Uint32Array(length);
            
            for (var i = 0; i < length; i++) {
                indices[i] = i;
            }

            this.octree = new Lore.Octree(this.opts.octreeThreshold, this.opts.octreeMaxDepth);
            this.octree.build(indices, positions, initialBounds);
        }

        this.setAttribute('position', positions);

        return this;
    }

    /**
     * Set the positions and the HSS (Hue, Saturation, Size) values of the points in the point cloud.
     * 
     * @param {TypedArray} x An array containing the x components.
     * @param {TypedArray} y An array containing the y components.
     * @param {TypedArray} z An array containing the z components.
     * @param {TypedArray} hue An array containing the hues of the data points.
     * @param {TypedArray} saturation An array containing the saturations of the data points.
     * @param {TypedArray} size An array containing the sizes of the data points.
     * @returns {Lore.PointHelper} Itself.
     */
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

    /**
     * Set the hue from an rgb values.
     * 
     * @param {TypeArray} r An array containing the red components of the colors.
     * @param {TypeArray} g An array containing the green components of the colors.
     * @param {TypeArray} b An array containing the blue components of the colors.
     * @returns {Lore.PointHelper} Itself.
     */
    setRGB(r, g, b) {
        let c = new Float32Array(r.length * 3);
        let colors = this.getAttribute('color');

        for (let i = 0; i < r.length; i++) {
            let j = 3 * i;
            
            c[j] = r[i];
            c[j + 1] = g[i];
            c[j + 2] = b[i];
        }

        // Convert to HOS (Hue, Saturation, Size)
        for (let i = 0; i < c.length; i += 3) {
            let r = c[i];
            let g = c[i + 1];
            let b = c[i + 2];

            c[i] = Lore.Color.rgbToHsl(r, g, b)[0];
            c[i + 1] = colors[i + 1];
            c[i + 2] = colors[i + 2];
        }

        this.updateColors(c);

        return this;
    }

    /**
     * Set the colors (HSS) for the points.
     * 
     * @param {TypedArray} colors An array containing the HSS values.
     * @returns {Lore.PointHelper} Itself.
     */
    setColors(colors) {
        this.setAttribute('color', colors);

        return this;
    }

    /**
     * Update the colors (HSS) for the points.
     * 
     * @param {TypedArray} colors An array containing the HSS values.
     * @returns {Lore.PointHelper} Itself.
     */
    updateColors(colors) {
        this.updateAttributeAll('color', colors);

        return this;
    }

    /**
     * Update the color (HSS) at a specific index.
     * 
     * @param {Number} index The index of the data point.
     * @param {Lore.Color} color An instance of Lore.Color containing HSS values.
     * @returns {Lore.PointHelper} Itself.
     */
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

    setHue(hue) {
        let length = hue.length;
        let c = new Float32Array(length * 3);
        let colors = this.getAttribute('color');
        let index = 0;
        
        for (let i = 0; i < length * 3; i += 3) {
            c[i] = hue[index++];
            c[i + 1] = colors[i + 1];
            c[i + 2] = colors[i + 2];
        }
        

        this.setColors(c);
    }

    setSaturation(saturation) {
        let length = saturation.length;
        let c = new Float32Array(length * 3);
        let colors = this.getAttribute('color');
        let index = 0;
        
        for (let i = 0; i < length * 3; i += 3) {
            c[i] = colors[i];
            c[i + 1] = saturation[index++];
            c[i + 2] = colors[i + 2];
        }
        

        this.setColors(c);
    }

    setSize(size) {
        let length = size.length;
        let c = new Float32Array(length * 3);
        let colors = this.getAttribute('color');
        let index = 0;
        
        for (let i = 0; i < length * 3; i += 3) {
            c[i] = colors[i];
            c[i + 1] = colors[i + 1];
            c[i + 2] = size[index++];
        }
        

        this.setColors(c);
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
