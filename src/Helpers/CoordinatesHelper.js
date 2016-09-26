Lore.CoordinatesHelper = function(renderer, geometryName, shaderName, options) {
    Lore.HelperBase.call(this, renderer, geometryName, shaderName);
    this.opts = Lore.Utils.extend(true, Lore.CoordinatesHelper.defaults, options);

    this.geometry.setMode(Lore.DrawModes.lines);
    this.init();
}

Lore.CoordinatesHelper.prototype = Object.assign(Object.create(Lore.HelperBase.prototype), {
    constructor: Lore.CoordinatesHelper,

    init: function() {
        var p = this.opts.position.components;
        var ao = this.opts.axis;

        // Setting the origin position of the axes
        var positions = [
            p[0], p[1], p[2], p[0] + ao.x.length, p[1], p[2],
            p[0], p[1], p[2], p[0], p[1] + ao.y.length, p[2],
            p[0], p[1], p[2], p[0], p[1], p[2] + ao.z.length
        ];

        // Setting the colors of the axes
        var cx = ao.x.color.components;
        var cy = ao.y.color.components;
        var cz = ao.z.color.components;

        var colors = [
            cx[0], cx[1], cx[2], cx[0], cx[1], cx[2],
            cy[0], cy[1], cy[2], cy[0], cy[1], cy[2],
            cz[0], cz[1], cz[2], cz[0], cz[1], cz[2]
        ];

        // Adding the box
        if(this.opts.box.enabled) {
            var bx = this.opts.box.x.color.components;
            var by = this.opts.box.y.color.components;
            var bz = this.opts.box.z.color.components;

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
        var xTicks = this.opts.ticks.x, xTickOffset = ao.x.length / xTicks.count;
        var yTicks = this.opts.ticks.y, yTickOffset = ao.y.length / yTicks.count;
        var zTicks = this.opts.ticks.z, zTickOffset = ao.z.length / zTicks.count;

        // X ticks
        var pos = p[0];
        var col = xTicks.color.components;
        for(var i = 0; i < xTicks.count; i++) {
            pos += xTickOffset;
            // From
            positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                           pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, p[2] + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        pos = p[0];
        for(var i = 0; i < xTicks.count; i++) {
            pos += xTickOffset;
            // From
            positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                           pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        // Y ticks
        pos = p[1];
        col = yTicks.color.components;
        for(var i = 0; i < yTicks.count; i++) {
            pos += yTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                           p[0] + xTicks.offset.components[0] + xTicks.length, pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        pos = p[1];
        for(var i = 0; i < yTicks.count; i++) {
            pos += yTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2],
                           p[0] + xTicks.offset.components[0], pos + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        // Z ticks
        pos = p[2];
        col = zTicks.color.components;
        for(var i = 0; i < zTicks.count; i++) {
            pos += zTickOffset;
            // From
            positions.push(p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], pos + xTicks.offset.components[2],
                           p[0] + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, pos + xTicks.offset.components[2]);
            colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
        }

        pos = p[2];
        for(var i = 0; i < zTicks.count; i++) {
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
            color: new Lore.Color.fromHex('#222222')
        },
        y: {
            length: 50.0,
            color: new Lore.Color.fromHex('#222222')
        },
        z: {
            length: 50.0,
            color: new Lore.Color.fromHex('#222222')
        }
    },
    ticks: {
        x: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: new Lore.Color.fromHex('#222222')
        },
        y: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: new Lore.Color.fromHex('#222222')
        },
        z: {
            count: 10,
            length: 5.0,
            offset: new Lore.Vector3f(),
            color: new Lore.Color.fromHex('#222222')
        }
    },
    box: {
        enabled: true,
        x: {
            color: new Lore.Color.fromHex('#999999')
        },
        y: {
            color: new Lore.Color.fromHex('#999999')
        },
        z: {
            color: new Lore.Color.fromHex('#999999')
        }
    },
}
