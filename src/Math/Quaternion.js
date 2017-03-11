Lore.Quaternion = class Quaternion {
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

    getX() {
        return this.components[0];
    }

    getY() {
        return this.components[1];
    }

    getZ() {
        return this.components[2];
    }

    getW() {
        return this.components[3];
    }

    set(x, y, z, w) {
        this.components[0] = x;
        this.components[1] = y;
        this.components[2] = z;
        this.components[3] = w;
    }

    setX(x) {
        this.components[0] = x;
    }

    setY(y) {
        this.components[1] = y;
    }

    setZ(z) {
        this.components[2] = z;
    }

    setW(w) {
        this.components[3] = w;
    }

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
    }

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
    }

    lookAt(source, dest, up) {
        this.setFromMatrix(Lore.Matrix4f.lookAt(source, dest, up));
        return this;
    }

    lengthSq() {
        return this.components[0] * this.components[0] +
            this.components[1] * this.components[1] +
            this.components[2] * this.components[2] +
            this.components[3] * this.components[3];
    }

    length() {
        return Math.sqrt(this.lengthSq());
    }

    inverse() {
        return this.conjugate().normalize();
    }

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

    dot(q) {
        return this.components[0] * q.components[0] +
            this.components[1] * q.components[1] +
            this.components[2] * q.components[2] +
            this.components[3] * q.components[3];
    }

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

    multiplyScalar(s) {
        this.components[0] *= s;
        this.components[1] *= s;
        this.components[2] *= s;
        this.components[3] *= s;

        return this;
    }

    conjugate() {
        // See:
        // http://www.3dgep.com/understanding-quaternions/#Quaternion_Conjugate
        this.components[0] *= -1;
        this.components[1] *= -1;
        this.components[2] *= -1;

        return this;
    }

    add(q) {
        this.components[0] += q.components[0];
        this.components[1] += q.components[1];
        this.components[2] += q.components[2];
        this.components[3] += q.components[3];

        return this;
    }

    subtract(q) {
        this.components[0] -= q.components[0];
        this.components[1] -= q.components[1];
        this.components[2] -= q.components[2];
        this.components[3] -= q.components[3];

        return this;
    }

    rotateX(angle) {
        let halfAngle = angle / 2.0;
        return this.multiplyA(
            new Lore.Quaternion(Math.sin(halfAngle), 0.0, 0.0, Math.cos(halfAngle))
        );
    }

    rotateY(angle) {
        let halfAngle = angle / 2.0;
        return this.multiplyA(
            new Lore.Quaternion(0.0, Math.sin(halfAngle), 0.0, Math.cos(halfAngle))
        );
    }

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

    clone() {
        return new Lore.Quaternion(this.components[0], this.components[1],
            this.components[2], this.components[3]);
    }

    equals(q) {
        return this.components[0] === q.components[0] &&
            this.components[1] === q.components[1] &&
            this.components[2] === q.components[2] &&
            this.components[3] === q.components[3];
    }

    toString() {
        return 'x: ' + this.getX() + ', y: ' + this.getY() + ', z: ' +
            this.getZ() + ', w: ' + this.getW();
    }
}

Lore.Quaternion.dot = function (q, p) {
    return new Lore.Quaternion(q.components[0] * p.components[0] +
        q.components[1] * p.components[1] +
        q.components[2] * p.components[2] +
        q.components[3] * p.components[3]);
}

Lore.Quaternion.multiply = function (a, b) {
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

Lore.Quaternion.multiplyScalar = function (q, s) {
    return new Lore.Quaternion(q.components[0] * s, q.components[1] * s,
        q.components[2] * s, q.components[3] * s);
}

Lore.Quaternion.inverse = function (q) {
    let p = new Lore.Quaternion(q.components);
    return p.conjugate().normalize();
}

Lore.Quaternion.normalize = function (q) {
    let length = q.length();

    if (length === 0) {
        return new Lore.Quaternion(0.0, 0.0, 0.0, 1.0);
    } else {
        let inv = 1 / length;
        return new Lore.Quaternion(q.components[0] * inv, q.components[1] * inv,
            q.components[2] * inv, q.components[3] * inv);
    }
}

Lore.Quaternion.conjugate = function (q) {
    return new Lore.Quaternion(q.components[0] * -1, q.components[1] * -1,
        q.components[2] * -1, q.components[3]);
}

Lore.Quaternion.add = function (q, p) {
    return new Lore.Quaternion(q.components[0] + p.components[0],
        q.components[1] + p.components[1],
        q.components[2] + p.components[2],
        q.components[3] + p.components[3]);
}

Lore.Quaternion.subtract = function (q, p) {
    return new Lore.Quaternion(q.components[0] - p.components[0],
        q.components[1] - p.components[1],
        q.components[2] - p.components[2],
        q.components[3] - p.components[3]);
}

Lore.Quaternion.fromMatrix = function (m) {
    let q = new Lore.Quaternion();
    q.setFromMatrix(m);
    return q;
}

Lore.Quaternion.slerp = function (q, p, t) {
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