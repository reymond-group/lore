Lore.FilterBase = class FilterBase {

    constructor(attribute, attributeIndex) {
        this.type = 'Lore.FilterBase';
        this.geometry = null;
        this.attribute = attribute;
        this.attributeIndex = attributeIndex;
        this.active = false;
    }

    getGeometry() {
        return this.geometry;
    }

    setGeometry(value) {
        this.geometry = value;
    }

    filter() {

    }

    static isVisible(geometry, index) {
        return geometry.attributes['color'].data[index * 3 + 2] > 0.0;
    }
}
