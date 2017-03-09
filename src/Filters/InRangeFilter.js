Lore.InRangeFilter = class InRangeFilter extends Lore.FilterBase {
    constructor(attribute, attributeIndex, min, max) {
        super(attribute, attributeIndex);

        this.min = min;
        this.max = max;
    }

    getMin() {
        return this.min;
    }

    setMin(value) {
        this.min = value;
    }

    getMax() {
        return this.max;
    }

    setMax(value) {
        this.max = value;
    }

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

    reset() {
        let attribute = this.geometry.attributes[this.attribute];

        for (let i = 0; i < attribute.data.length; i += attribute.attributeLength) {
            let size = this.geometry.attributes['color'].data[i + 2];
            this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
        }

        this.geometry.updateAttribute('color');
    } 
}
