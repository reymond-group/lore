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
