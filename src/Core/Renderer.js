Lore.Renderer = class Renderer {

    constructor(targetId, options) {
        this.defaults = {
            antialiasing: true,
            verbose: false,
            fpsElement: document.getElementById('fps'),
            clearColor: Lore.Color.fromHex('#000000'),
            clearDepth: 1.0,
            center: new Lore.Vector3f(),
            enableDepthTest: true
        }

        this.opts = Lore.Utils.extend(true, this.defaults, options);
        
        this.canvas = document.getElementById(targetId);
        this.parent = this.canvas.parentElement;
        this.fps = 0;
        this.fpsCount = 0;
        this.maxFps = 1000 / 30;
        this.devicePixelRatio = this.getDevicePixelRatio();
        this.camera = new Lore.OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2,
            this.getHeight() / 2, this.getHeight() / -2);

        this.geometries = {};
        this.ready = false;
        this.gl = null;
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

        let that = this;
        that.init();

        // Attach the controls last
        let center = options.center ? options.center : new Lore.Vector3f();
        that.controls = options.controls || new Lore.OrbitalControls(that, 1200, center);
    }

    init() {
        let _this = this;

        let settings = {
            antialias: this.opts.antialiasing
        };

        this.gl = this.canvas.getContext('webgl', settings) || 
            this.canvas.getContext('experimental-webgl', settings);

        if (!this.gl) {
            console.error('Could not initialize the WebGL context.');
            return;
        }

        let g = this.gl;
        console.log(g.getParameter(g.ALIASED_LINE_WIDTH_RANGE));

        if (this.opts.verbose) {
            let hasAA = g.getContextAttributes().antialias;
            let size = g.getParameter(g.SAMPLES);
            console.info('Antialiasing: ' + hasAA + ' (' + size + 'x)');

            let highp = g.getShaderPrecisionFormat(g.FRAGMENT_SHADER, g.HIGH_FLOAT);
            let hasHighp = highp.precision != 0;
            console.info('High precision support: ' + hasHighp);
        }

        // Blending
        //g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA);
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


        this.setClearColor(this.opts.clearColor);
        g.clearDepth(this.opts.clearDepth);

        if (this.opts.enableDepthTest) {
            g.enable(g.DEPTH_TEST);
            g.depthFunc(g.LEQUAL);
            
            if (this.opts.verbose) {
                console.log('enable depth test');
            }
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
            let width = _this.getWidth();
            let height = _this.getHeight();
            _this.updateViewport(0, 0, width, height);
        });

        // Init effect(s)
        this.effect = new Lore.Effect(this, 'fxaaEffect');
        this.ready = true;
        this.animate();
    }

    setClearColor(color) {
        this.opts.clearColor = color;
        
        let cc = this.opts.clearColor.components;
        
        this.gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
    }

    getWidth() {
        return this.canvas.offsetWidth;
    }

    getHeight() {
        return this.canvas.offsetHeight;
    }

    updateViewport(x, y, width, height) {
        // width *= this.devicePixelRatio;
        // height *= this.devicePixelRatio;
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(x, y, width, height);

        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;

        this.camera.updateProjectionMatrix();

        // Also reinit the buffers and textures for the effect(s)
        this.effect = new Lore.Effect(this, 'fxaaEffect');
        this.effect.shader.uniforms.resolution.setValue([width, height]);
    }

    animate() {
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

        this.camera.isProjectionMatrixStale = false;
        this.camera.isViewMatrixStale = false;
    }

    createGeometry(name, shaderName) {
        let shader = Lore.getShader(shaderName);
        shader.init(this.gl);
        let geometry = new Lore.Geometry(name, this.gl, shader);

        this.geometries[name] = geometry;

        return geometry;
    }

    setMaxFps(fps) {
        this.maxFps = 1000 / fps;
    }

    getDevicePixelRatio() {
        return window.devicePixelRatio || 1;
    }
}
