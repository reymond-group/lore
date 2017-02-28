'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lore = {
    Version: '1.0.0'
};

if (typeof define === 'function' && define.amd) {
    define('lore', Lore);
} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Lore;
}

// By Shmiddty from stackoverflow
function Enum(a) {
    var i = Object.keys(a).reduce(function (o, k) {
        return o[a[k]] = k, o;
    }, {});

    return Object.freeze(Object.keys(a).reduce(function (o, k) {
        return o[k] = a[k], o;
    }, function (v) {
        return i[v];
    }));
}

Lore.Mouse = Enum({
    Left: 0,
    Middle: 1,
    Right: 2
});

Lore.Keyboard = Enum({
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Shift: 16,
    Ctrl: 17,
    Alt: 18,
    Esc: 27
});

Lore.Shaders = {};

Lore.getShader = function (shaderName) {
    return Lore.Shaders[shaderName].clone();
};

Lore.init = function (canvas, options) {
    this.opts = Lore.Utils.extend(true, Lore.defaults, options);

    // Init UI
    var ui = new Lore.UI(canvas);

    // Start the 3D stuff
    var cc = Lore.Color.fromHex(this.opts.clearColor);

    var renderer = new Lore.Renderer(canvas, {
        clearColor: cc,
        verbose: true,
        fps: document.getElementById('fps'),
        antialiasing: false,
        center: new Lore.Vector3f(125, 125, 125)
    });

    renderer.controls.limitRotationToHorizon(this.opts.limitRotationToHorizon);

    var coordinatesHelper = new Lore.CoordinatesHelper(renderer, 'Coordinates', 'coordinates', {
        position: new Lore.Vector3f(0, 0, 0),
        axis: {
            x: { length: 250, color: Lore.Color.fromHex('#097692') },
            y: { length: 250, color: Lore.Color.fromHex('#097692') },
            z: { length: 250, color: Lore.Color.fromHex('#097692') }
        },
        ticks: {
            x: { length: 10, color: Lore.Color.fromHex('#097692') },
            y: { length: 10, color: Lore.Color.fromHex('#097692') },
            z: { length: 10, color: Lore.Color.fromHex('#097692') }
        },
        box: {
            enabled: false,
            x: { color: Lore.Color.fromHex('#004F6E') },
            y: { color: Lore.Color.fromHex('#004F6E') },
            z: { color: Lore.Color.fromHex('#004F6E') }
        }
    });

    /*
        var size = 1000;
        var positions = new Float32Array(size * 3);
        var colors = new Float32Array(size * 3)
    
        for(var i = 0; i < size * 3; i++) {
          positions[i] = Lore.Statistics.randomNormalScaled(0, 2000);
          colors[i] = Math.random();
        }
    
        pointHelper.setPositions(positions);
        pointHelper.setColors(colors);
    */
    renderer.render = function (camera, geometries) {
        for (var key in geometries) {
            geometries[key].draw(renderer);
        }
    };

    return renderer;
};

Lore.defaults = {
    clearColor: '#001821',
    limitRotationToHorizon: false
};

Lore.DrawModes = {
    points: 0,
    lines: 1,
    lineStrip: 2,
    lineLoop: 3,
    triangles: 4,
    traingleStrip: 5,
    triangleFan: 6
};

Lore.Color = function (r, g, b, a) {
    if (arguments.length === 1) {
        this.components = new Float32Array(r);
    } else {
        this.components = new Float32Array(4);
        this.components[0] = r || 0.0;
        this.components[1] = g || 0.0;
        this.components[2] = b || 0.0;
        this.components[3] = a || 1.0;
    }
};

Lore.Color.prototype = {
    constructor: Lore.Color,
    set: function set(r, g, b, a) {
        this.components[0] = r;
        this.components[1] = g;
        this.components[2] = b;

        if (arguments.length == 4) this.components[3] = a;
    }
};

Lore.Color.fromHex = function (hex) {
    // Thanks to Tim Down
    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    return result ? new Lore.Color(r / 255.0, g / 255.0, b / 255.0, 1.0) : null;
};

Lore.Color.hueToRgb = function (p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 0.1667) return p + (q - p) * 6 * t;
    if (t < 0.5) return q;
    if (t < 0.6667) return p + (q - p) * (0.6667 - t) * 6;
    return p;
};

Lore.Color.hslToRgb = function (h, s, l) {
    var r = void 0,
        g = void 0,
        b = void 0;

    if (s == 0) {
        r = g = b = l;
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = Lore.Color.hueToRgb(p, q, h + 0.3333);
        g = Lore.Color.hueToRgb(p, q, h);
        b = Lore.Color.hueToRgb(p, q, h - 0.3333);
    }

    return [r, g, b];
};

Lore.Color.rgbToHsl = function (r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h = void 0,
        s = void 0,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);break;
            case g:
                h = (b - r) / d + 2;break;
            case b:
                h = (r - g) / d + 4;break;
        }
        h /= 6;
    }

    return [h, s, l];
};

Lore.Color.gdbHueShift = function (hue) {
    hue = 0.85 * hue + 0.66;
    if (hue > 1.0) hue = hue - 1.0;
    hue = 1 - hue + 0.33;
    if (hue > 1.0) hue = hue - 1.0;

    return hue;
};

Lore.Renderer = function (targetId, options) {
    this.canvas = document.getElementById(targetId);

    this.defaults = {
        antialiasing: true,
        verbose: false,
        fpsElement: document.getElementById('fps'),
        clearColor: Lore.Color.fromHex('#000000'),
        clearDepth: 1.0,
        center: new Lore.Vector3f(),
        enableDepthTest: true,
        camera: new Lore.OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / -2)
    };

    this.opts = Lore.Utils.extend(true, this.defaults, options);

    this.parent = this.canvas.parentElement;
    this.fps = 0;
    this.fpsCount = 0;
    this.maxFps = 1000 / 30;
    this.devicePixelRatio = this.getDevicePixelRatio();
    this.geometries = {};

    this.render = function (camera, geometries) {};

    this.effect = null;

    this.lastTiming = performance.now();

    // Disable context menu on right click
    this.canvas.addEventListener('contextmenu', function (e) {
        if (e.button === 2) {
            e.preventDefault();
            return false;
        }
    });

    var that = this;
    that.init();

    // Attach the controls last
    var center = options.center ? options.center : new Lore.Vector3f();
    that.controls = options.controls || new Lore.OrbitalControls(that, 1200, center);
};

Lore.Renderer.prototype = {
    constructor: Lore.Renderer,
    ready: false,
    gl: null,
    init: function init() {
        var _this = this;

        var settings = { antialias: this.antialiasing };

        this.gl = this.canvas.getContext('webgl', settings) || this.canvas.getContext('experimental-webgl', settings);

        if (!this.gl) {
            console.error('Could not initialize the WebGL context.');
            return;
        }

        var g = this.gl;
        console.log(g.getParameter(g.ALIASED_LINE_WIDTH_RANGE));

        if (this.opts.verbose) {
            var hasAA = g.getContextAttributes().antialias;
            var size = g.getParameter(g.SAMPLES);
            console.info('Antialiasing: ' + hasAA + ' (' + size + 'x)');

            var highp = g.getShaderPrecisionFormat(g.FRAGMENT_SHADER, g.HIGH_FLOAT);
            var hasHighp = highp.precision != 0;
            console.info('High precision support: ' + hasHighp);
        }

        // Blending
        //g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
        // Extensions
        var oes = 'OES_standard_derivatives';
        var extOes = g.getExtension(oes);
        if (extOes === null) {
            console.warn('Could not load extension: ' + oes + '.');
        }

        var wdb = 'WEBGL_draw_buffers';
        var extWdb = g.getExtension(wdb);
        if (extWdb === null) {
            console.warn('Could not load extension: ' + wdb + '.');
        }

        var wdt = 'WEBGL_depth_texture';
        var extWdt = g.getExtension(wdt);
        if (extWdt === null) {
            console.warn('Could not load extension: ' + wdt + '.');
        }

        this.setClearColor(this.opts.clearColor);
        g.clearDepth(this.opts.clearDepth);

        if (this.opts.enableDepthTest) {
            g.enable(g.DEPTH_TEST);
            g.depthFunc(g.LEQUAL);
            console.log('enable depth test');
        }

        /*
        g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
        g.enable(g.BLEND);
        */

        setTimeout(function () {
            _this.updateViewport(0, 0, _this.getWidth(), _this.getHeight());
        }, 1000);

        // Also do it immediately, in case the timeout is not needed
        this.updateViewport(0, 0, _this.getWidth(), _this.getHeight());

        window.addEventListener('resize', function (event) {
            var width = _this.getWidth();
            var height = _this.getHeight();
            _this.updateViewport(0, 0, width, height);
        });

        // Init effect(s)
        this.effect = new Lore.Effect(this, 'fxaaEffect');

        this.ready = true;
        this.animate();
    },

    setClearColor: function setClearColor(color) {
        this.opts.clearColor = color;
        var cc = this.opts.clearColor.components;
        this.gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
    },

    getWidth: function getWidth() {
        return this.canvas.offsetWidth;
    },

    getHeight: function getHeight() {
        return this.canvas.offsetHeight;
    },

    updateViewport: function updateViewport(x, y, width, height) {
        if (!this.opts.camera) return;

        // width *= this.devicePixelRatio;
        // height *= this.devicePixelRatio;
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(x, y, width, height);

        this.opts.camera.left = -width / 2;
        this.opts.camera.right = width / 2;
        this.opts.camera.top = height / 2;
        this.opts.camera.bottom = -height / 2;

        this.opts.camera.updateProjectionMatrix();

        // Also reinit the buffers and textures for the effect(s)
        this.effect = new Lore.Effect(this, 'fxaaEffect');
        this.effect.shader.uniforms.resolution.setValue([width, height]);
    },

    animate: function animate() {
        var that = this;

        setTimeout(function () {
            requestAnimationFrame(function () {
                that.animate();
            });
        }, this.maxFps);

        if (this.opts.fpsElement) {
            var now = performance.now();
            var delta = now - this.lastTiming;

            this.lastTiming = now;
            if (this.fpsCount < 10) {
                this.fps += Math.round(1000.0 / delta);
                this.fpsCount++;
            } else {
                this.opts.fpsElement.innerHTML = Math.round(this.fps / this.fpsCount);
                this.fpsCount = 0;
                this.fps = 0;
            }
        }

        // this.effect.bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.render(this.camera, this.geometries);
        // this.effect.unbind();

        this.opts.camera.isProjectionMatrixStale = false;
        this.opts.camera.isViewMatrixStale = false;
    },

    createGeometry: function createGeometry(name, shaderName) {
        var shader = Lore.getShader(shaderName);
        shader.init(this.gl);
        var geometry = new Lore.Geometry(name, this.gl, shader);

        this.geometries[name] = geometry;

        return geometry;
    },

    setMaxFps: function setMaxFps(fps) {
        this.maxFps = 1000 / fps;
    },

    getDevicePixelRatio: function getDevicePixelRatio() {
        return window.devicePixelRatio || 1;
    }
};

Lore.Shader = function (name, uniforms, vertexShader, fragmentShader) {
    this.name = name;
    this.uniforms = uniforms || {};
    this.vertexShader = vertexShader || [];
    this.fragmentShader = fragmentShader || [];
    this.gl = null;
    this.program = null;
    this.initialized = false;
    this.lastTime = new Date().getTime();

    // Add the two default shaders (the same shaders as in getVertexShader)
    this.uniforms['modelViewMatrix'] = new Lore.Uniform('modelViewMatrix', new Lore.Matrix4f().entries, 'float_mat4');

    this.uniforms['projectionMatrix'] = new Lore.Uniform('projectionMatrix', new Lore.Matrix4f().entries, 'float_mat4');
};

Lore.Shader.prototype = {
    constructor: Lore.Shader,

    clone: function clone() {
        return new Lore.Shader(this.name, this.uniforms, this.vertexShader, this.fragmentShader);
    },

    getVertexShaderCode: function getVertexShaderCode() {
        return this.vertexShader.join('\n');
    },

    getFragmentShaderCode: function getFragmentShaderCode() {
        return this.fragmentShader.join('\n');
    },

    getVertexShader: function getVertexShader(gl) {
        var shader = gl.createShader(gl.VERTEX_SHADER);

        var vertexShaderCode = 'uniform mat4 modelViewMatrix;\n' + 'uniform mat4 projectionMatrix;\n\n' + this.getVertexShaderCode();

        gl.shaderSource(shader, vertexShaderCode);
        gl.compileShader(shader);

        Lore.Shader.showCompilationInfo(gl, shader, this.name, 'Vertex Shader');
        return shader;
    },

    getFragmentShader: function getFragmentShader(gl) {
        var shader = gl.createShader(gl.FRAGMENT_SHADER);
        // Adding precision, see:
        // http://stackoverflow.com/questions/27058064/why-do-i-need-to-define-a-precision-value-in-webgl-shaders
        // and:
        // http://stackoverflow.com/questions/13780609/what-does-precision-mediump-float-mean
        var fragmentShaderCode = '#ifdef GL_OES_standard_derivatives\n#extension GL_OES_standard_derivatives : enable\n#endif\n\n' + '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + this.getFragmentShaderCode();

        gl.shaderSource(shader, fragmentShaderCode);
        gl.compileShader(shader);

        Lore.Shader.showCompilationInfo(gl, shader, this.name, 'Fragment Shader');
        return shader;
    },

    init: function init(gl) {
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
            console.error('Could not link program.\n' + 'VALIDATE_STATUS: ' + this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS) + '\n' + 'ERROR: ' + this.gl.getError());
            return null;
        }

        this.initialized = true;
    },

    updateUniforms: function updateUniforms(renderer) {
        // Always update time uniform if it exists
        if (this.uniforms['time']) {
            var unif = this.uniforms['time'];

            var currentTime = new Date().getTime();
            unif.value += currentTime - this.lastTime;
            this.lastTime = currentTime;

            Lore.Uniform.Set(this.gl, this.program, unif);

            unif.stale = false;
        }
        for (var uniform in this.uniforms) {
            var _unif = this.uniforms[uniform];
            if (_unif.stale) {
                Lore.Uniform.Set(this.gl, this.program, _unif);
            }
        }
    },

    use: function use() {
        this.gl.useProgram(this.program);
        this.updateUniforms();
    }
};

Lore.Shader.showCompilationInfo = function (gl, shader, name, prefix) {
    prefix = prefix || 'Shader';
    // This was stolen from THREE.js
    // https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLShader.js
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
        console.error(prefix + ' ' + name + ' did not compile.');
    }

    if (gl.getShaderInfoLog(shader) !== '') {
        console.warn(prefix + ' ' + name + ' info log: ' + gl.getShaderInfoLog(shader));
    }
};

Lore.Uniform = function (name, value, type) {
    this.name = name;
    this.value = value;
    this.type = type;
    this.stale = true;
};

Lore.Uniform.prototype = {
    constructor: Lore.Uniform,

    setValue: function setValue(value) {
        this.value = value;
        this.stale = true;
    }
};

Lore.Uniform.Set = function (gl, program, uniform) {
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

    // Had to set this to true because point sizes did not update...
    uniform.stale = true;
};

// This is more or less the same implementation of a 3d node that
// THREE.js uses

Lore.Node = function () {
    function Node() {
        _classCallCheck(this, Node);

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

    _createClass(Node, [{
        key: 'applyMatrix',
        value: function applyMatrix(matrix) {
            this.modelMatrix.multiplyB(matrix);

            return this;
        }
    }, {
        key: 'getUpVector',
        value: function getUpVector() {
            var v = new Lore.Vector3f(0, 1, 0);

            return v.applyQuaternion(this.rotation);
        }
    }, {
        key: 'getForwardVector',
        value: function getForwardVector() {
            var v = new Lore.Vector3f(0, 0, 1);

            return v.applyQuaternion(this.rotation);
        }
    }, {
        key: 'getRightVector',
        value: function getRightVector() {
            var v = new Lore.Vector3f(1, 0, 0);

            return v.applyQuaternion(this.rotation);
        }
    }, {
        key: 'translateOnAxis',
        value: function translateOnAxis(axis, distance) {
            // Axis should be normalized, following THREE.js
            var v = new Lore.Vector3f(axis.components[0], axis.components[1], axis.components[2]);
            v.applyQuaternion(this.rotation);
            v.multiplyScalar(distance);
            this.position.add(v);

            return this;
        }
    }, {
        key: 'translateX',
        value: function translateX(distance) {
            this.position.components[0] = this.position.components[0] + distance;

            return this;
        }
    }, {
        key: 'translateY',
        value: function translateY(distance) {
            this.position.components[1] = this.position.components[1] + distance;

            return this;
        }
    }, {
        key: 'translateZ',
        value: function translateZ(distance) {
            this.position.components[2] = this.position.components[2] + distance;

            return this;
        }
    }, {
        key: 'setTranslation',
        value: function setTranslation(v) {
            this.position = v;

            return this;
        }
    }, {
        key: 'setRotation',
        value: function setRotation(axis, angle) {
            this.rotation.setFromAxisAngle(axis, angle);

            return this;
        }
    }, {
        key: 'rotate',
        value: function rotate(axis, angle) {
            var q = new Lore.Quaternion(axis, angle);

            this.rotation.multiplyA(q);

            return this;
        }
    }, {
        key: 'rotateX',
        value: function rotateX(angle) {
            this.rotation.rotateX(angle);

            return this;
        }
    }, {
        key: 'rotateY',
        value: function rotateY(angle) {
            this.rotation.rotateY(angle);

            return this;
        }
    }, {
        key: 'rotateZ',
        value: function rotateZ(angle) {
            this.rotation.rotateZ(angle);

            return this;
        }
    }, {
        key: 'getRotationMatrix',
        value: function getRotationMatrix() {
            return this.rotation.toRotationMatrix();
        }
    }, {
        key: 'update',
        value: function update() {
            this.modelMatrix.compose(this.position, this.rotation, this.scale);
            // if parent... this.modelMatrix = Lore.Matrix4f.multiply(this.parent.modelMatrix, this.modelMatrix);
            this.isStale = true;

            return this;
        }
    }, {
        key: 'getModelMatrix',
        value: function getModelMatrix() {
            return this.modelMatrix.entries;
        }
    }], [{
        key: 'createGUID',
        value: function createGUID() {
            // See:
            // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript

            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
        }
    }]);

    return Node;
}();

Lore.Geometry = function (name, gl, shader) {
    Lore.Node.call(this);

    this.type = 'Lore.Geometry';
    this.name = name;
    this.gl = gl;
    this.shader = shader;
    this.attributes = {};
    this.drawMode = this.gl.POINTS;
    this.isVisible = true;
};

Lore.Geometry.prototype = Object.assign(Object.create(Lore.Node.prototype), {
    constructor: Lore.Geometry,

    addAttribute: function addAttribute(name, data, length) {
        this.attributes[name] = new Lore.Attribute(data, length, name);
        this.attributes[name].createBuffer(this.gl, this.shader.program);
        return this;
    },

    updateAttribute: function updateAttribute(name, data) {
        if (data) this.attributes[name].data = data;
        this.attributes[name].update(this.gl);
        return this;
    },

    getAttribute: function getAttribute(name) {
        return this.attributes[name];
    },

    removeAttribute: function removeAttribute(name) {
        delete this.attributes[name];
        return this;
    },

    setMode: function setMode(drawMode) {
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

        return this;
    },

    size: function size() {
        // Is this ok? All attributes should have the same length ...
        if (Object.keys(this.attributes).length > 0) {
            return this.attributes[Object.keys(this.attributes)[0]].size;
        }

        return 0;
    },

    draw: function draw(renderer) {
        if (!this.isVisible) return;

        for (var prop in this.attributes) {
            if (this.attributes[prop].stale) this.attributes[prop].update(this.gl);
        }this.shader.use();

        // Update the modelView and projection matrices
        if (renderer.camera.isProjectionMatrixStale) {
            this.shader.uniforms.projectionMatrix.setValue(renderer.camera.getProjectionMatrix());
        }

        if (renderer.camera.isViewMatrixStale) {
            var modelViewMatrix = Lore.Matrix4f.multiply(renderer.camera.viewMatrix, this.modelMatrix);
            this.shader.uniforms.modelViewMatrix.setValue(modelViewMatrix.entries);
        }

        this.shader.updateUniforms();

        // How exactly does the binding work??
        // What will happen if I want to draw a second geometry?
        for (var _prop in this.attributes) {
            this.attributes[_prop].bind(this.gl);
        }

        this.gl.drawArrays(this.drawMode, 0, this.size());
    }
});

Lore.Attribute = function (data, attributeLength, name) {
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
};

Lore.Attribute.prototype = {
    constructor: Lore.Attribute,

    setFromVector: function setFromVector(index, v) {
        this.data.set(v.components, index * this.attributeLength, v.components.length);
    },

    setFromVectorArray: function setFromVectorArray(arr) {
        if (this.attributeLength !== arr[0].components.length) throw 'The attribute has a length of ' + this.attributeLength + '. But the vectors have ' + arr[0].components.length + ' components.';

        for (var i = 0; i < arr.length; i++) {
            this.data.set(arr[i].components, i * this.attributeLength, arr[i].components.length);
        }
    },

    getX: function getX(index) {
        return this.data[index * this.attributeLength];
    },

    setX: function setX(index, value) {
        this.data[index * this.attributeLength];
    },

    getY: function getY(index) {
        return this.data[index * this.attributeLength + 1];
    },

    setY: function setY(index, value) {
        this.data[index * this.attributeLength + 1];
    },

    getZ: function getZ(index) {
        return this.data[index * this.attributeLength + 2];
    },

    setZ: function setZ(index, value) {
        this.data[index * this.attributeLength + 2];
    },
    getW: function getW(index) {
        return this.data[index * this.attributeLength + 3];
    },

    setW: function setW(index, value) {
        this.data[index * this.attributeLength + 3];
    },

    getGlType: function getGlType(gl) {
        // Just floats for now
        // TODO: Add additional types.
        return gl.FLOAT;
    },

    update: function update(gl) {
        gl.bindBuffer(this.bufferType, this.buffer);
        gl.bufferData(this.bufferType, this.data, this.drawMode);
        this.stale = false;
    },

    createBuffer: function createBuffer(gl, program, bufferType, drawMode) {
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

    bind: function bind(gl) {
        gl.bindBuffer(this.bufferType, this.buffer);

        // Only enable attribute if it actually exists in the Shader
        if (this.attributeLocation >= 0) {
            gl.vertexAttribPointer(this.attributeLocation, this.attributeLength, this.getGlType(gl), gl.FALSE, 0, 0);
            gl.enableVertexAttribArray(this.attributeLocation);
        }
    }
};

Lore.Effect = function (renderer, shaderName) {
    this.renderer = renderer;
    this.gl = this.renderer.gl;

    this.framebuffer = this.initFramebuffer();
    this.texture = this.initTexture();
    this.renderbuffer = this.initRenderbuffer();

    this.shader = Lore.getShader(shaderName);
    this.shader.init(this.renderer.gl);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
};

Lore.Effect.prototype = {
    constructor: Lore.Effect,

    initBuffer: function initBuffer() {
        var g = this.gl;
        var texCoordLocation = g.getAttribLocation(this.shader.program, 'v_coord');

        // provide texture coordinates for the rectangle.
        var texCoordBuffer = g.createBuffer();
        g.bindBuffer(g.ARRAY_BUFFER, texCoordBuffer);
        g.bufferData(g.ARRAY_BUFFER, new Float32Array([1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]), g.STATIC_DRAW);

        g.enableVertexAttribArray(texCoordLocation);
        g.vertexAttribPointer(texCoordLocation, 2, g.FLOAT, false, 0, 0);

        return texCoordBuffer;
    },

    initTexture: function initTexture() {
        var g = this.gl;

        var texture = g.createTexture();
        g.bindTexture(g.TEXTURE_2D, texture);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);

        g.bindTexture(g.TEXTURE_2D, texture);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, this.renderer.getWidth(), this.renderer.getHeight(), 0, g.RGBA, g.UNSIGNED_BYTE, null);

        g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0);

        return texture;
    },

    initFramebuffer: function initFramebuffer() {
        var g = this.gl;

        var framebuffer = g.createFramebuffer();
        g.bindFramebuffer(g.FRAMEBUFFER, framebuffer);
        return framebuffer;
    },

    initRenderbuffer: function initRenderbuffer() {
        var g = this.gl;

        var renderbuffer = g.createRenderbuffer();
        g.bindRenderbuffer(g.RENDERBUFFER, renderbuffer);

        g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_COMPONENT16, this.renderer.getWidth(), this.renderer.getHeight());
        g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, renderbuffer);

        // g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_STENCIL, this.renderer.getWidth(), this.renderer.getHeight());
        // g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_STENCIL_ATTACHMENT, g.RENDERBUFFER, renderbuffer);

        return renderbuffer;
    },

    bind: function bind() {
        var g = this.gl;
        g.bindFramebuffer(g.FRAMEBUFFER, this.framebuffer);
        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
    },

    unbind: function unbind() {
        var g = this.gl;
        g.bindRenderbuffer(g.RENDERBUFFER, null);
        g.bindFramebuffer(g.FRAMEBUFFER, null);

        this.initBuffer();
        this.shader.use();
        g.drawArrays(g.TRIANGLES, 0, 6);
    }
};

