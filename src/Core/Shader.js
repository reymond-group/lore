/**
 * A class representing a shader.
 * 
 * @property {String} name The name of the shader.
 * @property {Object} uniforms A map mapping uniform names to Lore.Uniform instances.
 * 
 */
Lore.Shader = class Shader {
    constructor(name, glVersion, uniforms, vertexShader, fragmentShader) {
        this.name = name;
        this.uniforms = uniforms || {};
        this.vertexShader = vertexShader || [];
        this.fragmentShader = fragmentShader || [];
        this.glVersion = glVersion;
        this.gl = null;
        this.program = null;
        this.initialized = false;
        this.lastTime = new Date().getTime();
        
        // Add the two default shaders (the same shaders as in getVertexShader)
        this.uniforms['modelViewMatrix'] = new Lore.Uniform('modelViewMatrix',
            (new Lore.Matrix4f()).entries, 'float_mat4');

        this.uniforms['projectionMatrix'] = new Lore.Uniform('projectionMatrix',
            (new Lore.Matrix4f()).entries, 'float_mat4');
    }
    
    clone() {
        return new Lore.Shader(this.name, this.glVersion, this.uniforms, this.vertexShader, this.fragmentShader);
    }

    getVertexShaderCode() {
        return this.vertexShader.join('\n');
    }

    getFragmentShaderCode() {
        return this.fragmentShader.join('\n');
    }

    getVertexShader(gl, isWebGL2 = false) {
        let shader = gl.createShader(gl.VERTEX_SHADER);
        let vertexShaderCode = '';

        if (!isWebGL2 && this.glVersion === 2) {
          throw('The shader expects WebGL 2.0');
        } else if (this.glVersion === 2) {
          vertexShaderCode += '#version 300 es\n';
        }

        vertexShaderCode += 'uniform mat4 modelViewMatrix;\n' +
            'uniform mat4 projectionMatrix;\n\n' +
            this.getVertexShaderCode();
            
        gl.shaderSource(shader, vertexShaderCode);
        gl.compileShader(shader);

        Lore.Shader.showCompilationInfo(gl, shader, this.name, 'Vertex Shader');
        return shader;
    }

    getFragmentShader(gl, isWebGL2 = false) {
        let shader = gl.createShader(gl.FRAGMENT_SHADER);

        let fragmentShaderCode = '';

        if (!isWebGL2 && this.glVersion === 2) {
          throw('The shader expects WebGL 2.0');
        } else if (this.glVersion === 2) {
          fragmentShaderCode += '#version 300 es\n';
        }

        // Adding precision, see:
        // http://stackoverflow.com/questions/27058064/why-do-i-need-to-define-a-precision-value-in-webgl-shaders
        // and:
        // http://stackoverflow.com/questions/13780609/what-does-precision-mediump-float-mean
        fragmentShaderCode += '#ifdef GL_OES_standard_derivatives\n#extension GL_OES_standard_derivatives : enable\n#endif\n\n' +
            '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' +
            this.getFragmentShaderCode();

        gl.shaderSource(shader, fragmentShaderCode);
        gl.compileShader(shader);

        Lore.Shader.showCompilationInfo(gl, shader, this.name, 'Fragment Shader');
        return shader;
    }

    init(gl, isWebGL2 = false) {
        this.gl = gl;
        this.program = this.gl.createProgram();
        let vertexShader = this.getVertexShader(this.gl, isWebGL2);
        let fragmentShader = this.getFragmentShader(this.gl, isWebGL2);

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
    }

    updateUniforms(renderer) {
        // Always update time uniform if it exists
        if (this.uniforms['time']) {
            let unif = this.uniforms['time'];
            
            let currentTime = new Date().getTime();
            unif.value += currentTime - this.lastTime;
            this.lastTime = currentTime;

            Lore.Uniform.Set(this.gl, this.program, unif);
            
            unif.stale = false;
        }
        for (let uniform in this.uniforms) {
            let unif = this.uniforms[uniform];
            if (unif.stale) {
                Lore.Uniform.Set(this.gl, this.program, unif);
            }
        }
    }

    use() {
      this.gl.useProgram(this.program);
      this.updateUniforms();
    }

    static showCompilationInfo(gl, shader, name, prefix) {
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
}
