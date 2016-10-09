Lore.OrbitalControls = function(renderer, radius, lookAt) {
    Lore.ControlsBase.call(this, renderer);
    this.up = Lore.Vector3f.up();
    this.radius = radius;
    this.camera = renderer.camera;
    this.canvas = renderer.canvas;

    this.dPhi = 0.0;
    this.dTheta = 0.0;
    this.dPan = new Lore.Vector3f();

    this.spherical = new Lore.SphericalCoords();
    this.lookAt = lookAt || new Lore.Vector3f();

    this.scale = 0.95;
    this.zoomed = false;

    this.camera.position = new Lore.Vector3f(0, 0, radius);
    this.camera.updateProjectionMatrix();
    this.camera.updateViewMatrix();

    var that = this;

    this.addEventListener('mousedrag', function(e) {
        that.update(e.e, e.source);
    });

    this.addEventListener('mousewheel', function(e) {
        that.update({ x: 0, y: -e.e }, 'wheel');
    });

    // Initial update
    this.update({ x: 0, y: 0 }, 'left');
}

Lore.OrbitalControls.prototype = Object.assign(Object.create(Lore.ControlsBase.prototype), {
    constructor: Lore.OrbitalControls,
    update: function(e, source) {
        if(source == 'left') {
	        // Rotate
            this.dTheta = -2 * Math.PI * e.x / (this.canvas.clientWidth * this.camera.zoom);
            this.dPhi   = -2 * Math.PI * e.y / (this.canvas.clientHeight * this.camera.zoom);
        }
        else if(source == 'right') {
            // Translate
            var x = e.x * (this.camera.right - this.camera.left) / this.camera.zoom / this.canvas.clientWidth;
            var y = e.y * (this.camera.top - this.camera.bottom) / this.camera.zoom / this.canvas.clientHeight;

            var u = this.camera.getUpVector().components;
            var r = this.camera.getRightVector().components;

            this.dPan.components[0] = r[0] * -x + u[0] * y;
            this.dPan.components[1] = r[1] * -x + u[1] * y;
            this.dPan.components[2] = r[2] * -x + u[2] * y;
        }
        else if(source == 'middle' || source == 'wheel') {
            if(e.y > 0) {
                // Zoom Out
                this.camera.zoom = Math.max(0, this.camera.zoom * this.scale);
                this.camera.updateProjectionMatrix();
                this.zoomed = true;
            }
            else if(e.y < 0) {
                // Zoom In
                this.camera.zoom = Math.max(0, this.camera.zoom / this.scale);
                this.camera.updateProjectionMatrix();
                this.zoomed = true;
            }
        }

        // Update the camera
        var offset = this.camera.position.clone().subtract(this.lookAt);

        //var q = new Lore.Quaternion();
        //q.setFromUnitVectors(this.up, this.up);
        //var qInverse = q.clone().inverse();
        //offset.applyQuaternion(q);

        this.spherical.setFromVector(offset);
        this.spherical.components[1] += this.dPhi;
        this.spherical.components[2] += this.dTheta;
        this.spherical.limit(0.0, 0.5 * Math.PI, -Infinity, Infinity);
        this.spherical.secure();


        // Limit radius here

        this.lookAt.add(this.dPan);
        offset.setFromSphericalCoords(this.spherical);

        //offset.applyQuaternion(qInverse);

        this.camera.position.copyFrom(this.lookAt).add(offset);

        this.camera.setLookAt(this.lookAt);

        this.camera.updateViewMatrix();

        this.dPhi = 0.0;
        this.dTheta = 0.0;
        this.dPan.set(0, 0, 0);

        // Handle zoom, this is copied from THREE.js OrbitCamera
        if(this.zoomed) {
            this.zoomed = false;
        }
    }
});
