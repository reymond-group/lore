Lore.OrbitalControls = function(renderer, radius) {
    Lore.ControlsBase.call(this, renderer);
    this.up = Lore.Vector3f.up();
    this.radius = radius;
    this.camera = renderer.camera;
    this.x = 0;
    this.y = 0;
    
    this.camera.position = new Lore.Vector3f(0, 0, radius);
    this.camera.updateProjectionMatrix();
    this.camera.updateViewMatrix();
    
    var that = this;
    this.mousedrag = function(e, source) {
	
        if(source == 'left') {
	       // Rotate
            that.x += e.x * 0.01;
            that.y += e.y * 0.01;
            
            if(that.y < -1.57079632679) that.y = -1.57079632679;
            if(that.y >  1.57079632679) that.y =  1.57079632679;
            
            var lookAt = that.camera.lookAt.components;
            that.camera.position.components[0] = lookAt[0] + that.radius * Math.sin(-that.x) * Math.cos(that.y);
            that.camera.position.components[1] = lookAt[1] + that.radius * Math.sin(that.y);
            that.camera.position.components[2] = lookAt[2] + that.radius * Math.cos(-that.x) * Math.cos(that.y);
            
            that.camera.rotation.lookAt(that.camera.position, that.camera.getLookAt(), that.up);
        }
        else if(source == 'right') {
            // Translate

        }
	    
        that.camera.updateProjectionMatrix();
        that.camera.updateViewMatrix();
    };
}

Lore.OrbitalControls.prototype = Object.assign(Object.create(Lore.ControlsBase.prototype), {
    constructor: Lore.OrbitalControls,
});
