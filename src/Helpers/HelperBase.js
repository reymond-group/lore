//@ts-check

const Shader = require('../Core/Shader');
const Geometry = require('../Core/Geometry');
const Node = require('../Core/Node');
const Shaders = require('../Shaders');

/** 
 * The base class for helper classes.
 * 
 * @property {Renderer} renderer An instance of Lore.Renderer.
 * @property {Shader} shader The shader associated with this helper.
 * @property {Geometry} geometry The geometry associated with this helper.
 */
class HelperBase extends Node {
  /**
   * Creates an instance of HelperBase.
   * 
   * @param {Renderer} renderer A Lore.Renderer object.
   * @param {String} geometryName The name of this geometry.
   * @param {String} shaderName The name of the shader used to render the geometry.
   */
  constructor(renderer, geometryName, shaderName) {
    super();

    // Check whether the shader requires WebGL 2.0, if it does and the
    // machine doesn't support it, go to callback.
    if (Shaders[shaderName].glVersion === 2 && !this.renderer.webgl2) {
      console.warn('Switching from ' + shaderName + ' to fallback shader ' + 
                   Shaders[shaderName].fallback + ' due to missing WebGL2 support.');
      shaderName = Shaders[shaderName].fallback;
    }

    this.renderer = renderer;
    this.shader = Shaders[shaderName].clone();
    this.geometry = this.renderer.createGeometry(geometryName, shaderName);
  }

  /**
   * Set the value (a typed array) of an attribute.
   * 
   * @param {String} name The name of the attribute. 
   * @param {number[]|Array|Float32Array} data A typed array containing the attribute values.
   */
  setAttribute(name, data) {
    this.geometry.addAttribute(name, data);
  }

  /**
   * Get the value of an attribute (usually a typed array).
   * 
   * @param {String} name The name of the attribute.
   * @returns {number[]|Array|Float32Array} Usually, a typed array containing the attribute values.
   */
  getAttribute(name) {
    return this.geometry.attributes[name].data;
  }

  /**
   * Update a the value of an attribute at a specific index and marks the attribute as stale.
   * 
   * @param {String} name The name of the attribute.
   * @param {Number} index The index of the value to be updated.
   * @param {number[]|Array|Float32Array} value Usually, a typed array or array with the length of the attribute values (3 for x, y, z coordinates) containing the new values.
   */
  updateAttribute(name, index, value) {
    let attr = this.geometry.attributes[name];

    let j = index * attr.attributeLength;

    for (let i = 0; i < attr.attributeLength; i++) {
      attr.data[j + i] = value[i] || attr.data[j + i];
    }

    attr.stale = true;
  }

  /**
   * Updates all the values in the attribute and marks the attribute as stale.
   * 
   * @param {String} name The name of the attribute.
   * @param {number[]|Array|Float32Array} values A typed array containing the new attribute values.
   */
  updateAttributeAll(name, values) {
    let attr = this.geometry.attributes[name];

    for (let i = 0; i < attr.data.length; i++) {
      attr.data[i] = values[i];
    }

    attr.stale = true;
  }

  /**
   * Calls the draw method of the underlying geometry.
   */
  draw() {
    this.geometry.draw(this.renderer);
  }

  /**
   * Destructor for the helper (mainly used for OctreeHelpers to clean up events).
   */
  destruct() {

  }
}

module.exports = HelperBase