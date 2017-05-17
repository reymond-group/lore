/** A class representing an perspective camera. */
Lore.PerspectiveCamera = class PerspectiveCamera extends Lore.CameraBase {
    /**
     * Creates an instance of PerspectiveCamera.
     * @param {Number} fov The field of view.
     * @param {Number} aspect The aspect ration (width / height).
     * @param {Number} near Near extend of the viewing volume.
     * @param {Number} far Far extend of the viewing volume.
     */ 
    constructor(fov, aspect, near = 0.1, far = 2500) {
        super();

        this.type = 'Lore.PerspectiveCamera';
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.updateProjectionMatrix();
    }

    /**
     * Updates the projection matrix of this perspective camera.
     * 
     */
    updateProjectionMatrix() {
        this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
        this.isProjectionMatrixStale = true;
    }

    /**
     * Has to be called when the viewport size changes (e.g. window resize).
     * 
     * @param {Number} width The width of the viewport.
     * @param {Number} height The height of the viewport.
     */
    updateViewport(width, height) {
        this.aspect = width / height;
    }
}