Lore.ControlsBase = function () {
    function ControlsBase(renderer) {
        _classCallCheck(this, ControlsBase);

        this.renderer = renderer;
        this.canvas = renderer.canvas;
        this.lowFps = 15;
        this.highFps = 30;
        this.eventListeners = {};
        this.renderer.setMaxFps(this.lowFps);
        this.touchMode = 'drag';

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
            },
            normalizedPosition: {
                x: 0.0,
                y: 0.0
            },
            touches: 0
        };

        this.keyboard = {
            alt: false,
            ctrl: false,
            shift: false
        };

        var that = this;
        this.canvas.addEventListener('mousemove', function (e) {
            if (that.mouse.previousPosition.x !== null && that.mouse.state.left || that.mouse.state.middle || that.mouse.state.right) {
                that.mouse.delta.x = e.pageX - that.mouse.previousPosition.x;
                that.mouse.delta.y = e.pageY - that.mouse.previousPosition.y;

                that.mouse.position.x += 0.01 * that.mouse.delta.x;
                that.mouse.position.y += 0.01 * that.mouse.delta.y;

                // Give priority to left, then middle, then right
                if (that.mouse.state.left) {
                    that.raiseEvent('mousedrag', {
                        e: that.mouse.delta,
                        source: 'left'
                    });
                } else if (that.mouse.state.middle) {
                    that.raiseEvent('mousedrag', {
                        e: that.mouse.delta,
                        source: 'middle'
                    });
                } else if (that.mouse.state.right) {
                    that.raiseEvent('mousedrag', {
                        e: that.mouse.delta,
                        source: 'right'
                    });
                }
            }

            // Set normalized mouse position
            var rect = that.canvas.getBoundingClientRect();
            that.mouse.normalizedPosition.x = (e.clientX - rect.left) / that.canvas.width * 2 - 1;
            that.mouse.normalizedPosition.y = -((e.clientY - rect.top) / that.canvas.height) * 2 + 1;

            that.raiseEvent('mousemove', {
                e: that
            });

            that.mouse.previousPosition.x = e.pageX;
            that.mouse.previousPosition.y = e.pageY;
        });

        this.canvas.addEventListener('touchstart', function (e) {
            that.mouse.touches++;
            var touch = e.touches[0];
            e.preventDefault();

            that.mouse.touched = true;

            that.renderer.setMaxFps(that.highFps);

            // This is for selecting stuff when touching but not moving

            // Set normalized mouse position
            var rect = that.canvas.getBoundingClientRect();
            that.mouse.normalizedPosition.x = (touch.clientX - rect.left) / that.canvas.width * 2 - 1;
            that.mouse.normalizedPosition.y = -((touch.clientY - rect.top) / that.canvas.height) * 2 + 1;

            if (that.touchMode !== 'drag') that.raiseEvent('mousemove', {
                e: that
            });

            that.raiseEvent('mousedown', {
                e: that,
                source: 'touch'
            });
        });

        this.canvas.addEventListener('touchend', function (e) {
            that.mouse.touches--;
            e.preventDefault();

            that.mouse.touched = false;

            // Reset the previous position and delta of the mouse
            that.mouse.previousPosition.x = null;
            that.mouse.previousPosition.y = null;

            that.renderer.setMaxFps(that.lowFps);

            that.raiseEvent('mouseup', {
                e: that,
                source: 'touch'
            });
        });

        this.canvas.addEventListener('touchmove', function (e) {
            var touch = e.touches[0];
            var source = 'left';

            if (that.mouse.touches == 2) source = 'right';

            e.preventDefault();
            console.log(touch.pageX, touch.pageY);
            if (that.mouse.previousPosition.x !== null && that.mouse.touched) {
                that.mouse.delta.x = touch.pageX - that.mouse.previousPosition.x;
                that.mouse.delta.y = touch.pageY - that.mouse.previousPosition.y;

                that.mouse.position.x += 0.01 * that.mouse.delta.x;
                that.mouse.position.y += 0.01 * that.mouse.delta.y;

                if (that.touchMode === 'drag') that.raiseEvent('mousedrag', {
                    e: that.mouse.delta,
                    source: source
                });
            }

            // Set normalized mouse position
            var rect = that.canvas.getBoundingClientRect();
            that.mouse.normalizedPosition.x = (touch.clientX - rect.left) / that.canvas.width * 2 - 1;
            that.mouse.normalizedPosition.y = -((touch.clientY - rect.top) / that.canvas.height) * 2 + 1;

            if (that.touchMode !== 'drag') that.raiseEvent('mousemove', {
                e: that
            });

            that.mouse.previousPosition.x = touch.pageX;
            that.mouse.previousPosition.y = touch.pageY;
        });

        var wheelevent = 'mousewheel';
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) wheelevent = 'DOMMouseScroll';

        this.canvas.addEventListener(wheelevent, function (e) {
            e.preventDefault();

            var delta = 'wheelDelta' in e ? e.wheelDelta : -40 * e.detail;
            that.raiseEvent('mousewheel', {
                e: delta
            });
        });

        this.canvas.addEventListener('keydown', function (e) {
            if (e.which == 16) {
                that.keyboard.shift = true;
            } else if (e.which == 17) {
                that.keyboard.ctrl = true;
            } else if (e.which == 18) {
                that.keyboard.alt = true;
            }

            that.raiseEvent('keydown', {
                e: e.which
            });
        });

        this.canvas.addEventListener('keyup', function (e) {
            if (e.which == 16) {
                that.keyboard.shift = false;
            } else if (e.which == 17) {
                that.keyboard.ctrl = false;
            } else if (e.which == 18) {
                that.keyboard.alt = false;
            }

            that.raiseEvent('keyup', {
                e: e.which
            });
        });

        this.canvas.addEventListener('mousedown', function (e) {
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

            that.renderer.setMaxFps(that.highFps);

            that.raiseEvent('mousedown', {
                e: that,
                source: source
            });
        });

        this.canvas.addEventListener('click', function (e) {
            var btn = e.button;
            var source = 'left';

            that.raiseEvent('click', {
                e: that,
                source: source
            });
        });

        this.canvas.addEventListener('dblclick', function (e) {
            var btn = e.button;
            var source = 'left';

            that.raiseEvent('dblclick', {
                e: that,
                source: source
            });
        });

        this.canvas.addEventListener('mouseup', function (e) {
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

            that.renderer.setMaxFps(that.lowFps);

            that.raiseEvent('mouseup', {
                e: that,
                source: source
            });
        });

        this.canvas.addEventListener('mouseleave', function (e) {
            that.mouse.state.left = false;
            that.mouse.state.middle = false;
            that.mouse.state.right = false;

            that.mouse.previousPosition.x = null;
            that.mouse.previousPosition.y = null;

            that.renderer.setMaxFps(that.lowFps);

            that.raiseEvent('mouseleave', {
                e: that,
                source: that.canvas
            });
        });
    }

    _createClass(ControlsBase, [{
        key: 'addEventListener',
        value: function addEventListener(eventName, callback) {
            if (!this.eventListeners[eventName]) {
                this.eventListeners[eventName] = [];
            }

            this.eventListeners[eventName].push(callback);
        }
    }, {
        key: 'raiseEvent',
        value: function raiseEvent(eventName, data) {
            if (!this.eventListeners[eventName]) {
                return;
            }

            for (var i = 0; i < this.eventListeners[eventName].length; i++) {
                this.eventListeners[eventName][i](data);
            }
        }
    }]);

    return ControlsBase;
}();

Lore.OrbitalControls = function (_Lore$ControlsBase) {
    _inherits(OrbitalControls, _Lore$ControlsBase);

    function OrbitalControls(renderer, radius, lookAt) {
        _classCallCheck(this, OrbitalControls);

        var _this2 = _possibleConstructorReturn(this, (OrbitalControls.__proto__ || Object.getPrototypeOf(OrbitalControls)).call(this, renderer));

        _this2.up = Lore.Vector3f.up();
        _this2.radius = radius;
        _this2.renderer = renderer;
        _this2.camera = renderer.camera;
        _this2.canvas = renderer.canvas;

        _this2.yRotationLimit = Math.PI;

        _this2.dPhi = 0.0;
        _this2.dTheta = 0.0;
        _this2.dPan = new Lore.Vector3f();

        _this2.spherical = new Lore.SphericalCoords();
        _this2.lookAt = lookAt || new Lore.Vector3f();

        _this2.scale = 0.95;

        _this2.camera.position = new Lore.Vector3f(radius, radius, radius);
        _this2.camera.updateProjectionMatrix();
        _this2.camera.updateViewMatrix();

        _this2.rotationLocked = false;

        var that = _this2;

        _this2.addEventListener('mousedrag', function (e) {
            that.update(e.e, e.source);
        });

        _this2.addEventListener('mousewheel', function (e) {
            that.update({
                x: 0,
                y: -e.e
            }, 'wheel');
        });

        // Initial update
        _this2.update({
            x: 0,
            y: 0
        }, 'left');
        return _this2;
    }

    _createClass(OrbitalControls, [{
        key: 'limitRotationToHorizon',
        value: function limitRotationToHorizon(limit) {
            if (limit) {
                this.yRotationLimit = 0.5 * Math.PI;
            } else {
                this.yRotationLimit = Math.PI;
            }

            return this;
        }
    }, {
        key: 'setRadius',
        value: function setRadius(radius) {
            this.radius = radius;
            this.camera.position = new Lore.Vector3f(0, 0, radius);

            this.camera.updateProjectionMatrix();
            this.camera.updateViewMatrix();
            this.update();

            return this;
        }
    }, {
        key: 'setLookAt',
        value: function setLookAt(lookAt) {
            this.camera.position = new Lore.Vector3f(this.radius, this.radius, this.radius);
            this.lookAt = lookAt.clone();
            this.update();

            return this;
        }
    }, {
        key: 'update',
        value: function update(e, source) {
            if (source == 'left' && !this.rotationLocked) {
                // Rotate
                this.dTheta = -2 * Math.PI * e.x / (this.canvas.clientWidth * this.camera.zoom);
                this.dPhi = -2 * Math.PI * e.y / (this.canvas.clientHeight * this.camera.zoom);
            } else if (source == 'right' || source == 'left' && this.rotationLocked) {
                // Translate
                var x = e.x * (this.camera.right - this.camera.left) / this.camera.zoom / this.canvas.clientWidth;
                var y = e.y * (this.camera.top - this.camera.bottom) / this.camera.zoom / this.canvas.clientHeight;

                var u = this.camera.getUpVector().components;
                var r = this.camera.getRightVector().components;

                this.dPan.components[0] = r[0] * -x + u[0] * y;
                this.dPan.components[1] = r[1] * -x + u[1] * y;
                this.dPan.components[2] = r[2] * -x + u[2] * y;
            } else if (source == 'middle' || source == 'wheel') {
                if (e.y > 0) {
                    // Zoom Out
                    this.camera.zoom = Math.max(0, this.camera.zoom * this.scale);
                    this.camera.updateProjectionMatrix();
                    this.raiseEvent('zoomchanged', this.camera.zoom);
                } else if (e.y < 0) {
                    // Zoom In
                    this.camera.zoom = Math.max(0, this.camera.zoom / this.scale);
                    this.camera.updateProjectionMatrix();
                    this.raiseEvent('zoomchanged', this.camera.zoom);
                }
            }

            // Update the camera
            var offset = this.camera.position.clone().subtract(this.lookAt);

            this.spherical.setFromVector(offset);
            this.spherical.components[1] += this.dPhi;
            this.spherical.components[2] += this.dTheta;
            this.spherical.limit(0, this.yRotationLimit, -Infinity, Infinity);
            this.spherical.secure();

            // Limit radius here

            this.lookAt.add(this.dPan);
            offset.setFromSphericalCoords(this.spherical);

            this.camera.position.copyFrom(this.lookAt).add(offset);

            this.camera.setLookAt(this.lookAt);

            this.camera.updateViewMatrix();

            this.dPhi = 0.0;
            this.dTheta = 0.0;
            this.dPan.set(0, 0, 0);

            this.raiseEvent('updated');

            return this;
        }
    }, {
        key: 'setView',
        value: function setView(phi, theta) {
            var offset = this.camera.position.clone().subtract(this.lookAt);

            this.spherical.setFromVector(offset);
            this.spherical.components[1] = phi;
            this.spherical.components[2] = theta;
            this.spherical.secure();

            offset.setFromSphericalCoords(this.spherical);

            this.camera.position.copyFrom(this.lookAt).add(offset);
            this.camera.setLookAt(this.lookAt);
            this.camera.updateViewMatrix();
            this.raiseEvent('updated');

            return this;
        }
    }, {
        key: 'zoomIn',
        value: function zoomIn() {
            this.camera.zoom = Math.max(0, this.camera.zoom / this.scale);
            this.camera.updateProjectionMatrix();
            this.raiseEvent('zoomchanged', this.camera.zoom);
            this.raiseEvent('updated');

            return this;
        }
    }, {
        key: 'zoomOut',
        value: function zoomOut() {
            this.camera.zoom = Math.max(0, this.camera.zoom * this.scale);
            this.camera.updateProjectionMatrix();
            this.raiseEvent('zoomchanged', this.camera.zoom);
            this.raiseEvent('updated');

            return this;
        }
    }, {
        key: 'setTopView',
        value: function setTopView() {
            this.setView(0.0, 2.0 * Math.PI);
            this.rotationLocked = true;

            return this;
        }
    }, {
        key: 'setBottomView',
        value: function setBottomView() {
            this.setView(0.0, 0.0);
            this.rotationLocked = true;

            return this;
        }
    }, {
        key: 'setRightView',
        value: function setRightView() {
            this.setView(0.5 * Math.PI, 0.5 * Math.PI);
            this.rotationLocked = true;

            return this;
        }
    }, {
        key: 'setLeftView',
        value: function setLeftView() {
            this.setView(0.5 * Math.PI, -0.5 * Math.PI);
            this.rotationLocked = true;

            return this;
        }
    }, {
        key: 'setFrontView',
        value: function setFrontView() {
            this.setView(0.5 * Math.PI, 2.0 * Math.PI);
            this.rotationLocked = true;

            return this;
        }
    }, {
        key: 'setBackView',
        value: function setBackView() {
            this.setView(0.5 * Math.PI, Math.PI);
            this.rotationLocked = true;

            return this;
        }
    }, {
        key: 'setFreeView',
        value: function setFreeView() {
            this.setView(0.25 * Math.PI, 0.25 * Math.PI);
            this.rotationLocked = false;

            return this;
        }
    }]);

    return OrbitalControls;
}(Lore.ControlsBase);

Lore.CameraBase = function (_Lore$Node) {
    _inherits(CameraBase, _Lore$Node);

    function CameraBase() {
        _classCallCheck(this, CameraBase);

        var _this3 = _possibleConstructorReturn(this, (CameraBase.__proto__ || Object.getPrototypeOf(CameraBase)).call(this));

        _this3.type = 'Lore.CameraBase';
        _this3.renderer = null;
        _this3.isProjectionMatrixStale = false;
        _this3.isViewMatrixStale = false;
        _this3.projectionMatrix = new Lore.ProjectionMatrix();
        _this3.viewMatrix = new Lore.Matrix4f();
        return _this3;
    }

    _createClass(CameraBase, [{
        key: 'init',
        value: function init(gl, program) {
            this.gl = gl;
            this.program = program;

            return this;
        }
    }, {
        key: 'setLookAt',
        value: function setLookAt(v) {
            this.rotation.lookAt(this.position, v, Lore.Vector3f.up());

            return this;
        }
    }, {
        key: 'updateProjectionMatrix',
        value: function updateProjectionMatrix() {
            return this;
        }
    }, {
        key: 'updateViewMatrix',
        value: function updateViewMatrix() {
            this.update();

            var viewMatrix = this.modelMatrix.clone();

            viewMatrix.invert();
            this.viewMatrix = viewMatrix;
            this.isViewMatrixStale = true;

            return this;
        }
    }, {
        key: 'getProjectionMatrix',
        value: function getProjectionMatrix() {
            return this.projectionMatrix.entries;
        }
    }, {
        key: 'getViewMatrix',
        value: function getViewMatrix() {
            return this.viewMatrix.entries;
        }
    }, {
        key: 'sceneToScreen',
        value: function sceneToScreen(v, renderer) {
            var vector = v.clone();
            var canvas = renderer.canvas;

            vector.project(this);

            // Map to 2D screen space
            // Correct for high dpi display by dividing by device pixel ratio
            var x = Math.round((vector.components[0] + 1) * canvas.width / 2); // / window.devicePixelRatio;
            var y = Math.round((-vector.components[1] + 1) * canvas.height / 2); // / window.devicePixelRatio;

            return [x, y];
        }
    }]);

    return CameraBase;
}(Lore.Node);

