//@ts-check

const Color = require('../Core/Color');
const HelperBase = require('./HelperBase');
const Vector3f = require('../Math/Vector3f');
const Utils = require('../Utils/Utils');
const DrawModes = require('../Core/DrawModes');

/** A helper class for drawing coordinate system indicators. For example, a grid cube. */
class CoordinatesHelper extends HelperBase {

    /**
     * Creates an instance of CoordinatesHelper.
     * 
     * @param {Renderer} renderer A Lore.Renderer object.
     * @param {string} geometryName The name of this geometry.
     * @param {string} shaderName The name of the shader used to render the coordinates.
     * @param {object} options Options for drawing the coordinates. See documentation for details.
     */
    constructor(renderer, geometryName, shaderName, options) {
        super(renderer, geometryName, shaderName);

        
        this.defaults = {
            position: new Vector3f(0.0, 0.0, 0.0),
            axis: {
                x: {
                    length: 50.0,
                    color: Color.fromHex('#222222')
                },
                y: {
                    length: 50.0,
                    color: Color.fromHex('#222222')
                },
                z: {
                    length: 50.0,
                    color: Color.fromHex('#222222')
                }
            },
            ticks: {
                enabled: true,
                x: {
                    count: 10,
                    length: 5.0,
                    offset: new Vector3f(0.0, 0.0, 0.0),
                    color: Color.fromHex('#1f1f1f')
                },
                y: {
                    count: 10,
                    length: 5.0,
                    offset: new Vector3f(0.0, 0.0, 0.0),
                    color: Color.fromHex('#1f1f1f')
                },
                z: {
                    count: 10,
                    length: 5.0,
                    offset: new Vector3f(0.0, 0.0, 0.0),
                    color: Color.fromHex('#1f1f1f')
                }
            },
            box: {
                enabled: true,
                x: {
                    color: Color.fromHex('#222222')
                },
                y: {
                    color: Color.fromHex('#222222')
                },
                z: {
                    color: Color.fromHex('#222222')
                }
            },
        }

        this.opts = Utils.extend(true, this.defaults, options);

        this.geometry.setMode(DrawModes.lines);
        this.init();
    }

    /**
     * Initializes the coordinates system.
     */
    init() {
        let p = this.opts.position.components;
        let ao = this.opts.axis;

        // Setting the origin position of the axes
        let positions = [
            p[0], p[1], p[2], p[0] + ao.x.length, p[1], p[2],
            p[0], p[1], p[2], p[0], p[1] + ao.y.length, p[2],
            p[0], p[1], p[2], p[0], p[1], p[2] + ao.z.length
        ];

        // Setting the colors of the axes
        let cx = ao.x.color.components;
        let cy = ao.y.color.components;
        let cz = ao.z.color.components;

        let colors = [
            cx[0], cx[1], cx[2], cx[0], cx[1], cx[2],
            cy[0], cy[1], cy[2], cy[0], cy[1], cy[2],
            cz[0], cz[1], cz[2], cz[0], cz[1], cz[2]
        ];

        // Adding the box
        if (this.opts.box.enabled) {
            let bx = this.opts.box.x.color.components;
            let by = this.opts.box.y.color.components;
            let bz = this.opts.box.z.color.components;

            positions.push(
                p[0] + ao.x.length, p[1] + ao.y.length, p[2] + ao.z.length, p[0], p[1] + ao.y.length, p[2] + ao.z.length,
                p[0] + ao.x.length, p[1], p[2] + ao.z.length, p[0], p[1], p[2] + ao.z.length,
                p[0] + ao.x.length, p[1] + ao.y.length, p[2], p[0], p[1] + ao.y.length, p[2],
                p[0] + ao.x.length, p[1] + ao.y.length, p[2] + ao.z.length, p[0] + ao.x.length, p[1], p[2] + ao.z.length,
                p[0], p[1] + ao.y.length, p[2] + ao.z.length, p[0], p[1], p[2] + ao.z.length,
                p[0] + ao.x.length, p[1] + ao.y.length, p[2], p[0] + ao.x.length, p[1], p[2],
                p[0] + ao.x.length, p[1] + ao.y.length, p[2] + ao.z.length, p[0] + ao.x.length, p[1] + ao.y.length, p[2],
                p[0], p[1] + ao.y.length, p[2] + ao.z.length, p[0], p[1] + ao.y.length, p[2],
                p[0] + ao.x.length, p[1], p[2] + ao.z.length, p[0] + ao.x.length, p[1], p[2]
            );

            colors.push(
                bx[0], bx[1], bx[2], bx[0], bx[1], bx[2],
                bx[0], bx[1], bx[2], bx[0], bx[1], bx[2],
                bx[0], bx[1], bx[2], bx[0], bx[1], bx[2],
                by[0], by[1], by[2], by[0], by[1], by[2],
                by[0], by[1], by[2], by[0], by[1], by[2],
                by[0], by[1], by[2], by[0], by[1], by[2],
                bz[0], bz[1], bz[2], bz[0], bz[1], bz[2],
                bz[0], bz[1], bz[2], bz[0], bz[1], bz[2],
                bz[0], bz[1], bz[2], bz[0], bz[1], bz[2]
            );
        }

        // Adding the ticks
        if (this.opts.ticks.enabled) {
            let xTicks = this.opts.ticks.x, xTickOffset = ao.x.length / xTicks.count;
            let yTicks = this.opts.ticks.y, yTickOffset = ao.y.length / yTicks.count;
            let zTicks = this.opts.ticks.z, zTickOffset = ao.z.length / zTicks.count;

            // X ticks
            let pos = p[0];
            let col = xTicks.color.components;

            for (let i = 0; i < xTicks.count - 1; i++) {
                pos += xTickOffset;
                // From
                positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                            pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, p[2] + xTicks.offset.components[2]);
                colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
            }

            pos = p[0];

            for (let i = 0; i < xTicks.count - 1; i++) {
                pos += xTickOffset;
                // From
                positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                            pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
                colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
            }

            // Y ticks
            pos = p[1];
            col = yTicks.color.components;

            for (let i = 0; i < yTicks.count - 1; i++) {
                pos += yTickOffset;
                // From
                positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                            p[0] + xTicks.offset.components[0] + xTicks.length, pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2]);
                colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
            }

            pos = p[1];

            for (let i = 0; i < yTicks.count - 1; i++) {
                pos += yTickOffset;
                // From
                positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                            p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
                colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
            }

            // Z ticks
            pos = p[2];
            col = zTicks.color.components;
            
            for (let i = 0; i < zTicks.count - 1; i++) {
                pos += zTickOffset;
                // From
                positions.push(p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2],
                            p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, pos + xTicks.offset.components[2]);
                colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
            }

            pos = p[2];
            
            for (let i = 0; i < zTicks.count - 1; i++) {
                pos += zTickOffset;
                // From
                positions.push(p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2],
                            p[0] + xTicks.offset.components[0] + xTicks.length, p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2]);
                colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
            }
        }

        this.setAttribute('position', new Float32Array(positions));
        this.setAttribute('color', new Float32Array(colors));
    }
}

module.exports = CoordinatesHelper