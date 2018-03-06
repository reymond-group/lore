
/** 
 * An abstract class representing the base for camera implementations. 
 * 
 * @property {string} type The type name of this object (Lore.CameraBase).
 * @property {Lore.Renderer} renderer A Lore.Renderer object.
 * @property {boolean} isProjectionMatrixStale A boolean indicating whether or not the projection matrix was changed and has to be updated.
 * @property {Lore.ProjectionMatrix} projectionMatrix A Lore.ProjectionMatrix object.
 * @property {Lore.Matrix4f} viewMatrix A Lore.Matrix4f object representing the view matrix for this camera.
 * */
Lore.CameraBase = class CameraBase extends Lore.Node {
    /**
     * Creates an instance of CameraBase.
     */
    constructor() {
        super();

        this.type = 'Lore.CameraBase';
        this.renderer = null;
        this.isProjectionMatrixStale = false;
        this.isViewMatrixStale = false;
        this.projectionMatrix = new Lore.ProjectionMatrix();
        this.viewMatrix = new Lore.Matrix4f();
    }

    /**
     * Initializes this camera instance.
     * 
     * @param {any} gl A gl context.
     * @param {any} program A program pointer.
     * @returns {CameraBase} Returns itself.
     */
    init(gl, program) {
        this.gl = gl;
        this.program = program;

        return this;
    }

    /**
     * Sets the lookat of this camera instance.
     * 
     * @param {Vector3f} vec The vector to set the lookat to.
     * @returns {CameraBase} Returns itself.
     */
    setLookAt(vec) {
        this.rotation.lookAt(this.position, vec, Lore.Vector3f.up());
        
        return this;
    }

    /**
     * Has to be called when the viewport size changes (e.g. window resize).
     * 
     * @param {Number} width The width of the viewport.
     * @param {Number} height The height of the viewport.
     */
    updateViewport(width, height) {
        return this;
    }

    /**
     * Virtual Method
     * 
     * @returns {Vector3f} Returns itself.
     */
    updateProjectionMatrix() {
        return this;
    }

    /**
     * Upates the view matrix of this camera.
     * 
     * @returns {Vector3f} Returns itself.
     */
    updateViewMatrix() {
        this.update();
        
        let viewMatrix = this.modelMatrix.clone();
        
        viewMatrix.invert();
        console.log(viewMatrix.toString());
        this.viewMatrix = viewMatrix;
        this.isViewMatrixStale = true;
        
        return this;
    }

    /**
     * Returns the projection matrix of this camera instance as an array.
     * 
     * @returns {Float32Array} The entries of the projection matrix.
     */
    getProjectionMatrix() {
        return this.projectionMatrix.entries;
    }

    /**
     * Returns the view matrix of this camera instance as an array.
     * 
     * @returns {Float32Array} The entries of the view matrix.
     */
    getViewMatrix() {
        return this.viewMatrix.entries;
    }

    /**
     * Projects a vector into screen space.
     * 
     * @param {Vector3f} vec A vector.
     * @param {Renderer} renderer An instance of a Lore renderer.
     * @returns {Array} An array containing the x and y position in screen space.
     */
    sceneToScreen(vec, renderer) {
        let vector = vec.clone();
        let canvas = renderer.canvas;
        
        vector.project(this);
        
        // Map to 2D screen space
        // Correct for high dpi display by dividing by device pixel ratio
        let x = Math.round((vector.components[0] + 1) * canvas.width  / 2);// / window.devicePixelRatio;
        let y = Math.round((-vector.components[1] + 1) * canvas.height / 2);// / window.devicePixelRatio;
        
        return [ x, y ];
    }
}
