Lore.HelperBase = function(renderer, geometryName, shaderName) {
    Lore.Node.call(this);

    this.renderer = renderer;
    this.shader = Lore.Shaders[shaderName];
    this.program = this.renderer.createProgram(this.shader);
    this.geometry = this.renderer.createGeometry(geometryName, this.program);
}

Lore.HelperBase.prototype = Object.assign(Object.create(Lore.Node.prototype), {
    constructor: Lore.HelperBase,

    setAttribute: function(name, data) {
        this.geometry.addAttribute(name, data);
    },

    draw: function() {
        this.geometry.draw(this.renderer);
    }
});
