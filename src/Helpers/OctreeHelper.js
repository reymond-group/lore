/** 
 * A helper class to create an octree associated with vertex data. 
 * 
 * @property {*} opts An object containing options.
 * @property {Lore.PointHelper} target The Lore.PointHelper object from which this octree is constructed.
 * @property {Lore.Renderer} renderer An instance of Lore.Renderer.
 * @property {Lore.Octree} octree The octree associated with the target.
 * @property {Lore.Raycaster} raycaster An instance of Lore.Raycaster.
 * @property {Object} hovered The currently hovered item.
 * @property {Object[]} selected The currently selected items.
 */
Lore.OctreeHelper = class OctreeHelper extends Lore.HelperBase {

    /**
     * Creates an instance of OctreeHelper.
     * 
     * @param {Lore.Renderer} renderer A Lore.Renderer object.
     * @param {String} geometryName The name of this geometry.
     * @param {String} shaderName The name of the shader used to render this octree.
     * @param {Lore.PointHelper} target The Lore.PointHelper object from which this octree is constructed.
     * @param {Object} options The options used to draw this octree.
     */
    constructor(renderer, geometryName, shaderName, target, options) {
        super(renderer, geometryName, shaderName);

        this.defaults = {
            visualize: false,
            multiSelect: true
        }

        this.opts = Lore.Utils.extend(true, this.defaults, options);
        this._eventListeners = {};
        this.target = target;
        this.renderer = renderer;
        this.octree = this.target.octree;
        this.raycaster = new Lore.Raycaster();
        this.hovered = null;
        this.selected = [];

        let that = this;

        this._dblclickHandler = function (e) {
            if (e.e.mouse.state.middle || e.e.mouse.state.right) {
                return;
            }

            let mouse = e.e.mouse.normalizedPosition;
            let result = that.getIntersections(mouse);

            if (result.length > 0) {
                if (that.selectedContains(result[0].index)) {
                    return;
                }

                that.addSelected(result[0]);
            }
        };

        renderer.controls.addEventListener('dblclick', this._dblclickHandler);

        this._mousemoveHandler = function (e) {
            if (e.e.mouse.state.left || e.e.mouse.state.middle || e.e.mouse.state.right) {
                return;
            }

            let mouse = e.e.mouse.normalizedPosition;
            let result = that.getIntersections(mouse);

            if (result.length > 0) {
                if (that.hovered && that.hovered.index === result[0].index) {
                    return;
                }

                that.hovered = result[0];
                that.hovered.screenPosition = that.renderer.camera.sceneToScreen(result[0].position, renderer);
                
                that.raiseEvent('hoveredchanged', {
                    e: that.hovered
                });
            } else {
                that.hovered = null;
                that.raiseEvent('hoveredchanged', {
                    e: null
                });
            }
        };

        renderer.controls.addEventListener('mousemove', this._mousemoveHandler);

        this._zoomchangedHandler = function (zoom) {
            that.setPointSizeFromZoom(zoom);
        };

        renderer.controls.addEventListener('zoomchanged', this._zoomchangedHandler);

        this._updatedHandler = function () {
            for (let i = 0; i < that.selected.length; i++) {
                that.selected[i].screenPosition = that.renderer.camera.sceneToScreen(that.selected[i].position, renderer);
            }

            if (that.hovered) {
                that.hovered.screenPosition = that.renderer.camera.sceneToScreen(that.hovered.position, renderer);
            }

            that.raiseEvent('updated');
        };

        renderer.controls.addEventListener('updated', this._updatedHandler);

        this.init();
    }

    /**
     * Initialize this octree.
     */
    init() {
        if (this.opts.visualize === 'centers') {
            this.drawCenters();
        } else if (this.opts.visualize === 'cubes') {
            this.drawBoxes();
        } else {
            this.geometry.isVisible = false;
        }

        this.setPointSizeFromZoom(1.0);
    }

    /**
     * Sets the point size of the associated Lore.PointHelper object as well as the threshold for the associated raycaster used for vertex picking.
     * 
     * @param {Number} zoom The current zoom value of the orthographic view.
     */
    setPointSizeFromZoom(zoom) {
        let threshold = this.target.setPointSize(zoom + 0.1);

        this.setThreshold(threshold);
    }

    /**
     * Get the screen position of a vertex by its index.
     * 
     * @param {Number} index The index of a vertex.
     * @returns {Number[]} An array containing the screen position. E.g. [122, 290].
     */
    getScreenPosition(index) {
        let positions = this.target.geometry.attributes['position'].data;
        let k = index * 3;
        let p = new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]);

        return this.renderer.camera.sceneToScreen(p, this.renderer);
    }

    /**
     * Adds an object to the selected collection of this Lore.OctreeHelper object.
     * 
     * @param {Object|Number} item Either an item (used internally) or the index of a vertex from the associated Lore.PointHelper object.
     */
    addSelected(item) {
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
                color: colors ? [colors[k], colors[k + 1], colors[k + 2]] : null
            };
        }

        let index = this.selected.length;

        if (this.opts.multiSelect) {
            this.selected.push(item);
        } else {
            this.selected[0] = item;
            index = 0;
        }

        this.selected[index].screenPosition = this.renderer.camera.sceneToScreen(item.position, this.renderer);
        this.raiseEvent('selectedchanged', {
            e: this.selected
        });
    }

    /**
     * Remove an item from the selected collection of this Lore.OctreeHelper object.
     * 
     * @param {Number} index The index of the item in the selected collection.
     */
    removeSelected(index) {
        this.selected.splice(index, 1);

        this.raiseEvent('selectedchanged', {
            e: this.selected
        });
    }

    /**
     * Clear the selected collection of this Lore.OctreeHelper object.
     */
    clearSelected() {
        this.selected = [];

        this.raiseEvent('selectedchanged', {
            e: this.selected
        });
    }

    /**
     * Check whether or not the selected collection of this Lore.OctreeHelper object contains a vertex with a given index.
     * 
     * @param {Number} index The index of a vertex in the associated Lore.PointHelper object.
     * @returns {Boolean} A boolean indicating whether or not the selected collection of this Lore.OctreeHelper contains a vertex with a given index.
     */
    selectedContains(index) {
        for (let i = 0; i < this.selected.length; i++) {
            if (this.selected[i].index === index) {
                return true;
            }
        }

        return false;
    }

    /**
     * Adds a vertex with a given index to the currently hovered vertex of this Lore.OctreeHelper object.
     * 
     * @param {Number} index The index of a vertex in the associated Lore.PointHelper object.
     */
    setHovered(index) {
        if (that.hovered && that.hovered.index === result[0].index) {
            return;
        }

        let k = index * 3;
        let positions = this.target.geometry.attributes['position'].data;
        let colors = null;

        if ('color' in this.target.geometry.attributes) {
            colors = this.target.geometry.attributes['color'].data;
        }

        that.hovered = {
            index: index,
            position: new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]),
            color: colors ? [colors[k], colors[k + 1], colors[k + 2]] : null
        };

        that.hovered.screenPosition = that.renderer.camera.sceneToScreen(that.hovered.position, renderer);
        that.raiseEvent('hoveredchanged', {
            e: that.hovered
        });
    }

    /**
     * Add the currently hovered vertex to the collection of selected vertices. 
     */
    selectHovered() {
        if (!this.hovered || this.selectedContains(this.hovered.index)) {
            return;
        }

        this.addSelected({
            distance: this.hovered.distance,
            index: this.hovered.index,
            locCode: this.hovered.locCode,
            position: this.hovered.position,
            color: this.hovered.color
        });
    }

    /**
     * Show the centers of the axis-aligned bounding boxes of this octree. 
     */
    showCenters() {
        this.opts.visualize = 'centers';
        this.drawCenters();
        this.geometry.isVisible = true;
    }

    /**
     * Show the axis-aligned boudning boxes of this octree as cubes. 
     */
    showCubes() {
        this.opts.visualize = 'cubes';
        this.drawBoxes();
        this.geometry.isVisible = true;
    }

    /**
     * Hide the centers or cubes of the axis-aligned bounding boxes associated with this octree.
     */
    hide() {
        this.opts.visualize = false;
        this.geometry.isVisible = false;

        this.setAttribute('position', new Float32Array([]));
        this.setAttribute('color', new Float32Array([]));
    }

    /**
     * Get the indices and distances of the vertices currently intersected by the ray sent from the mouse position.
     * 
     * @param {Object} mouse A mouse object containing x and y properties.
     * @returns {Object[]} A distance-sorted (ASC) array containing the interesected vertices.
     */
    getIntersections(mouse) {
        this.raycaster.set(this.renderer.camera, mouse.x, mouse.y);

        let tmp = this.octree.raySearch(this.raycaster);
        let result = this.rayIntersections(tmp);

        result.sort(function (a, b) {
            return a.distance - b.distance
        });

        return result;
    }

    /**
     * Add an event listener to this Lore.OctreeHelper object.
     * 
     * @param {String} eventName The name of the event to listen for.
     * @param {Function} callback A callback function called when an event is fired.
     */
    addEventListener(eventName, callback) {
        if (!this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [];
        }

        this._eventListeners[eventName].push(callback);
    }

    /**
     * Raise an event with a given name and send the data to the functions listening for this event.
     * 
     * @param {String} eventName The name of the event to be rised.
     * @param {*} data Data to be sent to the listening functions.
     */
    raiseEvent(eventName, data) {
        if (!this._eventListeners[eventName]) {
            return;
        }

        for (let i = 0; i < this._eventListeners[eventName].length; i++) {
            this._eventListeners[eventName][i](data);
        }
    }

    /**
     * Draw the centers of the axis-aligned bounding boxes of this octree.
     */
    drawCenters() {
        this.geometry.setMode(Lore.DrawModes.points);

        let aabbs = this.octree.aabbs;
        let length = Object.keys(aabbs).length;
        let colors = new Float32Array(length * 3);
        let positions = new Float32Array(length * 3);

        let i = 0;

        for (key in aabbs) {
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
    }

    /**
     * Draw the axis-aligned bounding boxes of this octree.
     */
    drawBoxes() {
        this.geometry.setMode(Lore.DrawModes.lines);

        let aabbs = this.octree.aabbs;
        let length = Object.keys(aabbs).length;
        let c = new Float32Array(length * 24 * 3);
        let p = new Float32Array(length * 24 * 3);

        for (let i = 0; i < c.length; i++) {
            c[i] = 1;
        }

        let index = 0;

        for (key in aabbs) {
            let corners = Lore.AABB.getCorners(aabbs[key]);

            p[index++] = corners[0][0];
            p[index++] = corners[0][1];
            p[index++] = corners[0][2];
            p[index++] = corners[1][0];
            p[index++] = corners[1][1];
            p[index++] = corners[1][2];
            p[index++] = corners[0][0];
            p[index++] = corners[0][1];
            p[index++] = corners[0][2];
            p[index++] = corners[2][0];
            p[index++] = corners[2][1];
            p[index++] = corners[2][2];
            p[index++] = corners[0][0];
            p[index++] = corners[0][1];
            p[index++] = corners[0][2];
            p[index++] = corners[4][0];
            p[index++] = corners[4][1];
            p[index++] = corners[4][2];

            p[index++] = corners[1][0];
            p[index++] = corners[1][1];
            p[index++] = corners[1][2];
            p[index++] = corners[3][0];
            p[index++] = corners[3][1];
            p[index++] = corners[3][2];
            p[index++] = corners[1][0];
            p[index++] = corners[1][1];
            p[index++] = corners[1][2];
            p[index++] = corners[5][0];
            p[index++] = corners[5][1];
            p[index++] = corners[5][2];

            p[index++] = corners[2][0];
            p[index++] = corners[2][1];
            p[index++] = corners[2][2];
            p[index++] = corners[3][0];
            p[index++] = corners[3][1];
            p[index++] = corners[3][2];
            p[index++] = corners[2][0];
            p[index++] = corners[2][1];
            p[index++] = corners[2][2];
            p[index++] = corners[6][0];
            p[index++] = corners[6][1];
            p[index++] = corners[6][2];

            p[index++] = corners[3][0];
            p[index++] = corners[3][1];
            p[index++] = corners[3][2];
            p[index++] = corners[7][0];
            p[index++] = corners[7][1];
            p[index++] = corners[7][2];

            p[index++] = corners[4][0];
            p[index++] = corners[4][1];
            p[index++] = corners[4][2];
            p[index++] = corners[5][0];
            p[index++] = corners[5][1];
            p[index++] = corners[5][2];
            p[index++] = corners[4][0];
            p[index++] = corners[4][1];
            p[index++] = corners[4][2];
            p[index++] = corners[6][0];
            p[index++] = corners[6][1];
            p[index++] = corners[6][2];

            p[index++] = corners[5][0];
            p[index++] = corners[5][1];
            p[index++] = corners[5][2];
            p[index++] = corners[7][0];
            p[index++] = corners[7][1];
            p[index++] = corners[7][2];

            p[index++] = corners[6][0];
            p[index++] = corners[6][1];
            p[index++] = corners[6][2];
            p[index++] = corners[7][0];
            p[index++] = corners[7][1];
            p[index++] = corners[7][2];
        }

        this.setAttribute('position', p);
        this.setAttribute('color', c);
    }

    /**
     * Set the threshold of the raycaster associated with this Lore.OctreeHelper object.
     * 
     * @param {Number} threshold The threshold (maximum distance to the ray) of the raycaster.
     */
    setThreshold(threshold) {
        this.raycaster.threshold = threshold;
    }

    /**
     * Execute a ray intersection search within this octree.
     * 
     * @param {Number[]} indices The indices of the octree nodes that are intersected by the ray.
     * @returns {Number[]} An array containing the vertices intersected by the ray.
     */
    rayIntersections(indices) {
        let result = [];
        let inverseMatrix = Lore.Matrix4f.invert(this.target.modelMatrix); // this could be optimized, since the model matrix does not change
        let ray = new Lore.Ray();
        let threshold = this.raycaster.threshold * this.target.getPointScale();
        let positions = this.target.geometry.attributes['position'].data;
        let colors = null;

        if ('color' in this.target.geometry.attributes) {
            colors = this.target.geometry.attributes['color'].data;
        }

        // Only get points further away than the cutoff set in the point HelperBase
        let cutoff = this.target.getCutoff();

        ray.copyFrom(this.raycaster.ray).applyProjection(inverseMatrix);

        let localThreshold = threshold; // / ((pointCloud.scale.x + pointCloud.scale.y + pointCloud.scale.z) / 3);
        let localThresholdSq = localThreshold * localThreshold;

        for (let i = 0; i < indices.length; i++) {
            let index = indices[i].index;
            let locCode = indices[i].locCode;
            let k = index * 3;
            let v = new Lore.Vector3f(positions[k], positions[k + 1], positions[k + 2]);

            let rayPointDistanceSq = ray.distanceSqToPoint(v);
            if (rayPointDistanceSq < localThresholdSq) {
                let intersectedPoint = ray.closestPointToPoint(v);
                intersectedPoint.applyProjection(this.target.modelMatrix);
                let dist = this.raycaster.ray.source.distanceTo(intersectedPoint);
                let isVisible = Lore.FilterBase.isVisible(this.target.geometry, index);
                if (dist < this.raycaster.near || dist > this.raycaster.far || dist < cutoff || !isVisible) continue;

                result.push({
                    distance: dist,
                    index: index,
                    locCode: locCode,
                    position: v,
                    color: colors ? [colors[k], colors[k + 1], colors[k + 2]] : null
                });
            }
        }

        return result;
    }

    /**
     * Remove eventhandlers from associated controls.
     */
    destruct() {
       this.renderer.controls.removeEventListener('dblclick', this._dblclickHandler);
       this.renderer.controls.removeEventListener('mousemove', this._mousemoveHandler); 
       this.renderer.controls.removeEventListener('zoomchanged', this._zoomchangedHandler); 
       this.renderer.controls.removeEventListener('updated', this._updatedHandler); 
    }
}
