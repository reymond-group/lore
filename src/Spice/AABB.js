/**
 * @class
 * Axis-aligned bounding boxes with the constraint that they are cubes with equal sides.
 * @property {Lore.Vector3f} center - The center of this axis-aligned bounding box.
 * @property {number} radius - The radius of this axis-aligned bounding box.
 * @property {number} locCode - The location code of this axis-aligned bounding box in the octree.
 * @property {number} left - The distance of the left plane to the world ZY plane.
 * @property {number} right - The distance of the right plane to the world ZY plane.
 * @property {number} back - The distance of the back plane to the world XY plane.
 * @property {number} front - The distance of the front plane to the world XY plane.
 * @property {number} bottom - The distance of the bottom plane to the world XZ plane.
 * @property {number} top - The distance of the top plane to the world XZ plane.
 * @property {Array} neighbours - The neighbours of this axis-aligned bounding box in an an octree.
 * @property {Float32Array} min - An array specifying the minimum corner point (x, y, z) of the axis-aligned bounding box.
 * @property {Float32Array} max - An array specifying the maximum corner point (x, y, z) of the axis-aligned bounding box.
 * @constructor
 * @param {Lore.Vector3f} center - A radius for this axis-aligned bounding box.
 * @param {number} radius - A radius for this axis-aligned bounding box.
 */
Lore.AABB = function(center, radius) {
    this.center = center || new Lore.Vector3f();
    this.radius = radius || 0;
    this.locCode = 0;
    this.left = 0;
    this.right = 0;
    this.back = 0;
    this.front = 0;
    this.bottom = 0;
    this.top = 0;
    this.neighbours = new Array(6);
    this.min = new Float32Array(3);
    this.max = new Float32Array(3);

    this.updateDimensions();
}

Lore.AABB.prototype = {
    constructor: Lore.AABB,

    /**
     * Calculates the distance of the axis-aligned bounding box's planes to the world planes.
     */
    updateDimensions: function() {
        var cx = this.center.components[0];
        var cy = this.center.components[1];
        var cz = this.center.components[2];

        this.min[0] = cx - this.radius;
        this.min[1] = cy - this.radius;
        this.min[2] = cz - this.radius;
        this.max[0] = cx + this.radius;
        this.max[1] = cy + this.radius;
        this.max[2] = cz + this.radius;

        // Precalculate to simplify ray test
        this.left = cx - this.radius;
        this.right = cx + this.radius;
        this.back = cz - this.radius;
        this.front = cz + this.radius;
        this.bottom = cy - this.radius;
        this.top = cy + this.radius;
    },

    /**
     * Sets the location code of this axis-aligned bounding box.
     * @param {number} locCode - The location code.
     */
    setLocCode: function(locCode) {
        this.locCode = locCode;
    },

    /**
     * Gets the location code of this axis-aligned bounding box.
     * @returns {number} The location code.
     */
    getLocCode: function() {
        return this.locCode;
    },

    /**
     * Tests whether or not this axis-aligned bounding box is intersected by a ray.
     * @param {Lore.Vector3f} source - The source of the ray.
     * @param {Lore.Vector3f} dir - A normalized vector of the direction of the ray.
     * @param {number} dist - The maximum distance from the source that still counts as an intersect (the far property of the Lore.Raycaster object).
     * @returns {boolean} - Whether or not there is an intersect.
     */
    rayTest: function(source, inverseDir, dist) {
        // dir is the precomputed inverse of the direction of the ray,
        // this means that the costly divisions can be omitted
        var oc = source.components;
        var ic = inverseDir.components;

        var t0 = (this.left - oc[0]) * ic[0];
        var t1 = (this.right - oc[0]) * ic[0];
        var t2 = (this.bottom - oc[1]) * ic[1];
        var t3 = (this.top - oc[1]) * ic[1];
        var t4 = (this.back - oc[2]) * ic[2];
        var t5 = (this.front - oc[2]) * ic[2];

        var maxT = Math.min(Math.max(t0, t1), Math.max(t2, t3), Math.max(t4, t5));

        // Ray intersects in reverse direction, which means
        // that the box is behind the camera
        if(maxT < 0) return false;

        var minT = Math.max(Math.min(t0, t1), Math.min(t2, t3), Math.min(t4, t5));

        if (minT > maxT || minT > dist) return false;

        // Intersection happens when minT is larger or equal to maxT
        // and minT is smaller than the distance (distance == radius == ray.far)
        return true;
    },

    /**
     * Tests whether or not this axis-aligned bounding box is intersected by a cylinder. CAUTION: If this runs multi-threaded, it might fail.
     * @param {Lore.Vector3f} source - The source of the ray.
     * @param {Lore.Vector3f} dir - A normalized vector of the direction of the ray.
     * @param {number} dist - The maximum distance from the source that still counts as an intersect (the far property of the Lore.Raycaster object).
     * @param {number} radius - The radius of the cylinder
     * @returns {boolean} - Whether or not there is an intersect.
     */
    cylinderTest: function(source, inverseDir, dist, radius) {
        // Instead of testing an actual cylinder against this aabb, we simply
        // expand the radius of the box temporarily.
        this.radius += radius;
        this.updateDimensions();

        // Do the normal ray intersection test
        var result = this.rayTest(source, inverseDir, dist);

        this.radius -= radius;
        this.updateDimensions();

        return result;
    },

    /**
     * Returns the square distance of this axis-aligned bounding box to the point supplied as an argument.
     * @param {number} x - The x component of the point coordinate.
     * @param {number} y - The y component of the point coordinate.
     * @param {number} z - The z component of the point coordinate.
     * @returns {number} The square distance of this axis-aligned bounding box to the input point.
     */
    distanceToPointSq: function(x, y, z) {
        // From book, real time collision detection
        var sqDist = 0;
        var p = [ x, y, z ];
        // Add the distances for each axis
        for(var i = 0; i < 3; i++) {
            if(p[i] < this.min[i])
                sqDist += Math.pow(this.min[i] - p[i], 2);
            if(p[i] > this.max[i])
                sqDist += Math.pow(p[i] - this.max[i], 2);
        }

        return sqDist;
    },

    /**
     * Returns the box that is closest to the point (measured from center).
     * @param {number} x - The x component of the point coordinate.
     * @param {number} y - The y component of the point coordinate.
     * @param {number} z - The z component of the point coordinate.
     * @returns {number} The square distance of this axis-aligned bounding box to the input point.
     */
    distanceFromCenterToPointSq: function(x, y, z) {
        var center = this.center.components;
        return Math.pow(center[0] - x, 2) + Math.pow(center[1] - y, 2) + Math.pow(center[2] - z, 2);
    },

    /**
     * Tests whether or not this axis-aligned bounding box overlaps or shares an edge or a vertex with another axis-aligned bounding box.
     * This method can also be used to assert whether or not two boxes are neighbours.
     * @param {Lore.AABB} aabb - The axis-aligned bounding box to test against.
     * @returns {boolean} - Whether or not there is an overlap.
     */
    testAABB: function(aabb) {
        for(var i = 0; i < 3; i++) {
            if(this.max[i] < aabb.min[i] || this.min[i] > aabb.max[i]) return false;
        }
        return true;
    }
}

