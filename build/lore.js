var Lore = {
    Version: '0.0.1'
};

if (typeof define === 'function' && define.amd) {
    define('lore', Lore);
} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Lore;
}

Lore.Mouse = {
    Left: 0,
    Middle: 1,
    Right: 2
}

Lore.Keyboard = {
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Shift: 16,
    Ctrl: 17,
    Alt: 18,
    Esc: 27
}

Lore.Shaders = {};
Lore.DrawModes = {
    points: 0,
    lines: 1,
    lineStrip: 2,
    lineLoop: 3,
    triangles: 4,
    traingleStrip: 5,
    triangleFan: 6
}
Lore.Color = function(r, g, b, a) {
    this.r = r || 0.0;
    this.g = g || 0.0;
    this.b = b || 0.0;
    this.a = a || 1.0;
}

Lore.Color.prototype = {
    constructor: Lore.Color,
    set: function(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;

        if (arguments.length == 4) this.a = a;
    }
}

Lore.Color.fromHex = function(hex) {
    // Thanks to Tim Down
    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    return result ? new Lore.Color(r / 255.0, g / 255.0, b / 255.0, 1.0) : null;
}
Lore.Renderer = function(targetId, options) {
    this.canvas = document.getElementById(targetId);
    this.clearColor = options.clearColor || new Lore.Color();
    this.clearDepth = 'clearDepth' in options ? options.clearDepth : 1.0;
    this.enableDepthTest = 'enableDepthTest' in options ? options.enableDepthTest : true;
    this.camera = options.camera || new Lore.OrthographicCamera(500 / -2, 500 / 2, 500 / 2, 500 / -2);
    this.shaders = []
    this.geometries = [];
    this.render = function(camera, geometries) {};

    this.init();
}

Lore.Renderer.prototype = {
    constructor: Lore.Renderer,
    ready: false,
    gl: null,
    init: function() {
        var _this = this;

        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.error('Could not initialize the WebGL context.');
            return;
        }

        this.gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
        this.gl.clearDepth(this.clearDepth);

        if (this.enableDepthTest) {
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LEQUAL);
        }

        this.updateViewport(0, 0, this.canvas.width, this.canvas.height);
        window.addEventListener('resize', function(event) {
            _this.updateViewport(0, 0, _this.canvas.width, _this.canvas.height);
        });

        this.ready = true;
        this.camera.translateZ(100);
        this.animate();
    },

    updateViewport: function(x, y, width, height) {
        this.gl.viewport(x, y, width, height);
    },

    animate: function() {
        var that = this;
        requestAnimationFrame(function() {
            that.animate();
        });
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.render(this.camera, this.geometries);
    },

    createProgram: function(shader) {
        shader.init(this.gl);
        this.shaders.push(shader);
        return this.shaders.length - 1;
    },

    createGeometry: function(name, shader) {
        var geometry = new Lore.Geometry(name, this.gl, this.shaders[shader]);
        this.geometries.push(geometry);
        return geometry;
    }
}
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
Lore.Uniform = function(name, value, type) {
    this.name = name;
    this.value = value;
    this.type = type;
    this.stale = true;
}

Lore.Uniform.prototype = {
    constructor: Lore.Uniform,

    setValue: function(value) {
        this.value = value;
        this.stale = true;
    }
}

Lore.Uniform.Set = function(gl, program, uniform) {
    var location = gl.getUniformLocation(program, uniform.name);

    if (uniform.type === 'int') {
        gl.uniform1i(location, uniform.value);
    } else if (uniform.type === 'int_vec2') {
        gl.uniform2iv(location, uniform.value);
    } else if (uniform.type === 'int_vec3') {
        gl.uniform3iv(location, uniform.value);
    } else if (uniform.type === 'int_vec4') {
        gl.uniform4iv(location, uniform.value);
    } else if (uniform.type === 'int_array') {
        gl.uniform1iv(location, uniform.value);
    } else if (uniform.type === 'float') {
        gl.uniform1f(location, uniform.value);
    } else if (uniform.type === 'float_vec2') {
        gl.uniform2fv(location, uniform.value);
    } else if (uniform.type === 'float_vec3') {
        gl.uniform3fv(location, uniform.value);
    } else if (uniform.type === 'float_vec4') {
        gl.uniform4fv(location, uniform.value);
    } else if (uniform.type === 'float_array') {
        gl.uniform1fv(location, uniform.value);
    } else if (uniform.type === 'float_mat2') {
        // false, see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix
        gl.uniformMatrix2fv(location, false, uniform.value);
    } else if (uniform.type === 'float_mat3') {
        gl.uniformMatrix3fv(location, false, uniform.value);
    } else if (uniform.type === 'float_mat4') {
        gl.uniformMatrix4fv(location, false, uniform.value);
    }

    // TODO: Add SAMPLER_2D and SAMPLER_CUBE

    uniform.stale = false;
}
// This is more or less the same implementation of a 3d node that
// THREE.js uses

Lore.Node = function() {
    this.type = 'Lore.Node';
    this.id = Lore.Node.createGUID();
    this.isVisible = true;
    this.position = new Lore.Vector3f();
    this.rotation = new Lore.Quaternion();
    this.scale = new Lore.Vector3f(1.0, 1.0, 1.0);
    this.up = new Lore.Vector3f(0.0, 1.0, 0.0);
    this.normalMatrix = new Lore.Matrix3f();
    this.modelMatrix = new Lore.Matrix4f();
    this.isStale = false;

    this.children = new Array();
    this.parent = null;
}

Lore.Node.prototype = {
    constructor: Lore.Node,

    applyMatrix: function(matrix) {
        this.modelMatrix.multiplyB(matrix);
    },

    getUpVector: function() {
        var x = this.rotation.components[0];
        var y = this.rotation.components[1];
        var z = this.rotation.components[2];
        var w = this.rotation.components[3];

        return new Lore.Vector3f(2 * (x * y - w * z),
                                 1 - 2 * (x * x + z * z),
                                 2 * (y * z + w * x)).normalize();
    },

    getForwardVector: function() {
        var x = this.rotation.components[0];
        var y = this.rotation.components[1];
        var z = this.rotation.components[2];
        var w = this.rotation.components[3];

        return new Lore.Vector3f(2 * (x * z + w * y),
                                 2 * (y * x - w * x),
                                 1- 2 * (x * x + y * y)).normalize();
    },

    getRightVector: function() {
        var x = this.rotation.components[0];
        var y = this.rotation.components[1];
        var z = this.rotation.components[2];
        var w = this.rotation.components[3];

        return new Lore.Vector3f(1 - 2 * (y * y + z * z),
                                 2 * (x * y + w * z),
                                 2 * (x * z - w * y)).normalize();
    },

    translateOnAxis: function(axis, distance) {
        // Axis should be normalized, following THREE.js
        var v = new Lore.Vector3f(axis.components[0], axis.components[1],
                                  axis.components[2]);
        v.applyQuaternion(this.rotation);
        v.multiplyScalar(distance);
        this.position.add(v)
        return this;
    },

    translateX: function(distance) {
        this.position.components[0] = this.position.components[0] + distance;
        return this;
    },

    translateY: function(distance) {
        this.position.components[1] = this.position.components[1] + distance;
        return this;
    },

    translateZ: function(distance) {
        this.position.components[2] = this.position.components[2] + distance;
        return this;
    },

    setTranslation: function(v) {
        this.position = v;
        return this;
    },

    setRotation: function(axis, angle) {
        this.rotation.setFromAxisAngle(axis, angle);
        return this;
    },

    rotate: function(axis, angle) {
        var q = new Lore.Quaternion(axis, angle);
        this.rotation.multiplyA(q);
        return this;
    },

    rotateX: function(angle) {
        this.rotation.rotateX(angle);
        return this;
    },

    rotateY: function(angle) {
        this.rotation.rotateY(angle);
        return this;
    },

    rotateZ: function(angle) {
        this.rotation.rotateZ(angle);
        return this;
    },

    getRotationMatrix: function() {
        return this.rotation.toRotationMatrix();
    },

    update: function() {
        this.modelMatrix.compose(this.position, this.rotation, this.scale);
        // if parent... this.modelMatrix = Lore.Matrix4f.multiply(this.parent.modelMatrix, this.modelMatrix);
        this.isStale = true;
    },

    getModelMatrix: function() {
        return this.modelMatrix.entries;
    }
}

