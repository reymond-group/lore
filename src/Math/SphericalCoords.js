//@ts-check

const Vector3f = require('./Vector3f')

/** A class representing spherical coordinates. */
class SphericalCoords {
    /**
     * Creates an instance of SphericalCoords.
     * @param {Number} [radius=1.0] The radius.
     * @param {Number} [phi=0.0] Phi in radians.
     * @param {Number} [theta=0.0] Theta in radians.
     */
    constructor(radius = 1.0, phi = 0.0, theta = 0.0) {
        this.components = new Float32Array(3);
        this.radius = radius;
        this.phi = phi;
        this.theta = theta;
    }

    /**
     * Set the spherical coordinates from the radius, the phi angle and the theta angle.
     * 
     * @param {Number} radius 
     * @param {Number} phi 
     * @param {Number} theta 
     * @returns {SphericalCoords} Returns itself.
     */
    set(radius, phi, theta) {
        this.components[0] = radius;
        this.components[1] = phi;
        this.components[2] = theta;

        return this;
    }

    /**
     * Avoid overflows.
     * 
     * @returns {SphericalCoords} Returns itself.
     */
    secure() {
        this.components[1] = Math.max(0.000001, Math.min(Math.PI - 0.000001, this.components[1]));

        return this;
    }

    /**
     * Set the spherical coordaintes from a vector.
     * 
     * @param {Vector3f} v A vector.
     * @returns {SphericalCoords} Returns itself.
     */
    setFromVector(v) {
        this.components[0] = v.length();

        if (this.components[0] === 0.0) {
            this.components[1] = 0.0;
            this.components[2] = 0.0;
        } else {
            this.components[1] = Math.acos(Math.max(-1.0, Math.min(1.0, v.components[1] /
                this.components[0])));
            this.components[2] = Math.atan2(v.components[0], v.components[2]);
        }

        return this;
    }

    /**
     * Limit the rotation by setting maxima and minima for phi and theta.
     * 
     * @param {Number} phiMin The minimum for phi.
     * @param {Number} phiMax The maximum for phi.
     * @param {Number} thetaMin The minimum for theta.
     * @param {Number} thetaMax The maximum for theta.
     * @returns {SphericalCoords} Returns itself.
     */
    limit(phiMin, phiMax, thetaMin, thetaMax) {
        // Limits for orbital controls
        this.components[1] = Math.max(phiMin, Math.min(phiMax, this.components[1]));
        this.components[2] = Math.max(thetaMin, Math.min(thetaMax, this.components[2]));
        
        return this;
    }

    /**
     * Clone this spherical coordinates object.
     * 
     * @returns {SphericalCoords} A clone of the spherical coordinates object.
     */
    clone() {
        return new SphericalCoords(this.radius, this.phi, this.theta);
    }

    /**
     * Returns a string representation of these spherical coordinates.
     * 
     * @returns {String} A string representing spherical coordinates.
     */
    toString() {
        return '(' + this.components[0] + ', ' +
            this.components[1] + ', ' + this.components[2] + ')';
    }
}

module.exports = SphericalCoords