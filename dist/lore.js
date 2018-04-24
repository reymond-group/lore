'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Lore namespace.
 * @typicalname Lore
 */
var Lore = {
    Version: '1.0.6'
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

    // Lore.getGrakaInfo(canvas);

    var cc = Lore.Color.fromHex(this.opts.clearColor);

    var renderer = new Lore.Renderer(canvas, {
        clearColor: cc,
        verbose: true,
        fps: document.getElementById('fps'),
        center: new Lore.Vector3f(125, 125, 125),
        antialiasing: this.opts.antialiasing
    });

    renderer.controls.limitRotationToHorizon(this.opts.limitRotationToHorizon);

    renderer.render = function (camera, geometries) {
        for (var key in geometries) {
            geometries[key].draw(renderer);
        }
    };

    return renderer;
};

Lore.getGrakaInfo = function (targetId) {
    var canvas = document.getElementById(targetId);
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    var info = {
        renderer: '',
        vendor: ''
    };

    var dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');

    if (dbgRenderInfo != null) {
        info.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
        info.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
    }

    return info;
};

Lore.supportsHighQuality = function (targetId) {
    var info = Lore.getGrakaInfo(targetId);

    return false;
};

Lore.defaults = {
    clearColor: '#121212',
    limitRotationToHorizon: false,
    antialiasing: false
};

/** A map mapping draw modes as strings to their GLInt representations. */
Lore.DrawModes = {
    points: 0,
    lines: 1,
    lineStrip: 2,
    lineLoop: 3,
    triangles: 4,
    traingleStrip: 5,
    triangleFan: 6

    /** 
     * A class representing a Color. 
     * 
     * @property {Float32Array} components A typed array storing the components of this color (rgba).
     */
};Lore.Color = function () {
    /**
     * Creates an instance of Color.
     * @param {Number} r The red component (0.0 - 1.0).
     * @param {Number} g The green component (0.0 - 1.0).
     * @param {Number} b The blue component (0.0 - 1.0).
     * @param {Number} a The alpha component (0.0 - 1.0).
     */
    function Color(r, g, b, a) {
        _classCallCheck(this, Color);

        if (arguments.length === 1) {
            this.components = new Float32Array(r);
        } else {
            this.components = new Float32Array(4);
            this.components[0] = r || 0.0;
            this.components[1] = g || 0.0;
            this.components[2] = b || 0.0;
            this.components[3] = a || 1.0;
        }
    }

    /**
     * Set the red, green, blue and alpha components of the color.
     * 
     * @param {Number} r The red component (0.0 - 1.0).
     * @param {Number} g The green component (0.0 - 1.0).
     * @param {Number} b The blue component (0.0 - 1.0).
     * @param {Number} a The alpha component (0.0 - 1.0).
     * @returns {Lore.Color} Returns itself.
     */


    _createClass(Color, [{
        key: 'set',
        value: function set(r, g, b, a) {
            this.components[0] = r;
            this.components[1] = g;
            this.components[2] = b;

            if (arguments.length == 4) {
                this.components[3] = a;
            }

            return this;
        }

        /**
         * Set the r,g,b,a components from a hex string.
         * 
         * @static
         * @param {String} hex A hex string in the form of #ABCDEF or #ABC.
         * @returns {Lore.Color} A color representing the hex string.
         */

    }], [{
        key: 'fromHex',
        value: function fromHex(hex) {
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
        }

        /**
         * Get the r, g or b value from a hue component.
         * 
         * @static
         * @param {Number} p 
         * @param {Number} q 
         * @param {Number} t 
         * @returns {Number} The r, g or b component value.
         */

    }, {
        key: 'hueToRgb',
        value: function hueToRgb(p, q, t) {
            if (t < 0) {
                t += 1;
            } else if (t > 1) {
                t -= 1;
            } else if (t < 0.1667) {
                return p + (q - p) * 6 * t;
            } else if (t < 0.5) {
                return q;
            } else if (t < 0.6667) {
                return p + (q - p) * (0.6667 - t) * 6;
            }

            return p;
        }

        /**
         * Converts HSL to RGB.
         * 
         * @static
         * @param {Number} h The hue component.
         * @param {Number} s The saturation component.
         * @param {Number} l The lightness component.
         * @returns {Number[]} An array containing the r, g and b values ([r, g, b]).
         */

    }, {
        key: 'hslToRgb',
        value: function hslToRgb(h, s, l) {
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
        }

        /**
         * Converts HSL to RGB.
         * 
         * @static
         * @param {Number} h The hue component.
         * @param {Number} s The saturation component.
         * @param {Number} l The lightness component.
         * @returns {String} A hex string representing the color (#RRGGBB).
         */

    }, {
        key: 'hslToHex',
        value: function hslToHex(h, s, l) {
            var _Lore$Color$hslToRgb = Lore.Color.hslToRgb(h, s, l),
                _Lore$Color$hslToRgb2 = _slicedToArray(_Lore$Color$hslToRgb, 3),
                r = _Lore$Color$hslToRgb2[0],
                g = _Lore$Color$hslToRgb2[1],
                b = _Lore$Color$hslToRgb2[2];

            return '#' + [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)].map(function (e) {
                var hex = e.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }

        /**
         * Converts RGB to HSL.
         * 
         * @static
         * @param {Number} r The red component.
         * @param {Number} g The green component.
         * @param {Number} b The blue component.
         * @returns {Number[]} An array containing the h, s and l values ([h, s, l]).
         */

    }, {
        key: 'rgbToHsl',
        value: function rgbToHsl(r, g, b) {
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
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }

            return [h, s, l];
        }

        /**
         * Shifts the hue so that 0.0 represents blue and 1.0 represents magenta.
         * 
         * @static
         * @param {Number} hue A hue component.
         * @returns {Number} The hue component shifted so that 0.0 is blue and 1.0 is magenta.
         */

    }, {
        key: 'gdbHueShift',
        value: function gdbHueShift(hue) {
            hue = 0.85 * hue + 0.66;

            if (hue > 1.0) {
                hue = hue - 1.0;
            }

            hue = 1 - hue + 0.33;

            if (hue > 1.0) {
                hue = hue - 1.0;
            }

            return hue;
        }
    }]);

    return Color;
}();

/** 
 * A class representing the WebGL renderer. 
 * 
 * @property {Object} opts An object containing options.
 * @property {Lore.CameraBase} camera The camera associated with this renderer.
 * @property {Lore.ControlsBase} controls The controls associated with this renderer.
 */
Lore.Renderer = function () {

    /**
     * Creates an instance of Renderer.
     * @param {String} targetId The id of a canvas element.
     * @param {any} options The options.
     */
    function Renderer(targetId, options) {
        _classCallCheck(this, Renderer);

        this.defaults = {
            antialiasing: true,
            verbose: false,
            fpsElement: document.getElementById('fps'),
            clearColor: Lore.Color.fromHex('#000000'),
            clearDepth: 1.0,
            radius: 500,
            center: new Lore.Vector3f(),
            enableDepthTest: true,
            enableTransparency: false
        };

        this.opts = Lore.Utils.extend(true, this.defaults, options);

        this.canvas = document.getElementById(targetId);
        this.webgl2 = true;
        this.parent = this.canvas.parentElement;
        this.fps = 0;
        this.fpsCount = 0;
        this.maxFps = 1000 / 30;
        this.devicePixelRatio = this.getDevicePixelRatio();
        this.camera = new Lore.OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / -2);
        // this.camera = new Lore.PerspectiveCamera(25.0, this.getWidth() / this.getHeight());

        this.geometries = {};
        this.ready = false;
        this.gl = null;
        this.render = function (camera, geometries) {};
        this.effect = null;
        this.lastTiming = performance.now();

        this.disableContextMenu();

        var that = this;
        that.init();

        // Attach the controls last
        var center = options.center ? options.center : new Lore.Vector3f();

        this.controls = new Lore.OrbitalControls(that, this.opts.radius || 500, center);
    }

    /**
     * Initialize and start the renderer.
     */


    _createClass(Renderer, [{
        key: 'init',
        value: function init() {
            var _this = this;

            var settings = {
                antialias: this.opts.antialiasing
            };

            this.gl = this.canvas.getContext('webgl2', settings) || this.canvas.getContext('experimental-webgl2');

            if (!this.gl) {
                this.webgl2 = false;
                this.gl = this.canvas.getContext('webgl', settings) || this.canvas.getContext('experimental-webgl', settings);
            }

            if (!this.gl) {
                console.error('Could not initialize the WebGL context.');
                return;
            }

            var g = this.gl;

            if (this.opts.verbose) {
                var hasAA = g.getContextAttributes().antialias;
                var size = g.getParameter(g.SAMPLES);
                console.info('Antialiasing: ' + hasAA + ' (' + size + 'x)');

                var highp = g.getShaderPrecisionFormat(g.FRAGMENT_SHADER, g.HIGH_FLOAT);
                var hasHighp = highp.precision != 0;
                console.info('High precision support: ' + hasHighp);

                console.info('WebGL2 supported: ' + this.webgl2);
            }

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

            var fgd = 'EXT_frag_depth';
            var extFgd = g.getExtension(fgd);

            if (extFgd === null) {
                console.warn('Could not load extension: ' + fgd + '.');
            }

            this.setClearColor(this.opts.clearColor);

            // Blending
            // if (!this.webgl2) {
            if (true) {
                g.clearDepth(this.opts.clearDepth);

                if (this.opts.enableTransparency) {
                    g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
                    g.enable(g.BLEND);
                    g.disable(g.DEPTH_TEST);
                } else if (this.opts.enableDepthTest) {
                    g.enable(g.DEPTH_TEST);
                    g.depthFunc(g.LEQUAL);

                    if (this.opts.verbose) {
                        console.log('enable depth test');
                    }
                }
            } else {
                // Idea, write to fragdepth
                // https://www.reddit.com/r/opengl/comments/1fthbc/is_gl_fragdepth_ignored_when_depth_writes_are_off/
                g.disable(g.DEPTH_TEST);
                g.enable(g.BLEND);
                g.blendFuncSeparate(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA, g.ONE, g.ONE_MINUS_SRC_ALPHA);
            }

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
        }

        /**
         * Disables the context menu on the canvas element. 
         */

    }, {
        key: 'disableContextMenu',
        value: function disableContextMenu() {
            // Disable context menu on right click
            this.canvas.addEventListener('contextmenu', function (e) {
                if (e.button === 2) {
                    e.preventDefault();
                    return false;
                }
            });
        }

        /**
         * Sets the clear color of this renderer.
         * 
         * @param {Lore.Color} color The clear color.
         */

    }, {
        key: 'setClearColor',
        value: function setClearColor(color) {
            this.opts.clearColor = color;

            var cc = this.opts.clearColor.components;

            this.gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
        }

        /**
         * Get the actual width of the canvas.
         * 
         * @returns {Number} The width of the canvas.
         */

    }, {
        key: 'getWidth',
        value: function getWidth() {
            return this.canvas.offsetWidth;
        }

        /**
         * Get the actual height of the canvas.
         * 
         * @returns {Number} The height of the canvas.
         */

    }, {
        key: 'getHeight',
        value: function getHeight() {
            return this.canvas.offsetHeight;
        }

        /**
         * Update the viewport. Should be called when the canvas is resized.
         * 
         * @param {Number} x The horizontal offset of the viewport.
         * @param {Number} y The vertical offset of the viewport.
         * @param {Number} width The width of the viewport.
         * @param {Number} height The height of the viewport.
         */

    }, {
        key: 'updateViewport',
        value: function updateViewport(x, y, width, height) {
            // width *= this.devicePixelRatio;
            // height *= this.devicePixelRatio;
            this.canvas.width = width;
            this.canvas.height = height;
            this.gl.viewport(x, y, width, height);

            this.camera.updateViewport(width, height);
            this.camera.updateProjectionMatrix();

            // Also reinit the buffers and textures for the effect(s)
            this.effect = new Lore.Effect(this, 'fxaaEffect');
            this.effect.shader.uniforms.resolution.setValue([width, height]);
        }

        /**
         * The main rendering loop. 
         */

    }, {
        key: 'animate',
        value: function animate() {
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
                    // 
                    this.opts.fpsElement.innerHTML = Math.round(this.fps / this.fpsCount);
                    this.fpsCount = 0;
                    this.fps = 0;
                }
            }

            // this.effect.bind();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.render(this.camera, this.geometries);
            // this.effect.unbind();

            this.camera.isProjectionMatrixStale = false;
            this.camera.isViewMatrixStale = false;
        }

        /**
         * Creates and adds a geometry to the scene graph.
         * 
         * @param {String} name The name of the geometry.
         * @param {String} shaderName The name of the shader used to render the geometry.
         * @returns {Lore.Geometry} The created geometry.
         */

    }, {
        key: 'createGeometry',
        value: function createGeometry(name, shaderName) {
            var shader = Lore.getShader(shaderName);
            shader.init(this.gl, this.webgl2);
            var geometry = new Lore.Geometry(name, this.gl, shader);

            this.geometries[name] = geometry;

            return geometry;
        }

        /**
         * Set the maximum frames per second of this renderer.
         * 
         * @param {Number} fps Maximum frames per second.
         */

    }, {
        key: 'setMaxFps',
        value: function setMaxFps(fps) {
            this.maxFps = 1000 / fps;
        }

        /**
         * Get the device pixel ratio.
         * 
         * @returns {Number} The device pixel ratio.
         */

    }, {
        key: 'getDevicePixelRatio',
        value: function getDevicePixelRatio() {
            return window.devicePixelRatio || 1;
        }
    }]);

    return Renderer;
}();

/**
 * A class representing a shader.
 * 
 * @property {String} name The name of the shader.
 * @property {Object} uniforms A map mapping uniform names to Lore.Uniform instances.
 * 
 */
