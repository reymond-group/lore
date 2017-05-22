/** The base class for helper classes. */
Lore.HelperBase = class HelperBase extends Lore.Node {
    /**
     * Creates an instance of HelperBase.
     * 
     * @param {Lore.Renderer} renderer A Lore.Renderer object.
     * @param {string} geometryName The name of this geometry.
     * @param {string} shaderName The name of the shader used to render the geometry.
     */
    constructor(renderer, geometryName, shaderName) {
        super();
        this.renderer = renderer;
        this.shader = Lore.Shaders[shaderName];
        this.geometry = this.renderer.createGeometry(geometryName, shaderName);
    }

    /**
     * Set the value (a typed array) of an attribute.
     * 
     * @param {string} name The name of the attribute. 
     * @param {TypedArray} data A typed array containing the attribute values.
     */
    setAttribute(name, data) {
        this.geometry.addAttribute(name, data);
    }

    /**
     * Get the value of an attribute (usually a typed array).
     * 
     * @param {string} name The name of the attribute.
     * @returns {any} Usually, a typed array containing the attribute values.
     */
    getAttribute(name) {
        return this.geometry.attributes[name].data;
    }

    /**
     * Update a the value of an attribute at a specific index and marks the attribute as stale.
     * 
     * @param {string} name The name of the attribute.
     * @param {number} index The index of the value to be updated.
     * @param {any} value Usually, a typed array or array with the length of the attribute values (3 for x, y, z coordinates) containing the new values.
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
     * @param {string} name The name of the attribute.
     * @param {TypedArray} values A typed array containing the new attribute values.
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
}
