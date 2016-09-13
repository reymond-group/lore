Lore.Array3 = function(arr) {
  this.arr = arr;
}

Lore.Array3.prototype = {
  constructor: Lore.Array3,

  multiply: function(index, x, y, z) {
    index *= 3;
    this.arr[index] *= x;
    this.arr[index + 1] *= y;
    this.arr[index + 2] *= z;
  },

  multiplyScalar: function(index, s) {
    index *= 3;
    this.arr[index] *= s;
    this.arr[index + 1] *= s;
    this.arr[index + 2] *= s;
  },

  divide: function(index, x, y, z) {
    index *= 3;
    this.arr[index] /= x;
    this.arr[index + 1] /= y;
    this.arr[index + 2] /= z;
  },

  divideScalar: function(index, s) {
    index *= 3;
    this.arr[index] /= s;
    this.arr[index + 1] /= s;
    this.arr[index + 2] /= s;
  },

  add: function(index, x, y, z) {
    index *= 3;
    this.arr[index] += x;
    this.arr[index + 1] += y;
    this.arr[index + 2] += z;
  },

  subtract: function(index, x, y, z) {
    index *= 3;
    this.arr[index] -= x;
    this.arr[index + 1] -= y;
    this.arr[index + 2] -= z;
  }
}
