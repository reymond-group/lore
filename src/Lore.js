var Lore = {
    Version: '0.0.1'
};

if (typeof define === 'function' && define.amd) {
    define('lore', Lore);
} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Lore;
}

Lore.Mouse = {
    Left: 0,
    Middle: 1,
    Right: 2
}

Lore.Keyboard = {
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Shift: 16,
    Ctrl: 17,
    Alt: 18,
    Esc: 27
}

Lore.Shaders = {};

Lore.init = function(canvas, options) {
    this.opts = Lore.Utils.extend(true, Lore.defaults, options);

    // Init UI
    var ui = new Lore.UI(canvas);


    // Start the 3D stuff
    var cc = Lore.Color.fromHex(this.opts.clearColor);

    var renderer = new Lore.Renderer(canvas, {
        clearColor: cc,
        verbose: true,
        fps: document.getElementById('fps'),
        antialiasing: false,
        center: new Lore.Vector3f(150, 150, 150)
    });

    var coordinatesHelper = new Lore.CoordinatesHelper(renderer, 'Coordinates', 'default', {
        position: new Lore.Vector3f(0, 0, 0),
        axis: {
            x: { length: 500, color: Lore.Color.fromHex('#097692') },
            y: { length: 500, color: Lore.Color.fromHex('#097692') },
            z: { length: 500, color: Lore.Color.fromHex('#097692') }
        },
        ticks: {
          x: { length: 10, color: Lore.Color.fromHex('#097692') },
          y: { length: 10, color: Lore.Color.fromHex('#097692') },
          z: { length: 10, color: Lore.Color.fromHex('#097692') }
        },
        box: {
          enabled: false,
          x: { color: Lore.Color.fromHex('#004F6E') },
          y: { color: Lore.Color.fromHex('#004F6E') },
          z: { color: Lore.Color.fromHex('#004F6E') }
        }
    });
/*
    var size = 1000;
    var positions = new Float32Array(size * 3);
    var colors = new Float32Array(size * 3)

    for(var i = 0; i < size * 3; i++) {
      positions[i] = Lore.Statistics.randomNormalScaled(0, 2000);
      colors[i] = Math.random();
    }

    pointHelper.setPositions(positions);
    pointHelper.setColors(colors);
*/
    renderer.render = function(camera, geometries) {
        for(var i = 0; i < geometries.length; i++) {
            geometries[i].draw(renderer);
        }
    }

    return renderer;
}

Lore.defaults = {
    clearColor: '#001821'
};
