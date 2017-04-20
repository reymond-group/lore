var Lore = {
    Version: '1.0.0'
};

if (typeof define === 'function' && define.amd) {
    define('lore', Lore);
} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Lore;
}

// By Shmiddty from stackoverflow
function Enum(a){
  let i = Object
    .keys(a)
    .reduce((o,k)=>(o[a[k]]=k,o),{});

  return Object.freeze(
    Object.keys(a).reduce(
      (o,k)=>(o[k]=a[k],o), v=>i[v]
    )
  );
}

Lore.Mouse = Enum({
    Left: 0,
    Middle: 1,
    Right: 2
});

Lore.Keyboard = Enum({
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Shift: 16,
    Ctrl: 17,
    Alt: 18,
    Esc: 27
});

Lore.Shaders = {};

Lore.getShader = function (shaderName) {
    return Lore.Shaders[shaderName].clone();
}

Lore.init = function(canvas, options) {
    this.opts = Lore.Utils.extend(true, Lore.defaults, options);
    
    Lore.getGrakaInfo(canvas);
    
    // Init UI
    var ui = new Lore.UI(canvas);


    // Start the 3D stuff
    var cc = Lore.Color.fromHex(this.opts.clearColor);

    var renderer = new Lore.Renderer(canvas, {
        clearColor: cc,
        verbose: true,
        fps: document.getElementById('fps'),
        center: new Lore.Vector3f(125, 125, 125),
        antialiasing: this.opts.antialiasing
    });
   
    renderer.controls.limitRotationToHorizon(this.opts.limitRotationToHorizon);
    
    var coordinatesHelper = new Lore.CoordinatesHelper(renderer, 'Coordinates', 'coordinates', {
        position: new Lore.Vector3f(0, 0, 0),
        axis: {
            x: { length: 250, color: Lore.Color.fromHex('#222222') },
            y: { length: 250, color: Lore.Color.fromHex('#222222') },
            z: { length: 250, color: Lore.Color.fromHex('#222222') }
        },
        ticks: {
          x: { length: 10, color: Lore.Color.fromHex('#1f1f1f') },
          y: { length: 10, color: Lore.Color.fromHex('#1f1f1f') },
          z: { length: 10, color: Lore.Color.fromHex('#1f1f1f') }
        },
        box: {
          enabled: true,
          x: { color: Lore.Color.fromHex('#222222') },
          y: { color: Lore.Color.fromHex('#222222') },
          z: { color: Lore.Color.fromHex('#222222') }
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
        for(var key in geometries) {
            geometries[key].draw(renderer);
        }
    }

    return renderer;
}

Lore.getGrakaInfo = function(targetId) {
    let canvas = document.getElementById(targetId);
    let gl = canvas.getContext('webgl');

    let info = {
        renderer: '',
        vendor: ''
    };

    let dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    if (dbgRenderInfo != null) {
        info.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
        info.vendor   = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
    }
    
    console.log(info);

    return info;
}

Lore.defaults = {
    clearColor: '#121212',
    limitRotationToHorizon: false,
    antialiasing: false
};