Lore.OrthographicCamera = function (_Lore$CameraBase) {
    _inherits(OrthographicCamera, _Lore$CameraBase);

    function OrthographicCamera(left, right, top, bottom, near, far) {
        _classCallCheck(this, OrthographicCamera);

        var _this4 = _possibleConstructorReturn(this, (OrthographicCamera.__proto__ || Object.getPrototypeOf(OrthographicCamera)).call(this));

        _this4.type = 'Lore.OrthographicCamera';
        _this4.zoom = 1.0;
        _this4.left = left;
        _this4.right = right;
        _this4.top = top;
        _this4.bottom = bottom;
        _this4.near = near || 0.1;
        _this4.far = far || 2500;

        _this4.updateProjectionMatrix();
        return _this4;
    }

    _createClass(OrthographicCamera, [{
        key: 'updateProjectionMatrix',
        value: function updateProjectionMatrix() {
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
    }]);

    return OrthographicCamera;
}(Lore.CameraBase);

Lore.Vector3f = function () {
    function Vector3f(x, y, z) {
        _classCallCheck(this, Vector3f);

        if (arguments.length === 1) {
            this.components = new Float32Array(x);
        } else {
            this.components = new Float32Array(3);
            this.components[0] = x || 0.0;
            this.components[1] = y || 0.0;
            this.components[2] = z || 0.0;
        }
    }

    _createClass(Vector3f, [{
        key: 'set',
        value: function set(x, y, z) {
            this.components[0] = x;
            this.components[1] = y;
            this.components[2] = z;
            return this;
        }
    }, {
        key: 'getX',
        value: function getX() {
            return this.components[0];
        }
    }, {
        key: 'getY',
        value: function getY() {
            return this.components[1];
        }
    }, {
        key: 'getZ',
        value: function getZ() {
            return this.components[2];
        }
    }, {
        key: 'setX',
        value: function setX(x) {
            this.components[0] = x;

            return this;
        }
    }, {
        key: 'setY',
        value: function setY(y) {
            this.components[1] = y;

            return this;
        }
    }, {
        key: 'setZ',
        value: function setZ(z) {
            this.components[2] = z;

            return this;
        }
    }, {
        key: 'setFromSphericalCoords',
        value: function setFromSphericalCoords(s) {
            var radius = s.components[0];
            var phi = s.components[1];
            var theta = s.components[2];

            var t = Math.sin(phi) * radius;

            this.components[0] = Math.sin(theta) * t;
            this.components[1] = Math.cos(phi) * radius;
            this.components[2] = Math.cos(theta) * t;

            return this;
        }
    }, {
        key: 'copyFrom',
        value: function copyFrom(v) {
            this.components[0] = v.components[0];
            this.components[1] = v.components[1];
            this.components[2] = v.components[2];

            return this;
        }
    }, {
        key: 'setLength',
        value: function setLength(length) {
            return this.multiplyScalar(length / this.length());
        }
    }, {
        key: 'lengthSq',
        value: function lengthSq() {
            return this.components[0] * this.components[0] + this.components[1] * this.components[1] + this.components[2] * this.components[2];
        }
    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.lengthSq());
        }
    }, {
        key: 'normalize',
        value: function normalize() {
            return this.divideScalar(this.length());
        }
    }, {
        key: 'multiply',
        value: function multiply(v) {
            this.components[0] *= v.components[0];
            this.components[1] *= v.components[1];
            this.components[2] *= v.components[2];

            return this;
        }
    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(s) {
            this.components[0] *= s;
            this.components[1] *= s;
            this.components[2] *= s;

            return this;
        }
    }, {
        key: 'divide',
        value: function divide(v) {
            this.components[0] /= v.components[0];
            this.components[1] /= v.components[1];
            this.components[2] /= v.components[2];

            return this;
        }
    }, {
        key: 'divideScalar',
        value: function divideScalar(s) {
            this.components[0] /= s;
            this.components[1] /= s;
            this.components[2] /= s;

            return this;
        }
    }, {
        key: 'add',
        value: function add(v) {
            this.components[0] += v.components[0];
            this.components[1] += v.components[1];
            this.components[2] += v.components[2];

            return this;
        }
    }, {
        key: 'subtract',
        value: function subtract(v) {
            this.components[0] -= v.components[0];
            this.components[1] -= v.components[1];
            this.components[2] -= v.components[2];

            return this;
        }
    }, {
        key: 'dot',
        value: function dot(v) {
            return this.components[0] * v.components[0] + this.components[1] * v.components[1] + this.components[2] * v.components[2];
        }
    }, {
        key: 'cross',
        value: function cross(v) {
            return new Lore.Vector3f(this.components[1] * v.components[2] - this.components[2] * v.components[1], this.components[2] * v.components[0] - this.components[0] * v.components[2], this.components[0] * v.components[1] - this.components[1] * v.components[0]);
        }
    }, {
        key: 'project',
        value: function project(camera) {
            return this.applyProjection(Lore.Matrix4f.multiply(camera.projectionMatrix, Lore.Matrix4f.invert(camera.modelMatrix)));
        }
    }, {
        key: 'unproject',
        value: function unproject(camera) {
            return this.applyProjection(Lore.Matrix4f.multiply(camera.modelMatrix, Lore.Matrix4f.invert(camera.projectionMatrix)));
        }
    }, {
        key: 'applyProjection',
        value: function applyProjection(m) {
            var x = this.components[0];
            var y = this.components[1];
            var z = this.components[2];

            var e = m.entries;
            var p = 1.0 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

            this.components[0] = (e[0] * x + e[4] * y + e[8] * z + e[12]) * p;
            this.components[1] = (e[1] * x + e[5] * y + e[9] * z + e[13]) * p;
            this.components[2] = (e[2] * x + e[6] * y + e[10] * z + e[14]) * p;

            return this;
        }
    }, {
        key: 'toDirection',
        value: function toDirection(m) {
            var x = this.components[0];
            var y = this.components[1];
            var z = this.components[2];

            var e = m.entries;

            this.components[0] = e[0] * x + e[4] * y + e[8] * z;
            this.components[1] = e[1] * x + e[5] * y + e[9] * z;
            this.components[2] = e[2] * x + e[6] * y + e[10] * z;

            this.normalize();

            return this;
        }
    }, {
        key: 'applyQuaternion',
        value: function applyQuaternion(q) {
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
        }
    }, {
        key: 'distanceToSq',
        value: function distanceToSq(v) {
            var dx = this.components[0] - v.components[0];
            var dy = this.components[1] - v.components[1];
            var dz = this.components[2] - v.components[2];

            return dx * dx + dy * dy + dz * dz;
        }
    }, {
        key: 'distanceTo',
        value: function distanceTo(v) {
            return Math.sqrt(this.distanceToSq(v));
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new Lore.Vector3f(this.components[0], this.components[1], this.components[2]);
        }
    }, {
        key: 'equals',
        value: function equals(v) {
            return this.components[0] === v.components[0] && this.components[1] === v.components[1] && this.components[2] === v.components[2];
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '(' + this.components[0] + ', ' + this.components[1] + ', ' + this.components[2] + ')';
        }
    }], [{
        key: 'normalize',
        value: function normalize(v) {
            return Lore.Vector3f.divideScalar(v, v.length());
        }
    }, {
        key: 'multiply',
        value: function multiply(u, v) {
            return new Lore.Vector3f(u.components[0] * v.components[0], u.components[1] * v.components[1], u.components[2] * v.components[2]);
        }
    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(v, s) {
            return new Lore.Vector3f(v.components[0] * s, v.components[1] * s, v.components[2] * s);
        }
    }, {
        key: 'divide',
        value: function divide(u, v) {
            return new Lore.Vector3f(u.components[0] / v.components[0], u.components[1] / v.components[1], u.components[2] / v.components[2]);
        }
    }, {
        key: 'divideScalar',
        value: function divideScalar(v, s) {
            return new Lore.Vector3f(v.components[0] / s, v.components[1] / s, v.components[2] / s);
        }
    }, {
        key: 'add',
        value: function add(u, v) {
            return new Lore.Vector3f(u.components[0] + v.components[0], u.components[1] + v.components[1], u.components[2] + v.components[2]);
        }
    }, {
        key: 'subtract',
        value: function subtract(u, v) {
            return new Lore.Vector3f(u.components[0] - v.components[0], u.components[1] - v.components[1], u.components[2] - v.components[2]);
        }
    }, {
        key: 'cross',
        value: function cross(u, v) {
            return new Lore.Vector3f(u.components[1] * v.components[2] - u.components[2] * v.components[1], u.components[2] * v.components[0] - u.components[0] * v.components[2], u.components[0] * v.components[1] - u.components[1] * v.components[0]);
        }
    }, {
        key: 'dot',
        value: function dot(u, v) {
            return u.components[0] * v.components[0] + u.components[1] * v.components[1] + u.components[2] * v.components[2];
        }
    }, {
        key: 'forward',
        value: function forward() {
            return new Lore.Vector3f(0, 0, 1);
        }
    }, {
        key: 'up',
        value: function up() {
            return new Lore.Vector3f(0, 1, 0);
        }
    }, {
        key: 'right',
        value: function right() {
            return new Lore.Vector3f(1, 0, 0);
        }
    }]);

    return Vector3f;
}();

/** A class representing a 3x3 float matrix */
Lore.Matrix3f = function () {
    /**
     * The constructor for the class Matrix3f.
     *
     * @param {Float32Array} [entries=new Float32Array(...)] The Float32Array to which the entries will be set. If no value is provided, the matrix will be initialized to the identity matrix.
     */
    function Matrix3f() {
        var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

        _classCallCheck(this, Matrix3f);

        this.entries = entries;
    }

    /**
     * Clones the matrix and returns the clone as a new Matrix3f object.
     *
     * @returns {Matrix3f} The clone.
     */


    _createClass(Matrix3f, [{
        key: 'clone',
        value: function clone() {
            return new Lore.Matrix3f(new Float32Array(this.entries));
        }

        /**
         * Compares this matrix to another matrix.
         *
         * @param {Matrix3f} mat A matrix to be compared to this matrix.
         * @returns {boolean} A boolean indicating whether or not the two matrices are identical.
         */

    }, {
        key: 'equals',
        value: function equals(mat) {
            for (var i = 0; i < this.entries.length; i++) {
                if (this.entries[i] !== mat.entries[i]) {
                    return false;
                }
            }

            return true;
        }
    }]);

    return Matrix3f;
}();

Lore.Matrix4f = function () {
    // Do NOT go double precision on GPUs!!!
    // See:
    // http://stackoverflow.com/questions/2079906/float-vs-double-on-graphics-hardware

    function Matrix4f() {
        var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

        _classCallCheck(this, Matrix4f);

        this.entries = entries;
    }

    _createClass(Matrix4f, [{
        key: 'set',
        value: function set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33) {
            this.entries.set([m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33]);
        }
    }, {
        key: 'multiplyA',
        value: function multiplyA(b) {
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
        }
    }, {
        key: 'multiplyB',
        value: function multiplyB(a) {
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
        }
    }, {
        key: 'scale',
        value: function scale(v) {
            var x = v.components[0];
            var y = v.components[1];
            var z = v.components[2];

            this.entries[0] *= x;
            this.entries[1] *= x;
            this.entries[2] *= x;
            this.entries[3] *= x;

            this.entries[4] *= y;
            this.entries[5] *= y;
            this.entries[6] *= y;
            this.entries[7] *= y;

            this.entries[8] *= z;
            this.entries[9] *= z;
            this.entries[10] *= z;
            this.entries[11] *= z;

            return this;
        }
    }, {
        key: 'setPosition',
        value: function setPosition(v) {
            this.entries[12] = v.components[0];
            this.entries[13] = v.components[1];
            this.entries[14] = v.components[2];

            return this;
        }
    }, {
        key: 'setRotation',
        value: function setRotation(q) {
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

            this.entries[3] = 0.0;
            this.entries[7] = 0.0;
            this.entries[11] = 0.0;
            this.entries[12] = 0.0;
            this.entries[13] = 0.0;
            this.entries[14] = 0.0;
            this.entries[15] = 1.0;

            return this;
        }
    }, {
        key: 'determinant',
        value: function determinant() {
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

            return a30 * (a03 * a12 * a21 - a02 * a13 * a21 - a03 * a11 * a22 + a01 * a13 * a22 + a02 * a11 * a23 - a01 * a12 * a23) + a31 * (a00 * a12 * a23 - a00 * a13 * a22 + a03 * a10 * a22 - a02 * a10 * a23 + a02 * a13 * a20 - a03 * a12 * a20) + a32 * (a00 * a13 * a21 - a00 * a11 * a23 - a03 * a10 * a21 + a01 * a10 * a23 + a03 * a11 * a20 - a01 * a13 * a20) + a33 * (-a02 * a11 * a20 - a00 * a12 * a21 + a00 * a11 * a22 + a02 * a10 * a21 - a01 * a10 * a22 + a01 * a12 * a20);
        }
    }, {
        key: 'decompose',
        value: function decompose(outPosition, outQuaternion, outScale) {
            var v = new Lore.Vector3f();
            var m = new Lore.Matrix4f();

            // The position is the simple one
            position.set(this.entries[12], this.entries[13], this.entries[14]);

            // Calculate the scale
            var sx = Math.sqrt(this.entries[0] * this.entries[0] + this.entries[1] * this.entries[1] + this.entries[2] * this.entries[2]);

            var sy = Math.sqrt(this.entries[4] * this.entries[4] + this.entries[5] * this.entries[5] + this.entries[6] * this.entries[6]);

            var sz = Math.sqrt(this.entries[8] * this.entries[8] + this.entries[9] * this.entries[9] + this.entries[10] * this.entries[10]);

            var det = this.determinant();

            if (det < 0) {
                sx = -sx;
            }

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
        }
    }, {
        key: 'compose',
        value: function compose(position, quaternion, scale) {
            this.setRotation(quaternion);
            this.scale(scale);
            this.setPosition(position);

            return this;
        }
    }, {
        key: 'invert',
        value: function invert() {
            // Fugly implementation lifted from MESA (originally in C++)
            var im = new Lore.Matrix4f();
            var m = this.entries;

            im.entries[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];

            im.entries[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];

            im.entries[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];

            im.entries[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];

            im.entries[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];

            im.entries[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];

            im.entries[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];

            im.entries[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];

            im.entries[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];

            im.entries[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];

            im.entries[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];

            im.entries[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];

            im.entries[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];

            im.entries[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];

            im.entries[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];

            im.entries[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

            var det = m[0] * im.entries[0] + m[1] * im.entries[4] + m[2] * im.entries[8] + m[3] * im.entries[12];

            if (det == 0) {
                throw 'Determinant is zero.';
            }

            det = 1.0 / det;

            for (var i = 0; i < 16; i++) {
                this.entries[i] = im.entries[i] * det;
            }

            return this;
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new Lore.Matrix4f(new Float32Array(this.entries));
        }
    }, {
        key: 'equals',
        value: function equals(a) {
            for (var i = 0; i < this.entries.length; i++) {
                if (this.entries[i] !== a.entries[i]) return false;
            }

            return true;
        }
    }, {
        key: 'toString',
        value: function toString() {
            console.log(this.entries[0] + ', ' + this.entries[4] + ', ' + this.entries[8] + ', ' + this.entries[12]);
            console.log(this.entries[1] + ', ' + this.entries[5] + ', ' + this.entries[9] + ', ' + this.entries[13]);
            console.log(this.entries[2] + ', ' + this.entries[6] + ', ' + this.entries[10] + ', ' + this.entries[14]);
            console.log(this.entries[3] + ', ' + this.entries[7] + ', ' + this.entries[11] + ', ' + this.entries[15]);
        }
    }], [{
        key: 'multiply',
        value: function multiply(a, b) {
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

            return new Lore.Matrix4f(new Float32Array([a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30, a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30, a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30, a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30, a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31, a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31, a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31, a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31, a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32, a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32, a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32, a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32, a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33, a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33, a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33, a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33]));
        }
    }, {
        key: 'fromQuaternion',
        value: function fromQuaternion(q) {
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

            return new Lore.Matrix4f(new Float32Array([1 - (yy + zz), xy + wz, xz - wy, 0, xy - wz, 1 - (xx + zz), yz + wx, 0, xz + wy, yz - wx, 1 - (xx + yy), 0, 0, 0, 0, 1]));
        }
    }, {
        key: 'lookAt',
        value: function lookAt(cameraPosition, target, up) {
            // See here in order to return a quaternion directly:
            // http://www.euclideanspace.com/maths/algebra/vectors/lookat/
            var z = Lore.Vector3f.subtract(cameraPosition, target).normalize();

            if (z.lengthSq() === 0.0) {
                z.components[2] = 1.0;
            }

            var x = Lore.Vector3f.cross(up, z).normalize();

            if (x.lengthSq() === 0.0) {
                z.components[2] += 0.0001;
                x = Lore.Vector3f.cross(up, z).normalize();
            }

            var y = Lore.Vector3f.cross(z, x);

            return new Lore.Matrix4f(new Float32Array([x.components[0], x.components[1], x.components[2], 0, y.components[0], y.components[1], y.components[2], 0, z.components[0], z.components[1], z.components[2], 0, 0, 0, 0, 1]));
        }
    }, {
        key: 'compose',
        value: function compose(position, quaternion, scale) {
            var m = new Lore.Matrix4f();

            m.setRotation(quaternion);
            m.scale(scale);
            m.setPosition(position);

            return m;
        }
    }, {
        key: 'invert',
        value: function invert(matrix) {
            // Fugly implementation lifted from MESA (originally in C++)
            var im = new Lore.Matrix4f();

            var m = matrix.entries;

            im.entries[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];

            im.entries[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];

            im.entries[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];

            im.entries[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];

            im.entries[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];

            im.entries[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];

            im.entries[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];

            im.entries[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];

            im.entries[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];

            im.entries[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];

            im.entries[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];

            im.entries[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];

            im.entries[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];

            im.entries[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];

            im.entries[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];

            im.entries[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

            var det = m[0] * im.entries[0] + m[1] * im.entries[4] + m[2] * im.entries[8] + m[3] * im.entries[12];

            if (det == 0) {
                throw 'Determinant is zero.';
            }

            det = 1.0 / det;

            for (var i = 0; i < 16; i++) {
                im.entries[i] = im.entries[i] * det;
            }

            return im;
        }
    }]);

    return Matrix4f;
}();

Lore.Quaternion = function (x, y, z, w) {
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
        this.components[3] = w !== undefined ? w : 1.0;
    }
};

