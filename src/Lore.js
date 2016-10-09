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

Lore.init = function(canvas) {
    // Init UI
    var ui = new Lore.UI(canvas);


    // Start the 3D stuff
    var cc = Lore.Color.fromHex('#222222');

    var renderer = new Lore.Renderer(canvas, {
        clearColor: cc,
        verbose: true,
        fps: document.getElementById('fps'),
        antialiasing: true
    });

    var coordinatesHelper = new Lore.CoordinatesHelper(renderer, 'Coordinates', 'default', {
        position: new Lore.Vector3f(0, 0, 0),
        axis: {
            x: { length: 1000, color: Lore.Color.fromHex('#cccccc') },
            y: { length: 1000, color: Lore.Color.fromHex('#cccccc') },
            z: { length: 1000, color: Lore.Color.fromHex('#cccccc') }
        },
        ticks: {
          x: { length: 20, color: Lore.Color.fromHex('#cccccc') },
          y: { length: 20, color: Lore.Color.fromHex('#cccccc') },
          z: { length: 20, color: Lore.Color.fromHex('#cccccc') }
        },
        box: {
          x: { color: Lore.Color.fromHex('#666666') },
          y: { color: Lore.Color.fromHex('#666666') },
          z: { color: Lore.Color.fromHex('#666666') }
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
