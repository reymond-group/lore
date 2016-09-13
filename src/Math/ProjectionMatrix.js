Lore.ProjectionMatrix = function() {
  Lore.Matrix4f.call(this);

}

Lore.ProjectionMatrix.prototype = Object.assign(Object.create(Lore.Matrix4f.prototype), {
  constructor: Lore.ProjectionMatrix,

  setOrthographic: function(left, right, top, bottom, near, far) {
		var w = 1.0 / (right - left);
		var h = 1.0 / (top - bottom);
		var d = 1.0 / (far - near);

		var x = (right + left) * w;
		var y = (top + bottom) * h;
		var z = (far + near) * d;

    this.set()

		this.entries[0] = 2 * w;	this.entries[4] = 0;	    this.entries[8] = 0;	      this.entries[12] = -x;
		this.entries[1] = 0;	    this.entries[5] = 2 * h;	this.entries[9] = 0;	      this.entries[13] = -y;
		this.entries[2] = 0;	    this.entries[6] = 0;	    this.entries[10] = -2 * d;	this.entries[14] = -z;
		this.entries[3] = 0;	    this.entries[7] = 0;	    this.entries[11] = 0;	      this.entries[15] = 1;

		return this;
  }
});
