Lore.OctreeHelper = function(renderer, geometryName, shaderName, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.OctreeHelper.defaults, options);
    this.geometry.setMode(Lore.DrawModes.lines);
}

Lore.OctreeHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.OctreeHelper,

    
});

Lore.OctreeHelper.defaults = {

}
