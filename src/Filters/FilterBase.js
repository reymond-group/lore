Lore.FilterBase = function(attribute, attributeIndex) {
    this.type = 'Lore.FilterBase';
    this.geometry = null;
    this.attribute = attribute;
    this.attributeIndex = attributeIndex;
    this.active = false;
}

Lore.FilterBase.prototype = {
    constructor: Lore.FilterBase,

    filter: function() {

    }
}


Lore.FilterBase.isVisible = function(geometry, index) {
    return geometry.attributes['color'].data[index * 3 + 2] > 0.0;
}

