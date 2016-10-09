Lore.Color = function(r, g, b, a) {
    if (arguments.length === 1) {
        this.components = new Float32Array(r);
    } else {
        this.components = new Float32Array(4);
        this.components[0] = r || 0.0;
        this.components[1] = g || 0.0;
        this.components[2] = b || 0.0;
        this.components[3] = a || 1.0;
    }
}

Lore.Color.prototype = {
    constructor: Lore.Color,
    set: function(r, g, b, a) {
        this.components[0] = r;
        this.components[1] = g;
        this.components[2] = b;

        if (arguments.length == 4) this.components[3] = a;
    }
}

Lore.Color.fromHex = function(hex) {
    // Thanks to Tim Down
    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    return result ? new Lore.Color(r / 255.0, g / 255.0, b / 255.0, 1.0) : null;
}

Lore.Color.hueToRgb = function(p, q, t) {
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 0.1667) return p + (q - p) * 6 * t;
    if(t < 0.5) return q;
    if(t < 0.6667) return p + (q - p) * (0.6667 - t) * 6;
    return p;
}

Lore.Color.hslToRgb = function(h, s, l) {
    var r, g, b;

    if(s == 0) {
        r = g = b = l;
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = Lore.Color.hueToRgb(p, q, h + 0.3333);
        g = Lore.Color.hueToRgb(p, q, h);
        b = Lore.Color.hueToRgb(p, q, h - 0.3333);
    }

    return [r, g, b];
}
