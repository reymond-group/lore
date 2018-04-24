//@ts-check



/** A class representing a 3x3 float matrix */
class Matrix3f {
    /**
     * The constructor for the class Matrix3f.
     *
     * @param {Float32Array} [entries=new Float32Array()] The Float32Array to which the entries will be set. If no value is provided, the matrix will be initialized to the identity matrix.
     */
    constructor(entries = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])) {
        this.entries = entries;
    }

    /**
     * Clones the matrix and returns the clone as a new Matrix3f object.
     *
     * @returns {Matrix3f} The clone.
     */
    clone() {
        return new Matrix3f(new Float32Array(this.entries));
    }

    /**
     * Compares this matrix to another matrix.
     *
     * @param {Matrix3f} mat A matrix to be compared to this matrix.
     * @returns {boolean} A boolean indicating whether or not the two matrices are identical.
     */
    equals(mat) {
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i] !== mat.entries[i]) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Matrix3f