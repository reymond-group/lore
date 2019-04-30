//@ts-check

const DrawModes = require('./DrawModes');
const Attribute = require('./Attribute');
const Matrix4f = require('../Math/Matrix4f');
const Node = require('./Node');

/** 
 * A class representing a geometry.
 * 
 * @property {String} type The type name of this object (Lore.Geometry).
 * @property {String} name The name of this geometry.
 * @property {WebGLRenderingContext} gl A WebGL rendering context.
 * @property {Shader} shader An initialized shader.
 * @property {Object} attributes A map mapping attribute names to Lore.Attrubute objects.
 * @property {DrawMode} [drawMode=gl.POINTS] The current draw mode of this geometry.
 * @property {Boolean} isVisisble A boolean indicating whether or not this geometry is currently visible.
 */
class Geometry extends Node {
  constructor(name, gl, shader) {
      super();

      this.type = 'Lore.Geometry';
      this.name = name;
      this.gl = gl;
      this.shader = shader;
      this.attributes = {};
      this.drawMode = this.gl.POINTS;
      this.isVisible = true;
      this.stale = false;
  }

  addAttribute(name, data, length) {
      this.attributes[name] = new Attribute(data, length, name);
      this.attributes[name].createBuffer(this.gl, this.shader.program);

      return this;
  }

  updateAttribute(name, data) {
      if (data) {
          this.attributes[name].data = data;
      }

      this.attributes[name].update(this.gl);

      return this;
  }

  getAttribute(name) {
      return this.attributes[name];
  }

  removeAttribute(name) {
      delete this.attributes[name];

      return this;
  }

  setMode(drawMode) {
      switch (drawMode) {
      case DrawModes.points:
          this.drawMode = this.gl.POINTS;
          break;
      case DrawModes.lines:
          this.drawMode = this.gl.LINES;
          break;
      case DrawModes.lineStrip:
          this.drawMode = this.gl.LINE_STRIP;
          break;
      case DrawModes.lineLoop:
          this.drawMode = this.gl.LINE_LOOP;
          break;
      case DrawModes.triangles:
          this.drawMode = this.gl.TRIANGLES;
          break;
      case DrawModes.triangleStrip:
          this.drawMode = this.gl.TRIANGLE_STRIP;
          break;
      case DrawModes.triangleFan:
          this.drawMode = this.gl.TRIANGLE_FAN;
          break;
      }

      return this;
  }

  size() {
      // Is this ok? All attributes should have the same length ...
      if (Object.keys(this.attributes).length > 0) {
          return this.attributes[Object.keys(this.attributes)[0]].size;
      }

      return 0;
  }

  hide() {
      this.isVisible = false;
  }

  show() {
      this.isVisible = true;
      this.stale = true;
  }

  draw(renderer) {
      if (!this.isVisible) return;

      for (let prop in this.attributes)
          if (this.attributes[prop].stale) this.attributes[prop].update(this.gl);

      this.shader.use();

      // Update the modelView and projection matrices
      if (renderer.camera.isProjectionMatrixStale || this.stale) {
          this.shader.uniforms.projectionMatrix.setValue(renderer.camera.getProjectionMatrix());
      }

      if (renderer.camera.isViewMatrixStale || this.stale) {
          let modelViewMatrix = Matrix4f.multiply(renderer.camera.viewMatrix, this.modelMatrix);
          this.shader.uniforms.modelViewMatrix.setValue(modelViewMatrix.entries);
      }

      this.shader.updateUniforms();

      for (let prop in this.attributes) {
          this.attributes[prop].bind(this.gl);
      }

      this.gl.drawArrays(this.drawMode, 0, this.size());
      this.stale = false;
  }
}

module.exports = Geometry