Lore.Quaternion.prototype = {
    constructor: Lore.Quaternion,

    getX: function getX() {
        return this.components[0];
    },

    getY: function getY() {
        return this.components[1];
    },

    getZ: function getZ() {
        return this.components[2];
    },

    getW: function getW() {
        return this.components[3];
    },

    set: function set(x, y, z, w) {
        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        this.components[3] = w;
    },

    setX: function setX(x) {
        this.components[0] = x;
    },

    setY: function setY(y) {
        this.components[1] = y;
    },

    setZ: function setZ(z) {
        this.components[2] = z;
    },

    setW: function setW(w) {
        this.components[3] = w;
    },

    setFromAxisAngle: function setFromAxisAngle(axis, angle) {
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

    setFromUnitVectors: function setFromUnitVectors(from, to) {
        var v = null;
        var r = from.dot(to) + 1;

        if (r < 0.000001) {
            v = new Lore.Vector3f();
            r = 0;
            if (Math.abs(from.components[0]) > Math.abs(from.components[2])) v.set(-from.components[1], from.components[0], 0);else v.set(0, -from.components[2], from.components[1]);
        } else {
            v = Lore.Vector3f.cross(from, to);
        }

        this.set(v.components[0], v.components[1], v.components[2], r);
        this.normalize();
    },

    lookAt: function lookAt(source, dest, up) {
        this.setFromMatrix(Lore.Matrix4f.lookAt(source, dest, up));
        return this;
    },

    lengthSq: function lengthSq() {
        return this.components[0] * this.components[0] + this.components[1] * this.components[1] + this.components[2] * this.components[2] + this.components[3] * this.components[3];
    },

    length: function length() {
        return Math.sqrt(this.lengthSq());
    },

    inverse: function inverse() {
        return this.conjugate().normalize();
    },

    normalize: function normalize() {
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

    dot: function dot(q) {
        return this.components[0] * q.components[0] + this.components[1] * q.components[1] + this.components[2] * q.components[2] + this.components[3] * q.components[3];
    },

    multiplyA: function multiplyA(b) {
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

    multiplyB: function multiplyB(a) {
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

    multiplyScalar: function multiplyScalar(s) {
        this.components[0] *= s;
        this.components[1] *= s;
        this.components[2] *= s;
        this.components[3] *= s;

        return this;
    },

    conjugate: function conjugate() {
        // See:
        // http://www.3dgep.com/understanding-quaternions/#Quaternion_Conjugate
        this.components[0] *= -1;
        this.components[1] *= -1;
        this.components[2] *= -1;

        return this;
    },

    add: function add(q) {
        this.components[0] += q.components[0];
        this.components[1] += q.components[1];
        this.components[2] += q.components[2];
        this.components[3] += q.components[3];

        return this;
    },

    subtract: function subtract(q) {
        this.components[0] -= q.components[0];
        this.components[1] -= q.components[1];
        this.components[2] -= q.components[2];
        this.components[3] -= q.components[3];

        return this;
    },

    rotateX: function rotateX(angle) {
        var halfAngle = angle / 2.0;
        return this.multiplyA(new Lore.Quaternion(Math.sin(halfAngle), 0.0, 0.0, Math.cos(halfAngle)));
    },

    rotateY: function rotateY(angle) {
        var halfAngle = angle / 2.0;
        return this.multiplyA(new Lore.Quaternion(0.0, Math.sin(halfAngle), 0.0, Math.cos(halfAngle)));
    },

    rotateZ: function rotateZ(angle) {
        var halfAngle = angle / 2.0;
        return this.multiplyA(new Lore.Quaternion(0.0, 0.0, Math.sin(halfAngle), Math.cos(halfAngle)));
    },

    toAxisAngle: function toAxisAngle() {
        // It seems like this isn't numerically stable. This could be solved
        // by some checks as described here:
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
        // or here:
        // https://www.flipcode.com/documents/matrfaq.html#Q57
        // However, this function currently isn't used.
        console.warn('The method toAxisAngle() has not been implemented.');
    },

    toRotationMatrix: function toRotationMatrix() {
        var i = this.components[0];
        var j = this.components[1];
        var k = this.components[2];
        var r = this.components[3];

        var ii = i * i;
        var ij = i * j;
        var ik = i * k;
        var ir = i * r;

        var jr = j * r;
        var jj = j * j;
        var jk = j * k;

        var kk = k * k;
        var kr = k * r;

        var mat = new Lore.Matrix4f();

        mat.entries[0] = 1 - 2 * (jj + kk);
        mat.entries[1] = 2 * (ij + kr);
        mat.entries[2] = 2 * (ik - jr);
        mat.entries[4] = 2 * (jk - kr);
        mat.entries[5] = 1 - 2 * (ii + kk);
        mat.entries[6] = 2 * (jk + ir);
        mat.entries[8] = 2 * (ik + jr);
        mat.entries[9] = 2 * (jk - ir);
        mat.entries[10] = 1 - 2 * (ii + jj);

        return mat;
    },

    setFromMatrix: function setFromMatrix(m) {
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

        if (t > 0) {
            var s = 0.5 / Math.sqrt(t + 1.0);
            this.components[0] = (m21 - m12) * s;
            this.components[1] = (m02 - m20) * s;
            this.components[2] = (m10 - m01) * s;
            this.components[3] = 0.25 / s;
        } else if (m00 > m11 && m00 > m22) {
            var _s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
            this.components[0] = 0.25 * _s;
            this.components[1] = (m01 + m10) / _s;
            this.components[2] = (m02 + m20) / _s;
            this.components[3] = (m21 - m12) / _s;
        } else if (m11 > m22) {
            var _s2 = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
            this.components[0] = (m01 + m10) / _s2;
            this.components[1] = 0.25 * _s2;
            this.components[2] = (m12 + m21) / _s2;
            this.components[3] = (m02 - m20) / _s2;
        } else {
            var _s3 = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
            this.components[0] = (m02 + m20) / _s3;
            this.components[1] = (m12 + m21) / _s3;
            this.components[2] = 0.25 * _s3;
            this.components[3] = (m10 - m01) / _s3;
        }

        return this;
    },

    clone: function clone() {
        return new Lore.Quaternion(this.components[0], this.components[1], this.components[2], this.components[3]);
    },

    equals: function equals(q) {
        return this.components[0] === q.components[0] && this.components[1] === q.components[1] && this.components[2] === q.components[2] && this.components[3] === q.components[3];
    },

    toString: function toString() {
        return 'x: ' + this.getX() + ', y: ' + this.getY() + ', z: ' + this.getZ() + ', w: ' + this.getW();
    }
};

Lore.Quaternion.dot = function (q, p) {
    return new Lore.Quaternion(q.components[0] * p.components[0] + q.components[1] * p.components[1] + q.components[2] * p.components[2] + q.components[3] * p.components[3]);
};

Lore.Quaternion.multiply = function (a, b) {
    return new Lore.Quaternion(a.components[0] * b.components[3] + a.components[3] * b.components[0] + a.components[1] * b.components[2] - a.components[2] * b.components[1], a.components[1] * b.components[3] + a.components[3] * b.components[1] + a.components[2] * b.components[0] - a.components[0] * b.components[2], a.components[2] * b.components[3] + a.components[3] * b.components[2] + a.components[0] * b.components[1] - a.components[1] * b.components[0], a.components[3] * b.components[3] + a.components[0] * b.components[0] + a.components[1] * b.components[1] - a.components[2] * b.components[2]);
};

Lore.Quaternion.multiplyScalar = function (q, s) {
    return new Lore.Quaternion(q.components[0] * s, q.components[1] * s, q.components[2] * s, q.components[3] * s);
};

Lore.Quaternion.inverse = function (q) {
    var p = new Lore.Quaternion(q.components);
    return p.conjugate().normalize();
};

Lore.Quaternion.normalize = function (q) {
    var length = q.length();

    if (length === 0) {
        return new Lore.Quaternion(0.0, 0.0, 0.0, 1.0);
    } else {
        var inv = 1 / length;
        return new Lore.Quaternion(q.components[0] * inv, q.components[1] * inv, q.components[2] * inv, q.components[3] * inv);
    }
};

Lore.Quaternion.conjugate = function (q) {
    return new Lore.Quaternion(q.components[0] * -1, q.components[1] * -1, q.components[2] * -1, q.components[3]);
};

Lore.Quaternion.add = function (q, p) {
    return new Lore.Quaternion(q.components[0] + p.components[0], q.components[1] + p.components[1], q.components[2] + p.components[2], q.components[3] + p.components[3]);
};

Lore.Quaternion.subtract = function (q, p) {
    return new Lore.Quaternion(q.components[0] - p.components[0], q.components[1] - p.components[1], q.components[2] - p.components[2], q.components[3] - p.components[3]);
};

Lore.Quaternion.fromMatrix = function (m) {
    var q = new Lore.Quaternion();
    q.setFromMatrix(m);
    return q;
};

Lore.Quaternion.slerp = function (q, p, t) {
    // See:
    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

    if (t === 0) return new Lore.Quaternion(q.components);
    if (t === 1) return new Lore.Quaternion(p.components);

    var tmp = new Lore.Quaternion(p.components);

    // The angle between quaternions
    var cosHalfTheta = q.components[0] * tmp.components[0] + q.components[1] * tmp.components[1] + q.components[2] * tmp.components[2] + q.components[3] * tmp.components[3];

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
        return new Lore.Quaternion(q.components[0] * 0.5 + tmp.components[0] * 0.5, q.components[1] * 0.5 + tmp.components[1] * 0.5, q.components[2] * 0.5 + tmp.components[2] * 0.5, q.components[3] * 0.5 + tmp.components[3] * 0.5);
    }

    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    return new Lore.Quaternion(q.components[0] * ratioA + tmp.components[0] * ratioB, q.components[1] * ratioA + tmp.components[1] * ratioB, q.components[2] * ratioA + tmp.components[2] * ratioB, q.components[3] * ratioA + tmp.components[3] * ratioB);
};

Lore.SphericalCoords = function () {
    function SphericalCoords(radius, phi, theta) {
        _classCallCheck(this, SphericalCoords);

        this.components = new Float32Array(3);
        this.radius = radius !== undefined ? radius : 1.0;
        this.phi = phi ? phi : 0.0;
        this.theta = theta ? theta : 0.0;
    }

    _createClass(SphericalCoords, [{
        key: 'set',
        value: function set(radius, phi, theta) {
            this.components[0] = radius;
            this.components[1] = phi;
            this.components[2] = theta;

            return this;
        }
    }, {
        key: 'secure',
        value: function secure() {
            this.components[1] = Math.max(0.000001, Math.min(Math.PI - 0.000001, this.components[1]));

            return this;
        }
    }, {
        key: 'setFromVector',
        value: function setFromVector(v) {
            this.components[0] = v.length();

            if (this.components[0] === 0.0) {
                this.components[1] = 0.0;
                this.components[2] = 0.0;
            } else {
                this.components[1] = Math.acos(Math.max(-1.0, Math.min(1.0, v.components[1] / this.components[0])));
                this.components[2] = Math.atan2(v.components[0], v.components[2]);
            }

            return this;
        }
    }, {
        key: 'limit',
        value: function limit(phiMin, phiMax, thetaMin, thetaMax) {
            // Limits for orbital controls
            this.components[1] = Math.max(phiMin, Math.min(phiMax, this.components[1]));
            this.components[2] = Math.max(thetaMin, Math.min(thetaMax, this.components[2]));
        }
    }, {
        key: 'clone',
        value: function clone() {
            return new Lore.SphericalCoords(this.radius, this.phi, this.theta);
        }
    }, {
        key: 'toString',
        value: function toString() {
            return '(' + this.components[0] + ', ' + this.components[1] + ', ' + this.components[2] + ')';
        }
    }]);

    return SphericalCoords;
}();

/** A class representing a projection matrix */
Lore.ProjectionMatrix = function (_Lore$Matrix4f) {
    _inherits(ProjectionMatrix, _Lore$Matrix4f);

    function ProjectionMatrix() {
        _classCallCheck(this, ProjectionMatrix);

        return _possibleConstructorReturn(this, (ProjectionMatrix.__proto__ || Object.getPrototypeOf(ProjectionMatrix)).apply(this, arguments));
    }

    _createClass(ProjectionMatrix, [{
        key: 'setOrthographic',

        /**
         * Set the projection matrix to an orthographic projection.
         *
         * @param {number} left The left edge.
         * @param {number} right The right edge.
         * @param {number} top The top edge.
         * @param {number} bottom The bottom edge.
         * @param {number} near The near-cutoff value.
         * @param {number} far The far-cutoff value.
         * @returns {ProjectionMatrix} Returns this projection matrix.
         */
        value: function setOrthographic(left, right, top, bottom, near, far) {
            var w = 1.0 / (right - left);
            var h = 1.0 / (top - bottom);
            var d = 1.0 / (far - near);

            var x = (right + left) * w;
            var y = (top + bottom) * h;
            var z = (far + near) * d;

            this.set();

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
    }]);

    return ProjectionMatrix;
}(Lore.Matrix4f);

Lore.Statistics = function () {};

Lore.Statistics.prototype = {
    constructor: Lore.Vector2f

};

// Using Marsaglia polar
Lore.Statistics.spareRandomNormal = null;
Lore.Statistics.randomNormal = function () {
    var val, u, v, s, mul;

    if (Lore.Statistics.spareRandomNormal !== null) {
        val = Lore.Statistics.spareRandomNormal;
        Lore.Statistics.spareRandomNormal = null;
    } else {
        do {
            u = Math.random() * 2 - 1;
            v = Math.random() * 2 - 1;

            s = u * u + v * v;
        } while (s === 0 || s >= 1);

        mul = Math.sqrt(-2 * Math.log(s) / s);
        val = u * mul;
        Lore.Statistics.spareRandomNormal = v * mul;
    }

    return val / 14;
};

Lore.Statistics.randomNormalInRange = function (a, b) {
    var val;

    do {
        val = Lore.Statistics.randomNormal();
    } while (val < a || val > b);

    return val;
};

Lore.Statistics.randomNormalScaled = function (mean, sd) {
    var r = Lore.Statistics.randomNormalInRange(-1, 1);
    return r * sd + mean;
};

Lore.Statistics.normalize = function (arr) {
    var max = Number.MIN_VALUE;
    var min = Number.MAX_VALUE;

    for (var i = 0; i < arr.length; i++) {
        var val = arr[i];
        if (val > max) max = val;
        if (val < min) min = val;
    }

    var diff = max - min;
    for (var i = 0; i < arr.length; i++) {
        arr[i] = (arr[i] - min) / diff;
    }

    return [min, max];
};

Lore.Statistics.scale = function (value, oldMin, oldMax, newMin, newMax) {
    return (newMax - newMin) * (value - oldMin) / (oldMax - oldMin) + newMin;
};

Lore.Ray = function () {
    function Ray(source, direction) {
        _classCallCheck(this, Ray);

        this.source = source || new Lore.Vector3f();
        this.direction = direction || new Lore.Vector3f();
    }

    _createClass(Ray, [{
        key: 'copyFrom',
        value: function copyFrom(r) {
            this.source.copyFrom(r.source);
            this.direction.copyFrom(r.direction);

            return this;
        }
    }, {
        key: 'applyProjection',
        value: function applyProjection(m) {
            this.direction.add(this.source).applyProjection(m);
            this.source.applyProjection(m);
            this.direction.subtract(this.source);
            this.direction.normalize();

            return this;
        }

        // See if the two following functions can be optimized

    }, {
        key: 'distanceSqToPoint',
        value: function distanceSqToPoint(v) {
            var tmp = Lore.Vector3f.subtract(v, this.source);
            var directionDistance = tmp.dot(this.direction);

            if (directionDistance < 0) {
                return this.source.distanceToSq(v);
            }

            tmp.copyFrom(this.direction).multiplyScalar(directionDistance).add(this.source);

            return tmp.distanceToSq(v);
        }
    }, {
        key: 'closestPointToPoint',
        value: function closestPointToPoint(v) {
            var result = Lore.Vector3f.subtract(v, this.source);
            var directionDistance = result.dot(this.direction);

            if (directionDistance < 0) {
                return result.copyFrom(this.source);
            }

            return result.copyFrom(this.direction).multiplyScalar(directionDistance).add(this.source);
        }
    }]);

    return Ray;
}();

var RadixSort = function () {
    function RadixSort() {
        _classCallCheck(this, RadixSort);

        this.max = undefined;
        this.mask = undefined;
        this.histograms = undefined;
        this.indices = undefined;
        this.tmpIndices = undefined;
    }

    _createClass(RadixSort, [{
        key: 'sort',
        value: function sort(arr, copyArray) {
            var array = null;

            if (copyArray) {
                array = new arr.constructor(arr.length);
                array.set(arr);
            } else {
                array = arr;
            }

            this.max = 1 << 11; // = 2^11 = 2048 = 0x00000800
            this.mask = this.max - 1; // = 2047 = 0x000007FF
            this.histograms = new Int32Array(this.max * Math.ceil(64 / 11));

            var input = new Int32Array(array.buffer, array.byteOffset, array.byteLength >> 2);
            var nPasses = Math.ceil(array.BYTES_PER_ELEMENT * 8 / 11);
            var maxOffset = this.max * (nPasses - 1);
            var msbMask = 1 << (array.BYTES_PER_ELEMENT * 8 - 1) % 11;
            var lastMask = (msbMask << 1) - 1;
            var tmp = null;
            var aux = new input.constructor(input.length);

            // In order to keep track of the indices
            this.indices = new Uint32Array(input.length);
            this.tmpIndices = new Uint32Array(input.length);

            var normIndices = new Uint32Array(input.length);
            var n = this.max * nPasses;

            for (var i = 0; i < n; i++) {
                this.histograms[i] = 0;
            }

            // Create the histogram
            this.initHistograms(input, maxOffset, lastMask);

            // Create the offset table
            for (var _i = 0; _i <= maxOffset; _i += this.max) {
                var sum = 0;

                for (var _j = _i; _j < _i + this.max; _j++) {
                    var tmpSum = this.histograms[_j] + sum;

                    this.histograms[_j] = sum - 1;
                    sum = tmpSum;
                }
            }

            // Sort by least significant byte
            this.lsbPass(input, aux);
            tmp = aux;
            aux = input;
            input = tmp;

            this.pass(input, aux);
            tmp = aux;
            aux = input;
            input = tmp;

            // Sort by most significant byte
            this.msbPass(input, aux, msbMask);

            // This part is not needed, why was it still in???

            // "Normalize" the indices, since they are split up just like the floats
            // so 0, 1 -> 0, 2, 3 -> 2, etc.
            // use multiplications not divisions for the second index -> speeeeed
            // Also, invert it
            // for(let i = 0; i < normIndices.length; i++) {
            // 	normIndices[normIndices.length - i] = this.indices[i];
            // }

            return {
                array: new Float32Array(aux.buffer, aux.byteOffset, array.length),
                indices: this.indices // instead of normIndices
            };
        }
    }, {
        key: 'lsbPass',
        value: function lsbPass(arr, aux) {
            for (var i = 0, n = arr.length; i < n; i++) {
                var val = arr[i];
                var sign = val >> 31;

                val ^= sign | 0x80000000;

                var x = ++this.histograms[val & this.mask];

                this.indices[x] = i;
                aux[x] = val;
            }
        }
    }, {
        key: 'pass',
        value: function pass(arr, aux) {
            var n = arr.length;

            for (var i = 0; i < n; i++) {
                var val = arr[i];
                var x = ++this.histograms[this.max + (val >>> 11 & this.mask)];

                this.tmpIndices[x] = this.indices[i];
                aux[x] = val;
            }

            this.indices.set(this.tmpIndices);
        }
    }, {
        key: 'msbPass',
        value: function msbPass(arr, aux, msbMask) {
            var lastMask = (msbMask << 1) - 1;
            var n = arr.length;
            var offset = 2 * this.max;

            for (var i = 0; i < n; i++) {
                var val = arr[i];
                var sign = val >> 31;
                var x = ++this.histograms[offset + (val >>> 22 & lastMask)];

                this.tmpIndices[x] = this.indices[i];
                aux[x] = val ^ (~sign | 0x80000000);
            }

            this.indices.set(this.tmpIndices);
        }
    }, {
        key: 'initHistograms',
        value: function initHistograms(arr, maxOffset, lastMask) {
            var n = arr.length;

            for (var i = 0; i < n; i++) {
                var val = arr[i];
                var sign = val >> 31;

                val ^= sign | 0x80000000;

                for (var _j2 = 0, _k = 0; _j2 < maxOffset; _j2 += this.max, _k += 11) {
                    this.histograms[_j2 + (val >>> _k & this.mask)]++;
                }

                this.histograms[j + (val >>> k & lastMask)]++;
            }
        }
    }]);

    return RadixSort;
}();

Lore.HelperBase = function (_Lore$Node2) {
    _inherits(HelperBase, _Lore$Node2);

    function HelperBase(renderer, geometryName, shaderName) {
        _classCallCheck(this, HelperBase);

        var _this6 = _possibleConstructorReturn(this, (HelperBase.__proto__ || Object.getPrototypeOf(HelperBase)).call(this));

        _this6.renderer = renderer;
        _this6.shader = Lore.Shaders[shaderName];
        _this6.geometry = _this6.renderer.createGeometry(geometryName, shaderName);
        return _this6;
    }

    _createClass(HelperBase, [{
        key: 'setAttribute',
        value: function setAttribute(name, data) {
            this.geometry.addAttribute(name, data);
        }
    }, {
        key: 'getAttribute',
        value: function getAttribute(name) {
            return this.geometry.attributes[name].data;
        }
    }, {
        key: 'updateAttribute',
        value: function updateAttribute(name, index, value) {
            var attr = this.geometry.attributes[name];

            var j = index * attr.attributeLength;

            for (var i = 0; i < attr.attributeLength; i++) {
                attr.data[j + i] = value[i] || attr.data[j + i];
            }

            attr.stale = true;
        }
    }, {
        key: 'updateAttributeAll',
        value: function updateAttributeAll(name, values) {
            var attr = this.geometry.attributes[name];

            for (var i = 0; i < attr.data.length; i++) {
                attr.data[i] = values[i];
            }

            attr.stale = true;
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.geometry.draw(this.renderer);
        }
    }]);

    return HelperBase;
}(Lore.Node);

Lore.PointHelper = function (_Lore$HelperBase) {
    _inherits(PointHelper, _Lore$HelperBase);

    function PointHelper(renderer, geometryName, shaderName, options) {
        _classCallCheck(this, PointHelper);

        var _this7 = _possibleConstructorReturn(this, (PointHelper.__proto__ || Object.getPrototypeOf(PointHelper)).call(this, renderer, geometryName, shaderName));

        var defaults = {
            octree: true,
            octreeThreshold: 500.0,
            octreeMaxDepth: 8,
            pointScale: 1.0,
            maxPointSize: 100.0
        };

        _this7.opts = Lore.Utils.extend(true, defaults, options);
        _this7.indices = null;
        _this7.octree = null;
        _this7.geometry.setMode(Lore.DrawModes.points);
        _this7.initPointSize();
        _this7.filters = {};
        _this7.pointSize = 1.0 * _this7.opts.pointScale;
        return _this7;
    }

    _createClass(PointHelper, [{
        key: 'getMaxLength',
        value: function getMaxLength(x, y, z) {
            return Math.max(x.length, Math.max(y.length, z.length));

            return this;
        }
    }, {
        key: 'setPositions',
        value: function setPositions(positions) {
            this.setAttribute('position', positions);

            return this;
        }
    }, {
        key: 'setPositionsXYZ',
        value: function setPositionsXYZ(x, y, z, length) {
            var positions = new Float32Array(length * 3);

            for (var i = 0; i < length; i++) {
                var _j3 = 3 * i;

                positions[_j3] = x[i] || 0;
                positions[_j3 + 1] = y[i] || 0;
                positions[_j3 + 2] = z[i] || 0;
            }

            if (this.opts.octree) {
                var initialBounds = Lore.AABB.fromPoints(positions);
                var indices = new Uint32Array(length);

                for (var _i2 = 0; _i2 < length; _i2++) {
                    indices[_i2] = _i2;
                }

                this.octree = new Lore.Octree(this.opts.octreeThreshold, this.opts.octreeMaxDepth);
                this.octree.build(indices, positions, initialBounds);
            }

            this.setAttribute('position', positions);

            return this;
        }
    }, {
        key: 'setPositionsXYZHSS',
        value: function setPositionsXYZHSS(x, y, z, hue, saturation, size) {
            var length = this.getMaxLength(x, y, z);

            this.setPositionsXYZ(x, y, z, length);
            this.setHSS(hue, saturation, size, length);

            return this;
        }
    }, {
        key: 'setRGB',
        value: function setRGB(r, g, b) {
            var c = new Float32Array(r.length * 3);
            var colors = this.getAttribute('color');

            for (var i = 0; i < r.length; i++) {
                var _j4 = 3 * i;

                c[_j4] = r[i];
                c[_j4 + 1] = g[i];
                c[_j4 + 2] = b[i];
            }

            // Convert to HOS (Hue, Opacity, Size)
            for (var _i3 = 0; _i3 < c.length; _i3 += 3) {
                var _r = c[_i3];
                var _g = c[_i3 + 1];
                var _b = c[_i3 + 2];

                c[_i3] = Lore.Color.rgbToHsl(_r, _g, _b)[0];
                c[_i3 + 1] = colors[1];
                c[_i3 + 2] = colors[2];
            }

            this.updateColors(c);

            return this;
        }
    }, {
        key: 'setColors',
        value: function setColors(colors) {
            this.setAttribute('color', colors);

            return this;
        }
    }, {
        key: 'updateColors',
        value: function updateColors(colors) {
            this.updateAttributeAll('color', colors);

            return this;
        }
    }, {
        key: 'updateColor',
        value: function updateColor(index, color) {
            this.updateAttribute('color', index, color.components);

            return this;
        }

        // Returns the threshold for the raycaster

    }, {
        key: 'setPointSize',
        value: function setPointSize(size) {
            var pointSize = size * this.opts.pointScale;

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
    }, {
        key: 'getPointSize',
        value: function getPointSize() {
            return this.geometry.shader.uniforms.size.value;
        }
    }, {
        key: 'getPointScale',
        value: function getPointScale() {
            return this.opts.pointScale;
        }
    }, {
        key: 'setFogDistance',
        value: function setFogDistance(fogDistance) {
            this.geometry.shader.uniforms.fogDistance.value = fogDistance;

            return this;
        }
    }, {
        key: 'initPointSize',
        value: function initPointSize() {
            this.geometry.shader.uniforms.size.value = this.renderer.camera.zoom * this.opts.pointScale;

            return this;
        }
    }, {
        key: 'getCutoff',
        value: function getCutoff() {
            return this.geometry.shader.uniforms.cutoff.value;
        }
    }, {
        key: 'setCutoff',
        value: function setCutoff(cutoff) {
            this.geometry.shader.uniforms.cutoff.value = cutoff;

            return this;
        }
    }, {
        key: 'getHue',
        value: function getHue(index) {
            var colors = this.getAttribute('color');

            return colors[index * 3];
        }
    }, {
        key: 'getPosition',
        value: function getPosition(index) {
            var positions = this.getAttribute('position');

            return new Lore.Vector3f(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2]);
        }
    }, {
        key: 'setHSS',
        value: function setHSS(hue, saturation, size, length) {
            var c = new Float32Array(length * 3);

            for (var i = 0; i < length * 3; i += 3) {
                c[i] = hue;
                c[i + 1] = saturation;
                c[i + 2] = size;
            }

            this.setColors(c);
        }
    }, {
        key: 'addFilter',
        value: function addFilter(name, filter) {
            filter.setGeometry(this.geometry);
            this.filters[name] = filter;

            return this;
        }
    }, {
        key: 'removeFilter',
        value: function removeFilter(name) {
            delete this.filters[name];

            return this;
        }
    }, {
        key: 'getFilter',
        value: function getFilter(name) {
            return this.filters[name];
        }
    }]);

    return PointHelper;
}(Lore.HelperBase);

Lore.TreeHelper = function (renderer, geometryName, shaderName, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.TreeHelper.defaults, options);
    this.indices = null;
    this.geometry.setMode(Lore.DrawModes.lines);
    this.initPointSize();
    this.filters = {};
};

Lore.TreeHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.TreeHelper,

    getMaxLength: function getMaxLength(x, y, z) {
        return Math.max(x.length, Math.max(y.length, z.length));
    },

    setPositions: function setPositions(positions) {
        this.setAttribute('position', positions);
    },

    setPositionsXYZ: function setPositionsXYZ(x, y, z, length) {
        var positions = new Float32Array(length * 3);
        for (var i = 0; i < length; i++) {
            var _j5 = 3 * i;
            positions[_j5] = x[i] || 0;
            positions[_j5 + 1] = y[i] || 0;
            positions[_j5 + 2] = z[i] || 0;
        }

        this.setAttribute('position', positions);
    },

    setPositionsXYZHSS: function setPositionsXYZHSS(x, y, z, hue, saturation, size) {
        var length = this.getMaxLength(x, y, z);
        this.setPositionsXYZ(x, y, z, length);
        this.setHSS(hue, saturation, size, length);
    },

    setColors: function setColors(colors) {
        this.setAttribute('color', colors);
    },

    updateColors: function updateColors(colors) {
        this.updateAttributeAll('color', colors);
    },

    updateColor: function updateColor(index, color) {
        this.updateAttribute('color', index, color.components);
    },

    setPointSize: function setPointSize(size) {
        if (size * this.opts.pointScale > this.opts.maxPointSize) return;
        this.geometry.shader.uniforms.size.value = size * this.opts.pointScale;
    },

    getPointSize: function getPointSize() {
        return this.geometry.shader.uniforms.size.value;
    },

    setFogDistance: function setFogDistance(fogDistance) {
        this.geometry.shader.uniforms.fogDistance.value = fogDistance;
    },

    initPointSize: function initPointSize() {
        this.geometry.shader.uniforms.size.value = this.renderer.camera.zoom * this.opts.pointScale;
    },

    getCutoff: function getCutoff() {
        return this.geometry.shader.uniforms.cutoff.value;
    },

    setCutoff: function setCutoff(cutoff) {
        this.geometry.shader.uniforms.cutoff.value = cutoff;
    },

    getHue: function getHue(index) {
        var colors = this.getAttribute('color');
        return colors[index * 3];
    },

    setHSS: function setHSS(hue, saturation, size, length) {
        var c = new Float32Array(length * 3);

        for (var i = 0; i < length * 3; i += 3) {
            c[i] = hue;
            c[i + 1] = saturation;
            c[i + 2] = size;
        }

        this.setColors(c);
    },

    addFilter: function addFilter(name, filter) {
        filter.setGeometry(this.geometry);
        this.filters[name] = filter;
    },

    removeFilter: function removeFilter(name) {
        delete this.filters[name];
    },

    getFilter: function getFilter(name) {
        return this.filters[name];
    }
});

Lore.TreeHelper.defaults = {
    pointScale: 1.0,
    maxPointSize: 100.0
};

Lore.CoordinatesHelper = function (renderer, geometryName, shaderName, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.CoordinatesHelper.defaults, options);

    this.geometry.setMode(Lore.DrawModes.lines);
    this.init();
};

