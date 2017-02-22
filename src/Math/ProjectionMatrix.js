/** A class representing a projection matrix */
Lore.ProjectionMatrix = class ProjectionMatrix extends Lore.Matrix4f {
    /**
     * Set the projection matrix to an orthographic projection.
     *
     * @param {number} left The left edge.
     * @param {number} right The right edge.
     * @param {number} top The top edge.
     * @param {number} bottom The bottom edge.
     * @param {number} near The near-cutoff value.
     * @param {number} far The far-cutoff value.
     * @returns {ProjectionMatrix} Returns this projection matrix.
     */
    setOrthographic(left, right, top, bottom, near, far) {
        let w = 1.0 / (right - left);
        let h = 1.0 / (top - bottom);
        let d = 1.0 / (far - near);

        let x = (right + left) * w;
        let y = (top + bottom) * h;
        let z = (far + near) * d;

        this.set()

        this.entries[0] = 2 * w;
        this.entries[4] = 0;
        this.entries[8] = 0;
        this.entries[12] = -x;
        this.entries[1] = 0;
        this.entries[5] = 2 * h;
        this.entries[9] = 0;
        this.entries[13] = -y;
        this.entries[2] = 0;
        this.entries[6] = 0;
        this.entries[10] = -2 * d;
        this.entries[14] = -z;
        this.entries[3] = 0;
        this.entries[7] = 0;
        this.entries[11] = 0;
        this.entries[15] = 1;

        return this;
    }
}
