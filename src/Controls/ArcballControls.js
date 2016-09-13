Lore.ArcballControls = function(renderer, radius, lookAtTarget) {
  Lore.ControlsBase.call(this, renderer);
  this.radius = radius;
  this.lookAtTarget = lookAtTarget;

  var camera = renderer.camera;
  camera.position = new Lore.Vector3f(0, 0, radius);
  camera.lookAt(this.lookAtTarget);

  camera.updateProjectionMatrix();
  camera.updateViewMatrix();

  var that = this;
  this.mousedrag = function(e, source) {
    if(that.mouse.position.y < -1.57079632679) that.mouse.position.y = -1.57079632679;
  	if(that.mouse.position.y > 1.57079632679) that.mouse.position.y = 1.57079632679;

    camera.position.components[0] = that.lookAtTarget.components[0] + that.radius * Math.sin(-that.mouse.position.x) * Math.cos(that.mouse.position.y);
  	camera.position.components[1] = that.lookAtTarget.components[1] + that.radius * Math.sin(that.mouse.position.y);
    camera.position.components[2] = that.lookAtTarget.components[2] + that.radius * Math.cos(-that.mouse.position.x) * Math.cos(that.mouse.position.y);
    console.log(camera.position.components[0], camera.position.components[1], camera.position.components[2]);
    console.log(camera.position.length());
    camera.lookAt(that.lookAtTarget);
    camera.updateProjectionMatrix();
    camera.updateViewMatrix();
  };
}

Lore.ArcballControls.prototype = Object.assign(Object.create(Lore.ControlsBase.prototype), {
  constructor: Lore.ArcballControls,
});
