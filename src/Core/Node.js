//@ts-check

const Vector3f = require('../Math/Vector3f');
const Quaternion = require('../Math/Quaternion');
const Matrix3f = require('../Math/Matrix3f');
const Matrix4f = require('../Math/Matrix4f');

/**
 * A class representing a node. A node is the base-class for all 3D objects.
 * 
 * @property {String} type The type name of this object (Node).
 * @property {String} id A GUID uniquely identifying the node.
 * @property {Boolean} isVisible A boolean indicating whether or not the node is visible (rendered).
 * @property {Vector3f} position The position of this node.
 * @property {Quaternion} rotation The rotation of this node.
 * @property {Vector3f} scale The scale of this node.
 * @property {Vector3f} up The up vector associated with this node.
 * @property {Matrix3f} normalMatrix The normal matrix of this node.
 * @property {Matrix4f} modelMatrix The model matrix associated with this node.
 * @property {Boolean} isStale A boolean indicating whether or not the modelMatrix of this node is stale.
 * @property {Node[]} children An array containing child-nodes.
 * @property {Node} parent The parent node.
 */
class Node {
    /**
     * Creates an instance of Node.
     */
    constructor() {
        this.type = 'Node';
        this.id = Node.createGUID();
        this.isVisible = true;
        this.position = new Vector3f(0.0, 0.0, 0.0);
        this.rotation = new Quaternion(0.0, 0.0, 0.0, 0.0);
        this.scale = new Vector3f(1.0, 1.0, 1.0);
        this.up = new Vector3f(0.0, 1.0, 0.0);
        this.normalMatrix = new Matrix3f();
        this.modelMatrix = new Matrix4f();
        this.isStale = false;

        this.children = new Array();
        this.parent = null;
    }

    /**
     * Apply a matrix to the model matrix of this node.
     * 
     * @param {Matrix4f} matrix A matrix.
     * @returns {Node} Itself.
     */
    applyMatrix(matrix) {
        this.modelMatrix.multiplyB(matrix);

        return this;
    }

    /**
     * Returns the up vector for this node.
     * 
     * @returns {Vector3f} The up vector for this node.
     */
    getUpVector() {
        let v = new Vector3f(0, 1, 0);

        return v.applyQuaternion(this.rotation);
    }

    /**
     * Returns the forward vector for this node.
     * 
     * @returns {Vector3f} The forward vector for this node.
     */
    getForwardVector() {
        let v = new Vector3f(0, 0, 1);

        return v.applyQuaternion(this.rotation);
    }

    /**
     * Returns the right vector for this node.
     * 
     * @returns {Vector3f} The right vector for this node.
     */
    getRightVector() {
        let v = new Vector3f(1, 0, 0);

        return v.applyQuaternion(this.rotation);
    }

    /**
     * Translates this node on an axis.
     * 
     * @param {Vector3f} axis A vector representing an axis.
     * @param {Number} distance The distance for which to move the node along the axis.
     * @returns {Node} Itself.
     */
    translateOnAxis(axis, distance) {
        // Axis should be normalized, following THREE.js
        let v = new Vector3f(axis.components[0], axis.components[1],
            axis.components[2]);
        v.applyQuaternion(this.rotation);
        v.multiplyScalar(distance);
        this.position.add(v);

        return this;
    }

    /**
     * Translates the node along the x-axis.
     * 
     * @param {Number} distance The distance for which to move the node along the x-axis.
     * @returns {Node} Itself.
     */
    translateX(distance) {
        this.position.components[0] = this.position.components[0] + distance;

        return this;
    }

    /**
     * Translates the node along the y-axis.
     * 
     * @param {Number} distance The distance for which to move the node along the y-axis.
     * @returns {Node} Itself.
     */
    translateY(distance) {
        this.position.components[1] = this.position.components[1] + distance;

        return this;
    }

    /**
     * Translates the node along the z-axis.
     * 
     * @param {Number} distance The distance for which to move the node along the z-axis.
     * @returns {Node} Itself.
     */
    translateZ(distance) {
        this.position.components[2] = this.position.components[2] + distance;

        return this;
    }

    /**
     * Set the translation (position) of this node.
     * 
     * @param {Vector3f} v A vector.
     * @returns {Node} Itself.
     */
    setTranslation(v) {
        this.position = v;

        return this;
    }

    /**
     * Set the rotation from an axis and an angle.
     * 
     * @param {Vector3f} axis A vector representing an angle
     * @param {Number} angle An angle.
     * @returns {Node} Itself.
     */
    setRotation(axis, angle) {
        this.rotation.setFromAxisAngle(axis, angle);

        return this;
    }

    /**
     * Rotate this node by an angle on an axis.
     * 
     * @param {Vector3f} axis A vector representing an angle
     * @param {Number} angle An angle.
     * @returns {Node} Itself.
     */
    rotate(axis, angle) {
        let q = new Quaternion(axis, angle);

        this.rotation.multiplyA(q);

        return this;
    }

    /**
     * Rotate around the x-axis.
     * 
     * @param {Number} angle An angle.
     * @returns {Node} Itself.
     */
    rotateX(angle) {
        this.rotation.rotateX(angle);

        return this;
    }

    /**
     * Rotate around the y-axis.
     * 
     * @param {Number} angle An angle.
     * @returns {Node} Itself.
     */
    rotateY(angle) {
        this.rotation.rotateY(angle);

        return this;
    }

    /**
     * Rotate around the z-axis.
     * 
     * @param {Number} angle An angle.
     * @returns {Node} Itself.
     */
    rotateZ(angle) {
        this.rotation.rotateZ(angle);

        return this;
    }

    /**
     * Get the rotation matrix for this node.
     * 
     * @returns {Matrix4f} This nodes rotation matrix.
     */
    getRotationMatrix() {
        return this.rotation.toRotationMatrix();
    }

    /**
     * Update the model matrix of this node. Has to be called in order to apply scaling, rotations or translations.
     * 
     * @returns {Node} Itself.
     */
    update() {
        this.modelMatrix.compose(this.position, this.rotation, this.scale);
        // if parent... this.modelMatrix = Matrix4f.multiply(this.parent.modelMatrix, this.modelMatrix);
        this.isStale = true;

        return this;
    }

    /**
     * Returns the model matrix as an array. 
     * 
     * @returns {Float32Array} The model matrix.
     */
    getModelMatrix() {
        return this.modelMatrix.entries;
    }

    /**
     * Creates a GUID.
     * 
     * @returns {String} A GUID.
     */
    static createGUID() {
        // See:
        // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
                
            return v.toString(16);
        });
    }
}

module.exports = Node;