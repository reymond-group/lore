Lore.OctreeHelper = function(renderer, geometryName, shaderName, target, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.OctreeHelper.defaults, options);
    this.eventListeners = {};
    this.target = target;
    this.renderer = renderer;
    this.octree = this.target.octree;
    this.raycaster = new Lore.Raycaster();
    this.hovered = null;
    this.selected = [];

    let that = this;

    renderer.controls.addEventListener('dblclick', function(e) {
        if(e.e.mouse.state.middle || e.e.mouse.state.right) return;
        let mouse = e.e.mouse.normalizedPosition;

        let result = that.getIntersections(mouse);
        
        if(result.length > 0) {
            if(that.selectedContains(result[0].index)) return;
            that.addSelected(result[0]);
        }
    });

    renderer.controls.addEventListener('mousemove', function(e) {
        if(e.e.mouse.state.left || e.e.mouse.state.middle || e.e.mouse.state.right) return;
        let mouse = e.e.mouse.normalizedPosition;
        
        let result = that.getIntersections(mouse);
        
        if(result.length > 0) {
            if(that.hovered && that.hovered.index === result[0].index) return;
            that.hovered = result[0];
            that.hovered.screenPosition = that.renderer.camera.sceneToScreen(result[0].position, renderer);
            that.raiseEvent('hoveredchanged', { e: that.hovered });
        }
        else {
            that.hovered = null;
            that.raiseEvent('hoveredchanged', { e: null });
        }
    });

    renderer.controls.addEventListener('zoomchanged', function(zoom) {
        that.target.setPointSize(zoom * window.devicePixelRatio + 0.1);
    });

    renderer.controls.addEventListener('updated', function() {
        for(let i = 0; i < that.selected.length; i++) 
            that.selected[i].screenPosition = that.renderer.camera.sceneToScreen(that.selected[i].position, renderer);
        
        if(that.hovered)
            that.hovered.screenPosition = that.renderer.camera.sceneToScreen(that.hovered.position, renderer);

        that.raiseEvent('updated');
    });

    this.init();
}

