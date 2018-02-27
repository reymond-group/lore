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

        this.set();

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

    /**
     * Set the projection matrix to a perspective projection.
     *
     * @param {number} fov The field of view.
     * @param {number} aspect The aspect ratio (width / height).
     * @param {number} near The near-cutoff value.
     * @param {number} far The far-cutoff value.
     * @returns {ProjectionMatrix} Returns this projection matrix.
     */
    setPerspective(fov, aspect, near, far) {
        let range = near - far;
        let tanHalfFov = Math.tan(Lore.Utils.DEG2RAD * 0.5 * fov);
        
        let top = near * tanHalfFov;
        let height = 2.0 * top;
        let width = aspect * height;
        let left = -width / 2.0;
        let right = left + width;
        let bottom = top - height;
        // let bottom = -top;
        // let right = top * aspect;
        // let left = -right;

        let x = 2.0 * near / (right - left);
        let y = 2.0 * near / (top - bottom);

        let a = (right + left) / (right - left);
        let b = (top + bottom) / (top - bottom);
        let c = -(far + near) / (far - near);
        let d = -2 * far * near / (far - near);
        
        this.set();

        this.entries[0] = x;
        this.entries[4] = 0;
        this.entries[8] = a;
        this.entries[12] = 0;
        this.entries[1] = 0;
        this.entries[5] = y;
        this.entries[9] = b;
        this.entries[13] = 0;
        this.entries[2] = 0;
        this.entries[6] = 0;
        this.entries[10] = c;
        this.entries[14] = d;
        this.entries[3] = 0;
        this.entries[7] = 0;
        this.entries[11] = -1;
        this.entries[15] = 0;

        return this;
    }
}
