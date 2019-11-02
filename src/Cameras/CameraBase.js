//@ts-check

const Node = require('../Core/Node');
const ProjectionMatrix = require('../Math/ProjectionMatrix');
const Matrix4f = require('../Math/Matrix4f');
const Vector3f = require('../Math/Vector3f');

/** 
 * An abstract class representing the base for camera implementations. 
 * 
 * @property {string} type The type name of this object (Lore.CameraBase).
 * @property {Renderer} renderer A Lore.Renderer object.
 * @property {boolean} isProjectionMatrixStale A boolean indicating whether or not the projection matrix was changed and has to be updated.
 * @property {ProjectionMatrix} projectionMatrix A Lore.ProjectionMatrix object.
 * @property {Matrix4f} viewMatrix A Lore.Matrix4f object representing the view matrix for this camera.
 * */
class CameraBase extends Node {
  /**
   * Creates an instance of CameraBase.
   */
  constructor() {
    super();

    this.type = 'Lore.CameraBase';
    this.renderer = null;
    this.isProjectionMatrixStale = false;
    this.isViewMatrixStale = false;
    this.projectionMatrix = new ProjectionMatrix();
    this.viewMatrix = new Matrix4f();
    this.near = 0.0;
    this.far = 1000.0;
    this._eventListeners = {};
  }

  /**
   * Initializes this camera instance.
   * 
   * @param {any} gl A gl context.
   * @param {any} program A program pointer.
   * @returns {CameraBase} Returns itself.
   */
  init(gl, program) {
    this.gl = gl;
    this.program = program;

    return this;
  }

  /**
   * Sets the lookat of this camera instance.
   * 
   * @param {Vector3f} vec The vector to set the lookat to.
   * @returns {CameraBase} Returns itself.
   */
  setLookAt(vec) {
    this.rotation.lookAt(this.position, vec, Vector3f.up());

    return this;
  }

  /**
   * Has to be called when the viewport size changes (e.g. window resize).
   * 
   * @param {Number} width The width of the viewport.
   * @param {Number} height The height of the viewport.
   * 
   * @returns {CameraBase} Returns itself.
   */
  updateViewport(width, height) {
    return this;
  }

  /**
   * Virtual Method
   * 
   * @returns {CameraBase} Returns itself.
   */
  updateProjectionMatrix() {
    return this;
  }

  /**
   * Upates the view matrix of this camera.
   * 
   * @returns {CameraBase} Returns itself.
   */
  updateViewMatrix() {
    this.update();

    let viewMatrix = this.modelMatrix.clone();

    viewMatrix.invert();
    this.viewMatrix = viewMatrix;
    this.isViewMatrixStale = true;

    return this;
  }

  /**
   * Returns the projection matrix of this camera instance as an array.
   * 
   * @returns {Float32Array} The entries of the projection matrix.
   */
  getProjectionMatrix() {
    return this.projectionMatrix.entries;
  }

  /**
   * Returns the view matrix of this camera instance as an array.
   * 
   * @returns {Float32Array} The entries of the view matrix.
   */
  getViewMatrix() {
    return this.viewMatrix.entries;
  }

  /**
   * Virtual Method
   */
  getFrustum() {
    return null;
  }

  /**
   * Projects a vector into screen space.
   * 
   * @param {Vector3f} vec A vector.
   * @param {Renderer} renderer An instance of a Lore renderer.
   * @returns {Array} An array containing the x and y position in screen space.
   */
  sceneToScreen(vec, renderer) {
    let vector = vec.clone();
    let canvas = renderer.canvas;

    Matrix4f.projectVector(vector, this);

    // Map to 2D screen space
    // Correct for high dpi display by dividing by device pixel ratio
    let x = Math.round((vector.components[0] + 1) * canvas.width / 2) / renderer.devicePixelRatio;
    let y = Math.round((-vector.components[1] + 1) * canvas.height / 2) / renderer.devicePixelRatio;

    return [x, y];
  }

  /**
  * Adds an event listener to this controls instance.
  *
  * @param {String} eventName The name of the event that is to be listened for.
  * @param {Function} callback A callback function to be called on the event being fired.
  */
  addEventListener(eventName, callback) {
    if (!this._eventListeners[eventName]) {
      this._eventListeners[eventName] = [];
    }

    this._eventListeners[eventName].push(callback);
  }

  /**
   * Remove an event listener from this controls instance.
   *
   * @param {String} eventName The name of the event that is to be listened for.
   * @param {Function} callback A callback function to be called on the event being fired.
   */
  removeEventListener(eventName, callback) {
    if (!this._eventListeners.hasOwnProperty(eventName)) {
      return;
    }

    let index = this._eventListeners[eventName].indexOf(callback);

    if (index > -1) {
      this._eventListeners[eventName].splice(index, 1);
    }
  }

  /**
   * Raises an event.
   *
   * @param {String} eventName The name of the event to be raised.
   * @param {*} [data={}] The data to be supplied to the callback function.
   */
  raiseEvent(eventName, data = {}) {
    if (this._eventListeners[eventName]) {
      for (let i = 0; i < this._eventListeners[eventName].length; i++) {
        this._eventListeners[eventName][i](data);
      }
    }
  }
}

module.exports = CameraBase;