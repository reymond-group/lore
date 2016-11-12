Lore.AABBHelper = function(renderer, aabbs, shaderName, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);

    // Create lines
    // Replaced with indexed?

    var p = new Float32Array(aabbs.length * 24 * 3);
    var c = new Float32Array(aabbs.length * 24 * 3);

    var index = 0;

    for(var i = 0; i < aabbs.length; i++) {
        var aabb = aabbs[0];
        var cx = aabb.center.components[0];
        var cy = aabb.center.components[1];
        var cz = aabb.center.components[2];
        var r = aabb.radius;

        var p0 = [ cx - r, cy - r, cz - r ];
        var p1 = [ cx - r, cy - r, cz + r ];
        var p2 = [ cx - r, cy + r, cz - r ];
        var p3 = [ cx - r, cy + r, cz + r ];
        var p4 = [ cx + r, cy - r, cz - r ];
        var p5 = [ cx + r, cy - r, cz + r ];
        var p6 = [ cx + r, cy + r, cz - r ];
        var p7 = [ cx + r, cy + r, cz + r ];

        p[index++] = p0[0]; p[index++] = p0[1]; p[index++] = p0[2];
        p[index++] = p1[0]; p[index++] = p1[1]; p[index++] = p1[2];
        p[index++] = p0[0]; p[index++] = p0[1]; p[index++] = p0[2];
        p[index++] = p2[0]; p[index++] = p2[1]; p[index++] = p2[2];
        p[index++] = p0[0]; p[index++] = p0[1]; p[index++] = p0[2];
        p[index++] = p4[0]; p[index++] = p4[1]; p[index++] = p4[2];

        p[index++] = p1[0]; p[index++] = p1[1]; p[index++] = p1[2];
        p[index++] = p3[0]; p[index++] = p3[1]; p[index++] = p3[2];
        p[index++] = p1[0]; p[index++] = p1[1]; p[index++] = p1[2];
        p[index++] = p5[0]; p[index++] = p5[1]; p[index++] = p5[2];

        p[index++] = p2[0]; p[index++] = p2[1]; p[index++] = p2[2];
        p[index++] = p3[0]; p[index++] = p3[1]; p[index++] = p3[2];
        p[index++] = p2[0]; p[index++] = p2[1]; p[index++] = p2[2];
        p[index++] = p6[0]; p[index++] = p6[1]; p[index++] = p6[2];

        p[index++] = p3[0]; p[index++] = p3[1]; p[index++] = p3[2];
        p[index++] = p7[0]; p[index++] = p7[1]; p[index++] = p7[2];

        p[index++] = p4[0]; p[index++] = p4[1]; p[index++] = p4[2];
        p[index++] = p5[0]; p[index++] = p5[1]; p[index++] = p5[2];
        p[index++] = p4[0]; p[index++] = p4[1]; p[index++] = p4[2];
        p[index++] = p6[0]; p[index++] = p6[1]; p[index++] = p6[2];

        p[index++] = p5[0]; p[index++] = p5[1]; p[index++] = p5[2];
        p[index++] = p7[0]; p[index++] = p7[1]; p[index++] = p7[2];

        p[index++] = p6[0]; p[index++] = p6[1]; p[index++] = p6[2];
        p[index++] = p7[0]; p[index++] = p7[1]; p[index++] = p7[2];
    }


    
    this.opts = Lore.Utils.extend(true, Lore.AABBHelper.defaults, options);
    this.geometry.setMode(Lore.DrawModes.lines);

    this.setAttribute('position', p);
    this.setAttribute('color', c);
}

Lore.AABBHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.AABBHelper,

    
});

Lore.AABBHelper.defaults = {

}
