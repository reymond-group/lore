Lore.Geometry = function(name, gl, shader) {
    Lore.Node.call(this);

    this.type = 'Lore.Geometry';
    this.name = name;
    this.gl = gl;
    this.shader = shader;
    this.attributes = {};
    this.drawMode = this.gl.POINTS;
}

Lore.Geometry.prototype = Object.assign(Object.create(Lore.Node.prototype), {
    constructor: Lore.Geometry,

    addAttribute: function(name, data, length) {
        this.attributes[name] = new Lore.Attribute(data, length, name);
        this.attributes[name].createBuffer(this.gl, this.shader.program);
        return this;
    },

    getAttribute: function(name) {
        return this.attributes[name];
    },

    removeAttribute: function(name) {
        delete this.attributes[name];
        return this;
    },

    setMode: function(drawMode) {
        switch (drawMode) {
            case Lore.DrawModes.points:
                this.drawMode = this.gl.POINTS;
                break;
            case Lore.DrawModes.lines:
                this.drawMode = this.gl.LINES;
                break;
            case Lore.DrawModes.lineStrip:
                this.drawMode = this.gl.LINE_STRIP;
                break;
            case Lore.DrawModes.lineLoop:
                this.drawMode = this.gl.LINE_LOOP;
                break;
            case Lore.DrawModes.triangles:
                this.drawMode = this.gl.TRIANGLES;
                break;
            case Lore.DrawModes.triangleStrip:
                this.drawMode = this.gl.TRIANGLE_STRIP;
                break;
            case Lore.DrawModes.triangleFan:
                this.drawMode = this.gl.TRIANGLE_FAN;
                break;
        }
    },

    size: function() {
        // Is this ok? All attributes should have the same length ...
        if (Object.keys(this.attributes).length > 0) {
            return this.attributes[Object.keys(this.attributes)[0]].size;
        }

        return 0;
    },

    draw: function(renderer) {
        if (!this.isVisible) return;

        for (var prop in this.attributes)
            if (this.attributes[prop].stale) this.attributes[prop].update(this.gl);

        this.shader.use();

        // Update the modelView and projection matrices
        if (renderer.camera.isProjectionMatrixStale) {
            this.shader.uniforms.projectionMatrix.setValue(renderer.camera.getProjectionMatrix());
            renderer.camera.isProjectionMatrixStale = false;
        }

        if (renderer.camera.isViewMatrixStale) {
            var modelViewMatrix = Lore.Matrix4f.multiply(renderer.camera.viewMatrix, this.modelMatrix);
            this.shader.uniforms.modelViewMatrix.setValue(modelViewMatrix.entries);
            renderer.camera.isViewMatrixStale = false;
        }

        this.shader.updateUniforms();

        // How exactly does the binding work??
        // What will happen if I want to draw a second geometry?
        for (prop in this.attributes) {
            this.attributes[prop].bind(this.gl);
        }

        this.gl.drawArrays(this.drawMode, 0, this.size());
    },
});
