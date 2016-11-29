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

    sceneToScreen: function(v) {
        var vector = v.clone();
        var canvas = this.renderer.domElement;

        vector.project(this);

        // Map to 2D screen space
        // Correct for high dpi display by dividing by device pixel ratio
        vector.x = Math.round((vector.x + 1) * canvas.width  / 2) / window.devicePixelRatio;
        vector.y = Math.round((-vector.y + 1) * canvas.height / 2) / window.devicePixelRatio;
        vector.z = 0;

        return { x: vector.x, y: vector.y };
    },
});
