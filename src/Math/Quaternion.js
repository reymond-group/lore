/** 
 * A class representing a quaternion.
 * 
 * @property {Float32Array} components A typed array storing the components of this quaternion.
 */
Lore.Quaternion = class Quaternion {
    /**
     * Creates an instance of Quaternion.
     * @param {Number} x The x component of the quaternion.
     * @param {Number} y The y component of the quaternion.
     * @param {Number} z The z component of the quaternion.
     * @param {Number} w The w component of the quaternion.
     */
    constructor(x, y, z, w) {
        if (arguments.length === 1) {
            this.components = new Float32Array(x);
        } else if (arguments.length === 2) {
            this.components = new Float32Array(4);
            this.setFromAxisAngle(x, y);
        } else {
            this.components = new Float32Array(4);
            this.components[0] = x || 0.0;
            this.components[1] = y || 0.0;
            this.components[2] = z || 0.0;
            this.components[3] = (w !== undefined) ? w : 1.0;
        }
    }

    /**
     * Get the x component of this quaternion.
     * 
     * @returns {Number} The x component of this quaternion.
     */
    getX() {
        return this.components[0];
    }

    /**
     * Get the y component of this quaternion.
     * 
     * @returns {Number} The y component of this quaternion.
     */
    getY() {
        return this.components[1];
    }

    /**
     * Get the z component of this quaternion.
     * 
     * @returns {Number} The z component of this quaternion.
     */
    getZ() {
        return this.components[2];
    }

    /**
     * Get the w component of this quaternion.
     * 
     * @returns {Number} The w component of this quaternion.
     */
    getW() {
        return this.components[3];
    }

    /**
     * Set the components of this quaternion.
     * 
     * @param {Number} x The x component of this quaternion.
     * @param {Number} y The y component of this quaternion.
     * @param {Number} z The z component of this quaternion.
     * @param {Number} w The w component of this quaternion.
     * 
     * @returns {Lore.Quaternion} Returns itself.
     */
    set(x, y, z, w) {
        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        this.components[3] = w;

        return this;
    }

    /**
     * Set the x component of this quaternion.
     * 
     * @param {Number} x The x component of this quaternion.
     * @returns {Quaternion} Returns itself.
     */
    setX(x) {
        this.components[0] = x;

        return this;
    }

    /**
     * Set the y component of this quaternion.
     * 
     * @param {Number} y The y component of this quaternion.
     * @returns {Lore.Quaternion} Returns itself.
     */
    setY(y) {
        this.components[1] = y;

        return this;
    }

    /**
     * Set the z component of this quaternion.
     * 
     * @param {Number} z The z component of this quaternion.
     * @returns {Lore.Quaternion} Returns itself.
     */
    setZ(z) {
        this.components[2] = z;

        return this;
    }

    /**
     * Set the w component of this quaternion.
     * 
     * @param {Number} w The w component of this quaternion.
     * @returns {Lore.Quaternion} Returns itself.
     */
    setW(w) {
        this.components[3] = w;

        return this;
    }

    /**
     * Sets the quaternion from the axis angle representation.
     * 
     * @param {Lore.Vector3f} axis The axis component.
     * @param {Number} angle The angle component.
     * @returns {Lore.Quaternion} Returns itself.
     */
    setFromAxisAngle(axis, angle) {
        // See:
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

        // Normalize the axis. The resulting quaternion will be normalized as well
        let normAxis = Lore.Vector3f.normalize(axis);
        let halfAngle = angle / 2.0;
        let sinHalfAngle = Math.sin(halfAngle);

        this.components[0] = normAxis.components[0] * sinHalfAngle;
        this.components[1] = normAxis.components[1] * sinHalfAngle;
        this.components[2] = normAxis.components[2] * sinHalfAngle;
        this.components[3] = Math.cos(halfAngle);

        return this;
    }

    /**
     * Sets the quaternion from unit vectors.
     * 
     * @param {Lore.Vector3f} from The from vector.
     * @param {Lore.Vector3f} to The to vector.
     * @returns {Lore.Quaternion} Returns itself.
     */
    setFromUnitVectors(from, to) {
        let v = null;
        let r = from.dot(to) + 1;

        if (r < 0.000001) {
            v = new Lore.Vector3f();
            r = 0;
            if (Math.abs(from.components[0]) > Math.abs(from.components[2]))
                v.set(-from.components[1], from.components[0], 0);
            else
                v.set(0, -from.components[2], from.components[1]);
        } else {
            v = Lore.Vector3f.cross(from, to);
        }

        this.set(v.components[0], v.components[1], v.components[2], r);
        this.normalize();

        return this;
    }

    /**
     * Set the quaternion based facing in a destionation direction.
     * 
     * @param {Lore.Vector3f} source The source vector (the position).
     * @param {Lore.Vector3f} dest The destination vector.
     * @param {Lore.Vector3f} up The up vector of the source.
     * @returns {Lore.Quaternion} Returns itself.
     */
    lookAt(source, dest, up) {
        this.setFromMatrix(Lore.Matrix4f.lookAt(source, dest, up));
        
        return this;
    }

    /**
     * Get the square length of the quaternion.
     * 
     * @returns {Number} The square of the length.
     */
    lengthSq() {
        return this.components[0] * this.components[0] +
            this.components[1] * this.components[1] +
            this.components[2] * this.components[2] +
            this.components[3] * this.components[3];
    }

    /**
     * Get the length of this quaternion.
     * 
     * @returns {Number} The length.
     */
    length() {
        return Math.sqrt(this.lengthSq());
    }

    /**
     * Get the inverse of this quaternion.
     * 
     * @returns {Lore.Quaternion} Returns itself.
     */
    inverse() {
        return this.conjugate().normalize();
    }

    /**
     * Normalizes this quaternion.
     * 
     * @returns {Lore.Quaternion} Returns itself.
     */
    normalize() {
        let length = this.length();

        if (length === 0) {
            this.components[0] = 0.0;
            this.components[1] = 0.0;
            this.components[2] = 0.0;
            this.components[3] = 1.0;
        } else {
            let inv = 1 / length;
            this.components[0] *= inv;
            this.components[1] *= inv;
            this.components[2] *= inv;
            this.components[3] *= inv;
        }

        return this;
    }

    /**
     * Get the dot product of this and another quaternion.
     * 
     * @param {Lore.Quaternion} q A quaternion.
     * @returns {Number} The dot product.
     */
    dot(q) {
        return this.components[0] * q.components[0] +
            this.components[1] * q.components[1] +
            this.components[2] * q.components[2] +
            this.components[3] * q.components[3];
    }

    /**
     * Multiply this quaternion with another (a * b).
     * 
     * @param {Lore.Quaternion} b Another quaternion.
     * @returns {Lore.Quaternion} Returns itself.
     */
    multiplyA(b) {
        // See:
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

        let x = this.components[0] * b.components[3] + this.components[3] * b.components[0] + this.components[1] * b.components[2] - this.components[2] * b.components[1];
        let y = this.components[1] * b.components[3] + this.components[3] * b.components[1] + this.components[2] * b.components[0] - this.components[0] * b.components[2];
        let z = this.components[2] * b.components[3] + this.components[3] * b.components[2] + this.components[0] * b.components[1] - this.components[1] * b.components[0];
        let w = this.components[3] * b.components[3] - this.components[0] * b.components[0] - this.components[1] * b.components[1] - this.components[2] * b.components[2];

        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        this.components[3] = w;

        return this;
    }

    /**
     * Multiply another with this quaternion (a * b).
     * 
     * @param {Lore.Quaternion} a Another quaternion.
     * @returns {Lore.Quaternion} Returns itself.
     */
    multiplyB(a) {
        // See:
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

        let x = a.components[0] * this.components[3] + a.components[3] * this.components[0] + a.components[1] * this.components[2] - a.components[2] * this.components[1];
        let y = a.components[1] * this.components[3] + a.components[3] * this.components[1] + a.components[2] * this.components[0] - a.components[0] * this.components[2];
        let z = a.components[2] * this.components[3] + a.components[3] * this.components[2] + a.components[0] * this.components[1] - a.components[1] * this.components[0];
        let w = a.components[3] * this.components[3] - a.components[0] * this.components[0] - a.components[1] * this.components[1] - a.components[2] * this.components[2];

        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        this.components[3] = w;

        return this;
    }

    /**
     * Multiply this quaternion with a scalar.
     * 
     * @param {Number} s A scalar.
     * @returns {Lore.Quaternion} Returns itself.
     */
    multiplyScalar(s) {
        this.components[0] *= s;
        this.components[1] *= s;
        this.components[2] *= s;
        this.components[3] *= s;

        return this;
    }

    /**
     * Conjugate (* -1) this quaternion.
     * 
     * @returns {Lore.Quaternion} Returns itself.
     */
    conjugate() {
        // See:
        // http://www.3dgep.com/understanding-quaternions/#Quaternion_Conjugate
        this.components[0] *= -1;
        this.components[1] *= -1;
        this.components[2] *= -1;

        return this;
    }

    /**
     * Add another quaternion to this one.
     * 
     * @param {Lore.Quaternion} q A quaternion.
     * @returns {Lore.Quaternion} Returns itself.
     */
    add(q) {
        this.components[0] += q.components[0];
        this.components[1] += q.components[1];
        this.components[2] += q.components[2];
        this.components[3] += q.components[3];

        return this;
    }

    /**
     * Subtract another quaternion from this one.
     * 
     * @param {Lore.Quaternion} q A quaternion.
     * @returns {Lore.Quaternion} Returns itself.
     */
    subtract(q) {
        this.components[0] -= q.components[0];
        this.components[1] -= q.components[1];
        this.components[2] -= q.components[2];
        this.components[3] -= q.components[3];

        return this;
    }

    /**
     * Rotate this quaternion around the x axis.
     * 
     * @param {Number} angle An angle in radians.
     * @returns {Lore.Quaternion} Returns itself.
     */
    rotateX(angle) {
        let halfAngle = angle / 2.0;
        return this.multiplyA(
            new Lore.Quaternion(Math.sin(halfAngle), 0.0, 0.0, Math.cos(halfAngle))
        );
    }

    /**
     * Rotate this quaternion around the y axis.
     * 
     * @param {Number} angle An angle in radians.
     * @returns {Lore.Quaternion} Returns itself.
     */
    rotateY(angle) {
        let halfAngle = angle / 2.0;
        return this.multiplyA(
            new Lore.Quaternion(0.0, Math.sin(halfAngle), 0.0, Math.cos(halfAngle))
        );
    }

    /**
     * Rotate this quaternion around the y axis.
     * 
     * @param {Number} angle An angle in radians.
     * @returns {Lore.Quaternion} Returns itself.
     */
    rotateZ(angle) {
        let halfAngle = angle / 2.0;
        return this.multiplyA(
            new Lore.Quaternion(0.0, 0.0, Math.sin(halfAngle), Math.cos(halfAngle))
        );
    }

    toAxisAngle() {
        // It seems like this isn't numerically stable. This could be solved
        // by some checks as described here:
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
        // or here:
        // https://www.flipcode.com/documents/matrfaq.html#Q57
        // However, this function currently isn't used.
        console.warn('The method toAxisAngle() has not been implemented.')
    }

    /**
     * Create a rotation matrix from this quaternion.
     * 
     * @returns {Lore.Matrix4f} A rotation matrix representation of this quaternion.
     */
    toRotationMatrix() {
        let i = this.components[0];
        let j = this.components[1];
        let k = this.components[2];
        let r = this.components[3];

        let ii = i * i;
        let ij = i * j;
        let ik = i * k;
        let ir = i * r;

        let jr = j * r;
        let jj = j * j;
        let jk = j * k;

        let kk = k * k;
        let kr = k * r;

        let mat = new Lore.Matrix4f();

        mat.entries[0] = 1 - 2 * (jj + kk);
        mat.entries[1] = 2 * (ij + kr);
        mat.entries[2] = 2 * (ik - jr);
        mat.entries[4] = 2 * (jk - kr);
        mat.entries[5] = 1 - 2 * (ii + kk);
        mat.entries[6] = 2 * (jk + ir);
        mat.entries[8] = 2 * (ik + jr);
        mat.entries[9] = 2 * (jk - ir);
        mat.entries[10] = 1 - 2 * (ii + jj);

        return mat;
    }

    /**
     * Set this quaternion from a (rotation) matrix.
     * 
     * @param {Lore.Matrix4f} m 
     * @returns {Lore.Quaternion} Returns itself.
     */
    setFromMatrix(m) {
        // As in three.js, this is an implementation straight from:
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // Get the rotation matrix (if m is a Matrix4f)
        let m00 = m.entries[0],
            m01 = m.entries[4],
            m02 = m.entries[8];
        let m10 = m.entries[1],
            m11 = m.entries[5],
            m12 = m.entries[9];
        let m20 = m.entries[2],
            m21 = m.entries[6],
            m22 = m.entries[10];

        let t = m00 + m11 + m22;

        if (t > 0) {
            let s = 0.5 / Math.sqrt(t + 1.0);
            this.components[0] = (m21 - m12) * s;
            this.components[1] = (m02 - m20) * s;
            this.components[2] = (m10 - m01) * s;
            this.components[3] = 0.25 / s;
        } else if (m00 > m11 && m00 > m22) {
            let s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
            this.components[0] = 0.25 * s;
            this.components[1] = (m01 + m10) / s;
            this.components[2] = (m02 + m20) / s;
            this.components[3] = (m21 - m12) / s;
        } else if (m11 > m22) {
            let s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
            this.components[0] = (m01 + m10) / s;
            this.components[1] = 0.25 * s;
            this.components[2] = (m12 + m21) / s;
            this.components[3] = (m02 - m20) / s;
        } else {
            let s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
            this.components[0] = (m02 + m20) / s;
            this.components[1] = (m12 + m21) / s;
            this.components[2] = 0.25 * s;
            this.components[3] = (m10 - m01) / s;
        }

        return this;
    }

    /**
     * Clone this quaternion.
     * 
     * @returns {Lore.Quaternion} A clone of this quaternion.
     */
    clone() {
        return new Lore.Quaternion(this.components[0], this.components[1],
            this.components[2], this.components[3]);
    }

    /**
     * Checks whether the entries of this quaternion match another one.
     * 
     * @param {Lore.Quaternion} q A quaternion.
     * @returns {Boolean} A boolean representing whether the entries of the two quaternions match.
     */
    equals(q) {
        return this.components[0] === q.components[0] &&
            this.components[1] === q.components[1] &&
            this.components[2] === q.components[2] &&
            this.components[3] === q.components[3];
    }

    /**
     * Returns a string representation of this quaternion.
     * 
     * @returns {String} A string representing this quaternion.
     */
    toString() {
        return 'x: ' + this.getX() + ', y: ' + this.getY() + ', z: ' +
            this.getZ() + ', w: ' + this.getW();
    }

    /**
     * Calculate the dot product of two quaternions.
     * 
     * @static
     * @param {Lore.Quaternion} q A quaternion.
     * @param {Lore.Quaternion} p A quaternion.
     * @returns {Number} The dot product.
     */
    static dot(q, p) {
        return new Lore.Quaternion(q.components[0] * p.components[0] +
            q.components[1] * p.components[1] +
            q.components[2] * p.components[2] +
            q.components[3] * p.components[3]);
    }

    /**
     * Multiply (cross product) two quaternions.
     * 
     * @static
     * @param {Lore.Quaternion} a A quaternion.
     * @param {Lore.Quaternion} b A quaternion.
     * @returns {Lore.Quaternion} The cross product quaternion.
     */
    static multiply(a, b) {
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

    /**
     * Multiplies a quaternion with a scalar.
     * 
     * @static
     * @param {Lore.Quaternion} q A quaternion.
     * @param {Number} s A scalar.
     * @returns {Lore.Quaternion} The resulting quaternion.
     */
    static multiplyScalar(q, s) {
        return new Lore.Quaternion(q.components[0] * s, q.components[1] * s,
            q.components[2] * s, q.components[3] * s);
    }

    /**
     * Inverse a quaternion.
     * 
     * @static
     * @param {Lore.Quaternion} q A quaternion.
     * @returns {Lore.Quaternion} The resulting quaternion.
     */
    static inverse(q) {
        let p = new Lore.Quaternion(q.components);
        return p.conjugate().normalize();
    }

    /**
     * Normalize a quaternion.
     * 
     * @static
     * @param {Lore.Quaternion} q A quaternion.
     * @returns {Lore.Quaternion} The resulting quaternion.
     */
    static normalize(q) {
        let length = q.length();

        if (length === 0) {
            return new Lore.Quaternion(0.0, 0.0, 0.0, 1.0);
        } else {
            let inv = 1 / length;
            return new Lore.Quaternion(q.components[0] * inv, q.components[1] * inv,
                q.components[2] * inv, q.components[3] * inv);
        }
    }

    /**
     * Conjugate (* -1) a quaternion.
     * 
     * @static
     * @param {Lore.Quaternion} q A quaternion.
     * @returns {Lore.Quaternion} The resulting quaternion.
     */
    static conjugate(q) {
        return new Lore.Quaternion(q.components[0] * -1, q.components[1] * -1,
            q.components[2] * -1, q.components[3]);
    }

    /**
     * Sum two quaternions.
     * 
     * @static
     * @param {Lore.Quaternion} q A quaternion.
     * @param {Lore.Quaternion} p A quaternion.
     * @returns {Lore.Quaternion} The resulting quaternion.
     */
    static add(q, p) {
        return new Lore.Quaternion(q.components[0] + p.components[0],
            q.components[1] + p.components[1],
            q.components[2] + p.components[2],
            q.components[3] + p.components[3]);
    }

    /**
     * Subtract a quaternion from another (q - p).
     * 
     * @static
     * @param {Lore.Quaternion} q A quaternion.
     * @param {Lore.Quaternion} p A quaternion.
     * @returns {Lore.Quaternion} The resulting quaternion.
     */
    static subtract(q, p) {
        return new Lore.Quaternion(q.components[0] - p.components[0],
            q.components[1] - p.components[1],
            q.components[2] - p.components[2],
            q.components[3] - p.components[3]);
    }

    /**
     * Create a quaternion from a matrix.
     * 
     * @static
     * @param {Lore.Matrix4f} m A matrix.
     * @returns {Lore.Quaternion} The resulting quaternion.
     */
    static fromMatrix(m) {
        let q = new Lore.Quaternion();
        q.setFromMatrix(m);
        return q;
    }

    /**
     * Interpolate between two quaternions (t is between 0 and 1).
     * 
     * @static
     * @param {Lore.Quaternion} q The source quaternion.
     * @param {Lore.Quaternion} p The target quaternion.
     * @param {Number} t The interpolation value / percentage (between 0 an 1).
     * @returns {Lore.Quaternion} The resulting quaternion.
     */
    static slerp(q, p, t) {
        // See:
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

        if (t === 0) return new Lore.Quaternion(q.components);
        if (t === 1) return new Lore.Quaternion(p.components);

        let tmp = new Lore.Quaternion(p.components);

        // The angle between quaternions
        let cosHalfTheta = q.components[0] * tmp.components[0] +
            q.components[1] * tmp.components[1] +
            q.components[2] * tmp.components[2] +
            q.components[3] * tmp.components[3];

        if (cosHalfTheta < 0) {
            tmp.multiplyScalar(-1);
            cosHalfTheta = -cosHalfTheta;
        }

        if (Math.abs(cosHalfTheta) >= 1.0) {
            return new Lore.Quaternion(q.components);
        }

        let halfTheta = Math.acos(cosHalfTheta);
        let sinHalfTheta = sqrt(1.0 - cosHalfTheta * cosHalfTheta);

        if (Math.abs(sinHalfTheta) < 0.001) {
            return new Lore.Quaternion(q.components[0] * 0.5 + tmp.components[0] * 0.5,
                q.components[1] * 0.5 + tmp.components[1] * 0.5,
                q.components[2] * 0.5 + tmp.components[2] * 0.5,
                q.components[3] * 0.5 + tmp.components[3] * 0.5);
        }

        let ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        let ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        return new Lore.Quaternion(q.components[0] * ratioA + tmp.components[0] * ratioB,
            q.components[1] * ratioA + tmp.components[1] * ratioB,
            q.components[2] * ratioA + tmp.components[2] * ratioB,
            q.components[3] * ratioA + tmp.components[3] * ratioB);
    }
}