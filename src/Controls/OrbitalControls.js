Lore.OrbitalControls = function(renderer, radius) {
    Lore.ControlsBase.call(this, renderer);
    this.up = Lore.Vector3f.up();
    this.radius = radius;
    this.camera = renderer.camera;
    this.canvas = renderer.canvas;

    this.dPhi = 0.0;
    this.dTheta = 0.0;
    this.spherical = new Lore.SphericalCoords();
    this.lookAt = new Lore.Vector3f();

    this.camera.position = new Lore.Vector3f(0, 0, radius);
    this.camera.updateProjectionMatrix();
    this.camera.updateViewMatrix();
    
    var that = this;
    this.mousedrag = function(e, source) {
        console.log(source);	
        if(source == 'left') {
	        // Rotate
            that.dTheta = -2 * Math.PI * e.x / that.canvas.clientWidth * 1.0;
            that.dPhi   = -2 * Math.PI * e.y / that.canvas.clientHeight * 1.0;
        }
        else if(source == 'right') {
            // Translate
            var forward = that.camera.getForwardVector();
            var up = that.camera.getUpVector();

            var fx = forward.components[0], fz = forward.components[2];
            var ux = up.components[0], uz = up.components[2];

            that.camera.lookAt.components[0] += e.y * fx + e.x * -fz;
            that.camera.lookAt.components[2] += e.y * fz + e.x * fx;
            that.camera.lookAt.components[0] += e.y * ux + e.x * -uz;
            that.camera.lookAt.components[2] += e.y * uz + e.x * ux;
        }
        // Update the camera
        
        var offset = that.camera.position.clone().subtract(that.lookAt);
        var q = new Lore.Quaternion();
        q.setFromUnitVectors(that.camera.getUpVector(), that.up);
        var qInverse = q.clone().inverse();
        
        offset.applyQuaternion(q);
        that.spherical.setFromVector(offset);
        
        that.spherical.components[1] += that.dPhi;
        that.spherical.components[2] += that.dTheta;
        
        that.spherical.limit(); 
        that.spherical.secure();
        
        // Limit radius here

        // that.camera.lookAt.add(panOffset);
        offset.setFromSphericalCoords(that.spherical);
        offset.applyQuaternion(qInverse);

        that.camera.position.copyFrom(that.lookAt).add(offset);
        
        that.camera.setLookAt(that.lookAt);

        that.camera.updateProjectionMatrix();
        that.camera.updateViewMatrix();

        that.dPhi = 0.0;
        that.dTheta = 0.0;
    };
}

Lore.OrbitalControls.prototype = Object.assign(Object.create(Lore.ControlsBase.prototype), {
    constructor: Lore.OrbitalControls,
});
