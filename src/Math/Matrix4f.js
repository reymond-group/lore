//@ts-check

const Vector3f = require('./Vector3f');
const Quaternion = require('./Quaternion');

/** A class representing a 4x4 float matrix */
class Matrix4f {
  // Do NOT go double precision on GPUs!!!
  // See:
  // http://stackoverflow.com/questions/2079906/float-vs-double-on-graphics-hardware

  /**
   * Creates an instance of Matrix4f.
   * @param {Float32Array} [entries=new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])] 
   */
  constructor(entries = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])) {
    this.entries = entries;
  }

  /**
   * 
   * 
   * @param {Number} m00 A matrix entry.
   * @param {Number} m10 A matrix entry.
   * @param {Number} m20 A matrix entry.
   * @param {Number} m30 A matrix entry.
   * @param {Number} m01 A matrix entry.
   * @param {Number} m11 A matrix entry.
   * @param {Number} m21 A matrix entry.
   * @param {Number} m31 A matrix entry.
   * @param {Number} m02 A matrix entry.
   * @param {Number} m12 A matrix entry.
   * @param {Number} m22 A matrix entry.
   * @param {Number} m32 A matrix entry.
   * @param {Number} m03 A matrix entry.
   * @param {Number} m13 A matrix entry.
   * @param {Number} m23 A matrix entry.
   * @param {Number} m33 A matrix entry.
   * @returns {Matrix4f} Returns itself.
   */
  set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33) {
    this.entries.set([m00, m10, m20, m30,
      m01, m11, m21, m31,
      m02, m12, m22, m32,
      m03, m13, m23, m33
    ]);

    return this;
  }

  /**
   * Sets all entries in the matrix to zero.
   * 
   * @returns {Matrix4f} Returns itself.
   */
  setZero() {
    return this;
  }

  /**
   * Multiplies this matrix with another matrix (a * b).
   * 
   * @param {any} b Another matrix.
   * @returns {Matrix4f} Returns itself.
   */
  multiplyA(b) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html

    let a00 = this.entries[0],
      a01 = this.entries[4],
      a02 = this.entries[8],
      a03 = this.entries[12];
    let a10 = this.entries[1],
      a11 = this.entries[5],
      a12 = this.entries[9],
      a13 = this.entries[13];
    let a20 = this.entries[2],
      a21 = this.entries[6],
      a22 = this.entries[10],
      a23 = this.entries[14];
    let a30 = this.entries[3],
      a31 = this.entries[7],
      a32 = this.entries[11],
      a33 = this.entries[15];

    let b00 = b.entries[0],
      b01 = b.entries[4],
      b02 = b.entries[8],
      b03 = b.entries[12];
    let b10 = b.entries[1],
      b11 = b.entries[5],
      b12 = b.entries[9],
      b13 = b.entries[13];
    let b20 = b.entries[2],
      b21 = b.entries[6],
      b22 = b.entries[10],
      b23 = b.entries[14];
    let b30 = b.entries[3],
      b31 = b.entries[7],
      b32 = b.entries[11],
      b33 = b.entries[15];

    this.entries[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    this.entries[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    this.entries[2] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
    this.entries[3] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    this.entries[4] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    this.entries[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    this.entries[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    this.entries[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
    this.entries[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    this.entries[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    this.entries[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    this.entries[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
    this.entries[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    this.entries[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    this.entries[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    this.entries[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  /**
   * Multiplies another matrix with this matrix (a * b).
   * 
   * @param {any} a Another matrix.
   * @returns {Matrix4f} Returns itself.
   */
  multiplyB(a) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html

    let a00 = a.entries[0],
      a01 = a.entries[4],
      a02 = a.entries[8],
      a03 = a.entries[12];
    let a10 = a.entries[1],
      a11 = a.entries[5],
      a12 = a.entries[9],
      a13 = a.entries[13];
    let a20 = a.entries[2],
      a21 = a.entries[6],
      a22 = a.entries[10],
      a23 = a.entries[14];
    let a30 = a.entries[3],
      a31 = a.entries[7],
      a32 = a.entries[11],
      a33 = a.entries[15];

    let b00 = this.entries[0],
      b01 = this.entries[4],
      b02 = this.entries[8],
      b03 = this.entries[12];
    let b10 = this.entries[1],
      b11 = this.entries[5],
      b12 = this.entries[9],
      b13 = this.entries[13];
    let b20 = this.entries[2],
      b21 = this.entries[6],
      b22 = this.entries[10],
      b23 = this.entries[14];
    let b30 = this.entries[3],
      b31 = this.entries[7],
      b32 = this.entries[11],
      b33 = this.entries[15];

    this.entries[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    this.entries[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    this.entries[2] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
    this.entries[3] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    this.entries[4] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    this.entries[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    this.entries[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    this.entries[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
    this.entries[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    this.entries[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    this.entries[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    this.entries[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
    this.entries[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    this.entries[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    this.entries[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    this.entries[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  /**
   * Set the scale component of this matrix.
   * 
   * @param {Vector3f} vec The scaling vector.
   * @returns {Matrix4f} Returns itself.
   */
  scale(vec) {
    let x = vec.components[0];
    let y = vec.components[1];
    let z = vec.components[2];

    this.entries[0] *= x;
    this.entries[1] *= x;
    this.entries[2] *= x;
    this.entries[3] *= x;

    this.entries[4] *= y;
    this.entries[5] *= y;
    this.entries[6] *= y;
    this.entries[7] *= y;

    this.entries[8] *= z;
    this.entries[9] *= z;
    this.entries[10] *= z;
    this.entries[11] *= z;

    return this;
  }

  /**
   * Set the position component of this matrix.
   * 
   * @param {any} vec The position vector.
   * @returns {Matrix4f} Returns itself.
   */
  setPosition(vec) {
    this.entries[12] = vec.components[0];
    this.entries[13] = vec.components[1];
    this.entries[14] = vec.components[2];

    return this;
  }

  /**
   * Set the rotation component of this matrix.
   * 
   * @param {Quaternion} q A quaternion representing the rotation.
   * @returns {Matrix4f} Returns itself.
   */
  setRotation(q) {
    let x = q.components[0];
    let y = q.components[1];
    let z = q.components[2];
    let w = q.components[3];

    let x2 = x + x,
      y2 = y + y,
      z2 = z + z;
    let xx = x * x2,
      xy = x * y2,
      xz = x * z2;
    let yy = y * y2,
      yz = y * z2,
      zz = z * z2;
    let wx = w * x2,
      wy = w * y2,
      wz = w * z2;

    this.entries[0] = 1 - (yy + zz);
    this.entries[1] = xy + wz;
    this.entries[2] = xz - wy;
    this.entries[4] = xy - wz;
    this.entries[5] = 1 - (xx + zz);
    this.entries[6] = yz + wx;
    this.entries[8] = xz + wy;
    this.entries[9] = yz - wx;
    this.entries[10] = 1 - (xx + yy);

    this.entries[3] = 0.0;
    this.entries[7] = 0.0;
    this.entries[11] = 0.0;
    this.entries[12] = 0.0;
    this.entries[13] = 0.0;
    this.entries[14] = 0.0;
    this.entries[15] = 1.0;

    return this;
  }

  /**
   * Get the determinant of the matrix.
   * 
   * @returns {Number} The determinant of this matrix.
   */
  determinant() {
    let a = this.entries;
    
    let a00 = a.entries[0],
      a01 = a.entries[4],
      a02 = a.entries[8],
      a03 = a.entries[12];
    let a10 = a.entries[1],
      a11 = a.entries[5],
      a12 = a.entries[9],
      a13 = a.entries[13];
    let a20 = a.entries[2],
      a21 = a.entries[6],
      a22 = a.entries[10],
      a23 = a.entries[14];
    let a30 = a.entries[3],
      a31 = a.entries[7],
      a32 = a.entries[11],
      a33 = a.entries[15];

    return (
      a30 * (
        a03 * a12 * a21 - a02 * a13 * a21 -
        a03 * a11 * a22 + a01 * a13 * a22 +
        a02 * a11 * a23 - a01 * a12 * a23
      ) +
      a31 * (
        a00 * a12 * a23 - a00 * a13 * a22 +
        a03 * a10 * a22 - a02 * a10 * a23 +
        a02 * a13 * a20 - a03 * a12 * a20
      ) +
      a32 * (
        a00 * a13 * a21 - a00 * a11 * a23 -
        a03 * a10 * a21 + a01 * a10 * a23 +
        a03 * a11 * a20 - a01 * a13 * a20
      ) +
      a33 * (-a02 * a11 * a20 - a00 * a12 * a21 +
        a00 * a11 * a22 + a02 * a10 * a21 -
        a01 * a10 * a22 + a01 * a12 * a20
      )
    );
  }

  /**
   * Decomposes the matrix into its positional, rotational and scaling component.
   * 
   * @param {Vector3f} outPosition The positional component will be written to this vector.
   * @param {Quaternion} outQuaternion The rotational component will be written to this quaternion.
   * @param {Vector3f} outScale The scaling component will be written to this vector.
   * @returns {Matrix4f} Returns itself.
   */
  decompose(outPosition, outQuaternion, outScale) {
    let v = new Vector3f(0.0, 0.0, 0.0);
    let m = new Matrix4f();

    // The position is the simple one
    outPosition.set(this.entries[12], this.entries[13], this.entries[14]);

    // Calculate the scale
    let sx = Math.sqrt(this.entries[0] * this.entries[0] +
      this.entries[1] * this.entries[1] +
      this.entries[2] * this.entries[2]);

    let sy = Math.sqrt(this.entries[4] * this.entries[4] +
      this.entries[5] * this.entries[5] +
      this.entries[6] * this.entries[6]);

    let sz = Math.sqrt(this.entries[8] * this.entries[8] +
      this.entries[9] * this.entries[9] +
      this.entries[10] * this.entries[10]);

    let det = this.determinant();

    if (det < 0) {
      sx = -sx;
    }

    // Set the scale
    outScale.set(sx, sy, sz);

    // Get the info for the quaternion, this involves scaling the rotation
    // See:
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/
    let isx = 1.0 / sx;
    let isy = 1.0 / sy;
    let isz = 1.0 / sz;

    m.entries.set(this.entries);

    m.entries[0] *= isx;
    m.entries[1] *= isx;
    m.entries[2] *= isx;

    m.entries[4] *= isy;
    m.entries[5] *= isy;
    m.entries[6] *= isy;

    m.entries[8] *= isz;
    m.entries[9] *= isz;
    m.entries[10] *= isz;

    outQuaternion.setFromMatrix(m);

    return this;
  }

  /**
   * Composes the matrix from the positional, rotational and scaling components.
   * 
   * @param {Vector3f} position The positional component.
   * @param {Quaternion} quaternion The rotational component.
   * @param {Vector3f} scale The scaling component.
   * @returns {Matrix4f} Returns itself.
   */
  compose(position, quaternion, scale) {
    this.setRotation(quaternion);
    this.scale(scale);
    this.setPosition(position);

    return this;
  }

  /**
   * Inverts this matrix.
   * 
   * @returns {Matrix4f} Returns itself.
   */
  invert() {
    // Fugly implementation lifted from MESA (originally in C++)
    let im = new Matrix4f();
    let m = this.entries;

    im.entries[0] = m[5] * m[10] * m[15] -
      m[5] * m[11] * m[14] -
      m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] +
      m[13] * m[6] * m[11] -
      m[13] * m[7] * m[10];

    im.entries[4] = -m[4] * m[10] * m[15] +
      m[4] * m[11] * m[14] +
      m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] -
      m[12] * m[6] * m[11] +
      m[12] * m[7] * m[10];

    im.entries[8] = m[4] * m[9] * m[15] -
      m[4] * m[11] * m[13] -
      m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] +
      m[12] * m[5] * m[11] -
      m[12] * m[7] * m[9];

    im.entries[12] = -m[4] * m[9] * m[14] +
      m[4] * m[10] * m[13] +
      m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] -
      m[12] * m[5] * m[10] +
      m[12] * m[6] * m[9];

    im.entries[1] = -m[1] * m[10] * m[15] +
      m[1] * m[11] * m[14] +
      m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] -
      m[13] * m[2] * m[11] +
      m[13] * m[3] * m[10];

    im.entries[5] = m[0] * m[10] * m[15] -
      m[0] * m[11] * m[14] -
      m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] +
      m[12] * m[2] * m[11] -
      m[12] * m[3] * m[10];

    im.entries[9] = -m[0] * m[9] * m[15] +
      m[0] * m[11] * m[13] +
      m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] -
      m[12] * m[1] * m[11] +
      m[12] * m[3] * m[9];

    im.entries[13] = m[0] * m[9] * m[14] -
      m[0] * m[10] * m[13] -
      m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] +
      m[12] * m[1] * m[10] -
      m[12] * m[2] * m[9];

    im.entries[2] = m[1] * m[6] * m[15] -
      m[1] * m[7] * m[14] -
      m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] +
      m[13] * m[2] * m[7] -
      m[13] * m[3] * m[6];

    im.entries[6] = -m[0] * m[6] * m[15] +
      m[0] * m[7] * m[14] +
      m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] -
      m[12] * m[2] * m[7] +
      m[12] * m[3] * m[6];

    im.entries[10] = m[0] * m[5] * m[15] -
      m[0] * m[7] * m[13] -
      m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] +
      m[12] * m[1] * m[7] -
      m[12] * m[3] * m[5];

    im.entries[14] = -m[0] * m[5] * m[14] +
      m[0] * m[6] * m[13] +
      m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] -
      m[12] * m[1] * m[6] +
      m[12] * m[2] * m[5];

    im.entries[3] = -m[1] * m[6] * m[11] +
      m[1] * m[7] * m[10] +
      m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] -
      m[9] * m[2] * m[7] +
      m[9] * m[3] * m[6];

    im.entries[7] = m[0] * m[6] * m[11] -
      m[0] * m[7] * m[10] -
      m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] +
      m[8] * m[2] * m[7] -
      m[8] * m[3] * m[6];

    im.entries[11] = -m[0] * m[5] * m[11] +
      m[0] * m[7] * m[9] +
      m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] -
      m[8] * m[1] * m[7] +
      m[8] * m[3] * m[5];

    im.entries[15] = m[0] * m[5] * m[10] -
      m[0] * m[6] * m[9] -
      m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] +
      m[8] * m[1] * m[6] -
      m[8] * m[2] * m[5];

    let det = m[0] * im.entries[0] +
      m[1] * im.entries[4] +
      m[2] * im.entries[8] +
      m[3] * im.entries[12];

    if (det == 0) {
      throw 'Determinant is zero.';
    }

    det = 1.0 / det;

    for (let i = 0; i < 16; i++) {
      this.entries[i] = im.entries[i] * det;
    }

    return this;
  }

  /**
   * Clones this matrix.
   * 
   * @returns {Matrix4f} A clone of the matrix.
   */
  clone() {
    return new Matrix4f(new Float32Array(this.entries));
  }

  /**
   * Checks whether or not the entries of the two matrices match.
   * 
   * @param {Matrix4f} a A matrix.
   * @returns {Boolean} A boolean indicating whether or not the entries of the two matrices match.
   */
  equals(a) {
    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i] !== a.entries[i]) return false;
    }

    return true;
  }

  /**
   * Returns a string representation of the matrix.
   * 
   * @returns {String} The string representation of this matrix.
   */
  toString() {
    let str = this.entries[0] + ', ' + this.entries[4] + ', ' + this.entries[8] + ', ' + this.entries[12] + '\n';
    str += this.entries[1] + ', ' + this.entries[5] + ', ' + this.entries[9] + ', ' + this.entries[13] + '\n';
    str += this.entries[2] + ', ' + this.entries[6] + ', ' + this.entries[10] + ', ' + this.entries[14] + '\n';
    str += this.entries[3] + ', ' + this.entries[7] + ', ' + this.entries[11] + ', ' + this.entries[15] + '\n';

    return str;
  }

  /**
   * Multiply the two matrices (a * b).
   * 
   * @static
   * @param {any} a A matrix to be multiplied.
   * @param {any} b A matrix to be multiplied.
   * @returns {Matrix4f} A matrix.
   */
  static multiply(a, b) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html

    let a00 = a.entries[0],
      a01 = a.entries[4],
      a02 = a.entries[8],
      a03 = a.entries[12];
    let a10 = a.entries[1],
      a11 = a.entries[5],
      a12 = a.entries[9],
      a13 = a.entries[13];
    let a20 = a.entries[2],
      a21 = a.entries[6],
      a22 = a.entries[10],
      a23 = a.entries[14];
    let a30 = a.entries[3],
      a31 = a.entries[7],
      a32 = a.entries[11],
      a33 = a.entries[15];

    let b00 = b.entries[0],
      b01 = b.entries[4],
      b02 = b.entries[8],
      b03 = b.entries[12];
    let b10 = b.entries[1],
      b11 = b.entries[5],
      b12 = b.entries[9],
      b13 = b.entries[13];
    let b20 = b.entries[2],
      b21 = b.entries[6],
      b22 = b.entries[10],
      b23 = b.entries[14];
    let b30 = b.entries[3],
      b31 = b.entries[7],
      b32 = b.entries[11],
      b33 = b.entries[15];

    return new Matrix4f(new Float32Array([
      a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
      a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
      a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
      a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
      a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
      a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
      a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
      a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
      a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
      a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
      a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
      a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
      a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
      a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
      a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
      a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33
    ]));
  }

  /**
   * Initialize a matrix from a quaternion.
   * 
   * @static
   * @param {Quaternion} q A quaternion.
   * @returns {Matrix4f} A matrix.
   */
  static fromQuaternion(q) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html
    // https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation#Quaternion-derived_rotation_matrix
    let x = q.components[0],
      y = q.components[1],
      z = q.components[2],
      w = q.components[3];
    let x2 = x + x,
      y2 = y + y,
      z2 = z + z;
    let xx = x * x2,
      xy = x * y2,
      xz = x * z2;
    let yy = y * y2,
      yz = y * z2,
      zz = z * z2;
    let wx = w * x2,
      wy = w * y2,
      wz = w * z2;

    return new Matrix4f(new Float32Array([
      1 - (yy + zz), xy + wz, xz - wy, 0,
      xy - wz, 1 - (xx + zz), yz + wx, 0,
      xz + wy, yz - wx, 1 - (xx + yy), 0,
      0, 0, 0, 1
    ]));
  }

  /**
   * Create a lookat matrix for a camera.
   * 
   * @static
   * @param {Vector3f} cameraPosition The position of the camera.
   * @param {Vector3f} target The lookat (target) of the camera.
   * @param {Vector3f} up The up vector of the camera node.
   * @returns {Matrix4f} A matrix.
   */
  static lookAt(cameraPosition, target, up) {
    // See here in order to return a quaternion directly:
    // http://www.euclideanspace.com/maths/algebra/vectors/lookat/
    let z = Vector3f.subtract(cameraPosition, target).normalize();

    if (z.lengthSq() === 0.0) {
      z.components[2] = 1.0
    }

    let x = Vector3f.cross(up, z).normalize();

    if (x.lengthSq() === 0.0) {
      z.components[2] += 0.0001;
      x = Vector3f.cross(up, z).normalize();
    }

    let y = Vector3f.cross(z, x);

    return new Matrix4f(new Float32Array([
      x.components[0], x.components[1], x.components[2], 0,
      y.components[0], y.components[1], y.components[2], 0,
      z.components[0], z.components[1], z.components[2], 0,
      0, 0, 0, 1
    ]));
  }

  /**
   * Composes a matrix from the positional, rotational and scaling components.
   * 
   * @param {Vector3f} position The positional component.
   * @param {Quaternion} quaternion The rotational component.
   * @param {Vector3f} scale The scaling component.
   * @returns {Matrix4f} A matrix.
   */
  static compose(position, quaternion, scale) {
    let m = new Matrix4f();

    m.setRotation(quaternion);
    m.scale(scale);
    m.setPosition(position);

    return m;
  }

  /**
   * Inverts a matrix.
   * 
   * @static
   * @param {Matrix4f} matrix A matrix to be inverted.
   * @returns The inverted matrix.
   */
  static invert(matrix) {
    // Fugly implementation lifted from MESA (originally in C++)
    let im = new Matrix4f();

    let m = matrix.entries;

    im.entries[0] = m[5] * m[10] * m[15] -
      m[5] * m[11] * m[14] -
      m[9] * m[6] * m[15] +
      m[9] * m[7] * m[14] +
      m[13] * m[6] * m[11] -
      m[13] * m[7] * m[10];

    im.entries[4] = -m[4] * m[10] * m[15] +
      m[4] * m[11] * m[14] +
      m[8] * m[6] * m[15] -
      m[8] * m[7] * m[14] -
      m[12] * m[6] * m[11] +
      m[12] * m[7] * m[10];

    im.entries[8] = m[4] * m[9] * m[15] -
      m[4] * m[11] * m[13] -
      m[8] * m[5] * m[15] +
      m[8] * m[7] * m[13] +
      m[12] * m[5] * m[11] -
      m[12] * m[7] * m[9];

    im.entries[12] = -m[4] * m[9] * m[14] +
      m[4] * m[10] * m[13] +
      m[8] * m[5] * m[14] -
      m[8] * m[6] * m[13] -
      m[12] * m[5] * m[10] +
      m[12] * m[6] * m[9];

    im.entries[1] = -m[1] * m[10] * m[15] +
      m[1] * m[11] * m[14] +
      m[9] * m[2] * m[15] -
      m[9] * m[3] * m[14] -
      m[13] * m[2] * m[11] +
      m[13] * m[3] * m[10];

    im.entries[5] = m[0] * m[10] * m[15] -
      m[0] * m[11] * m[14] -
      m[8] * m[2] * m[15] +
      m[8] * m[3] * m[14] +
      m[12] * m[2] * m[11] -
      m[12] * m[3] * m[10];

    im.entries[9] = -m[0] * m[9] * m[15] +
      m[0] * m[11] * m[13] +
      m[8] * m[1] * m[15] -
      m[8] * m[3] * m[13] -
      m[12] * m[1] * m[11] +
      m[12] * m[3] * m[9];

    im.entries[13] = m[0] * m[9] * m[14] -
      m[0] * m[10] * m[13] -
      m[8] * m[1] * m[14] +
      m[8] * m[2] * m[13] +
      m[12] * m[1] * m[10] -
      m[12] * m[2] * m[9];

    im.entries[2] = m[1] * m[6] * m[15] -
      m[1] * m[7] * m[14] -
      m[5] * m[2] * m[15] +
      m[5] * m[3] * m[14] +
      m[13] * m[2] * m[7] -
      m[13] * m[3] * m[6];

    im.entries[6] = -m[0] * m[6] * m[15] +
      m[0] * m[7] * m[14] +
      m[4] * m[2] * m[15] -
      m[4] * m[3] * m[14] -
      m[12] * m[2] * m[7] +
      m[12] * m[3] * m[6];

    im.entries[10] = m[0] * m[5] * m[15] -
      m[0] * m[7] * m[13] -
      m[4] * m[1] * m[15] +
      m[4] * m[3] * m[13] +
      m[12] * m[1] * m[7] -
      m[12] * m[3] * m[5];

    im.entries[14] = -m[0] * m[5] * m[14] +
      m[0] * m[6] * m[13] +
      m[4] * m[1] * m[14] -
      m[4] * m[2] * m[13] -
      m[12] * m[1] * m[6] +
      m[12] * m[2] * m[5];

    im.entries[3] = -m[1] * m[6] * m[11] +
      m[1] * m[7] * m[10] +
      m[5] * m[2] * m[11] -
      m[5] * m[3] * m[10] -
      m[9] * m[2] * m[7] +
      m[9] * m[3] * m[6];

    im.entries[7] = m[0] * m[6] * m[11] -
      m[0] * m[7] * m[10] -
      m[4] * m[2] * m[11] +
      m[4] * m[3] * m[10] +
      m[8] * m[2] * m[7] -
      m[8] * m[3] * m[6];

    im.entries[11] = -m[0] * m[5] * m[11] +
      m[0] * m[7] * m[9] +
      m[4] * m[1] * m[11] -
      m[4] * m[3] * m[9] -
      m[8] * m[1] * m[7] +
      m[8] * m[3] * m[5];

    im.entries[15] = m[0] * m[5] * m[10] -
      m[0] * m[6] * m[9] -
      m[4] * m[1] * m[10] +
      m[4] * m[2] * m[9] +
      m[8] * m[1] * m[6] -
      m[8] * m[2] * m[5];

    let det = m[0] * im.entries[0] +
      m[1] * im.entries[4] +
      m[2] * im.entries[8] +
      m[3] * im.entries[12];

    if (det == 0) {
      throw 'Determinant is zero.';
    }

    det = 1.0 / det;

    for (let i = 0; i < 16; i++) {
      im.entries[i] = im.entries[i] * det;
    }

    return im;
  }
}

module.exports = Matrix4f