/**
 * Creates a axis-aligned bounding box surrounding a set of vertices.
 * @param {Uint32Array} vertices - The vertices which will all be inside the axis-aligned bounding box.
 * @returns {Lore.AABB} An axis-aligned bounding box surrounding the vertices.
 */
Lore.AABB.fromPoints = function(vertices) {
    var x = vertices[0];
    var y = vertices[1];
    var z = vertices[2];

    var min = new Lore.Vector3f(x, y, z);
    var max = new Lore.Vector3f(x, y, z);

    var minc = min.components;
    var maxc = max.components;

    for(var i = 1; i < vertices.length / 3; i++) {
        if(vertices[i * 3 + 0] < minc[0]) minc[0] = vertices[i * 3 + 0];
        if(vertices[i * 3 + 1] < minc[1]) minc[1] = vertices[i * 3 + 1];
        if(vertices[i * 3 + 2] < minc[2]) minc[2] = vertices[i * 3 + 2];
        if(vertices[i * 3 + 0] > maxc[0]) maxc[0] = vertices[i * 3 + 0];
        if(vertices[i * 3 + 1] > maxc[1]) maxc[1] = vertices[i * 3 + 1];
        if(vertices[i * 3 + 2] > maxc[2]) maxc[2] = vertices[i * 3 + 2];
    }

    // Calculate the radius in each direction
    var radii = new Lore.Vector3f.subtract(max, min);
    radii.multiplyScalar(0.5);

    var rx = radii.components[0];
    var ry = radii.components[1];
    var rz = radii.components[2];

    var center = new Lore.Vector3f(rx, ry, rz);
    center.add(min);
    // Since the octree always stores cubes, there is of course only
    // one radius - take the biggest one
    var radius = Math.max(rx, ry, rz);
    return new Lore.AABB(center, radius);
}

Lore.AABB.getCorners = function(aabb) {
    var c = aabb.center.components;
    var x = c[0];
    var y = c[1];
    var z = c[2];
    var r = aabb.radius;

    return [
        [ x - r, y - r, z - r ],
        [ x - r, y - r, z + r ],
        [ x - r, y + r, z - r ],
        [ x - r, y + r, z + r ],
        [ x + r, y - r, z - r ],
        [ x + r, y - r, z + r ],
        [ x + r, y + r, z - r ],
        [ x + r, y + r, z + r ]
    ]
}

/**
 * Clones an axis-aligned bounding box.
 * @param {Lore.AABB} original - The axis-aligned bounding box to be cloned.
 * @returns {Lore.AABB} The cloned axis-aligned bounding box.
 */
Lore.AABB.clone = function(original) {
    var clone = new Lore.AABB();
    clone.back = original.back;
    clone.bottom = original.bottom;
    clone.center = new Lore.Vector3f(original.center.components[0], original.center.components[1], original.center.components[2]);
    clone.front = original.front;
    clone.left = original.left;
    clone.locCode = original.locCode;
    clone.max = original.max;
    clone.min = original.min;
    clone.radius = original.radius;
    clone.right = original.right;
    clone.top = original.top;

    return clone;
}
