Lore.Attribute = class Attribute {
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

    setFromVector(index, v) {
        this.data.set(v.components, index * this.attributeLength, v.components.length);
    }

    setFromVectorArray(arr) {
        if (this.attributeLength !== arr[0].components.length)
            throw 'The attribute has a length of ' + this.attributeLength + '. But the vectors have ' + arr[0].components.length + ' components.';

        for (let i = 0; i < arr.length; i++) {
            this.data.set(arr[i].components, i * this.attributeLength, arr[i].components.length);
        }
    }

    getX(index) {
        return this.data[index * this.attributeLength];
    }

    setX(index, value) {
        this.data[index * this.attributeLength];
    }

    getY(index) {
        return this.data[index * this.attributeLength + 1];
    }

    setY(index, value) {
        this.data[index * this.attributeLength + 1];
    }

    getZ(index) {
        return this.data[index * this.attributeLength + 2];
    }

    setZ(index, value) {
        this.data[index * this.attributeLength + 2];
    }

    getW(index) {
        return this.data[index * this.attributeLength + 3];
    }

    setW(index, value) {
        this.data[index * this.attributeLength + 3];
    }

    getGlType(gl) {
        // Just floats for now
        // TODO: Add additional types.
        return gl.FLOAT;
    }

    update(gl) {
        gl.bindBuffer(this.bufferType, this.buffer);
        gl.bufferData(this.bufferType, this.data, this.drawMode);

        this.stale = false;
    }

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

    bind(gl) {
        gl.bindBuffer(this.bufferType, this.buffer);

        // Only enable attribute if it actually exists in the Shader
        if (this.attributeLocation >= 0) {
            gl.vertexAttribPointer(this.attributeLocation, this.attributeLength, this.getGlType(gl), gl.FALSE, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocation);
        }
    }
}