Lore.Node.createGUID = function() {
    // See:
    // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
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

        this.gl.useProgram(this.shader.program);

        // Update the modelView and projection matrices
        if (renderer.camera.isProjectionMatrixStale) {
            this.shader.uniforms.projectionMatrix.setValue(renderer.camera.getProjectionMatrix());
            renderer.camera.isProjectionMatrixStale = false;
        }

        if (this.isStale || renderer.camera.isViewMatrixStale) {
            var modelViewMatrix = Lore.Matrix4f.multiply(renderer.camera.viewMatrix, this.modelMatrix);
            this.shader.uniforms.modelViewMatrix.setValue(modelViewMatrix.entries);

            this.isStale = false;
            this.isViewMatrixStale = false;
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
Lore.Attribute = function(data, attributeLength, name) {
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

Lore.Attribute.prototype = {
    constructor: Lore.Attribute,

    setFromVector: function(index, v) {
        this.data.set(v.components, index * this.attributeLength, v.components.length);
    },

    setFromVectorArray: function(arr) {
        if (this.attributeLength !== arr[0].components.length)
            throw 'The attribute has a length of ' + this.attributeLength + '. But the vectors have ' + arr[0].components.length + ' components.';

        for (var i = 0; i < arr.length; i++) {
            this.data.set(arr[i].components, i * this.attributeLength, arr[i].components.length);
        }
    },

    getX: function(index) {
        return this.data[index * this.attributeLength];
    },

    setX: function(index, value) {
        this.data[index * this.attributeLength];
    },

    getY: function(index) {
        return this.data[index * this.attributeLength + 1];
    },

    setY: function(index, value) {
        this.data[index * this.attributeLength + 1];
    },

    getZ: function(index) {
        return this.data[index * this.attributeLength + 2];
    },

    setZ: function(index, value) {
        this.data[index * this.attributeLength + 2];
    },
    getW: function(index) {
        return this.data[index * this.attributeLength + 3];
    },

    setW: function(index, value) {
        this.data[index * this.attributeLength + 3];
    },

    getGlType: function(gl) {
        // Just floats for now
        // TODO: Add additional types.
        return gl.FLOAT;
    },

    update: function(gl) {
        gl.bindBuffer(this.bufferType, this.buffer);
        gl.bufferData(this.bufferType, this.data, this.drawMode);
        this.stale = false;
    },

    createBuffer: function(gl, program, bufferType, drawMode) {
        this.buffer = gl.createBuffer();
        this.bufferType = bufferType || gl.ARRAY_BUFFER;
        this.drawMode = drawMode || gl.STATIC_DRAW;

        gl.bindBuffer(this.bufferType, this.buffer);
        gl.bufferData(this.bufferType, this.data, this.drawMode);

        this.buffer.itemSize = this.attributeLength;
        this.buffer.numItems = this.size;

        this.attributeLocation = gl.getAttribLocation(program, this.name);
        gl.bindBuffer(this.bufferType, null);
    },

    bind: function(gl) {
        gl.bindBuffer(this.bufferType, this.buffer);

        // Only enable attribute if it actually exists in the Shader
        if (this.attributeLocation >= 0) {
            gl.vertexAttribPointer(this.attributeLocation, this.attributeLength, this.getGlType(gl), gl.FALSE, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocation);
        }
    }
}
Lore.ControlsBase = function(renderer) {
    this.canvas = renderer.canvas;
    this.mouse = {
        previousPosition: {
            x: null,
            y: null
        },
        delta: {
            x: 0.0,
            y: 0.0
        },
        position: {
            x: 0.0,
            y: 0.0
        },
        state: {
            left: false,
            middle: false,
            right: false
        }
    };

    this.keyboard = {
        alt: false,
        ctrl: false,
        shift: false
    }

    this.mousemove = function(e) {};
    this.mouseup = function(e, source) {};
    this.mousedown = function(e, source) {};
    this.mousedrag = function(e, source) {};

    var that = this;
    this.canvas.addEventListener('mousemove', function(e) {
        if (that.mouse.previousPosition.x !== null && that.mouse.state.left) {
            that.mouse.delta.x = e.pageX - that.mouse.previousPosition.x;
            that.mouse.delta.y = e.pageY - that.mouse.previousPosition.y;

            that.mouse.position.x += 0.01 * that.mouse.delta.x;
            that.mouse.position.y += 0.01 * that.mouse.delta.y;

            that.mousemove(that.mouse.delta);

            // Give priority to left, then middle, then right
            if (that.mouse.state.left) {
                that.mousedrag(that.mouse.delta, 'left');
            } else if (that.mouse.state.middle) {
                that.mousedrag(that.mouse.delta, 'middle');
            } else if (that.mouse.state.right) {
                that.mousedrag(that.mouse.delta, 'right');
            }
        }

        that.mouse.previousPosition.x = e.pageX;
        that.mouse.previousPosition.y = e.pageY;
    });

    this.canvas.addEventListener('keydown', function(e) {
        if (e.which == 16) {
            that.keyboard.shift = true;
        } else if (e.which == 17) {
            that.keyboard.ctrl = true;
        } else if (e.which == 18) {
            that.keyboard.alt = true;
        }
    });

    this.canvas.addEventListener('keyup', function(e) {
        if (e.which == 16) {
            that.keyboard.shift = false;
        } else if (e.which == 17) {
            that.keyboard.ctrl = false;
        } else if (e.which == 18) {
            that.keyboard.alt = false;
        }
    });

    this.canvas.addEventListener('mousedown', function(e) {
        var btn = e.button;
        var source = 'left';

        // Only handle single button events
        if (btn == 0) {
            that.mouse.state.left = true;
        } else if (btn == 1) {
            that.mouse.state.middle = true;
            source = 'middle';
        } else if (btn == 2) {
            that.mouse.state.right = true;
            source = 'right';
        }

        that.mousedown(that, source);
    });

    this.canvas.addEventListener('mouseup', function(e) {
        var btn = e.button;
        var source = 'left';

        // Only handle single button events
        if (btn == 0) {
            that.mouse.state.left = false;
        } else if (btn == 1) {
            that.mouse.state.middle = false;
            source = 'middle';
        } else if (btn == 2) {
            that.mouse.state.right = false;
            source = 'right';
        }

        // Reset the previous position and delta of the mouse
        that.mouse.previousPosition.x = null;
        that.mouse.previousPosition.y = null;

        that.mouseup(that, source);
    });
}

Lore.ControlsBase.prototype = {
    constructor: Lore.ControlsBase,
}
Lore.OrbitalControls = function(renderer, radius) {
    Lore.ControlsBase.call(this, renderer);
    this.radius = radius;
    this.camera = renderer.camera;
    this.x = 0;
    this.y = 0;
    
    this.camera.position = new Lore.Vector3f(0, 0, radius);
    this.camera.updateProjectionMatrix();
    this.camera.updateViewMatrix();
    
    var that = this;
    this.mousedrag = function(e, source) {
	
        if(source == 'left') {
	       // Rotate
            that.x += e.x * 0.01;
            that.y += e.y * 0.01;
            
            if(that.y < -1.57079632679) that.y = -1.57079632679;
            if(that.y >  1.57079632679) that.y =  1.57079632679;
            
            var lookAt = that.camera.lookAt.components;
            that.camera.position.components[0] = lookAt[0] + that.radius * Math.sin(-that.x) * Math.cos(that.y);
            that.camera.position.components[1] = lookAt[1] + that.radius * Math.sin(that.y);
            that.camera.position.components[2] = lookAt[2] + that.radius * Math.cos(-that.x) * Math.cos(that.y);
            
            var m = Lore.Matrix4f.lookAt(that.camera.position, that.camera.getLookAt(), that.camera.getUpVector());
            that.camera.rotation.setFromMatrix(m);
        }
	    
        that.camera.updateProjectionMatrix();
        that.camera.updateViewMatrix();
    };
}

Lore.OrbitalControls.prototype = Object.assign(Object.create(Lore.ControlsBase.prototype), {
    constructor: Lore.OrbitalControls,
});
Lore.CameraBase = function() {
    Lore.Node.call(this);
    this.type = 'Lore.CameraBase';
    this.renderer = null;
    this.isProjectionMatrixStale = false;
    this.isViewMatrixStale = false;
    
    this.lookAt = new Lore.Vector3f();
    this.projectionMatrix = new Lore.ProjectionMatrix();
    this.viewMatrix = new Lore.Matrix4f();
}

Lore.CameraBase.prototype = Object.assign(Object.create(Lore.Node.prototype), {
    constructor: Lore.CameraBase,

    init: function(gl, program) {
        this.gl = gl;
        this.program = program;
    },

    setLookAt: function(v) {
        this.lookAt = v;
    },

    updateProjectionMatrix: function() {

    },

    updateViewMatrix: function() {
        var viewMatrix = Lore.Matrix4f.compose(this.position, this.rotation, this.scale);
        viewMatrix.invert();
        this.viewMatrix = viewMatrix;
        this.isViewMatrixStale = true;
    },

    getLookAt: function() {
        return this.lookAt;
    },

    getProjectionMatrix: function() {
        return this.projectionMatrix.entries;
    },

    getViewMatrix: function() {
        return this.viewMatrix.entries;
    }
});
Lore.OrthographicCamera = function(left, right, top, bottom, near, far) {
    Lore.CameraBase.call(this);
    this.type = 'Lore.OrthographicCamera';
    this.zoom = 1.0;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near || 0.1;
    this.far = far || 2500;

    this.updateProjectionMatrix();
}

Lore.OrthographicCamera.prototype = Object.assign(Object.create(Lore.CameraBase.prototype), {
    constructor: Lore.OrthographicCamera,

    updateProjectionMatrix: function() {
        var width = (this.right - this.left) / (2.0 * this.zoom);
        var height = (this.top - this.bottom) / (2.0 * this.zoom);
        var x = (this.right + this.left) / 2.0;
        var y = (this.top + this.bottom) / 2.0;

        var left = x - width;
        var right = x + width;
        var top = y + height;
        var bottom = y - height;

        this.projectionMatrix.setOrthographic(left, right, top, bottom, this.near, this.far);
        this.isProjectionMatrixStale = true;
    }
});
Lore.Array2 = function(arr) {
    this.arr = arr;
}

Lore.Array2.prototype = {
    constructor: Lore.Array2,

    multiply: function(index, x, y) {
        index <<= 1;
        this.arr[index] *= x;
        this.arr[index + 1] *= y;
    },

    multiplyScalar: function(index, s) {
        index <<= 1;
        this.arr[index] *= s;
        this.arr[index + 1] *= s;
    },

    divide: function(index, x, y) {
        index <<= 1;
        this.arr[index] /= x;
        this.arr[index + 1] /= y;
    },

    divideScalar: function(index, s) {
        index <<= 1;
        this.arr[index] /= s;
        this.arr[index + 1] /= s;
    },

    add: function(index, x, y) {
        index <<= 1;
        this.arr[index] += x;
        this.arr[index + 1] += y;
    },

    subtract: function(index, x, y) {
        index <<= 1;
        this.arr[index] -= x;
        this.arr[index + 1] -= y;
    }
}
Lore.Array3 = function(arr) {
    this.arr = arr;
}

Lore.Array3.prototype = {
    constructor: Lore.Array3,

    multiply: function(index, x, y, z) {
        index *= 3;
        this.arr[index] *= x;
        this.arr[index + 1] *= y;
        this.arr[index + 2] *= z;
    },

    multiplyScalar: function(index, s) {
        index *= 3;
        this.arr[index] *= s;
        this.arr[index + 1] *= s;
        this.arr[index + 2] *= s;
    },

    divide: function(index, x, y, z) {
        index *= 3;
        this.arr[index] /= x;
        this.arr[index + 1] /= y;
        this.arr[index + 2] /= z;
    },

    divideScalar: function(index, s) {
        index *= 3;
        this.arr[index] /= s;
        this.arr[index + 1] /= s;
        this.arr[index + 2] /= s;
    },

    add: function(index, x, y, z) {
        index *= 3;
        this.arr[index] += x;
        this.arr[index + 1] += y;
        this.arr[index + 2] += z;
    },

    subtract: function(index, x, y, z) {
        index *= 3;
        this.arr[index] -= x;
        this.arr[index + 1] -= y;
        this.arr[index + 2] -= z;
    }
}
Lore.Vector2f = function(x, y) {
    this.components = new Float32Array(2);
    this.components[0] = x || 0.0;
    this.components[1] = y || 0.0;
}

Lore.Vector2f.prototype = {
    constructor: Lore.Vector2f,

    set: function(x, y) {
        this.components[0] = x;
        this.components[1] = y;

        return this;
    },

    getX: function() {
        return this.components[0];
    },

    getY: function() {
        return this.components[1];
    },

    setX: function(x) {
        this.components[0] = x;
    },

    setY: function(y) {
        this.components[1] = y;
    },

    lengthSq: function() {
        return this.components[0] * this.components[0] +
            this.components[1] * this.components[1];
    },

    length: function() {
        return Math.sqrt(this.lengthSq());
    },

    multiply: function(v) {
        this.components[0] *= v.components[0];
        this.components[1] *= v.components[1];
        return this;
    },

    multiplyScalar: function(s) {
        this.components[0] *= s;
        this.components[1] *= s;
        return this;
    },

    divide: function(v) {
        this.components[0] /= v.components[0];
        this.components[1] /= v.components[1];
        return this;
    },

    divideScalar: function(s) {
        this.components[0] /= s;
        this.components[1] /= s;
        return this;
    },

    add: function(v) {
        this.components[0] += v.components[0];
        this.components[1] += v.components[1];
        return this;
    },

    subtract: function(v) {
        this.components[0] -= v.components[0];
        this.components[1] -= v.components[1];
        return this;
    },

    clone: function() {
        return new Lore.Vector2f(this.components[0], this.components[1]);
    },

    equals: function(v) {
        return this.components[0] === v.components[0] &&
            this.components[1] === v.components[1];
    }
}

Lore.Vector2f.multiply = function(u, v) {
    return new Lore.Vector2f(u.components[0] * v.components[0],
        u.components[1] * v.components[1]);
}

Lore.Vector2f.multiplyScalar = function(v, s) {
    return new Lore.Vector2f(v.components[0] * s,
        v.components[1] * s);
}

Lore.Vector2f.divide = function(u, v) {
    return new Lore.Vector2f(u.components[0] / v.components[0],
        u.components[1] / v.components[1]);
}

Lore.Vector2f.divideScalar = function(v, s) {
    return new Lore.Vector2f(v.components[0] / s,
        v.components[1] / s);
}

Lore.Vector2f.add = function(u, v) {
    return new Lore.Vector2f(u.components[0] + v.components[0],
        u.components[1] + v.components[1]);
}

Lore.Vector2f.subtract = function(u, v) {
    return new Lore.Vector2f(u.components[0] - v.components[0],
        u.components[1] - v.components[1]);
}
Lore.Vector3f = function(x, y, z) {
    if (arguments.length === 1) {
        this.components = new Float32Array(x);
    } else {
        this.components = new Float32Array(3);
        this.components[0] = x || 0.0;
        this.components[1] = y || 0.0;
        this.components[2] = z || 0.0;
    }
}

Lore.Vector3f.prototype = {
    constructor: Lore.Vector3f,

    set: function(x, y, z) {
        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        return this;
    },

    getX: function() {
        return this.components[0];
    },

    getY: function() {
        return this.components[1];
    },

    getZ: function() {
        return this.components[2];
    },

    setX: function(x) {
        this.components[0] = x;
        return this;
    },

    setY: function(y) {
        this.components[1] = y;
        return this;
    },

    setZ: function(z) {
        this.components[2] = z;
        return this;
    },

    setLength: function(length) {
        return this.multiplyScalar(length / this.length());
    },

    lengthSq: function() {
        return this.components[0] * this.components[0] +
            this.components[1] * this.components[1] +
            this.components[2] * this.components[2];
    },

    length: function() {
        return Math.sqrt(this.lengthSq());
    },

    normalize: function() {
        return this.divideScalar(this.length());
    },

    multiply: function(v) {
        this.components[0] *= v.components[0];
        this.components[1] *= v.components[1];
        this.components[2] *= v.components[2];
        return this;
    },

    multiplyScalar: function(s) {
        this.components[0] *= s;
        this.components[1] *= s;
        this.components[2] *= s;
        return this;
    },

    divide: function(v) {
        this.components[0] /= v.components[0];
        this.components[1] /= v.components[1];
        this.components[2] /= v.components[2];
        return this;
    },

    divideScalar: function(s) {
        this.components[0] /= s;
        this.components[1] /= s;
        this.components[2] /= s;
        return this;
    },

    add: function(v) {
        this.components[0] += v.components[0];
        this.components[1] += v.components[1];
        this.components[2] += v.components[2];
        return this;
    },

    subtract: function(v) {
        this.components[0] -= v.components[0];
        this.components[1] -= v.components[1];
        this.components[2] -= v.components[2];
        return this;
    },

    applyQuaternion: function(q) {
        var x = this.components[0];
        var y = this.components[1];
        var z = this.components[2];

        var qx = q.components[0];
        var qy = q.components[1];
        var qz = q.components[2];
        var qw = q.components[3];

        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;

        this.components[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.components[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.components[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    },

    clone: function() {
        return new Lore.Vector3f(this.components[0], this.components[1],
            this.components[2]);
    },

    equals: function(v) {
        return this.components[0] === v.components[0] &&
            this.components[1] === v.components[1] &&
            this.components[2] === v.components[2];
    },

    toString: function() {
        return '(' + this.components[0] + ', ' + this.components[1] + ', ' 
                   + this.components[2] + ')';
    }
}

Lore.Vector3f.normalize = function(v) {
    return Lore.Vector3f.divideScalar(v, v.length());
}

Lore.Vector3f.multiply = function(u, v) {
    return new Lore.Vector3f(u.components[0] * v.components[0],
        u.components[1] * v.components[1],
        u.components[2] * v.components[2]);
}

Lore.Vector3f.multiplyScalar = function(v, s) {
    return new Lore.Vector3f(v.components[0] * s,
        v.components[1] * s,
        v.components[2] * s);
}

Lore.Vector3f.divide = function(u, v) {
    return new Lore.Vector3f(u.components[0] / v.components[0],
        u.components[1] / v.components[1],
        u.components[2] / v.components[2]);
}

Lore.Vector3f.divideScalar = function(v, s) {
    return new Lore.Vector3f(v.components[0] / s,
        v.components[1] / s,
        v.components[2] / s);
}

Lore.Vector3f.add = function(u, v) {
    return new Lore.Vector3f(u.components[0] + v.components[0],
        u.components[1] + v.components[1],
        u.components[2] + v.components[2]);
}

Lore.Vector3f.subtract = function(u, v) {
    return new Lore.Vector3f(u.components[0] - v.components[0],
        u.components[1] - v.components[1],
        u.components[2] - v.components[2]);
}

Lore.Vector3f.cross = function(u, v) {
    return new Lore.Vector3f(
        u.components[1] * v.components[2] - u.components[2] * v.components[1],
        u.components[2] * v.components[0] - u.components[0] * v.components[2],
        u.components[0] * v.components[1] - u.components[1] * v.components[0]
    );
}

Lore.Vector3f.dot = function(u, v) {
    return u.components[0] * v.components[0] +
        u.components[1] * v.components[1] +
        u.components[2] * v.components[2];
}
Lore.Matrix3f = function(entries) {
    this.entries = entries || new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]);
}

Lore.Matrix3f.prototype = {
    constructor: Lore.Matrix3f,

    clone: function() {
        return new Lore.Matrix3f(new Float32Array(this.entries));
    },

    equals: function(m) {
        for (var i = 0; i < this.entries.length; i++) {
            if (this.entries[i] !== m.entries[i]) return false;
        }

        return true;
    }
}
Lore.Matrix4f = function(entries) {
    // Do NOT go double precision on GPUs!!!
    // See:
    // http://stackoverflow.com/questions/2079906/float-vs-double-on-graphics-hardware
    this.entries = entries || new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

Lore.Matrix4f.prototype = {
    constructor: Lore.Matrix4f,

    set: function(m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23,
        m30, m31, m32, m33) {
        this.entries.set([m00, m10, m20, m30,
            m01, m11, m21, m31,
            m02, m12, m22, m32,
            m03, m13, m23, m33
        ]);
    },

    multiplyA: function(b) {
        // First, store the values in local variables.
        // See:
        // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html

        var a00 = this.entries[0],
            a01 = this.entries[4],
            a02 = this.entries[8],
            a03 = this.entries[12];
        var a10 = this.entries[1],
            a11 = this.entries[5],
            a12 = this.entries[9],
            a13 = this.entries[13];
        var a20 = this.entries[2],
            a21 = this.entries[6],
            a22 = this.entries[10],
            a23 = this.entries[14];
        var a30 = this.entries[3],
            a31 = this.entries[7],
            a32 = this.entries[11],
            a33 = this.entries[15];

        var b00 = b.entries[0],
            b01 = b.entries[4],
            b02 = b.entries[8],
            b03 = b.entries[12];
        var b10 = b.entries[1],
            b11 = b.entries[5],
            b12 = b.entries[9],
            b13 = b.entries[13];
        var b20 = b.entries[2],
            b21 = b.entries[6],
            b22 = b.entries[10],
            b23 = b.entries[14];
        var b30 = b.entries[3],
            b31 = b.entries[7],
            b32 = b.entries[11],
            b33 = b.entries[15];

        this.entries[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
        this.entries[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
        this.entries[2] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
        this.entries[3] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
        this.entries[4] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
        this.entries[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
        this.entries[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
        this.entries[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
        this.entries[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
        this.entries[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
        this.entries[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
        this.entries[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
        this.entries[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
        this.entries[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
        this.entries[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
        this.entries[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

        return this;
    },

    multiplyB: function(a) {
        // First, store the values in local variables.
        // See:
        // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html

        var a00 = a.entries[0],
            a01 = a.entries[4],
            a02 = a.entries[8],
            a03 = a.entries[12];
        var a10 = a.entries[1],
            a11 = a.entries[5],
            a12 = a.entries[9],
            a13 = a.entries[13];
        var a20 = a.entries[2],
            a21 = a.entries[6],
            a22 = a.entries[10],
            a23 = a.entries[14];
        var a30 = a.entries[3],
            a31 = a.entries[7],
            a32 = a.entries[11],
            a33 = a.entries[15];

        var b00 = this.entries[0],
            b01 = this.entries[4],
            b02 = this.entries[8],
            b03 = this.entries[12];
        var b10 = this.entries[1],
            b11 = this.entries[5],
            b12 = this.entries[9],
            b13 = this.entries[13];
        var b20 = this.entries[2],
            b21 = this.entries[6],
            b22 = this.entries[10],
            b23 = this.entries[14];
        var b30 = this.entries[3],
            b31 = this.entries[7],
            b32 = this.entries[11],
            b33 = this.entries[15];

        this.entries[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
        this.entries[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
        this.entries[2] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
        this.entries[3] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
        this.entries[4] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
        this.entries[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
        this.entries[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
        this.entries[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
        this.entries[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
        this.entries[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
        this.entries[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
        this.entries[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
        this.entries[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
        this.entries[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
        this.entries[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
        this.entries[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

        return this;
    },

    scale: function(v) {
        var x = v.components[0];
        var y = v.components[1];
        var z = v.components[2];

        this.entries[0] *= x;
        this.entries[4] *= y;
        this.entries[8] *= z;
        this.entries[1] *= x;
        this.entries[5] *= y;
        this.entries[9] *= z;
        this.entries[2] *= x;
        this.entries[6] *= y;
        this.entries[10] *= z;
        this.entries[3] *= x;
        this.entries[7] *= y;
        this.entries[11] *= z;

        return this;
    },

    setPosition: function(v) {
        this.entries[12] = v.components[0];
        this.entries[13] = v.components[1];
        this.entries[14] = v.components[2];

        return this;
    },

    setRotation: function(q) {
        var x = q.components[0];
        var y = q.components[1];
        var z = q.components[2];
        var w = q.components[3];

        var x2 = x + x,
            y2 = y + y,
            z2 = z + z;
        var xx = x * x2,
            xy = x * y2,
            xz = x * z2;
        var yy = y * y2,
            yz = y * z2,
            zz = z * z2;
        var wx = w * x2,
            wy = w * y2,
            wz = w * z2;

        this.entries[0] = 1 - (yy + zz);
        this.entries[1] = xy + wz;
        this.entries[2] = xz - wy;
        this.entries[4] = xy - wz;
        this.entries[5] = 1 - (xx + zz);
        this.entries[6] = yz + wx;
        this.entries[8] = xz + wy;
        this.entries[9] = yz - wx;
        this.entries[10] = 1 - (xx + yy);

        return this;
    },

    determinant: function() {
        var a00 = a.entries[0],
            a01 = a.entries[4],
            a02 = a.entries[8],
            a03 = a.entries[12];
        var a10 = a.entries[1],
            a11 = a.entries[5],
            a12 = a.entries[9],
            a13 = a.entries[13];
        var a20 = a.entries[2],
            a21 = a.entries[6],
            a22 = a.entries[10],
            a23 = a.entries[14];
        var a30 = a.entries[3],
            a31 = a.entries[7],
            a32 = a.entries[11],
            a33 = a.entries[15];

        return (
            a30 * (
                a03 * a12 * a21 - a02 * a13 * a21 -
                a03 * a11 * a22 + a01 * a13 * a22 +
                a02 * a11 * a23 - a01 * a12 * a23
            ) +
            a31 * (
                a00 * a12 * a23 - a00 * a13 * a22 +
                a03 * a10 * a22 - a02 * a10 * a23 +
                a02 * a13 * a20 - a03 * a12 * a20
            ) +
            a32 * (
                a00 * a13 * a21 - a00 * a11 * a23 -
                a03 * a10 * a21 + a01 * a10 * a23 +
                a03 * a11 * a20 - a01 * a13 * a20
            ) +
            a33 * (-a02 * a11 * a20 - a00 * a12 * a21 +
                a00 * a11 * a22 + a02 * a10 * a21 -
                a01 * a10 * a22 + a01 * a12 * a20
            )
        );
    },

    decompose: function(outPosition, outQuaternion, outScale) {
        var v = new Lore.Vector3f();
        var m = new Lore.Matrix4f();

        // The position is the simple one
        position.set(this.entries[12], this.entries[13], this.entries[14]);

        // Calculate the scale
        var sx = Math.sqrt(this.entries[0] * this.entries[0] +
            this.entries[1] * this.entries[1] +
            this.entries[2] * this.entries[2]);

        var sy = Math.sqrt(this.entries[4] * this.entries[4] +
            this.entries[5] * this.entries[5] +
            this.entries[6] * this.entries[6]);

        var sz = Math.sqrt(this.entries[8] * this.entries[8] +
            this.entries[9] * this.entries[9] +
            this.entries[10] * this.entries[10]);

        var det = this.determinant();
        if (det < 0) sx = -sx;

        // Set the scale
        outScale.set(sx, sy, sz);

        // Get the info for the quaternion, this involves scaling the rotation
        // See:
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/
        var isx = 1.0 / sx;
        var isy = 1.0 / sy;
        var isz = 1.0 / sz;

        m.entries.set(this.entries);

        m.entries[0] *= isx;
        m.entries[1] *= isx;
        m.entries[2] *= isx;

        m.entries[4] *= isy;
        m.entries[5] *= isy;
        m.entries[6] *= isy;

        m.entries[8] *= isz;
        m.entries[9] *= isz;
        m.entries[10] *= isz;

        outQuaternion.setFromMatrix(m);

        return this;
    },

    compose: function(position, quaternion, scale) {
        this.setRotation(quaternion);
        this.scale(scale);
        this.setPosition(position);

        return this;
    },

    invert: function() {
        // Fugly implementation lifted from MESA (originally in C++)
        var im = new Lore.Matrix4f();
        var m = this.entries;

        im.entries[0] = m[5] * m[10] * m[15] -
            m[5] * m[11] * m[14] -
            m[9] * m[6] * m[15] +
            m[9] * m[7] * m[14] +
            m[13] * m[6] * m[11] -
            m[13] * m[7] * m[10];

        im.entries[4] = -m[4] * m[10] * m[15] +
            m[4] * m[11] * m[14] +
            m[8] * m[6] * m[15] -
            m[8] * m[7] * m[14] -
            m[12] * m[6] * m[11] +
            m[12] * m[7] * m[10];

        im.entries[8] = m[4] * m[9] * m[15] -
            m[4] * m[11] * m[13] -
            m[8] * m[5] * m[15] +
            m[8] * m[7] * m[13] +
            m[12] * m[5] * m[11] -
            m[12] * m[7] * m[9];

        im.entries[12] = -m[4] * m[9] * m[14] +
            m[4] * m[10] * m[13] +
            m[8] * m[5] * m[14] -
            m[8] * m[6] * m[13] -
            m[12] * m[5] * m[10] +
            m[12] * m[6] * m[9];

        im.entries[1] = -m[1] * m[10] * m[15] +
            m[1] * m[11] * m[14] +
            m[9] * m[2] * m[15] -
            m[9] * m[3] * m[14] -
            m[13] * m[2] * m[11] +
            m[13] * m[3] * m[10];

        im.entries[5] = m[0] * m[10] * m[15] -
            m[0] * m[11] * m[14] -
            m[8] * m[2] * m[15] +
            m[8] * m[3] * m[14] +
            m[12] * m[2] * m[11] -
            m[12] * m[3] * m[10];

        im.entries[9] = -m[0] * m[9] * m[15] +
            m[0] * m[11] * m[13] +
            m[8] * m[1] * m[15] -
            m[8] * m[3] * m[13] -
            m[12] * m[1] * m[11] +
            m[12] * m[3] * m[9];

        im.entries[13] = m[0] * m[9] * m[14] -
            m[0] * m[10] * m[13] -
            m[8] * m[1] * m[14] +
            m[8] * m[2] * m[13] +
            m[12] * m[1] * m[10] -
            m[12] * m[2] * m[9];

        im.entries[2] = m[1] * m[6] * m[15] -
            m[1] * m[7] * m[14] -
            m[5] * m[2] * m[15] +
            m[5] * m[3] * m[14] +
            m[13] * m[2] * m[7] -
            m[13] * m[3] * m[6];

        im.entries[6] = -m[0] * m[6] * m[15] +
            m[0] * m[7] * m[14] +
            m[4] * m[2] * m[15] -
            m[4] * m[3] * m[14] -
            m[12] * m[2] * m[7] +
            m[12] * m[3] * m[6];

        im.entries[10] = m[0] * m[5] * m[15] -
            m[0] * m[7] * m[13] -
            m[4] * m[1] * m[15] +
            m[4] * m[3] * m[13] +
            m[12] * m[1] * m[7] -
            m[12] * m[3] * m[5];

        im.entries[14] = -m[0] * m[5] * m[14] +
            m[0] * m[6] * m[13] +
            m[4] * m[1] * m[14] -
            m[4] * m[2] * m[13] -
            m[12] * m[1] * m[6] +
            m[12] * m[2] * m[5];

        im.entries[3] = -m[1] * m[6] * m[11] +
            m[1] * m[7] * m[10] +
            m[5] * m[2] * m[11] -
            m[5] * m[3] * m[10] -
            m[9] * m[2] * m[7] +
            m[9] * m[3] * m[6];

        im.entries[7] = m[0] * m[6] * m[11] -
            m[0] * m[7] * m[10] -
            m[4] * m[2] * m[11] +
            m[4] * m[3] * m[10] +
            m[8] * m[2] * m[7] -
            m[8] * m[3] * m[6];

        im.entries[11] = -m[0] * m[5] * m[11] +
            m[0] * m[7] * m[9] +
            m[4] * m[1] * m[11] -
            m[4] * m[3] * m[9] -
            m[8] * m[1] * m[7] +
            m[8] * m[3] * m[5];

        im.entries[15] = m[0] * m[5] * m[10] -
            m[0] * m[6] * m[9] -
            m[4] * m[1] * m[10] +
            m[4] * m[2] * m[9] +
            m[8] * m[1] * m[6] -
            m[8] * m[2] * m[5];

        var det = m[0] * im.entries[0] +
            m[1] * im.entries[4] +
            m[2] * im.entries[8] +
            m[3] * im.entries[12];

        if (det == 0)
            throw 'Determinant is zero.';

        det = 1.0 / det;

        for (var i = 0; i < 16; i++)
            this.entries[i] = im.entries[i] * det;

        return this;
    },

    clone: function() {
        return new Lore.Matrix4f(new Float32Array(this.entries));
    },

    equals: function(a) {
        for (var i = 0; i < this.entries.length; i++) {
            if (this.entries[i] !== a.entries[i]) return false;
        }

        return true;
    }
}

Lore.Matrix4f.multiply = function(a, b) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html

    var a00 = a.entries[0],
        a01 = a.entries[4],
        a02 = a.entries[8],
        a03 = a.entries[12];
    var a10 = a.entries[1],
        a11 = a.entries[5],
        a12 = a.entries[9],
        a13 = a.entries[13];
    var a20 = a.entries[2],
        a21 = a.entries[6],
        a22 = a.entries[10],
        a23 = a.entries[14];
    var a30 = a.entries[3],
        a31 = a.entries[7],
        a32 = a.entries[11],
        a33 = a.entries[15];

    var b00 = b.entries[0],
        b01 = b.entries[4],
        b02 = b.entries[8],
        b03 = b.entries[12];
    var b10 = b.entries[1],
        b11 = b.entries[5],
        b12 = b.entries[9],
        b13 = b.entries[13];
    var b20 = b.entries[2],
        b21 = b.entries[6],
        b22 = b.entries[10],
        b23 = b.entries[14];
    var b30 = b.entries[3],
        b31 = b.entries[7],
        b32 = b.entries[11],
        b33 = b.entries[15];

    return new Lore.Matrix4f(new Float32Array([
        a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
        a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
        a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
        a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
        a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
        a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
        a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
        a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
        a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
        a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
        a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
        a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
        a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
        a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
        a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
        a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33
    ]));
}

Lore.Matrix4f.fromQuaternion = function(q) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html
    // https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation#Quaternion-derived_rotation_matrix
    var x = q.components[0],
        y = q.components[1],
        z = q.components[2],
        w = q.components[3];
    var x2 = x + x,
        y2 = y + y,
        z2 = z + z;
    var xx = x * x2,
        xy = x * y2,
        xz = x * z2;
    var yy = y * y2,
        yz = y * z2,
        zz = z * z2;
    var wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    return new Lore.Matrix4f(new Float32Array([
        1 - (yy + zz), xy + wz, xz - wy, 0,
        xy - wz, 1 - (xx + zz), yz + wx, 0,
        xz + wy, yz - wx, 1 - (xx + yy), 0,
        0, 0, 0, 1
    ]));
}

Lore.Matrix4f.lookAt = function(cameraPosition, target, cameraUp) {
    // See here in order to return a quaternion directly:
    // http://www.euclideanspace.com/maths/algebra/vectors/lookat/

    var z = Lore.Vector3f.subtract(cameraPosition, target).normalize();

    if (z.lengthSq() === 0.0) {
        z.components[2] = 1.0
    }

    var x = Lore.Vector3f.cross(cameraUp, z).normalize();

    if (x.lengthSq() === 0.0) {
        z.components[2] += 0.0001;
        x = Lore.Vector3f.cross(cameraUp, z).normalize();
    }

    var y = Lore.Vector3f.cross(z, x);
    return new Lore.Matrix4f(new Float32Array([
        x.components[0], x.components[1], x.components[2], 0,
        y.components[0], y.components[1], y.components[2], 0,
        z.components[0], z.components[1], z.components[2], 0,
        0, 0, 0, 1
    ]));
}

Lore.Matrix4f.compose = function(position, quaternion, scale) {
    var m = new Lore.Matrix4f();

    m.setRotation(quaternion);
    m.scale(scale);
    m.setPosition(position);

    return m;
}
Lore.Quaternion = function(x, y, z, w) {
    if (arguments.length === 1) {
        this.components = new Float32Array(x);
    } else if (arguments.length === 2) {
        this.components = new Float32Array(4);
        this.setFromAxisAngle(x, y);
    } else {
        this.components = new Float32Array(4);
        this.components[0] = x || 0.0;
        this.components[1] = y || 0.0;
        this.components[2] = z || 0.0;
        this.components[3] = (w !== undefined) ? w : 1.0;
    }
}

Lore.Quaternion.prototype = {
    constructor: Lore.Quaternion,

    getX: function() {
        return this.components[0];
    },

    getY: function() {
        return this.components[1];
    },

    getZ: function() {
        return this.components[2];
    },

    getW: function() {
        return this.components[3];
    },

    set: function(x, y, z, w) {
        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        this.components[3] = w;
    },

    setX: function(x) {
        this.components[0] = x;
    },

    setY: function(y) {
        this.components[1] = y;
    },

    setZ: function(z) {
        this.components[2] = z;
    },

    setW: function(w) {
        this.components[3] = w;
    },

    setFromAxisAngle: function(axis, angle) {
        // See:
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

        // Normalize the axis. The resulting quaternion will be normalized as well
        var normAxis = Lore.Vector3f.normalize(axis);
        var halfAngle = angle / 2.0;
        var sinHalfAngle = Math.sin(halfAngle);

        this.components[0] = normAxis.components[0] * sinHalfAngle;
        this.components[1] = normAxis.components[1] * sinHalfAngle;
        this.components[2] = normAxis.components[2] * sinHalfAngle;
        this.components[3] = Math.cos(halfAngle);
    },

    setLookAt: function(source, dest) {
        var forward = Lore.Vector3f.subtract(source, dest).normalize();
        var fw = new Lore.Vector3f(0, 0, 1);
        var dot = Lore.Vector3f.dot(fw, forward);
        console.log(dot);        
        if(Math.abs(dot + 1.0) < 0.000001) {
            this.set(0, 1, 0, 3.1415926535897932);
            return;
        }
        
        if(Math.abs(dot - 1.0) < 0.000001) {
            this.set(0, 0, 0, 1);
            return;
        }
        
        var angle = Math.acos(dot);

        var axis = Lore.Vector3f.cross(fw, forward).normalize();
        this.setFromAxisAngle(axis, angle);
    },

    lengthSq: function() {
        return this.components[0] * this.components[0] +
            this.components[1] * this.components[1] +
            this.components[2] * this.components[2] +
            this.components[3] * this.components[3];
    },

    length: function() {
        return Math.sqrt(this.lengthSq());
    },

    inverse: function() {
        return this.conjugate().normalize();
    },

    normalize: function() {
        var length = this.length();

        if (length === 0) {
            this.components[0] = 0.0;
            this.components[1] = 0.0;
            this.components[2] = 0.0;
            this.components[3] = 1.0;
        } else {
            var inv = 1 / length;
            this.components[0] *= inv;
            this.components[1] *= inv;
            this.components[2] *= inv;
            this.components[3] *= inv;
        }

        return this;
    },

    dot: function(q) {
        return this.components[0] * q.components[0] +
            this.components[1] * q.components[1] +
            this.components[2] * q.components[2] +
            this.components[3] * q.components[3];
    },

    multiplyA: function(b) {
        // See:
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

        var x = this.components[0] * b.components[3] + this.components[3] * b.components[0] + this.components[1] * b.components[2] - this.components[2] * b.components[1];
        var y = this.components[1] * b.components[3] + this.components[3] * b.components[1] + this.components[2] * b.components[0] - this.components[0] * b.components[2];
        var z = this.components[2] * b.components[3] + this.components[3] * b.components[2] + this.components[0] * b.components[1] - this.components[1] * b.components[0];
        var w = this.components[3] * b.components[3] - this.components[0] * b.components[0] - this.components[1] * b.components[1] - this.components[2] * b.components[2];

        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        this.components[3] = w;

        return this;
    },

    multiplyB: function(a) {
        // See:
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

        var x = a.components[0] * this.components[3] + a.components[3] * this.components[0] + a.components[1] * this.components[2] - a.components[2] * this.components[1];
        var y = a.components[1] * this.components[3] + a.components[3] * this.components[1] + a.components[2] * this.components[0] - a.components[0] * this.components[2];
        var z = a.components[2] * this.components[3] + a.components[3] * this.components[2] + a.components[0] * this.components[1] - a.components[1] * this.components[0];
        var w = a.components[3] * this.components[3] - a.components[0] * this.components[0] - a.components[1] * this.components[1] - a.components[2] * this.components[2];

        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        this.components[3] = w;

        return this;
    },

    multiplyScalar: function(s) {
        this.components[0] *= s;
        this.components[1] *= s;
        this.components[2] *= s;
        this.components[3] *= s;

        return this;
    },

    conjugate: function() {
        // See:
        // http://www.3dgep.com/understanding-quaternions/#Quaternion_Conjugate
        this.components[0] *= -1;
        this.components[1] *= -1;
        this.components[2] *= -1;

        return this;
    },

    add: function(q) {
        this.components[0] += q.components[0];
        this.components[1] += q.components[1];
        this.components[2] += q.components[2];
        this.components[3] += q.components[3];

        return this;
    },

    subtract: function(q) {
        this.components[0] -= q.components[0];
        this.components[1] -= q.components[1];
        this.components[2] -= q.components[2];
        this.components[3] -= q.components[3];

        return this;
    },

    rotateX: function(angle) {
        var halfAngle = angle / 2.0;
        return this.multiplyA(
            new Lore.Quaternion(Math.sin(halfAngle), 0.0, 0.0, Math.cos(halfAngle))
        );
    },

    rotateY: function(angle) {
        var halfAngle = angle / 2.0;
        return this.multiplyA(
            new Lore.Quaternion(0.0, Math.sin(halfAngle), 0.0, Math.cos(halfAngle))
        );
    },

    rotateZ: function(angle) {
        var halfAngle = angle / 2.0;
        return this.multiplyA(
            new Lore.Quaternion(0.0, 0.0, Math.sin(halfAngle), Math.cos(halfAngle))
        );
    },

    toAxisAngle: function() {
        // It seems like this isn't numerically stable. This could be solved
        // by some checks as described here:
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
        // or here:
        // https://www.flipcode.com/documents/matrfaq.html#Q57
        // However, this function currently isn't used.
        console.warn('The method toAxisAngle() has not been implemented.')
    },

    toRotationMatrix: function() {
        var x = this.components[0];
        var y = this.components[1];
        var z = this.components[2];
        var w = this.components[3];

        var xx = x * x;
        var xy = x * y;
        var xz = x * z;
        var xw = x * w;

        var yw = y * w;
        var yy = y * y;
        var yz = y * z;

        var zz = z * z;
        var zw = z * w;

        var mat = new Lore.Matrix4f();

        // Row-major
        //  0,  1,  2,  3,
        //  4,  5,  6,  7,
        //  8,  9, 10, 11,
        // 12, 13, 14, 15

        mat.entries[0] = 1 - 2 * (yy + zz);
        mat.entries[1] = 2 * (xy - zw);
        mat.entries[2] = 2 * (xz + yw);

        mat.entries[4] = 2 * (xy + zw);
        mat.entries[5] = 1 - 2 * (xx + zz);
        mat.entries[6] = 2 * (yz - xw);

        mat.entries[8] = 2 * (xz - yw);
        mat.entries[9] = 2 * (yz + xw);
        mat.entries[10] = 1 - 2 * (xx + yy);

        mat.entries[3] = mat.entries[7] = mat.entries[11] = mat.entries[12] = mat.entries[13] = mat.entries[14] = 0;
        mat.entries[15] = 1;

        return mat;
    },

    setFromMatrix: function(m) {
        // As in three.js, this is an implementation straight from:
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // Get the rotation matrix (if m is a Matrix4f)
        var m00 = m.entries[0],
            m01 = m.entries[4],
            m02 = m.entries[8];
        var m10 = m.entries[1],
            m11 = m.entries[5],
            m12 = m.entries[9];
        var m20 = m.entries[2],
            m21 = m.entries[6],
            m22 = m.entries[10];

        var t = m00 + m11 + m22;
        var s = null;

        if (t > 0) {
            s = 0.5 / Math.sqrt(t + 1.0);

            this.components[0] = (m21 - m12) * s;
            this.components[1] = (m02 - m20) * s;
            this.components[2] = (m10 - m01) * s;
            this.components[3] = 0.25 / s;
        } else if (m00 > m11 && m00 > m22) {
            s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

            this.components[0] = 0.25 * s;
            this.components[1] = (m01 + m10) / s;
            this.components[2] = (m02 + m20) / s;
            this.components[3] = (m21 - m12) / s;
        } else if (m11 > m22) {
            s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

            this.components[0] = (m01 + m10) / s;
            this.components[1] = 0.25 * s;
            this.components[2] = (m12 + m21) / s;
            this.components[3] = (m02 - m20) / s;
        } else {
            s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

            this.components[0] = (m02 + m20) / s;
            this.components[1] = (m12 + m21) / s;
            this.components[2] = 0.25 * s;
            this.components[3] = (m10 - m01) / s;
        }

        return this;
    },

    clone: function() {
        return new Lore.Quaternion(this.components[0], this.components[1],
            this.components[2], this.components[3]);
    },

    equals: function(q) {
        return this.components[0] === q.components[0] &&
            this.components[1] === q.components[1] &&
            this.components[2] === q.components[2] &&
            this.components[3] === q.components[3];
    },

    toString: function() {
        return 'x: ' + this.getX() + ', y: ' + this.getY() + ', z: ' +
            this.getZ() + ', w: ' + this.getW();
    }
}

Lore.Quaternion.dot = function(q, p) {
    return new Lore.Quaternion(q.components[0] * p.components[0] +
        q.components[1] * p.components[1] +
        q.components[2] * p.components[2] +
        q.components[3] * p.components[3]);
}

Lore.Quaternion.multiply = function(a, b) {
    return new Lore.Quaternion(
        a.components[0] * b.components[3] + a.components[3] * b.components[0] +
        a.components[1] * b.components[2] - a.components[2] * b.components[1],
        a.components[1] * b.components[3] + a.components[3] * b.components[1] +
        a.components[2] * b.components[0] - a.components[0] * b.components[2],
        a.components[2] * b.components[3] + a.components[3] * b.components[2] +
        a.components[0] * b.components[1] - a.components[1] * b.components[0],
        a.components[3] * b.components[3] + a.components[0] * b.components[0] +
        a.components[1] * b.components[1] - a.components[2] * b.components[2]
    );
}

Lore.Quaternion.multiplyScalar = function(q, s) {
    return new Lore.Quaternion(q.components[0] * s, q.components[1] * s,
        q.components[2] * s, q.components[3] * s);
}

Lore.Quaternion.inverse = function(q) {
    var p = new Lore.Quaternion(q.components);
    return p.conjugate().normalize();
}

Lore.Quaternion.normalize = function(q) {
    var length = q.length();

    if (length === 0) {
        return new Lore.Quaternion(0.0, 0.0, 0.0, 1.0);
    } else {
        var inv = 1 / length;
        return new Lore.Quaternion(q.components[0] * inv, q.components[1] * inv,
            q.components[2] * inv, q.components[3] * inv);
    }
}

Lore.Quaternion.conjugate = function(q) {
    return new Lore.Quaternion(q.components[0] * -1, q.components[1] * -1,
        q.components[2] * -1, q.components[3]);
}

Lore.Quaternion.add = function(q, p) {
    return new Lore.Quaternion(q.components[0] + p.components[0],
        q.components[1] + p.components[1],
        q.components[2] + p.components[2],
        q.components[3] + p.components[3]);
}

Lore.Quaternion.subtract = function(q, p) {
    return new Lore.Quaternion(q.components[0] - p.components[0],
        q.components[1] - p.components[1],
        q.components[2] - p.components[2],
        q.components[3] - p.components[3]);
}

Lore.Quaternion.fromMatrix = function(m) {
    var q = new Lore.Quaternion();
    q.setFromMatrix(m);
    return q;
}

Lore.Quaternion.slerp = function(q, p, t) {
    // See:
    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

    if (t === 0) return new Lore.Quaternion(q.components);
    if (t === 1) return new Lore.Quaternion(p.components);

    var tmp = new Lore.Quaternion(p.components);

    // The angle between quaternions
    var cosHalfTheta = q.components[0] * tmp.components[0] +
        q.components[1] * tmp.components[1] +
        q.components[2] * tmp.components[2] +
        q.components[3] * tmp.components[3];

    if (cosHalfTheta < 0) {
        tmp.multiplyScalar(-1);
        cosHalfTheta = -cosHalfTheta;
    }

    if (Math.abs(cosHalfTheta) >= 1.0) {
        return new Lore.Quaternion(q.components);
    }

    var halfTheta = Math.acos(cosHalfTheta);
    var sinHalfTheta = sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
        return new Lore.Quaternion(q.components[0] * 0.5 + tmp.components[0] * 0.5,
            q.components[1] * 0.5 + tmp.components[1] * 0.5,
            q.components[2] * 0.5 + tmp.components[2] * 0.5,
            q.components[3] * 0.5 + tmp.components[3] * 0.5);
    }

    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    return new Lore.Quaternion(q.components[0] * ratioA + tmp.components[0] * ratioB,
        q.components[1] * ratioA + tmp.components[1] * ratioB,
        q.components[2] * ratioA + tmp.components[2] * ratioB,
        q.components[3] * ratioA + tmp.components[3] * ratioB);
}
Lore.ProjectionMatrix = function() {
    Lore.Matrix4f.call(this);

}

Lore.ProjectionMatrix.prototype = Object.assign(Object.create(Lore.Matrix4f.prototype), {
    constructor: Lore.ProjectionMatrix,

    setOrthographic: function(left, right, top, bottom, near, far) {
        var w = 1.0 / (right - left);
        var h = 1.0 / (top - bottom);
        var d = 1.0 / (far - near);

        var x = (right + left) * w;
        var y = (top + bottom) * h;
        var z = (far + near) * d;

        this.set()

        this.entries[0] = 2 * w;
        this.entries[4] = 0;
        this.entries[8] = 0;
        this.entries[12] = -x;
        this.entries[1] = 0;
        this.entries[5] = 2 * h;
        this.entries[9] = 0;
        this.entries[13] = -y;
        this.entries[2] = 0;
        this.entries[6] = 0;
        this.entries[10] = -2 * d;
        this.entries[14] = -z;
        this.entries[3] = 0;
        this.entries[7] = 0;
        this.entries[11] = 0;
        this.entries[15] = 1;

        return this;
    }
});
Lore.Cloud = function() {
    Lore.Node.call(this);
    this.type = 'Lore.Cloud';
}

Lore.Cloud.prototype = Object.assign(Object.create(Lore.Node.prototype), {
    constructor: Lore.Cloud
});
Lore.Shaders['default'] = new Lore.Shader('Default', {}, [
    'attribute vec3 position;',
    'attribute vec3 color;',
    'varying vec3 vColor;',
    'void main() {',
    'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    'gl_PointSize = 5.0;',
    'vColor = color;',
    '}'
], [
    'varying vec3 vColor;',
    'void main() {',
    'gl_FragColor = vec4(vColor, 1.0);',
    '}'
]);
