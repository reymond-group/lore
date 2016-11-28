Lore.Renderer = function(targetId, options) {
    this.canvas = document.getElementById(targetId);
    this.parent = this.canvas.parentElement;
    this.antialiasing = options.antialiasing === false ? false : true;
    this.verbose = options.verbose === true ? true : false;
    this.fpsElement = options.fps;
    this.fps = 0;
    this.clearColor = options.clearColor || new Lore.Color();
    this.clearDepth = 'clearDepth' in options ? options.clearDepth : 1.0;
    this.enableDepthTest = 'enableDepthTest' in options ? options.enableDepthTest : true;
    this.camera = options.camera || new Lore.OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / -2);
    this.shaders = []
    this.geometries = {};
    this.render = function(camera, geometries) {};

    this.effect = null;

    this.lastTiming = performance.now();

    // Disable context menu on right click
    this.canvas.addEventListener('contextmenu', function(e) {
        if (e.button = 2) {
            e.preventDefault();
            return false;
        }
    });

    this.init();

    // Attach the controls last
    var center = options.center ? options.center : new Lore.Vector3f();
    this.controls = options.controls || new Lore.OrbitalControls(this, 1200, center);
}

Lore.Renderer.prototype = {
    constructor: Lore.Renderer,
    ready: false,
    gl: null,
    init: function() {
        var _this = this;

        var settings = { antialias: this.antialiasing };

        this.gl = this.canvas.getContext('webgl', settings) || this.canvas.getContext('experimental-webgl', settings);

        if (!this.gl) {
            console.error('Could not initialize the WebGL context.');
            return;
        }

        var g = this.gl;

        if(this.verbose) {
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
        if(extOes === null) {
            console.warn('Could not load extension: ' + oes + '.');
        }

        var wdb = 'WEBGL_draw_buffers';
        var extWdb = g.getExtension(wdb);
        if(extWdb === null) {
            console.warn('Could not load extension: ' + wdb + '.');
        }

        var wdt = 'WEBGL_depth_texture';
        var extWdt = g.getExtension(wdt);
        if(extWdt === null) {
            console.warn('Could not load extension: ' + wdt + '.');
        }


        this.setClearColor(this.clearColor);
        g.clearDepth(this.clearDepth);

        if (this.enableDepthTest) {
            g.enable(g.DEPTH_TEST);
            g.depthFunc(g.LESS);
            console.log('enable depth test');
            //g.depthFunc(g.LEQUAL);
        }

        g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
        g.enable(g.BLEND);

        setTimeout(function() {
            _this.updateViewport(0, 0, _this.getWidth(), _this.getHeight());
        }, 200);

        window.addEventListener('resize', function(event) {
            _this.updateViewport(0, 0, _this.getWidth(), _this.getHeight());
        });

        // Init effect(s)
        this.effect = new Lore.Effect(this, 'fxaaEffect');

        this.ready = true;
        this.animate();
    },

    setClearColor: function(color) {
        this.clearColor = color;
        var cc = this.clearColor.components;
        this.gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
    },

    getWidth: function() {
        return this.parent.offsetWidth;
    },

    getHeight: function() {
        return this.parent.offsetHeight;
    },

    updateViewport: function(x, y, width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(x, y, width, height);

        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;

        this.camera.updateProjectionMatrix();
    },

    animate: function() {
        var that = this;

        requestAnimationFrame(function() {
            that.animate();
        });

        if(this.fpsElement) {
            var now = performance.now();
            var delta = now - this.lastTiming;
            this.lastTiming = now;
            this.fps = Math.round(1000.0 / delta);
            this.fpsElement.innerHTML = this.fps;
        }

        // this.effect.bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.render(this.camera, this.geometries);
        // this.effect.unbind();

        this.camera.isProjectionMatrixStale = false;
        this.camera.isViewMatrixStale = false;
    },

    createProgram: function(shader) {
        var program = shader.init(this.gl);
        this.shaders.push(shader);
        return this.shaders.length - 1;
    },

    createGeometry: function(name, shader) {
        var geometry = new Lore.Geometry(name, this.gl, this.shaders[shader]);
        this.geometries[name] = geometry;
        return geometry;
    }
}
