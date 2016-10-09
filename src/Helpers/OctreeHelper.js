Lore.OctreeHelper = function(renderer, geometryName, shaderName, octree, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.OctreeHelper.defaults, options);
    this.octree = octree;
    this.raycaster = new Lore.Raycaster();

    var that = this;

    renderer.controls.addEventListener('mousedown', function(e) {
        var mouse = e.e.mouse.normalizedPosition;
        that.raycaster.set(that.renderer.camera, mouse.x, mouse.y);
        console.log(that.octree.raySearch(that.raycaster));
    });

    this.init();
}

Lore.OctreeHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.OctreeHelper,

    init: function() {
        if(this.opts.visualize === 'center')
            this.drawCenters();
        else if(this.opts.visualize === 'cubes')
            this.drawBoxes();
    },


    drawCenters: function() {
        this.geometry.setMode(Lore.DrawModes.points);

        var aabbs = this.octree.aabbs;
        var length = Object.keys(aabbs).length;
        var colors = new Float32Array(length * 3);
        var positions = new Float32Array(length * 3);

        var i = 0;
        for(key in aabbs) {
            var c = aabbs[key].center.components;
            var k = i * 3;
            colors[k] = 1;
            colors[k + 1] = 1;
            colors[k + 2] = 1;

            positions[k] = c[0];
            positions[k + 1] = c[1];
            positions[k + 2] = c[2];

            i++;
        }

        this.setAttribute('position', new Float32Array(positions));
        this.setAttribute('color', new Float32Array(colors));
    },

    drawBoxes: function() {
        this.geometry.setMode(Lore.DrawModes.lines);

        var aabbs = this.octree.aabbs;
        var length = Object.keys(aabbs).length;
        var colors = new Float32Array(length * 24);
        var positions = new Float32Array(length * 24);

        var i = 0;
        for(key in aabbs) {
            var corners = Lore.AABB.getCorners(aabbs[key]);
            for(var j = 0; j < 24; j++) {
                positions[i + j] = corners[j];
                colors[i + j] = 1;
            }

            i += 24;
        }

        this.setAttribute('position', new Float32Array(positions));
        this.setAttribute('color', new Float32Array(colors));
    }
});


Lore.OctreeHelper.defaults = {
    visualize: false
}
