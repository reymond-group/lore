Lore.CoordinatesHelper = function(renderer, geometryName, shaderName, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.CoordinatesHelper.defaults, options);

    this.geometry.setMode(Lore.DrawModes.lines);
    this.init();
}

Lore.CoordinatesHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.CoordinatesHelper,

    init: function() {
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
        if(this.opts.box.enabled) {
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
        let xTicks = this.opts.ticks.x, xTickOffset = ao.x.length / xTicks.count;
        let yTicks = this.opts.ticks.y, yTickOffset = ao.y.length / yTicks.count;
        let zTicks = this.opts.ticks.z, zTickOffset = ao.z.length / zTicks.count;

        // X ticks
        let pos = p[0];
        let col = xTicks.color.components;
        for(let i = 0; i < xTicks.count - 1; i++) {
            pos += xTickOffset;
            // From
            positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                           pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, p[2] + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        pos = p[0];
        for(let i = 0; i < xTicks.count - 1; i++) {
            pos += xTickOffset;
            // From
            positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                           pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        // Y ticks
        pos = p[1];
        col = yTicks.color.components;
        for(let i = 0; i < yTicks.count - 1; i++) {
            pos += yTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                           p[0] + xTicks.offset.components[0] + xTicks.length, pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        pos = p[1];
        for(let i = 0; i < yTicks.count - 1; i++) {
            pos += yTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                           p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        // Z ticks
        pos = p[2];
        col = zTicks.color.components;
        for(let i = 0; i < zTicks.count - 1; i++) {
            pos += zTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2],
                           p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, pos + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        pos = p[2];
        for(let i = 0; i < zTicks.count - 1; i++) {
            pos += zTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2],
                           p[0] + xTicks.offset.components[0] + xTicks.length, p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        this.setAttribute('position', new Float32Array(positions));
        this.setAttribute('color', new Float32Array(colors));
    }
});


Lore.CoordinatesHelper.defaults = {
    position: new Lore.Vector3f(),
    axis: {
        x: {
            length: 50.0,
            color: Lore.Color.fromHex('#222222')
        },
        y: {
            length: 50.0,
            color: Lore.Color.fromHex('#222222')
        },
        z: {
            length: 50.0,
            color: Lore.Color.fromHex('#222222')
        }
    },
    ticks: {
        x: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: Lore.Color.fromHex('#222222')
        },
        y: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: Lore.Color.fromHex('#222222')
        },
        z: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: Lore.Color.fromHex('#222222')
        }
    },
    box: {
        enabled: true,
        x: {
            color: Lore.Color.fromHex('#999999')
        },
        y: {
            color: Lore.Color.fromHex('#999999')
        },
        z: {
            color: Lore.Color.fromHex('#999999')
        }
    },
}
