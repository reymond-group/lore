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
        var attribute = this.geometry.attributes[this.attribute];

        for(var i = 0; i < attribute.data.length; i += attribute.attributeLength) {
            var value = attribute.data[i + this.attributeIndex];
            var size = this.geometry.attributes['color'].data[i + 2];
            if(value > this.max || value < this.min)
                this.geometry.attributes['color'].data[i + 2] = -Math.abs(size);
            else
                this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
        }

        this.geometry.updateAttribute('color');
    },

    reset: function() {
        var attribute = this.geometry.attributes[this.attribute];

        for(var i = 0; i < attribute.data.length; i += attribute.attributeLength) {
            var size = this.geometry.attributes['color'].data[i + 2];
            this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
        }

        this.geometry.updateAttribute('color');
    } 
});