Lore.CoordinatesHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.CoordinatesHelper,

    init: function init() {
        var p = this.opts.position.components;
        var ao = this.opts.axis;

        // Setting the origin position of the axes
        var positions = [p[0], p[1], p[2], p[0] + ao.x.length, p[1], p[2], p[0], p[1], p[2], p[0], p[1] + ao.y.length, p[2], p[0], p[1], p[2], p[0], p[1], p[2] + ao.z.length];

        // Setting the colors of the axes
        var cx = ao.x.color.components;
        var cy = ao.y.color.components;
        var cz = ao.z.color.components;

        var colors = [cx[0], cx[1], cx[2], cx[0], cx[1], cx[2], cy[0], cy[1], cy[2], cy[0], cy[1], cy[2], cz[0], cz[1], cz[2], cz[0], cz[1], cz[2]];

        // Adding the box
        if (this.opts.box.enabled) {
            var bx = this.opts.box.x.color.components;
            var by = this.opts.box.y.color.components;
            var bz = this.opts.box.z.color.components;

            positions.push(p[0] + ao.x.length, p[1] + ao.y.length, p[2] + ao.z.length, p[0], p[1] + ao.y.length, p[2] + ao.z.length, p[0] + ao.x.length, p[1], p[2] + ao.z.length, p[0], p[1], p[2] + ao.z.length, p[0] + ao.x.length, p[1] + ao.y.length, p[2], p[0], p[1] + ao.y.length, p[2], p[0] + ao.x.length, p[1] + ao.y.length, p[2] + ao.z.length, p[0] + ao.x.length, p[1], p[2] + ao.z.length, p[0], p[1] + ao.y.length, p[2] + ao.z.length, p[0], p[1], p[2] + ao.z.length, p[0] + ao.x.length, p[1] + ao.y.length, p[2], p[0] + ao.x.length, p[1], p[2], p[0] + ao.x.length, p[1] + ao.y.length, p[2] + ao.z.length, p[0] + ao.x.length, p[1] + ao.y.length, p[2], p[0], p[1] + ao.y.length, p[2] + ao.z.length, p[0], p[1] + ao.y.length, p[2], p[0] + ao.x.length, p[1], p[2] + ao.z.length, p[0] + ao.x.length, p[1], p[2]);

            colors.push(bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], by[0], by[1], by[2], by[0], by[1], by[2], by[0], by[1], by[2], by[0], by[1], by[2], by[0], by[1], by[2], by[0], by[1], by[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2]);
        }

        // Adding the ticks
        var xTicks = this.opts.ticks.x,
            xTickOffset = ao.x.length / xTicks.count;
        var yTicks = this.opts.ticks.y,
            yTickOffset = ao.y.length / yTicks.count;
        var zTicks = this.opts.ticks.z,
            zTickOffset = ao.z.length / zTicks.count;

        // X ticks
        var pos = p[0];
        var col = xTicks.color.components;
        for (var i = 0; i < xTicks.count - 1; i++) {
            pos += xTickOffset;
            // From
            positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2], pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, p[2] + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        pos = p[0];
        for (var _i4 = 0; _i4 < xTicks.count - 1; _i4++) {
            pos += xTickOffset;
            // From
            positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2], pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        // Y ticks
        pos = p[1];
        col = yTicks.color.components;
        for (var _i5 = 0; _i5 < yTicks.count - 1; _i5++) {
            pos += yTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2], p[0] + xTicks.offset.components[0] + xTicks.length, pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        pos = p[1];
        for (var _i6 = 0; _i6 < yTicks.count - 1; _i6++) {
            pos += yTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2], p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        // Z ticks
        pos = p[2];
        col = zTicks.color.components;
        for (var _i7 = 0; _i7 < zTicks.count - 1; _i7++) {
            pos += zTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2], p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, pos + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        pos = p[2];
        for (var _i8 = 0; _i8 < zTicks.count - 1; _i8++) {
            pos += zTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2], p[0] + xTicks.offset.components[0] + xTicks.length, p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        this.setAttribute('position', new Float32Array(positions));
        this.setAttribute('color', new Float32Array(colors));
    }
});

Lore.CoordinatesHelper.defaults = {
    position: new Lore.Vector3f(),
    axis: {
        x: {
            length: 50.0,
            color: Lore.Color.fromHex('#222222')
        },
        y: {
            length: 50.0,
            color: Lore.Color.fromHex('#222222')
        },
        z: {
            length: 50.0,
            color: Lore.Color.fromHex('#222222')
        }
    },
    ticks: {
        x: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: Lore.Color.fromHex('#222222')
        },
        y: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: Lore.Color.fromHex('#222222')
        },
        z: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: Lore.Color.fromHex('#222222')
        }
    },
    box: {
        enabled: true,
        x: {
            color: Lore.Color.fromHex('#999999')
        },
        y: {
            color: Lore.Color.fromHex('#999999')
        },
        z: {
            color: Lore.Color.fromHex('#999999')
        }
    }
};

Lore.OctreeHelper = function (_Lore$HelperBase2) {
    _inherits(OctreeHelper, _Lore$HelperBase2);

    function OctreeHelper(renderer, geometryName, shaderName, target, options) {
        _classCallCheck(this, OctreeHelper);

        var _this8 = _possibleConstructorReturn(this, (OctreeHelper.__proto__ || Object.getPrototypeOf(OctreeHelper)).call(this, renderer, geometryName, shaderName));

        _this8.defaults = {
            visualize: false
        };

        _this8.opts = Lore.Utils.extend(true, _this8.defaults, options);
        _this8.eventListeners = {};
        _this8.target = target;
        _this8.renderer = renderer;
        _this8.octree = _this8.target.octree;
        _this8.raycaster = new Lore.Raycaster();
        _this8.hovered = null;
        _this8.selected = [];

        var that = _this8;

        renderer.controls.addEventListener('dblclick', function (e) {
            if (e.e.mouse.state.middle || e.e.mouse.state.right) {
                return;
            }

            var mouse = e.e.mouse.normalizedPosition;
            var result = that.getIntersections(mouse);

            if (result.length > 0) {
                if (that.selectedContains(result[0].index)) {
                    return;
                }

                that.addSelected(result[0]);
            }
        });

        renderer.controls.addEventListener('mousemove', function (e) {
            if (e.e.mouse.state.left || e.e.mouse.state.middle || e.e.mouse.state.right) {
                return;
            }

            var mouse = e.e.mouse.normalizedPosition;
            var result = that.getIntersections(mouse);

            if (result.length > 0) {
                if (that.hovered && that.hovered.index === result[0].index) {
                    return;
                }

                that.hovered = result[0];
                that.hovered.screenPosition = that.renderer.camera.sceneToScreen(result[0].position, renderer);
                that.raiseEvent('hoveredchanged', {
                    e: that.hovered
                });
            } else {
                that.hovered = null;
                that.raiseEvent('hoveredchanged', {
                    e: null
                });
            }
        });

        renderer.controls.addEventListener('zoomchanged', function (zoom) {
            that.setPointSizeFromZoom(zoom);
        });

        renderer.controls.addEventListener('updated', function () {
            for (var i = 0; i < that.selected.length; i++) {
                that.selected[i].screenPosition = that.renderer.camera.sceneToScreen(that.selected[i].position, renderer);
            }

            if (that.hovered) {
                that.hovered.screenPosition = that.renderer.camera.sceneToScreen(that.hovered.position, renderer);
            }

            that.raiseEvent('updated');
        });

        _this8.init();
        return _this8;
    }

    _createClass(OctreeHelper, [{
        key: 'init',
        value: function init() {
            if (this.opts.visualize === 'centers') {
                this.drawCenters();
            } else if (this.opts.visualize === 'cubes') {
                this.drawBoxes();
            } else {
                this.geometry.isVisible = false;
            }

            this.setPointSizeFromZoom(1.0);
        }
    }, {
        key: 'setPointSizeFromZoom',
        value: function setPointSizeFromZoom(zoom) {
            var threshold = this.target.setPointSize(zoom + 0.1);

            this.setThreshold(threshold);
        }
    }, {
        key: 'getScreenPosition',
        value: function getScreenPosition(index) {
            var positions = this.target.geometry.attributes['position'].data;
            var k = index * 3;
            var p = new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]);

            return this.renderer.camera.sceneToScreen(p, this.renderer);
        }
    }, {
        key: 'addSelected',
        value: function addSelected(item) {
            // If item is only the index, create a dummy item
            if (!isNaN(parseFloat(item))) {
                var positions = this.target.geometry.attributes['position'].data;
                var colors = this.target.geometry.attributes['color'].data;
                var _k2 = item * 3;

                item = {
                    distance: -1,
                    index: item,
                    locCode: -1,
                    position: new Lore.Vector3f(positions[_k2], positions[_k2 + 1], positions[_k2 + 2]),
                    color: colors ? [colors[_k2], colors[_k2 + 1], colors[_k2 + 2]] : null
                };
            }

            var index = this.selected.length;
            this.selected.push(item);
            this.selected[index].screenPosition = this.renderer.camera.sceneToScreen(item.position, this.renderer);
            this.raiseEvent('selectedchanged', {
                e: this.selected
            });
        }
    }, {
        key: 'removeSelected',
        value: function removeSelected(index) {
            this.selected.splice(index, 1);
            this.raiseEvent('selectedchanged', {
                e: this.selected
            });
        }
    }, {
        key: 'clearSelected',
        value: function clearSelected() {
            this.selected = [];
            this.raiseEvent('selectedchanged', {
                e: this.selected
            });
        }
    }, {
        key: 'selectedContains',
        value: function selectedContains(index) {
            for (var i = 0; i < this.selected.length; i++) {
                if (this.selected[i].index === index) {
                    return true;
                }
            }

            return false;
        }
    }, {
        key: 'setHovered',
        value: function setHovered(index) {
            if (that.hovered && that.hovered.index === result[0].index) {
                return;
            }

            var k = index * 3;
            var positions = this.target.geometry.attributes['position'].data;
            var colors = null;

            if ('color' in this.target.geometry.attributes) {
                colors = this.target.geometry.attributes['color'].data;
            }

            that.hovered = {
                index: index,
                position: new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]),
                color: colors ? [colors[k], colors[k + 1], colors[k + 2]] : null
            };

            that.hovered.screenPosition = that.renderer.camera.sceneToScreen(that.hovered.position, renderer);
            that.raiseEvent('hoveredchanged', {
                e: that.hovered
            });
        }
    }, {
        key: 'selectHovered',
        value: function selectHovered() {
            if (!this.hovered || this.selectedContains(this.hovered.index)) {
                return;
            }

            this.addSelected({
                distance: this.hovered.distance,
                index: this.hovered.index,
                locCode: this.hovered.locCode,
                position: this.hovered.position,
                color: this.hovered.color
            });
        }
    }, {
        key: 'showCenters',
        value: function showCenters() {
            this.opts.visualize = 'centers';
            this.drawCenters();
            this.geometry.isVisible = true;
        }
    }, {
        key: 'showCubes',
        value: function showCubes() {
            this.opts.visualize = 'cubes';
            this.drawBoxes();
            this.geometry.isVisible = true;
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.opts.visualize = false;
            this.geometry.isVisible = false;

            this.setAttribute('position', new Float32Array([]));
            this.setAttribute('color', new Float32Array([]));
        }
    }, {
        key: 'getIntersections',
        value: function getIntersections(mouse) {
            this.raycaster.set(this.renderer.camera, mouse.x, mouse.y);

            var tmp = this.octree.raySearch(this.raycaster);
            var result = this.rayIntersections(tmp);

            result.sort(function (a, b) {
                return a.distance - b.distance;
            });

            return result;
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(eventName, callback) {
            if (!this.eventListeners[eventName]) {
                this.eventListeners[eventName] = [];
            }

            this.eventListeners[eventName].push(callback);
        }
    }, {
        key: 'raiseEvent',
        value: function raiseEvent(eventName, data) {
            if (!this.eventListeners[eventName]) {
                return;
            }

            for (var i = 0; i < this.eventListeners[eventName].length; i++) {
                this.eventListeners[eventName][i](data);
            }
        }
    }, {
        key: 'drawCenters',
        value: function drawCenters() {
            this.geometry.setMode(Lore.DrawModes.points);

            var aabbs = this.octree.aabbs;
            var length = Object.keys(aabbs).length;
            var colors = new Float32Array(length * 3);
            var positions = new Float32Array(length * 3);

            var i = 0;

            for (key in aabbs) {
                var c = aabbs[key].center.components;
                var _k3 = i * 3;

                colors[_k3] = 1;
                colors[_k3 + 1] = 1;
                colors[_k3 + 2] = 1;

                positions[_k3] = c[0];
                positions[_k3 + 1] = c[1];
                positions[_k3 + 2] = c[2];

                i++;
            }

            this.setAttribute('position', new Float32Array(positions));
            this.setAttribute('color', new Float32Array(colors));
        }
    }, {
        key: 'drawBoxes',
        value: function drawBoxes() {
            this.geometry.setMode(Lore.DrawModes.lines);

            var aabbs = this.octree.aabbs;
            var length = Object.keys(aabbs).length;
            var c = new Float32Array(length * 24 * 3);
            var p = new Float32Array(length * 24 * 3);

            for (var i = 0; i < c.length; i++) {
                c[i] = 1;
            }

            var index = 0;

            for (key in aabbs) {
                var corners = Lore.AABB.getCorners(aabbs[key]);

                p[index++] = corners[0][0];
                p[index++] = corners[0][1];
                p[index++] = corners[0][2];
                p[index++] = corners[1][0];
                p[index++] = corners[1][1];
                p[index++] = corners[1][2];
                p[index++] = corners[0][0];
                p[index++] = corners[0][1];
                p[index++] = corners[0][2];
                p[index++] = corners[2][0];
                p[index++] = corners[2][1];
                p[index++] = corners[2][2];
                p[index++] = corners[0][0];
                p[index++] = corners[0][1];
                p[index++] = corners[0][2];
                p[index++] = corners[4][0];
                p[index++] = corners[4][1];
                p[index++] = corners[4][2];

                p[index++] = corners[1][0];
                p[index++] = corners[1][1];
                p[index++] = corners[1][2];
                p[index++] = corners[3][0];
                p[index++] = corners[3][1];
                p[index++] = corners[3][2];
                p[index++] = corners[1][0];
                p[index++] = corners[1][1];
                p[index++] = corners[1][2];
                p[index++] = corners[5][0];
                p[index++] = corners[5][1];
                p[index++] = corners[5][2];

                p[index++] = corners[2][0];
                p[index++] = corners[2][1];
                p[index++] = corners[2][2];
                p[index++] = corners[3][0];
                p[index++] = corners[3][1];
                p[index++] = corners[3][2];
                p[index++] = corners[2][0];
                p[index++] = corners[2][1];
                p[index++] = corners[2][2];
                p[index++] = corners[6][0];
                p[index++] = corners[6][1];
                p[index++] = corners[6][2];

                p[index++] = corners[3][0];
                p[index++] = corners[3][1];
                p[index++] = corners[3][2];
                p[index++] = corners[7][0];
                p[index++] = corners[7][1];
                p[index++] = corners[7][2];

                p[index++] = corners[4][0];
                p[index++] = corners[4][1];
                p[index++] = corners[4][2];
                p[index++] = corners[5][0];
                p[index++] = corners[5][1];
                p[index++] = corners[5][2];
                p[index++] = corners[4][0];
                p[index++] = corners[4][1];
                p[index++] = corners[4][2];
                p[index++] = corners[6][0];
                p[index++] = corners[6][1];
                p[index++] = corners[6][2];

                p[index++] = corners[5][0];
                p[index++] = corners[5][1];
                p[index++] = corners[5][2];
                p[index++] = corners[7][0];
                p[index++] = corners[7][1];
                p[index++] = corners[7][2];

                p[index++] = corners[6][0];
                p[index++] = corners[6][1];
                p[index++] = corners[6][2];
                p[index++] = corners[7][0];
                p[index++] = corners[7][1];
                p[index++] = corners[7][2];
            }

            this.setAttribute('position', p);
            this.setAttribute('color', c);
        }
    }, {
        key: 'setThreshold',
        value: function setThreshold(threshold) {
            this.raycaster.threshold = threshold;
        }
    }, {
        key: 'rayIntersections',
        value: function rayIntersections(indices) {
            var result = [];
            var inverseMatrix = Lore.Matrix4f.invert(this.target.modelMatrix); // this could be optimized, since the model matrix does not change
            var ray = new Lore.Ray();
            var threshold = this.raycaster.threshold * this.target.getPointScale();
            var positions = this.target.geometry.attributes['position'].data;
            var colors = null;

            if ('color' in this.target.geometry.attributes) {
                colors = this.target.geometry.attributes['color'].data;
            }

            // Only get points further away than the cutoff set in the point HelperBase
            var cutoff = this.target.getCutoff();

            ray.copyFrom(this.raycaster.ray).applyProjection(inverseMatrix);

            var localThreshold = threshold; // / ((pointCloud.scale.x + pointCloud.scale.y + pointCloud.scale.z) / 3);
            var localThresholdSq = localThreshold * localThreshold;

            for (var i = 0; i < indices.length; i++) {
                var index = indices[i].index;
                var locCode = indices[i].locCode;
                var _k4 = index * 3;
                var v = new Lore.Vector3f(positions[_k4], positions[_k4 + 1], positions[_k4 + 2]);

                var rayPointDistanceSq = ray.distanceSqToPoint(v);
                if (rayPointDistanceSq < localThresholdSq) {
                    var intersectedPoint = ray.closestPointToPoint(v);
                    intersectedPoint.applyProjection(this.target.modelMatrix);
                    var dist = this.raycaster.ray.source.distanceTo(intersectedPoint);
                    var isVisible = Lore.FilterBase.isVisible(this.target.geometry, index);
                    if (dist < this.raycaster.near || dist > this.raycaster.far || dist < cutoff || !isVisible) continue;

                    result.push({
                        distance: dist,
                        index: index,
                        locCode: locCode,
                        position: v,
                        color: colors ? [colors[_k4], colors[_k4 + 1], colors[_k4 + 2]] : null
                    });
                }
            }

            return result;
        }
    }]);

    return OctreeHelper;
}(Lore.HelperBase);

Lore.FilterBase = function (attribute, attributeIndex) {
    this.type = 'Lore.FilterBase';
    this.geometry = null;
    this.attribute = attribute;
    this.attributeIndex = attributeIndex;
    this.active = false;
};

Lore.FilterBase.prototype = {
    constructor: Lore.FilterBase,

    getGeometry: function getGeometry() {
        return this.geometry;
    },

    setGeometry: function setGeometry(value) {
        this.geometry = value;
    },

    filter: function filter() {}
};

Lore.FilterBase.isVisible = function (geometry, index) {
    return geometry.attributes['color'].data[index * 3 + 2] > 0.0;
};

