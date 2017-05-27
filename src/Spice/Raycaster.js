/** A class representing a raycaster. */
Lore.Raycaster = class Raycaster {
    constructor() {
        this.ray = new Lore.Ray();
        this.near = 0;
        this.far = 1000;
        this.threshold = 0.1;
    }

    /**
     * Set the raycaster based on a camera and the current mouse coordinates.
     * 
     * @param {Lore.CameraBase} camera A camera object which extends Lore.CameraBase.
     * @param {number} mouseX The x coordinate of the mouse.
     * @param {number} mouseY The y coordinate of the mouse.
     * @returns {Lore.Raycaster} Itself.
     */
    set(camera, mouseX, mouseY) {
        this.near = camera.near;
        this.far = camera.far;

        this.ray.source.set(mouseX, mouseY, (camera.near + camera.far) / (camera.near - camera.far));
        this.ray.source.unproject(camera);

        this.ray.direction.set(0.0, 0.0, -1.0);
        this.ray.direction.toDirection(camera.modelMatrix);
        
        return this;
    }
}
