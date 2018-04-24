//@ts-check

const Renderer = require('../Core/Renderer');
const DrawModes = require('../Core/DrawModes');
const HelperBase = require('./HelperBase');
const Utils = require('../Utils/Utils');

/** A helper class for drawing axis aligned bounding boxes. */
class AABBHelper extends HelperBase {
    /**
     * Creates an instance of AABBHelper.
     * 
     * @param {Renderer} renderer A Lore.Renderer object.
     * @param {array} aabbs An array containing axis-aligned bounding boxes.
     * @param {string} geometryName The name of the geometry used to render the axis-aligned bounding boxes.
     * @param {string} shaderName The name of the shader used to render the axis-aligned bounding boxes.
     * @param {object} options Options for drawing the axis-aligned bounding boxes.
     */
    constructor(renderer, aabbs, geometryName, shaderName, options) {
        // TODO: Fix error
        super(renderer, geometryName, shaderName);

        // Create lines
        // Replaced with indexed?

        let p = new Float32Array(aabbs.length * 24 * 3);
        let c = new Float32Array(aabbs.length * 24 * 3);

        let index = 0;

        for (let i = 0; i < aabbs.length; i++) {
            let aabb = aabbs[0];
            let cx = aabb.center.components[0];
            let cy = aabb.center.components[1];
            let cz = aabb.center.components[2];
            let r = aabb.radius;

            let p0 = [ cx - r, cy - r, cz - r ];
            let p1 = [ cx - r, cy - r, cz + r ];
            let p2 = [ cx - r, cy + r, cz - r ];
            let p3 = [ cx - r, cy + r, cz + r ];
            let p4 = [ cx + r, cy - r, cz - r ];
            let p5 = [ cx + r, cy - r, cz + r ];
            let p6 = [ cx + r, cy + r, cz - r ];
            let p7 = [ cx + r, cy + r, cz + r ];

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


        
        this.opts = Utils.extend(true, AABBHelper.defaults, options);
        this.geometry.setMode(DrawModes.lines);

        this.setAttribute('position', p);
        this.setAttribute('color', c);
    }
}

module.exports = AABBHelper