Lore.InRangeFilter = function (attribute, attributeIndex, min, max) {
    Lore.FilterBase.call(this, attribute, attributeIndex);
    this.min = min;
    this.max = max;
};

Lore.InRangeFilter.prototype = Object.assign(Object.create(Lore.FilterBase.prototype), {
    constructor: Lore.InRangeFilter,

    getMin: function getMin() {
        return this.min;
    },

    setMin: function setMin(value) {
        this.min = value;
    },

    getMax: function getMax() {
        return this.max;
    },

    setMax: function setMax(value) {
        this.max = value;
    },

    filter: function filter() {
        var attribute = this.geometry.attributes[this.attribute];

        for (var i = 0; i < attribute.data.length; i += attribute.attributeLength) {
            var value = attribute.data[i + this.attributeIndex];
            var size = this.geometry.attributes['color'].data[i + 2];
            if (value > this.max || value < this.min) this.geometry.attributes['color'].data[i + 2] = -Math.abs(size);else this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
        }

        this.geometry.updateAttribute('color');
    },

    reset: function reset() {
        var attribute = this.geometry.attributes[this.attribute];

        for (var i = 0; i < attribute.data.length; i += attribute.attributeLength) {
            var size = this.geometry.attributes['color'].data[i + 2];
            this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
        }

        this.geometry.updateAttribute('color');
    }
});

Lore.FileReaderBase = function () {
    function FileReaderBase(elementId) {
        _classCallCheck(this, FileReaderBase);

        this.elementId = elementId;
        this.element = document.getElementById(this.elementId);
        this.eventListeners = {};

        var that = this;

        this.element.addEventListener('change', function () {
            var fileReader = new FileReader();

            fileReader.onload = function () {
                that.loaded(fileReader.result);
            };

            fileReader.readAsBinaryString(this.files[0]);
        });
    }

    _createClass(FileReaderBase, [{
        key: 'addEventListener',
        value: function addEventListener(eventName, callback) {
            if (!this.eventListeners[eventName]) {
                this.eventListeners[eventName] = [];
            }

            this.eventListeners[eventName].push(callback);
        }
    }, {
        key: 'raiseEvent',
        value: function raiseEvent(eventName, data) {
            if (!this.eventListeners[eventName]) {
                return;
            }

            for (var i = 0; i < this.eventListeners[eventName].length; i++) {
                this.eventListeners[eventName][i](data);
            }
        }
    }, {
        key: 'loaded',
        value: function loaded(data) {}
    }]);

    return FileReaderBase;
}();

Lore.CsvFileReader = function (_Lore$FileReaderBase) {
    _inherits(CsvFileReader, _Lore$FileReaderBase);

    function CsvFileReader(elementId, options) {
        _classCallCheck(this, CsvFileReader);

        var _this9 = _possibleConstructorReturn(this, (CsvFileReader.__proto__ || Object.getPrototypeOf(CsvFileReader)).call(this, elementId));

        _this9.defaults = {
            separator: ',',
            cols: [],
            types: [],
            header: true
        };

        _this9.opts = Lore.Utils.extend(true, Lore.CsvFileReader.defaults, options);
        _this9.columns = [];
        return _this9;
    }

    _createClass(CsvFileReader, [{
        key: 'loaded',
        value: function loaded(data) {
            data = data.replace('\n\n', '\n');
            data = data.replace(/^\s+|\s+$/g, '');

            var lines = data.split('\n');
            var length = lines.length;
            var init = true;
            var loadCols = this.opts.cols;
            var h = this.opts.header ? 1 : 0;

            for (var i = h; i < length; i++) {
                var values = lines[i].split(this.opts.separator);

                if (loadCols.length == 0) for (var _j6 = 0; _j6 < values.length; _j6++) {
                    loadCols.push[_j6];
                }

                if (init) {
                    for (var _j7 = 0; _j7 < loadCols.length; _j7++) {
                        this.createArray(_j7, this.opts.types[_j7], length - h);
                    }

                    init = false;
                }

                for (var _j8 = 0; _j8 < loadCols.length; _j8++) {
                    this.columns[_j8][i - h] = values[loadCols[_j8]];
                }
            }

            this.raiseEvent('loaded', this.columns);

            return this;
        }
    }, {
        key: 'createArray',
        value: function createArray(index, type, length) {
            if (type == 'Int8Array') {
                this.columns[index] = new Int8Array(length);
            } else if (type == 'Uint8Array') {
                this.columns[index] = new Uint8Array(length);
            } else if (type == 'Uint8ClampedArray') {
                this.columns[index] = new Uint8ClampedArray(length);
            } else if (type == 'Int16Array') {
                this.columns[index] = new Int16Array(length);
            } else if (type == 'Uint16Array') {
                this.columns[index] = new Uint16Array(length);
            } else if (type == 'Int32Array') {
                this.columns[index] = new Int32Array(length);
            } else if (type == 'Uint32Array') {
                this.columns[index] = new Uint32Array(length);
            } else if (type == 'Float32Array') {
                this.columns[index] = new Float32Array(length);
            } else if (type == 'Float64Array') {
                this.columns[index] = new Float64Array(length);
            } else {
                this.columns[index] = new Array(length);
            }

            return this;
        }
    }]);

    return CsvFileReader;
}(Lore.FileReaderBase);

Lore.Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'extend',
        value: function extend() {
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;

            if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
                deep = arguments[0];
                i++;
            }

            var merge = function merge(obj) {
                for (var prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                            extended[prop] = Lore.Utils.extend(true, extended[prop], obj[prop]);
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };

            for (; i < length; i++) {
                var obj = arguments[i];
                merge(obj);
            }

            return extended;
        }
    }, {
        key: 'arrayContains',
        value: function arrayContains(array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }
            }

            return false;
        }
    }, {
        key: 'concatTypedArrays',
        value: function concatTypedArrays(a, b) {
            var c = new a.constructor(a.length + b.length);

            c.set(a);
            c.set(b, a.length);

            return c;
        }
    }, {
        key: 'msb',
        value: function msb(n) {
            return n & 0x80000000 ? 31 : Lore.Utils.msb(n << 1 | 1) - 1;
        }
    }, {
        key: 'mergePointDistances',
        value: function mergePointDistances(a, b) {
            var newObj = {};

            newObj.indices = Lore.Utils.concatTypedArrays(a.indices, b.indices);
            newObj.distancesSq = Lore.Utils.concatTypedArrays(a.distancesSq, b.distancesSq);

            return newObj;
        }
    }]);

    return Utils;
}();

