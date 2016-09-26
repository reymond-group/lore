Lore.PointHelper = function(renderer, geometryName, shaderName) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);

    this.geometry.setMode(Lore.DrawModes.points);
}

Lore.PointHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.PointHelper,

    setPositions: function(positions) {
        this.setAttribute('position', positions);
    },

    setColors: function(colors) {
        this.setAttribute('color', colors);
    }
});
