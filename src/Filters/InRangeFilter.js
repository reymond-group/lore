Lore.InRangeFilter = function(attribute, attributeIndex, min, max) {
    Lore.FilterBase.call(this, attribute, attributeIndex);
    this.min = min;
    this.max = max;
}

Lore.InRangeFilter.prototype = Object.assign(Object.create(Lore.FilterBase.prototype), {
    constructor: Lore.InRangeFilter,

    getMin: function() {
        return this.min;
    },

    setMin: function(value) {
        this.min = value;
    },

    getMax: function() {
        return this.max;
    },

    setMax: function(value) {
        this.max = value;
    },

    filter: function() {
        let attribute = this.geometry.attributes[this.attribute];

        for(let i = 0; i < attribute.data.length; i += attribute.attributeLength) {
            let value = attribute.data[i + this.attributeIndex];
            let size = this.geometry.attributes['color'].data[i + 2];
            if(value > this.max || value < this.min)
                this.geometry.attributes['color'].data[i + 2] = -Math.abs(size);
            else
                this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
        }

        this.geometry.updateAttribute('color');
    },

    reset: function() {
        let attribute = this.geometry.attributes[this.attribute];

        for(let i = 0; i < attribute.data.length; i += attribute.attributeLength) {
            let size = this.geometry.attributes['color'].data[i + 2];
            this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
        }

        this.geometry.updateAttribute('color');
    } 
});
