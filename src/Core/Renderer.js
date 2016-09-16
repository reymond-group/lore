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
