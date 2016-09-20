Lore.OrbitalControls = function(renderer, radius) {
    Lore.ControlsBase.call(this, renderer);
    this.up = Lore.Vector3f.up();
    this.radius = radius;
    this.camera = renderer.camera;
    this.canvas = renderer.canvas;

    this.dPhi = 0.0;
    this.dTheta = 0.0;
    this.dPan = new Lore.Vector3f();

    this.spherical = new Lore.SphericalCoords();
    this.lookAt = new Lore.Vector3f();

    this.camera.position = new Lore.Vector3f(0, 0, radius);
    this.camera.updateProjectionMatrix();
    this.camera.updateViewMatrix();
    
    var that = this;
    this.mousedrag = function(e, source) {
        if(source == 'left') {
	        // Rotate
            that.dTheta = -2 * Math.PI * e.x / that.canvas.clientWidth * 1.0;
            that.dPhi   = -2 * Math.PI * e.y / that.canvas.clientHeight * 1.0;
        }
        else if(source == 'right') {
            // Translate
            var x = e.x * (that.camera.right - that.camera.left) / 1.0 / that.canvas.clientWidth;
            var y = e.y * (that.camera.top - that.camera.bottom) / 1.0 / that.canvas.clientHeight;
            
            var m = that.camera.viewMatrix.entries;
            that.dPan.components[0] = m[0] * -x + m[4] * y;
            that.dPan.components[1] = m[1] * -x + m[5] * y;
            that.dPan.components[2] = m[2] * -x + m[6] * y;
        }
        
        // Update the camera
        var offset = that.camera.position.clone().subtract(that.lookAt);
        
        //var q = new Lore.Quaternion();
        //q.setFromUnitVectors(that.up, that.up);
        //var qInverse = q.clone().inverse();
        //offset.applyQuaternion(q);
        
        that.spherical.setFromVector(offset);
        that.spherical.components[1] += that.dPhi;
        that.spherical.components[2] += that.dTheta;
        that.spherical.limit(); 
        that.spherical.secure();
        
        
        // Limit radius here

        that.lookAt.add(that.dPan);
        offset.setFromSphericalCoords(that.spherical);
        
        //offset.applyQuaternion(qInverse);

        that.camera.position.copyFrom(that.lookAt).add(offset);
        
        that.camera.setLookAt(that.lookAt);

        that.camera.updateProjectionMatrix();
        that.camera.updateViewMatrix();
        
        that.dPhi = 0.0;
        that.dTheta = 0.0;
        that.dPan.set(0, 0, 0);
    };
}

Lore.OrbitalControls.prototype = Object.assign(Object.create(Lore.ControlsBase.prototype), {
    constructor: Lore.OrbitalControls,
});
