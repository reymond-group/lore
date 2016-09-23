Lore.Renderer = function(targetId, options) {
    this.canvas = document.getElementById(targetId);
    this.antialiasing = options.antialiasing === false ? false : true;
    this.verbose = options.verbose === true ? true : false;
    this.fpsElement = options.fps;
    this.fps = 0;
    this.clearColor = options.clearColor || new Lore.Color();
    this.clearDepth = 'clearDepth' in options ? options.clearDepth : 1.0;
    this.enableDepthTest = 'enableDepthTest' in options ? options.enableDepthTest : true;
    
    this.camera = options.camera || new Lore.OrthographicCamera(500 / -2, 500 / 2, 500 / 2, 500 / -2);
    this.shaders = []
    this.geometries = [];
    this.render = function(camera, geometries) {};
    this.sceneTexture;
    this.effect;

    this.lastTiming = performance.now();

    // Disable context menu on right click
    this.canvas.addEventListener('contextmenu', function(e) {
        if (e.button = 2) {
            e.preventDefault();
            return false;
        }
    });

    this.init();
}

Lore.Renderer.prototype = {
    constructor: Lore.Renderer,
    ready: false,
    gl: null,
    init: function() {
        var _this = this;
        
        var settings = { antialias: this.antialiasing, premultipliedAlpha: false, alpha: false };

        this.gl = this.canvas.getContext('webgl', settings) || this.canvas.getContext('experimental-webgl', settings);
        
        if (!this.gl) {
            console.error('Could not initialize the WebGL context.');
            return;
        }
       
        var g = this.gl;

        // Initialize scene texture to apply post processing effects to
        this.sceneTexture = g.createTexture();
        g.bindTexture(g.TEXTURE_2D, this.sceneTexture);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
        
        // Initialize effect(s)
        var effectShader = this.createProgram(Lore.Shaders.fxaa);
        this.effect = new Lore.Effect(g, this.canvas.width, this.canvas.height, this.shaders[effectShader]);

        if(this.verbose) {
            var hasAA = g.getContextAttributes().antialias;
            var size = g.getParameter(g.SAMPLES);
            console.info('Antialiasing: ' + hasAA + ' (' + size + 'x)');

            var highp = g.getShaderPrecisionFormat(g.FRAGMENT_SHADER, g.HIGH_FLOAT);
            var hasHighp = highp.precision != 0;
            console.info('High precision support: ' + hasHighp);
        }

        // Blending
        g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
       
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

        g.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
        g.clearDepth(this.clearDepth);

        if (this.enableDepthTest) {
            g.enable(g.DEPTH_TEST);
            g.depthFunc(g.LEQUAL);
        }

        this.updateViewport(0, 0, this.canvas.width, this.canvas.height);
        window.addEventListener('resize', function(event) {
            _this.updateViewport(0, 0, _this.canvas.width, _this.canvas.height);
        });

        this.ready = true;
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

        if(this.fpsElement) {
            var now = performance.now();
            var delta = now - this.lastTiming;
            this.lastTiming = now;
            this.fps = Math.round(1000.0 / delta);
            this.fpsElement.innerHTML = this.fps;
        }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.render(this.camera, this.geometries);
    
        // Post-processing
        this.effect.setTextureFromCanvas(this.sceneTexture, this.canvas);
        this.effect.bind();
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