Lore.Shader = function () {
    function Shader(name, glVersion, uniforms, vertexShader, fragmentShader) {
        _classCallCheck(this, Shader);

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
        this.uniforms['modelViewMatrix'] = new Lore.Uniform('modelViewMatrix', new Lore.Matrix4f().entries, 'float_mat4');

        this.uniforms['projectionMatrix'] = new Lore.Uniform('projectionMatrix', new Lore.Matrix4f().entries, 'float_mat4');
    }

    _createClass(Shader, [{
        key: 'clone',
        value: function clone() {
            return new Lore.Shader(this.name, this.glVersion, this.uniforms, this.vertexShader, this.fragmentShader);
        }
    }, {
        key: 'getVertexShaderCode',
        value: function getVertexShaderCode() {
            return this.vertexShader.join('\n');
        }
    }, {
        key: 'getFragmentShaderCode',
        value: function getFragmentShaderCode() {
            return this.fragmentShader.join('\n');
        }
    }, {
        key: 'getVertexShader',
        value: function getVertexShader(gl) {
            var isWebGL2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var shader = gl.createShader(gl.VERTEX_SHADER);
            var vertexShaderCode = '';

            if (!isWebGL2 && this.glVersion === 2) {
                throw 'The shader expects WebGL 2.0';
            } else if (this.glVersion === 2) {
                vertexShaderCode += '#version 300 es\n';
            }

            vertexShaderCode += 'uniform mat4 modelViewMatrix;\n' + 'uniform mat4 projectionMatrix;\n\n' + this.getVertexShaderCode();

            gl.shaderSource(shader, vertexShaderCode);
            gl.compileShader(shader);

            Lore.Shader.showCompilationInfo(gl, shader, this.name, 'Vertex Shader');
            return shader;
        }
    }, {
        key: 'getFragmentShader',
        value: function getFragmentShader(gl) {
            var isWebGL2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var shader = gl.createShader(gl.FRAGMENT_SHADER);

            var fragmentShaderCode = '';

            if (!isWebGL2 && this.glVersion === 2) {
                throw 'The shader expects WebGL 2.0';
            } else if (this.glVersion === 2) {
                fragmentShaderCode += '#version 300 es\n';
            }

            // Adding precision, see:
            // http://stackoverflow.com/questions/27058064/why-do-i-need-to-define-a-precision-value-in-webgl-shaders
            // and:
            // http://stackoverflow.com/questions/13780609/what-does-precision-mediump-float-mean
            fragmentShaderCode += '#ifdef GL_OES_standard_derivatives\n#extension GL_OES_standard_derivatives : enable\n#endif\n\n' + '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + this.getFragmentShaderCode();

            gl.shaderSource(shader, fragmentShaderCode);
            gl.compileShader(shader);

            Lore.Shader.showCompilationInfo(gl, shader, this.name, 'Fragment Shader');
            return shader;
        }
    }, {
        key: 'init',
        value: function init(gl) {
            var isWebGL2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.gl = gl;
            this.program = this.gl.createProgram();
            var vertexShader = this.getVertexShader(this.gl, isWebGL2);
            var fragmentShader = this.getFragmentShader(this.gl, isWebGL2);

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
        }
    }, {
        key: 'updateUniforms',
        value: function updateUniforms(renderer) {
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
        }
    }, {
        key: 'use',
        value: function use() {
            this.gl.useProgram(this.program);
            this.updateUniforms();
        }
    }], [{
        key: 'showCompilationInfo',
        value: function showCompilationInfo(gl, shader, name, prefix) {
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
    }]);

    return Shader;
}();

/**
 * A class representing a uniform.
 * 
 * @property {String} name The name of this uniform. Also the variable name in the shader.
 * @property {Number|Array} value The value of this uniform.
 * @property {String} type The type of this uniform. Available types: int, int_vec2, int_vec3, int_vec4, int_array, float, float_vec2, float_vec3, float_vec4, float_array, float_mat2, float_mat3, float_mat4.
 * @property {Boolean} stale A boolean indicating whether or not this uniform is stale and needs to be updated.
 */
Lore.Uniform = function () {
    /**
     * Creates an instance of Uniform.
     * @param {String} name The name of this uniform. Also the variable name in the shader.
     * @param {Number|Array} value The value of this uniform.
     * @param {String} type The type of this uniform. Available types: int, int_vec2, int_vec3, int_vec4, int_array, float, float_vec2, float_vec3, float_vec4, float_array, float_mat2, float_mat3, float_mat4.
     */
    function Uniform(name, value, type) {
        _classCallCheck(this, Uniform);

        this.name = name;
        this.value = value;
        this.type = type;
        this.stale = true;
    }

    /**
     * Set the value of this uniform.
     * 
     * @param {Number} value A number which is valid for the specified type.
     */


    _createClass(Uniform, [{
        key: 'setValue',
        value: function setValue(value) {
            this.value = value;
            this.stale = true;
        }

        /**
         * Pushes the uniform to the GPU.
         * 
         * @param {WebGLRenderingContext} gl A WebGL rendering context.
         * @param {WebGLUniformLocation} program 
         * @param {Lore.Uniform} uniform 
         */

    }], [{
        key: 'Set',
        value: function Set(gl, program, uniform) {
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
        }
    }]);

    return Uniform;
}();

/**
 * A class representing a node. A node is the base-class for all 3D objects.
 * 
 * @property {String} type The type name of this object (Lore.Node).
 * @property {String} id A GUID uniquely identifying the node.
 * @property {Boolean} isVisible A boolean indicating whether or not the node is visible (rendered).
 * @property {Lore.Vector3f} position The position of this node.
 * @property {Lore.Quaternion} rotation The rotation of this node.
 * @property {Lore.Vector3f} scale The scale of this node.
 * @property {Lore.Vector3f} up The up vector associated with this node.
 * @property {Lore.Matrix3f} normalMatrix The normal matrix of this node.
 * @property {Lore.Matrix4f} modelMatrix The model matrix associated with this node.
 * @property {Boolean} isStale A boolean indicating whether or not the modelMatrix of this node is stale.
 * @property {Lore.Node[]} children An array containing child-nodes.
 * @property {Lore.Node} parent The parent node.
 */
Lore.Node = function () {
    /**
     * Creates an instance of Node.
     */
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

    /**
     * Apply a matrix to the model matrix of this node.
     * 
     * @param {Lore.Matrix4f} matrix A matrix.
     * @returns {Lore.Node} Itself.
     */


    _createClass(Node, [{
        key: 'applyMatrix',
        value: function applyMatrix(matrix) {
            this.modelMatrix.multiplyB(matrix);

            return this;
        }

        /**
         * Returns the up vector for this node.
         * 
         * @returns {Lore.Vector3f} The up vector for this node.
         */

    }, {
        key: 'getUpVector',
        value: function getUpVector() {
            var v = new Lore.Vector3f(0, 1, 0);

            return v.applyQuaternion(this.rotation);
        }

        /**
         * Returns the forward vector for this node.
         * 
         * @returns {Lore.Vector3f} The forward vector for this node.
         */

    }, {
        key: 'getForwardVector',
        value: function getForwardVector() {
            var v = new Lore.Vector3f(0, 0, 1);

            return v.applyQuaternion(this.rotation);
        }

        /**
         * Returns the right vector for this node.
         * 
         * @returns {Lore.Vector3f} The right vector for this node.
         */

    }, {
        key: 'getRightVector',
        value: function getRightVector() {
            var v = new Lore.Vector3f(1, 0, 0);

            return v.applyQuaternion(this.rotation);
        }

        /**
         * Translates this node on an axis.
         * 
         * @param {Lore.Vector3f} axis A vector representing an axis.
         * @param {Number} distance The distance for which to move the node along the axis.
         * @returns {Lore.Node} Itself.
         */

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

        /**
         * Translates the node along the x-axis.
         * 
         * @param {Number} distance The distance for which to move the node along the x-axis.
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'translateX',
        value: function translateX(distance) {
            this.position.components[0] = this.position.components[0] + distance;

            return this;
        }

        /**
         * Translates the node along the y-axis.
         * 
         * @param {Number} distance The distance for which to move the node along the y-axis.
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'translateY',
        value: function translateY(distance) {
            this.position.components[1] = this.position.components[1] + distance;

            return this;
        }

        /**
         * Translates the node along the z-axis.
         * 
         * @param {Number} distance The distance for which to move the node along the z-axis.
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'translateZ',
        value: function translateZ(distance) {
            this.position.components[2] = this.position.components[2] + distance;

            return this;
        }

        /**
         * Set the translation (position) of this node.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'setTranslation',
        value: function setTranslation(v) {
            this.position = v;

            return this;
        }

        /**
         * Set the rotation from an axis and an angle.
         * 
         * @param {Lore.Vector3f} axis A vector representing an angle
         * @param {Number} angle An angle.
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'setRotation',
        value: function setRotation(axis, angle) {
            this.rotation.setFromAxisAngle(axis, angle);

            return this;
        }

        /**
         * Rotate this node by an angle on an axis.
         * 
         * @param {Lore.Vector3f} axis A vector representing an angle
         * @param {Number} angle An angle.
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'rotate',
        value: function rotate(axis, angle) {
            var q = new Lore.Quaternion(axis, angle);

            this.rotation.multiplyA(q);

            return this;
        }

        /**
         * Rotate around the x-axis.
         * 
         * @param {Number} angle An angle.
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'rotateX',
        value: function rotateX(angle) {
            this.rotation.rotateX(angle);

            return this;
        }

        /**
         * Rotate around the y-axis.
         * 
         * @param {Number} angle An angle.
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'rotateY',
        value: function rotateY(angle) {
            this.rotation.rotateY(angle);

            return this;
        }

        /**
         * Rotate around the z-axis.
         * 
         * @param {Number} angle An angle.
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'rotateZ',
        value: function rotateZ(angle) {
            this.rotation.rotateZ(angle);

            return this;
        }

        /**
         * Get the rotation matrix for this node.
         * 
         * @returns {Lore.Matrix4f} This nodes rotation matrix.
         */

    }, {
        key: 'getRotationMatrix',
        value: function getRotationMatrix() {
            return this.rotation.toRotationMatrix();
        }

        /**
         * Update the model matrix of this node. Has to be called in order to apply scaling, rotations or translations.
         * 
         * @returns {Lore.Node} Itself.
         */

    }, {
        key: 'update',
        value: function update() {
            this.modelMatrix.compose(this.position, this.rotation, this.scale);
            // if parent... this.modelMatrix = Lore.Matrix4f.multiply(this.parent.modelMatrix, this.modelMatrix);
            this.isStale = true;

            return this;
        }

        /**
         * Returns the model matrix as an array. 
         * 
         * @returns {Float32Array} The model matrix.
         */

    }, {
        key: 'getModelMatrix',
        value: function getModelMatrix() {
            return this.modelMatrix.entries;
        }

        /**
         * Creates a GUID.
         * 
         * @returns {String} A GUID.
         */

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

/** 
 * A class representing a geometry.
 * 
 * @property {String} type The type name of this object (Lore.Geometry).
 * @property {String} name The name of this geometry.
 * @property {WebGLRenderingContext} gl A WebGL rendering context.
 * @property {Lore.Shader} shader An initialized shader.
 * @property {Object} attributes A map mapping attribute names to Lore.Attrubute objects.
 * @property {Lore.DrawMode} [drawMode=gl.POINTS] The current draw mode of this geometry.
 * @property {Boolean} isVisisble A boolean indicating whether or not this geometry is currently visible.
 */
Lore.Geometry = function (_Lore$Node) {
    _inherits(Geometry, _Lore$Node);

    function Geometry(name, gl, shader) {
        _classCallCheck(this, Geometry);

        var _this2 = _possibleConstructorReturn(this, (Geometry.__proto__ || Object.getPrototypeOf(Geometry)).call(this));

        _this2.type = 'Lore.Geometry';
        _this2.name = name;
        _this2.gl = gl;
        _this2.shader = shader;
        _this2.attributes = {};
        _this2.drawMode = _this2.gl.POINTS;
        _this2.isVisible = true;
        return _this2;
    }

    _createClass(Geometry, [{
        key: 'addAttribute',
        value: function addAttribute(name, data, length) {
            this.attributes[name] = new Lore.Attribute(data, length, name);
            this.attributes[name].createBuffer(this.gl, this.shader.program);

            return this;
        }
    }, {
        key: 'updateAttribute',
        value: function updateAttribute(name, data) {
            if (data) {
                this.attributes[name].data = data;
            }

            this.attributes[name].update(this.gl);

            return this;
        }
    }, {
        key: 'getAttribute',
        value: function getAttribute(name) {
            return this.attributes[name];
        }
    }, {
        key: 'removeAttribute',
        value: function removeAttribute(name) {
            delete this.attributes[name];

            return this;
        }
    }, {
        key: 'setMode',
        value: function setMode(drawMode) {
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
        }
    }, {
        key: 'size',
        value: function size() {
            // Is this ok? All attributes should have the same length ...
            if (Object.keys(this.attributes).length > 0) {
                return this.attributes[Object.keys(this.attributes)[0]].size;
            }

            return 0;
        }
    }, {
        key: 'draw',
        value: function draw(renderer) {
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
    }]);

    return Geometry;
}(Lore.Node);

/** 
 * A class representing an attribute. 
 * 
 * @property {String} type The type name of this object (Lore.Attribute).
 * @property {*} data The data represented by the attribute in a 1D array. Usually a Float32Array.
 * @property {Number} [attributeLength=3] The length of the attribute. '3' for Vector3f.
 * @property {String} name The name of this attribut. Must be the name used by the shader.
 * @property {Number} size The length of the attribute values (defined as data.length / attributeLength).
 * @property {WebGLBuffer} buffer The bound WebGLBuffer.
 * @property {GLint} attributeLocation The attribute location for this attribute.
 * @property {GLenum} bufferType The buffer target. As of WebGL 1: gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER.
 * @property {GLenum} drawMode The draw mode. As of WebGL 1: gl.STATIC_DRAW, gl.DYNAMIC_DRAW or gl.STREAM_DRAW.
 * @property {Boolean} stale A boolean indicating whether or not this attribute has changed and needs to be updated.
 */
Lore.Attribute = function () {
    /**
     * Creates an instance of Attribute.
     * @param {*} data The data represented by the attribute in a 1D array. Usually a Float32Array.
     * @param {Number} attributeLength The length of the attribute (3 for RGB, XYZ, ...).
     * @param {String} name The name of the attribute.
     */
    function Attribute(data, attributeLength, name) {
        _classCallCheck(this, Attribute);

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
     * @param {Lore.Vector3f} v A vector.
     */


    _createClass(Attribute, [{
        key: 'setFromVector',
        value: function setFromVector(index, v) {
            this.data.set(v.components, index * this.attributeLength, v.components.length);
        }

        /**
         * Set the attribute values from vectors in an array.
         * 
         * @param {Lore.Vector3f[]} arr An array containing vectors. The number of components of the vectors must have the same length as the attribute length specified.
         */

    }, {
        key: 'setFromVectorArray',
        value: function setFromVectorArray(arr) {
            if (this.attributeLength !== arr[0].components.length) throw 'The attribute has a length of ' + this.attributeLength + '. But the vectors have ' + arr[0].components.length + ' components.';

            for (var i = 0; i < arr.length; i++) {
                this.data.set(arr[i].components, i * this.attributeLength, arr[i].components.length);
            }
        }

        /**
         * Gets the x value at a given index.
         * 
         * @param {Number} index The index.
         * @returns {Number} The x value at a given index.
         */

    }, {
        key: 'getX',
        value: function getX(index) {
            return this.data[index * this.attributeLength];
        }

        /**
         * Set the x value at a given index.
         * 
         * @param {Number} index The index.
         * @param {Number} value A number.
         */

    }, {
        key: 'setX',
        value: function setX(index, value) {
            this.data[index * this.attributeLength];
        }

        /**
         * Gets the y value at a given index.
         * 
         * @param {Number} index The index.
         * @returns {Number} The y value at a given index.
         */

    }, {
        key: 'getY',
        value: function getY(index) {
            return this.data[index * this.attributeLength + 1];
        }

        /**
         * Set the y value at a given index.
         * 
         * @param {Number} index The index.
         * @param {Number} value A number.
         */

    }, {
        key: 'setY',
        value: function setY(index, value) {
            this.data[index * this.attributeLength + 1];
        }

        /**
         * Gets the z value at a given index.
         * 
         * @param {Number} index The index.
         * @returns {Number} The z value at a given index.
         */

    }, {
        key: 'getZ',
        value: function getZ(index) {
            return this.data[index * this.attributeLength + 2];
        }

        /**
         * Set the z value at a given index.
         * 
         * @param {Number} index The index.
         * @param {Number} value A number.
         */

    }, {
        key: 'setZ',
        value: function setZ(index, value) {
            this.data[index * this.attributeLength + 2];
        }

        /**
         * Gets the w value at a given index.
         * 
         * @param {Number} index The index.
         * @returns {Number} The w value at a given index.
         */

    }, {
        key: 'getW',
        value: function getW(index) {
            return this.data[index * this.attributeLength + 3];
        }

        /**
         * Set the w value at a given index.
         * 
         * @param {Number} index The index.
         * @param {Number} value A number.
         */

    }, {
        key: 'setW',
        value: function setW(index, value) {
            this.data[index * this.attributeLength + 3];
        }

        /**
         * Returns the gl type. Currently only float is supported.
         * 
         * @param {WebGLRenderingContext} gl The WebGL rendering context.
         * @returns {Number} The type.
         */

    }, {
        key: 'getGlType',
        value: function getGlType(gl) {
            // Just floats for now
            // TODO: Add additional types.
            return gl.FLOAT;
        }

        /**
         * Update the attribute in order for changes to take effect.
         * 
         * @param {WebGLRenderingContext} gl The WebGL rendering context.
         */

    }, {
        key: 'update',
        value: function update(gl) {
            gl.bindBuffer(this.bufferType, this.buffer);
            gl.bufferData(this.bufferType, this.data, this.drawMode);

            this.stale = false;
        }

        /**
         * Create a new WebGL buffer.
         * 
         * @param {WebGLRenderingContext} gl The WebGL rendering context.
         * @param {WebGLProgram} program A WebGL program.
         * @param {GLenum} bufferType The buffer type.
         * @param {GLenum} drawMode The draw mode.
         */

    }, {
        key: 'createBuffer',
        value: function createBuffer(gl, program, bufferType, drawMode) {
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

    }, {
        key: 'bind',
        value: function bind(gl) {
            gl.bindBuffer(this.bufferType, this.buffer);

            // Only enable attribute if it actually exists in the Shader
            if (this.attributeLocation >= 0) {
                gl.vertexAttribPointer(this.attributeLocation, this.attributeLength, this.getGlType(gl), gl.FALSE, 0, 0);
                gl.enableVertexAttribArray(this.attributeLocation);
            }
        }
    }]);

    return Attribute;
}();

Lore.Effect = function () {
    function Effect(renderer, shaderName) {
        _classCallCheck(this, Effect);

        this.renderer = renderer;
        this.gl = this.renderer.gl;

        this.framebuffer = this.initFramebuffer();
        this.texture = this.initTexture();
        this.renderbuffer = this.initRenderbuffer();

        this.shader = Lore.getShader(shaderName);
        this.shader.init(this.renderer.gl);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    _createClass(Effect, [{
        key: 'initBuffer',
        value: function initBuffer() {
            var g = this.gl;
            var texCoordLocation = g.getAttribLocation(this.shader.program, 'v_coord');

            // provide texture coordinates for the rectangle.
            var texCoordBuffer = g.createBuffer();
            g.bindBuffer(g.ARRAY_BUFFER, texCoordBuffer);
            g.bufferData(g.ARRAY_BUFFER, new Float32Array([1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]), g.STATIC_DRAW);

            g.enableVertexAttribArray(texCoordLocation);
            g.vertexAttribPointer(texCoordLocation, 2, g.FLOAT, false, 0, 0);

            return texCoordBuffer;
        }
    }, {
        key: 'initTexture',
        value: function initTexture() {
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
        }
    }, {
        key: 'initFramebuffer',
        value: function initFramebuffer() {
            var g = this.gl;

            var framebuffer = g.createFramebuffer();
            g.bindFramebuffer(g.FRAMEBUFFER, framebuffer);
            return framebuffer;
        }
    }, {
        key: 'initRenderbuffer',
        value: function initRenderbuffer() {
            var g = this.gl;

            var renderbuffer = g.createRenderbuffer();
            g.bindRenderbuffer(g.RENDERBUFFER, renderbuffer);

            g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_COMPONENT16, this.renderer.getWidth(), this.renderer.getHeight());
            g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, renderbuffer);

            // g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_STENCIL, this.renderer.getWidth(), this.renderer.getHeight());
            // g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_STENCIL_ATTACHMENT, g.RENDERBUFFER, renderbuffer);

            return renderbuffer;
        }
    }, {
        key: 'bind',
        value: function bind() {
            var g = this.gl;
            g.bindFramebuffer(g.FRAMEBUFFER, this.framebuffer);
            g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
        }
    }, {
        key: 'unbind',
        value: function unbind() {
            var g = this.gl;
            g.bindRenderbuffer(g.RENDERBUFFER, null);
            g.bindFramebuffer(g.FRAMEBUFFER, null);

            this.initBuffer();
            this.shader.use();
            g.drawArrays(g.TRIANGLES, 0, 6);
        }
    }]);

    return Effect;
}();

/** 
 * A class representing a tree. 
 * 
 * @property {Array} tree An array of arrays where the index is the node id and the inner arrays contain the neighbours.
 */
Lore.Tree = function () {
    /**
     * The constructor of the class Tree.
     * 
     * @param {Array[]} tree An array of arrays where the index is the node id and the inner arrays contain the neighbours.
     * @param {Array[]} weights An array of arrays where the index is the node id and the inner arrays contain the weights in the same order as tree contains neighbours.
     */
    function Tree(tree, weights) {
        _classCallCheck(this, Tree);

        this.tree = tree;
        this.weights = weights;
    }

    /**
     * Layout the tree
     */


    _createClass(Tree, [{
        key: 'layout',
        value: function layout() {
            var root = 0;
            var visited = new Uint8Array(this.tree.length);
            var pX = new Float32Array(this.tree.length);
            var pY = new Float32Array(this.tree.length);
            var queue = [root];
            visited[root] = 1;
            var current = null;

            // Position initial node
            pX[root] = 20.0;
            pY[root] = 10.0;

            while (queue.length > 0) {
                current = queue.shift();

                var offset = 0;
                for (var i = 0; i < this.tree[current].length; i++) {
                    var child = this.tree[current][i];

                    if (visited[child] === 0) {
                        // Do some positioning

                        pX[child] = pX[current] + this.weights[current][i] * 5.0;
                        pY[child] = pY[current] + offset++ * 10.0 * this.weights[current][i];

                        var fX = 0.0;
                        var fY = 0.0;

                        for (var j = 0; j < length; j++) {
                            if (visited[j] === 0) {
                                continue;
                            }

                            var distSquared = Math.pow(pX[j] - pX[child], 2.0) + Math.pow(pY[j] - pY[child], 2.0);
                            var dist = Math.sqrt(distSquared);

                            var fAttractive = 1000 / distSquared;
                        }

                        // Done with positioning

                        visited[child] = 1;
                        queue.push(child);
                    }
                }
            }

            var positions = Array(this.tree.length);

            for (var i = 0; i < this.tree.length; i++) {
                positions[i] = [pX[i], pY[i]];
            }

            return positions;
        }

        /**
         * Create a tree from an edge list. 
         */

    }], [{
        key: 'fromEdgeList',
        value: function fromEdgeList(edgeList) {
            var length = 0;

            for (var i = 0; i < edgeList.length; i++) {
                if (edgeList[i][0] > length) {
                    length = edgeList[i][0];
                }

                if (edgeList[i][1] > length) {
                    length = edgeList[i][1];
                }
            }

            length++;

            var neighbours = Array(length);
            var weights = Array(length);

            for (var i = 0; i < length; i++) {
                neighbours[i] = Array();
                weights[i] = Array();
            }

            for (var i = 0; i < edgeList.length; i++) {
                neighbours[edgeList[i][0]].push(edgeList[i][1]);
                neighbours[edgeList[i][1]].push(edgeList[i][0]);

                weights[edgeList[i][0]].push(edgeList[i][2]);
                weights[edgeList[i][1]].push(edgeList[i][2]);
            }

            return new Lore.Tree(neighbours, weights);
        }
    }]);

    return Tree;
}();
/** 
 * A class representing the molecular graph. 
 * 
 * @property {Array[]} distanceMatrix The distance matrix of this graph.
 */
Lore.Graph = function () {
    /**
     * The constructor of the class Graph.
     * 
     * @param {Array[]} adjacencyMatrix The weighted adjacency matrix of a graph.
     * @param {Array[]} distanceMatrix The distance matrix of a graph.
     * @param {Number} diameter The diameter of the graph.
     */
    function Graph(adjacencyMatrix) {
        _classCallCheck(this, Graph);

        this.adjacencyMatrix = adjacencyMatrix;

        // Replace zeros with infinity
        for (var i = 0; i < this.adjacencyMatrix.length; i++) {
            for (var j = 0; j < this.adjacencyMatrix.length; j++) {
                if (this.adjacencyMatrix[i][j] === 0) {
                    this.adjacencyMatrix[i][j] = Infinity;
                }
            }
        }

        this.distanceMatrix = this.getDistanceMatrix();
        this.diameter = this.getDiameter();
    }

    /**
     * Returns the unweighted adjacency matrix of this graph.
     * 
     * @returns {Array} The unweighted adjacency matrix of this graph.
     */


    _createClass(Graph, [{
        key: 'getUnweightedAdjacencyMatrix',
        value: function getUnweightedAdjacencyMatrix() {
            var length = this.adjacencyMatrix.length;
            var unweightedAdjacencyMatrix = Array(length);

            for (var i = 0; i < length; i++) {
                unweightedAdjacencyMatrix[i] = new Uint8Array(length);

                for (var j = 0; j < length; j++) {
                    unweightedAdjacencyMatrix[i][j] = this.adjacencyMatrix[i][j] > 0 ? 1 : 0;
                }
            }

            return unweightedAdjacencyMatrix;
        }

        /**
         * Returns an edge list of this graph.
         * 
         * @returns {Array} An array of edges in the form of [vertexId, vertexId, edgeWeight].
         */

    }, {
        key: 'getEdgeList',
        value: function getEdgeList() {
            var length = this.adjacencyMatrix.length;
            var edgeList = Array();

            for (var i = 0; i < length - 1; i++) {
                for (var j = i; j < length; j++) {
                    if (this.adjacencyMatrix[i][j] !== Infinity) {
                        edgeList.push([i, j, this.adjacencyMatrix[i][j]]);
                    }
                }
            }

            return edgeList;
        }

        /**
         * 
         */

    }, {
        key: 'forceLayout',
        value: function forceLayout() {
            var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
            var iterations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
            var q = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.5;
            var k = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.01;
            var ke = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1000.0;
            var zoom = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1.0;

            var matDist = this.distanceMatrix.slice();
            var length = matDist.length;
            var nNeighbours = new Int16Array(length);

            // Get the number of neighbours
            for (var i = 0; i < length; i++) {
                nNeighbours[i] = this.adjacencyMatrix[i].reduce(function (acc, val) {
                    return val !== Infinity ? ++acc : acc;
                }, 0);
            }

            // Square distances
            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    matDist[i][j] = Math.pow(matDist[i][j], q);
                }
            }

            // Normalize distance matrix
            var max = 0.0;

            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (matDist[i][j] > max) {
                        max = matDist[i][j];
                    }
                }
            }

            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    // Added math pow to decrease influence of long distances
                    matDist[i][j] = matDist[i][j] / max;
                }
            }

            // Forces
            var fx = new Float32Array(length);
            var fy = new Float32Array(length);

            // Positions
            var px = new Float32Array(length);
            var py = new Float32Array(length);

            // Initialize positions to random values
            for (var i = 0; i < length; i++) {
                px[i] = Math.random() * radius;
                py[i] = Math.random() * radius;
            }

            for (var n = 0; n < iterations; n++) {
                // Spring forces
                for (var i = 0; i < length - 1; i++) {
                    for (var j = i + 1; j < length; j++) {
                        if (matDist[i][j] === Infinity) {
                            continue;
                        }

                        var dx = px[i] - px[j];
                        var dy = py[i] - py[j];

                        var d = Math.sqrt(Math.pow(dx, 2.0) + Math.pow(dy, 2.0));

                        if (d === 0) {
                            d = 0.01;
                        }

                        // Normalize dx and dy to d
                        dx /= d;
                        dy /= d;

                        // Hooke's law, F=kX, is the force between x and y
                        var f = k * (matDist[i][j] * radius - d);

                        if (this.adjacencyMatrix[i][j] !== Infinity) {
                            f *= length;
                        }

                        fx[i] += f * dx;
                        fy[i] += f * dy;

                        fx[j] += -f * dx;
                        fy[j] += -f * dy;
                    }
                }

                // Repulsive forces between vertices
                for (var i = 0; i < length - 1; i++) {
                    for (var j = i; j < length; j++) {
                        for (var j = i; j < length; j++) {
                            if (this.adjacencyMatrix[i][j] !== Infinity) {
                                continue;
                            }

                            var _dx = px[i] - px[j];
                            var _dy = py[i] - py[j];

                            var dSquared = Math.pow(_dx, 2.0) + Math.pow(_dy, 2.0);
                            var _d = Math.sqrt(dSquared);

                            if (_d === 0) {
                                _d = 0.01;
                            }

                            if (dSquared === 0) {
                                dSquared = 0.05;
                            }

                            // Normalize dx and dy to d
                            _dx /= _d;
                            _dy /= _d;

                            // Coulomb's law, F = k_e * q1 * q2 / r^2, is the force between x and y
                            var _f = ke / dSquared;

                            fx[i] += _f * _dx;
                            fy[i] += _f * _dy;

                            fx[j] += -_f * _dx;
                            fy[j] += -_f * _dy;
                        }
                    }
                }

                // Move the vertices
                for (var i = 0; i < length; i++) {

                    // fx[i] = Math.min(Math.max(-1, fx[i]), 1);
                    // fy[i] = Math.min(Math.max(-1, fy[i]), 1);

                    fx[i] = Math.sign(fx[i]) * Math.sqrt(Math.abs(fx[i]));
                    fy[i] = Math.sign(fy[i]) * Math.sqrt(Math.abs(fy[i]));

                    px[i] += fx[i];
                    py[i] += fy[i];
                }

                // Reset force and position deltas
                for (var i = 0; i < length; i++) {
                    fx[i] = 0.0;
                    fy[i] = 0.0;
                }
            }

            // Move the graph to the center
            var avgX = 0.0;
            var avgY = 0.0;

            for (var i = 0; i < length; i++) {
                // Zoom
                px[i] *= zoom;
                py[i] *= zoom;

                avgX += px[i];
                avgY += py[i];
            }

            avgX /= length;
            avgY /= length;

            for (var i = 0; i < length; i++) {
                px[i] = px[i] - (avgX - radius / 2.0);
                py[i] = py[i] - (avgY - radius / 2.0);
            }

            var positions = Array(length);

            for (var i = 0; i < length; i++) {
                positions[i] = [px[i], py[i]];
            }

            return [positions, this.getEdgeList()];
        }

        /**
         * Positiones the (sub)graph using Kamada and Kawais algorithm for drawing general undirected graphs. https://pdfs.semanticscholar.org/b8d3/bca50ccc573c5cb99f7d201e8acce6618f04.pdf
         * 
         * @param {Number} radius The radius within which to initialize the vertices.
         * @param {Boolean} logWeights Apply log() to the weights before layouting.
         * @param {Boolean} squareWeights Apply pow(x,2) to the weights before layouting.
         * @param {Boolean} norm Normalize the edge weights before layouting and after log() or exp().
         * @return {Array} An array of vertex positions of the form [ x, y ].
         */

    }, {
        key: 'kkLayout',
        value: function kkLayout() {
            var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
            var logWeights = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var squareWeights = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var normalizeWeights = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var edgeStrength = 50.0;

            var matDist = this.distanceMatrix;
            var length = this.distanceMatrix.length;

            // Transform data
            if (logWeights) {
                for (var i = 0; i < length; i++) {
                    for (var j = 0; j < length; j++) {
                        if (matDist[i][j] !== Infinity) {
                            matDist[i][j] = Math.log(matDist[i][j]);
                        }
                    }
                }
            }

            if (normalizeWeights) {
                for (var i = 0; i < length; i++) {
                    for (var j = 0; j < length; j++) {
                        if (matDist[i][j] !== Infinity && matDist[i][j] !== 0) {
                            matDist[i][j] = Math.pow(matDist[i][j], 2.0);
                        }
                    }
                }
            }

            // Normalize the edge weights
            if (normalizeWeights) {
                var maxWeight = 0;

                for (var i = 0; i < length; i++) {
                    for (var j = 0; j < length; j++) {
                        if (matDist[i][j] > maxWeight && matDist[i][j] !== Infinity) {
                            maxWeight = matDist[i][j];
                        }
                    }
                }

                for (var i = 0; i < length; i++) {
                    for (var j = 0; j < length; j++) {
                        if (matDist[i][j] !== Infinity) {
                            matDist[i][j] = matDist[i][j] / maxWeight;
                        }
                    }
                }
            }

            // Initialize the positions. Place all vertices on a ring around the center
            var halfR = void 0;
            var angle = 2 * Math.PI / length;
            var a = 0.0;
            var arrPositionX = new Float32Array(length);
            var arrPositionY = new Float32Array(length);
            var arrPositioned = Array(length);
            var l = radius / (2 * this.diameter);
            console.log('l: ' + l);
            console.log('diameter: ' + this.diameter);

            radius /= 2.0;

            var i = length;
            while (i--) {
                arrPositionX[i] = radius + Math.cos(a) * radius;
                arrPositionY[i] = radius + Math.sin(a) * radius;

                arrPositioned[i] = false;
                a += angle;
            }

            // Create the matrix containing the lengths
            var matLength = Array(length);
            i = length;
            while (i--) {
                matLength[i] = new Array(length);
                var j = length;
                while (j--) {
                    matLength[i][j] = l * matDist[i][j];
                }
            }

            // Create the matrix containing the spring strenghts
            var matStrength = Array(length);
            i = length;
            while (i--) {
                matStrength[i] = Array(length);
                var j = length;
                while (j--) {
                    matStrength[i][j] = edgeStrength * Math.pow(matDist[i][j], -2.0);
                }
            }

            // Create the matrix containing the energies
            var matEnergy = Array(length);
            var arrEnergySumX = new Float32Array(length);
            var arrEnergySumY = new Float32Array(length);
            i = length;
            while (i--) {
                matEnergy[i] = Array(length);
            }

            i = length;
            var ux = void 0,
                uy = void 0,
                dEx = void 0,
                dEy = void 0,
                vx = void 0,
                vy = void 0,
                denom = void 0;

            while (i--) {
                ux = arrPositionX[i];
                uy = arrPositionY[i];
                dEx = 0.0;
                dEy = 0.0;
                var _j = length;
                while (_j--) {
                    if (i === _j) {
                        continue;
                    }
                    vx = arrPositionX[_j];
                    vy = arrPositionY[_j];
                    denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
                    matEnergy[i][_j] = [matStrength[i][_j] * (ux - vx - matLength[i][_j] * (ux - vx) * denom) || 0.0, matStrength[i][_j] * (uy - vy - matLength[i][_j] * (uy - vy) * denom) || 0.0];
                    matEnergy[_j][i] = matEnergy[i][_j];
                    dEx += matEnergy[i][_j][0];
                    dEy += matEnergy[i][_j][1];
                }
                arrEnergySumX[i] = dEx;
                arrEnergySumY[i] = dEy;
            }

            // Utility functions, maybe inline them later
            var energy = function energy(index) {
                return [arrEnergySumX[index] * arrEnergySumX[index] + arrEnergySumY[index] * arrEnergySumY[index], arrEnergySumX[index], arrEnergySumY[index]];
            };

            var highestEnergy = function highestEnergy() {
                var maxEnergy = 0.0;
                var maxEnergyId = 0;
                var maxDEX = 0.0;
                var maxDEY = 0.0;

                i = length;
                while (i--) {
                    var _energy = energy(i),
                        _energy2 = _slicedToArray(_energy, 3),
                        _delta = _energy2[0],
                        _dEX = _energy2[1],
                        _dEY = _energy2[2];

                    if (_delta > maxEnergy) {
                        maxEnergy = _delta;
                        maxEnergyId = i;
                        maxDEX = _dEX;
                        maxDEY = _dEY;
                    }
                }

                return [maxEnergyId, maxEnergy, maxDEX, maxDEY];
            };

            var update = function update(index, dEX, dEY) {
                var dxx = 0.0;
                var dyy = 0.0;
                var dxy = 0.0;
                var ux = arrPositionX[index];
                var uy = arrPositionY[index];
                var arrL = matLength[index];
                var arrK = matStrength[index];

                i = length;
                while (i--) {
                    if (i === index) {
                        continue;
                    }

                    var _vx = arrPositionX[i];
                    var _vy = arrPositionY[i];
                    var _l = arrL[i];
                    var k = arrK[i];
                    var m = (ux - _vx) * (ux - _vx);
                    var _denom = 1.0 / Math.pow(m + (uy - _vy) * (uy - _vy), 1.5);

                    dxx += k * (1 - _l * (uy - _vy) * (uy - _vy) * _denom) || 0.0;
                    dyy += k * (1 - _l * m * _denom) || 0.0;
                    dxy += k * (_l * (ux - _vx) * (uy - _vy) * _denom) || 0.0;
                }

                // Prevent division by zero
                if (dxx === 0) {
                    dxx = 0.1;
                }

                if (dyy === 0) {
                    dyy = 0.1;
                }

                if (dxy === 0) {
                    dxy = 0.1;
                }

                var dy = dEX / dxx + dEY / dxy;
                dy /= dxy / dxx - dyy / dxy; // had to split this onto two lines because the syntax highlighter went crazy.
                var dx = -(dxy * dy + dEX) / dxx;

                arrPositionX[index] += dx;
                arrPositionY[index] += dy;

                // Update the energies
                var arrE = matEnergy[index];
                dEX = 0.0;
                dEY = 0.0;

                ux = arrPositionX[index];
                uy = arrPositionY[index];

                var vx = void 0,
                    vy = void 0,
                    prevEx = void 0,
                    prevEy = void 0,
                    denom = void 0;

                i = length;
                while (i--) {
                    if (index === i) {
                        continue;
                    }
                    vx = arrPositionX[i];
                    vy = arrPositionY[i];
                    // Store old energies
                    prevEx = arrE[i][0];
                    prevEy = arrE[i][1];
                    denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
                    dx = arrK[i] * (ux - vx - arrL[i] * (ux - vx) * denom) || 0.0;
                    dy = arrK[i] * (uy - vy - arrL[i] * (uy - vy) * denom) || 0.0;

                    arrE[i] = [dx, dy];
                    dEX += dx;
                    dEY += dy;
                    arrEnergySumX[i] += dx - prevEx;
                    arrEnergySumY[i] += dy - prevEy;
                }
                arrEnergySumX[index] = dEX;
                arrEnergySumY[index] = dEY;
            };

            // Setting parameters
            var threshold = 0.1;
            var innerThreshold = 0.1;
            var maxIteration = 6000;
            var maxInnerIteration = 10;
            var maxEnergy = 1e9;

            // Setting up variables for the while loops
            var maxEnergyId = 0;
            var dEX = 0.0;
            var dEY = 0.0;
            var delta = 0.0;
            var iteration = 0;
            var innerIteration = 0;

            while (maxEnergy > threshold && maxIteration > iteration) {
                iteration++;

                var _highestEnergy = highestEnergy();

                var _highestEnergy2 = _slicedToArray(_highestEnergy, 4);

                maxEnergyId = _highestEnergy2[0];
                maxEnergy = _highestEnergy2[1];
                dEX = _highestEnergy2[2];
                dEY = _highestEnergy2[3];


                delta = maxEnergy;
                innerIteration = 0;
                while (delta > innerThreshold && maxInnerIteration > innerIteration) {
                    innerIteration++;
                    update(maxEnergyId, dEX, dEY);

                    var _energy3 = energy(maxEnergyId);

                    var _energy4 = _slicedToArray(_energy3, 3);

                    delta = _energy4[0];
                    dEX = _energy4[1];
                    dEY = _energy4[2];
                }
            }

            var positions = Array(length);

            i = length;
            while (i--) {
                positions[i] = [arrPositionX[i], arrPositionY[i]];
            }

            return [positions, this.getEdgeList()];
        }
    }, {
        key: 'getDiameter',
        value: function getDiameter() {
            var diameter = 0;

            for (var i = 0; i < this.distanceMatrix.length - 1; i++) {
                for (var j = i; j < this.distanceMatrix.length; j++) {
                    if (this.distanceMatrix[i][j] > diameter && this.distanceMatrix[i][j] < Infinity) {
                        diameter = this.distanceMatrix[i][j];
                    }
                }
            }

            return diameter;
        }

        /**
         * Get the distance matrix of the graph.
         * 
         * @returns {Array[]} The distance matrix of the graph.
         */

    }, {
        key: 'getDistanceMatrix',
        value: function getDistanceMatrix() {
            var length = this.adjacencyMatrix.length;
            var dist = Array(length);

            for (var i = 0; i < length; i++) {
                dist[i] = new Float32Array(length);
                dist[i].fill(Infinity);
            }

            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (this.adjacencyMatrix[i][j] < Infinity) {
                        dist[i][j] = this.adjacencyMatrix[i][j];
                    }
                }
            }

            for (var k = 0; k < length; k++) {
                for (var i = 0; i < length; i++) {
                    for (var j = 0; j < length; j++) {
                        if (dist[i][j] > dist[i][k] + dist[k][j]) {
                            dist[i][j] = dist[i][k] + dist[k][j];
                        }
                    }
                }
            }

            return dist;
        }

        /**
         * Returns a new graph object. Vertex ids have to be 0 to n.
         * 
         * @param {Array[]} edgeList An edge list in the form [ [ vertexId, vertexId, weight ], ... ].
         * @param {Boolean} invertWeights Whether or not to invert the weights.
         * @returns {Graph} A graph object.
         */

    }], [{
        key: 'fromEdgeList',
        value: function fromEdgeList(edgeList) {
            var invertWeights = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            // Get the max vertex id.
            var max = 0;
            for (var i = 0; i < edgeList.length; i++) {
                if (edgeList[i][0] > max) {
                    max = edgeList[i][0];
                }

                if (edgeList[i][1] > max) {
                    max = edgeList[i][1];
                }
            }

            max++;

            if (invertWeights) {
                var maxWeight = 0;

                for (var i = 0; i < edgeList.length; i++) {
                    if (edgeList[i][2] > maxWeight) {
                        maxWeight = edgeList[i][2];
                    }
                }

                maxWeight++;

                for (var i = 0; i < edgeList.length; i++) {
                    edgeList[i][2] = maxWeight - edgeList[i][2];
                }
            }

            var adjacencyMatrix = Array(max);

            for (var i = 0; i < max; i++) {
                adjacencyMatrix[i] = new Float32Array(max);
                adjacencyMatrix[i].fill(0);
            }

            for (var i = 0; i < edgeList.length; i++) {
                var edge = edgeList[i];
                adjacencyMatrix[edge[0]][edge[1]] = edge[2];
                adjacencyMatrix[edge[1]][edge[0]] = edge[2];
            }

            return new Lore.Graph(adjacencyMatrix);
        }
    }]);

    return Graph;
}();
/** 
 * An abstract class representing the base for controls implementations. 
 * 
 * @property {Lore.Renderer} renderer A Lore.Renderer instance.
 * @property {Lore.CameraBase} camera A Lore.CameraBase extending object.
 * @property {HTMLElement} canvas A canvas HTMLElement.
 * @property {Number} lowFps The FPS limit when throttling FPS.
 * @property {Number} highFps The FPS limit when not throttling FPS.
 * @property {String} touchMode The current touch mode.
 * @property {Lore.Vector3f} lookAt The current lookat associated with these controls.
 */
