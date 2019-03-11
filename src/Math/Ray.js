//@ts-check

const Vector3f = require('./Vector3f');
const ProjectionMatrix = require('./ProjectionMatrix');
const Matrix4f = require('./Matrix4f');

/** A class representing a ray */
class Ray {

    /**
     * Creates an instance of Ray.
     * @param {Vector3f} source The source of the ray.
     * @param {Vector3f} direction The direction of the ray.
     */
    constructor(source, direction) {
        this.source = source || new Vector3f(0.0, 0.0, 0.0);
        this.direction = direction || new Vector3f(0.0, 0.0, 0.0);
    }

    /**
     * Copy the values from another ray.
     * 
     * @param {Ray} r A ray.
     * @returns {Ray} Returns itself.
     */
    copyFrom(r) {
        this.source.copyFrom(r.source);
        this.direction.copyFrom(r.direction);

        return this;
    }

    /**
     * Apply a projection matrix to this ray.
     * 
     * @param {Matrix4f|ProjectionMatrix} m A matrix / projection matrix.
     * @returns {Ray} Returns itself.
     */
    applyProjection(m) {
        this.direction.add(this.source).applyProjection(m);
        this.source.applyProjection(m);
        this.direction.subtract(this.source);
        this.direction.normalize();

        return this;
    }

    // See if the two following functions can be optimized
    /**
     * The square of the distance of a vector to this ray.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Number} The square pf the distance between the point and this ray.
     */
    distanceSqToPoint(v) {
        let tmp = Vector3f.subtract(v, this.source);
        let directionDistance = tmp.dot(this.direction);

        if (directionDistance < 0) {
            return this.source.distanceToSq(v);
        }

        tmp.copyFrom(this.direction).multiplyScalar(directionDistance).add(this.source);

        return tmp.distanceToSq(v);
    }

    /**
     * Find a point on the ray that is closest to a supplied vector.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Vector3f} The cloest point on the ray to the supplied point.
     */
    closestPointToPoint(v) {
        let result = Vector3f.subtract(v, this.source);
        let directionDistance = result.dot(this.direction);

        if (directionDistance < 0) {
            return result.copyFrom(this.source);
        }

        return result.copyFrom(this.direction).multiplyScalar(directionDistance).add(this.source);
    }
}

module.exports = Ray