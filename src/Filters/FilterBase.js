//@ts-check

const Geometry = require('../Core/Geometry');

/** 
 * An abstract class representing the base for filter implementations. 
 * 
 * @property {string} type The type name of this object (Lore.FilterBase).
 * @property {Geometry} geometry The Geometry associated with this filter.
 * @property {string} attribute The name of the attribute to filter on.
 * @property {number} attributeIndex The attribute-index to filter on.
 * @property {boolean} active Whether or not the filter is active.
 */
class FilterBase {

    /**
     * Creates an instance of FilterBase.
     * @param {string} attribute The name of the attribute to filter on.
     * @param {number} attributeIndex The attribute-index to filter on.
     */
    constructor(attribute, attributeIndex) {
        this.type = 'Lore.FilterBase';
        this.geometry = null;
        this.attribute = attribute;
        this.attributeIndex = attributeIndex;
        this.active = false;
    }

    /**
     * Returns the geometry associated with this filter.
     * 
     * @returns {Geometry} The geometry associated with this filter.
     */
    getGeometry() {
        return this.geometry;
    }

    /**
     * Sets the geometry associated with this filter.
     * 
     * @param {Geometry} value The geometry to be associated with this filter.
     */
    setGeometry(value) {
        this.geometry = value;
    }

    /**
     * Abstract method. 
     */
    filter() {

    }

    /**
     * Abstract method. 
     */
    reset() {
        
    }

    /**
     * Check whether or not a vertex with a given index is visible. A vertex is visible when its color attribute is > 0.0 at attribute-index 2 (the size in HSS).
     *
     * @param {Geometry} geometry A Lore.Geometry with a color attribute.
     * @param {number} index A vertex index.
     * @returns {boolean} A boolean indicating whether or not the vertex specified by index is visible (HSS size > 0.0).
     */
    static isVisible(geometry, index) {
        return geometry.attributes['color'].data[index * 3 + 2] > 0.0;
    }
}

module.exports = FilterBase