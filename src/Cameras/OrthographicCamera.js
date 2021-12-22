//@ts-check

const CameraBase = require('./CameraBase');
const Vector3f = require('../Math/Vector3f');
const Matrix4f = require('../Math/Matrix4f');

/** 
 * A class representing an orthographic camera. 
 * 
 * @property {number} [zoom=1.0] The zoom value of this camera.
 * @property {number} left The left border of the frustum.
 * @property {number} right The right border of the frustum.
 * @property {number} top The top border of the frustum.
 * @property {number} bottom The bottom border of the frustum.
 * @property {number} near The near plane distance of the frustum.
 * @property {number} far The far plane distance of the frustum.
 * */
class OrthographicCamera extends CameraBase {
    /**
     * Creates an instance of OrthographicCamera.
     * @param {Number} left Left extend of the viewing volume.
     * @param {Number} right Right extend of the viewing volume.
     * @param {Number} top Top extend of the viewing volume.
     * @param {Number} bottom Bottom extend of the viewing volume.
     * @param {Number} near Near extend of the viewing volume.
     * @param {Number} far Far extend of the viewing volume.
     */
    constructor(left, right, top, bottom, near = 0.1, far = 2500) {
        super();

        this.type = 'Lore.OrthographicCamera';
        this.zoom = 1.0;
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;

        this.updateProjectionMatrix();
    }

    /**
     * Updates the projection matrix of this orthographic camera.
     * 
     * @returns {OrthographicCamera} Returns itself.
     */
    updateProjectionMatrix() {
        //TODO: This is called in each render loop? Does it have to?
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

        this.raiseEvent('projectionmatrixupdated', { source: this });

        return this;
    }


    /**
     * Calculate the required zoom factor to contain an a specified width and height.
     * 
     * @param {Number} width Width of regtion to be contained.
     * @param {Number} height Height of region to be contained.
     * @param {Number} padding Padding applied to the zoom as a fraction of width and height.
     * 
     * @returns {Number} The zoom to be set to contain the specified width and height.
     */
    getRequiredZoomToContain(width, height, padding = 0.0) {

        let zoom_width = (this.right - this.left) / (width + width * padding);
        let zoom_height = (this.top - this.bottom) / (height + height * padding);

        return Math.min(zoom_width, zoom_height);
    }

    /**
     * Has to be called when the viewport size changes (e.g. window resize).
     * 
     * @param {Number} width The width of the viewport.
     * @param {Number} height The height of the viewport.
     * 
     * @returns {OrthographicCamera} Returns itself.
     */
    updateViewport(width, height) {
        this.left = -width / 2.0;
        this.right = width / 2.0;
        this.top = height / 2.0;
        this.bottom = -height / 2.0;

        this.raiseEvent('viewportupdated', { source: this });

        return this;
    }

    /**
     * Returns the frustum of the orthographic camera which is essentially just a box.
     * 
     * @returns {Vector3f[]} An array that contains two vectors defining minima and maxima.
     */
    getFrustum() {
        let z = (this.near + this.far) / (this.near - this.far)
        let min = new Vector3f(-1.0, -1.0, z);
        let max = new Vector3f(1.0, 1.0, z);

        Matrix4f.unprojectVector(min, this);
        Matrix4f.unprojectVector(max, this);

        return [min, max];
    }
}

module.exports = OrthographicCamera;