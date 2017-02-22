Lore.CameraBase = class CameraBase extends Lore.Node {
    constructor() {
        super();

        this.type = 'Lore.CameraBase';
        this.renderer = null;
        this.isProjectionMatrixStale = false;
        this.isViewMatrixStale = false;
        this.projectionMatrix = new Lore.ProjectionMatrix();
        this.viewMatrix = new Lore.Matrix4f();
    }

    init(gl, program) {
        this.gl = gl;
        this.program = program;

        return this;
    }

    setLookAt(v) {
        this.rotation.lookAt(this.position, v, Lore.Vector3f.up());
        
        return this;
    }

    updateProjectionMatrix() {
        return this;
    }

    updateViewMatrix() {
        this.update();
        
        let viewMatrix = this.modelMatrix.clone();
        
        viewMatrix.invert();
        this.viewMatrix = viewMatrix;
        this.isViewMatrixStale = true;
        
        return this;
    }

    getProjectionMatrix() {
        return this.projectionMatrix.entries;
    }

    getViewMatrix() {
        return this.viewMatrix.entries;
    }

    sceneToScreen(v, renderer) {
        let vector = v.clone();
        let canvas = renderer.canvas;
        
        vector.project(this);
        
        // Map to 2D screen space
        // Correct for high dpi display by dividing by device pixel ratio
        let x = Math.round((vector.components[0] + 1) * canvas.width  / 2);// / window.devicePixelRatio;
        let y = Math.round((-vector.components[1] + 1) * canvas.height / 2);// / window.devicePixelRatio;
        
        return [ x, y ];
    }
}
