Lore.Raycaster = function() {
    this.ray = new Lore.Ray();
    this.near = 0;
    this.far = 1000;
    this.threshold = 0.5;
}

Lore.Raycaster.prototype = {
    constructor: Lore.Raycaster,

    set: function(camera, mouseX, mouseY) {
        this.near = camera.near;
        this.far = camera.far;

        this.ray.source.set(mouseX, mouseY, (camera.near + camera.far) / (camera.near - camera.far));
        this.ray.source.unproject(camera);

        this.ray.direction.set(0.0, 0.0, -1.0);
        this.ray.direction.toDirection(camera.modelMatrix);
    },
}
