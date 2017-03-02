Lore.OrbitalControls = class OrbitalControls extends Lore.ControlsBase {

    constructor(renderer, radius, lookAt) {
        super(renderer);

        this.up = Lore.Vector3f.up();
        this.radius = radius;
        this.renderer = renderer;
        this.camera = renderer.camera;
        this.canvas = renderer.canvas;
        
        this.yRotationLimit = Math.PI;

        this.dPhi = 0.0;
        this.dTheta = 0.0;
        this.dPan = new Lore.Vector3f();

        this.spherical = new Lore.SphericalCoords();
        this.lookAt = lookAt || new Lore.Vector3f();

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

    limitRotationToHorizon(limit) {
        if (limit) {
            this.yRotationLimit = 0.5 * Math.PI;
        } else {
            this.yRotationLimit = Math.PI;
        }

        return this;
    }

    setRadius(radius) {
        this.radius = radius;
        this.camera.position = new Lore.Vector3f(0, 0, radius);

        this.camera.updateProjectionMatrix();
        this.camera.updateViewMatrix();
        this.update();

        return this;
    }

    setLookAt(lookAt) {
        this.camera.position = new Lore.Vector3f(this.radius, this.radius, this.radius);
        this.lookAt = lookAt.clone();
        this.update();

        return this;
    }

    update(e, source) {
        if (source == 'left' && !this.rotationLocked) {
            // Rotate
            this.dTheta = -2 * Math.PI * e.x / (this.canvas.clientWidth * 0.5 * this.camera.zoom);
            this.dPhi = -2 * Math.PI * e.y / (this.canvas.clientHeight * 0.5 * this.camera.zoom);
            
            // It's just to fast like this ...
            // this.dTheta = -2 * Math.PI * e.x / this.canvas.clientWidth;
            // this.dPhi = -2 * Math.PI * e.y / this.canvas.clientHeight;
        } else if (source == 'right' || source == 'left' && this.rotationLocked) {
            // Translate
            let x = e.x * (this.camera.right - this.camera.left) /
                this.camera.zoom / this.canvas.clientWidth;
            let y = e.y * (this.camera.top - this.camera.bottom) /
                this.camera.zoom / this.canvas.clientHeight;

            let u = this.camera.getUpVector().components;
            let r = this.camera.getRightVector().components;

            this.dPan.components[0] = r[0] * -x + u[0] * y;
            this.dPan.components[1] = r[1] * -x + u[1] * y;
            this.dPan.components[2] = r[2] * -x + u[2] * y;
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
        this.spherical.components[1] += this.dPhi;
        this.spherical.components[2] += this.dTheta;
        this.spherical.limit(0, this.yRotationLimit, -Infinity, Infinity);
        this.spherical.secure();

        // Limit radius here
        this.lookAt.add(this.dPan);
        offset.setFromSphericalCoords(this.spherical);

        this.camera.position.copyFrom(this.lookAt).add(offset);
        this.camera.setLookAt(this.lookAt);
        this.camera.updateViewMatrix();

        this.dPhi = 0.0;
        this.dTheta = 0.0;
        this.dPan.set(0, 0, 0);

        this.raiseEvent('updated');

        return this;
    }

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

    zoomIn() {
        this.camera.zoom = Math.max(0, this.camera.zoom / this.scale);
        this.camera.updateProjectionMatrix();
        this.raiseEvent('zoomchanged', this.camera.zoom);
        this.raiseEvent('updated');
        
        return this;
    }

    zoomOut() {
        this.camera.zoom = Math.max(0, this.camera.zoom * this.scale);
        this.camera.updateProjectionMatrix();
        this.raiseEvent('zoomchanged', this.camera.zoom);
        this.raiseEvent('updated');

        return this;
    }

    setTopView() {
        this.setView(0.0, 2.0 * Math.PI);
        this.rotationLocked = true;

        return this;
    }

    setBottomView() {
        this.setView(0.0, 0.0);
        this.rotationLocked = true;

        return this;
    }

    setRightView() {
        this.setView(0.5 * Math.PI, 0.5 * Math.PI);
        this.rotationLocked = true;

        return this;
    }

    setLeftView() {
        this.setView(0.5 * Math.PI, -0.5 * Math.PI);
        this.rotationLocked = true;

        return this;
    }

    setFrontView() {
        this.setView(0.5 * Math.PI, 2.0 * Math.PI);
        this.rotationLocked = true;

        return this;
    }

    setBackView() {
        this.setView(0.5 * Math.PI, Math.PI);
        this.rotationLocked = true;

        return this;
    }

    setFreeView() {
        this.setView(0.25 * Math.PI, 0.25 * Math.PI);
        this.rotationLocked = false

        return this;
    }
}
