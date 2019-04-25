//@ts-check
// const Lore = require('../Lore');
const Shaders = require('../Shaders')
const Effect = require('./Effect')
const Vector3f = require('../Math/Vector3f');
const Color = require('./Color');
const Utils = require('../Utils/Utils');
const Geometry = require('./Geometry');
const ControlsBase = require('../Controls/ControlsBase');
const OrbitalControls = require('../Controls/OrbitalControls');
const CameraBase = require('../Cameras/CameraBase');
const OrthographicCamera = require('../Cameras/OrthographicCamera');

/** 
 * A class representing the WebGL renderer. 
 * 
 * @property {Object} opts An object containing options.
 * @property {Any} camera The camera associated with this renderer.
 * @property {ControlsBase} controls The controls associated with this renderer.
 */
class Renderer {

  /**
   * Creates an instance of Renderer.
   * @param {String} targetId The id of a canvas element.
   * @param {any} options The options.
   */
  constructor(targetId, options) {
    this.defaults = {
      antialiasing: true,
      verbose: false,
      fpsElement: document.getElementById('fps'),
      clearColor: Color.fromHex('#000000'),
      clearDepth: 1.0,
      radius: 500,
      center: new Vector3f(0.0, 0.0, 0.0),
      enableDepthTest: true,
      alphaBlending: false,
      preserveDrawingBuffer: false
    }

    this.opts = Utils.extend(true, this.defaults, options);

    this.canvas = document.getElementById(targetId);
    this.webgl2 = true;
    this.parent = this.canvas.parentElement;
    this.fps = 0;
    this.fpsCount = 0;
    this.maxFps = 1000 / 30;
    this.devicePixelRatio = this.getDevicePixelRatio();
    this.camera = new OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / -2);
    // this.camera = new PerspectiveCamera(25.0, this.getWidth() / this.getHeight());

    this.geometries = {};
    this.ready = false;
    this.gl = null;
    this.render = function (camera, geometries) {};
    this.effect = null;
    this.lastTiming = performance.now();

    this.disableContextMenu();

    let that = this;
    that.init();

    // Attach the controls last
    let center = options.center ? options.center : new Vector3f(0.0, 0.0, 0.0);

    this.controls = new OrbitalControls(that, this.opts.radius || 500, center);
  }

  /**
   * Initialize and start the renderer.
   */
  init() {
    let _this = this;

    let settings = {
      antialias: this.opts.antialiasing,
      preserveDrawingBuffer: this.opts.preserveDrawingBuffer
    };

    this.gl = this.canvas.getContext('webgl2', settings) || this.canvas.getContext('experimental-webgl2');

    if (!this.gl) {
      this.webgl2 = false;
      this.gl = this.canvas.getContext('webgl', settings) ||
        this.canvas.getContext('experimental-webgl', settings);
    }

    if (!this.gl) {
      console.error('Could not initialize the WebGL context.');
      return;
    }

    let g = this.gl;

    if (this.opts.verbose) {
      let hasAA = g.getContextAttributes().antialias;
      let size = g.getParameter(g.SAMPLES);
      console.info('Antialiasing: ' + hasAA + ' (' + size + 'x)');

      let highp = g.getShaderPrecisionFormat(g.FRAGMENT_SHADER, g.HIGH_FLOAT);
      let hasHighp = highp.precision != 0;
      console.info('High precision support: ' + hasHighp);

      console.info('WebGL2 supported: ' + this.webgl2);
    }

    // Extensions
    let oes = 'OES_standard_derivatives';
    let extOes = g.getExtension(oes);

    if (extOes === null) {
      console.warn('Could not load extension: ' + oes + '.');
    }

    let wdb = 'WEBGL_draw_buffers';
    let extWdb = g.getExtension(wdb);

    if (extWdb === null) {
      console.warn('Could not load extension: ' + wdb + '.');
    }

    let wdt = 'WEBGL_depth_texture';
    let extWdt = g.getExtension(wdt);

    if (extWdt === null) {
      console.warn('Could not load extension: ' + wdt + '.');
    }

    let fgd = 'EXT_frag_depth';
    let extFgd = g.getExtension(fgd);

    if (extFgd === null) {
      console.warn('Could not load extension: ' + fgd + '.');
    }

    this.setClearColor(this.opts.clearColor);

    // Blending
    // if (!this.webgl2) {
    if (!this.opts.alphaBlending) {
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
      g.blendFunc(g.ONE, g.ONE);
    }

    this.ready = true;
    this.animate();
  }

  /**
   * Disables the context menu on the canvas element. 
   */
  disableContextMenu() {
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
   * @param {Color} color The clear color.
   */
  setClearColor(color) {
    this.opts.clearColor = color;

    let cc = this.opts.clearColor.components;

    this.gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
  }

  /**
   * Get the actual width of the canvas.
   * 
   * @returns {Number} The width of the canvas.
   */
  getWidth() {
    return this.canvas.offsetWidth;
  }

  /**
   * Get the actual height of the canvas.
   * 
   * @returns {Number} The height of the canvas.
   */
  getHeight() {
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
  updateViewport(x, y, width, height) {
    width *= this.devicePixelRatio;
    height *= this.devicePixelRatio;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(x, y, width, height);

    this.camera.updateViewport(width, height);
    this.camera.updateProjectionMatrix();
  }

  /**
   * The main rendering loop. 
   */
  animate() {
    this.updateViewport(0, 0, this.getWidth(), this.getHeight());
    let that = this;

    setTimeout(function () {
      requestAnimationFrame(function () {
        that.animate();
      });
    }, this.maxFps);

    if (this.opts.fpsElement) {
      let now = performance.now();
      let delta = now - this.lastTiming;

      this.lastTiming = now;
      if (this.fpsCount < 10) {
        this.fps += Math.round(1000.0 / delta);
        this.fpsCount++;
      } else { // 
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
   * @returns {Geometry} The created geometry.
   */
  createGeometry(name, shaderName) {
    let shader = Shaders[shaderName].clone();
    shader.init(this.gl, this.webgl2);
    let geometry = new Geometry(name, this.gl, shader);

    this.geometries[name] = geometry;

    return geometry;
  }

  /**
   * Set the maximum frames per second of this renderer.
   * 
   * @param {Number} fps Maximum frames per second.
   */
  setMaxFps(fps) {
    this.maxFps = 1000 / fps;
  }

  /**
   * Get the device pixel ratio.
   * 
   * @returns {Number} The device pixel ratio.
   */
  getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
  }
}

module.exports = Renderer