Lore.OctreeHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.OctreeHelper,

    init: function() {
        if(this.opts.visualize === 'centers')
            this.drawCenters();
        else if(this.opts.visualize === 'cubes')
            this.drawBoxes();
        else
            this.geometry.isVisible = false;
    },

    addSelected: function(item) {
        // If item is only the index, create a dummy item
        if (!isNaN(parseFloat(item))) {
            let positions = this.target.geometry.attributes['position'].data;
            let colors = this.target.geometry.attributes['color'].data;
            let k = item * 3;
            item = {
                distance: -1,
                index: item,
                locCode: -1,
                position: new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]),
                color: colors ? [ colors[k], colors[k + 1], colors[k + 2] ] : null
            };
        }

        let index = this.selected.length;
        this.selected.push(item);
        this.selected[index].screenPosition = this.renderer.camera.sceneToScreen(item.position, this.renderer);
        this.raiseEvent('selectedchanged', { e: this.selected });
    },

    removeSelected: function(index) {
        this.selected.splice(index, 1);
        this.raiseEvent('selectedchanged', { e: this.selected });
    },

    clearSelected: function() {
        this.selected = [];
        this.raiseEvent('selectedchanged', { e: this.selected });
    },

    selectedContains: function(index) {
        for(let i = 0; i < this.selected.length; i++) {
            if(this.selected[i].index === index) return true;
        }

        return false;
    },

    setHovered: function(index) {
        if(that.hovered && that.hovered.index === result[0].index) return;
    
        let k = index * 3;        
        let positions = this.target.geometry.attributes['position'].data;
        let colors = null;
        
        if('color' in this.target.geometry.attributes) colors = this.target.geometry.attributes['color'].data;
        
        that.hovered = {
            index: index,
            position: new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]),
            color: colors ? [ colors[k], colors[k + 1], colors[k + 2] ] : null
        };

        that.hovered.screenPosition = that.renderer.camera.sceneToScreen(that.hovered.position, renderer);
        that.raiseEvent('hoveredchanged', { e: that.hovered });
    },

    selectHovered: function() {
        if(!this.hovered || this.selectedContains(this.hovered.index)) return;

        this.addSelected({
            distance: this.hovered.distance,
            index: this.hovered.index,
            locCode: this.hovered.locCode,
            position: this.hovered.position,
            color: this.hovered.color
        });
    },

    showCenters: function() {
        this.opts.visualize = 'centers';
        this.drawCenters();
        this.geometry.isVisible = true;
    },

    showCubes: function() {
        this.opts.visualize = 'cubes';
        this.drawBoxes();
        this.geometry.isVisible = true;
    },

    hide: function() {
        this.opts.visualize = false;
        this.geometry.isVisible = false;

        this.setAttribute('position', new Float32Array([]));
        this.setAttribute('color', new Float32Array([]));
    },

    getIntersections: function(mouse) {
        this.raycaster.set(this.renderer.camera, mouse.x, mouse.y);

        let tmp = this.octree.raySearch(this.raycaster);
        let result = this.rayIntersections(tmp);
        result.sort(function(a, b) { return a.distance - b.distance });

        return result;
    },

    addEventListener: function(eventName, callback) {
        if(!this.eventListeners[eventName]) this.eventListeners[eventName] = [];
        this.eventListeners[eventName].push(callback);
    },

    raiseEvent: function(eventName, data) {
        if(!this.eventListeners[eventName]) return;

        for(let i = 0; i < this.eventListeners[eventName].length; i++)
            this.eventListeners[eventName][i](data);
    },

    drawCenters: function() {
        this.geometry.setMode(Lore.DrawModes.points);

        let aabbs = this.octree.aabbs;
        let length = Object.keys(aabbs).length;
        let colors = new Float32Array(length * 3);
        let positions = new Float32Array(length * 3);

        let i = 0;
        for(key in aabbs) {
            let c = aabbs[key].center.components;
            let k = i * 3;
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

        let aabbs = this.octree.aabbs;
        let length = Object.keys(aabbs).length;
        let c = new Float32Array(length * 24 * 3);
        let p = new Float32Array(length * 24 * 3);

        for(let i = 0; i < c.length; i++) c[i] = 1;

        let index = 0;
        for(key in aabbs) {
            let corners = Lore.AABB.getCorners(aabbs[key]);
            
            p[index++] = corners[0][0]; p[index++] = corners[0][1]; p[index++] = corners[0][2];
            p[index++] = corners[1][0]; p[index++] = corners[1][1]; p[index++] = corners[1][2];
            p[index++] = corners[0][0]; p[index++] = corners[0][1]; p[index++] = corners[0][2];
            p[index++] = corners[2][0]; p[index++] = corners[2][1]; p[index++] = corners[2][2];
            p[index++] = corners[0][0]; p[index++] = corners[0][1]; p[index++] = corners[0][2];
            p[index++] = corners[4][0]; p[index++] = corners[4][1]; p[index++] = corners[4][2];

            p[index++] = corners[1][0]; p[index++] = corners[1][1]; p[index++] = corners[1][2];
            p[index++] = corners[3][0]; p[index++] = corners[3][1]; p[index++] = corners[3][2];
            p[index++] = corners[1][0]; p[index++] = corners[1][1]; p[index++] = corners[1][2];
            p[index++] = corners[5][0]; p[index++] = corners[5][1]; p[index++] = corners[5][2];

            p[index++] = corners[2][0]; p[index++] = corners[2][1]; p[index++] = corners[2][2];
            p[index++] = corners[3][0]; p[index++] = corners[3][1]; p[index++] = corners[3][2];
            p[index++] = corners[2][0]; p[index++] = corners[2][1]; p[index++] = corners[2][2];
            p[index++] = corners[6][0]; p[index++] = corners[6][1]; p[index++] = corners[6][2];

            p[index++] = corners[3][0]; p[index++] = corners[3][1]; p[index++] = corners[3][2];
            p[index++] = corners[7][0]; p[index++] = corners[7][1]; p[index++] = corners[7][2];

            p[index++] = corners[4][0]; p[index++] = corners[4][1]; p[index++] = corners[4][2];
            p[index++] = corners[5][0]; p[index++] = corners[5][1]; p[index++] = corners[5][2];
            p[index++] = corners[4][0]; p[index++] = corners[4][1]; p[index++] = corners[4][2];
            p[index++] = corners[6][0]; p[index++] = corners[6][1]; p[index++] = corners[6][2];

            p[index++] = corners[5][0]; p[index++] = corners[5][1]; p[index++] = corners[5][2];
            p[index++] = corners[7][0]; p[index++] = corners[7][1]; p[index++] = corners[7][2];

            p[index++] = corners[6][0]; p[index++] = corners[6][1]; p[index++] = corners[6][2];
            p[index++] = corners[7][0]; p[index++] = corners[7][1]; p[index++] = corners[7][2];
        }
        
        this.setAttribute('position', p);
        this.setAttribute('color', c);
    },

    setThreshold: function(threshold) {
        this.raycaster.threshold = threshold;
    },

    rayIntersections: function(indices) {
        let result = [];
        let inverseMatrix = Lore.Matrix4f.invert(this.target.modelMatrix); // this could be optimized, since the model matrix does not change
        let ray = new Lore.Ray();
        let threshold = this.raycaster.threshold * this.target.getPointScale();
        let positions = this.target.geometry.attributes['position'].data;
        let colors = null;
        if('color' in this.target.geometry.attributes) colors = this.target.geometry.attributes['color'].data;
        
        // Only get points further away than the cutoff set in the point HelperBase
        let cutoff = this.target.getCutoff();

        ray.copyFrom(this.raycaster.ray).applyProjection(inverseMatrix);

        let localThreshold = threshold; // / ((pointCloud.scale.x + pointCloud.scale.y + pointCloud.scale.z) / 3);
	    let localThresholdSq = localThreshold * localThreshold;

        for(let i = 0; i < indices.length; i++) {
            let index = indices[i].index;
            let locCode = indices[i].locCode;
            let k = index * 3;
            let v = new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]);
            
            let rayPointDistanceSq = ray.distanceSqToPoint(v);
            if(rayPointDistanceSq < localThresholdSq) {
                let intersectedPoint = ray.closestPointToPoint(v);
                intersectedPoint.applyProjection(this.target.modelMatrix);
                let dist = this.raycaster.ray.source.distanceTo(intersectedPoint);
                let isVisible = Lore.FilterBase.isVisible(this.target.geometry, index);
                if(dist < this.raycaster.near || dist > this.raycaster.far || dist < cutoff || !isVisible) continue;

                result.push({
                    distance: dist,
                    index: index,
                    locCode: locCode,
                    position: v,
                    color: colors ? [ colors[k], colors[k + 1], colors[k + 2] ] : null
                });
            }
        }

        return result;
    }
});


Lore.OctreeHelper.defaults = {
    visualize: false
}
