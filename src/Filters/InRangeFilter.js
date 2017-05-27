/** 
 * A class representing an In-Range-Filter. It is used to filter a geometry based on a min and max value. 
 * @property {number} min The minimum value.
 * @property {number} max The maximum value.
 * */
Lore.InRangeFilter = class InRangeFilter extends Lore.FilterBase {
    /**
     * Creates an instance of InRangeFilter.
     * @param {string} attribute The name of the attribute to filter on.
     * @param {number} attributeIndex The attribute-index to filter on.
     * @param {number} min The minum value.
     * @param {number} max The maximum value.
     */
    constructor(attribute, attributeIndex, min, max) {
        super(attribute, attributeIndex);

        this.min = min;
        this.max = max;
    }

    /**
     * Get the minimum.
     * 
     * @returns {number} The minimum.
     */
    getMin() {
        return this.min;
    }

    /**
     * Set the minimum.
     * 
     * @param {number} value The minimum.
     */
    setMin(value) {
        this.min = value;
    }

    /**
     * Get the maximum.
     * 
     * @returns {number} The maximum.
     */
    getMax() {
        return this.max;
    }

    /**
     * Set the maximum.
     * 
     * @param {number} value The maximum.
     */
    setMax(value) {
        this.max = value;
    }

    /**
     * Execute the filter operation on the specified attribute and attribute-index. In order to filter, the HSS size value (attribute-index 2 of the color attribute) is set to its negative (1.0 -> -1.0, 2.5 -> -2.5).
     */
    filter() {
        let attribute = this.geometry.attributes[this.attribute];

        for (let i = 0; i < attribute.data.length; i += attribute.attributeLength) {
            let value = attribute.data[i + this.attributeIndex];
            let size = this.geometry.attributes['color'].data[i + 2];
            if(value > this.max || value < this.min) {
                this.geometry.attributes['color'].data[i + 2] = -Math.abs(size);
            } else {
                this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
            }
        }

        this.geometry.updateAttribute('color');
    }

    /**
     * Resets the filter ("removes" it). The HSS size value is set back to its original value (-1.0 -> 1.0, -2.5 -> 2.5). 
     */
    reset() {
        let attribute = this.geometry.attributes[this.attribute];

        for (let i = 0; i < attribute.data.length; i += attribute.attributeLength) {
            let size = this.geometry.attributes['color'].data[i + 2];
            this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
        }

        this.geometry.updateAttribute('color');
    } 
}
