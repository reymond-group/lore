//@ts-check

const HelperBase = require('./HelperBase');
const DrawModes = require('../Core/DrawModes')
const Color = require('../Core/Color');
const Utils = require('../Utils/Utils');
const Vector3f = require('../Math/Vector3f');
const AABB = require('../Spice/AABB');
const Octree = require('../Spice/Octree');
const FilterBase = require('../Filters/FilterBase');

/** 
 * A helper class wrapping a point cloud.
 * 
 * @property {Object} opts An object containing options.
 * @property {Number[]} indices Indices associated with the data.
 * @property {Octree} octree The octree associated with the point cloud.
 * @property {OctreeHelper} octreeHelper The octreeHelper associated with the pointHelper.
 * @property {Object} filters A map mapping filter names to Lore.Filter instances associated with this helper class.
 * @property {Number} pointSize The scaled and constrained point size of this data.
 * @property {Number} pointScale The scale of the point size.
 * @property {Number} rawPointSize The point size before scaling and constraints.
 * @property {Object} dimensions An object with the properties min and max, each a 3D vector containing the extremes.
 */
class PointHelper extends HelperBase {
  /**
   * Creates an instance of PointHelper.
   * @param {Renderer} renderer An instance of Lore.Renderer.
   * @param {String} geometryName The name of this geometry.
   * @param {String} shaderName The name of the shader used to render the geometry.
   * @param {Object} options An object containing options.
   */
  constructor(renderer, geometryName, shaderName, options) {
    super(renderer, geometryName, shaderName);

    let defaults = {
      octree: true,
      octreeThreshold: 500.0,
      octreeMaxDepth: 8,
      pointScale: 1.0,
      maxPointSize: 100.0
    };

    this.opts = Utils.extend(true, defaults, options);
    this.indices = null;
    this.octree = null;
    this.octreeHelper = null;
    this.geometry.setMode(DrawModes.points);
    this.initPointSize();
    this.filters = {};
    this.pointScale = this.opts.pointScale;
    this.rawPointSize = 1.0;
    this.pointSize = this.rawPointSize * this.pointScale;

    this.dimensions = {
      min: new Vector3f(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
      max: new Vector3f(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    };

    let that = this;
    this._zoomchangedHandler = function (zoom) {
      let threshold = that.setPointSize(zoom + 0.1);
      if (that.octreeHelper) {
        that.octreeHelper.setThreshold(threshold);
      }
    };

    renderer.controls.addEventListener('zoomchanged', this._zoomchangedHandler);
  }

  /**
   * Get the max length of the length of three arrays.
   * 
   * @param {Number[]|Array|Float32Array} x 
   * @param {Number[]|Array|Float32Array} y 
   * @param {Number[]|Array|Float32Array} z 
   * @returns {Number} The length of the largest array.
   */
  getMaxLength(x, y, z) {
    return Math.max(x.length, Math.max(y.length, z.length));
  }

  /**
   * Returns an object containing the dimensions of this point cloud.
   * 
   * @returns {Object} An object with the properties min and max, each a 3D vector containing the extremes.
   */
  getDimensions() {
    return this.dimensions;
  }

  /**
   * Get the center (average) of the point cloud.
   * 
   * @returns {Vector3f} The center (average) of the point cloud.
   */
  getCenter() {
    return new Vector3f((this.dimensions.max.getX() + this.dimensions.min.getX()) / 2.0,
      (this.dimensions.max.getY() + this.dimensions.min.getY()) / 2.0,
      (this.dimensions.max.getZ() + this.dimensions.min.getZ()) / 2.0);
  }

  /**
   * Gets the distance between the center and the point furthest from the center.
   * 
   * @return {Number} The maximal radius.
   */
  getMaxRadius() {
    let center = this.getCenter();
    return center.subtract(this.dimensions.max).length();
  }

  /**
   * Set the positions of points in this point cloud.
   * 
   * @param {Number[]|Array|Float32Array} positions The positions (linear array).
   * @returns {PointHelper} Itself.
   */
  setPositions(positions) {
    // Min, max will NOT be calculated as of now!
    // TODO?

    this.setAttribute('position', positions);

    return this;
  }

  /**
   * Set the positions of points in this point clouds.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @returns {PointHelper} Itself.
   */
  setPositionsXYZ(x, y, z) {
    const length = x.length;
    let positions = new Float32Array(length * 3);

    for (var i = 0; i < length; i++) {
      let j = 3 * i;

      positions[j] = x[i] || 0;
      positions[j + 1] = y[i] || 0;
      positions[j + 2] = z[i] || 0;

      if (x[i] > this.dimensions.max.getX()) {
        this.dimensions.max.setX(x[i]);
      }

      if (x[i] < this.dimensions.min.getX()) {
        this.dimensions.min.setX(x[i]);
      }

      if (y[i] > this.dimensions.max.getY()) {
        this.dimensions.max.setY(y[i]);
      }

      if (y[i] < this.dimensions.min.getY()) {
        this.dimensions.min.setY(y[i]);
      }

      if (z[i] > this.dimensions.max.getZ()) {
        this.dimensions.max.setZ(z[i]);
      }

      if (z[i] < this.dimensions.min.getZ()) {
        this.dimensions.min.setZ(z[i]);
      }
    }

    if (this.opts.octree) {
      let initialBounds = AABB.fromPoints(positions);
      let indices = new Uint32Array(length);

      for (var i = 0; i < length; i++) {
        indices[i] = i;
      }

      this.octree = new Octree(this.opts.octreeThreshold, this.opts.octreeMaxDepth);
      this.octree.build(indices, positions, initialBounds);
    }

    this.setAttribute('position', positions);

    return this;
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
   * @returns {PointHelper} Itself.
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
   * @returns {PointHelper} Itself.
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
   * @returns {PointHelper} Itself.
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

  /**
   * Set the positions and the HSS (Hue, Saturation, Size) values of the points in the point cloud.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {Number[]|Array|Float32Array|Number} hue An array containing the hues of the data points.
   * @param {Number[]|Array|Float32Array|Number} saturation An array containing the saturations of the data points.
   * @param {Number[]|Array|Float32Array|Number} size An array containing the sizes of the data points.
   * @returns {PointHelper} Itself.
   */
  setPositionsXYZHSS(x, y, z, hue, saturation, size) {
    console.warn('The method "setPositionsXYZHSS" is marked as deprecated.');
    let length = this.getMaxLength(x, y, z);
    saturation = new Float32Array(length);

    for (var i = 0; i < length; i++) {
      saturation[i] = 0.0;
    }

    if (typeof size === 'number') {
      let tmpSize = new Float32Array(length);
      for (var i = 0; i < length; i++) {
        tmpSize[i] = size;
      }
      size = tmpSize;
    }

    this.setPositionsXYZ(x, y, z);

    if (typeof hue === 'number' && typeof saturation === 'number' && typeof size === 'number') {
      let rgb = Color.hslToRgb(hue, 1.0, 0.5);
      this.setHSS(Color.rgbToFloat(rgb[0], rgb[1], rgb[2]), saturation, size, length);
    } else if (typeof hue !== 'number' && typeof saturation !== 'number' && typeof size !== 'number') {
      for (var i = 0; i < hue.length; i++) {
        let rgb = Color.hslToRgb(hue[i], 1.0, 0.5);
        hue[i] = Color.rgbToFloat(rgb[0], rgb[1], rgb[2]);
      }
      this.setHSSFromArrays(hue, saturation, size);
    } else {
      if (typeof hue === 'number') {
        let hueTmp = new Float32Array(length);
        let rgb = Color.hslToRgb(hue, 1.0, 0.5);
        hueTmp.fill(Color.rgbToFloat(rgb[0], rgb[1], rgb[2]));
        hue = hueTmp;
      } else if (typeof hue !== 'number') {
        for (var i = 0; i < hue.length; i++) {
          let rgb = Color.hslToRgb(hue[i], 1.0, 0.5);
          hue[i] = Color.rgbToFloat(rgb[0], rgb[1], rgb[2]);
        }
        this.setHSSFromArrays(hue, saturation, size);
      }

      if (typeof saturation === 'number') {
        let saturationTmp = new Float32Array(length);
        saturationTmp.fill(saturation);
        saturation = saturationTmp;
      }

      if (typeof size === 'number') {
        let sizeTmp = new Float32Array(length);
        sizeTmp.fill(size);
        size = sizeTmp;
      }

      this.setHSSFromArrays(hue, saturation, size);
    }

    // TODO: Check why the projection matrix update is needed
    this.renderer.camera.updateProjectionMatrix();
    this.renderer.camera.updateViewMatrix();

    return this;
  }
  

  /**
   * Set the colors (HSS) for the points.
   * 
   * @param {Number[]|Array|Float32Array} colors An array containing the HSS values.
   * @returns {PointHelper} Itself.
   */
  setColors(colors) {
    this.setAttribute('color', colors);

    return this;
  }

  /**
   * Update the colors (HSS) for the points.
   * 
   * @param {Number[]|Array|Float32Array} colors An array containing the HSS values.
   * @returns {PointHelper} Itself.
   */
  updateColors(colors) {
    this.updateAttributeAll('color', colors);

    return this;
  }

  /**
   * Update the color (HSS) at a specific index.
   * 
   * @param {Number} index The index of the data point.
   * @param {Color} color An instance of Lore.Color containing HSS values.
   * @returns {PointHelper} Itself.
   */
  updateColor(index, color) {
    console.warn('The method "updateColor" is marked as deprecated.');
    this.updateAttribute('color', index, color.components);

    return this;
  }
  

  /**
   * Update the color (HSS) at a specific index.
   * 
   * @param {Number} index The index of the data point.
   * @param {Color} color An instance of Lore.Color containing HSS values.
   * @returns {PointHelper} Itself.
   */
  setColor(index, color) {
    let c = new Color(color.toFloat(), this.getSaturation(index), this.getSize(index));
    this.updateAttribute('color', index, c.components);

    return this;
  }

  /**
   * Set the global point size.
   * 
   * @param {Number} size The global point size.
   * @returns {Number} The threshold for the raycaster.
   */
  setPointSize(size) {
    this.rawPointSize = size;

    this.updatePointSize();

    let pointSize = this.rawPointSize * this.opts.pointScale;

    if (pointSize > this.opts.maxPointSize) {
      return 0.5 * (this.opts.maxPointSize / pointSize);
    } else {
      return 0.5;
    }
  }

  /**
   * Updates the displayed point size.
   */
  updatePointSize() {
    let pointSize = this.rawPointSize * this.opts.pointScale;

    if (pointSize > this.opts.maxPointSize) {
      this.pointSize = this.opts.maxPointSize;
    } else {
      this.pointSize = pointSize;
    }

    this.geometry.shader.uniforms.size.value = this.pointSize;
  }

  /**
   * Get the global point size.
   * 
   * @returns {Number} The global point size.
   */
  getPointSize() {
    return this.geometry.shader.uniforms.size.value;
  }

  /**
   * Get the global point scale.
   * 
   * @returns {Number} The global point size.
   */
  getPointScale() {
    return this.opts.pointScale;
  }

  /**
   * Sets the global point scale.
   * 
   * @param {Number} pointScale The global point size.
   * @returns {PointHelper} Itself.
   */
  setPointScale(pointScale) {
    this.opts.pointScale = pointScale;
    this.updatePointSize();

    return this;
  }

  /**
   * Sets the fog colour and it's density, as seen from the camera.
   * 
   * @param {any} color An array or hex string defining the rgba values of the fog colour.
   * @param {Number} fogDensity The density of the fog.
   * @returns {PointHelper} Itself.
   */
  setFog(color, fogDensity = 6.0) {
    if (!this.geometry.shader.uniforms.clearColor || !this.geometry.shader.uniforms.fogDensity) {
      console.warn('Shader "' + this.geometry.shader.name + '" does not support fog.');
      return this;
    }

    // If the color is passed as a string, convert the hex value to an array
    if (typeof color === 'string') {
      let c = Color.fromHex(color);
      color = [c.getR(), c.getG(), c.getB(), 1.0];
    }

    this.geometry.shader.uniforms.clearColor.value = color;
    this.geometry.shader.uniforms.fogDensity.value = fogDensity;

    return this;
  }

  /**
   * Initialize the point size based on the current zoom.
   * 
   * @returns {PointHelper} Itself.
   */
  initPointSize() {
    this.setPointSize(this.renderer.camera.zoom + 0.1);

    return this;
  }

  /**
   * Get the current cutoff value.
   * 
   * @returns {Number} The current cutoff value.
   */
  getCutoff() {
    return this.geometry.shader.uniforms.cutoff.value;
  }

  /**
   * Set the cutoff value.
   * 
   * @param {Number} cutoff A cutoff value.
   * @returns {PointHelper} Itself.
   */
  setCutoff(cutoff) {
    this.geometry.shader.uniforms.cutoff.value = cutoff;

    return this;
  }

  /**
   * Get the hue for a given index.
   * 
   * @param {Number} index An index.
   * @returns {Number} The hue of the specified index.
   */
  getHue(index) {
    console.warn('The method "getHue" is marked as deprecated. Please use "getColor".');
    let colors = this.getAttribute('color');

    return Color.floatToHsl(colors[index * 3]);
  }

   /**
   * Get the color for a given index.
   * 
   * @param {Number} index An index.
   * @returns {Number[]|Array} The color of the specified index in RGB.
   */
  getColor(index) {
    let colors = this.getAttribute('color');

    return Color.floatToRgb(colors[index * 3]);
  }

  /**
   * Get the saturation for a given index.
   * 
   * @param {Number} index An index.
   * @returns {Number} The saturation of the specified index.
   */
  getSaturation(index) {
    let colors = this.getAttribute('color');

    return colors[index * 3 + 1];
  }

  /**
   * Get the size for a given index.
   * 
   * @param {Number} index An index.
   * @returns {Number} The size of the specified index.
   */
  getSize(index) {
    let colors = this.getAttribute('color');

    return colors[index * 3 + 2];
  }

  /**
   * Get the position for a given index.
   * 
   * @param {Number} index An index.
   * @returns {Vector3f} The position of the specified index.
   */
  getPosition(index) {
    let positions = this.getAttribute('position');

    return new Vector3f(positions[index * 3], positions[index * 3 + 1],
      positions[index * 3 + 2]);
  }

  /**
   * Set the hue. If a number is supplied, all the hues are set to the supplied number.
   * 
   * @param {Number[]|Array|Float32Array|Number} hue The hue to be set. If a number is supplied, all hues are set to its value.
   */
  setHue(hue) {
    let colors = this.getAttribute('color');
    let index = 0;

    if (typeof hue === 'number') {
      hue = Color.hslToFloat(hue);

      for (let i = 0; i < colors.length; i++) {
        colors[i * 3] = hue;
      }
    } else {
      for (let i = 0; i < hue.length; i++) {
        colors[i * 3] = Color.hslToFloat(hue[i]);
      }
    }

    this.setColors(colors);
  }

  /**
   * Set the saturation. If a number is supplied, all the saturations are set to the supplied number.
   * 
   * @param {Number[]|Array|Float32Array|Number} saturation The saturation to be set. If a number is supplied, all saturations are set to its value.
   */
  setSaturation(saturation) {
    let colors = this.getAttribute('color');
    let c = null;
    let index = 0;

    if (typeof saturation === 'number') {
      let length = colors.length;

      c = new Float32Array(length * 3);

      for (let i = 0; i < length * 3; i += 3) {
        c[i] = colors[i];
        c[i + 1] = saturation;
        c[i + 2] = colors[i + 2];
      }
    } else {
      let length = saturation.length;

      c = new Float32Array(length * 3);

      for (let i = 0; i < length * 3; i += 3) {
        c[i] = colors[i];
        c[i + 1] = saturation[index++];
        c[i + 2] = colors[i + 2];
      }
    }

    this.setColors(c);
  }

  /**
   * Set the size. If a number is supplied, all the sizes are set to the supplied number.
   * 
   * @param {Number[]|Array|Float32Array|Number} size The size to be set. If a number is supplied, all sizes are set to its value.
   */
  setSize(size) {
    let colors = this.getAttribute('color');
    let c = null;
    let index = 0;

    if (typeof size === 'number') {
      let length = colors.length;

      c = new Float32Array(length * 3);

      for (let i = 0; i < length * 3; i += 3) {
        c[i] = colors[i];
        c[i + 1] = colors[i + 1];
        c[i + 2] = size;
      }
    } else {
      let length = size.length;

      c = new Float32Array(length * 3);

      for (let i = 0; i < length * 3; i += 3) {
        c[i] = colors[i];
        c[i + 1] = colors[i + 1];
        c[i + 2] = size[index++];
      }
    }

    this.setColors(c);
  }

  /**
   * Set the HSS values. Sets all indices to the same values.
   * 
   * @param {Number} hue A hue value.
   * @param {Number} saturation A saturation value.
   * @param {Number} size A size value.
   * @param {Number} length The length of the arrays.
   */
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
   * Set the color from RGB values. Sets all indices to the same values.
   * 
   * @param {Number} r The red colour component.
   * @param {Number} g The green colour component.
   * @param {Number} b The blue colour component.
   */
  setRGB(r, g, b) {
    let c = this.getAttribute('color');

    for (let i = 0; i < c.length; i++) {
      c[i * 3] = Color.rgbToFloat(r, g, b);
    }

    this.setColors(c);
  }

  /**
   * Set the color from RGB values. Sets all indices to the same values.
   * 
   * @param {Number[]|Array|Float32Array} r The red colour component.
   * @param {Number[]|Array|Float32Array} g The green colour component.
   * @param {Number[]|Array|Float32Array} b The blue colour component.
   */
  setRGBFromArrays(r, g, b) {
    const length = Math.min(Math.min(r.length, g.length), b.length);
    let c = this.getAttribute('color');

    for (let i = 0; i < length; i++) {
      c[i * 3] = Color.rgbToFloat(r[i], g[i], b[i]);
    }

    this.setColors(c);
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

  /**
   * Add a filter to this point helper.
   * 
   * @param {String} name The name of the filter.
   * @param {FilterBase} filter A filter instance.
   * @returns {PointHelper} Itself.
   */
  addFilter(name, filter) {
    filter.setGeometry(this.geometry);
    this.filters[name] = filter;

    return this;
  }

  /**
   * Remove a filter by name.
   * 
   * @param {String} name The name of the filter to be removed.
   * @returns {PointHelper} Itself.
   */
  removeFilter(name) {
    delete this.filters[name];

    return this;
  }

  /**
   * Get a filter by name.
   * 
   * @param {String} name The name of a filter.
   * @returns {FilterBase} A filter instance.
   */
  getFilter(name) {
    return this.filters[name];
  }

  /**
   * Hide the geometry associated with this pointHelper.
   */
  show() {
    this.geometry.show();
  }

  /**
   * Show the geometry associated with this pointHelper.
   */
  hide() {
    this.geometry.hide();
  }

  /**
   * Remove eventhandlers from associated controls.
   */
  destruct() {
    this.renderer.controls.removeEventListener('zoomchanged', this._zoomchangedHandler);
  }
}

module.exports = PointHelper