//@ts-check

const Ray = require('../Math/Ray');
const Matrix4f = require('../Math/Matrix4f')

/** A class representing a raycaster. */
class Raycaster {
  /**
   * Creates an instance of Raycaster.
   * 
   * @param {Number} [threshold=0.1] Data to be sent to the listening functions.
   */
    constructor(threshold = 0.1) {
        this.ray = new Ray();
        this.near = 0;
        this.far = 1000;
        this.threshold = threshold;
    }

    /**
     * Set the raycaster based on a camera and the current mouse coordinates.
     * 
     * @param {CameraBase} camera A camera object which extends Lore.CameraBase.
     * @param {number} mouseX The x coordinate of the mouse.
     * @param {number} mouseY The y coordinate of the mouse.
     * @returns {Raycaster} Itself.
     */
    set(camera, mouseX, mouseY) {
        this.near = camera.near;
        this.far = camera.far;

        this.ray.source.set(mouseX, mouseY, (camera.near + camera.far) / (camera.near - camera.far));
        Matrix4f.unprojectVector(this.ray.source, camera);

        this.ray.direction.set(0.0, 0.0, -1.0);
        this.ray.direction.toDirection(camera.modelMatrix);
        
        return this;
    }
}

module.exports = Raycaster
