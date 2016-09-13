Lore.Array2 = function(arr) {
  this.arr = arr;
}

Lore.Array2.prototype = {
  constructor: Lore.Array2,

  multiply: function(index, x, y) {
    index <<= 1;
    this.arr[index] *= x;
    this.arr[index + 1] *= y;
  },

  multiplyScalar: function(index, s) {
    index <<= 1;
    this.arr[index] *= s;
    this.arr[index + 1] *= s;
  },

  divide: function(index, x, y) {
    index <<= 1;
    this.arr[index] /= x;
    this.arr[index + 1] /= y;
  },

  divideScalar: function(index, s) {
    index <<= 1;
    this.arr[index] /= s;
    this.arr[index + 1] /= s;
  },

  add: function(index, x, y) {
    index <<= 1;
    this.arr[index] += x;
    this.arr[index + 1] += y;
  },

  subtract: function(index, x, y) {
    index <<= 1;
    this.arr[index] -= x;
    this.arr[index + 1] -= y;
  }
}
