Lore.CameraBase = function() {
    Lore.Node.call(this);
    this.type = 'Lore.CameraBase';
    this.renderer = null;
    this.isProjectionMatrixStale = false;
    this.isViewMatrixStale = false;

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
        this.rotation.lookAt(this.position, v, Lore.Vector3f.up());
    },

    updateProjectionMatrix: function() {

    },

    updateViewMatrix: function() {
        this.update();
        var viewMatrix = this.modelMatrix.clone();
        viewMatrix.invert();
        this.viewMatrix = viewMatrix;
        this.isViewMatrixStale = true;
    },

    getProjectionMatrix: function() {
        return this.projectionMatrix.entries;
    },

    getViewMatrix: function() {
        return this.viewMatrix.entries;
    },

    sceneToScreen: function(v, renderer) {
        var vector = v.clone();
        var canvas = renderer.canvas;
        vector.project(this);
        
        // Map to 2D screen space
        // Correct for high dpi display by dividing by device pixel ratio
        var x = Math.round((vector.components[0] + 1) * canvas.width  / 2);// / window.devicePixelRatio;
        var y = Math.round((-vector.components[1] + 1) * canvas.height / 2);// / window.devicePixelRatio;

        return [ x, y ];
    },
});
