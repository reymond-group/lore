Lore.Quaternion = function(x, y, z, w) {
  if(arguments.length === 1) {
    this.components = new Float32Array(x);
  }
  else if(arguments.length === 2) {
    this.components = new Float32Array(4);
    this.setFromAxisAngle(x, y);
  }
  else {
    this.components = new Float32Array(4);
    this.components[0] = x || 0.0;
    this.components[1] = y || 0.0;
    this.components[2] = z || 0.0;
    this.components[3] = (w !== undefined) ? w : 1.0;
  }
}

Lore.Quaternion.prototype = {
  constructor: Lore.Quaternion,

  getX: function() {
    return this.components[0];
  },

  getY: function() {
    return this.components[1];
  },

  getZ: function() {
    return this.components[2];
  },

  getW: function() {
    return this.components[3];
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

  setW: function(w) {
    this.components[3] = w;
  },

  setFromAxisAngle: function(axis, angle) {
    // See:
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

    // Normalize the axis. The resulting quaternion will be normalized as well
    var normAxis = Lore.Vector3f.normalize(axis);
    var halfAngle = angle / 2.0;
    var sinHalfAngle = Math.sin(halfAngle);

    this.components[0] = normAxis.components[0] * sinHalfAngle;
    this.components[1] = normAxis.components[1] * sinHalfAngle;
    this.components[2] = normAxis.components[2] * sinHalfAngle;
    this.components[3] = Math.cos(halfAngle);
  },

  lengthSq: function() {
    return this.components[0] * this.components[0] +
      this.components[1] * this.components[1] +
      this.components[2] * this.components[2] +
      this.components[3] * this.components[3];
  },

  length: function() {
    return Math.sqrt(this.lengthSq());
  },

  inverse: function() {
    return this.conjugate().normalize();
  },

  normalize: function() {
    var length = this.length();

    if(length === 0) {
      this.components[0] = 0.0;
      this.components[1] = 0.0;
      this.components[2] = 0.0;
      this.components[3] = 1.0;
    }
    else {
      var inv = 1 / length;
      this.components[0] *= inv;
      this.components[1] *= inv;
      this.components[2] *= inv;
      this.components[3] *= inv;
    }

    return this;
  },

  dot: function(q) {
    return this.components[0] * q.components[0] +
      this.components[1] * q.components[1] +
      this.components[2] * q.components[2] +
      this.components[3] * q.components[3];
  },

  multiplyA: function(b) {
    // See:
    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

    var x = this.components[0] * b.components[3] + this.components[3] * b.components[0] + this.components[1] * b.components[2] - this.components[2] * b.components[1];
    var y = this.components[1] * b.components[3] + this.components[3] * b.components[1] + this.components[2] * b.components[0] - this.components[0] * b.components[2];
    var z = this.components[2] * b.components[3] + this.components[3] * b.components[2] + this.components[0] * b.components[1] - this.components[1] * b.components[0];
    var w = this.components[3] * b.components[3] - this.components[0] * b.components[0] - this.components[1] * b.components[1] - this.components[2] * b.components[2];

    this.components[0] = x;
    this.components[1] = y;
    this.components[2] = z;
    this.components[3] = w;

    return this;
  },

  multiplyB: function(a) {
    // See:
    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

    var x = a.components[0] * this.components[3] + a.components[3] * this.components[0] + a.components[1] * this.components[2] - a.components[2] * this.components[1];
    var y = a.components[1] * this.components[3] + a.components[3] * this.components[1] + a.components[2] * this.components[0] - a.components[0] * this.components[2];
    var z = a.components[2] * this.components[3] + a.components[3] * this.components[2] + a.components[0] * this.components[1] - a.components[1] * this.components[0];
    var w = a.components[3] * this.components[3] - a.components[0] * this.components[0] - a.components[1] * this.components[1] - a.components[2] * this.components[2];

    this.components[0] = x;
    this.components[1] = y;
    this.components[2] = z;
    this.components[3] = w;

    return this;
  },

  multiplyScalar: function(s) {
    this.components[0] *= s;
    this.components[1] *= s;
    this.components[2] *= s;
    this.components[3] *= s;

    return this;
  },

  conjugate: function() {
    // See:
    // http://www.3dgep.com/understanding-quaternions/#Quaternion_Conjugate
    this.components[0] *= -1;
    this.components[1] *= -1;
    this.components[2] *= -1;

    return this;
  },

  add: function(q) {
    this.components[0] += q.components[0];
    this.components[1] += q.components[1];
    this.components[2] += q.components[2];
    this.components[3] += q.components[3];

    return this;
  },

  subtract: function(q) {
    this.components[0] -= q.components[0];
    this.components[1] -= q.components[1];
    this.components[2] -= q.components[2];
    this.components[3] -= q.components[3];

    return this;
  },

  rotateX: function(angle) {
    var halfAngle = angle / 2.0;
    return this.multiplyA(
      new Lore.Quaternion(Math.sin(halfAngle), 0.0, 0.0, Math.cos(halfAngle))
    );
  },

  rotateY: function(angle) {
    var halfAngle = angle / 2.0;
    return this.multiplyA(
      new Lore.Quaternion(0.0, Math.sin(halfAngle), 0.0, Math.cos(halfAngle))
    );
  },

  rotateZ: function(angle) {
    var halfAngle = angle / 2.0;
    return this.multiplyA(
      new Lore.Quaternion(0.0, 0.0, Math.sin(halfAngle), Math.cos(halfAngle))
    );
  },

  toAxisAngle: function() {
    // It seems like this isn't numerically stable. This could be solved
    // by some checks as described here:
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
    // or here:
    // https://www.flipcode.com/documents/matrfaq.html#Q57
    // However, this function currently isn't used.
    console.warn('The method toAxisAngle() has not been implemented.')
  },

  toRotationMatrix: function() {
    var x = this.components[0];
    var y = this.components[1];
    var z = this.components[2];
    var w = this.components[3];

    var xx = x * x;
    var xy = x * y;
    var xz = x * z;
    var xw = x * w;

    var yw = y * w;
    var yy = y * y;
    var yz = y * z;

    var zz = z * z;
    var zw = z * w;

    var mat = new Lore.Matrix4f();

    // Row-major
    //  0,  1,  2,  3,
    //  4,  5,  6,  7,
    //  8,  9, 10, 11,
    // 12, 13, 14, 15

    mat.entries[0]  = 1 - 2 * (yy + zz);
    mat.entries[1]  =     2 * (xy - zw);
    mat.entries[2]  =     2 * (xz + yw);

    mat.entries[4]  =     2 * (xy + zw);
    mat.entries[5]  = 1 - 2 * (xx + zz);
    mat.entries[6]  =     2 * (yz - xw);

    mat.entries[8]  =     2 * (xz - yw);
    mat.entries[9]  =     2 * (yz + xw);
    mat.entries[10] = 1 - 2 * (xx + yy);

    mat.entries[3]  = mat.entries[7] = mat.entries[11] = mat.entries[12] = mat.entries[13] = mat.entries[14] = 0;
    mat.entries[15] = 1;

    return mat;
  },

  setFromMatrix: function(m) {
    // As in three.js, this is an implementation straight from:
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

    // Get the rotation matrix (if m is a Matrix4f)
    var m00 = m.entries[0], m01 = m.entries[4], m02 = m.entries[8];
		var m10 = m.entries[1], m11 = m.entries[5], m12 = m.entries[9];
		var m20 = m.entries[2], m21 = m.entries[6], m22 = m.entries[10];

		var t = m00 + m11 + m22;
		var s = null;

    if (t > 0) {
			s = 0.5 / Math.sqrt(t + 1.0);

			this.components[0] = (m21 - m12) * s;
			this.components[1] = (m02 - m20) * s;
			this.components[2] = (m10 - m01) * s;
      this.components[3] = 0.25 / s;
		}
    else if (m00 > m11 && m00 > m22) {
			s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

			this.components[0] = 0.25 * s;
			this.components[1] = (m01 + m10) / s;
			this.components[2] = (m02 + m20) / s;
      this.components[3] = (m21 - m12) / s;
		}
    else if (m11 > m22) {
			s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

			this.components[0] = (m01 + m10) / s;
			this.components[1] = 0.25 * s;
			this.components[2] = (m12 + m21) / s;
      this.components[3] = (m02 - m20) / s;
		} else {
			s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

			this.components[0] = (m02 + m20) / s;
			this.components[1] = (m12 + m21) / s;
			this.components[2] = 0.25 * s;
      this.components[3] = (m10 - m01) / s;
		}

    return this;
  },

  clone: function() {
    return new Lore.Quaternion(this.components[0], this.components[1],
      this.components[2], this.components[3]);
  },

  equals: function(q) {
    return this.components[0] === q.components[0] &&
      this.components[1] === q.components[1] &&
      this.components[2] === q.components[2] &&
      this.components[3] === q.components[3];
  },

  toString: function() {
    return 'x: ' + this.getX() + ', y: ' + this.getY() + ', z: ' +
      this.getZ() + ', w: ' + this.getW();
  }
}

Lore.Quaternion.dot = function(q, p) {
  return new Lore.Quaternion(q.components[0] * p.components[0] +
    q.components[1] * p.components[1] +
    q.components[2] * p.components[2] +
    q.components[3] * p.components[3]);
}

Lore.Quaternion.multiply = function(a, b) {
  return new Lore.Quaternion(
    a.components[0] * b.components[3] + a.components[3] * b.components[0] +
    a.components[1] * b.components[2] - a.components[2] * b.components[1],
    a.components[1] * b.components[3] + a.components[3] * b.components[1] +
    a.components[2] * b.components[0] - a.components[0] * b.components[2],
    a.components[2] * b.components[3] + a.components[3] * b.components[2] +
    a.components[0] * b.components[1] - a.components[1] * b.components[0],
    a.components[3] * b.components[3] + a.components[0] * b.components[0] +
    a.components[1] * b.components[1] - a.components[2] * b.components[2]
  );
}

Lore.Quaternion.multiplyScalar = function(q, s) {
  return new Lore.Quaternion(q.components[0] * s, q.components[1] * s,
    q.components[2] * s, q.components[3] * s);
}

Lore.Quaternion.inverse = function(q) {
  var p = new Lore.Quaternion(q.components);
  return p.conjugate().normalize();
}

Lore.Quaternion.normalize = function(q) {
  var length = q.length();

  if(length === 0) {
    return new Lore.Quaternion(0.0, 0.0, 0.0, 1.0);
  }
  else {
    var inv = 1 / length;
    return new Lore.Quaternion(q.components[0] * inv, q.components[1] * inv,
      q.components[2] * inv, q.components[3] * inv);
  }
}

Lore.Quaternion.conjugate = function(q) {
  return new Lore.Quaternion(q.components[0] * -1, q.components[1] * -1,
    q.components[2] * -1, q.components[3]);
}

Lore.Quaternion.add = function(q, p) {
  return new Lore.Quaternion(q.components[0] + p.components[0],
    q.components[1] + p.components[1],
    q.components[2] + p.components[2],
    q.components[3] + p.components[3]);
}

Lore.Quaternion.subtract = function(q, p) {
  return new Lore.Quaternion(q.components[0] - p.components[0],
    q.components[1] - p.components[1],
    q.components[2] - p.components[2],
    q.components[3] - p.components[3]);
}

Lore.Quaternion.fromMatrix = function(m) {
  var q = new Lore.Quaternion();
  q.setFromMatrix(m);
  return q;
}

Lore.Quaternion.slerp = function(q, p, t) {
  // See:
  // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

  if(t === 0) return new Lore.Quaternion(q.components);
  if(t === 1) return new Lore.Quaternion(p.components);

  var tmp = new Lore.Quaternion(p.components);

  // The angle between quaternions
  var cosHalfTheta = q.components[0] * tmp.components[0] +
    q.components[1] * tmp.components[1] +
    q.components[2] * tmp.components[2] +
    q.components[3] * tmp.components[3];

  if(cosHalfTheta < 0) {
    tmp.multiplyScalar(-1);
    cosHalfTheta = -cosHalfTheta;
  }

  if(Math.abs(cosHalfTheta) >= 1.0) {
    return new Lore.Quaternion(q.components);
  }

  var halfTheta = Math.acos(cosHalfTheta);
  var sinHalfTheta = sqrt(1.0 - cosHalfTheta * cosHalfTheta);

  if(Math.abs(sinHalfTheta) < 0.001) {
    return new Lore.Quaternion(q.components[0] * 0.5 + tmp.components[0] * 0.5,
      q.components[1] * 0.5 + tmp.components[1] * 0.5,
      q.components[2] * 0.5 + tmp.components[2] * 0.5,
      q.components[3] * 0.5 + tmp.components[3] * 0.5);
  }

  var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
  var ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

  return new Lore.Quaternion(q.components[0] * ratioA + tmp.components[0] * ratioB,
    q.components[1] * ratioA + tmp.components[1] * ratioB,
    q.components[2] * ratioA + tmp.components[2] * ratioB,
    q.components[3] * ratioA + tmp.components[3] * ratioB);
}
