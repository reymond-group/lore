/** A class representing 3D float vector. */
Lore.Vector3f = class Vector3f {
    /**
     * Creates an instance of Vector3f.
     * @param {Number} x The x component of the vector.
     * @param {Number} y The y component of the vector.
     * @param {Number} z The z component of the vector.
     */
    constructor(x, y, z) {
        if (arguments.length === 1) {
            this.components = new Float32Array(x);
        } else {
            this.components = new Float32Array(3);
            this.components[0] = x || 0.0;
            this.components[1] = y || 0.0;
            this.components[2] = z || 0.0;
        }
    }

    /**
     * Sets the x, y and z components of this vector.
     * 
     * @param {Number} x The x component of the vector.
     * @param {Number} y The y component of the vector.
     * @param {Number} z The z component of the vector.
     * @returns {Vector3f} Returns itself.
     */
    set(x, y, z) {
        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;

        return this;
    }

    /**
     * Gets the x component of this vector.
     * 
     * @returns {Number} The x component of this vector.
     */
    getX() {
        return this.components[0];
    }

     /**
     * Gets the y component of this vector.
     * 
     * @returns {Number} The y component of this vector.
     */
    getY() {
        return this.components[1];
    }

     /**
     * Gets the z component of this vector.
     * 
     * @returns {Number} The z component of this vector.
     */
    getZ() {
        return this.components[2];
    }

    /**
     * Sets the x component of this vector.
     * 
     * @param {Number} x The value to which the x component of this vectors will be set.
     * @returns {Vector3f} Returns itself.
     */
    setX(x) {
        this.components[0] = x;

        return this;
    }

    /**
     * Sets the y component of this vector.
     * 
     * @param {Number} y The value to which the y component of this vectors will be set.
     * @returns {Vector3f} Returns itself.
     */
    setY(y) {
        this.components[1] = y;

        return this;
    }

    /**
     * Sets the z component of this vector.
     * 
     * @param {Number} z The value to which the z component of this vectors will be set.
     * @returns {Vector3f} Returns itself.
     */
    setZ(z) {
        this.components[2] = z;

        return this;
    }

    /**
     * Sets this vector from spherical coordinates.
     * 
     * @param {SphericalCoordinates} s A spherical coordinates object.
     * @returns {Vector3f} Returns itself.
     */
    setFromSphericalCoords(s) {
        var radius = s.components[0];
        var phi = s.components[1];
        var theta = s.components[2];

        var t = Math.sin(phi) * radius;

        this.components[0] = Math.sin(theta) * t;
        this.components[1] = Math.cos(phi) * radius;
        this.components[2] = Math.cos(theta) * t;

        return this;
    }

    /**
     * Copies the values from another vector
     * 
     * @param {Vector3f} v A vector.
     * @returns {Vector3f} Returns itself.
     */
    copyFrom(v) {
        this.components[0] = v.components[0];
        this.components[1] = v.components[1];
        this.components[2] = v.components[2];

        return this;
    }

    /**
     * Set the length / magnitude of the vector.
     * 
     * @param {Number} length The length / magnitude to set the vector to.
     * @returns {Vector3f} Returns itself.
     */
    setLength(length) {
        return this.multiplyScalar(length / this.length());
    }

    /**
     * Get the square of the length / magnitude of the vector.
     * 
     * @returns {Number} The square of length / magnitude of the vector.
     */
    lengthSq() {
        return this.components[0] * this.components[0] +
            this.components[1] * this.components[1] +
            this.components[2] * this.components[2];
    }

    /**
     * The length / magnitude of the vector.
     * 
     * @returns {Number} The length / magnitude of the vector.
     */
    length() {
        return Math.sqrt(this.lengthSq());
    }

    /**
     * Normalizes the vector.
     * 
     * @returns {Vector3f} Returns itself.
     */
    normalize() {
        return this.divideScalar(this.length());
    }

    /**
     * Multiply the vector with another vector.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Vector3f} Returns itself.
     */
    multiply(v) {
        this.components[0] *= v.components[0];
        this.components[1] *= v.components[1];
        this.components[2] *= v.components[2];

        return this;
    }

    /**
     * Multiplies this vector with a scalar.
     * 
     * @param {Number} s A scalar.
     * @returns {Vector3f} Returns itself.
     */
    multiplyScalar(s) {
        this.components[0] *= s;
        this.components[1] *= s;
        this.components[2] *= s;

        return this;
    }

    /**
     * Divides the vector by another vector.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Vector3f} Returns itself.
     */
    divide(v) {
        this.components[0] /= v.components[0];
        this.components[1] /= v.components[1];
        this.components[2] /= v.components[2];

        return this;
    }

    /**
     * Divides the vector by a scalar.
     * 
     * @param {Number} s A scalar.
     * @returns {Vector3f} Returns itself.
     */
    divideScalar(s) {
        this.components[0] /= s;
        this.components[1] /= s;
        this.components[2] /= s;

        return this;
    }

    /**
     * Sums the vector with another.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Vector3f} Returns itself.
     */
    add(v) {
        this.components[0] += v.components[0];
        this.components[1] += v.components[1];
        this.components[2] += v.components[2];

        return this;
    }

    /**
     * Substracts a vector from this one.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Vector3f} Returns itself.
     */
    subtract(v) {
        this.components[0] -= v.components[0];
        this.components[1] -= v.components[1];
        this.components[2] -= v.components[2];

        return this;
    }

    /**
     * Calculates the dot product for the vector with another vector.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Number} The dot product of the two vectors.
     */
    dot(v) {
        return this.components[0] * v.components[0] +
            this.components[1] * v.components[1] +
            this.components[2] * v.components[2];
    }

    /**
     * Calculates the cross product for the vector with another vector.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Number} The cross product of the two vectors.
     */
    cross(v) {
        return new Lore.Vector3f(
            this.components[1] * v.components[2] - this.components[2] * v.components[1],
            this.components[2] * v.components[0] - this.components[0] * v.components[2],
            this.components[0] * v.components[1] - this.components[1] * v.components[0]
        );
    }

    /**
     * Projects the vector from world space into camera space.
     * 
     * @param {CameraBase} camera A camera instance.
     * @returns {Vector3f} The vector in camera space.
     */
    project(camera) {
        return this.applyProjection(Lore.Matrix4f.multiply(camera.projectionMatrix, Lore.Matrix4f.invert(camera.modelMatrix)));
    }

    /**
     * Projects the vector from camera space into world space.
     * 
     * @param {CameraBase} camera A camera instance.
     * @returns {Vector3f} The vector in world space.
     */
    unproject(camera) {
        return this.applyProjection(Lore.Matrix4f.multiply(camera.modelMatrix, Lore.Matrix4f.invert(camera.projectionMatrix)));
    }

    /**
     * Applies a projection matrix to the vector.
     * 
     * @param {Matrix4f} m A (projection) matrix.
     * @returns {Vector3f} Returns itself.
     */
    applyProjection(m) {
        var x = this.components[0];
        var y = this.components[1];
        var z = this.components[2];

        var e = m.entries;
        var p = 1.0 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        this.components[0] = (e[0] * x + e[4] * y + e[8] * z + e[12]) * p;
        this.components[1] = (e[1] * x + e[5] * y + e[9] * z + e[13]) * p;
        this.components[2] = (e[2] * x + e[6] * y + e[10] * z + e[14]) * p;

        return this;
    }

    /**
     * Rotates the vector into the direction defined by the rotational component of a matrix.
     * 
     * @param {Matrix4f} m A matrix.
     * @returns {Vector3f} Returns itself.
     */
    toDirection(m) {
        var x = this.components[0];
        var y = this.components[1];
        var z = this.components[2];

        var e = m.entries;

        this.components[0] = e[0] * x + e[4] * y + e[8] * z;
        this.components[1] = e[1] * x + e[5] * y + e[9] * z;
        this.components[2] = e[2] * x + e[6] * y + e[10] * z;

        this.normalize();

        return this;
    }

    /**
     * Applies a quaternion to the vector (usually a rotation).
     * 
     * @param {Quaternion} q Quaternion.
     * @returns {Vector3f} Returns itself.
     */
    applyQuaternion(q) {
        var x = this.components[0];
        var y = this.components[1];
        var z = this.components[2];

        var qx = q.components[0];
        var qy = q.components[1];
        var qz = q.components[2];
        var qw = q.components[3];

        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;

        this.components[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.components[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.components[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    }

    /**
     * Calculates the square of the distance to another vector.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Number} The square of the distance to the other vector.
     */
    distanceToSq(v) {
        var dx = this.components[0] - v.components[0];
        var dy = this.components[1] - v.components[1];
        var dz = this.components[2] - v.components[2];

        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Calculates the distance to another vector.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Number} The distance to the other vector.
     */
    distanceTo(v) {
        return Math.sqrt(this.distanceToSq(v));
    }

    /**
     * Clones this vector.
     * 
     * @returns {Vector3f} A clone of this vector.
     */
    clone() {
        return new Lore.Vector3f(this.components[0], this.components[1],
            this.components[2]);
    }

    /**
     * Compares the components of the vector to those of another.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Boolean} A vector indicating whether or not the two vectors are equal.
     */
    equals(v) {
        return this.components[0] === v.components[0] &&
            this.components[1] === v.components[1] &&
            this.components[2] === v.components[2];
    }

    /**
     * Returns a string representation of the vector.
     * 
     * @returns {String} A string representation of the vector.
     */
    toString() {
        return '(' + this.components[0] + ', ' + this.components[1] + ', ' +
            this.components[2] + ')';
    }

    /**
     * Normalizes a vector.
     * 
     * @static
     * @param {Vector3f} v A vector. 
     * @returns {Vector3f} The noramlized vector.
     */
    static normalize(v) {
        return Lore.Vector3f.divideScalar(v, v.length());
    }

    /**
     * Multiplies two vectors.
     * 
     * @static
     * @param {Vector3f} u A vector. 
     * @param {Vector3f} v A vector. 
     * @returns {Vector3f} The product of the two vectors.
     */
    static multiply(u, v) {
        return new Lore.Vector3f(u.components[0] * v.components[0],
            u.components[1] * v.components[1],
            u.components[2] * v.components[2]);
    }

    /**
     * Multiplies a vector with a scalar.
     * 
     * @static
     * @param {Vector3f} v A vector. 
     * @param {Number} s A scalar.
     * @returns {Vector3f} The vector multiplied by the scalar.
     */
    static multiplyScalar(v, s) {
        return new Lore.Vector3f(v.components[0] * s,
            v.components[1] * s,
            v.components[2] * s);
    }

    /**
     * Divides a vector by another vector (u / v).
     * 
     * @static
     * @param {Vector3f} u A vector. 
     * @param {Vector3f} v A vector. 
     * @returns {Vector3f} The fraction vector.
     */
    static divide(u, v) {
        return new Lore.Vector3f(u.components[0] / v.components[0],
            u.components[1] / v.components[1],
            u.components[2] / v.components[2]);
    }

    /**
     * Divides a vector by a scalar.
     * 
     * @static
     * @param {Vector3f} v A vector. 
     * @param {Number} s A scalar.
     * @returns {Vector3f} The vector divided by the scalar.
     */
    static divideScalar(v, s) {
        return new Lore.Vector3f(v.components[0] / s,
            v.components[1] / s,
            v.components[2] / s);
    }

    /**
     * Sums two vectors.
     * 
     * @static
     * @param {Vector3f} u A vector. 
     * @param {Vector3f} v A vector. 
     * @returns {Vector3f} The sum of the two vectors.
     */
    static add(u, v) {
        return new Lore.Vector3f(u.components[0] + v.components[0],
            u.components[1] + v.components[1],
            u.components[2] + v.components[2]);
    }

    /**
     * Subtracts one scalar from another (u - v)
     * 
     * @static
     * @param {Vector3f} u A vector. 
     * @param {Vector3f} v A vector. 
     * @returns {Vector3f} The difference between the two vectors.
     */
    static subtract(u, v) {
        return new Lore.Vector3f(u.components[0] - v.components[0],
            u.components[1] - v.components[1],
            u.components[2] - v.components[2]);
    }

    /**
     * Calculates the cross product of two vectors.
     * 
     * @static
     * @param {Vector3f} u A vector. 
     * @param {Vector3f} v A vector. 
     * @returns {Vector3f} The cross product of the two vectors.
     */
    static cross(u, v) {
        return new Lore.Vector3f(
            u.components[1] * v.components[2] - u.components[2] * v.components[1],
            u.components[2] * v.components[0] - u.components[0] * v.components[2],
            u.components[0] * v.components[1] - u.components[1] * v.components[0]
        );
    }

    /**
     * Calculates the dot product of two vectors.
     * 
     * @static
     * @param {Vector3f} u A vector. 
     * @param {Vector3f} v A vector. 
     * @returns {Number} The dot product of the two vectors.
     */
    static dot(u, v) {
        return u.components[0] * v.components[0] +
            u.components[1] * v.components[1] +
            u.components[2] * v.components[2];
    }

    /**
     * Returns the forward vector (0, 0, 1).
     * 
     * @static
     * @returns {Vector3f} The forward vector.
     */
    static forward() {
        return new Lore.Vector3f(0, 0, 1);
    }

    /**
     * Returns the up vector (0, 1, 0).
     * 
     * @static
     * @returns {Vector3f} The up vector.
     */
    static up() {
        return new Lore.Vector3f(0, 1, 0);
    }

    /**
     * Returns the right vector (1, 0, 0).
     * 
     * @static
     * @returns {Vector3f} The right vector.
     */
    static right() {
        return new Lore.Vector3f(1, 0, 0);
    }
}