Lore.ControlsBase = function () {

    /**
     * Creates an instance of ControlsBase.
     * @param {Lore.Renderer} renderer An instance of a Lore renderer.
     * @param {Boolean} [lookAt=new Lore.Vector3f()] The look at vector of the controls.
     * @param {Boolean} [enableVR=false] Whether or not to track phone spatial information using the WebVR API.
     */
    function ControlsBase(renderer) {
        var lookAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Lore.Vector3f();
        var enableVR = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        _classCallCheck(this, ControlsBase);

        this.renderer = renderer;
        this.camera = renderer.camera;
        this.canvas = renderer.canvas;
        this.lowFps = 15;
        this.highFps = 30;
        this._eventListeners = {};
        this.renderer.setMaxFps(this.lowFps);
        this.touchMode = 'drag';
        this.lookAt = lookAt;

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

        this.VR = {};

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

            if (that.touchMode !== 'drag') {
                that.raiseEvent('mousemove', {
                    e: that
                });
            }

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

    /**
     * Initialiizes WebVR, if the API is available and the device suppports it.
     */


    _createClass(ControlsBase, [{
        key: 'initWebVR',
        value: function initWebVR() {
            if (navigator.getVRDevices) {
                navigator.getVRDisplays().then(function (displays) {
                    if (displays.length === 0) {
                        return;
                    }

                    for (var i = 0; i < displays.length; ++i) {}
                });
            }
        }

        /**
         * Adds an event listener to this controls instance.
         * 
         * @param {String} eventName The name of the event that is to be listened for.
         * @param {Function} callback A callback function to be called on the event being fired.
         */

    }, {
        key: 'addEventListener',
        value: function addEventListener(eventName, callback) {
            if (!this._eventListeners[eventName]) {
                this._eventListeners[eventName] = [];
            }

            this._eventListeners[eventName].push(callback);
        }

        /**
         * Remove an event listener from this controls instance.
         * 
         * @param {String} eventName The name of the event that is to be listened for.
         * @param {Function} callback A callback function to be called on the event being fired.
         */

    }, {
        key: 'removeEventListener',
        value: function removeEventListener(eventName, callback) {
            if (!this._eventListeners.hasOwnProperty(eventName)) {
                return;
            }

            var index = this._eventListeners[eventName].indexOf(callback);

            if (index > -1) {
                this._eventListeners[eventName].splice(index, 1);
            }
        }

        /**
         * Raises an event.
         * 
         * @param {String} eventName The name of the event to be raised.
         * @param {*} data The data to be supplied to the callback function.
         */

    }, {
        key: 'raiseEvent',
        value: function raiseEvent(eventName, data) {
            if (this._eventListeners[eventName]) {
                for (var i = 0; i < this._eventListeners[eventName].length; i++) {
                    this._eventListeners[eventName][i](data);
                }
            }
        }

        /**
         * Returns the current look at vector associated with this controls.
         * 
         * @returns {Lore.Vector3f} The current look at vector.
         */

    }, {
        key: 'getLookAt',
        value: function getLookAt() {
            return this.lookAt;
        }

        /**
         * Sets the lookat vector, which is the center of the orbital camera sphere.
         * 
         * @param {Lore.Vector3f} lookAt The lookat vector.
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'setLookAt',
        value: function setLookAt(lookAt) {
            //this.camera.position = new Lore.Vector3f(this.radius, this.radius, this.radius);
            this.lookAt = lookAt.clone();
            this.update();

            return this;
        }

        /**
         * Update the camera (on mouse move, touch drag, mousewheel scroll, ...).
         * 
         * @param {*} e A mouse or touch events data.
         * @param {String} source The source of the input ('left', 'middle', 'right', 'wheel', ...).
         * @returns {Lore.ControlsBase} Returns itself.
         */

    }, {
        key: 'update',
        value: function update(e, source) {
            return this;
        }
    }]);

    return ControlsBase;
}();

/** 
 * A class representing orbital controls.
 * 
 * @property {Lore.Vector3f} up The global up vector.
 * @property {Number} radius The distance from the camera to the lookat vector.
 * @property {Number} [yRotationLimit=Math.PI] The limit for the vertical rotation.
 * @property {Lore.SphericalCoords} spherical The spherical coordinates of the camera on the sphere around the lookat vector.
 * @property {Number} scale The sensitivity scale.
 * @property {Lore.CameraBase} camera The camera associated with these controls.
 */
Lore.OrbitalControls = function (_Lore$ControlsBase) {
    _inherits(OrbitalControls, _Lore$ControlsBase);

    /**
     * Creates an instance of OrbitalControls.
     * @param {Lore.Renderer} renderer An instance of a Lore renderer.
     * @param {Lore.Number} radius The distance of the camera to the lookat vector.
     * @param {Lore.Vector3f} lookAt The lookat vector.
     */
    function OrbitalControls(renderer, radius) {
        var lookAt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Lore.Vector3f();

        _classCallCheck(this, OrbitalControls);

        var _this3 = _possibleConstructorReturn(this, (OrbitalControls.__proto__ || Object.getPrototypeOf(OrbitalControls)).call(this, renderer, lookAt));

        _this3.up = Lore.Vector3f.up();
        _this3.radius = radius;

        _this3.yRotationLimit = Math.PI;

        _this3._dPhi = 0.0;
        _this3._dTheta = 0.0;
        _this3._dPan = new Lore.Vector3f();

        _this3.spherical = new Lore.SphericalCoords();

        _this3.scale = 0.95;

        _this3.camera.position = new Lore.Vector3f(radius, radius, radius);
        _this3.camera.updateProjectionMatrix();
        _this3.camera.updateViewMatrix();

        _this3.rotationLocked = false;

        var that = _this3;

        _this3.addEventListener('mousedrag', function (e) {
            that.update(e.e, e.source);
        });

        _this3.addEventListener('mousewheel', function (e) {
            that.update({
                x: 0,
                y: -e.e
            }, 'wheel');
        });

        // Initial update
        _this3.update({
            x: 0,
            y: 0
        }, 'left');
        return _this3;
    }

    /**
     * Limit the vertical rotation to the horizon (the upper hemisphere).
     * 
     * @param {Boolean} limit A boolean indicating whether or not to limit the vertical rotation to the horizon.
     * @returns {Lore.OrbitalControls} Returns itself.
     */


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

        /**
         * Sets the distance (radius of the sphere) from the lookat vector to the camera.
         * 
         * @param {Number} radius The radius.
         * @returns {Lore.OrbitalControls} Returns itself.
         */

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

        /**
         * Update the camera (on mouse move, touch drag, mousewheel scroll, ...).
         * 
         * @param {*} e A mouse or touch events data.
         * @param {String} source The source of the input ('left', 'middle', 'right', 'wheel', ...).
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'update',
        value: function update(e, source) {
            if (source == 'left' && !this.rotationLocked) {
                // Rotate
                this._dTheta = -2 * Math.PI * e.x / (this.canvas.clientWidth * this.camera.zoom);
                this._dPhi = -2 * Math.PI * e.y / (this.canvas.clientHeight * this.camera.zoom);

                // It's just to fast like this ...
                // this._dTheta = -2 * Math.PI * e.x / this.canvas.clientWidth;
                // this._dPhi = -2 * Math.PI * e.y / this.canvas.clientHeight;
            } else if (source == 'right' || source == 'left' && this.rotationLocked) {
                // Translate
                var x = e.x * (this.camera.right - this.camera.left) / this.camera.zoom / this.canvas.clientWidth;
                var y = e.y * (this.camera.top - this.camera.bottom) / this.camera.zoom / this.canvas.clientHeight;

                var u = this.camera.getUpVector().components;
                var r = this.camera.getRightVector().components;

                this._dPan.components[0] = r[0] * -x + u[0] * y;
                this._dPan.components[1] = r[1] * -x + u[1] * y;
                this._dPan.components[2] = r[2] * -x + u[2] * y;
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
            this.spherical.components[1] += this._dPhi;
            this.spherical.components[2] += this._dTheta;
            this.spherical.limit(0, this.yRotationLimit, -Infinity, Infinity);
            this.spherical.secure();

            // Limit radius here
            this.lookAt.add(this._dPan);
            offset.setFromSphericalCoords(this.spherical);

            this.camera.position.copyFrom(this.lookAt).add(offset);
            this.camera.setLookAt(this.lookAt);
            this.camera.updateViewMatrix();

            this._dPhi = 0.0;
            this._dTheta = 0.0;
            this._dPan.set(0, 0, 0);

            this.raiseEvent('updated');

            return this;
        }

        /**
         * Moves the camera around the sphere by spherical coordinates.
         * 
         * @param {Number} phi The phi component of the spherical coordinates.
         * @param {Number} theta The theta component of the spherical coordinates.
         * @returns {Lore.OrbitalControls} Returns itself.
         */

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

        /**
         * Zoom in on the lookat vector.
         * 
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'zoomIn',
        value: function zoomIn() {
            this.camera.zoom = Math.max(0, this.camera.zoom / this.scale);
            this.camera.updateProjectionMatrix();
            this.raiseEvent('zoomchanged', this.camera.zoom);
            this.raiseEvent('updated');

            return this;
        }

        /**
         * Zoom out from the lookat vector.
         * 
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'zoomOut',
        value: function zoomOut() {
            this.camera.zoom = Math.max(0, this.camera.zoom * this.scale);
            this.camera.updateProjectionMatrix();
            this.raiseEvent('zoomchanged', this.camera.zoom);
            this.raiseEvent('updated');

            return this;
        }

        /**
         * Set the zoom to a given value.
         * 
         * @param {Number} zoom The zoom value.
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'setZoom',
        value: function setZoom(zoom) {
            this.camera.zoom = zoom;
            this.camera.updateProjectionMatrix();
            this.raiseEvent('zoomchanged', this.camera.zoom);
            this.raiseEvent('updated');

            return this;
        }

        /**
         * Set the camera to the top view (locks rotation).
         * 
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'setTopView',
        value: function setTopView() {
            this.setView(0.0, 2.0 * Math.PI);
            this.rotationLocked = true;

            return this;
        }

        /**
         * Set the camera to the bottom view (locks rotation).
         * 
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'setBottomView',
        value: function setBottomView() {
            this.setView(0.0, 0.0);
            this.rotationLocked = true;

            return this;
        }

        /**
         * Set the camera to the right view (locks rotation).
         * 
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'setRightView',
        value: function setRightView() {
            this.setView(0.5 * Math.PI, 0.5 * Math.PI);
            this.rotationLocked = true;

            return this;
        }

        /**
         * Set the camera to the left view (locks rotation).
         * 
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'setLeftView',
        value: function setLeftView() {
            this.setView(0.5 * Math.PI, -0.5 * Math.PI);
            this.rotationLocked = true;

            return this;
        }

        /**
         * Set the camera to the front view (locks rotation).
         * 
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'setFrontView',
        value: function setFrontView() {
            this.setView(0.5 * Math.PI, 2.0 * Math.PI);
            this.rotationLocked = true;

            return this;
        }

        /**
         * Set the camera to the back view (locks rotation).
         * 
         * @returns {Lore.OrbitalControls} Returns itself.
         */

    }, {
        key: 'setBackView',
        value: function setBackView() {
            this.setView(0.5 * Math.PI, Math.PI);
            this.rotationLocked = true;

            return this;
        }

        /**
         * Set the camera to free view (unlocks rotation).
         * 
         * @returns {Lore.OrbitalControls} Returns itself.
         */

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

/** A class representing orbital controls. */
Lore.FirstPersonControls = function (_Lore$ControlsBase2) {
    _inherits(FirstPersonControls, _Lore$ControlsBase2);

    /**
     * Creates an instance of FirstPersonControls.
     * @param {Renderer} renderer An instance of a Lore renderer.
     */
    function FirstPersonControls(renderer, radius) {
        _classCallCheck(this, FirstPersonControls);

        var _this4 = _possibleConstructorReturn(this, (FirstPersonControls.__proto__ || Object.getPrototypeOf(FirstPersonControls)).call(this, renderer));

        _this4.up = Lore.Vector3f.up();
        _this4.renderer = renderer;
        _this4.camera = renderer.camera;
        _this4.canvas = renderer.canvas;

        _this4.lookAt = lookAt || new Lore.Vector3f();

        _this4.camera.position = new Lore.Vector3f(radius, radius, radius);
        _this4.camera.updateProjectionMatrix();
        _this4.camera.updateViewMatrix();

        _this4.rotationLocked = false;

        var that = _this4;

        _this4.addEventListener('mousedrag', function (e) {
            that.update(e.e, e.source);
        });

        // Initial update
        _this4.update({
            x: 0,
            y: 0
        }, 'left');
        return _this4;
    }

    /**
     * Update the camera (on mouse move, touch drag, mousewheel scroll, ...).
     * 
     * @param {any} e A mouse or touch events data.
     * @param {String} source The source of the input ('left', 'middle', 'right', 'wheel', ...).
     * @returns {FirstPersonControls} Returns itself.
     */


    _createClass(FirstPersonControls, [{
        key: 'update',
        value: function update(e, source) {
            if (source === 'left') {}
            // Move forward here


            // Update the camera
            var offset = this.camera.position.clone().subtract(this.lookAt);

            this.camera.position.copyFrom(this.lookAt).add(offset);
            this.camera.setLookAt(this.lookAt);
            this.camera.updateViewMatrix();

            this.raiseEvent('updated');

            return this;
        }
    }]);

    return FirstPersonControls;
}(Lore.ControlsBase);

/** 
 * An abstract class representing the base for camera implementations. 
 * 
 * @property {string} type The type name of this object (Lore.CameraBase).
 * @property {Lore.Renderer} renderer A Lore.Renderer object.
 * @property {boolean} isProjectionMatrixStale A boolean indicating whether or not the projection matrix was changed and has to be updated.
 * @property {Lore.ProjectionMatrix} projectionMatrix A Lore.ProjectionMatrix object.
 * @property {Lore.Matrix4f} viewMatrix A Lore.Matrix4f object representing the view matrix for this camera.
 * */
Lore.CameraBase = function (_Lore$Node2) {
    _inherits(CameraBase, _Lore$Node2);

    /**
     * Creates an instance of CameraBase.
     */
    function CameraBase() {
        _classCallCheck(this, CameraBase);

        var _this5 = _possibleConstructorReturn(this, (CameraBase.__proto__ || Object.getPrototypeOf(CameraBase)).call(this));

        _this5.type = 'Lore.CameraBase';
        _this5.renderer = null;
        _this5.isProjectionMatrixStale = false;
        _this5.isViewMatrixStale = false;
        _this5.projectionMatrix = new Lore.ProjectionMatrix();
        _this5.viewMatrix = new Lore.Matrix4f();
        return _this5;
    }

    /**
     * Initializes this camera instance.
     * 
     * @param {any} gl A gl context.
     * @param {any} program A program pointer.
     * @returns {CameraBase} Returns itself.
     */


    _createClass(CameraBase, [{
        key: 'init',
        value: function init(gl, program) {
            this.gl = gl;
            this.program = program;

            return this;
        }

        /**
         * Sets the lookat of this camera instance.
         * 
         * @param {Vector3f} vec The vector to set the lookat to.
         * @returns {CameraBase} Returns itself.
         */

    }, {
        key: 'setLookAt',
        value: function setLookAt(vec) {
            this.rotation.lookAt(this.position, vec, Lore.Vector3f.up());

            return this;
        }

        /**
         * Has to be called when the viewport size changes (e.g. window resize).
         * 
         * @param {Number} width The width of the viewport.
         * @param {Number} height The height of the viewport.
         */

    }, {
        key: 'updateViewport',
        value: function updateViewport(width, height) {
            return this;
        }

        /**
         * Virtual Method
         * 
         * @returns {Vector3f} Returns itself.
         */

    }, {
        key: 'updateProjectionMatrix',
        value: function updateProjectionMatrix() {
            return this;
        }

        /**
         * Upates the view matrix of this camera.
         * 
         * @returns {Vector3f} Returns itself.
         */

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

        /**
         * Returns the projection matrix of this camera instance as an array.
         * 
         * @returns {Float32Array} The entries of the projection matrix.
         */

    }, {
        key: 'getProjectionMatrix',
        value: function getProjectionMatrix() {
            return this.projectionMatrix.entries;
        }

        /**
         * Returns the view matrix of this camera instance as an array.
         * 
         * @returns {Float32Array} The entries of the view matrix.
         */

    }, {
        key: 'getViewMatrix',
        value: function getViewMatrix() {
            return this.viewMatrix.entries;
        }

        /**
         * Projects a vector into screen space.
         * 
         * @param {Vector3f} vec A vector.
         * @param {Renderer} renderer An instance of a Lore renderer.
         * @returns {Array} An array containing the x and y position in screen space.
         */

    }, {
        key: 'sceneToScreen',
        value: function sceneToScreen(vec, renderer) {
            var vector = vec.clone();
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

/** 
 * A class representing an orthographic camera. 
 * 
 * @property {number} [zoom=1.0] The zoom value of this camera.
 * @property {number} left The left border of the frustum.
 * @property {number} right The right border of the frustum.
 * @property {number} top The top border of the frustum.
 * @property {number} bottom The bottom border of the frustum.
 * @property {number} near The near plane distance of the frustum.
 * @property {number} far The far plane distance of the frustum.
 * */
Lore.OrthographicCamera = function (_Lore$CameraBase) {
    _inherits(OrthographicCamera, _Lore$CameraBase);

    /**
     * Creates an instance of OrthographicCamera.
     * @param {Number} left Left extend of the viewing volume.
     * @param {Number} right Right extend of the viewing volume.
     * @param {Number} top Top extend of the viewing volume.
     * @param {Number} bottom Bottom extend of the viewing volume.
     * @param {Number} near Near extend of the viewing volume.
     * @param {Number} far Far extend of the viewing volume.
     */
    function OrthographicCamera(left, right, top, bottom) {
        var near = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.1;
        var far = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 2500;

        _classCallCheck(this, OrthographicCamera);

        var _this6 = _possibleConstructorReturn(this, (OrthographicCamera.__proto__ || Object.getPrototypeOf(OrthographicCamera)).call(this));

        _this6.type = 'Lore.OrthographicCamera';
        _this6.zoom = 1.0;
        _this6.left = left;
        _this6.right = right;
        _this6.top = top;
        _this6.bottom = bottom;
        _this6.near = near;
        _this6.far = far;

        _this6.updateProjectionMatrix();
        return _this6;
    }

    /**
     * Updates the projection matrix of this orthographic camera.
     * 
     */


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

        /**
         * Has to be called when the viewport size changes (e.g. window resize).
         * 
         * @param {Number} width The width of the viewport.
         * @param {Number} height The height of the viewport.
         */

    }, {
        key: 'updateViewport',
        value: function updateViewport(width, height) {
            this.left = -width / 2.0;
            this.right = width / 2.0;
            this.top = height / 2.0;
            this.bottom = -height / 2.0;
        }
    }]);

    return OrthographicCamera;
}(Lore.CameraBase);

/** A class representing an perspective camera. */
Lore.PerspectiveCamera = function (_Lore$CameraBase2) {
    _inherits(PerspectiveCamera, _Lore$CameraBase2);

    /**
     * Creates an instance of PerspectiveCamera.
     * @param {Number} fov The field of view.
     * @param {Number} aspect The aspect ration (width / height).
     * @param {Number} near Near extend of the viewing volume.
     * @param {Number} far Far extend of the viewing volume.
     */
    function PerspectiveCamera(fov, aspect) {
        var near = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.1;
        var far = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2500;

        _classCallCheck(this, PerspectiveCamera);

        var _this7 = _possibleConstructorReturn(this, (PerspectiveCamera.__proto__ || Object.getPrototypeOf(PerspectiveCamera)).call(this));

        _this7.type = 'Lore.PerspectiveCamera';

        // TODO: There shouldn't be a zoom here. The problem is, that the orbital controls
        // and also the point helper and zoom rely on it. However, for the perspective camera,
        // zooming is achieved by adjusting the fov. 
        _this7.zoom = 1.0;
        _this7.fov = fov;
        _this7.aspect = aspect;
        _this7.near = near;
        _this7.far = far;

        _this7.updateProjectionMatrix();
        return _this7;
    }

    /**
     * Updates the projection matrix of this perspective camera.
     * 
     */


    _createClass(PerspectiveCamera, [{
        key: 'updateProjectionMatrix',
        value: function updateProjectionMatrix() {
            this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
            this.isProjectionMatrixStale = true;
        }

        /**
         * Has to be called when the viewport size changes (e.g. window resize).
         * 
         * @param {Number} width The width of the viewport.
         * @param {Number} height The height of the viewport.
         */

    }, {
        key: 'updateViewport',
        value: function updateViewport(width, height) {
            this.aspect = width / height;
        }
    }]);

    return PerspectiveCamera;
}(Lore.CameraBase);

/** 
 * A class representing 3D float vector.
 * 
 * @property {Float32Array} components A typed array storing the components of this vector.
 */
Lore.Vector3f = function () {
    /**
     * Creates an instance of Vector3f.
     * @param {Number} x The x component of the vector.
     * @param {Number} y The y component of the vector.
     * @param {Number} z The z component of the vector.
     */
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

    /**
     * Sets the x, y and z components of this vector.
     * 
     * @param {Number} x The x component of the vector.
     * @param {Number} y The y component of the vector.
     * @param {Number} z The z component of the vector.
     * @returns {Lore.Vector3f} Returns itself.
     */


    _createClass(Vector3f, [{
        key: 'set',
        value: function set(x, y, z) {
            this.components[0] = x;
            this.components[1] = y;
            this.components[2] = z;

            return this;
        }

        /**
         * Gets the x component of this vector.
         * 
         * @returns {Number} The x component of this vector.
         */

    }, {
        key: 'getX',
        value: function getX() {
            return this.components[0];
        }

        /**
        * Gets the y component of this vector.
        * 
        * @returns {Number} The y component of this vector.
        */

    }, {
        key: 'getY',
        value: function getY() {
            return this.components[1];
        }

        /**
        * Gets the z component of this vector.
        * 
        * @returns {Number} The z component of this vector.
        */

    }, {
        key: 'getZ',
        value: function getZ() {
            return this.components[2];
        }

        /**
         * Sets the x component of this vector.
         * 
         * @param {Number} x The value to which the x component of this vectors will be set.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'setX',
        value: function setX(x) {
            this.components[0] = x;

            return this;
        }

        /**
         * Sets the y component of this vector.
         * 
         * @param {Number} y The value to which the y component of this vectors will be set.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'setY',
        value: function setY(y) {
            this.components[1] = y;

            return this;
        }

        /**
         * Sets the z component of this vector.
         * 
         * @param {Number} z The value to which the z component of this vectors will be set.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'setZ',
        value: function setZ(z) {
            this.components[2] = z;

            return this;
        }

        /**
         * Sets this vector from spherical coordinates.
         * 
         * @param {Lore.SphericalCoordinates} s A spherical coordinates object.
         * @returns {Lore.Vector3f} Returns itself.
         */

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

        /**
         * Copies the values from another vector
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'copyFrom',
        value: function copyFrom(v) {
            this.components[0] = v.components[0];
            this.components[1] = v.components[1];
            this.components[2] = v.components[2];

            return this;
        }

        /**
         * Set the length / magnitude of the vector.
         * 
         * @param {Number} length The length / magnitude to set the vector to.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'setLength',
        value: function setLength(length) {
            return this.multiplyScalar(length / this.length());
        }

        /**
         * Get the square of the length / magnitude of the vector.
         * 
         * @returns {Number} The square of length / magnitude of the vector.
         */

    }, {
        key: 'lengthSq',
        value: function lengthSq() {
            return this.components[0] * this.components[0] + this.components[1] * this.components[1] + this.components[2] * this.components[2];
        }

        /**
         * The length / magnitude of the vector.
         * 
         * @returns {Number} The length / magnitude of the vector.
         */

    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.lengthSq());
        }

        /**
         * Normalizes the vector.
         * 
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'normalize',
        value: function normalize() {
            return this.divideScalar(this.length());
        }

        /**
         * Multiply the vector with another vector.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'multiply',
        value: function multiply(v) {
            this.components[0] *= v.components[0];
            this.components[1] *= v.components[1];
            this.components[2] *= v.components[2];

            return this;
        }

        /**
         * Multiplies this vector with a scalar.
         * 
         * @param {Number} s A scalar.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(s) {
            this.components[0] *= s;
            this.components[1] *= s;
            this.components[2] *= s;

            return this;
        }

        /**
         * Divides the vector by another vector.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'divide',
        value: function divide(v) {
            this.components[0] /= v.components[0];
            this.components[1] /= v.components[1];
            this.components[2] /= v.components[2];

            return this;
        }

        /**
         * Divides the vector by a scalar.
         * 
         * @param {Number} s A scalar.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'divideScalar',
        value: function divideScalar(s) {
            this.components[0] /= s;
            this.components[1] /= s;
            this.components[2] /= s;

            return this;
        }

        /**
         * Sums the vector with another.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'add',
        value: function add(v) {
            this.components[0] += v.components[0];
            this.components[1] += v.components[1];
            this.components[2] += v.components[2];

            return this;
        }

        /**
         * Substracts a vector from this one.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Lore.Vector3f} Returns itself.
         */

    }, {
        key: 'subtract',
        value: function subtract(v) {
            this.components[0] -= v.components[0];
            this.components[1] -= v.components[1];
            this.components[2] -= v.components[2];

            return this;
        }

        /**
         * Calculates the dot product for the vector with another vector.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Number} The dot product of the two vectors.
         */

    }, {
        key: 'dot',
        value: function dot(v) {
            return this.components[0] * v.components[0] + this.components[1] * v.components[1] + this.components[2] * v.components[2];
        }

        /**
         * Calculates the cross product for the vector with another vector.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Number} The cross product of the two vectors.
         */

    }, {
        key: 'cross',
        value: function cross(v) {
            return new Lore.Vector3f(this.components[1] * v.components[2] - this.components[2] * v.components[1], this.components[2] * v.components[0] - this.components[0] * v.components[2], this.components[0] * v.components[1] - this.components[1] * v.components[0]);
        }

        /**
         * Projects the vector from world space into camera space.
         * 
         * @param {Lore.CameraBase} camera A camera instance.
         * @returns {Lore.Vector3f} The vector in camera space.
         */

    }, {
        key: 'project',
        value: function project(camera) {
            return this.applyProjection(Lore.Matrix4f.multiply(camera.projectionMatrix, Lore.Matrix4f.invert(camera.modelMatrix)));
        }

        /**
         * Projects the vector from camera space into world space.
         * 
         * @param {Lore.CameraBase} camera A camera instance.
         * @returns {Lore.Vector3f} The vector in world space.
         */

    }, {
        key: 'unproject',
        value: function unproject(camera) {
            return this.applyProjection(Lore.Matrix4f.multiply(camera.modelMatrix, Lore.Matrix4f.invert(camera.projectionMatrix)));
        }

        /**
         * Applies a projection matrix to the vector.
         * 
         * @param {Lore.Matrix4f} m A (projection) matrix.
         * @returns {Lore.Vector3f} Returns itself.
         */

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

        /**
         * Rotates the vector into the direction defined by the rotational component of a matrix.
         * 
         * @param {Lore.Matrix4f} m A matrix.
         * @returns {Lore.Vector3f} Returns itself.
         */

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

        /**
         * Applies a quaternion to the vector (usually a rotation).
         * 
         * @param {Lore.Quaternion} q Quaternion.
         * @returns {Lore.Vector3f} Returns itself.
         */

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

        /**
         * Calculates the square of the distance to another vector.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Number} The square of the distance to the other vector.
         */

    }, {
        key: 'distanceToSq',
        value: function distanceToSq(v) {
            var dx = this.components[0] - v.components[0];
            var dy = this.components[1] - v.components[1];
            var dz = this.components[2] - v.components[2];

            return dx * dx + dy * dy + dz * dz;
        }

        /**
         * Calculates the distance to another vector.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Number} The distance to the other vector.
         */

    }, {
        key: 'distanceTo',
        value: function distanceTo(v) {
            return Math.sqrt(this.distanceToSq(v));
        }

        /**
         * Clones this vector.
         * 
         * @returns {Lore.Vector3f} A clone of this vector.
         */

    }, {
        key: 'clone',
        value: function clone() {
            return new Lore.Vector3f(this.components[0], this.components[1], this.components[2]);
        }

        /**
         * Compares the components of the vector to those of another.
         * 
         * @param {Lore.Vector3f} v A vector.
         * @returns {Boolean} A vector indicating whether or not the two vectors are equal.
         */

    }, {
        key: 'equals',
        value: function equals(v) {
            return this.components[0] === v.components[0] && this.components[1] === v.components[1] && this.components[2] === v.components[2];
        }

        /**
         * Returns a string representation of the vector.
         * 
         * @returns {String} A string representation of the vector.
         */

    }, {
        key: 'toString',
        value: function toString() {
            return '(' + this.components[0] + ', ' + this.components[1] + ', ' + this.components[2] + ')';
        }

        /**
         * Normalizes a vector.
         * 
         * @static
         * @param {Lore.Vector3f} v A vector. 
         * @returns {Lore.Vector3f} The noramlized vector.
         */

    }], [{
        key: 'normalize',
        value: function normalize(v) {
            return Lore.Vector3f.divideScalar(v, v.length());
        }

        /**
         * Multiplies two vectors.
         * 
         * @static
         * @param {Lore.Vector3f} u A vector. 
         * @param {Lore.Vector3f} v A vector. 
         * @returns {Lore.Vector3f} The product of the two vectors.
         */

    }, {
        key: 'multiply',
        value: function multiply(u, v) {
            return new Lore.Vector3f(u.components[0] * v.components[0], u.components[1] * v.components[1], u.components[2] * v.components[2]);
        }

        /**
         * Multiplies a vector with a scalar.
         * 
         * @static
         * @param {Lore.Vector3f} v A vector. 
         * @param {Number} s A scalar.
         * @returns {Lore.Vector3f} The vector multiplied by the scalar.
         */

    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(v, s) {
            return new Lore.Vector3f(v.components[0] * s, v.components[1] * s, v.components[2] * s);
        }

        /**
         * Divides a vector by another vector (u / v).
         * 
         * @static
         * @param {Lore.Vector3f} u A vector. 
         * @param {Lore.Vector3f} v A vector. 
         * @returns {Lore.Vector3f} The fraction vector.
         */

    }, {
        key: 'divide',
        value: function divide(u, v) {
            return new Lore.Vector3f(u.components[0] / v.components[0], u.components[1] / v.components[1], u.components[2] / v.components[2]);
        }

        /**
         * Divides a vector by a scalar.
         * 
         * @static
         * @param {Lore.Vector3f} v A vector. 
         * @param {Number} s A scalar.
         * @returns {Lore.Vector3f} The vector divided by the scalar.
         */

    }, {
        key: 'divideScalar',
        value: function divideScalar(v, s) {
            return new Lore.Vector3f(v.components[0] / s, v.components[1] / s, v.components[2] / s);
        }

        /**
         * Sums two vectors.
         * 
         * @static
         * @param {Lore.Vector3f} u A vector. 
         * @param {Lore.Vector3f} v A vector. 
         * @returns {Lore.Vector3f} The sum of the two vectors.
         */

    }, {
        key: 'add',
        value: function add(u, v) {
            return new Lore.Vector3f(u.components[0] + v.components[0], u.components[1] + v.components[1], u.components[2] + v.components[2]);
        }

        /**
         * Subtracts one scalar from another (u - v)
         * 
         * @static
         * @param {Lore.Vector3f} u A vector. 
         * @param {Lore.Vector3f} v A vector. 
         * @returns {Lore.Vector3f} The difference between the two vectors.
         */

    }, {
        key: 'subtract',
        value: function subtract(u, v) {
            return new Lore.Vector3f(u.components[0] - v.components[0], u.components[1] - v.components[1], u.components[2] - v.components[2]);
        }

        /**
         * Calculates the cross product of two vectors.
         * 
         * @static
         * @param {Lore.Vector3f} u A vector. 
         * @param {Lore.Vector3f} v A vector. 
         * @returns {Lore.Vector3f} The cross product of the two vectors.
         */

    }, {
        key: 'cross',
        value: function cross(u, v) {
            return new Lore.Vector3f(u.components[1] * v.components[2] - u.components[2] * v.components[1], u.components[2] * v.components[0] - u.components[0] * v.components[2], u.components[0] * v.components[1] - u.components[1] * v.components[0]);
        }

        /**
         * Calculates the dot product of two vectors.
         * 
         * @static
         * @param {Lore.Vector3f} u A vector. 
         * @param {Lore.Vector3f} v A vector. 
         * @returns {Number} The dot product of the two vectors.
         */

    }, {
        key: 'dot',
        value: function dot(u, v) {
            return u.components[0] * v.components[0] + u.components[1] * v.components[1] + u.components[2] * v.components[2];
        }

        /**
         * Returns the forward vector (0, 0, 1).
         * 
         * @static
         * @returns {Lore.Vector3f} The forward vector.
         */

    }, {
        key: 'forward',
        value: function forward() {
            return new Lore.Vector3f(0, 0, 1);
        }

        /**
         * Returns the up vector (0, 1, 0).
         * 
         * @static
         * @returns {Lore.Vector3f} The up vector.
         */

    }, {
        key: 'up',
        value: function up() {
            return new Lore.Vector3f(0, 1, 0);
        }

        /**
         * Returns the right vector (1, 0, 0).
         * 
         * @static
         * @returns {Lore.Vector3f} The right vector.
         */

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

/** A class representing a 4x4 float matrix */
Lore.Matrix4f = function () {
    // Do NOT go double precision on GPUs!!!
    // See:
    // http://stackoverflow.com/questions/2079906/float-vs-double-on-graphics-hardware

    /**
     * Creates an instance of Matrix4f.
     * @param {Float32Array} [entries=new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])] 
     */
    function Matrix4f() {
        var entries = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

        _classCallCheck(this, Matrix4f);

        this.entries = entries;
    }

    /**
     * 
     * 
     * @param {Number} m00 A matrix entry.
     * @param {Number} m10 A matrix entry.
     * @param {Number} m20 A matrix entry.
     * @param {Number} m30 A matrix entry.
     * @param {Number} m01 A matrix entry.
     * @param {Number} m11 A matrix entry.
     * @param {Number} m21 A matrix entry.
     * @param {Number} m31 A matrix entry.
     * @param {Number} m02 A matrix entry.
     * @param {Number} m12 A matrix entry.
     * @param {Number} m22 A matrix entry.
     * @param {Number} m32 A matrix entry.
     * @param {Number} m03 A matrix entry.
     * @param {Number} m13 A matrix entry.
     * @param {Number} m23 A matrix entry.
     * @param {Number} m33 A matrix entry.
     * @returns {Matrix4f} Returns itself.
     */


    _createClass(Matrix4f, [{
        key: 'set',
        value: function set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33) {
            this.entries.set([m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33]);

            return this;
        }

        /**
         * Multiplies this matrix with another matrix (a * b).
         * 
         * @param {any} b Another matrix.
         * @returns {Matrix4f} Returns itself.
         */

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

        /**
        * Multiplies another matrix with this matrix (a * b).
        * 
        * @param {any} a Another matrix.
        * @returns {Matrix4f} Returns itself.
        */

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

        /**
         * Set the scale component of this matrix.
         * 
         * @param {Vector3f} v The scaling vector.
         * @returns {Matrix4f} Returns itself.
         */

    }, {
        key: 'scale',
        value: function scale(vec) {
            var x = vec.components[0];
            var y = vec.components[1];
            var z = vec.components[2];

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

        /**
         * Set the position component of this matrix.
         * 
         * @param {any} vec The position vector.
         * @returns {Matrix4f} Returns itself.
         */

    }, {
        key: 'setPosition',
        value: function setPosition(vec) {
            this.entries[12] = vec.components[0];
            this.entries[13] = vec.components[1];
            this.entries[14] = vec.components[2];

            return this;
        }

        /**
         * Set the rotation component of this matrix.
         * 
         * @param {Quaternion} q A quaternion representing the rotation.
         * @returns {Matrix4f} Returns itself.
         */

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

        /**
         * Get the determinant of the matrix.
         * 
         * @returns {Number} The determinant of this matrix.
         */

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

        /**
         * Decomposes the matrix into its positional, rotational and scaling component.
         * 
         * @param {Vector3f} outPosition The positional component will be written to this vector.
         * @param {Quaternion} outQuaternion The rotational component will be written to this quaternion.
         * @param {Vector3f} outScale The scaling component will be written to this vector.
         * @returns {Matrix4f} Returns itself.
         */

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

        /**
         * Composes the matrix from the positional, rotational and scaling components.
         * 
         * @param {Vector3f} position The positional component.
         * @param {Quaternion} quaternion The rotational component.
         * @param {Vector3f} scale The scaling component.
         * @returns {Matrix4f} Returns itself.
         */

    }, {
        key: 'compose',
        value: function compose(position, quaternion, scale) {
            this.setRotation(quaternion);
            this.scale(scale);
            this.setPosition(position);

            return this;
        }

        /**
         * Inverts this matrix.
         * 
         * @returns {Matrix4f} Returns itself.
         */

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

        /**
         * Clones this matrix.
         * 
         * @returns {Matrix4f} A clone of the matrix.
         */

    }, {
        key: 'clone',
        value: function clone() {
            return new Lore.Matrix4f(new Float32Array(this.entries));
        }

        /**
         * Checks whether or not the entries of the two matrices match.
         * 
         * @param {Matrix4f} a A matrix.
         * @returns {Boolean} A boolean indicating whether or not the entries of the two matrices match.
         */

    }, {
        key: 'equals',
        value: function equals(a) {
            for (var i = 0; i < this.entries.length; i++) {
                if (this.entries[i] !== a.entries[i]) return false;
            }

            return true;
        }

        /**
         * Returns a string representation of the matrix.
         * 
         * @returns {String} The string representation of this matrix.
         */

    }, {
        key: 'toString',
        value: function toString() {
            var str = this.entries[0] + ', ' + this.entries[4] + ', ' + this.entries[8] + ', ' + this.entries[12] + '\n';
            str += this.entries[1] + ', ' + this.entries[5] + ', ' + this.entries[9] + ', ' + this.entries[13] + '\n';
            str += this.entries[2] + ', ' + this.entries[6] + ', ' + this.entries[10] + ', ' + this.entries[14] + '\n';
            str += this.entries[3] + ', ' + this.entries[7] + ', ' + this.entries[11] + ', ' + this.entries[15] + '\n';

            return str;
        }

        /**
         * Multiply the two matrices (a * b).
         * 
         * @static
         * @param {any} a A matrix to be multiplied.
         * @param {any} b A matrix to be multiplied.
         * @returns {Matrix4f} A matrix.
         */

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

        /**
         * Initialize a matrix from a quaternion.
         * 
         * @static
         * @param {Quaternion} q A quaternion.
         * @returns {Matrix4f} A matrix.
         */

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

        /**
         * Create a lookat matrix for a camera.
         * 
         * @static
         * @param {Vector3f} cameraPosition The position of the camera.
         * @param {Vector3f} target The lookat (target) of the camera.
         * @param {Vector3f} up The up vector of the camera node.
         * @returns {Matrix4f} A matrix.
         */

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

        /**
         * Composes a matrix from the positional, rotational and scaling components.
         * 
         * @param {Vector3f} position The positional component.
         * @param {Quaternion} quaternion The rotational component.
         * @param {Vector3f} scale The scaling component.
         * @returns {Matrix4f} A matrix.
         */

    }, {
        key: 'compose',
        value: function compose(position, quaternion, scale) {
            var m = new Lore.Matrix4f();

            m.setRotation(quaternion);
            m.scale(scale);
            m.setPosition(position);

            return m;
        }

        /**
         * Inverts a matrix.
         * 
         * @static
         * @param {Matrix4f} matrix A matrix to be inverted.
         * @returns The inverted matrix.
         */

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

/** 
 * A class representing a quaternion.
 * 
 * @property {Float32Array} components A typed array storing the components of this quaternion.
 */
Lore.Quaternion = function () {
    /**
     * Creates an instance of Quaternion.
     * @param {Number} x The x component of the quaternion.
     * @param {Number} y The y component of the quaternion.
     * @param {Number} z The z component of the quaternion.
     * @param {Number} w The w component of the quaternion.
     */
    function Quaternion(x, y, z, w) {
        _classCallCheck(this, Quaternion);

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
    }

    /**
     * Get the x component of this quaternion.
     * 
     * @returns {Number} The x component of this quaternion.
     */


    _createClass(Quaternion, [{
        key: 'getX',
        value: function getX() {
            return this.components[0];
        }

        /**
         * Get the y component of this quaternion.
         * 
         * @returns {Number} The y component of this quaternion.
         */

    }, {
        key: 'getY',
        value: function getY() {
            return this.components[1];
        }

        /**
         * Get the z component of this quaternion.
         * 
         * @returns {Number} The z component of this quaternion.
         */

    }, {
        key: 'getZ',
        value: function getZ() {
            return this.components[2];
        }

        /**
         * Get the w component of this quaternion.
         * 
         * @returns {Number} The w component of this quaternion.
         */

    }, {
        key: 'getW',
        value: function getW() {
            return this.components[3];
        }

        /**
         * Set the components of this quaternion.
         * 
         * @param {Number} x The x component of this quaternion.
         * @param {Number} y The y component of this quaternion.
         * @param {Number} z The z component of this quaternion.
         * @param {Number} w The w component of this quaternion.
         * 
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'set',
        value: function set(x, y, z, w) {
            this.components[0] = x;
            this.components[1] = y;
            this.components[2] = z;
            this.components[3] = w;

            return this;
        }

        /**
         * Set the x component of this quaternion.
         * 
         * @param {Number} x The x component of this quaternion.
         * @returns {Quaternion} Returns itself.
         */

    }, {
        key: 'setX',
        value: function setX(x) {
            this.components[0] = x;

            return this;
        }

        /**
         * Set the y component of this quaternion.
         * 
         * @param {Number} y The y component of this quaternion.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'setY',
        value: function setY(y) {
            this.components[1] = y;

            return this;
        }

        /**
         * Set the z component of this quaternion.
         * 
         * @param {Number} z The z component of this quaternion.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'setZ',
        value: function setZ(z) {
            this.components[2] = z;

            return this;
        }

        /**
         * Set the w component of this quaternion.
         * 
         * @param {Number} w The w component of this quaternion.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'setW',
        value: function setW(w) {
            this.components[3] = w;

            return this;
        }

        /**
         * Sets the quaternion from the axis angle representation.
         * 
         * @param {Lore.Vector3f} axis The axis component.
         * @param {Number} angle The angle component.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'setFromAxisAngle',
        value: function setFromAxisAngle(axis, angle) {
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

            return this;
        }

        /**
         * Sets the quaternion from unit vectors.
         * 
         * @param {Lore.Vector3f} from The from vector.
         * @param {Lore.Vector3f} to The to vector.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'setFromUnitVectors',
        value: function setFromUnitVectors(from, to) {
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

            return this;
        }

        /**
         * Set the quaternion based facing in a destionation direction.
         * 
         * @param {Lore.Vector3f} source The source vector (the position).
         * @param {Lore.Vector3f} dest The destination vector.
         * @param {Lore.Vector3f} up The up vector of the source.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'lookAt',
        value: function lookAt(source, dest, up) {
            this.setFromMatrix(Lore.Matrix4f.lookAt(source, dest, up));

            return this;
        }

        /**
         * Get the square length of the quaternion.
         * 
         * @returns {Number} The square of the length.
         */

    }, {
        key: 'lengthSq',
        value: function lengthSq() {
            return this.components[0] * this.components[0] + this.components[1] * this.components[1] + this.components[2] * this.components[2] + this.components[3] * this.components[3];
        }

        /**
         * Get the length of this quaternion.
         * 
         * @returns {Number} The length.
         */

    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.lengthSq());
        }

        /**
         * Get the inverse of this quaternion.
         * 
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'inverse',
        value: function inverse() {
            return this.conjugate().normalize();
        }

        /**
         * Normalizes this quaternion.
         * 
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'normalize',
        value: function normalize() {
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
        }

        /**
         * Get the dot product of this and another quaternion.
         * 
         * @param {Lore.Quaternion} q A quaternion.
         * @returns {Number} The dot product.
         */

    }, {
        key: 'dot',
        value: function dot(q) {
            return this.components[0] * q.components[0] + this.components[1] * q.components[1] + this.components[2] * q.components[2] + this.components[3] * q.components[3];
        }

        /**
         * Multiply this quaternion with another (a * b).
         * 
         * @param {Lore.Quaternion} b Another quaternion.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'multiplyA',
        value: function multiplyA(b) {
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
        }

        /**
         * Multiply another with this quaternion (a * b).
         * 
         * @param {Lore.Quaternion} a Another quaternion.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'multiplyB',
        value: function multiplyB(a) {
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
        }

        /**
         * Multiply this quaternion with a scalar.
         * 
         * @param {Number} s A scalar.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(s) {
            this.components[0] *= s;
            this.components[1] *= s;
            this.components[2] *= s;
            this.components[3] *= s;

            return this;
        }

        /**
         * Conjugate (* -1) this quaternion.
         * 
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'conjugate',
        value: function conjugate() {
            // See:
            // http://www.3dgep.com/understanding-quaternions/#Quaternion_Conjugate
            this.components[0] *= -1;
            this.components[1] *= -1;
            this.components[2] *= -1;

            return this;
        }

        /**
         * Add another quaternion to this one.
         * 
         * @param {Lore.Quaternion} q A quaternion.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'add',
        value: function add(q) {
            this.components[0] += q.components[0];
            this.components[1] += q.components[1];
            this.components[2] += q.components[2];
            this.components[3] += q.components[3];

            return this;
        }

        /**
         * Subtract another quaternion from this one.
         * 
         * @param {Lore.Quaternion} q A quaternion.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'subtract',
        value: function subtract(q) {
            this.components[0] -= q.components[0];
            this.components[1] -= q.components[1];
            this.components[2] -= q.components[2];
            this.components[3] -= q.components[3];

            return this;
        }

        /**
         * Rotate this quaternion around the x axis.
         * 
         * @param {Number} angle An angle in radians.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'rotateX',
        value: function rotateX(angle) {
            var halfAngle = angle / 2.0;
            return this.multiplyA(new Lore.Quaternion(Math.sin(halfAngle), 0.0, 0.0, Math.cos(halfAngle)));
        }

        /**
         * Rotate this quaternion around the y axis.
         * 
         * @param {Number} angle An angle in radians.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'rotateY',
        value: function rotateY(angle) {
            var halfAngle = angle / 2.0;
            return this.multiplyA(new Lore.Quaternion(0.0, Math.sin(halfAngle), 0.0, Math.cos(halfAngle)));
        }

        /**
         * Rotate this quaternion around the y axis.
         * 
         * @param {Number} angle An angle in radians.
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'rotateZ',
        value: function rotateZ(angle) {
            var halfAngle = angle / 2.0;
            return this.multiplyA(new Lore.Quaternion(0.0, 0.0, Math.sin(halfAngle), Math.cos(halfAngle)));
        }
    }, {
        key: 'toAxisAngle',
        value: function toAxisAngle() {
            // It seems like this isn't numerically stable. This could be solved
            // by some checks as described here:
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
            // or here:
            // https://www.flipcode.com/documents/matrfaq.html#Q57
            // However, this function currently isn't used.
            console.warn('The method toAxisAngle() has not been implemented.');
        }

        /**
         * Create a rotation matrix from this quaternion.
         * 
         * @returns {Lore.Matrix4f} A rotation matrix representation of this quaternion.
         */

    }, {
        key: 'toRotationMatrix',
        value: function toRotationMatrix() {
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
        }

        /**
         * Set this quaternion from a (rotation) matrix.
         * 
         * @param {Lore.Matrix4f} m 
         * @returns {Lore.Quaternion} Returns itself.
         */

    }, {
        key: 'setFromMatrix',
        value: function setFromMatrix(m) {
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
        }

        /**
         * Clone this quaternion.
         * 
         * @returns {Lore.Quaternion} A clone of this quaternion.
         */

    }, {
        key: 'clone',
        value: function clone() {
            return new Lore.Quaternion(this.components[0], this.components[1], this.components[2], this.components[3]);
        }

        /**
         * Checks whether the entries of this quaternion match another one.
         * 
         * @param {Lore.Quaternion} q A quaternion.
         * @returns {Boolean} A boolean representing whether the entries of the two quaternions match.
         */

    }, {
        key: 'equals',
        value: function equals(q) {
            return this.components[0] === q.components[0] && this.components[1] === q.components[1] && this.components[2] === q.components[2] && this.components[3] === q.components[3];
        }

        /**
         * Returns a string representation of this quaternion.
         * 
         * @returns {String} A string representing this quaternion.
         */

    }, {
        key: 'toString',
        value: function toString() {
            return 'x: ' + this.getX() + ', y: ' + this.getY() + ', z: ' + this.getZ() + ', w: ' + this.getW();
        }

        /**
         * Calculate the dot product of two quaternions.
         * 
         * @static
         * @param {Lore.Quaternion} q A quaternion.
         * @param {Lore.Quaternion} p A quaternion.
         * @returns {Number} The dot product.
         */

    }], [{
        key: 'dot',
        value: function dot(q, p) {
            return new Lore.Quaternion(q.components[0] * p.components[0] + q.components[1] * p.components[1] + q.components[2] * p.components[2] + q.components[3] * p.components[3]);
        }

        /**
         * Multiply (cross product) two quaternions.
         * 
         * @static
         * @param {Lore.Quaternion} a A quaternion.
         * @param {Lore.Quaternion} b A quaternion.
         * @returns {Lore.Quaternion} The cross product quaternion.
         */

    }, {
        key: 'multiply',
        value: function multiply(a, b) {
            return new Lore.Quaternion(a.components[0] * b.components[3] + a.components[3] * b.components[0] + a.components[1] * b.components[2] - a.components[2] * b.components[1], a.components[1] * b.components[3] + a.components[3] * b.components[1] + a.components[2] * b.components[0] - a.components[0] * b.components[2], a.components[2] * b.components[3] + a.components[3] * b.components[2] + a.components[0] * b.components[1] - a.components[1] * b.components[0], a.components[3] * b.components[3] + a.components[0] * b.components[0] + a.components[1] * b.components[1] - a.components[2] * b.components[2]);
        }

        /**
         * Multiplies a quaternion with a scalar.
         * 
         * @static
         * @param {Lore.Quaternion} q A quaternion.
         * @param {Number} s A scalar.
         * @returns {Lore.Quaternion} The resulting quaternion.
         */

    }, {
        key: 'multiplyScalar',
        value: function multiplyScalar(q, s) {
            return new Lore.Quaternion(q.components[0] * s, q.components[1] * s, q.components[2] * s, q.components[3] * s);
        }

        /**
         * Inverse a quaternion.
         * 
         * @static
         * @param {Lore.Quaternion} q A quaternion.
         * @returns {Lore.Quaternion} The resulting quaternion.
         */

    }, {
        key: 'inverse',
        value: function inverse(q) {
            var p = new Lore.Quaternion(q.components);
            return p.conjugate().normalize();
        }

        /**
         * Normalize a quaternion.
         * 
         * @static
         * @param {Lore.Quaternion} q A quaternion.
         * @returns {Lore.Quaternion} The resulting quaternion.
         */

    }, {
        key: 'normalize',
        value: function normalize(q) {
            var length = q.length();

            if (length === 0) {
                return new Lore.Quaternion(0.0, 0.0, 0.0, 1.0);
            } else {
                var inv = 1 / length;
                return new Lore.Quaternion(q.components[0] * inv, q.components[1] * inv, q.components[2] * inv, q.components[3] * inv);
            }
        }

        /**
         * Conjugate (* -1) a quaternion.
         * 
         * @static
         * @param {Lore.Quaternion} q A quaternion.
         * @returns {Lore.Quaternion} The resulting quaternion.
         */

    }, {
        key: 'conjugate',
        value: function conjugate(q) {
            return new Lore.Quaternion(q.components[0] * -1, q.components[1] * -1, q.components[2] * -1, q.components[3]);
        }

        /**
         * Sum two quaternions.
         * 
         * @static
         * @param {Lore.Quaternion} q A quaternion.
         * @param {Lore.Quaternion} p A quaternion.
         * @returns {Lore.Quaternion} The resulting quaternion.
         */

    }, {
        key: 'add',
        value: function add(q, p) {
            return new Lore.Quaternion(q.components[0] + p.components[0], q.components[1] + p.components[1], q.components[2] + p.components[2], q.components[3] + p.components[3]);
        }

        /**
         * Subtract a quaternion from another (q - p).
         * 
         * @static
         * @param {Lore.Quaternion} q A quaternion.
         * @param {Lore.Quaternion} p A quaternion.
         * @returns {Lore.Quaternion} The resulting quaternion.
         */

    }, {
        key: 'subtract',
        value: function subtract(q, p) {
            return new Lore.Quaternion(q.components[0] - p.components[0], q.components[1] - p.components[1], q.components[2] - p.components[2], q.components[3] - p.components[3]);
        }

        /**
         * Create a quaternion from a matrix.
         * 
         * @static
         * @param {Lore.Matrix4f} m A matrix.
         * @returns {Lore.Quaternion} The resulting quaternion.
         */

    }, {
        key: 'fromMatrix',
        value: function fromMatrix(m) {
            var q = new Lore.Quaternion();
            q.setFromMatrix(m);
            return q;
        }

        /**
         * Interpolate between two quaternions (t is between 0 and 1).
         * 
         * @static
         * @param {Lore.Quaternion} q The source quaternion.
         * @param {Lore.Quaternion} p The target quaternion.
         * @param {Number} t The interpolation value / percentage (between 0 an 1).
         * @returns {Lore.Quaternion} The resulting quaternion.
         */

    }, {
        key: 'slerp',
        value: function slerp(q, p, t) {
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
        }
    }]);

    return Quaternion;
}();
/** A class representing spherical coordinates. */
Lore.SphericalCoords = function () {
    /**
     * Creates an instance of SphericalCoords.
     * @param {Number} radius The radius.
     * @param {Number} phi Phi in radians.
     * @param {Number} theta Theta in radians.
     */
    function SphericalCoords(radius, phi, theta) {
        _classCallCheck(this, SphericalCoords);

        this.components = new Float32Array(3);
        this.radius = radius !== undefined ? radius : 1.0;
        this.phi = phi ? phi : 0.0;
        this.theta = theta ? theta : 0.0;
    }

    /**
     * Set the spherical coordinates from the radius, the phi angle and the theta angle.
     * 
     * @param {Number} radius 
     * @param {Number} phi 
     * @param {Number} theta 
     * @returns {SphericalCoords} Returns itself.
     */


    _createClass(SphericalCoords, [{
        key: 'set',
        value: function set(radius, phi, theta) {
            this.components[0] = radius;
            this.components[1] = phi;
            this.components[2] = theta;

            return this;
        }

        /**
         * Avoid overflows.
         * 
         * @returns {SphericalCoords} Returns itself.
         */

    }, {
        key: 'secure',
        value: function secure() {
            this.components[1] = Math.max(0.000001, Math.min(Math.PI - 0.000001, this.components[1]));

            return this;
        }

        /**
         * Set the spherical coordaintes from a vector.
         * 
         * @param {Vector3f} v A vector.
         * @returns {SphericalCoords} Returns itself.
         */

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

        /**
         * Limit the rotation by setting maxima and minima for phi and theta.
         * 
         * @param {Number} phiMin The minimum for phi.
         * @param {Number} phiMax The maximum for phi.
         * @param {Number} thetaMin The minimum for theta.
         * @param {Number} thetaMax The maximum for theta.
         * @returns {SphericalCoords} Returns itself.
         */

    }, {
        key: 'limit',
        value: function limit(phiMin, phiMax, thetaMin, thetaMax) {
            // Limits for orbital controls
            this.components[1] = Math.max(phiMin, Math.min(phiMax, this.components[1]));
            this.components[2] = Math.max(thetaMin, Math.min(thetaMax, this.components[2]));

            return this;
        }

        /**
         * Clone this spherical coordinates object.
         * 
         * @returns {SphericalCoords} A clone of the spherical coordinates object.
         */

    }, {
        key: 'clone',
        value: function clone() {
            return new Lore.SphericalCoords(this.radius, this.phi, this.theta);
        }

        /**
         * Returns a string representation of these spherical coordinates.
         * 
         * @returns {String} A string representing spherical coordinates.
         */

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

        /**
         * Set the projection matrix to a perspective projection.
         *
         * @param {number} fov The field of view.
         * @param {number} aspect The aspect ratio (width / height).
         * @param {number} near The near-cutoff value.
         * @param {number} far The far-cutoff value.
         * @returns {ProjectionMatrix} Returns this projection matrix.
         */

    }, {
        key: 'setPerspective',
        value: function setPerspective(fov, aspect, near, far) {
            var range = near - far;
            var tanHalfFov = Math.tan(Lore.Utils.DEG2RAD * 0.5 * fov);

            var top = near * tanHalfFov;
            var height = 2.0 * top;
            var width = aspect * height;
            var left = -width / 2.0;
            var right = left + width;
            var bottom = top - height;
            // let bottom = -top;
            // let right = top * aspect;
            // let left = -right;

            var x = 2.0 * near / (right - left);
            var y = 2.0 * near / (top - bottom);

            var a = (right + left) / (right - left);
            var b = (top + bottom) / (top - bottom);
            var c = -(far + near) / (far - near);
            var d = -2 * far * near / (far - near);

            this.set();

            this.entries[0] = x;
            this.entries[4] = 0;
            this.entries[8] = a;
            this.entries[12] = 0;
            this.entries[1] = 0;
            this.entries[5] = y;
            this.entries[9] = b;
            this.entries[13] = 0;
            this.entries[2] = 0;
            this.entries[6] = 0;
            this.entries[10] = c;
            this.entries[14] = d;
            this.entries[3] = 0;
            this.entries[7] = 0;
            this.entries[11] = -1;
            this.entries[15] = 0;

            return this;
        }
    }]);

    return ProjectionMatrix;
}(Lore.Matrix4f);

/** A helper class containing statistics methods. */
Lore.Statistics = function () {
    function Statistics() {
        _classCallCheck(this, Statistics);
    }

    _createClass(Statistics, null, [{
        key: 'transpose2dArray',

        /**
         * Transposes an array of arrays (2d array).
         
         * @param {Array} arr The 2d array to be transposed.
         * @returns {Array} The transpose of the 2d array.
         */
        value: function transpose2dArray(arr) {
            return arr[0].map(function (col, i) {
                return arr.map(function (row) {
                    return row[i];
                });
            });
        }

        /**
         * Returns a normally distributed (pseudo) random number.
         * 
         * @returns {Number} A normally distributed (pseudo) random number.
         */

    }, {
        key: 'randomNormal',
        value: function randomNormal() {
            var val = void 0,
                u = void 0,
                v = void 0,
                s = void 0,
                mul = void 0;

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
        }

        /**
         * Returns a normally distributed (pseudo) random number within a range.
         * 
         * @param {Number} a The start of the range.
         * @param {Number} b The end of the range.
         * @returns {Number} A normally distributed (pseudo) random number within a range.
         */

    }, {
        key: 'randomNormalInRange',
        value: function randomNormalInRange(a, b) {
            var val = void 0;

            do {
                val = Lore.Statistics.randomNormal();
            } while (val < a || val > b);

            return val;
        }

        /**
         * Returns a normally distributed (pseudo) random number around a mean with a standard deviation.
         * 
         * @param {Number} mean The mean.
         * @param {Number} sd The standard deviation.
         * @returns {Number} A normally distributed (pseudo) random number around a mean with a standard deviation.
         */

    }, {
        key: 'randomNormalScaled',
        value: function randomNormalScaled(mean, sd) {
            var r = Lore.Statistics.randomNormalInRange(-1, 1);

            return r * sd + mean;
        }

        /**
         * Normalize / scale an array between 0 and 1.
         * 
         * @param {Number[]} arr An array.
         * @returns {Number[]} The normalized / scaled array.
         */

    }, {
        key: 'normalize',
        value: function normalize(arr) {
            var newArr = arr.slice();
            var max = Number.NEGATIVE_INFINITY;
            var min = Number.POSITIVE_INFINITY;

            for (var i = 0; i < newArr.length; i++) {
                var val = newArr[i];
                if (val > max) max = val;
                if (val < min) min = val;
            }

            var diff = max - min;

            for (var _i = 0; _i < newArr.length; _i++) {
                newArr[_i] = (newArr[_i] - min) / diff;
            }

            return newArr;
        }

        /**
         * Normalize / scale an array between 0 and 1 (outliers will be set to max or min respectively).
         * The IQR method is used for outlier detection.
         * 
         * @param {Number[]} arr An array.
         * @param {Number} q1 The q1 percentage.
         * @param {Number} q3 The q3 percentage.
         * @param {Number} k The IQR scaling factor.
         * @returns {Number[]} The normalized / scaled array.
         */

    }, {
        key: 'normalizeNoOutliers',
        value: function normalizeNoOutliers(arr) {
            var q1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.25;
            var q3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.75;
            var k = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.5;

            var newArr = arr.slice();

            newArr.sort(function (a, b) {
                return a - b;
            });

            var a = Lore.Statistics.getPercentile(newArr, q1);
            var b = Lore.Statistics.getPercentile(newArr, q3);
            var iqr = b - a;
            var lower = a - iqr * k;
            var upper = b + iqr * k;

            var diff = upper - lower;

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] < lower) {
                    newArr[i] = 0.0;
                } else if (arr[i] > upper) {
                    newArr[i] = 1.0;
                } else {
                    newArr[i] = (arr[i] - lower) / diff;
                }
            }

            return newArr;
        }

        /**
         * Gets the percentile from a sorted array.
         * 
         * @param {Number[]} arr A sorted array.
         * @param {Number} percentile The percentile (e.g. 0.25).
         * @returns {Number} The percentile value.
         */

    }, {
        key: 'getPercentile',
        value: function getPercentile(arr, percentile) {
            var index = percentile * arr.length;

            if (Math.floor(index) === index) {
                return (arr[index - 1] + arr[index]) / 2.0;
            } else {
                return arr[Math.floor(index)];
            }
        }

        /**
         * Scales a number to within a given scale.
         * 
         * @param {Number} value The number.
         * @param {Number} oldMin The current minimum.
         * @param {Number} oldMax The current maximum.
         * @param {Number} newMin The cnew minimum.
         * @param {Number} newMax The new maximum.
         * @returns {Number} The scaled number.
         */

    }, {
        key: 'scale',
        value: function scale(value, oldMin, oldMax, newMin, newMax) {
            return (newMax - newMin) * (value - oldMin) / (oldMax - oldMin) + newMin;
        }
    }]);

    return Statistics;
}();

Lore.Statistics.spareRandomNormal = null;

/** A class representing a ray */
Lore.Ray = function () {

    /**
     * Creates an instance of Ray.
     * @param {Vector3f} source The source of the ray.
     * @param {Vector3f} direction The direction of the ray.
     */
    function Ray(source, direction) {
        _classCallCheck(this, Ray);

        this.source = source || new Lore.Vector3f();
        this.direction = direction || new Lore.Vector3f();
    }

    /**
     * Copy the values from another ray.
     * 
     * @param {Ray} r A ray.
     * @returns {Ray} Returns itself.
     */


    _createClass(Ray, [{
        key: 'copyFrom',
        value: function copyFrom(r) {
            this.source.copyFrom(r.source);
            this.direction.copyFrom(r.direction);

            return this;
        }

        /**
         * Apply a projection matrix to this ray.
         * 
         * @param {Matrix4f|ProjectionMatrix} m A matrix / projection matrix.
         * @returns {Ray} Returns itself.
         */

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
        /**
         * The square of the distance of a vector to this ray.
         * 
         * @param {Vector3f} v A vector.
         * @returns {Number} The square pf the distance between the point and this ray.
         */

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

        /**
         * Find a point on the ray that is closest to a supplied vector.
         * 
         * @param {Vector3f} v A vector.
         * @returns {Vector3f} The cloest point on the ray to the supplied point.
         */

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

/** A class wrapping a radix sort for floats. */
Lore.RadixSort = function () {
    /**
     * Creates an instance of RadixSort.
     * 
     */
    function RadixSort() {
        _classCallCheck(this, RadixSort);

        this.max = undefined;
        this.mask = undefined;
        this.histograms = undefined;
        this.indices = undefined;
        this.tmpIndices = undefined;
    }

    /**
     * Sorts a 32-bit float array using radix sort.
     * 
     * @param {Float32Array} arr The array to be sorted.
     * @param {Boolean} [copyArray=false] A boolean indicating whether to perform the sorting directly on the array or copy it.
     * @returns {Object} The result in the form { array: sortedArray, indices: sortedIndices }.
     * 
     */


    _createClass(RadixSort, [{
        key: 'sort',
        value: function sort(arr) {
            var copyArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
            for (var _i2 = 0; _i2 <= maxOffset; _i2 += this.max) {
                var sum = 0;

                for (var j = _i2; j < _i2 + this.max; j++) {
                    var tmpSum = this.histograms[j] + sum;

                    this.histograms[j] = sum - 1;
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

        /**
         * The lsb (least significant bit) pass of the algorithm.
         * 
         * @param {Float32Array} arr The array.
         * @param {Float32Array} aux An auxilliary array.
         * 
         */

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

        /**
         * The main pass of the algorithm.
         * 
         * @param {Float32Array} arr The array.
         * @param {Float32Array} aux An auxilliary array.
         * 
         */

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

        /**
         * The msb (most significant bit) pass of the algorithm.
         * 
         * @param {Float32Array} arr The array.
         * @param {Float32Array} aux An auxilliary array.
         * 
         */

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

        /**
         * Initialize the histogram used by the algorithm.
         * 
         * @param {Float32Array} arr The array to be sorted.
         * @param {Number} maxOffset The maximum offset.
         * @param {Number} lastMask The last max, based on the msb (most significant bit) mask.
         * 
         */

    }, {
        key: 'initHistograms',
        value: function initHistograms(arr, maxOffset, lastMask) {
            var n = arr.length;

            for (var i = 0; i < n; i++) {
                var val = arr[i];
                var sign = val >> 31;

                val ^= sign | 0x80000000;

                var j = 0;
                var k = 0;

                for (; j < maxOffset; j += this.max, k += 11) {
                    this.histograms[j + (val >>> k & this.mask)]++;
                }

                this.histograms[j + (val >>> k & lastMask)]++;
            }
        }
    }]);

    return RadixSort;
}();

/** 
 * The base class for helper classes.
 * 
 * @property {Lore.Renderer} renderer An instance of Lore.Renderer.
 * @property {Lore.Shader} shader The shader associated with this helper.
 * @property {Lore.Geometry} geometry The geometry associated with this helper.
 */
Lore.HelperBase = function (_Lore$Node3) {
    _inherits(HelperBase, _Lore$Node3);

    /**
     * Creates an instance of HelperBase.
     * 
     * @param {Lore.Renderer} renderer A Lore.Renderer object.
     * @param {String} geometryName The name of this geometry.
     * @param {String} shaderName The name of the shader used to render the geometry.
     */
    function HelperBase(renderer, geometryName, shaderName) {
        _classCallCheck(this, HelperBase);

        var _this9 = _possibleConstructorReturn(this, (HelperBase.__proto__ || Object.getPrototypeOf(HelperBase)).call(this));

        _this9.renderer = renderer;
        _this9.shader = Lore.Shaders[shaderName];
        _this9.geometry = _this9.renderer.createGeometry(geometryName, shaderName);
        return _this9;
    }

    /**
     * Set the value (a typed array) of an attribute.
     * 
     * @param {String} name The name of the attribute. 
     * @param {TypedArray} data A typed array containing the attribute values.
     */


    _createClass(HelperBase, [{
        key: 'setAttribute',
        value: function setAttribute(name, data) {
            this.geometry.addAttribute(name, data);
        }

        /**
         * Get the value of an attribute (usually a typed array).
         * 
         * @param {String} name The name of the attribute.
         * @returns {TypedArray} Usually, a typed array containing the attribute values.
         */

    }, {
        key: 'getAttribute',
        value: function getAttribute(name) {
            return this.geometry.attributes[name].data;
        }

        /**
         * Update a the value of an attribute at a specific index and marks the attribute as stale.
         * 
         * @param {String} name The name of the attribute.
         * @param {Number} index The index of the value to be updated.
         * @param {TypedArray} value Usually, a typed array or array with the length of the attribute values (3 for x, y, z coordinates) containing the new values.
         */

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

        /**
         * Updates all the values in the attribute and marks the attribute as stale.
         * 
         * @param {String} name The name of the attribute.
         * @param {TypedArray} values A typed array containing the new attribute values.
         */

    }, {
        key: 'updateAttributeAll',
        value: function updateAttributeAll(name, values) {
            var attr = this.geometry.attributes[name];

            for (var i = 0; i < attr.data.length; i++) {
                attr.data[i] = values[i];
            }

            attr.stale = true;
        }

        /**
         * Calls the draw method of the underlying geometry.
         */

    }, {
        key: 'draw',
        value: function draw() {
            this.geometry.draw(this.renderer);
        }

        /**
         * Destructor for the helper (mainly used for OctreeHelpers to clean up events).
         */

    }, {
        key: 'destruct',
        value: function destruct() {}
    }]);

    return HelperBase;
}(Lore.Node);

/** 
 * A helper class wrapping a point cloud.
 * 
 * @property {Object} opts An object containing options.
 * @property {Number[]} indices Indices associated with the data.
 * @property {Lore.Octree} octree The octree associated with the point cloud.
 * @property {Object} filters A map mapping filter names to Lore.Filter instances associated with this helper class.
 * @property {Number} pointSize The scaled and constrained point size of this data.
 * @property {Number} pointScale The scale of the point size.
 * @property {Number} rawPointSize The point size before scaling and constraints.
 * @property {Object} dimensions An object with the properties min and max, each a 3D vector containing the extremes.
 */
Lore.PointHelper = function (_Lore$HelperBase) {
    _inherits(PointHelper, _Lore$HelperBase);

    /**
     * Creates an instance of PointHelper.
     * @param {Lore.Renderer} renderer An instance of Lore.Renderer.
     * @param {String} geometryName The name of this geometry.
     * @param {String} shaderName The name of the shader used to render the geometry.
     * @param {Object} options An object containing options.
     */
    function PointHelper(renderer, geometryName, shaderName, options) {
        _classCallCheck(this, PointHelper);

        var _this10 = _possibleConstructorReturn(this, (PointHelper.__proto__ || Object.getPrototypeOf(PointHelper)).call(this, renderer, geometryName, shaderName));

        var defaults = {
            octree: true,
            octreeThreshold: 500.0,
            octreeMaxDepth: 8,
            pointScale: 1.0,
            maxPointSize: 100.0
        };

        _this10.opts = Lore.Utils.extend(true, defaults, options);
        _this10.indices = null;
        _this10.octree = null;
        _this10.geometry.setMode(Lore.DrawModes.points);
        _this10.initPointSize();
        _this10.filters = {};
        _this10.pointScale = _this10.opts.pointScale;
        _this10.rawPointSize = 1.0;
        _this10.pointSize = _this10.rawPointSize * _this10.pointScale;

        _this10.dimensions = {
            min: new Lore.Vector3f(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
            max: new Lore.Vector3f(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
        };
        return _this10;
    }

    /**
     * Get the max length of the length of three arrays.
     * 
     * @param {Array} x 
     * @param {Array} y 
     * @param {Array} z 
     * @returns {Number} The length of the largest array.
     */


    _createClass(PointHelper, [{
        key: 'getMaxLength',
        value: function getMaxLength(x, y, z) {
            return Math.max(x.length, Math.max(y.length, z.length));
        }

        /**
         * Returns an object containing the dimensions of this point cloud.
         * 
         * @returns {Object} An object with the properties min and max, each a 3D vector containing the extremes.
         */

    }, {
        key: 'getDimensions',
        value: function getDimensions() {
            return this.dimensions;
        }

        /**
         * Get the center (average) of the point cloud.
         * 
         * @returns {Lore.Vector3f} The center (average) of the point cloud.
         */

    }, {
        key: 'getCenter',
        value: function getCenter() {
            return new Lore.Vector3f((this.dimensions.max.getX() + this.dimensions.min.getX()) / 2.0, (this.dimensions.max.getY() + this.dimensions.min.getY()) / 2.0, (this.dimensions.max.getZ() + this.dimensions.min.getZ()) / 2.0);
        }

        /**
         * Gets the distance between the center and the point furthest from the center.
         * 
         * @return {Number} The maximal radius.
         */

    }, {
        key: 'getMaxRadius',
        value: function getMaxRadius() {
            var center = this.getCenter();
            return center.subtract(this.dimensions.max).length();
        }

        /**
         * Set the positions of points in this point cloud.
         * 
         * @param {TypedArray} positions The positions (linear array).
         * @returns {Lore.PointHelper} Itself.
         */

    }, {
        key: 'setPositions',
        value: function setPositions(positions) {
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

    }, {
        key: 'setPositionsXYZ',
        value: function setPositionsXYZ(x, y, z, length) {
            var positions = new Float32Array(length * 3);

            for (var i = 0; i < length; i++) {
                var j = 3 * i;

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
                var initialBounds = Lore.AABB.fromPoints(positions);
                var indices = new Uint32Array(length);

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

    }, {
        key: 'setPositionsXYZHSS',
        value: function setPositionsXYZHSS(x, y, z, hue, saturation, size) {
            var length = this.getMaxLength(x, y, z);

            this.setPositionsXYZ(x, y, z, length);

            if (typeof hue === 'number' && typeof saturation === 'number' && typeof size === 'number') {
                this.setHSS(hue, saturation, size, length);
            } else if (typeof hue !== 'number' && typeof saturation !== 'number' && typeof size !== 'number') {
                this.setHSSFromArrays(hue, saturation, size, length);
            } else {
                if (typeof hue === 'number') {
                    var hueTmp = new Float32Array(length);
                    hueTmp.fill(hue);
                    hue = hueTmp;
                }

                if (typeof saturation === 'number') {
                    var saturationTmp = new Float32Array(length);
                    saturationTmp.fill(saturation);
                    saturation = saturationTmp;
                }

                if (typeof size === 'number') {
                    var sizeTmp = new Float32Array(length);
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

    }, {
        key: 'setRGB',
        value: function setRGB(r, g, b) {
            var c = new Float32Array(r.length * 3);
            var colors = this.getAttribute('color');

            for (var i = 0; i < r.length; i++) {
                var j = 3 * i;

                c[j] = r[i];
                c[j + 1] = g[i];
                c[j + 2] = b[i];
            }

            // Convert to HOS (Hue, Saturation, Size)
            for (var _i3 = 0; _i3 < c.length; _i3 += 3) {
                var _r = c[_i3];
                var _g = c[_i3 + 1];
                var _b = c[_i3 + 2];

                c[_i3] = Lore.Color.rgbToHsl(_r, _g, _b)[0];
                c[_i3 + 1] = colors[_i3 + 1];
                c[_i3 + 2] = colors[_i3 + 2];
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

    }, {
        key: 'setColors',
        value: function setColors(colors) {
            this.setAttribute('color', colors);

            return this;
        }

        /**
         * Update the colors (HSS) for the points.
         * 
         * @param {TypedArray} colors An array containing the HSS values.
         * @returns {Lore.PointHelper} Itself.
         */

    }, {
        key: 'updateColors',
        value: function updateColors(colors) {
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

    }, {
        key: 'updateColor',
        value: function updateColor(index, color) {
            this.updateAttribute('color', index, color.components);

            return this;
        }

        /**
         * Set the global point size.
         * 
         * @param {Number} size The global point size.
         * @returns {Number} The threshold for the raycaster.
         */

    }, {
        key: 'setPointSize',
        value: function setPointSize(size) {
            this.rawPointSize = size;

            this.updatePointSize();

            var pointSize = this.rawPointSize * this.opts.pointScale;

            if (pointSize > this.opts.maxPointSize) {
                return 0.5 * (this.opts.maxPointSize / pointSize);
            } else {
                return 0.5;
            }
        }

        /**
         * Updates the displayed point size.
         */

    }, {
        key: 'updatePointSize',
        value: function updatePointSize() {
            var pointSize = this.rawPointSize * this.opts.pointScale;

            if (pointSize > this.opts.maxPointSize) {
                this.pointSize = this.opts.maxPointSize;
            } else {
                this.pointSize = pointSize;
            }

            this.geometry.shader.uniforms.size.value = this.pointSize;
        }

        /**
         * Get the global point size.
         * 
         * @returns {Number} The global point size.
         */

    }, {
        key: 'getPointSize',
        value: function getPointSize() {
            return this.geometry.shader.uniforms.size.value;
        }

        /**
         * Get the global point scale.
         * 
         * @returns {Number} The global point size.
         */

    }, {
        key: 'getPointScale',
        value: function getPointScale() {
            return this.opts.pointScale;
        }

        /**
         * Sets the global point scale.
         * 
         * @param {Number} pointScale The global point size.
         * @returns {Lore.PointHelper} Itself.
         */

    }, {
        key: 'setPointScale',
        value: function setPointScale(pointScale) {
            this.opts.pointScale = pointScale;
            this.updatePointSize();

            return this;
        }

        /**
         * Sets the fog start and end distances, as seen from the camera.
         * 
         * @param {Number} fogStart The start distance of the fog.
         * @param {Number} fogEnd The end distance of the fog.
         * @returns {Lore.PointHelper} Itself.
         */

    }, {
        key: 'setFogDistance',
        value: function setFogDistance(fogStart, fogEnd) {
            console.warn('This function is deprecated.');
            // this.geometry.shader.uniforms.fogStart.value = fogStart;
            // this.geometry.shader.uniforms.fogEnd.value = fogEnd;

            return this;
        }

        /**
         * Initialize the point size based on the current zoom.
         * 
         * @returns {Lore.PointHelper} Itself.
         */

    }, {
        key: 'initPointSize',
        value: function initPointSize() {
            this.setPointSize(this.renderer.camera.zoom + 0.1);

            return this;
        }

        /**
         * Get the current cutoff value.
         * 
         * @returns {Number} The current cutoff value.
         */

    }, {
        key: 'getCutoff',
        value: function getCutoff() {
            return this.geometry.shader.uniforms.cutoff.value;
        }

        /**
         * Set the cutoff value.
         * 
         * @param {Number} cutoff A cutoff value.
         * @returns {Lore.PointHelper} Itself.
         */

    }, {
        key: 'setCutoff',
        value: function setCutoff(cutoff) {
            this.geometry.shader.uniforms.cutoff.value = cutoff;

            return this;
        }

        /**
         * Get the hue for a given index.
         * 
         * @param {Number} index An index.
         * @returns {Number} The hue of the specified index.
         */

    }, {
        key: 'getHue',
        value: function getHue(index) {
            var colors = this.getAttribute('color');

            return colors[index * 3];
        }

        /**
         * Get the saturation for a given index.
         * 
         * @param {Number} index An index.
         * @returns {Number} The saturation of the specified index.
         */

    }, {
        key: 'getSaturation',
        value: function getSaturation(index) {
            var colors = this.getAttribute('color');

            return colors[index * 3 + 1];
        }

        /**
         * Get the size for a given index.
         * 
         * @param {Number} index An index.
         * @returns {Number} The size of the specified index.
         */

    }, {
        key: 'getSize',
        value: function getSize(index) {
            var colors = this.getAttribute('color');

            return colors[index * 3 + 2];
        }

        /**
         * Get the position for a given index.
         * 
         * @param {Number} index An index.
         * @returns {Number} The position of the specified index.
         */

    }, {
        key: 'getPosition',
        value: function getPosition(index) {
            var positions = this.getAttribute('position');

            return new Lore.Vector3f(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2]);
        }

        /**
         * Set the hue. If a number is supplied, all the hues are set to the supplied number.
         * 
         * @param {TypedArray|Number} hue The hue to be set. If a number is supplied, all hues are set to its value.
         */

    }, {
        key: 'setHue',
        value: function setHue(hue) {
            var colors = this.getAttribute('color');
            var c = null;
            var index = 0;

            if (typeof hue === 'number') {
                var _length = colors.length;

                c = new Float32Array(_length * 3);

                for (var i = 0; i < _length * 3; i += 3) {
                    c[i] = hue;
                    c[i + 1] = colors[i + 1];
                    c[i + 2] = colors[i + 2];
                }
            } else {
                var _length2 = hue.length;

                c = new Float32Array(_length2 * 3);

                for (var _i4 = 0; _i4 < _length2 * 3; _i4 += 3) {
                    c[_i4] = hue[index++];
                    c[_i4 + 1] = colors[_i4 + 1];
                    c[_i4 + 2] = colors[_i4 + 2];
                }
            }

            this.setColors(c);
        }

        /**
         * Update the hue of the points.
         * 
         * @param {TypedArray|Number} hue The hue to be set. If a number is supplied, all hues are set to its value.
         * @param {Number|Number[]} index The index or the indices of vertices to be set to a hue.
         */

    }, {
        key: 'updateHue',
        value: function updateHue(hue, index) {
            index *= 3;
            var colors = this.getAttribute('color');
            var c = null;

            if (index > colors.length - 1) {
                console.warn('The color index is out of range.');
                return;
            }

            if (typeof index === 'number') {
                if (typeof hue !== 'number') {
                    console.warn('The hue value cannot be an array if index is a number.');
                } else {
                    this.updateColor(index, new Lore.Color(hue, colors[index + 1], colors[index + 2]));
                }
            } else if (Array.isArray(index)) {
                if (Array.isArray(hue)) {
                    if (hue.length !== index.length) {
                        console.warn('Hue and index arrays have to be of the same length.');
                    } else {
                        for (var i = 0; i < index.length; i++) {
                            this.updateColor(index[i], new Lore.Color(hue[i], colors[index + 1], colors[index + 2]));
                        }
                    }
                } else if (typeof hue === 'number') {
                    for (var i = 0; i < index.length; i++) {
                        this.updateColor(index[i], new Lore.Color(hue, colors[index + 1], colors[index + 2]));
                    }
                }
            } else {
                console.warn('The type of index is not supported: ' + (typeof index === 'undefined' ? 'undefined' : _typeof(index)));
            }
        }

        /**
         * Set the saturation. If a number is supplied, all the saturations are set to the supplied number.
         * 
         * @param {TypedArray|Number} hue The saturation to be set. If a number is supplied, all saturations are set to its value.
         */

    }, {
        key: 'setSaturation',
        value: function setSaturation(saturation) {
            var colors = this.getAttribute('color');
            var c = null;
            var index = 0;

            if (typeof saturation === 'number') {
                var _length3 = colors.length;

                c = new Float32Array(_length3 * 3);

                for (var i = 0; i < _length3 * 3; i += 3) {
                    c[i] = colors[i];
                    c[i + 1] = saturation;
                    c[i + 2] = colors[i + 2];
                }
            } else {
                var _length4 = saturation.length;

                c = new Float32Array(_length4 * 3);

                for (var _i5 = 0; _i5 < _length4 * 3; _i5 += 3) {
                    c[_i5] = colors[_i5];
                    c[_i5 + 1] = saturation[index++];
                    c[_i5 + 2] = colors[_i5 + 2];
                }
            }

            this.setColors(c);
        }

        /**
         * Set the size. If a number is supplied, all the sizes are set to the supplied number.
         * 
         * @param {TypedArray|Number} hue The size to be set. If a number is supplied, all sizes are set to its value.
         */

    }, {
        key: 'setSize',
        value: function setSize(size) {
            var colors = this.getAttribute('color');
            var c = null;
            var index = 0;

            if (typeof size === 'number') {
                var _length5 = colors.length;

                c = new Float32Array(_length5 * 3);

                for (var i = 0; i < _length5 * 3; i += 3) {
                    c[i] = colors[i];
                    c[i + 1] = colors[i + 1];
                    c[i + 2] = size;
                }
            } else {
                var _length6 = size.length;

                c = new Float32Array(_length6 * 3);

                for (var _i6 = 0; _i6 < _length6 * 3; _i6 += 3) {
                    c[_i6] = colors[_i6];
                    c[_i6 + 1] = colors[_i6 + 1];
                    c[_i6 + 2] = size[index++];
                }
            }

            this.setColors(c);
        }

        /**
         * Set the HSS values. Sets all indices to the same values.
         * 
         * @param {Number} hue A hue value.
         * @param {Number} saturation A saturation value.
         * @param {Number} size A size value.
         * @param {Number} length The length of the arrays.
         */

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

        /**
         * Set the HSS values.
         * 
         * @param {TypedArray} hue An array of hue values.
         * @param {TypedArray} saturation An array of saturation values.
         * @param {TypedArray} size An array of size values.
         * @param {Number} length The length of the arrays.
         */

    }, {
        key: 'setHSSFromArrays',
        value: function setHSSFromArrays(hue, saturation, size, length) {
            var c = new Float32Array(length * 3);
            var index = 0;

            if (hue.length !== length && saturation.length !== length && size.length !== length) {
                throw 'Hue, saturation and size have to be arrays of length "length" (' + length + ').';
            }

            for (var i = 0; i < length * 3; i += 3) {
                c[i] = hue[index];
                c[i + 1] = saturation[index];
                c[i + 2] = size[index];

                index++;
            }

            this.setColors(c);
        }

        /**
         * Add a filter to this point helper.
         * 
         * @param {String} name The name of the filter.
         * @param {Lore.FilterBase} filter A filter instance.
         * @returns {Lore.PointHelper} Itself.
         */

    }, {
        key: 'addFilter',
        value: function addFilter(name, filter) {
            filter.setGeometry(this.geometry);
            this.filters[name] = filter;

            return this;
        }

        /**
         * Remove a filter by name.
         * 
         * @param {String} name The name of the filter to be removed.
         * @returns {Lore.PointHelper} Itself.
         */

    }, {
        key: 'removeFilter',
        value: function removeFilter(name) {
            delete this.filters[name];

            return this;
        }

        /**
         * Get a filter by name.
         * 
         * @param {String} name The name of a filter.
         * @returns {Lore.FilterBase} A filter instance.
         */

    }, {
        key: 'getFilter',
        value: function getFilter(name) {
            return this.filters[name];
        }
    }]);

    return PointHelper;
}(Lore.HelperBase);
Lore.TreeHelper = function (_Lore$HelperBase2) {
    _inherits(TreeHelper, _Lore$HelperBase2);

    function TreeHelper(renderer, geometryName, shaderName, options) {
        _classCallCheck(this, TreeHelper);

        var _this11 = _possibleConstructorReturn(this, (TreeHelper.__proto__ || Object.getPrototypeOf(TreeHelper)).call(this, renderer, geometryName, shaderName));

        _this11.defaults = {
            pointScale: 1.0,
            maxPointSize: 100.0
        };

        _this11.opts = Lore.Utils.extend(true, _this11.defaults, options);
        _this11.indices = null;
        _this11.geometry.setMode(Lore.DrawModes.lines);
        _this11.initPointSize();
        _this11.filters = {};
        return _this11;
    }

    _createClass(TreeHelper, [{
        key: 'getMaxLength',
        value: function getMaxLength(x, y, z) {
            return Math.max(x.length, Math.max(y.length, z.length));
        }
    }, {
        key: 'setPositions',
        value: function setPositions(positions) {
            this.setAttribute('position', positions);
        }
    }, {
        key: 'setPositionsXYZ',
        value: function setPositionsXYZ(x, y, z, length) {
            var positions = new Float32Array(length * 3);

            for (var i = 0; i < length; i++) {
                var j = 3 * i;

                positions[j] = x[i] || 0;
                positions[j + 1] = y[i] || 0;
                positions[j + 2] = z[i] || 0;
            }

            this.setAttribute('position', positions);
        }
    }, {
        key: 'setPositionsXYZHSS',
        value: function setPositionsXYZHSS(x, y, z, hue, saturation, size) {
            var length = this.getMaxLength(x, y, z);

            this.setPositionsXYZ(x, y, z, length);
            this.setHSS(hue, saturation, size, length);
        }
    }, {
        key: 'setColors',
        value: function setColors(colors) {
            this.setAttribute('color', colors);
        }
    }, {
        key: 'updateColors',
        value: function updateColors(colors) {
            this.updateAttributeAll('color', colors);
        }
    }, {
        key: 'updateColor',
        value: function updateColor(index, color) {
            this.updateAttribute('color', index, color.components);
        }
    }, {
        key: 'setPointSize',
        value: function setPointSize(size) {
            if (size * this.opts.pointScale > this.opts.maxPointSize) {
                return;
            }

            this.geometry.shader.uniforms.size.value = size * this.opts.pointScale;
        }
    }, {
        key: 'getPointSize',
        value: function getPointSize() {
            return this.geometry.shader.uniforms.size.value;
        }
    }, {
        key: 'setFogDistance',
        value: function setFogDistance(fogStart, fogEnd) {
            console.warn('This function is deprecated.');
            // this.geometry.shader.uniforms.fogStart.value = fogStart;
            // this.geometry.shader.uniforms.fogEnd.value = fogEnd;
        }
    }, {
        key: 'initPointSize',
        value: function initPointSize() {
            this.geometry.shader.uniforms.size.value = this.renderer.camera.zoom * this.opts.pointScale;
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
        }
    }, {
        key: 'getHue',
        value: function getHue(index) {
            var colors = this.getAttribute('color');

            return colors[index * 3];
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
        }
    }, {
        key: 'removeFilter',
        value: function removeFilter(name) {
            delete this.filters[name];
        }
    }, {
        key: 'getFilter',
        value: function getFilter(name) {
            return this.filters[name];
        }
    }]);

    return TreeHelper;
}(Lore.HelperBase);
/** A helper class for drawing coordinate system indicators. For example, a grid cube. */
Lore.CoordinatesHelper = function (_Lore$HelperBase3) {
    _inherits(CoordinatesHelper, _Lore$HelperBase3);

    /**
     * Creates an instance of CoordinatesHelper.
     * 
     * @param {Lore.Renderer} renderer A Lore.Renderer object.
     * @param {string} geometryName The name of this geometry.
     * @param {string} shaderName The name of the shader used to render the coordinates.
     * @param {object} options Options for drawing the coordinates. See documentation for details.
     */
    function CoordinatesHelper(renderer, geometryName, shaderName, options) {
        _classCallCheck(this, CoordinatesHelper);

        var _this12 = _possibleConstructorReturn(this, (CoordinatesHelper.__proto__ || Object.getPrototypeOf(CoordinatesHelper)).call(this, renderer, geometryName, shaderName));

        _this12.defaults = {
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
                enabled: true,
                x: {
                    count: 10,
                    length: 5.0,
                    offset: new Lore.Vector3f(),
                    color: Lore.Color.fromHex('#1f1f1f')
                },
                y: {
                    count: 10,
                    length: 5.0,
                    offset: new Lore.Vector3f(),
                    color: Lore.Color.fromHex('#1f1f1f')
                },
                z: {
                    count: 10,
                    length: 5.0,
                    offset: new Lore.Vector3f(),
                    color: Lore.Color.fromHex('#1f1f1f')
                }
            },
            box: {
                enabled: true,
                x: {
                    color: Lore.Color.fromHex('#222222')
                },
                y: {
                    color: Lore.Color.fromHex('#222222')
                },
                z: {
                    color: Lore.Color.fromHex('#222222')
                }
            }
        };

        _this12.opts = Lore.Utils.extend(true, _this12.defaults, options);

        _this12.geometry.setMode(Lore.DrawModes.lines);
        _this12.init();
        return _this12;
    }

    /**
     * Initializes the coordinates system.
     */


    _createClass(CoordinatesHelper, [{
        key: 'init',
        value: function init() {
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
            if (this.opts.ticks.enabled) {
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

                for (var _i7 = 0; _i7 < xTicks.count - 1; _i7++) {
                    pos += xTickOffset;
                    // From
                    positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2], pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
                    colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
                }

                // Y ticks
                pos = p[1];
                col = yTicks.color.components;

                for (var _i8 = 0; _i8 < yTicks.count - 1; _i8++) {
                    pos += yTickOffset;
                    // From
                    positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2], p[0] + xTicks.offset.components[0] + xTicks.length, pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2]);
                    colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
                }

                pos = p[1];

                for (var _i9 = 0; _i9 < yTicks.count - 1; _i9++) {
                    pos += yTickOffset;
                    // From
                    positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2], p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
                    colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
                }

                // Z ticks
                pos = p[2];
                col = zTicks.color.components;

                for (var _i10 = 0; _i10 < zTicks.count - 1; _i10++) {
                    pos += zTickOffset;
                    // From
                    positions.push(p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2], p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, pos + xTicks.offset.components[2]);
                    colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
                }

                pos = p[2];

                for (var _i11 = 0; _i11 < zTicks.count - 1; _i11++) {
                    pos += zTickOffset;
                    // From
                    positions.push(p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2], p[0] + xTicks.offset.components[0] + xTicks.length, p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2]);
                    colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
                }
            }

            this.setAttribute('position', new Float32Array(positions));
            this.setAttribute('color', new Float32Array(colors));
        }
    }]);

    return CoordinatesHelper;
}(Lore.HelperBase);

/** 
 * A helper class to create an octree associated with vertex data. 
 * 
 * @property {*} opts An object containing options.
 * @property {Lore.PointHelper} target The Lore.PointHelper object from which this octree is constructed.
 * @property {Lore.Renderer} renderer An instance of Lore.Renderer.
 * @property {Lore.Octree} octree The octree associated with the target.
 * @property {Lore.Raycaster} raycaster An instance of Lore.Raycaster.
 * @property {Object} hovered The currently hovered item.
 * @property {Object[]} selected The currently selected items.
 */
Lore.OctreeHelper = function (_Lore$HelperBase4) {
    _inherits(OctreeHelper, _Lore$HelperBase4);

    /**
     * Creates an instance of OctreeHelper.
     * 
     * @param {Lore.Renderer} renderer A Lore.Renderer object.
     * @param {String} geometryName The name of this geometry.
     * @param {String} shaderName The name of the shader used to render this octree.
     * @param {Lore.PointHelper} target The Lore.PointHelper object from which this octree is constructed.
     * @param {Object} options The options used to draw this octree.
     */
    function OctreeHelper(renderer, geometryName, shaderName, target, options) {
        _classCallCheck(this, OctreeHelper);

        var _this13 = _possibleConstructorReturn(this, (OctreeHelper.__proto__ || Object.getPrototypeOf(OctreeHelper)).call(this, renderer, geometryName, shaderName));

        _this13.defaults = {
            visualize: false,
            multiSelect: true
        };

        _this13.opts = Lore.Utils.extend(true, _this13.defaults, options);
        _this13._eventListeners = {};
        _this13.target = target;
        _this13.renderer = renderer;
        _this13.octree = _this13.target.octree;
        _this13.raycaster = new Lore.Raycaster();
        _this13.hovered = null;
        _this13.selected = [];

        var that = _this13;

        _this13._dblclickHandler = function (e) {
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
        };

        renderer.controls.addEventListener('dblclick', _this13._dblclickHandler);

        _this13._mousemoveHandler = function (e) {
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
        };

        renderer.controls.addEventListener('mousemove', _this13._mousemoveHandler);

        _this13._zoomchangedHandler = function (zoom) {
            that.setPointSizeFromZoom(zoom);
        };

        renderer.controls.addEventListener('zoomchanged', _this13._zoomchangedHandler);

        _this13._updatedHandler = function () {
            for (var i = 0; i < that.selected.length; i++) {
                that.selected[i].screenPosition = that.renderer.camera.sceneToScreen(that.selected[i].position, renderer);
            }

            if (that.hovered) {
                that.hovered.screenPosition = that.renderer.camera.sceneToScreen(that.hovered.position, renderer);
            }

            that.raiseEvent('updated');
        };

        renderer.controls.addEventListener('updated', _this13._updatedHandler);

        _this13.init();
        return _this13;
    }

    /**
     * Initialize this octree.
     */


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

        /**
         * Sets the point size of the associated Lore.PointHelper object as well as the threshold for the associated raycaster used for vertex picking.
         * 
         * @param {Number} zoom The current zoom value of the orthographic view.
         */

    }, {
        key: 'setPointSizeFromZoom',
        value: function setPointSizeFromZoom(zoom) {
            var threshold = this.target.setPointSize(zoom + 0.1);

            this.setThreshold(threshold);
        }

        /**
         * Get the screen position of a vertex by its index.
         * 
         * @param {Number} index The index of a vertex.
         * @returns {Number[]} An array containing the screen position. E.g. [122, 290].
         */

    }, {
        key: 'getScreenPosition',
        value: function getScreenPosition(index) {
            var positions = this.target.geometry.attributes['position'].data;
            var k = index * 3;
            var p = new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]);

            return this.renderer.camera.sceneToScreen(p, this.renderer);
        }

        /**
         * Adds an object to the selected collection of this Lore.OctreeHelper object.
         * 
         * @param {Object|Number} item Either an item (used internally) or the index of a vertex from the associated Lore.PointHelper object.
         */

    }, {
        key: 'addSelected',
        value: function addSelected(item) {
            // If item is only the index, create a dummy item
            if (!isNaN(parseFloat(item))) {
                var positions = this.target.geometry.attributes['position'].data;
                var colors = this.target.geometry.attributes['color'].data;
                var k = item * 3;

                item = {
                    distance: -1,
                    index: item,
                    locCode: -1,
                    position: new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]),
                    color: colors ? [colors[k], colors[k + 1], colors[k + 2]] : null
                };
            }

            var index = this.selected.length;

            if (this.opts.multiSelect) {
                this.selected.push(item);
            } else {
                this.selected[0] = item;
                index = 0;
            }

            this.selected[index].screenPosition = this.renderer.camera.sceneToScreen(item.position, this.renderer);
            this.raiseEvent('selectedchanged', {
                e: this.selected
            });
        }

        /**
         * Remove an item from the selected collection of this Lore.OctreeHelper object.
         * 
         * @param {Number} index The index of the item in the selected collection.
         */

    }, {
        key: 'removeSelected',
        value: function removeSelected(index) {
            this.selected.splice(index, 1);

            this.raiseEvent('selectedchanged', {
                e: this.selected
            });
        }

        /**
         * Clear the selected collection of this Lore.OctreeHelper object.
         */

    }, {
        key: 'clearSelected',
        value: function clearSelected() {
            this.selected = [];

            this.raiseEvent('selectedchanged', {
                e: this.selected
            });
        }

        /**
         * Check whether or not the selected collection of this Lore.OctreeHelper object contains a vertex with a given index.
         * 
         * @param {Number} index The index of a vertex in the associated Lore.PointHelper object.
         * @returns {Boolean} A boolean indicating whether or not the selected collection of this Lore.OctreeHelper contains a vertex with a given index.
         */

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

        /**
         * Adds a vertex with a given index to the currently hovered vertex of this Lore.OctreeHelper object.
         * 
         * @param {Number} index The index of a vertex in the associated Lore.PointHelper object.
         */

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

        /**
         * Add the currently hovered vertex to the collection of selected vertices. 
         */

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

        /**
         * Show the centers of the axis-aligned bounding boxes of this octree. 
         */

    }, {
        key: 'showCenters',
        value: function showCenters() {
            this.opts.visualize = 'centers';
            this.drawCenters();
            this.geometry.isVisible = true;
        }

        /**
         * Show the axis-aligned boudning boxes of this octree as cubes. 
         */

    }, {
        key: 'showCubes',
        value: function showCubes() {
            this.opts.visualize = 'cubes';
            this.drawBoxes();
            this.geometry.isVisible = true;
        }

        /**
         * Hide the centers or cubes of the axis-aligned bounding boxes associated with this octree.
         */

    }, {
        key: 'hide',
        value: function hide() {
            this.opts.visualize = false;
            this.geometry.isVisible = false;

            this.setAttribute('position', new Float32Array([]));
            this.setAttribute('color', new Float32Array([]));
        }

        /**
         * Get the indices and distances of the vertices currently intersected by the ray sent from the mouse position.
         * 
         * @param {Object} mouse A mouse object containing x and y properties.
         * @returns {Object[]} A distance-sorted (ASC) array containing the interesected vertices.
         */

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

        /**
         * Add an event listener to this Lore.OctreeHelper object.
         * 
         * @param {String} eventName The name of the event to listen for.
         * @param {Function} callback A callback function called when an event is fired.
         */

    }, {
        key: 'addEventListener',
        value: function addEventListener(eventName, callback) {
            if (!this._eventListeners[eventName]) {
                this._eventListeners[eventName] = [];
            }

            this._eventListeners[eventName].push(callback);
        }

        /**
         * Raise an event with a given name and send the data to the functions listening for this event.
         * 
         * @param {String} eventName The name of the event to be rised.
         * @param {*} data Data to be sent to the listening functions.
         */

    }, {
        key: 'raiseEvent',
        value: function raiseEvent(eventName, data) {
            if (!this._eventListeners[eventName]) {
                return;
            }

            for (var i = 0; i < this._eventListeners[eventName].length; i++) {
                this._eventListeners[eventName][i](data);
            }
        }

        /**
         * Draw the centers of the axis-aligned bounding boxes of this octree.
         */

    }, {
        key: 'drawCenters',
        value: function drawCenters() {
            this.geometry.setMode(Lore.DrawModes.points);

            var aabbs = this.octree.aabbs;
            var length = Object.keys(aabbs).length;
            var colors = new Float32Array(length * 3);
            var positions = new Float32Array(length * 3);

            var i = 0;

            for (var key in aabbs) {
                var c = aabbs[key].center.components;
                var k = i * 3;

                colors[k] = 1;
                colors[k + 1] = 1;
                colors[k + 2] = 1;

                positions[k] = c[0];
                positions[k + 1] = c[1];
                positions[k + 2] = c[2];

                i++;
            }

            this.setAttribute('position', new Float32Array(positions));
            this.setAttribute('color', new Float32Array(colors));
        }

        /**
         * Draw the axis-aligned bounding boxes of this octree.
         */

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

            for (var key in aabbs) {
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

        /**
         * Set the threshold of the raycaster associated with this Lore.OctreeHelper object.
         * 
         * @param {Number} threshold The threshold (maximum distance to the ray) of the raycaster.
         */

    }, {
        key: 'setThreshold',
        value: function setThreshold(threshold) {
            this.raycaster.threshold = threshold;
        }

        /**
         * Execute a ray intersection search within this octree.
         * 
         * @param {Number[]} indices The indices of the octree nodes that are intersected by the ray.
         * @returns {Number[]} An array containing the vertices intersected by the ray.
         */

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
                var k = index * 3;
                var v = new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]);

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
                        color: colors ? [colors[k], colors[k + 1], colors[k + 2]] : null
                    });
                }
            }

            return result;
        }

        /**
         * Remove eventhandlers from associated controls.
         */

    }, {
        key: 'destruct',
        value: function destruct() {
            this.renderer.controls.removeEventListener('dblclick', this._dblclickHandler);
            this.renderer.controls.removeEventListener('mousemove', this._mousemoveHandler);
            this.renderer.controls.removeEventListener('zoomchanged', this._zoomchangedHandler);
            this.renderer.controls.removeEventListener('updated', this._updatedHandler);
        }
    }]);

    return OctreeHelper;
}(Lore.HelperBase);

