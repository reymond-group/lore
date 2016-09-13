Lore.Vector2f = function(x, y) {
  this.components = new Float32Array(2);
  this.components[0] = x || 0.0;
  this.components[1] = y || 0.0;
}

Lore.Vector2f.prototype = {
  constructor: Lore.Vector2f,

  set: function(x, y) {
    this.components[0] = x;
    this.components[1] = y;

    return this;
  },

  getX: function() {
    return this.components[0];
  },

  getY: function() {
    return this.components[1];
  },

  setX: function(x) {
    this.components[0] = x;
  },

  setY: function(y) {
    this.components[1] = y;
  },

  lengthSq: function() {
    return this.components[0] * this.components[0] +
      this.components[1] * this.components[1];
  },

  length: function() {
    return Math.sqrt(this.lengthSq());
  },

  multiply: function(v) {
    this.components[0] *= v.components[0];
    this.components[1] *= v.components[1];
    return this;
  },

  multiplyScalar: function(s) {
    this.components[0] *= s;
    this.components[1] *= s;
    return this;
  },

  divide: function(v) {
    this.components[0] /= v.components[0];
    this.components[1] /= v.components[1];
    return this;
  },

  divideScalar: function(s) {
    this.components[0] /= s;
    this.components[1] /= s;
    return this;
  },

  add: function(v) {
    this.components[0] += v.components[0];
    this.components[1] += v.components[1];
    return this;
  },

  subtract: function(v) {
    this.components[0] -= v.components[0];
    this.components[1] -= v.components[1];
    return this;
  },

  clone: function() {
    return new Lore.Vector2f(this.components[0], this.components[1]);
  },

  equals: function(v) {
    return this.components[0] === v.components[0] &&
      this.components[1] === v.components[1];
  }
}

Lore.Vector2f.multiply = function(u, v) {
  return new Lore.Vector2f(u.components[0] * v.components[0],
    u.components[1] * v.components[1]);
}

Lore.Vector2f.multiplyScalar = function(v, s) {
  return new Lore.Vector2f(v.components[0] * s,
    v.components[1] * s);
}

Lore.Vector2f.divide = function(u, v) {
  return new Lore.Vector2f(u.components[0] / v.components[0],
    u.components[1] / v.components[1]);
}

Lore.Vector2f.divideScalar = function(v, s) {
  return new Lore.Vector2f(v.components[0] / s,
    v.components[1] / s);
}

Lore.Vector2f.add = function(u, v) {
  return new Lore.Vector2f(u.components[0] + v.components[0],
    u.components[1] + v.components[1]);
}

Lore.Vector2f.subtract = function(u, v) {
  return new Lore.Vector2f(u.components[0] - v.components[0],
    u.components[1] - v.components[1]);
}
