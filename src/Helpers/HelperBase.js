Lore.HelperBase = class HelperBase extends Lore.Node {
    constructor(renderer, geometryName, shaderName) {
        super();
        this.renderer = renderer;
        this.shader = Lore.Shaders[shaderName];
        this.geometry = this.renderer.createGeometry(geometryName, shaderName);
    }

    setAttribute(name, data) {
        this.geometry.addAttribute(name, data);
    }

    getAttribute(name) {
        return this.geometry.attributes[name].data;
    }

    updateAttribute(name, index, value) {
        let attr = this.geometry.attributes[name];

        let j = index * attr.attributeLength;

        for (let i = 0; i < attr.attributeLength; i++) {
            attr.data[j + i] = value[i] || attr.data[j + i];
        }

        attr.stale = true;
    }


    updateAttributeAll(name, values) {
        let attr = this.geometry.attributes[name];

        for (let i = 0; i < attr.data.length; i++) {
            attr.data[i] = values[i];
        }

        attr.stale = true;
    }

    draw() {
        this.geometry.draw(this.renderer);
    }
}
