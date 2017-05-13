/** A class representing orbital controls. */
Lore.FirstPersonControls = class FirstPersonControls extends Lore.ControlsBase {

    /**
     * Creates an instance of FirstPersonControls.
     * @param {Renderer} renderer An instance of a Lore renderer.
     */
    constructor(renderer, radius) {
        super(renderer);

        this.up = Lore.Vector3f.up();
        this.renderer = renderer;
        this.camera = renderer.camera;
        this.canvas = renderer.canvas;
        
        this.lookAt = lookAt || new Lore.Vector3f();

        this.camera.position = new Lore.Vector3f(radius, radius, radius);
        this.camera.updateProjectionMatrix();
        this.camera.updateViewMatrix();

        this.rotationLocked = false;

        let that = this;

        this.addEventListener('mousedrag', function (e) {
            that.update(e.e, e.source);
        });

        // Initial update
        this.update({
            x: 0,
            y: 0
        }, 'left');
    }

    /**
     * Update the camera (on mouse move, touch drag, mousewheel scroll, ...).
     * 
     * @param {any} e A mouse or touch events data.
     * @param {String} source The source of the input ('left', 'middle', 'right', 'wheel', ...).
     * @returns {FirstPersonControls} Returns itself.
     */
    update(e, source) {
        if (source === 'left') {
            // Move forward here
        }

        // Update the camera
        let offset = this.camera.position.clone().subtract(this.lookAt);

        this.camera.position.copyFrom(this.lookAt).add(offset);
        this.camera.setLookAt(this.lookAt);
        this.camera.updateViewMatrix();

        this.raiseEvent('updated');

        return this;
    }
}
