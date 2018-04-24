//@ts-check

// Detect SSR (server side rendering)
var canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
);

var Lore = require('./src/Lore');

Lore.version = '1.0.7';

Lore.getShader = function (shaderName) {
  return Lore.Shaders[shaderName].clone();
}

// By Shmiddty from stackoverflow
function Enum(a){
let i = Object
  .keys(a)
  .reduce((o, k)=>(o[a[k]] = k, o), {});

return Object.freeze(
  Object.keys(a).reduce(
    (o, k)=>(o[k] = a[k],o), v => i[v]
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

Lore.init = function(canvas, options) {
  this.opts = Lore.Utils.extend(true, Lore.defaults, options);
  
  // Lore.getGrakaInfo(canvas);
  
  var cc = Lore.Color.fromHex(this.opts.clearColor);

  var renderer = new Lore.Renderer(canvas, {
      clearColor: cc,
      verbose: true,
      fps: document.getElementById('fps'),
      center: new Lore.Vector3f(125, 125, 125),
      antialiasing: this.opts.antialiasing
  });
 
  renderer.controls.limitRotationToHorizon(this.opts.limitRotationToHorizon);

  renderer.render = function(camera, geometries) {
      for(var key in geometries) {
          geometries[key].draw(renderer);
      }
  }

  return renderer;
}

Lore.getGrakaInfo = function(targetId) {
  let canvas = document.getElementById(targetId);
  let gl = canvas.getContext('webgl') || 
           canvas.getContext('experimental-webgl');

  let info = {
      renderer: '',
      vendor: ''
  };

  let dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');
  
  if (dbgRenderInfo != null) {
      info.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
      info.vendor   = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
  }

  return info;
}

Lore.supportsHighQuality = function(targetId) {
  let info = Lore.getGrakaInfo(targetId);
  

  return false;
}

Lore.defaults = {
  clearColor: '#121212',
  limitRotationToHorizon: false,
  antialiasing: false
};

if (canUseDOM) {
  window['Lore'] = Lore
}

module.exports = Lore