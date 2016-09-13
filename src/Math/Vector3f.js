Lore.Vector3f = function(x, y, z) {
  if(arguments.length === 1) {
    this.components = new Float32Array(x);
  }
  else {
    this.components = new Float32Array(3);
    this.components[0] = x || 0.0;
    this.components[1] = y || 0.0;
    this.components[2] = z || 0.0;
  }
}

Lore.Vector3f.prototype = {
  constructor: Lore.Vector3f,

  set: function(x, y, z) {
    this.components[0] = x;
    this.components[1] = y;
    this.components[2] = z;
    return this;
  },

  getX: function() {
    return this.components[0];
  },

  getY: function() {
    return this.components[1];
  },

  getZ: function() {
    return this.components[2];
  },

  setX: function(x) {
    this.components[0] = x;
  },

  setY: function(y) {
    this.components[1] = y;
  },

  setZ: function(z) {
    this.components[2] = z;
  },

  lengthSq: function() {
    return this.components[0] * this.components[0] +
      this.components[1] * this.components[1] +
      this.components[2] * this.components[2];
  },

  length: function() {
    return Math.sqrt(this.lengthSq());
  },

  normalize: function() {
    return this.divideScalar(this.length());
  },

  multiply: function(v) {
    this.components[0] *= v.components[0];
    this.components[1] *= v.components[1];
    this.components[2] *= v.components[2];
    return this;
  },

  multiplyScalar: function(s) {
    this.components[0] *= s;
    this.components[1] *= s;
    this.components[2] *= s;
    return this;
  },

  divide: function(v) {
    this.components[0] /= v.components[0];
    this.components[1] /= v.components[1];
    this.components[2] /= v.components[2];
    return this;
  },

  divideScalar: function(s) {
    this.components[0] /= s;
    this.components[1] /= s;
    this.components[2] /= s;
    return this;
  },

  add: function(v) {
    this.components[0] += v.components[0];
    this.components[1] += v.components[1];
    this.components[2] += v.components[2];
    return this;
  },

  subtract: function(v) {
    this.components[0] -= v.components[0];
    this.components[1] -= v.components[1];
    this.components[2] -= v.components[2];
    return this;
  },

  applyQuaternion: function(q) {
    var x = this.components[0];
    var y = this.components[1];
    var z = this.components[2];

		var qx = q.components[0];
    var qy = q.components[1];
    var qz = q.components[2];
    var qw = q.components[3];

		var ix =  qw * x + qy * z - qz * y;
		var iy =  qw * y + qz * x - qx * z;
		var iz =  qw * z + qx * y - qy * x;
		var iw = -qx * x - qy * y - qz * z;

		this.components[0] = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.components[1] = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.components[2] = iz * qw + iw * - qz + ix * - qy - iy * - qx;

    return this;
  },

  clone: function() {
    return new Lore.Vector3f(this.components[0], this.components[1],
      this.components[2]);
  },

  equals: function(v) {
    return this.components[0] === v.components[0] &&
      this.components[1] === v.components[1] &&
      this.components[2] === v.components[2];
  }
}

Lore.Vector3f.normalize = function(v) {
  return Lore.Vector3f.divideScalar(v, v.length());
}

Lore.Vector3f.multiply = function(u, v) {
  return new Lore.Vector3f(u.components[0] * v.components[0],
    u.components[1] * v.components[1],
    u.components[2] * v.components[2]);
}

Lore.Vector3f.multiplyScalar = function(v, s) {
  return new Lore.Vector3f(v.components[0] * s,
    v.components[1] * s,
    v.components[2] * s);
}

Lore.Vector3f.divide = function(u, v) {
  return new Lore.Vector3f(u.components[0] / v.components[0],
    u.components[1] / v.components[1],
    u.components[2] / v.components[2]);
}

Lore.Vector3f.divideScalar = function(v, s) {
  return new Lore.Vector3f(v.components[0] / s,
    v.components[1] / s,
    v.components[2] / s);
}

Lore.Vector3f.add = function(u, v) {
  return new Lore.Vector3f(u.components[0] + v.components[0],
    u.components[1] + v.components[1],
    u.components[2] + v.components[2]);
}

Lore.Vector3f.subtract = function(u, v) {
  return new Lore.Vector3f(u.components[0] - v.components[0],
    u.components[1] - v.components[1],
    u.components[2] - v.components[2]);
}

Lore.Vector3f.cross = function(u, v) {
  return new Lore.Vector3f(
    u.components[1] * v.components[2] - u.components[2] * v.components[1],
    u.components[2] * v.components[0] - u.components[0] * v.components[2],
    u.components[0] * v.components[1] - u.components[1] * v.components[0]
  );
}

Lore.Vector3f.dot = function(u, v) {
  return u.components[0] * v.components[0] +
         u.components[1] * v.components[1] +
         u.components[2] * v.components[2];
}
