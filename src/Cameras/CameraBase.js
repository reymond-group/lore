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

  lookAt: function(v) {
    var m = new Lore.Matrix4f.lookAt(this.position, v, this.getUpVector());
    this.rotation.setFromMatrix(m);
  },

  updateProjectionMatrix: function() {

  },

  updateViewMatrix: function() {
    var viewMatrix = Lore.Matrix4f.compose(this.position, this.rotation, this.scale);
    viewMatrix.invert();
    this.viewMatrix = viewMatrix;
    this.isViewMatrixStale = true;
  },

  getProjectionMatrix: function() {
    return this.projectionMatrix.entries;
  },

  getViewMatrix: function() {
    return this.viewMatrix.entries;
  }
});
