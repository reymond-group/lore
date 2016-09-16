Lore.Shader = function(name, uniforms, vertexShader, fragmentShader) {
    this.name = name;
    this.uniforms = uniforms || {};
    this.vertexShader = vertexShader || [];
    this.fragmentShader = fragmentShader || [];
    this.gl = null;
    this.program = null;
    this.initialized = false;

    // Add the two default shaders (the same shaders as in getVertexShader)
    this.uniforms['modelViewMatrix'] = new Lore.Uniform('modelViewMatrix',
        (new Lore.Matrix4f()).entries, 'float_mat4');

    this.uniforms['projectionMatrix'] = new Lore.Uniform('projectionMatrix',
        (new Lore.Matrix4f()).entries, 'float_mat4');
}

Lore.Shader.prototype = {
    constructor: Lore.Shader,

    getVertexShaderCode: function() {
        return this.vertexShader.join('\n');
    },

    getFragmentShaderCode: function() {
        return this.fragmentShader.join('\n');
    },

    getVertexShader: function(gl) {
        var shader = gl.createShader(gl.VERTEX_SHADER);

        var vertexShaderCode = 'uniform mat4 modelViewMatrix;\n' +
            'uniform mat4 projectionMatrix;\n\n' +
            this.getVertexShaderCode();

        gl.shaderSource(shader, vertexShaderCode);
        gl.compileShader(shader);

        Lore.Shader.showCompilationInfo(gl, shader, this.name, 'Vertex Shader');
        return shader;
    },

    getFragmentShader: function(gl) {
        var shader = gl.createShader(gl.FRAGMENT_SHADER);
        // Adding precision, see:
        // http://stackoverflow.com/questions/27058064/why-do-i-need-to-define-a-precision-value-in-webgl-shaders
        // and:
        // http://stackoverflow.com/questions/13780609/what-does-precision-mediump-float-mean
        var fragmentShaderCode = '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' +
            this.getFragmentShaderCode();

        gl.shaderSource(shader, fragmentShaderCode);
        gl.compileShader(shader);

        Lore.Shader.showCompilationInfo(gl, shader, this.name, 'Fragment Shader');
        return shader;
    },

    init: function(gl) {
        this.gl = gl;
        this.program = this.gl.createProgram();
        var vertexShader = this.getVertexShader(this.gl);
        var fragmentShader = this.getFragmentShader(this.gl);

        if (!vertexShader || !fragmentShader) {
            console.error('Failed to create the fragment or the vertex shader.');
            return null;
        }

        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);

        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Could not link program.\n' +
                'VALIDATE_STATUS: ' + this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS) + '\n' +
                'ERROR: ' + this.gl.getError());
            return null;
        }

        this.initialized = true;
    },

    updateUniforms: function() {
        for (var uniform in this.uniforms) {
            var unif = this.uniforms[uniform];
            if (unif.stale)
                Lore.Uniform.Set(this.gl, this.program, unif);
        }
    }
}

Lore.Shader.showCompilationInfo = function(gl, shader, name, prefix) {
    prefix = prefix || 'Shader';
    // This was stolen from THREE.js
    // https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLShader.js
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
        console.error(prefix + ' ' + name + ' did not compile.');
    }

    if (gl.getShaderInfoLog(shader) !== '') {
        console.warn(prefix + ' ' + name + ' info log: ' + gl.getShaderInfoLog(shader));
    }
}
