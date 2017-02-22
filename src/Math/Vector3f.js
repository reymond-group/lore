Lore.Vector3f = class Vector3f {
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

    set(x, y, z) {
        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        return this;
    }

    getX() {
        return this.components[0];
    }

    getY() {
        return this.components[1];
    }

    getZ() {
        return this.components[2];
    }

    setX(x) {
        this.components[0] = x;

        return this;
    }

    setY(y) {
        this.components[1] = y;

        return this;
    }

    setZ(z) {
        this.components[2] = z;

        return this;
    }

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

    copyFrom(v) {
        this.components[0] = v.components[0];
        this.components[1] = v.components[1];
        this.components[2] = v.components[2];

        return this;
    }

    setLength(length) {
        return this.multiplyScalar(length / this.length());
    }

    lengthSq() {
        return this.components[0] * this.components[0] +
            this.components[1] * this.components[1] +
            this.components[2] * this.components[2];
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    normalize() {
        return this.divideScalar(this.length());
    }

    multiply(v) {
        this.components[0] *= v.components[0];
        this.components[1] *= v.components[1];
        this.components[2] *= v.components[2];

        return this;
    }

    multiplyScalar(s) {
        this.components[0] *= s;
        this.components[1] *= s;
        this.components[2] *= s;

        return this;
    }

    divide(v) {
        this.components[0] /= v.components[0];
        this.components[1] /= v.components[1];
        this.components[2] /= v.components[2];

        return this;
    }

    divideScalar(s) {
        this.components[0] /= s;
        this.components[1] /= s;
        this.components[2] /= s;

        return this;
    }

    add(v) {
        this.components[0] += v.components[0];
        this.components[1] += v.components[1];
        this.components[2] += v.components[2];

        return this;
    }

    subtract(v) {
        this.components[0] -= v.components[0];
        this.components[1] -= v.components[1];
        this.components[2] -= v.components[2];

        return this;
    }

    dot(v) {
        return this.components[0] * v.components[0] +
            this.components[1] * v.components[1] +
            this.components[2] * v.components[2];
    }

    cross(v) {
        return new Lore.Vector3f(
            this.components[1] * v.components[2] - this.components[2] * v.components[1],
            this.components[2] * v.components[0] - this.components[0] * v.components[2],
            this.components[0] * v.components[1] - this.components[1] * v.components[0]
        );
    }

    project(camera) {
        return this.applyProjection(Lore.Matrix4f.multiply(camera.projectionMatrix, Lore.Matrix4f.invert(camera.modelMatrix)));
    }

    unproject(camera) {
        return this.applyProjection(Lore.Matrix4f.multiply(camera.modelMatrix, Lore.Matrix4f.invert(camera.projectionMatrix)));
    }

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

    distanceToSq(v) {
        var dx = this.components[0] - v.components[0];
        var dy = this.components[1] - v.components[1];
        var dz = this.components[2] - v.components[2];

        return dx * dx + dy * dy + dz * dz;
    }

    distanceTo(v) {
        return Math.sqrt(this.distanceToSq(v));
    }

    clone() {
        return new Lore.Vector3f(this.components[0], this.components[1],
            this.components[2]);
    }

    equals(v) {
        return this.components[0] === v.components[0] &&
            this.components[1] === v.components[1] &&
            this.components[2] === v.components[2];
    }

    toString() {
        return '(' + this.components[0] + ', ' + this.components[1] + ', ' +
            this.components[2] + ')';
    }

    static normalize(v) {
        return Lore.Vector3f.divideScalar(v, v.length());
    }

    static multiply(u, v) {
        return new Lore.Vector3f(u.components[0] * v.components[0],
            u.components[1] * v.components[1],
            u.components[2] * v.components[2]);
    }

    static multiplyScalar(v, s) {
        return new Lore.Vector3f(v.components[0] * s,
            v.components[1] * s,
            v.components[2] * s);
    }

    static divide(u, v) {
        return new Lore.Vector3f(u.components[0] / v.components[0],
            u.components[1] / v.components[1],
            u.components[2] / v.components[2]);
    }

    static divideScalar(v, s) {
        return new Lore.Vector3f(v.components[0] / s,
            v.components[1] / s,
            v.components[2] / s);
    }

    static add(u, v) {
        return new Lore.Vector3f(u.components[0] + v.components[0],
            u.components[1] + v.components[1],
            u.components[2] + v.components[2]);
    }

    static subtract(u, v) {
        return new Lore.Vector3f(u.components[0] - v.components[0],
            u.components[1] - v.components[1],
            u.components[2] - v.components[2]);
    }

    static cross(u, v) {
        return new Lore.Vector3f(
            u.components[1] * v.components[2] - u.components[2] * v.components[1],
            u.components[2] * v.components[0] - u.components[0] * v.components[2],
            u.components[0] * v.components[1] - u.components[1] * v.components[0]
        );
    }

    static dot(u, v) {
        return u.components[0] * v.components[0] +
            u.components[1] * v.components[1] +
            u.components[2] * v.components[2];
    }

    static forward() {
        return new Lore.Vector3f(0, 0, 1);
    }

    static up() {
        return new Lore.Vector3f(0, 1, 0);
    }

    static right() {
        return new Lore.Vector3f(1, 0, 0);
    }
}
