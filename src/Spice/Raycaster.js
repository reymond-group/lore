Lore.Raycaster = function() {
    this.origin = new Lore.Vector3f();
    this.direction = new Lore.Vector3f();
    this.near = 0;
    this.far = 1000;
    this.threshold = 0.5;
}

Lore.Raycaster.prototype = {
    constructor: Lore.Raycaster,

    set: function(camera, mouseX, mouseY) {
        this.near = camera.near;
        this.far = camera.far;

        this.origin.set(mouseX, mouseY, (camera.near + camera.far) / (camera.near - camera.far));
        this.origin.unproject(camera);

        this.direction.set(0.0, 0.0, -1.0);
        this.direction.toDirection(camera.modelMatrix);
    }
}