/** 
 * An abstract class representing the base for filter implementations. 
 * 
 * @property {string} type The type name of this object (Lore.FilterBase).
 * @property {Lore.Geometry} geometry The Geometry associated with this filter.
 * @property {string} attribute The name of the attribute to filter on.
 * @property {number} attributeIndex The attribute-index to filter on.
 * @property {boolean} active Whether or not the filter is active.
 */
Lore.FilterBase = function () {

    /**
     * Creates an instance of FilterBase.
     * @param {string} attribute The name of the attribute to filter on.
     * @param {name} attributeIndex The attribute-index to filter on.
     */
    function FilterBase(attribute, attributeIndex) {
        _classCallCheck(this, FilterBase);

        this.type = 'Lore.FilterBase';
        this.geometry = null;
        this.attribute = attribute;
        this.attributeIndex = attributeIndex;
        this.active = false;
    }

    /**
     * Returns the geometry associated with this filter.
     * 
     * @returns {Lore.Geometry} The geometry associated with this filter.
     */


    _createClass(FilterBase, [{
        key: 'getGeometry',
        value: function getGeometry() {
            return this.geometry;
        }

        /**
         * Sets the geometry associated with this filter.
         * 
         * @param {Lore.Geometry} value The geometry to be associated with this filter.
         */

    }, {
        key: 'setGeometry',
        value: function setGeometry(value) {
            this.geometry = value;
        }

        /**
         * Abstract method. 
         */

    }, {
        key: 'filter',
        value: function filter() {}

        /**
         * Abstract method. 
         */

    }, {
        key: 'reset',
        value: function reset() {}

        /**
         * Check whether or not a vertex with a given index is visible. A vertex is visible when its color attribute is > 0.0 at attribute-index 2 (the size in HSS).
         *
         * @param {Lore.Geometry} geometry A Lore.Geometry with a color attribute.
         * @param {number} index A vertex index.
         * @returns {boolean} A boolean indicating whether or not the vertex specified by index is visible (HSS size > 0.0).
         */

    }], [{
        key: 'isVisible',
        value: function isVisible(geometry, index) {
            return geometry.attributes['color'].data[index * 3 + 2] > 0.0;
        }
    }]);

    return FilterBase;
}();

