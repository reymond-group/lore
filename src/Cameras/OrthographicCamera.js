/** A class representing an orthographic camera. */
Lore.OrthographicCamera = class OrthographicCamera extends Lore.CameraBase {
    /**
     * Creates an instance of OrthographicCamera.
     * @param {Number} left Left extend of the viewing volume.
     * @param {Number} right Right extend of the viewing volume.
     * @param {Number} top Top extend of the viewing volume.
     * @param {Number} bottom Bottom extend of the viewing volume.
     * @param {Number} near Near extend of the viewing volume.
     * @param {Number} far Far extend of the viewing volume.
     */ 
    constructor(left, right, top, bottom, near, far) {
        super();

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

    /**
     * Updates the projection matrix of this orthographic camera.
     * 
     */
    updateProjectionMatrix() {
        let width = (this.right - this.left) / (2.0 * this.zoom);
        let height = (this.top - this.bottom) / (2.0 * this.zoom);
        let x = (this.right + this.left) / 2.0;
        let y = (this.top + this.bottom) / 2.0;

        let left = x - width;
        let right = x + width;
        let top = y + height;
        let bottom = y - height;

        this.projectionMatrix.setOrthographic(left, right, top, bottom, this.near, this.far);
        this.isProjectionMatrixStale = true;
    }
}
