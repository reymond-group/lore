//@ts-check

const HelperBase = require('./HelperBase');
const DrawModes = require('../Core/DrawModes')
const Color = require('../Core/Color');
const Utils = require('../Utils/Utils');

class TreeHelper extends HelperBase {

  constructor(renderer, geometryName, shaderName, options) {
    super(renderer, geometryName, shaderName);

    this.defaults = {
      pointScale: 1.0,
      maxPointSize: 100.0
    }

    this.opts = Utils.extend(true, this.defaults, options);
    this.indices = null;
    this.geometry.setMode(DrawModes.lines);
    this.initPointSize();
    this.filters = {};
  }

  getMaxLength(x, y, z) {
    return Math.max(x.length, Math.max(y.length, z.length));
  }

  setPositions(positions) {
    this.setAttribute('position', positions);
  }

  setPositionsXYZ(x, y, z) {
    const length = x.length;
    let positions = new Float32Array(length * 3);

    for (let i = 0; i < length; i++) {
      let j = 3 * i;

      positions[j] = x[i] || 0;
      positions[j + 1] = y[i] || 0;
      positions[j + 2] = z[i] || 0;
    }

    this.setAttribute('position', positions);
  }

  /**
   * Set the positions (XYZ), the color (RGB) and size (S) of the points.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {Number[]|Array|Float32Array} r An array containing the r components.
   * @param {Number[]|Array|Float32Array} g An array containing the g components.
   * @param {Number[]|Array|Float32Array} b An array containing the b components.
   * @param {Number} [s=1.0] The size of the points.
   * @returns {TreeHelper} Itself.
   */
  setXYZRGBS(x, y, z, r, g, b, s = 1.0) {
    const length = r.length;
    let c = new Float32Array(length);

    for (var i = 0; i < length; i++) {
      c[i] = Color.rgbToFloat(r[i], g[i], b[i]);
    }

    this._setValues(x, y, z, c, s);
    return this;
  }

  /**
   * Set the positions (XYZ), the color (RGB) and size (S) of the points.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {String} hex A hex value.
   * @param {Number} [s=1.0] The size of the points.
   * @returns {TreeHelper} Itself.
   */
  setXYZHexS(x, y, z, hex, s = 1.0) {
    const length = x.length;
    let c = new Float32Array(length);
    let floatColor = Color.hexToFloat(hex);
    for (var i = 0; i < length; i++) {
      c[i] = floatColor;
    }

    this._setValues(x, y, z, c, s);
    return this;
  }

  /**
   * Set the positions (XYZ), the hue (H) and size (S) of the points.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {Number[]|Array|Float32Array|Number} [h=1.0] The hue as a number or an array.
   * @param {Number[]|Array|Float32Array|Number} [s=1.0] The size of the points.
   * @returns {TreeHelper} Itself.
   */
  setXYZHS(x, y, z, h = 1.0, s = 1.0) {
    const length = x.length;
    let c = new Float32Array(length);
    
    if (typeof h !== 'number') {
      for (var i = 0; i < length; i++) {
        c[i] = Color.hslToFloat(h[i]);
      }
    } else if (typeof h) {
      h = Color.hslToFloat(h);
      for (var i = 0; i < length; i++) {
        c[i] = h;
      }
    }

    this._setValues(x, y, z, c, s);
    return this;
  }

  // TODO: Get rid of saturation
  _setValues(x, y, z, c, s) {
    let length = this.getMaxLength(x, y, z);
    let saturation = new Float32Array(length);

    for (var i = 0; i < length; i++) {
      saturation[i] = 0.0;
    }

    if (typeof s === 'number') {
      let tmpSize = new Float32Array(length);
      for (var i = 0; i < length; i++) {
        tmpSize[i] = s;
      }
      s = tmpSize;
    }

    this.setPositionsXYZ(x, y, z);
    this.setHSSFromArrays(c, saturation, s);

    // TODO: Check why the projection matrix update is needed
    this.renderer.camera.updateProjectionMatrix();
    this.renderer.camera.updateViewMatrix();

    return this;
  }

  setPositionsXYZHSS(x, y, z, hue, saturation, size) {
    console.warn('The method "setPositionsXYZHSS" is marked as deprecated.');
    let length = this.getMaxLength(x, y, z);

    this.setPositionsXYZ(x, y, z, length);
    this.setHSS(hue, saturation, size, length);
  }

  setColors(colors) {
    this.setAttribute('color', colors);
  }

  updateColors(colors) {
    this.updateAttributeAll('color', colors);
  }

  updateColor(index, color) {
    this.updateAttribute('color', index, color.components);
  }

  setPointSize(size) {
    if (size * this.opts.pointScale > this.opts.maxPointSize) {
      return;
    }

    this.geometry.shader.uniforms.size.value = size * this.opts.pointScale;
  }

  getPointSize() {
    return this.geometry.shader.uniforms.size.value;
  }

  setFogDistance(fogStart, fogEnd) {
    console.warn('This function is deprecated.');
    // this.geometry.shader.uniforms.fogStart.value = fogStart;
    // this.geometry.shader.uniforms.fogEnd.value = fogEnd;
  }

  initPointSize() {
    this.geometry.shader.uniforms.size.value = this.renderer.camera.zoom * this.opts.pointScale;
  }

  getCutoff() {
    return this.geometry.shader.uniforms.cutoff.value;
  }

  setCutoff(cutoff) {
    this.geometry.shader.uniforms.cutoff.value = cutoff;
  }

  getHue(index) {
    let colors = this.getAttribute('color');

    return colors[index * 3];
  }

  setHSS(hue, saturation, size, length) {
    let c = new Float32Array(length * 3);

    for (let i = 0; i < length * 3; i += 3) {
      c[i] = hue;
      c[i + 1] = saturation;
      c[i + 2] = size;
    }

    this.setColors(c);
  }

  /**
   * Sets the fog colour and it's density, as seen from the camera.
   * 
   * @param {Array} color An array defining the rgba values of the fog colour.
   * @param {Number} fogDensity The density of the fog.
   * @returns {TreeHelper} Itself.
   */
  setFog(color, fogDensity = 6.0) {
    if (!this.geometry.shader.uniforms.clearColor || !this.geometry.shader.uniforms.fogDensity) {
      console.warn('Shader "' + this.geometry.shader.name + '" does not support fog.');
      return this;
    }

    this.geometry.shader.uniforms.clearColor.value = color;
    this.geometry.shader.uniforms.fogDensity.value = fogDensity;

    return this;
  }

  /**
   * Set the HSS values.
   * 
   * @param {Number[]|Array|Float32Array} hue An array of hue values.
   * @param {Number[]|Array|Float32Array} saturation An array of saturation values.
   * @param {Number[]|Array|Float32Array} size An array of size values.
   */
  setHSSFromArrays(hue, saturation, size) {
    let length = hue.length;
    let c = new Float32Array(length * 3);
    let index = 0;

    if (hue.length !== length && saturation.length !== length && size.length !== length) {
      throw 'Hue, saturation and size have to be arrays of length "length" (' + length + ').';
    }

    for (let i = 0; i < length * 3; i += 3) {
      c[i] = hue[index];
      c[i + 1] = saturation[index];
      c[i + 2] = size[index];

      index++;
    }

    this.setColors(c);
  }

  addFilter(name, filter) {
    filter.setGeometry(this.geometry);
    this.filters[name] = filter;
  }

  removeFilter(name) {
    delete this.filters[name];
  }

  getFilter(name) {
    return this.filters[name];
  }
}

module.exports = TreeHelper