/** 
 * A class representing an In-Range-Filter. It is used to filter a geometry based on a min and max value. 
 * @property {number} min The minimum value.
 * @property {number} max The maximum value.
 * */
Lore.InRangeFilter = function (_Lore$FilterBase) {
    _inherits(InRangeFilter, _Lore$FilterBase);

    /**
     * Creates an instance of InRangeFilter.
     * @param {string} attribute The name of the attribute to filter on.
     * @param {number} attributeIndex The attribute-index to filter on.
     * @param {number} min The minum value.
     * @param {number} max The maximum value.
     */
    function InRangeFilter(attribute, attributeIndex, min, max) {
        _classCallCheck(this, InRangeFilter);

        var _this14 = _possibleConstructorReturn(this, (InRangeFilter.__proto__ || Object.getPrototypeOf(InRangeFilter)).call(this, attribute, attributeIndex));

        _this14.min = min;
        _this14.max = max;
        return _this14;
    }

    /**
     * Get the minimum.
     * 
     * @returns {number} The minimum.
     */


    _createClass(InRangeFilter, [{
        key: 'getMin',
        value: function getMin() {
            return this.min;
        }

        /**
         * Set the minimum.
         * 
         * @param {number} value The minimum.
         */

    }, {
        key: 'setMin',
        value: function setMin(value) {
            this.min = value;
        }

        /**
         * Get the maximum.
         * 
         * @returns {number} The maximum.
         */

    }, {
        key: 'getMax',
        value: function getMax() {
            return this.max;
        }

        /**
         * Set the maximum.
         * 
         * @param {number} value The maximum.
         */

    }, {
        key: 'setMax',
        value: function setMax(value) {
            this.max = value;
        }

        /**
         * Execute the filter operation on the specified attribute and attribute-index. In order to filter, the HSS size value (attribute-index 2 of the color attribute) is set to its negative (1.0 -> -1.0, 2.5 -> -2.5).
         */

    }, {
        key: 'filter',
        value: function filter() {
            var attribute = this.geometry.attributes[this.attribute];

            for (var i = 0; i < attribute.data.length; i += attribute.attributeLength) {
                var value = attribute.data[i + this.attributeIndex];
                var size = this.geometry.attributes['color'].data[i + 2];
                if (value > this.max || value < this.min) {
                    this.geometry.attributes['color'].data[i + 2] = -Math.abs(size);
                } else {
                    this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
                }
            }

            this.geometry.updateAttribute('color');
        }

        /**
         * Resets the filter ("removes" it). The HSS size value is set back to its original value (-1.0 -> 1.0, -2.5 -> 2.5). 
         */

    }, {
        key: 'reset',
        value: function reset() {
            var attribute = this.geometry.attributes[this.attribute];

            for (var i = 0; i < attribute.data.length; i += attribute.attributeLength) {
                var size = this.geometry.attributes['color'].data[i + 2];
                this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
            }

            this.geometry.updateAttribute('color');
        }
    }]);

    return InRangeFilter;
}(Lore.FilterBase);

