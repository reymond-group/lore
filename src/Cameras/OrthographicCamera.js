Lore.OrthographicCamera = function(left, right, top, bottom, near, far) {
    Lore.CameraBase.call(this);
    this.type = 'Lore.OrthographicCamera';
    this.zoom = 1.0;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near || 0.1;
    this.far = far || 2500;

    this.updateProjectionMatrix();
}

Lore.OrthographicCamera.prototype = Object.assign(Object.create(Lore.CameraBase.prototype), {
    constructor: Lore.OrthographicCamera,

    updateProjectionMatrix: function() {
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
});
