/** A class representing a Lore attribute. */
Lore.Attribute = class Attribute {
    /**
     * Creates an instance of Attribute.
     * @param {any} data The data represented by the attribute in a 1D array. Usually a Float32Array.
     * @param {Number} attributeLength The length of the attribute (3 for RGB, XYZ, ...).
     * @param {String} name The name of the attribute.
     */
    constructor(data, attributeLength, name) {
        this.type = 'Lore.Attribute';
        this.data = data;
        this.attributeLength = attributeLength || 3;
        this.name = name;
        this.size = this.data.length / this.attributeLength;
        this.buffer = null;
        this.attributeLocation;
        this.bufferType = null;
        this.drawMode = null;
        this.stale = false;
    }

    /**
     * Set the attribute value from a vector at a given index. The vector should have the same number of components as is the length of this attribute.
     * 
     * @param {Number} index The index at which to replace / set the value (is calculated as index * attributeLength).
     * @param {Vector3f|any} v A vector.
     */
    setFromVector(index, v) {
        this.data.set(v.components, index * this.attributeLength, v.components.length);
    }

    /**
     * Set the attribute values from vectors in an array.
     * 
     * @param {Array} arr An array containing vectors. The number of components of the vectors must have the same length as the attribute length specified.
     */
    setFromVectorArray(arr) {
        if (this.attributeLength !== arr[0].components.length)
            throw 'The attribute has a length of ' + this.attributeLength + '. But the vectors have ' + arr[0].components.length + ' components.';

        for (let i = 0; i < arr.length; i++) {
            this.data.set(arr[i].components, i * this.attributeLength, arr[i].components.length);
        }
    }

    /**
     * Gets the x value at a given index.
     * 
     * @param {Number} index The index.
     * @returns {Number} The x value at a given index.
     */
    getX(index) {
        return this.data[index * this.attributeLength];
    }

    /**
     * Set the x value at a given index.
     * 
     * @param {Number} index The index.
     * @param {Number} value A number.
     */
    setX(index, value) {
        this.data[index * this.attributeLength];
    }

    /**
     * Gets the y value at a given index.
     * 
     * @param {Number} index The index.
     * @returns {Number} The y value at a given index.
     */
    getY(index) {
        return this.data[index * this.attributeLength + 1];
    }

    /**
     * Set the y value at a given index.
     * 
     * @param {Number} index The index.
     * @param {Number} value A number.
     */
    setY(index, value) {
        this.data[index * this.attributeLength + 1];
    }

    /**
     * Gets the z value at a given index.
     * 
     * @param {Number} index The index.
     * @returns {Number} The z value at a given index.
     */
    getZ(index) {
        return this.data[index * this.attributeLength + 2];
    }

    /**
     * Set the z value at a given index.
     * 
     * @param {Number} index The index.
     * @param {Number} value A number.
     */
    setZ(index, value) {
        this.data[index * this.attributeLength + 2];
    }

    /**
     * Gets the w value at a given index.
     * 
     * @param {Number} index The index.
     * @returns {Number} The w value at a given index.
     */
    getW(index) {
        return this.data[index * this.attributeLength + 3];
    }

    /**
     * Set the w value at a given index.
     * 
     * @param {Number} index The index.
     * @param {Number} value A number.
     */
    setW(index, value) {
        this.data[index * this.attributeLength + 3];
    }

    /**
     * Returns the gl type. Currently only float is supported.
     * 
     * @param {WebGLRenderingContext} gl The WebGL rendering context.
     * @returns {Number} The type.
     */
    getGlType(gl) {
        // Just floats for now
        // TODO: Add additional types.
        return gl.FLOAT;
    }

    /**
     * Update the attribute in order for changes to take effect.
     * 
     * @param {WebGLRenderingContext} gl The WebGL rendering context.
     */
    update(gl) {
        gl.bindBuffer(this.bufferType, this.buffer);
        gl.bufferData(this.bufferType, this.data, this.drawMode);

        this.stale = false;
    }

    /**
     * Create a new WebGL buffer.
     * 
     * @param {WebGLRenderingContext} gl The WebGL rendering context.
     * @param {WebGLProgram} program A WebGL program.
     * @param {Number|GLenum} bufferType The buffer type.
     * @param {Number|GLenum} drawMode The draw mode.
     */
    createBuffer(gl, program, bufferType, drawMode) {
        this.buffer = gl.createBuffer();
        this.bufferType = bufferType || gl.ARRAY_BUFFER;
        this.drawMode = drawMode || gl.STATIC_DRAW;

        gl.bindBuffer(this.bufferType, this.buffer);
        gl.bufferData(this.bufferType, this.data, this.drawMode);

        this.buffer.itemSize = this.attributeLength;
        this.buffer.numItems = this.size;

        this.attributeLocation = gl.getAttribLocation(program, this.name);
        gl.bindBuffer(this.bufferType, null);
    }

    /**
     * Bind the buffer of this attribute. The attribute must exist in the current shader.
     * 
     * @param {WebGLRenderingContext} gl The WebGL rendering context.
     */
    bind(gl) {
        gl.bindBuffer(this.bufferType, this.buffer);

        // Only enable attribute if it actually exists in the Shader
        if (this.attributeLocation >= 0) {
            gl.vertexAttribPointer(this.attributeLocation, this.attributeLength, this.getGlType(gl), gl.FALSE, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocation);
        }
    }
}