/** 
 * An abstract class representing the base for file reader implementations. 
 * 
 * @property {String} source The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true.
 * */
Lore.FileReaderBase = function () {
    /**
     * Creates an instance of FileReaderBase.
     * 
     * @param {String} source The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true.
     * @param {Boolean} [local=true] A boolean indicating whether or not the source is local (a file input) or remote (a url).
     */
    function FileReaderBase(source) {
        var local = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        _classCallCheck(this, FileReaderBase);

        this.source = source;
        this._eventListeners = {};

        var that = this;

        if (local) {
            this.element = document.getElementById(this.source);

            this.element.addEventListener('click', function () {
                this.value = null;
            });

            this.element.addEventListener('change', function () {
                var fileReader = new FileReader();

                fileReader.onload = function () {
                    that.loaded(fileReader.result);
                };

                fileReader.readAsBinaryString(this.files[0]);
            });
        } else {
            Lore.Utils.jsonp(source, function (response) {
                that.loaded(response);
            });
        }
    }

    /**
     * Add an event listener.
     * 
     * @param {String} eventName The name of the event.
     * @param {Function} callback A callback function associated with the event name.
     */


    _createClass(FileReaderBase, [{
        key: 'addEventListener',
        value: function addEventListener(eventName, callback) {
            if (!this._eventListeners[eventName]) {
                this._eventListeners[eventName] = [];
            }

            this._eventListeners[eventName].push(callback);
        }

        /**
         * Raise an event. To be called by inheriting classes.
         * 
         * @param {String} eventName The name of the event.
         * @param {any} data Data to be passed to the handler.
         */

    }, {
        key: 'raiseEvent',
        value: function raiseEvent(eventName, data) {
            if (!this._eventListeners[eventName]) {
                return;
            }

            for (var i = 0; i < this._eventListeners[eventName].length; i++) {
                this._eventListeners[eventName][i](data);
            }
        }

        /**
         * To be overwritten by inheriting classes.
         * 
         * @param {any} data 
         */

    }, {
        key: 'loaded',
        value: function loaded(data) {}
    }]);

    return FileReaderBase;
}();

