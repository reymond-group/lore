Lore.HelperBase = function(renderer, geometryName, shaderName) {
    Lore.Node.call(this);

    this.renderer = renderer;
    this.shader = Lore.Shaders[shaderName];
    this.geometry = this.renderer.createGeometry(geometryName, shaderName);
}

Lore.HelperBase.prototype = Object.assign(Object.create(Lore.Node.prototype), {
    constructor: Lore.HelperBase,

    setAttribute: function(name, data) {
        this.geometry.addAttribute(name, data);
    },

    getAttribute: function(name) {
        return this.geometry.attributes[name].data;
    },

    updateAttribute: function(name, index, value) {
        var attr = this.geometry.attributes[name];
        
        var j = index * attr.attributeLength;

        for(var i = 0; i < attr.attributeLength; i++)
            attr.data[j + i] = value[i] || attr.data[j + i];
        
        attr.stale = true;
    },
    

    updateAttributeAll: function(name, values) {
        var attr = this.geometry.attributes[name];
        for(var i = 0; i < attr.data.length; i++)
            attr.data[i] = values[i];

        attr.stale = true;
    },

    draw: function() {
        this.geometry.draw(this.renderer);
    }
});