Lore.Shaders['default'] = new Lore.Shader('Default', { size: new Lore.Uniform('size', 5.0, 'float'),
    type: new Lore.Uniform('type', 0.0, 'float'),
    fogDistance: new Lore.Uniform('fogDistance', 0.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float') }, ['uniform float size;', 'uniform float fogDistance;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'float fog_start = cutoff;', 'float fog_end = fogDistance + cutoff;', 'float dist = abs(mv_pos.z - fog_start);', 'gl_PointSize = size;', 'if(fogDistance > 0.0) {', 'hsv.b = clamp((fog_end - dist) / (fog_end - fog_start), 0.0, 1.0);', '}', 'hsv.g = 0.5 + 0.4 * rand(position.xy);', 'vColor = hsv2rgb(hsv);', '}'], ['varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'gl_FragColor = vec4(vColor, 1.0);', '}']);

Lore.Shaders['defaultAnimated'] = new Lore.Shader('DefaultAnimated', { size: new Lore.Uniform('size', 5.0, 'float'),
    fogDistance: new Lore.Uniform('fogDistance', 0.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float'),
    time: new Lore.Uniform('time', 0.0, 'float') }, ['uniform float size;', 'uniform float fogDistance;', 'uniform float cutoff;', 'uniform float time;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'float fog_start = cutoff;', 'float fog_end = fogDistance + cutoff;', 'float dist = abs(mv_pos.z - fog_start);', 'gl_PointSize = size;', 'if(fogDistance > 0.0) {', 'hsv.b = clamp((fog_end - dist) / (fog_end - fog_start), 0.0, 1.0);', '}', 'hsv.g *= max(0.15, abs(sin(time * 0.002)));', 'vColor = hsv2rgb(hsv);', '}'], ['varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'gl_FragColor = vec4(vColor, 1.0);', '}']);

Lore.Shaders['coordinates'] = new Lore.Shader('Coordinates', {}, ['attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'void main() {', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'gl_PointSize = 1.0;', 'vColor = color;', '}'], ['varying vec3 vColor;', 'void main() {', 'gl_FragColor = vec4(vColor, 0.5);', '}']);

Lore.Shaders['tree'] = new Lore.Shader('Tree', { size: new Lore.Uniform('size', 5.0, 'float'),
    fogDistance: new Lore.Uniform('fogDistance', 0.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float') }, ['uniform float size;', 'uniform float fogDistance;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 0.75);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'float fog_start = cutoff;', 'float fog_end = fogDistance + cutoff;', 'float dist = abs(mv_pos.z - fog_start);', 'gl_PointSize = size;', 'if(fogDistance > 0.0) {', 'hsv.b = clamp((fog_end - dist) / (fog_end - fog_start), 0.0, 1.0);', '}', 'vColor = hsv2rgb(hsv);', '}'], ['varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'gl_FragColor = vec4(vColor, 0.5);', '}']);

Lore.Shaders['sphere'] = new Lore.Shader('Sphere', { size: new Lore.Uniform('size', 5.0, 'float'),
    fogDistance: new Lore.Uniform('fogDistance', 0.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float') }, ['uniform float size;', 'uniform float fogDistance;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'float fog_start = cutoff;', 'float fog_end = fogDistance + cutoff;', 'float dist = abs(mv_pos.z - fog_start);', 'gl_PointSize = size;', 'if(fogDistance > 0.0) {', 'hsv.b = clamp((fog_end - dist) / (fog_end - fog_start), 0.0, 1.0);', '}', 'vColor = hsv2rgb(hsv);', '}'], ['varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'vec3 N;', 'N.xy = gl_PointCoord * 2.0 - vec2(1.0);', 'float mag = dot(N.xy, N.xy);', 'if (mag > 1.0) discard;   // discard fragments outside circle', 'N.z = sqrt(1.0 - mag);', 'vec3 light_dir = vec3(0.25, -0.25, 1.0);', 'float diffuse = max(0.25, dot(light_dir, N));', 'vec3 v = normalize(vec3(0.1, -0.2, 1.0));', 'vec3 h = normalize(light_dir + v);', 'float specular = pow(max(0.0, dot(N, h)), 100.0);', 'gl_FragColor = vec4(vColor * diffuse + specular * 0.5, 1.0);', '}']);

Lore.Shaders['defaultEffect'] = new Lore.Shader('DefaultEffect', {}, ['attribute vec2 v_coord;', 'uniform sampler2D fbo_texture;', 'varying vec2 f_texcoord;', 'void main() {', 'gl_Position = vec4(v_coord, 0.0, 1.0);', 'f_texcoord = (v_coord + 1.0) / 2.0;', '}'], ['uniform sampler2D fbo_texture;', 'varying vec2 f_texcoord;', 'void main(void) {', 'vec4 color = texture2D(fbo_texture, f_texcoord);', 'gl_FragColor = color;', '}']);

Lore.Shaders['fxaaEffect'] = new Lore.Shader('FXAAEffect', { resolution: new Lore.Uniform('resolution', [500.0, 500.0], 'float_vec2') }, ['attribute vec2 v_coord;', 'uniform sampler2D fbo_texture;', 'uniform vec2 resolution;', 'varying vec2 f_texcoord;', 'void main() {', 'gl_Position = vec4(v_coord, 0.0, 1.0);', 'f_texcoord = (v_coord + 1.0) / 2.0;', '}'], /*
                                                                                                                                                                                                                                                                                                                                                                       [
                                                                                                                                                                                                                                                                                                                                                                        '#define FXAA_REDUCE_MIN   (1.0/ 128.0)',
                                                                                                                                                                                                                                                                                                                                                                        '#define FXAA_REDUCE_MUL   (1.0 / 8.0)',
                                                                                                                                                                                                                                                                                                                                                                        '#define FXAA_SPAN_MAX     8.0',
                                                                                                                                                                                                                                                                                                                                                                         'vec4 applyFXAA(vec2 fragCoord, sampler2D tex, vec2 resolution)',
                                                                                                                                                                                                                                                                                                                                                                        '{',
                                                                                                                                                                                                                                                                                                                                                                            'fragCoord = fragCoord * resolution;',
                                                                                                                                                                                                                                                                                                                                                                            'vec2 inverseVP = vec2(1.0 / 500.0, 1.0 / 500.0);',
                                                                                                                                                                                                                                                                                                                                                                            'vec3 rgbNW = texture2D(tex, (fragCoord.xy + vec2(-1.0, -1.0)) * inverseVP).xyz;',
                                                                                                                                                                                                                                                                                                                                                                            'vec3 rgbNE = texture2D(tex, (fragCoord.xy + vec2(1.0, -1.0)) * inverseVP).xyz;',
                                                                                                                                                                                                                                                                                                                                                                            'vec3 rgbSW = texture2D(tex, (fragCoord.xy + vec2(-1.0, 1.0)) * inverseVP).xyz;',
                                                                                                                                                                                                                                                                                                                                                                            'vec3 rgbSE = texture2D(tex, (fragCoord.xy + vec2(1.0, 1.0)) * inverseVP).xyz;',
                                                                                                                                                                                                                                                                                                                                                                            'vec4 rgbaM  = texture2D(tex, fragCoord.xy  * inverseVP);',
                                                                                                                                                                                                                                                                                                                                                                            'vec3 rgbM = rgbaM.xyz;',
                                                                                                                                                                                                                                                                                                                                                                            'float opacity = rgbaM.w;',
                                                                                                                                                                                                                                                                                                                                                                            'vec3 luma = vec3(0.299, 0.587, 0.114);',
                                                                                                                                                                                                                                                                                                                                                                            'float lumaNW = dot(rgbNW, luma);',
                                                                                                                                                                                                                                                                                                                                                                            'float lumaNE = dot(rgbNE, luma);',
                                                                                                                                                                                                                                                                                                                                                                            'float lumaSW = dot(rgbSW, luma);',
                                                                                                                                                                                                                                                                                                                                                                            'float lumaSE = dot(rgbSE, luma);',
                                                                                                                                                                                                                                                                                                                                                                            'float lumaM  = dot(rgbM,  luma);',
                                                                                                                                                                                                                                                                                                                                                                            'float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));',
                                                                                                                                                                                                                                                                                                                                                                            'float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));',
                                                                                                                                                                                                                                                                                                                                                                             'vec2 dir;',
                                                                                                                                                                                                                                                                                                                                                                            'dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));',
                                                                                                                                                                                                                                                                                                                                                                            'dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));',
                                                                                                                                                                                                                                                                                                                                                                             'float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);',
                                                                                                                                                                                                                                                                                                                                                                            'float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);',
                                                                                                                                                                                                                                                                                                                                                                             'dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) * inverseVP;',
                                                                                                                                                                                                                                                                                                                                                                             'vec3 rgbA = 0.5 * (texture2D(tex, fragCoord.xy * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +',
                                                                                                                                                                                                                                                                                                                                                                                               'texture2D(tex, fragCoord.xy * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);',
                                                                                                                                                                                                                                                                                                                                                                             'vec3 rgbB = rgbA * 0.5 + 0.25 * (texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +',
                                                                                                                                                                                                                                                                                                                                                                                                             'texture2D(tex, fragCoord.xy * inverseVP + dir * 0.5).xyz);',
                                                                                                                                                                                                                                                                                                                                                                             'float lumaB = dot(rgbB, luma);',
                                                                                                                                                                                                                                                                                                                                                                            'if ((lumaB < lumaMin) || (lumaB > lumaMax))',
                                                                                                                                                                                                                                                                                                                                                                                'return vec4(rgbA, 1.0);',
                                                                                                                                                                                                                                                                                                                                                                            'else',
                                                                                                                                                                                                                                                                                                                                                                                'return vec4(rgbB, 1.0);',
                                                                                                                                                                                                                                                                                                                                                                        '}',
                                                                                                                                                                                                                                                                                                                                                                         'uniform sampler2D fbo_texture;',
                                                                                                                                                                                                                                                                                                                                                                        'varying vec2 f_texcoord;',
                                                                                                                                                                                                                                                                                                                                                                        'void main(void) {',
                                                                                                                                                                                                                                                                                                                                                                            'gl_FragColor = applyFXAA(f_texcoord, fbo_texture, vec2(500.0, 500.0));',
                                                                                                                                                                                                                                                                                                                                                                        '}'
                                                                                                                                                                                                                                                                                                                                                                       ]);
                                                                                                                                                                                                                                                                                                                                                                       */
['#define fxaaTexture2D(t, p, o, r) texture2D(t, p + (o * r), 0.0)', '#define fxaaSat(x) clamp(x, 0.0, 1.0)', '#define FXAA_QUALITY_PS 8', '#define FXAA_QUALITY_P0 1.0', '#define FXAA_QUALITY_P1 1.5', '#define FXAA_QUALITY_P2 2.0', '#define FXAA_QUALITY_P3 2.0', '#define FXAA_QUALITY_P4 2.0', '#define FXAA_QUALITY_P5 2.0', '#define FXAA_QUALITY_P6 4.0', '#define FXAA_QUALITY_P7 12.0', 'vec4 fxaa(vec2 pos, sampler2D tex, vec2 resolution,', 'float subpixQuality, float edgeThreshold, float edgeThresholdMin) {', 'vec2 posM;', 'posM.x = pos.x;', 'posM.y = pos.y;', 'vec4 rgbyM = texture2D(tex, posM);', 'vec3 luma = vec3(0.299, 0.587, 0.114);', 'float lumaM = dot(rgbyM.xyz, luma);', 'float lumaS = dot(fxaaTexture2D(tex, posM, vec2(0, 1), resolution.xy).xyz, luma);', 'float lumaE = dot(fxaaTexture2D(tex, posM, vec2(1, 0), resolution.xy).xyz, luma);', 'float lumaN = dot(fxaaTexture2D(tex, posM, vec2(0, -1), resolution.xy).xyz, luma);', 'float lumaW = dot(fxaaTexture2D(tex, posM, vec2(-1, 0), resolution.xy).xyz, luma);', 'float maxSM = max(lumaS, lumaM);', 'float minSM = min(lumaS, lumaM);', 'float maxESM = max(lumaE, maxSM);', 'float minESM = min(lumaE, minSM);', 'float maxWN = max(lumaN, lumaW);', 'float minWN = min(lumaN, lumaW);', 'float rangeMax = max(maxWN, maxESM);', 'float rangeMin = min(minWN, minESM);', 'float rangeMaxScaled = rangeMax * edgeThreshold;', 'float range = rangeMax - rangeMin;', 'float rangeMaxClamped = max(edgeThresholdMin, rangeMaxScaled);', 'bool earlyExit = range < rangeMaxClamped;', '// maybe return rgbyM -> leave unchanged', 'if(earlyExit) return rgbyM;', 'float lumaNW = dot(fxaaTexture2D(tex, posM, vec2(-1, -1), resolution.xy).xyz, luma);', 'float lumaSE = dot(fxaaTexture2D(tex, posM, vec2(1, 1), resolution.xy).xyz, luma);', 'float lumaNE = dot(fxaaTexture2D(tex, posM, vec2(1, -1), resolution.xy).xyz, luma);', 'float lumaSW = dot(fxaaTexture2D(tex, posM, vec2(-1, 1), resolution.xy).xyz, luma);', 'float lumaNS = lumaN + lumaS;', 'float lumaWE = lumaW + lumaE;', 'float subpixRcpRange = 1.0 / range;', 'float subpixNSWE = lumaNS + lumaWE;', 'float edgeHorz1 = (-2.0 * lumaM) + lumaNS;', 'float edgeVert1 = (-2.0 * lumaM) + lumaWE;', 'float lumaNESE = lumaNE + lumaSE;', 'float lumaNWNE = lumaNW + lumaNE;', 'float edgeHorz2 = (-2.0 * lumaE) + lumaNESE;', 'float edgeVert2 = (-2.0 * lumaN) + lumaNWNE;', 'float lumaNWSW = lumaNW + lumaSW;', 'float lumaSWSE = lumaSW + lumaSE;', 'float edgeHorz4 = (abs(edgeHorz1) * 2.0) + abs(edgeHorz2);', 'float edgeVert4 = (abs(edgeVert1) * 2.0) + abs(edgeVert2);', 'float edgeHorz3 = (-2.0 * lumaW) + lumaNWSW;', 'float edgeVert3 = (-2.0 * lumaS) + lumaSWSE;', 'float edgeHorz = abs(edgeHorz3) + edgeHorz4;', 'float edgeVert = abs(edgeVert3) + edgeVert4;', 'float subpixNWSWNESE = lumaNWSW + lumaNESE;', 'float lengthSign = resolution.x;', 'bool horzSpan = edgeHorz >= edgeVert;', 'float subpixA = subpixNSWE * 2.0 + subpixNWSWNESE;', 'if(!horzSpan) lumaN = lumaW;', 'if(!horzSpan) lumaS = lumaE;', 'if(horzSpan) lengthSign = resolution.y;', 'float subpixB = (subpixA * (1.0/12.0)) - lumaM;', 'float gradientN = lumaN - lumaM;', 'float gradientS = lumaS - lumaM;', 'float lumaNN = lumaN + lumaM;', 'float lumaSS = lumaS + lumaM;', 'bool pairN = abs(gradientN) >= abs(gradientS);', 'float gradient = max(abs(gradientN), abs(gradientS));', 'if(pairN) lengthSign = -lengthSign;', 'float subpixC = fxaaSat(abs(subpixB) * subpixRcpRange);', 'vec2 posB;', 'posB.x = posM.x;', 'posB.y = posM.y;', 'vec2 offNP;', 'offNP.x = (!horzSpan) ? 0.0 : resolution.x;', 'offNP.y = ( horzSpan) ? 0.0 : resolution.y;', 'if(!horzSpan) posB.x += lengthSign * 0.5;', 'if( horzSpan) posB.y += lengthSign * 0.5;', 'vec2 posN;', 'posN.x = posB.x - offNP.x * FXAA_QUALITY_P0;', 'posN.y = posB.y - offNP.y * FXAA_QUALITY_P0;', 'vec2 posP;', 'posP.x = posB.x + offNP.x * FXAA_QUALITY_P0;', 'posP.y = posB.y + offNP.y * FXAA_QUALITY_P0;', 'float subpixD = ((-2.0)*subpixC) + 3.0;', 'float lumaEndN = texture2D(tex, posN).w;', 'float subpixE = subpixC * subpixC;', 'float lumaEndP = texture2D(tex, posP).w;', 'if(!pairN) lumaNN = lumaSS;', 'float gradientScaled = gradient * 1.0/4.0;', 'float lumaMM = lumaM - lumaNN * 0.5;', 'float subpixF = subpixD * subpixE;', 'bool lumaMLTZero = lumaMM < 0.0;', 'lumaEndN -= lumaNN * 0.5;', 'lumaEndP -= lumaNN * 0.5;', 'bool doneN = abs(lumaEndN) >= gradientScaled;', 'bool doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P1;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P1;', 'bool doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P1;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P1;', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P2;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P2;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P2;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P2;', '#if (FXAA_QUALITY_PS > 3)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P3;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P3;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P3;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P3;', '#if (FXAA_QUALITY_PS > 4)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P4;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P4;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P4;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P4;', '#if (FXAA_QUALITY_PS > 5)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P5;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P5;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P5;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P5;', '#if (FXAA_QUALITY_PS > 6)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P6;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P6;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P6;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P6;', '#if (FXAA_QUALITY_PS > 7)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P7;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P7;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P7;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P7;', '#if (FXAA_QUALITY_PS > 8)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P8;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P8;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P8;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P8;', '#if (FXAA_QUALITY_PS > 9)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P9;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P9;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P9;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P9;', '#if (FXAA_QUALITY_PS > 10)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P10;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P10;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P10;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P10;', '#if (FXAA_QUALITY_PS > 11)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P11;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P11;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P11;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P11;', '#if (FXAA_QUALITY_PS > 12)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P12;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P12;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P12;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P12;', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', 'float dstN = posM.x - posN.x;', 'float dstP = posP.x - posM.x;', 'if(!horzSpan) dstN = posM.y - posN.y;', 'if(!horzSpan) dstP = posP.y - posM.y;', 'bool goodSpanN = (lumaEndN < 0.0) != lumaMLTZero;', 'float spanLength = (dstP + dstN);', 'bool goodSpanP = (lumaEndP < 0.0) != lumaMLTZero;', 'float spanLengthRcp = 1.0 / spanLength;', 'bool directionN = dstN < dstP;', 'float dst = min(dstN, dstP);', 'bool goodSpan = directionN ? goodSpanN : goodSpanP;', 'float subpixG = subpixF * subpixF;', 'float pixelOffset = (dst * (-spanLengthRcp)) + 0.5;', 'float subpixH = subpixG * subpixQuality;', 'float pixelOffsetGood = goodSpan ? pixelOffset : 0.0;', 'float pixelOffsetSubpix = max(pixelOffsetGood, subpixH);', 'if(!horzSpan) posM.x += pixelOffsetSubpix * lengthSign;', 'if( horzSpan) posM.y += pixelOffsetSubpix * lengthSign;', '// maybe return vec4(texture2D(tex, posM).xyz, lumaM);', 'return texture2D(tex, posM);', '}', 'uniform sampler2D fbo_texture;', 'uniform vec2 resolution;', 'varying vec2 f_texcoord;', 'void main(void) {', 'gl_FragColor = fxaa(f_texcoord, fbo_texture, vec2(1.0 / resolution.x, 1.0 / resolution.y), 0.75, 0.166, 0.0833);', '}']);
/**
 * @class
 * An octree constructed using the point cloud.
 * @property {number} threshold - A threshold indicating whether or not a further subdivision is needed based on the number of data points in the current node.
 * @property {number} maxDepth - A maximum depth of the octree.
 * @property {Object} points - An object storing the points belonging to each node indexed by the location id of the node.
 * @property {Object} aabbs - An object storing the axis-aligned bounding boxes belonging to each node indexed by the location id of the node.
 * @constructor
 * @param {number} threshold - A threshold indicating whether or not a further subdivision is needed based on the number of data points in the current node.
 * @param {number} maxDepth - A maximum depth of the octree.
 */

Lore.Octree = function () {
    function Octree(threshold, maxDepth) {
        _classCallCheck(this, Octree);

        this.threshold = threshold || 500;
        this.maxDepth = maxDepth || 8;
        this.points = {};
        this.aabbs = {};

        this.offsets = [[-0.5, -0.5, -0.5], [-0.5, -0.5, +0.5], [-0.5, +0.5, -0.5], [-0.5, +0.5, +0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5]];
    }

    /**
     * Builds the octree by assigning the indices of data points and axis-aligned bounding boxes to assoziative arrays indexed by the location code.
     * @param {Uint32Array} pointIndices - An set of points that are either sub-divided into sub nodes or assigned to the current node.
     * @param {Float32Array} vertices - An array containing the positions of all the vertices.
     * @param {PLOTTER.AABB} aabb - The bounding box of the current node.
     * @param {number} locCode - A binary code encoding the id and the level of the current node.
     */


    _createClass(Octree, [{
        key: 'build',
        value: function build(pointIndices, vertices, aabb, locCode) {
            locCode = locCode || 1;

            // Set the location code of the axis-aligned bounding box
            aabb.setLocCode(locCode);

            // Store the axis aligned bounding box of this node
            // and set the points belonging to the node to null
            this.points[locCode] = null;
            this.aabbs[locCode] = aabb;

            // Check if this node reaches the maximum depth or the threshold
            var depth = this.getDepth(locCode);

            if (pointIndices.length <= this.threshold || depth >= this.maxDepth) {
                this.points[locCode] = new Uint32Array(pointIndices.length);
                for (var i = 0; i < pointIndices.length; i++) {
                    this.points[locCode][i] = pointIndices[i];
                }

                return true;
            }

            var childPointCounts = new Uint32Array(8);
            var codes = new Float32Array(pointIndices.length);

            for (var _i9 = 0; _i9 < pointIndices.length; _i9++) {
                // Points are indices to the vertices array
                // which stores x,y,z coordinates linear
                var _k5 = pointIndices[_i9] * 3;

                // Assign point to subtree, this gives a code
                // 000, 001, 010, 011, 100, 101, 110, 111
                // (-> 8 possible subtrees)
                if (vertices[_k5 + 0] >= aabb.center.components[0]) codes[_i9] |= 4;
                if (vertices[_k5 + 1] >= aabb.center.components[1]) codes[_i9] |= 2;
                if (vertices[_k5 + 2] >= aabb.center.components[2]) codes[_i9] |= 1;

                childPointCounts[codes[_i9]]++;
            }

            var nextPoints = new Array(8);
            var nextAabb = new Array(8);

            for (var _i10 = 0; _i10 < 8; _i10++) {
                if (childPointCounts[_i10] == 0) continue;
                nextPoints[_i10] = new Uint32Array(childPointCounts[_i10]);

                for (var _j9 = 0, _k6 = 0; _j9 < pointIndices.length; _j9++) {
                    if (codes[_j9] == _i10) {
                        nextPoints[_i10][_k6++] = pointIndices[_j9];
                    }
                }

                var o = this.offsets[_i10];
                var offset = new Lore.Vector3f(o[0], o[1], o[2]);
                offset.multiplyScalar(aabb.radius);
                nextAabb[_i10] = new Lore.AABB(aabb.center.clone().add(offset), 0.5 * aabb.radius);
            }

            for (var _i11 = 0; _i11 < 8; _i11++) {
                if (childPointCounts[_i11] == 0) {
                    continue;
                }

                var nextLocCode = this.generateLocCode(locCode, _i11);
                this.build(nextPoints[_i11], vertices, nextAabb[_i11], nextLocCode);
            }

            return this;
        }

        /**
         * Returns an array containing the location codes of all the axis-aligned
         * bounding boxes inside this octree.
         */

    }, {
        key: 'getLocCodes',
        value: function getLocCodes() {
            return Object.keys(this.aabbs);
        }

        /**
         * Calculates the depth of the node from its location code.
         * @param {number} locCode - A binary code encoding the id and the level of the current node.
         * @returns {number} The depth of the node with the provided location code.
         */

    }, {
        key: 'getDepth',
        value: function getDepth(locCode) {
            // If the msb is at position 6 (e.g. 1000000) the
            // depth is 2, since the locCode contains two nodes (2 x 3 bits)
            return Lore.Utils.msb(locCode) / 3;
        }

        /**
         * Generates a location code for a node based on the full code of the parent and the code of the current node.
         * @param {number} The full location code of the parent node.
         * @param {number} The 3 bit code of the current node.
         * @returns {number} The full location code for the current node.
         */

    }, {
        key: 'generateLocCode',
        value: function generateLocCode(parentCode, nodeCode) {
            // Insert the code of this new node, just before the msb (that is set to 1)
            // of the parents code
            var msb = Lore.Utils.msb(parentCode);

            if (msb == -1) {
                return nodeCode | 8;
            } else {
                // Left-shift the parent code by msb
                parentCode = parentCode <<= 3;
                // OR parent code with node code
                return parentCode | nodeCode;
            }
        }

        /**
         * The callback that is called when a node of the octree is visited.
         * @callback PLOTTER.Octree~traverseCallback
         * @param {Uint32Array} points - The points associated with the node.
         * @param {PLOTTER.AABB} aabb - The axis-aligned bounding box associated with the node.
         * @param {number} locCode - The location code of the node.
         */
        /**
         * Traverses the octree depth-first.
         * @param {PLOTTER.Octree~traverseCallback} traverseCallback - Is called for each node where a axis-aligned bounding box exists.
         * @param {number} locCode - The location code of the node that serves as the starting node for the traversion.
         */

    }, {
        key: 'traverse',
        value: function traverse(traverseCallback, locCode) {
            locCode = locCode || 1;

            for (var i = 0; i < 8; i++) {
                var next = locCode << 3 | i;

                // If it has an aabb, it exists
                if (this.aabbs[next]) {
                    traverseCallback(this.points[next], this.aabbs[next], next);
                    this.traverse(traverseCallback, next);
                }
            }
        }

        /**
         * The callback that is called when a node of the octree is visited which meets the condition.
         * @callback PLOTTER.Octree~traverseIfCallback
         * @param {Uint32Array} points - The points associated with the node.
         * @param {PLOTTER.AABB} aabb - The axis-aligned bounding box associated with the node.
         * @param {number} locCode - The location code of the node.
         */
        /**
         * The callback that is called to test a node.
         * @callback PLOTTER.Octree~conditionCallback
         * @param {PLOTTER.AABB} aabb - The axis-aligned bounding box associated with the node.
         * @param {number} locCode - The location code of the node.
         */
        /**
         * Traverses the octree depth-first, does not visit nodes / subtrees if a condition is not met.
         * @param {PLOTTER.Octree~traverseIfCallback} traverseIfCallback - Is called for each node where a axis-aligned bounding box exists and returns either true or false, with false stopping further exploration of the subtree.
         * @param {PLOTTER.Octree~conditionCallback} conditionCallback - Is called to test whether or not a subtree should be explored.
         * @param {number} locCode - The location code of the node that serves as the starting node for the traversion.
         */

    }, {
        key: 'traverseIf',
        value: function traverseIf(traverseIfCallback, conditionCallback, locCode) {
            locCode = locCode || 1;

            for (var i = 0; i < 8; i++) {
                var next = locCode << 3 | i;

                // If it has an aabb, it exists
                if (this.aabbs[next]) {
                    if (!conditionCallback(this.aabbs[next], next)) {
                        continue;
                    }

                    traverseIfCallback(this.points[next], this.aabbs[next], next);
                    this.traverseIf(traverseIfCallback, conditionCallback, next);
                }
            }
        }

        /**
         * Searches for octree nodes that are intersected by the ray and returns all the points associated with those nodes.
         * @param {Lore.Raycaster} raycaster - The raycaster used for checking for intersects.
         * @returns {Array} A set of points which are associated with octree nodes intersected by the ray.
         */

    }, {
        key: 'raySearch',
        value: function raySearch(raycaster) {
            var result = [];

            // Info: shouldn't be necessary any more
            // Always add the points from the root
            // The root has the location code 1
            // ... looks like it's still necessary
            if (this.points[1]) {
                for (var i = 0; i < this.points[1].length; i++) {
                    result.push({
                        index: this.points[1][i],
                        locCode: 1
                    });
                }
            }

            // Calculate the direction, and the percentage
            // of the direction, of the ray
            var dir = raycaster.ray.direction.clone();
            dir.normalize();

            var inverseDir = new Lore.Vector3f(1, 1, 1);
            inverseDir.divide(dir);

            this.traverseIf(function (points, aabb, locCode) {
                // If there is an aabb, that contains no points but only
                // nodes, skip here
                if (!points) {
                    return;
                }

                for (var _i12 = 0; _i12 < points.length; _i12++) {
                    result.push({
                        index: points[_i12],
                        locCode: locCode
                    });
                }
            }, function (aabb, locCode) {
                return aabb.cylinderTest(raycaster.ray.source, inverseDir, raycaster.far, raycaster.threshold);
            });

            return result;
        }

        /**
         * Returns an array containing all the centers of the axis-aligned bounding boxes
         * in this octree that have points associated with them.
         * @returns {Array} An array containing the centers as Lore.Vector3f objects.
         */

    }, {
        key: 'getCenters',
        value: function getCenters(threshold) {
            threshold = threshold || 0;
            var centers = new Array();

            this.traverse(function (points, aabb, next) {
                if (points && points.length > threshold) {
                    centers.push(aabb.center);
                }
            });

            return centers;
        }

        /**
         * This function returns the closest box in the octree to the point given as an argument.
         * @param {Lore.Vector3f} point - The point.
         * @param {number} threshold - The minimum number of points an axis-aligned bounding box should contain to count as a hit.
         * @param {number} locCode - The starting locCode, if not set, starts at the root.
         * @returns {Lore.AABB} The closest axis-aligned bounding box to the input point.
         */

    }, {
        key: 'getClosestBox',
        value: function getClosestBox(point, threshold, locCode) {
            locCode = locCode || 1;

            var closest = -1;
            var minDist = Number.MAX_VALUE;

            for (var i = 0; i < 8; i++) {
                var next = locCode << 3 | i;

                // If it has an aabb, it exists
                if (this.aabbs[next]) {
                    // Continue if under threshold
                    if (this.points[next] && this.points[next].length < threshold) {
                        continue;
                    }

                    var dist = this.aabbs[next].distanceToPointSq(point.components[0], point.components[1], point.components[2]);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = next;
                    }
                }
            }

            if (closest < 0) {
                return this.aabbs[locCode];
            } else {
                return this.getClosestBox(point, threshold, closest);
            }
        }

        /**
         * This function returns the closest box in the octree to the point given as an argument. The distance measured is to the
         * box center.
         * @param {Lore.Vector3f} point - The point.
         * @param {number} threshold - The minimum number of points an axis-aligned bounding box should contain to count as a hit.
         * @param {number} locCode - The starting locCode, if not set, starts at the root.
         * @returns {Lore.AABB} The closest axis-aligned bounding box to the input point.
         */

    }, {
        key: 'getClosestBoxFromCenter',
        value: function getClosestBoxFromCenter(point, threshold, locCode) {
            locCode = locCode || 1;

            var closest = -1;
            var minDist = Number.MAX_VALUE;

            for (var i = 0; i < 8; i++) {
                var next = locCode << 3 | i;

                // If it has an aabb, it exists
                if (this.aabbs[next]) {
                    // Continue if under threshold
                    if (this.points[next] && this.points[next].length < threshold) {
                        continue;
                    }

                    var dist = this.aabbs[next].distanceFromCenterToPointSq(point.components[0], point.components[1], point.components[2]);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = next;
                    }
                }
            }

            if (closest < 0) {
                return this.aabbs[locCode];
            } else {
                return this.getClosestBox(point, threshold, closest);
            }
        }

        /**
         * This function returns the farthest box in the octree to the point given as an argument.
         * @param {Lore.Vector3f} point - The point.
         * @param {number} threshold - The minimum number of points an axis-aligned bounding box should contain to count as a hit.
         * @param {number} locCode - The starting locCode, if not set, starts at the root.
         * @returns {Lore.AABB} The farthest axis-aligned bounding box to the input point.
         */

    }, {
        key: 'getFarthestBox',
        value: function getFarthestBox(point, threshold, locCode) {
            locCode = locCode || 1;

            var farthest = -1;
            var maxDist = Number.MIN_VALUE;

            for (var i = 0; i < 8; i++) {
                var next = locCode << 3 | i;

                // If it has an aabb, it exists
                if (this.aabbs[next]) {
                    // Continue if under threshold
                    if (this.points[next] && this.points[next].length < threshold) {
                        continue;
                    }

                    var dist = this.aabbs[next].distanceToPointSq(point.components[0], point.components[1], point.components[2]);
                    if (dist > maxDist) {
                        maxDist = dist;
                        farthest = next;
                    }
                }
            }

            if (farthest < 0) {
                return this.aabbs[locCode];
            } else {
                return this.getFarthestBox(point, threshold, farthest);
            }
        }

        /**
         * Finds the closest point inside the octree to the point provided as an argument.
         * @param {Lore.Vector3f} point - The point.
         * @param {Float32Array} - An array containing the positions of the points.
         * @param {number} threshold - Only consider points inside a axis-aligned bounding box with a minimum of [threshold] points.
         * @param {number} locCode - If specified, the axis-aligned bounding box in which the point is searched for. If not set, all boxes are searched.
         * @returns {Lore.Vector3f} The position of the closest point.
         */

    }, {
        key: 'getClosestPoint',
        value: function getClosestPoint(point, positions, threshold, locCode) {
            threshold = threshold || 0;
            var minDist = Number.MAX_VALUE;
            var result = null;

            var box = null;

            if (locCode) {
                box = this.aabbs[locCode];
            } else {
                box = this.getClosestBox(point, threshold);
            }

            var boxPoints = this.points[box.getLocCode()];

            // If the box does not contain any points
            if (!boxPoints) {
                return null;
            }

            for (var i = 0; i < boxPoints.length; i++) {
                var index = boxPoints[i];
                index *= 3;
                var x = positions[index];
                var y = positions[index + 1];
                var z = positions[index + 2];

                var pc = point.components;

                var distSq = Math.pow(pc[0] - x, 2) + Math.pow(pc[1] - y, 2) + Math.pow(pc[2] - z, 2);
                if (distSq < minDist) {
                    minDist = distSq;
                    result = {
                        x: x,
                        y: y,
                        z: z
                    };
                }
            }

            if (!result) {
                return null;
            }

            return new Lore.Vector3f(result.x, result.y, result.z);
        }

        /**
         * Finds the farthest point inside the octree to the point provided as an argument.
         * @param {Lore.Vector3f} point - The point.
         * @param {Float32Array} - An array containing the positions of the points.
         * @param {number} threshold - Only consider points inside a axis-aligned bounding box with a minimum of [threshold] points.
         * @param {number} locCode - If specified, the axis-aligned bounding box in which the point is searched for. If not set, all boxes are searched.
         * @returns {Lore.Vector3f} The position of the farthest point.
         */

    }, {
        key: 'getFarthestPoint',
        value: function getFarthestPoint(point, positions, threshold, locCode) {
            threshold = threshold || 0;
            var maxDist = Number.MIN_VALUE;
            var result = null;

            // Get farthest box
            var box = null;

            if (locCode) {
                box = this.aabbs[locCode];
            } else {
                box = this.getFArthestBox(point, threshold);
            }

            var boxPoints = this.points[box.getLocCode()];

            // If the box does not contain any points
            if (!boxPoints) {
                return null;
            }

            for (var i = 0; i < boxPoints.length; i++) {
                var index = boxPoints[i];
                index *= 3;
                var x = positions[index];
                var y = positions[index + 1];
                var z = positions[index + 2];

                var pc = point.components;

                var distSq = Math.pow(pc[0] - x, 2) + Math.pow(pc[1] - y, 2) + Math.pow(pc[2] - z, 2);
                if (distSq > maxDist) {
                    maxDist = distSq;
                    result = {
                        x: x,
                        y: y,
                        z: z
                    };
                }
            }

            if (!result) {
                return null;
            }

            return new Lore.Vector3f(result.x, result.y, result.z);
        }

        /**
         * Returns the parent of a given location code by simply shifting it to the right by tree, removing the current code.
         * @param {number} locCode - The location code of a node.
         */

    }, {
        key: 'getParent',
        value: function getParent(locCode) {
            return locCode >>> 3;
        }

        /**
         * Find neighbouring axis-aligned bounding boxes.
         * @param {number} locCode - The location code of the axis-aligned bounding box whose neighbours will be returned
         * @returns {Array} An array of location codes of the neighbouring axis-aligned bounding boxes.
         */

    }, {
        key: 'getNeighbours',
        value: function getNeighbours(locCode) {
            var self = this;
            var locCodes = new Array();

            this.traverseIf(function (points, aabbs, code) {
                if (points && points.length > 0 && code != locCode) {
                    locCodes.push(code);
                }
            }, function (aabb, code) {
                // Exit branch if this node is not a neighbour
                return aabb.testAABB(self.aabbs[locCode]);
            });

            return locCodes;
        }

        /**
         * The callback that is called when the nearest neighbours have been found.
         * @callback PLOTTER.Plot~kNNCallback
         * @param {Uint32Array} e - An array containing containing the k-nearest neighbours ordered by distance (ascending).
         */
        /**
         * Returns the k-nearest neighbours of a vertex.
         * @param {number} k - The number of nearest neighbours to return.
         * @param {number} point - The index of a vertex or a vertex.
         * @param {number} locCode - The location code of the axis-aligned bounding box containing the vertex. If not set, the box is searched for.
         * @param {Float32Array} positions - The position information for the points indexed in this octree.
         * @param {PLOTTER.Plot~kNNCallback} kNNCallback - The callback that is called after the k-nearest neighbour search has finished.
         */

    }, {
        key: 'kNearestNeighbours',
        value: function kNearestNeighbours(k, point, locCode, positions, kNNCallback) {
            k += 1; // Account for the fact, that the point itself should be returned as well.
            var length = positions / 3;
            var p = point;

            if (!isNaN(parseFloat(point))) {
                var _p = {
                    x: positions[_p * 3],
                    y: positions[_p * 3 + 1],
                    z: positions[_p * 3 + 2]
                };
            }

            if (locCode === null) {
                locCode = this.getClosestBoxFromCenter(new Lore.Vector3f(p.x, p.y, p.z), 0).locCode;
            }

            // Calculte the distances to the other cells
            var cellDistances = this.getCellDistancesToPoint(p.x, p.y, p.z, locCode);

            // Calculte the distances to the other points in the same cell
            var pointDistances = this.pointDistancesSq(p.x, p.y, p.z, locCode, positions);

            // Sort the indices according to distance
            var radixSort = new RadixSort();
            var sortedPointDistances = radixSort.sort(pointDistances.distancesSq, true);

            // Sort the neighbours according to distance
            var sortedCellDistances = radixSort.sort(cellDistances.distancesSq, true);

            // Since the closest points always stay the closest points event when adding
            // the points of another cell, instead of resizing the array, just define
            // an offset
            var pointOffset = 0;

            // Get all the neighbours from this cell that are closer than the nereast box
            var indexCount = 0;
            var indices = new Uint32Array(k);
            console.log(sortedPointDistances, sortedCellDistances);
            for (var i = 0; indexCount < k && i < sortedPointDistances.array.length; i++) {
                // Break if closest neighbouring cell is closer than the closest remaining point
                if (sortedPointDistances.array[i] > sortedCellDistances.array[0]) {
                    // Set the offset to the most distant closest member
                    pointOffset = i;
                    break;
                }

                indices[i] = pointDistances.indices[sortedPointDistances.indices[i]];
                indexCount++;
            }

            // If enough neighbours have been found in the same cell, no need to continue
            if (indexCount == k) {
                return indices;
            }

            for (var _i13 = 0; _i13 < sortedCellDistances.array.length; _i13++) {
                // Get the points from the cell and merge them with the already found ones
                var _locCode = cellDistances.locCodes[sortedCellDistances.indices[_i13]];
                var newPointDistances = this.pointDistancesSq(p.x, p.y, p.z, _locCode, positions);

                pointDistances = Lore.Octree.mergePointDistances(pointDistances, newPointDistances);

                // Sort the merged points
                var sortedNewPointDistances = radixSort.sort(pointDistances.distancesSq, true);

                for (var _j10 = pointOffset; indexCount < k && _j10 < sortedNewPointDistances.array.length; _j10++) {
                    if (sortedNewPointDistances.array[_j10] > sortedCellDistances.array[_i13 + 1]) {
                        pointOffset = _j10;
                        break;
                    }

                    indices[_j10] = pointDistances.indices[sortedNewPointDistances.indices[_j10]];
                    indexCount++;
                }

                if (indexCount == k || indexCount >= length - 1) {
                    // kNNCallback(indices);
                    return indices;
                }
            }

            //kNNCallback(indices);
            return indices;
        }

        /**
         * Calculates the distances from a given point to all of the cells containing points
         * @param {number} x - The x-value of the coordinate.
         * @param {number} y - The y-value of the coordinate.
         * @param {number} z - The z-value of the coordinate.
         * @param {number} locCode - The location code of the cell containing the point.
         * @returns {Object} An object containing arrays for the locCodes and the squred distances.
         */

    }, {
        key: 'getCellDistancesToPoint',
        value: function getCellDistancesToPoint(x, y, z, locCode) {
            var locCodes = new Array();

            this.traverse(function (points, aabb, code) {
                if (points && points.length > 0 && code != locCode) {
                    locCodes.push(code);
                }
            });

            var dists = new Float32Array(locCodes.length);
            for (var i = 0; i < locCodes.length; i++) {
                dists[i] = this.aabbs[locCodes[i]].distanceToPointSq(x, y, z);
            }

            return {
                locCodes: locCodes,
                distancesSq: dists
            };
        }

        /**
         * Expands the current neighbourhood around the cell where the point specified by x, y, z is in.
         * @param {number} x - The x-value of the coordinate.
         * @param {number} y - The y-value of the coordinate.
         * @param {number} z - The z-value of the coordinate.
         * @param {number} locCode - The location code of the cell containing the point.
         * @param {Object} cellDistances - The object containing location codes and distances.
         * @returns {number} The number of added location codes.
         */

    }, {
        key: 'expandNeighbourhood',
        value: function expandNeighbourhood(x, y, z, locCode, cellDistances) {
            var locCodes = cellDistances.locCodes;
            var distancesSq = cellDistances.distancesSq;
            var length = locCodes.length;

            for (var i = length - 1; i >= 0; i--) {
                var neighbours = this.getNeighbours(locCodes[i]);

                for (var _j11 = 0; _j11 < neighbours.length; _j11++) {
                    if (neighbours[_j11] == locCode) {
                        // console.log(locCode);
                    }

                    if (neighbours[_j11] != locCode && !Lore.Utils.arrayContains(locCodes, neighbours[_j11])) {
                        locCodes.push(neighbours[_j11]);
                    }
                }
            }

            // Update the distances
            var l1 = locCodes.length;
            var l2 = distancesSq.length;

            if (l1 == l2) {
                return;
            }

            var dists = new Float32Array(l1 - l2);

            for (var _i14 = l2, c = 0; _i14 < l1; _i14++, c++) {
                dists[c] = this.aabbs[locCodes[_i14]].distanceToPointSq(x, y, z);
            }

            cellDistances.distancesSq = Lore.Utils.concatTypedArrays(distancesSq, dists);

            return locCodes.length - length;
        }

        /**
         * Returns a list of the cells neighbouring the cell with the provided locCode and the point specified by x, y and z.
         * @param {number} x - The x-value of the coordinate.
         * @param {number} y - The y-value of the coordinate.
         * @param {number} z - The z-value of the coordinate.
         * @param {number} locCode - The number of the axis-aligned bounding box.
         * @returns {Object} An object containing arrays for the locCodes and the squred distances.
         */

    }, {
        key: 'cellDistancesSq',
        value: function cellDistancesSq(x, y, z, locCode) {
            var locCodes = this.getNeighbours(locCode);

            var dists = new Float32Array(locCodes.length);

            for (var i = 0; i < locCodes.length; i++) {
                dists[i] = this.aabbs[locCodes[i]].distanceToPointSq(x, y, z);
            }

            return {
                locCodes: locCodes,
                distancesSq: dists
            };
        }

        /**
         * Returns a list of the the squared distances of the points contained in the axis-aligned bounding box to the provided coordinates.
         * @param {number} x - The x-value of the coordinate.
         * @param {number} y - The y-value of the coordinate.
         * @param {number} z - The z-value of the coordinate.
         * @param {number} locCode - The number of the axis-aligned bounding box.
         * @param {Float32Array} positions - The array containing the vertex coordinates.
         * @returns {Object} An object containing arrays for the indices and distances.
         */

    }, {
        key: 'pointDistancesSq',
        value: function pointDistancesSq(x, y, z, locCode, positions) {
            var points = this.points[locCode];
            var indices = new Uint32Array(points.length);
            var dists = new Float32Array(points.length);

            for (var i = 0; i < points.length; i++) {
                var index = points[i] * 3;
                var x2 = positions[index];
                var y2 = positions[index + 1];
                var z2 = positions[index + 2];

                indices[i] = points[i];
                dists[i] = Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2) + Math.pow(z2 - z, 2);
            }
            return {
                indices: indices,
                distancesSq: dists
            };
        }

        /**
         * Concatenates the two typed arrays a and b and returns a new array. The two arrays have to be of the same type.
         * Due to performance reasons, there is no check whether the types match.
         * @param {Array} a - The first array.
         * @param {Array} b - The second array.
         * @returns {Array} The concatenated array.
         */

    }], [{
        key: 'concatTypedArrays',
        value: function concatTypedArrays(a, b) {
            var c = new a.constructor(a.length + b.length);

            c.set(a);
            c.set(b, a.length);

            return c;
        }

        /**
         * Merges the two arrays (indices and distancesSq) in the point distances object.
         * @param {Object} a - The first point distances object.
         * @param {Object} b - The second point distances object.
         * @returns {Object} The concatenated point distances object.
         */

    }, {
        key: 'mergePointDistances',
        value: function mergePointDistances(a, b) {
            var newObj = {};

            newObj.indices = Lore.Octree.concatTypedArrays(a.indices, b.indices);
            newObj.distancesSq = Lore.Octree.concatTypedArrays(a.distancesSq, b.distancesSq);

            return newObj;
        }

        /**
         * Merges the two arrays (locCodes and distancesSq) in the cell distances object.
         * @param {Object} a - The first cell distances object.
         * @param {Object} b - The second cell distances object.
         * @returns {Object} The concatenated cell distances object.
         */

    }, {
        key: 'mergeCellDistances',
        value: function mergeCellDistances(a, b) {
            var newObj = {};

            newObj.locCodes = Lore.Octree.concatTypedArrays(a.locCodes, b.locCodes);
            newObj.distancesSq = Lore.Octree.concatTypedArrays(a.distancesSq, b.distancesSq);

            return newObj;
        }

        /**
         * Clones an octree.
         * @param {Lore.Octree} original - The octree to be cloned.
         * @returns {Lore.Octree} The cloned octree.
         */

    }, {
        key: 'clone',
        value: function clone(original) {
            var clone = new Lore.Octree();

            clone.threshold = original.threshold;
            clone.maxDepth = original.maxDepth;
            clone.points = original.points;

            for (var property in original.aabbs) {
                if (original.aabbs.hasOwnProperty(property)) {
                    clone.aabbs[property] = Lore.AABB.clone(original.aabbs[property]);
                }
            }

            return clone;
        }
    }]);

    return Octree;
}();

/**
* @class
* Axis-aligned bounding boxes with the constraint that they are cubes with equal sides.
* @property {Lore.Vector3f} center - The center of this axis-aligned bounding box.
* @property {number} radius - The radius of this axis-aligned bounding box.
* @property {number} locCode - The location code of this axis-aligned bounding box in the octree.
* @property {number} left - The distance of the left plane to the world ZY plane.
* @property {number} right - The distance of the right plane to the world ZY plane.
* @property {number} back - The distance of the back plane to the world XY plane.
* @property {number} front - The distance of the front plane to the world XY plane.
* @property {number} bottom - The distance of the bottom plane to the world XZ plane.
* @property {number} top - The distance of the top plane to the world XZ plane.
* @property {Array} neighbours - The neighbours of this axis-aligned bounding box in an an octree.
* @property {Float32Array} min - An array specifying the minimum corner point (x, y, z) of the axis-aligned bounding box.
* @property {Float32Array} max - An array specifying the maximum corner point (x, y, z) of the axis-aligned bounding box.
* @constructor
* @param {Lore.Vector3f} center - A radius for this axis-aligned bounding box.
* @param {number} radius - A radius for this axis-aligned bounding box.
*/
Lore.AABB = function () {
    function AABB(center, radius) {
        _classCallCheck(this, AABB);

        this.center = center || new Lore.Vector3f();
        this.radius = radius || 0;
        this.locCode = 0;
        this.left = 0;
        this.right = 0;
        this.back = 0;
        this.front = 0;
        this.bottom = 0;
        this.top = 0;
        this.neighbours = new Array(6);
        this.min = new Float32Array(3);
        this.max = new Float32Array(3);

        this.updateDimensions();
    }

    /**
     * Calculates the distance of the axis-aligned bounding box's planes to the world planes.
     */


    _createClass(AABB, [{
        key: 'updateDimensions',
        value: function updateDimensions() {
            var cx = this.center.components[0];
            var cy = this.center.components[1];
            var cz = this.center.components[2];

            this.min[0] = cx - this.radius;
            this.min[1] = cy - this.radius;
            this.min[2] = cz - this.radius;
            this.max[0] = cx + this.radius;
            this.max[1] = cy + this.radius;
            this.max[2] = cz + this.radius;

            // Precalculate to simplify ray test
            this.left = cx - this.radius;
            this.right = cx + this.radius;
            this.back = cz - this.radius;
            this.front = cz + this.radius;
            this.bottom = cy - this.radius;
            this.top = cy + this.radius;

            return this;
        }

        /**
         * Sets the location code of this axis-aligned bounding box.
         * @param {number} locCode - The location code.
         */

    }, {
        key: 'setLocCode',
        value: function setLocCode(locCode) {
            this.locCode = locCode;

            return this;
        }

        /**
         * Gets the location code of this axis-aligned bounding box.
         * @returns {number} The location code.
         */

    }, {
        key: 'getLocCode',
        value: function getLocCode() {
            return this.locCode;
        }

        /**
         * Tests whether or not this axis-aligned bounding box is intersected by a ray.
         * @param {Lore.Vector3f} source - The source of the ray.
         * @param {Lore.Vector3f} dir - A normalized vector of the direction of the ray.
         * @param {number} dist - The maximum distance from the source that still counts as an intersect (the far property of the Lore.Raycaster object).
         * @returns {boolean} - Whether or not there is an intersect.
         */

    }, {
        key: 'rayTest',
        value: function rayTest(source, inverseDir, dist) {
            // dir is the precomputed inverse of the direction of the ray,
            // this means that the costly divisions can be omitted
            var oc = source.components;
            var ic = inverseDir.components;

            var t0 = (this.left - oc[0]) * ic[0];
            var t1 = (this.right - oc[0]) * ic[0];
            var t2 = (this.bottom - oc[1]) * ic[1];
            var t3 = (this.top - oc[1]) * ic[1];
            var t4 = (this.back - oc[2]) * ic[2];
            var t5 = (this.front - oc[2]) * ic[2];

            var maxT = Math.min(Math.max(t0, t1), Math.max(t2, t3), Math.max(t4, t5));

            // Ray intersects in reverse direction, which means
            // that the box is behind the camera
            if (maxT < 0) {
                return false;
            }

            var minT = Math.max(Math.min(t0, t1), Math.min(t2, t3), Math.min(t4, t5));

            if (minT > maxT || minT > dist) {
                return false;
            }

            // Intersection happens when minT is larger or equal to maxT
            // and minT is smaller than the distance (distance == radius == ray.far)
            return true;
        }

        /**
         * Tests whether or not this axis-aligned bounding box is intersected by a cylinder. CAUTION: If this runs multi-threaded, it might fail.
         * @param {Lore.Vector3f} source - The source of the ray.
         * @param {Lore.Vector3f} dir - A normalized vector of the direction of the ray.
         * @param {number} dist - The maximum distance from the source that still counts as an intersect (the far property of the Lore.Raycaster object).
         * @param {number} radius - The radius of the cylinder
         * @returns {boolean} - Whether or not there is an intersect.
         */

    }, {
        key: 'cylinderTest',
        value: function cylinderTest(source, inverseDir, dist, radius) {
            // Instead of testing an actual cylinder against this aabb, we simply
            // expand the radius of the box temporarily.
            this.radius += radius;
            this.updateDimensions();

            // Do the normal ray intersection test
            var result = this.rayTest(source, inverseDir, dist);

            this.radius -= radius;
            this.updateDimensions();

            return result;
        }

        /**
         * Returns the square distance of this axis-aligned bounding box to the point supplied as an argument.
         * @param {number} x - The x component of the point coordinate.
         * @param {number} y - The y component of the point coordinate.
         * @param {number} z - The z component of the point coordinate.
         * @returns {number} The square distance of this axis-aligned bounding box to the input point.
         */

    }, {
        key: 'distanceToPointSq',
        value: function distanceToPointSq(x, y, z) {
            // From book, real time collision detection
            var sqDist = 0;
            var p = [x, y, z];
            // Add the distances for each axis
            for (var i = 0; i < 3; i++) {
                if (p[i] < this.min[i]) sqDist += Math.pow(this.min[i] - p[i], 2);
                if (p[i] > this.max[i]) sqDist += Math.pow(p[i] - this.max[i], 2);
            }

            return sqDist;
        }

        /**
         * Returns the box that is closest to the point (measured from center).
         * @param {number} x - The x component of the point coordinate.
         * @param {number} y - The y component of the point coordinate.
         * @param {number} z - The z component of the point coordinate.
         * @returns {number} The square distance of this axis-aligned bounding box to the input point.
         */

    }, {
        key: 'distanceFromCenterToPointSq',
        value: function distanceFromCenterToPointSq(x, y, z) {
            var center = this.center.components;

            return Math.pow(center[0] - x, 2) + Math.pow(center[1] - y, 2) + Math.pow(center[2] - z, 2);
        }

        /**
         * Tests whether or not this axis-aligned bounding box overlaps or shares an edge or a vertex with another axis-aligned bounding box.
         * This method can also be used to assert whether or not two boxes are neighbours.
         * @param {Lore.AABB} aabb - The axis-aligned bounding box to test against.
         * @returns {boolean} - Whether or not there is an overlap.
         */

    }, {
        key: 'testAABB',
        value: function testAABB(aabb) {
            for (var i = 0; i < 3; i++) {
                if (this.max[i] < aabb.min[i] || this.min[i] > aabb.max[i]) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Creates a axis-aligned bounding box surrounding a set of vertices.
         * @param {Uint32Array} vertices - The vertices which will all be inside the axis-aligned bounding box.
         * @returns {Lore.AABB} An axis-aligned bounding box surrounding the vertices.
         */

    }], [{
        key: 'fromPoints',
        value: function fromPoints(vertices) {
            var x = vertices[0];
            var y = vertices[1];
            var z = vertices[2];

            var min = new Lore.Vector3f(x, y, z);
            var max = new Lore.Vector3f(x, y, z);

            var minc = min.components;
            var maxc = max.components;

            for (var i = 1; i < vertices.length / 3; i++) {
                if (vertices[i * 3 + 0] < minc[0]) minc[0] = vertices[i * 3 + 0];
                if (vertices[i * 3 + 1] < minc[1]) minc[1] = vertices[i * 3 + 1];
                if (vertices[i * 3 + 2] < minc[2]) minc[2] = vertices[i * 3 + 2];
                if (vertices[i * 3 + 0] > maxc[0]) maxc[0] = vertices[i * 3 + 0];
                if (vertices[i * 3 + 1] > maxc[1]) maxc[1] = vertices[i * 3 + 1];
                if (vertices[i * 3 + 2] > maxc[2]) maxc[2] = vertices[i * 3 + 2];
            }

            // Calculate the radius in each direction
            var radii = new Lore.Vector3f.subtract(max, min);
            radii.multiplyScalar(0.5);

            var rx = radii.components[0];
            var ry = radii.components[1];
            var rz = radii.components[2];

            var center = new Lore.Vector3f(rx, ry, rz);
            center.add(min);
            // Since the octree always stores cubes, there is of course only
            // one radius - take the biggest one
            var radius = Math.max(rx, ry, rz);

            return new Lore.AABB(center, radius);
        }
    }, {
        key: 'getCorners',
        value: function getCorners(aabb) {
            var c = aabb.center.components;
            var x = c[0];
            var y = c[1];
            var z = c[2];
            var r = aabb.radius;

            return [[x - r, y - r, z - r], [x - r, y - r, z + r], [x - r, y + r, z - r], [x - r, y + r, z + r], [x + r, y - r, z - r], [x + r, y - r, z + r], [x + r, y + r, z - r], [x + r, y + r, z + r]];
        }

        /**
         * Clones an axis-aligned bounding box.
         * @param {Lore.AABB} original - The axis-aligned bounding box to be cloned.
         * @returns {Lore.AABB} The cloned axis-aligned bounding box.
         */

    }, {
        key: 'clone',
        value: function clone(original) {
            var clone = new Lore.AABB();
            clone.back = original.back;
            clone.bottom = original.bottom;
            clone.center = new Lore.Vector3f(original.center.components[0], original.center.components[1], original.center.components[2]);
            clone.front = original.front;
            clone.left = original.left;
            clone.locCode = original.locCode;
            clone.max = original.max;
            clone.min = original.min;
            clone.radius = original.radius;
            clone.right = original.right;
            clone.top = original.top;

            return clone;
        }
    }]);

    return AABB;
}();

Lore.Raycaster = function () {
    function Raycaster() {
        _classCallCheck(this, Raycaster);

        this.ray = new Lore.Ray();
        this.near = 0;
        this.far = 1000;
        this.threshold = 0.1;
    }

    _createClass(Raycaster, [{
        key: 'set',
        value: function set(camera, mouseX, mouseY) {
            this.near = camera.near;
            this.far = camera.far;

            this.ray.source.set(mouseX, mouseY, (camera.near + camera.far) / (camera.near - camera.far));
            this.ray.source.unproject(camera);

            this.ray.direction.set(0.0, 0.0, -1.0);
            this.ray.direction.toDirection(camera.modelMatrix);

            return this;
        }
    }]);

    return Raycaster;
}();

Lore.UI = function (renderCanvas) {
    this.canvas = document.createElement('canvas');
    this.renderCanvasElement = document.getElementById(renderCanvas);

    this.init();
    this.resize();
};

Lore.UI.prototype = {
    constructor: Lore.UI,

    init: function init() {
        this.canvas.style.cssText = 'position: absolute; pointer-events: none;';

        // Append the UI canvas before the render canvas
        this.renderCanvasElement.parentNode.insertBefore(this.canvas, this.renderCanvasElement);
    },

    setWidth: function setWidth(value) {
        this.canvas.width = value;
    },

    setHeight: function setHeight(value) {
        this.canvas.height = value;
    },

    setTop: function setTop(value) {
        this.canvas.style.top = value;
    },

    setLeft: function setLeft(value) {
        this.canvas.style.left = value;
    },

    resize: function resize() {
        this.setWidth(this.renderCanvasElement.width);
        this.setHeight(this.renderCanvasElement.height);
        this.setTop(this.renderCanvasElement.offsetTop);
        this.setLeft(this.renderCanvasElement.offsetLeft);
    }
};