/** A class representing a CSV file reader. */
Lore.CsvFileReader = function (_Lore$FileReaderBase) {
    _inherits(CsvFileReader, _Lore$FileReaderBase);

    /**
     * Creates an instance of CsvFileReader.
     * @param {String} source The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true.
     * @param {any} options Options. See documentation for details.
     * @param {boolean} [local=true] A boolean indicating whether or not the source is local (a file input) or remote (a url).
     */
    function CsvFileReader(source, options) {
        var local = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        _classCallCheck(this, CsvFileReader);

        var _this15 = _possibleConstructorReturn(this, (CsvFileReader.__proto__ || Object.getPrototypeOf(CsvFileReader)).call(this, source, local));

        _this15.defaults = {
            separator: ',',
            cols: [],
            types: [],
            header: true
        };

        _this15.opts = Lore.Utils.extend(true, _this15.defaults, options);
        _this15.columns = {};
        _this15.headers = [];
        _this15.types = _this15.opts.types;
        _this15.cols = _this15.opts.cols;
        return _this15;
    }

    /**
     * Called when the data is loaded, will raise the "loaded" event.
     * 
     * @param {any} data The data loaded from the file or url.
     * @returns {Lore.CsvFileReader} Itself.
     */


    _createClass(CsvFileReader, [{
        key: 'loaded',
        value: function loaded(data) {
            data = data.replace('\n\n', '\n');
            data = data.replace(/^\s+|\s+$/g, '');

            var lines = data.split('\n');
            var length = lines.length;
            var init = true;
            var h = this.opts.header ? 1 : 0;

            if (this.cols.length !== 0) {
                if (this.types.length !== this.cols.length) {
                    throw 'Types and cols must have the same number of elements.';
                }
            } else {
                if (this.types.length !== this.cols.length || this.types.length + this.cols.length === 0) {
                    var values = lines[h].split(this.opts.separator);

                    this.types = [];
                    for (var i = 0; i < values.length; i++) {
                        if (Lore.Utils.isFloat(parseFloat(values[i], 10))) {
                            this.types.push('Float32Array');
                        } else if (Lore.Utils.isInt(parseFloat(values[i], 10))) {
                            this.types.push('Int32Array');
                        } else {
                            this.types.push('StringArray');
                        }
                    }
                }
            }

            if (this.cols.length === 0) {
                var _values = lines[0].split(this.opts.separator);

                for (var _i12 = 0; _i12 < _values.length; _i12++) {
                    this.cols.push(_i12);
                }
            }

            if (h) {
                var headerNames = lines[0].split(this.opts.separator);

                for (var _i13 = 0; _i13 < this.cols.length; _i13++) {
                    this.headers[_i13] = headerNames[this.cols[_i13]].trim();
                }
            } else {
                for (var _i14 = 0; _i14 < this.cols.length; _i14++) {
                    this.headers[_i14] = _i14;
                }
            }

            for (var _i15 = h; _i15 < length; _i15++) {
                var _values2 = lines[_i15].split(this.opts.separator);

                if (this.cols.length == 0) for (var j = 0; j < _values2.length; j++) {
                    this.cols.push[j];
                }

                if (init) {
                    for (var _j2 = 0; _j2 < this.cols.length; _j2++) {
                        this._createArray(this.headers[_j2], this.types[_j2], length - h);
                    }

                    init = false;
                }

                for (var _j3 = 0; _j3 < this.cols.length; _j3++) {
                    this.columns[this.headers[_j3]][_i15 - h] = _values2[this.cols[_j3]];
                }
            }

            this.raiseEvent('loaded', this.columns);

            return this;
        }
    }, {
        key: '_createArray',
        value: function _createArray(index, type, length) {
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

/** A class representing a matrix file reader. */
Lore.MatrixFileReader = function (_Lore$FileReaderBase2) {
    _inherits(MatrixFileReader, _Lore$FileReaderBase2);

    /**
     * Creates an instance of MatrixFileReader.
     * @param {String} source The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true.
     * @param {any} options Options. See documentation for details.
     * @param {boolean} [local=true] A boolean indicating whether or not the source is local (a file input) or remote (a url).
     */
    function MatrixFileReader(source, options) {
        var local = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        _classCallCheck(this, MatrixFileReader);

        var _this16 = _possibleConstructorReturn(this, (MatrixFileReader.__proto__ || Object.getPrototypeOf(MatrixFileReader)).call(this, source, local));

        _this16.defaults = {
            elementSeperator: '\t',
            valueSeparator: ';',
            replaceNaNWith: 'NaN',
            skipNaN: true,
            types: []
        };

        _this16.opts = Lore.Utils.extend(true, _this16.defaults, options);
        _this16.types = _this16.opts.types;
        _this16.columns = {};

        if (_this16.types.length === 0) {
            throw 'When reading data from a file, the types have to be specified.';
        }

        // Add the types for the indices
        _this16.opts.types.unshift('Int32Array');
        _this16.opts.types.unshift('Int32Array');
        _this16.opts.types.unshift('Int32Array');
        return _this16;
    }

    /**
     * Called when the data is loaded, will raise the "loaded" event.
     * 
     * @param {any} data The data loaded from the file or url.
     * @returns {Lore.MatrixFileReader} Itself.
     */


    _createClass(MatrixFileReader, [{
        key: 'loaded',
        value: function loaded(data) {
            data = data.replace('\n\n', '\n');
            data = data.replace(/^\s+|\s+$/g, '');

            if (this.opts.replaceNaNWith !== 'NaN') {
                data = data.replace('NaN', this.opts.replaceNaNWith);
            }

            var lines = data.split('\n');
            var nRows = lines.length;
            var nColumns = lines[0].split(this.opts.elementSeperator).length;
            // Including the indices (x, y, z), therefore + 3
            var nValues = lines[0].split(this.opts.elementSeperator)[0].split(this.opts.valueSeparator).length + 3;

            if (this.types.length !== nValues || this.types.length + nValues === 0) {
                var values = lines[0].split(this.opts.valueSeparator);

                this.types = [];
                for (var _i16 = 0; _i16 < values.length; _i16++) {
                    if (Lore.Utils.isFloat(parseFloat(values[_i16], 10))) {
                        this.types.push('Float32Array');
                    } else if (Lore.Utils.isInt(parseFloat(values[_i16], 10))) {
                        this.types.push('Int32Array');
                    } else {
                        this.types.push('StringArray');
                    }
                }
            }

            for (var i = 0; i < nValues; i++) {
                this._createArray(i, this.types[i], nRows * nColumns);
            }

            var actualLength = 0;

            for (var i = 0; i < nRows; i++) {
                var row = lines[i].split(this.opts.elementSeperator);

                if (row.length === 0) {
                    continue;
                }

                for (var j = 0; j < nColumns; j++) {
                    if (!row[j]) {
                        continue;
                    }

                    var _values3 = row[j].split(this.opts.valueSeparator);

                    if (this.opts.skipNaN) {
                        var skip = false;

                        for (var k = 0; k < _values3.length; k++) {
                            if (isNaN(_values3[k])) {
                                skip = true;
                                break;
                            }
                        }

                        if (skip) {
                            continue;
                        }
                    }

                    this.columns[0][actualLength] = i;
                    this.columns[1][actualLength] = j;
                    // Set zero for 2D matrix
                    this.columns[2][actualLength] = 0;

                    for (var k = 0; k < _values3.length; k++) {
                        this.columns[k + 3][actualLength] = _values3[k];
                    }

                    actualLength++;
                }
            }

            this._resizeArrays(actualLength);

            this.raiseEvent('loaded', this.columns);

            return this;
        }
    }, {
        key: '_resizeArrays',
        value: function _resizeArrays(length) {
            // Might need polyfill
            for (var i = 0; i < this.columns.length; i++) {
                this.columns[i] = this.columns[i].slice(0, length);
            }
        }
    }, {
        key: '_createArray',
        value: function _createArray(index, type, length) {
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

    return MatrixFileReader;
}(Lore.FileReaderBase);

/** A utility class containing static methods. */
Lore.Utils = function () {
    function Utils() {
        _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
        key: 'extend',

        /**
         * Merges two objects, overriding probierties set in both objects in the first one.
         * 
         * @returns {object} The merged object.
         */
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

        /**
         * Checks whether or not an array contains a given value.
         * 
         * @param {Array} array An array.
         * @param {object} value An object.
         * @returns {boolean} A boolean whether or not the array contains the value.
         */

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

        /**
         * Concatinate two typed arrays.
         * 
         * @param {TypedArray} arrA A typed array.
         * @param {TypedArray} arrB A typed array.
         * @returns {TypedArray} The concatinated typed array.
         */

    }, {
        key: 'concatTypedArrays',
        value: function concatTypedArrays(arrA, arrB) {
            var arrC = new a.constructor(arrA.length + arrB.length);

            arrC.set(arrA);
            arrC.set(arrB, arrA.length);

            return arrC;
        }
    }, {
        key: 'msb',


        /**
         * Get the most significant bit (MSB) of a number.
         * 
         * @param {Number} n A number. 
         * @returns {Number} The most significant bit (0 or 1).
         */
        value: function msb(n) {
            return n & 0x80000000 ? 31 : Lore.Utils.msb(n << 1 | 1) - 1;
        }

        /**
         *  An utility method to merge two point distance objects containing arrays of indices and squared distances.
         * 
         * @static
         * @param {object} a An object in the form of { indices: TypedArray, distancesSq: TypedArray }.
         * @param {object} b An object in the form of { indices: TypedArray, distancesSq: TypedArray }.
         * @returns  {object} The object with merged indices and squared distances.
         */

    }, {
        key: 'mergePointDistances',
        value: function mergePointDistances(a, b) {
            var newObj = {};

            newObj.indices = Lore.Utils.concatTypedArrays(a.indices, b.indices);
            newObj.distancesSq = Lore.Utils.concatTypedArrays(a.distancesSq, b.distancesSq);

            return newObj;
        }

        /**
         * Checks whether or not the number is an integer.
         * 
         * @param {number} n A number.
         * @returns A boolean whether or not the number is an integer.
         */

    }, {
        key: 'isInt',
        value: function isInt(n) {
            return Number(n) === n && n % 1 === 0;
        }

        /**
         * Checks whether or not the number is a float.
         * 
         * @param {number} n A number.
         * @returns A boolean whether or not the number is a float.
         */

    }, {
        key: 'isFloat',
        value: function isFloat(n) {
            return Number(n) === n && n % 1 !== 0;
        }

        /**
         * A helper method enabling JSONP requests to an url.
         * 
         * @param {String} url An url.
         * @param {Function} callback The callback to be called when the data is loaded.
         */

    }, {
        key: 'jsonp',
        value: function jsonp(url, callback) {
            var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
            window[callbackName] = function (response) {
                delete window[callbackName];
                document.body.removeChild(script);
                callback(response);
            };

            var script = document.createElement('script');
            script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
            document.body.appendChild(script);
        }
    }]);

    return Utils;
}();

Lore.Utils.DEG2RAD = Math.PI / 180.0;
Lore.Shaders['default'] = new Lore.Shader('Default', 1, { size: new Lore.Uniform('size', 5.0, 'float'),
    type: new Lore.Uniform('type', 0.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float'),
    clearColor: new Lore.Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4') }, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = hsv2rgb(hsv);', '}'], ['uniform vec4 clearColor;', 'varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'float fogIntensity = (gl_FragCoord.z / gl_FragCoord.w);', 'fogIntensity = fogIntensity + fogIntensity * 2.0;', 'fogIntensity *= clearColor.w;', 'gl_FragColor = mix(vec4(vColor, 1.0), clearColor, fogIntensity);', '}']);

Lore.Shaders['defaultAnimated'] = new Lore.Shader('DefaultAnimated', 1, { size: new Lore.Uniform('size', 5.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float'),
    time: new Lore.Uniform('time', 0.0, 'float'),
    clearColor: new Lore.Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4') }, ['uniform float size;', 'uniform float cutoff;', 'uniform float time;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = size;', 'hsv.g *= max(0.15, abs(sin(time * 0.002)));', 'vColor = hsv2rgb(hsv);', '}'], ['uniform vec4 clearColor;', 'varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'float fogIntensity = (gl_FragCoord.z / gl_FragCoord.w);', 'fogIntensity = fogIntensity + fogIntensity * 2.0;', 'fogIntensity *= clearColor.w;', 'gl_FragColor = mix(vec4(vColor, 1.0), clearColor, fogIntensity);', '}']);

Lore.Shaders['coordinates'] = new Lore.Shader('Coordinates', 1, {}, ['attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'void main() {', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'gl_PointSize = 1.0;', 'vColor = color;', '}'], ['varying vec3 vColor;', 'void main() {', 'gl_FragColor = vec4(vColor, 1.0);', '}']);

Lore.Shaders['tree'] = new Lore.Shader('Tree', 1, { size: new Lore.Uniform('size', 5.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float') }, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 0.75);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = size;', 'vColor = hsv2rgb(hsv);', '}'], ['varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'float fog = 1.0 - (gl_FragCoord.z / gl_FragCoord.w);', 'gl_FragColor = vec4(vColor * fog, 0.5);', '}']);

Lore.Shaders['circle'] = new Lore.Shader('Circle', 1, { size: new Lore.Uniform('size', 5.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float'),
    clearColor: new Lore.Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4') }, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = hsv2rgb(hsv);', '}'], ['uniform vec4 clearColor;', 'varying vec3 vColor;', 'varying float vDiscard;', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'if(vDiscard > 0.5) discard;', 'vec3 N;', 'N.xy = gl_PointCoord * 2.0 - vec2(1.0);', 'float mag = dot(N.xy, N.xy);', 'if (mag > 1.0) discard;   // discard fragments outside circle', 'float fogIntensity = (gl_FragCoord.z / gl_FragCoord.w) * 2.0;', 'fogIntensity *= clearColor.w;', 'gl_FragColor = mix(vec4(vColor, 1.0), clearColor, fogIntensity);', '}']);

Lore.Shaders['smoothcircle'] = new Lore.Shader('SmoothCircle', 2, { size: new Lore.Uniform('size', 5.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float'),
    clearColor: new Lore.Uniform('clearColor', [1.0, 1.0, 1.0, 1.0], 'float_vec4') }, ['uniform float size;', 'uniform float cutoff;', 'in vec3 position;', 'in vec3 color;', 'out vec3 vColor;', 'out float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = hsv2rgb(hsv);', '}'], ['uniform vec4 clearColor;', 'in vec3 vColor;', 'in float vDiscard;', 'out vec4 fragColor;', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'if(vDiscard > 0.5) discard;', 'float r = 0.0, delta = 0.0, alpha = 1.0;', 'vec2 cxy = 2.0 * gl_PointCoord - 1.0;', 'r = dot(cxy, cxy);', 'delta = fwidth(r);', 'alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);', 'float fogIntensity = (gl_FragCoord.z / gl_FragCoord.w);', 'fogIntensity = fogIntensity + fogIntensity * 2.0;', 'fogIntensity *= clearColor.w;', '// fragColor = vec4(vec3(gl_FragDepth) * fog, 1.0);', 'fragColor = mix(vec4(vColor, 1.0), clearColor, fogIntensity) * alpha;', '}']);

Lore.Shaders['simpleSphere'] = new Lore.Shader('SimpleSphere', 1, { size: new Lore.Uniform('size', 5.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float'),
    clearColor: new Lore.Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4') }, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = hsv2rgb(hsv);', '}'], ['uniform vec4 clearColor;', 'varying vec3 vColor;', 'varying float vDiscard;', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'if(vDiscard > 0.5) discard;', 'vec3 N;', 'N.xy = gl_PointCoord * 2.0 - vec2(1.0);', 'float mag = dot(N.xy, N.xy);', 'if (mag > 1.0) discard;   // discard fragments outside circle', 'N.z = sqrt(1.0 - mag);', 'vec3 light_dir = vec3(0.25, -0.25, 1.0);', 'float diffuse = max(0.25, dot(light_dir, N));', 'float fogIntensity = (gl_FragCoord.z / gl_FragCoord.w);', 'fogIntensity = fogIntensity + fogIntensity * 2.0;', 'fogIntensity *= clearColor.w;', 'vec3 color = vColor * diffuse;', 'gl_FragColor = mix(vec4(color, 1.0), clearColor, fogIntensity);', '}']);

Lore.Shaders['sphere'] = new Lore.Shader('Sphere', 1, { size: new Lore.Uniform('size', 5.0, 'float'),
    cutoff: new Lore.Uniform('cutoff', 0.0, 'float'),
    clearColor: new Lore.Uniform('clearColor', [1.0, 1.0, 1.0, 1.0], 'float_vec4') }, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = hsv2rgb(hsv);', '}'], ['uniform vec4 clearColor;', 'varying vec3 vColor;', 'varying float vDiscard;', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'if(vDiscard > 0.5) discard;', 'vec3 N;', 'N.xy = gl_PointCoord * 2.0 - vec2(1.0);', 'float mag = dot(N.xy, N.xy);', 'if (mag > 1.0) discard;   // discard fragments outside circle', 'N.z = sqrt(1.0 - mag);', 'vec3 light_dir = vec3(0.25, -0.25, 1.0);', 'float diffuse = max(0.25, dot(light_dir, N));', 'vec3 v = normalize(vec3(0.1, -0.2, 1.0));', 'vec3 h = normalize(light_dir + v);', 'float specular = pow(max(0.0, dot(N, h)), 100.0);', '// specular += 0.1 * rand(gl_PointCoord);', 'float fogIntensity = (gl_FragCoord.z / gl_FragCoord.w);', 'fogIntensity = fogIntensity + fogIntensity * 2.0;', 'fogIntensity *= clearColor.w;', 'vec3 color = vColor * diffuse + specular * 0.5;', 'gl_FragColor = mix(vec4(color, 1.0), clearColor, fogIntensity);', '}']);

Lore.Shaders['defaultEffect'] = new Lore.Shader('DefaultEffect', 1, {}, ['attribute vec2 v_coord;', 'uniform sampler2D fbo_texture;', 'varying vec2 f_texcoord;', 'void main() {', 'gl_Position = vec4(v_coord, 0.0, 1.0);', 'f_texcoord = (v_coord + 1.0) / 2.0;', '}'], ['uniform sampler2D fbo_texture;', 'varying vec2 f_texcoord;', 'void main(void) {', 'vec4 color = texture2D(fbo_texture, f_texcoord);', 'gl_FragColor = color;', '}']);

Lore.Shaders['fxaaEffect'] = new Lore.Shader('FXAAEffect', 1, { resolution: new Lore.Uniform('resolution', [500.0, 500.0], 'float_vec2') }, ['attribute vec2 v_coord;', 'uniform sampler2D fbo_texture;', 'uniform vec2 resolution;', 'varying vec2 f_texcoord;', 'void main() {', 'gl_Position = vec4(v_coord, 0.0, 1.0);', 'f_texcoord = (v_coord + 1.0) / 2.0;', '}'], /*
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
/**                if (neighbours[j] == locCode) {
                    // console.log(locCode);
                }

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

            for (var i = 0; i < pointIndices.length; i++) {
                // Points are indices to the vertices array
                // which stores x,y,z coordinates linear
                var _k = pointIndices[i] * 3;

                // Assign point to subtree, this gives a code
                // 000, 001, 010, 011, 100, 101, 110, 111
                // (-> 8 possible subtrees)
                if (vertices[_k + 0] >= aabb.center.components[0]) codes[i] |= 4;
                if (vertices[_k + 1] >= aabb.center.components[1]) codes[i] |= 2;
                if (vertices[_k + 2] >= aabb.center.components[2]) codes[i] |= 1;

                childPointCounts[codes[i]]++;
            }

            var nextPoints = new Array(8);
            var nextAabb = new Array(8);

            for (var i = 0; i < 8; i++) {
                if (childPointCounts[i] == 0) continue;
                nextPoints[i] = new Uint32Array(childPointCounts[i]);

                for (var j = 0, k = 0; j < pointIndices.length; j++) {
                    if (codes[j] == i) {
                        nextPoints[i][k++] = pointIndices[j];
                    }
                }

                var o = this.offsets[i];
                var offset = new Lore.Vector3f(o[0], o[1], o[2]);
                offset.multiplyScalar(aabb.radius);
                nextAabb[i] = new Lore.AABB(aabb.center.clone().add(offset), 0.5 * aabb.radius);
            }

            for (var i = 0; i < 8; i++) {
                if (childPointCounts[i] == 0) {
                    continue;
                }

                var nextLocCode = this.generateLocCode(locCode, i);
                this.build(nextPoints[i], vertices, nextAabb[i], nextLocCode);
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

                for (var i = 0; i < points.length; i++) {
                    result.push({
                        index: points[i],
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
            var radixSort = new Lore.RadixSort();
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

            for (var i = 0; i < sortedCellDistances.array.length; i++) {
                // Get the points from the cell and merge them with the already found ones
                var _locCode = cellDistances.locCodes[sortedCellDistances.indices[i]];
                var newPointDistances = this.pointDistancesSq(p.x, p.y, p.z, _locCode, positions);

                pointDistances = Lore.Octree.mergePointDistances(pointDistances, newPointDistances);

                // Sort the merged points
                var sortedNewPointDistances = radixSort.sort(pointDistances.distancesSq, true);

                for (var j = pointOffset; indexCount < k && j < sortedNewPointDistances.array.length; j++) {
                    if (sortedNewPointDistances.array[j] > sortedCellDistances.array[i + 1]) {
                        pointOffset = j;
                        break;
                    }

                    indices[j] = pointDistances.indices[sortedNewPointDistances.indices[j]];
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

                for (var j = 0; j < neighbours.length; j++) {
                    if (neighbours[j] !== locCode && !Lore.Utils.arrayContains(locCodes, neighbours[j])) {
                        locCodes.push(neighbours[j]);
                    }
                }
            }

            // Update the distances
            var l1 = locCodes.length;
            var l2 = distancesSq.length;

            if (l1 === l2) {
                return;
            }

            var dists = new Float32Array(l1 - l2);

            for (var i = l2, c = 0; i < l1; i++, c++) {
                dists[c] = this.aabbs[locCodes[i]].distanceToPointSq(x, y, z);
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
         * 
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
         * 
         * @returns {number} The location code.
         */

    }, {
        key: 'getLocCode',
        value: function getLocCode() {
            return this.locCode;
        }

        /**
         * Tests whether or not this axis-aligned bounding box is intersected by a ray.
         * 
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
         * 
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
         * 
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
         * 
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
         * 
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
         * 
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

        /**
         * Returns an array representing the 8 corners of the axis-aligned bounding box.
         * 
         * @param {Lore.AABB} aabb An axis-aligned bounding box.
         * @returns {Array} An array containing the 8 corners of the axisa-aligned bunding box. E.g [[x, y, z], [x, y, z], ...]
         */

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
         * 
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

/** A class representing a raycaster. */
Lore.Raycaster = function () {
    function Raycaster() {
        _classCallCheck(this, Raycaster);

        this.ray = new Lore.Ray();
        this.near = 0;
        this.far = 1000;
        this.threshold = 0.1;
    }

    /**
     * Set the raycaster based on a camera and the current mouse coordinates.
     * 
     * @param {Lore.CameraBase} camera A camera object which extends Lore.CameraBase.
     * @param {number} mouseX The x coordinate of the mouse.
     * @param {number} mouseY The y coordinate of the mouse.
     * @returns {Lore.Raycaster} Itself.
     */


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