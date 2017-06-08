/** 
 * A class representing orbital controls.
 * 
 * @property {Lore.Vector3f} up The global up vector.
 * @property {Number} radius The distance from the camera to the lookat vector.
 * @property {Number} [yRotationLimit=Math.PI] The limit for the vertical rotation.
 * @property {Lore.SphericalCoords} spherical The spherical coordinates of the camera on the sphere around the lookat vector.
 * @property {Number} scale The sensitivity scale.
 * @property {Lore.CameraBase} camera The camera associated with these controls.
 */
Lore.OrbitalControls = class OrbitalControls extends Lore.ControlsBase {

    /**
     * Creates an instance of OrbitalControls.
     * @param {Lore.Renderer} renderer An instance of a Lore renderer.
     * @param {Lore.Number} radius The distance of the camera to the lookat vector.
     * @param {Lore.Vector3f} lookAt The lookat vector.
     */
    constructor(renderer, radius, lookAt = new Lore.Vector3f()) {
        super(renderer, lookAt);

        this.up = Lore.Vector3f.up();
        this.radius = radius;
        
        this.yRotationLimit = Math.PI;

        this._dPhi = 0.0;
        this._dTheta = 0.0;
        this._dPan = new Lore.Vector3f();

        this.spherical = new Lore.SphericalCoords();

        this.scale = 0.95;

        this.camera.position = new Lore.Vector3f(radius, radius, radius);
        this.camera.updateProjectionMatrix();
        this.camera.updateViewMatrix();

        this.rotationLocked = false;

        let that = this;

        this.addEventListener('mousedrag', function (e) {
            that.update(e.e, e.source);
        });

        this.addEventListener('mousewheel', function (e) {
            that.update({
                x: 0,
                y: -e.e
            }, 'wheel');
        });

        // Initial update
        this.update({
            x: 0,
            y: 0
        }, 'left');
    }

    /**
     * Limit the vertical rotation to the horizon (the upper hemisphere).
     * 
     * @param {Boolean} limit A boolean indicating whether or not to limit the vertical rotation to the horizon.
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    limitRotationToHorizon(limit) {
        if (limit) {
            this.yRotationLimit = 0.5 * Math.PI;
        } else {
            this.yRotationLimit = Math.PI;
        }

        return this;
    }

    /**
     * Sets the distance (radius of the sphere) from the lookat vector to the camera.
     * 
     * @param {Number} radius The radius.
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setRadius(radius) {
        this.radius = radius;
        this.camera.position = new Lore.Vector3f(0, 0, radius);

        this.camera.updateProjectionMatrix();
        this.camera.updateViewMatrix();
        this.update();

        return this;
    }

    /**
     * Update the camera (on mouse move, touch drag, mousewheel scroll, ...).
     * 
     * @param {*} e A mouse or touch events data.
     * @param {String} source The source of the input ('left', 'middle', 'right', 'wheel', ...).
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    update(e, source) {
        if (source == 'left' && !this.rotationLocked) {
            // Rotate
            this._dTheta = -2 * Math.PI * e.x / (this.canvas.clientWidth * this.camera.zoom);
            this._dPhi = -2 * Math.PI * e.y / (this.canvas.clientHeight * this.camera.zoom);
            
            // It's just to fast like this ...
            // this._dTheta = -2 * Math.PI * e.x / this.canvas.clientWidth;
            // this._dPhi = -2 * Math.PI * e.y / this.canvas.clientHeight;
        } else if (source == 'right' || source == 'left' && this.rotationLocked) {
            // Translate
            let x = e.x * (this.camera.right - this.camera.left) /
                this.camera.zoom / this.canvas.clientWidth;
            let y = e.y * (this.camera.top - this.camera.bottom) /
                this.camera.zoom / this.canvas.clientHeight;

            let u = this.camera.getUpVector().components;
            let r = this.camera.getRightVector().components;

            this._dPan.components[0] = r[0] * -x + u[0] * y;
            this._dPan.components[1] = r[1] * -x + u[1] * y;
            this._dPan.components[2] = r[2] * -x + u[2] * y;
        } else if (source == 'middle' || source == 'wheel') {
            if (e.y > 0) {
                // Zoom Out
                this.camera.zoom = Math.max(0, this.camera.zoom * this.scale);
                this.camera.updateProjectionMatrix();
                this.raiseEvent('zoomchanged', this.camera.zoom);
            } else if (e.y < 0) {
                // Zoom In
                this.camera.zoom = Math.max(0, this.camera.zoom / this.scale);
                this.camera.updateProjectionMatrix();
                this.raiseEvent('zoomchanged', this.camera.zoom);
            }
        }

        // Update the camera
        let offset = this.camera.position.clone().subtract(this.lookAt);

        this.spherical.setFromVector(offset);
        this.spherical.components[1] += this._dPhi;
        this.spherical.components[2] += this._dTheta;
        this.spherical.limit(0, this.yRotationLimit, -Infinity, Infinity);
        this.spherical.secure();

        // Limit radius here
        this.lookAt.add(this._dPan);
        offset.setFromSphericalCoords(this.spherical);

        this.camera.position.copyFrom(this.lookAt).add(offset);
        this.camera.setLookAt(this.lookAt);
        this.camera.updateViewMatrix();

        this._dPhi = 0.0;
        this._dTheta = 0.0;
        this._dPan.set(0, 0, 0);

        this.raiseEvent('updated');

        return this;
    }

    /**
     * Moves the camera around the sphere by spherical coordinates.
     * 
     * @param {Number} phi The phi component of the spherical coordinates.
     * @param {Number} theta The theta component of the spherical coordinates.
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setView(phi, theta) {
        let offset = this.camera.position.clone().subtract(this.lookAt);

        this.spherical.setFromVector(offset);
        this.spherical.components[1] = phi;
        this.spherical.components[2] = theta;
        this.spherical.secure();

        offset.setFromSphericalCoords(this.spherical);

        this.camera.position.copyFrom(this.lookAt).add(offset);
        this.camera.setLookAt(this.lookAt);
        this.camera.updateViewMatrix();
        this.raiseEvent('updated');

        return this;
    }

    /**
     * Zoom in on the lookat vector.
     * 
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    zoomIn() {
        this.camera.zoom = Math.max(0, this.camera.zoom / this.scale);
        this.camera.updateProjectionMatrix();
        this.raiseEvent('zoomchanged', this.camera.zoom);
        this.raiseEvent('updated');
        
        return this;
    }
    
    /**
     * Zoom out from the lookat vector.
     * 
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    zoomOut() {
        this.camera.zoom = Math.max(0, this.camera.zoom * this.scale);
        this.camera.updateProjectionMatrix();
        this.raiseEvent('zoomchanged', this.camera.zoom);
        this.raiseEvent('updated');

        return this;
    }

    /**
     * Set the zoom to a given value.
     * 
     * @param {Number} zoom The zoom value.
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setZoom(zoom) {
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
        this.raiseEvent('zoomchanged', this.camera.zoom);
        this.raiseEvent('updated');

        return this;
    }

    /**
     * Set the camera to the top view (locks rotation).
     * 
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setTopView() {
        this.setView(0.0, 2.0 * Math.PI);
        this.rotationLocked = true;

        return this;
    }

    /**
     * Set the camera to the bottom view (locks rotation).
     * 
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setBottomView() {
        this.setView(0.0, 0.0);
        this.rotationLocked = true;

        return this;
    }

    /**
     * Set the camera to the right view (locks rotation).
     * 
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setRightView() {
        this.setView(0.5 * Math.PI, 0.5 * Math.PI);
        this.rotationLocked = true;

        return this;
    }

    /**
     * Set the camera to the left view (locks rotation).
     * 
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setLeftView() {
        this.setView(0.5 * Math.PI, -0.5 * Math.PI);
        this.rotationLocked = true;

        return this;
    }

    /**
     * Set the camera to the front view (locks rotation).
     * 
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setFrontView() {
        this.setView(0.5 * Math.PI, 2.0 * Math.PI);
        this.rotationLocked = true;

        return this;
    }

    /**
     * Set the camera to the back view (locks rotation).
     * 
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setBackView() {
        this.setView(0.5 * Math.PI, Math.PI);
        this.rotationLocked = true;

        return this;
    }

    /**
     * Set the camera to free view (unlocks rotation).
     * 
     * @returns {Lore.OrbitalControls} Returns itself.
     */
    setFreeView() {
        this.setView(0.25 * Math.PI, 0.25 * Math.PI);
        this.rotationLocked = false

        return this;
    }
}
