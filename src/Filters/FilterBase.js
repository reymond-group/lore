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

