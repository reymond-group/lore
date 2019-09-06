(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

//@ts-check
// Detect SSR (server side rendering)
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var Lore = require('./src/Lore'); // By Shmiddty from stackoverflow


function Enum(a) {
  let i = Object.keys(a).reduce((o, k) => (o[a[k]] = k, o), {});
  return Object.freeze(Object.keys(a).reduce((o, k) => (o[k] = a[k], o), v => i[v]));
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

Lore.init = function (canvas, options) {
  this.opts = Lore.Utils.extend(true, Lore.defaults, options); // Lore.getGrakaInfo(canvas);

  var cc = Lore.Core.Color.fromHex(this.opts.clearColor);
  var renderer = new Lore.Core.Renderer(canvas, {
    clearColor: cc,
    verbose: true,
    fps: document.getElementById('fps'),
    center: new Lore.Math.Vector3f(125, 125, 125),
    antialiasing: this.opts.antialiasing,
    alphaBlending: this.opts.alphaBlending,
    preserveDrawingBuffer: this.opts.preserveDrawingBuffer
  });
  renderer.controls.limitRotationToHorizon(this.opts.limitRotationToHorizon);

  renderer.render = function (camera, geometries) {
    for (var key in geometries) {
      geometries[key].draw(renderer);
    }
  };

  return renderer;
};

Lore.getGrakaInfo = function (targetId) {
  let canvas = document.getElementById(targetId);
  let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  let info = {
    renderer: '',
    vendor: ''
  };
  let dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');

  if (dbgRenderInfo != null) {
    info.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
    info.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
  }

  return info;
};

Lore.supportsHighQuality = function (targetId) {
  let info = Lore.getGrakaInfo(targetId);
  return false;
};

Lore.defaults = {
  clearColor: '#121212',
  limitRotationToHorizon: false,
  antialiasing: false,
  preserveDrawingBuffer: false
};

if (canUseDOM) {
  window['Lore'] = Lore;
}

module.exports = Lore;

},{"./src/Lore":36}],2:[function(require,module,exports){
"use strict";

//@ts-check
const Node = require('../Core/Node');

const ProjectionMatrix = require('../Math/ProjectionMatrix');

const Matrix4f = require('../Math/Matrix4f');

const Vector3f = require('../Math/Vector3f');
/** 
 * An abstract class representing the base for camera implementations. 
 * 
 * @property {string} type The type name of this object (Lore.CameraBase).
 * @property {Renderer} renderer A Lore.Renderer object.
 * @property {boolean} isProjectionMatrixStale A boolean indicating whether or not the projection matrix was changed and has to be updated.
 * @property {ProjectionMatrix} projectionMatrix A Lore.ProjectionMatrix object.
 * @property {Matrix4f} viewMatrix A Lore.Matrix4f object representing the view matrix for this camera.
 * */


class CameraBase extends Node {
  /**
   * Creates an instance of CameraBase.
   */
  constructor() {
    super();
    this.type = 'Lore.CameraBase';
    this.renderer = null;
    this.isProjectionMatrixStale = false;
    this.isViewMatrixStale = false;
    this.projectionMatrix = new ProjectionMatrix();
    this.viewMatrix = new Matrix4f();
    this.near = 0.0;
    this.far = 1000.0;
  }
  /**
   * Initializes this camera instance.
   * 
   * @param {any} gl A gl context.
   * @param {any} program A program pointer.
   * @returns {CameraBase} Returns itself.
   */


  init(gl, program) {
    this.gl = gl;
    this.program = program;
    return this;
  }
  /**
   * Sets the lookat of this camera instance.
   * 
   * @param {Vector3f} vec The vector to set the lookat to.
   * @returns {CameraBase} Returns itself.
   */


  setLookAt(vec) {
    this.rotation.lookAt(this.position, vec, Vector3f.up());
    return this;
  }
  /**
   * Has to be called when the viewport size changes (e.g. window resize).
   * 
   * @param {Number} width The width of the viewport.
   * @param {Number} height The height of the viewport.
   * 
   * @returns {CameraBase} Returns itself.
   */


  updateViewport(width, height) {
    return this;
  }
  /**
   * Virtual Method
   * 
   * @returns {CameraBase} Returns itself.
   */


  updateProjectionMatrix() {
    return this;
  }
  /**
   * Upates the view matrix of this camera.
   * 
   * @returns {CameraBase} Returns itself.
   */


  updateViewMatrix() {
    this.update();
    let viewMatrix = this.modelMatrix.clone();
    viewMatrix.invert();
    this.viewMatrix = viewMatrix;
    this.isViewMatrixStale = true;
    return this;
  }
  /**
   * Returns the projection matrix of this camera instance as an array.
   * 
   * @returns {Float32Array} The entries of the projection matrix.
   */


  getProjectionMatrix() {
    return this.projectionMatrix.entries;
  }
  /**
   * Returns the view matrix of this camera instance as an array.
   * 
   * @returns {Float32Array} The entries of the view matrix.
   */


  getViewMatrix() {
    return this.viewMatrix.entries;
  }
  /**
   * Projects a vector into screen space.
   * 
   * @param {Vector3f} vec A vector.
   * @param {Renderer} renderer An instance of a Lore renderer.
   * @returns {Array} An array containing the x and y position in screen space.
   */


  sceneToScreen(vec, renderer) {
    let vector = vec.clone();
    let canvas = renderer.canvas;
    Matrix4f.projectVector(vector, this); // Map to 2D screen space
    // Correct for high dpi display by dividing by device pixel ratio

    let x = Math.round((vector.components[0] + 1) * canvas.width / 2) / renderer.devicePixelRatio;
    let y = Math.round((-vector.components[1] + 1) * canvas.height / 2) / renderer.devicePixelRatio;
    return [x, y];
  }

}

module.exports = CameraBase;

},{"../Core/Node":16,"../Math/Matrix4f":38,"../Math/ProjectionMatrix":39,"../Math/Vector3f":45}],3:[function(require,module,exports){
"use strict";

//@ts-check
const CameraBase = require('./CameraBase');
/** 
 * A class representing an orthographic camera. 
 * 
 * @property {number} [zoom=1.0] The zoom value of this camera.
 * @property {number} left The left border of the frustum.
 * @property {number} right The right border of the frustum.
 * @property {number} top The top border of the frustum.
 * @property {number} bottom The bottom border of the frustum.
 * @property {number} near The near plane distance of the frustum.
 * @property {number} far The far plane distance of the frustum.
 * */


class OrthographicCamera extends CameraBase {
  /**
   * Creates an instance of OrthographicCamera.
   * @param {Number} left Left extend of the viewing volume.
   * @param {Number} right Right extend of the viewing volume.
   * @param {Number} top Top extend of the viewing volume.
   * @param {Number} bottom Bottom extend of the viewing volume.
   * @param {Number} near Near extend of the viewing volume.
   * @param {Number} far Far extend of the viewing volume.
   */
  constructor(left, right, top, bottom, near = 0.1, far = 2500) {
    super();
    this.type = 'Lore.OrthographicCamera';
    this.zoom = 1.0;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }
  /**
   * Updates the projection matrix of this orthographic camera.
   * 
   * @returns {OrthographicCamera} Returns itself.
   */


  updateProjectionMatrix() {
    let width = (this.right - this.left) / (2.0 * this.zoom);
    let height = (this.top - this.bottom) / (2.0 * this.zoom);
    let x = (this.right + this.left) / 2.0;
    let y = (this.top + this.bottom) / 2.0;
    let left = x - width;
    let right = x + width;
    let top = y + height;
    let bottom = y - height;
    this.projectionMatrix.setOrthographic(left, right, top, bottom, this.near, this.far);
    this.isProjectionMatrixStale = true;
    return this;
  }
  /**
   * Has to be called when the viewport size changes (e.g. window resize).
   * 
   * @param {Number} width The width of the viewport.
   * @param {Number} height The height of the viewport.
   * 
   * @returns {OrthographicCamera} Returns itself.
   */


  updateViewport(width, height) {
    this.left = -width / 2.0;
    this.right = width / 2.0;
    this.top = height / 2.0;
    this.bottom = -height / 2.0;
    return this;
  }

}

module.exports = OrthographicCamera;

},{"./CameraBase":2}],4:[function(require,module,exports){
"use strict";

//@ts-check
const CameraBase = require('./CameraBase');
/** A class representing an perspective camera. */


class PerspectiveCamera extends CameraBase {
  /**
   * Creates an instance of PerspectiveCamera.
   * @param {Number} fov The field of view.
   * @param {Number} aspect The aspect ration (width / height).
   * @param {Number} near Near extend of the viewing volume.
   * @param {Number} far Far extend of the viewing volume.
   */
  constructor(fov, aspect, near = 0.1, far = 2500) {
    super();
    this.type = 'Lore.PerspectiveCamera'; // TODO: There shouldn't be a zoom here. The problem is, that the orbital controls
    // and also the point helper and zoom rely on it. However, for the perspective camera,
    // zooming is achieved by adjusting the fov. 

    this.zoom = 1.0;
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }
  /**
   * Updates the projection matrix of this perspective camera.
   * 
   * @returns {PerspectiveCamera} Returns itself.
   */


  updateProjectionMatrix() {
    this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
    this.isProjectionMatrixStale = true;
    return this;
  }
  /**
   * Has to be called when the viewport size changes (e.g. window resize).
   * 
   * @param {Number} width The width of the viewport.
   * @param {Number} height The height of the viewport.
   * 
   * @returns {PerspectiveCamera} Returns itself.
   */


  updateViewport(width, height) {
    this.aspect = width / height;
    return this;
  }

}

module.exports = PerspectiveCamera;

},{"./CameraBase":2}],5:[function(require,module,exports){
"use strict";

const CameraBase = require('./CameraBase');

const OrthographicCamera = require('./OrthographicCamera');

const PerspectiveCamera = require('./PerspectiveCamera');

module.exports = {
  CameraBase,
  OrthographicCamera,
  PerspectiveCamera
};

},{"./CameraBase":2,"./OrthographicCamera":3,"./PerspectiveCamera":4}],6:[function(require,module,exports){
"use strict";

//@ts-check
const Vector3f = require("../Math/Vector3f");
/**
 * An abstract class representing the base for controls implementations.
 *
 * @property {Renderer} renderer A Lore Renderer instance.
 * @property {CameraBase} camera A Lore CameraBase extending object.
 * @property {HTMLCanvasElement} canvas A HTMLCanvasElement.
 * @property {Number} lowFps The FPS limit when throttling FPS.
 * @property {Number} highFps The FPS limit when not throttling FPS.
 * @property {String} touchMode The current touch mode.
 * @property {Vector3f} lookAt The current lookat associated with these controls.
 */


class ControlsBase {
  /**
   * Creates an instance of ControlsBase.
   * @param {Renderer} renderer An instance of a Lore renderer.
   * @param {Vector3f} [lookAt=new Vector3f()] The look at vector of the controls.
   * @param {Boolean} [enableVR=false] Whether or not to track phone spatial information using the WebVR API.
   */
  constructor(renderer, lookAt = new Vector3f(0.0, 0.0, 0.0), enableVR = false) {
    this.renderer = renderer;
    this.camera = renderer.camera;
    this.canvas = renderer.canvas;
    this.lowFps = 15;
    this.highFps = 30;
    this._eventListeners = {};
    this.renderer.setMaxFps(this.lowFps);
    this.touchMode = "drag";
    this.lookAt = lookAt;
    this.mouse = {
      previousPosition: {
        x: null,
        y: null
      },
      delta: {
        x: 0.0,
        y: 0.0
      },
      position: {
        x: 0.0,
        y: 0.0
      },
      state: {
        left: false,
        middle: false,
        right: false
      },
      normalizedPosition: {
        x: 0.0,
        y: 0.0
      },
      touches: 0,
      pointerCache: []
    };
    this.keyboard = {
      alt: false,
      ctrl: false,
      shift: false
    };
    this.VR = {};
    let that = this; // this.canvas.addEventListener("pointerdown", e => {
    //   console.log("ponterdown");
    //   console.log(e);
    // });

    this.canvas.addEventListener("pointermove", function (e) {
      // Find this event in the cache and update its record with this event
      for (var i = 0; i < that.mouse.pointerCache.length; i++) {
        if (e.pointerId == that.mouse.pointerCache[i].pointerId) {
          that.mouse.pointerCache[i] = e;
          break;
        }
      }

      console.log(that.mouse.pointerCache);

      if (that.mouse.previousPosition.x !== null && that.mouse.state.left || that.mouse.state.middle || that.mouse.state.right) {
        console.log("...");
        that.mouse.delta.x = e.pageX - that.mouse.previousPosition.x;
        that.mouse.delta.y = e.pageY - that.mouse.previousPosition.y;
        that.mouse.position.x += 0.01 * that.mouse.delta.x;
        that.mouse.position.y += 0.01 * that.mouse.delta.y; // Give priority to left, then middle, then right

        if (that.mouse.state.left) {
          that.raiseEvent("mousedrag", {
            e: that.mouse.delta,
            source: "left"
          });
        } else if (that.mouse.state.middle) {
          that.raiseEvent("mousedrag", {
            e: that.mouse.delta,
            source: "middle"
          });
        } else if (that.mouse.state.right) {
          that.raiseEvent("mousedrag", {
            e: that.mouse.delta,
            source: "right"
          });
        }
      } // Set normalized mouse position


      let rect = that.canvas.getBoundingClientRect();
      let s = that.renderer.devicePixelRatio;
      that.mouse.normalizedPosition.x = (e.clientX - rect.left * s) / that.canvas.width * s * 2 - 1;
      that.mouse.normalizedPosition.y = -((e.clientY - rect.top * s) / that.canvas.height * s) * 2 + 1;
      that.raiseEvent("mousemove", {
        e: that
      });
      that.mouse.previousPosition.x = e.pageX;
      that.mouse.previousPosition.y = e.pageY;
    }); // this.canvas.addEventListener("touchstart", function(e) {
    //   that.mouse.touches++;
    //   let touch = e.touches[0];
    //   e.preventDefault();
    //   that.mouse.touched = true;
    //   that.renderer.setMaxFps(that.highFps);
    //   // This is for selecting stuff when touching but not moving
    //   // Set normalized mouse position
    //   let rect = that.canvas.getBoundingClientRect();
    //   that.mouse.normalizedPosition.x =
    //     ((touch.clientX - rect.left) / that.canvas.width) * 2 - 1;
    //   that.mouse.normalizedPosition.y =
    //     -((touch.clientY - rect.top) / that.canvas.height) * 2 + 1;
    //   if (that.touchMode !== "drag") {
    //     that.raiseEvent("mousemove", {
    //       e: that
    //     });
    //   }
    //   that.raiseEvent("mousedown", {
    //     e: that,
    //     source: "touch"
    //   });
    // });
    // this.canvas.addEventListener("touchend", function(e) {
    //   that.mouse.touches--;
    //   e.preventDefault();
    //   that.mouse.touched = false;
    //   // Reset the previous position and delta of the mouse
    //   that.mouse.previousPosition.x = null;
    //   that.mouse.previousPosition.y = null;
    //   that.renderer.setMaxFps(that.lowFps);
    //   that.raiseEvent("mouseup", {
    //     e: that,
    //     source: "touch"
    //   });
    // });
    // this.canvas.addEventListener("touchmove", function(e) {
    //   let touch = e.touches[0];
    //   let source = "left";
    //   if (that.mouse.touches == 2) source = "right";
    //   e.preventDefault();
    //   if (that.mouse.previousPosition.x !== null && that.mouse.touched) {
    //     that.mouse.delta.x = touch.pageX - that.mouse.previousPosition.x;
    //     that.mouse.delta.y = touch.pageY - that.mouse.previousPosition.y;
    //     that.mouse.position.x += 0.01 * that.mouse.delta.x;
    //     that.mouse.position.y += 0.01 * that.mouse.delta.y;
    //     if (that.touchMode === "drag")
    //       that.raiseEvent("mousedrag", {
    //         e: that.mouse.delta,
    //         source: source
    //       });
    //   }
    //   // Set normalized mouse position
    //   let rect = that.canvas.getBoundingClientRect();
    //   that.mouse.normalizedPosition.x =
    //     ((touch.clientX - rect.left) / that.canvas.width) * 2 - 1;
    //   that.mouse.normalizedPosition.y =
    //     -((touch.clientY - rect.top) / that.canvas.height) * 2 + 1;
    //   if (that.touchMode !== "drag")
    //     that.raiseEvent("mousemove", {
    //       e: that
    //     });
    //   that.mouse.previousPosition.x = touch.pageX;
    //   that.mouse.previousPosition.y = touch.pageY;
    // });

    let wheelevent = "mousewheel";
    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) wheelevent = "DOMMouseScroll";
    this.canvas.addEventListener(wheelevent, function (e) {
      if (that.isInIframe() && !e.ctrlKey) {
        return;
      }

      e.preventDefault();
      let delta = "wheelDelta" in e ? e.wheelDelta : -40 * e.detail;
      that.raiseEvent("mousewheel", {
        e: delta
      });
    });
    this.canvas.addEventListener("keydown", function (e) {
      if (e.which == 16) {
        that.keyboard.shift = true;
      } else if (e.which == 17) {
        that.keyboard.ctrl = true;
      } else if (e.which == 18) {
        that.keyboard.alt = true;
      }

      that.raiseEvent("keydown", {
        e: e.which
      });
    });
    this.canvas.addEventListener("keyup", function (e) {
      if (e.which == 16) {
        that.keyboard.shift = false;
      } else if (e.which == 17) {
        that.keyboard.ctrl = false;
      } else if (e.which == 18) {
        that.keyboard.alt = false;
      }

      that.raiseEvent("keyup", {
        e: e.which
      });
    });
    this.canvas.addEventListener("pointerdown", function (e) {
      let btn = e.button;
      let source = "left";
      that.mouse.pointerCache.push(e); // Only handle single button events

      if (btn == 0) {
        that.mouse.state.left = true;
      } else if (btn == 1) {
        that.mouse.state.middle = true;
        source = "middle";
      } else if (btn == 2) {
        that.mouse.state.right = true;
        source = "right";
      }

      that.renderer.setMaxFps(that.highFps);
      that.raiseEvent("mousedown", {
        e: that,
        source: source
      });
    });
    this.canvas.addEventListener("click", function (e) {
      let btn = e.button;
      let source = "left";
      that.raiseEvent("click", {
        e: that,
        source: source
      });
    });
    this.canvas.addEventListener("dblclick", function (e) {
      let btn = e.button;
      let source = "left";
      that.raiseEvent("dblclick", {
        e: that,
        source: source
      });
    }); // This function is added to multiple pointer events

    let pointerUpEvent = function (e) {
      let btn = e.button;
      console.log(e.button);
      let source = "left";
      that.removeEvent(e); // Only handle single button events

      if (btn == 0) {
        that.mouse.state.left = false;
      } else if (btn == 1) {
        that.mouse.state.middle = false;
        source = "middle";
      } else if (btn == 2) {
        that.mouse.state.right = false;
        source = "right";
      } // Reset the previous position and delta of the mouse


      that.mouse.previousPosition.x = null;
      that.mouse.previousPosition.y = null;
      that.mouse.state.left = false;
      that.mouse.state.middle = false;
      that.mouse.state.right = false;
      that.renderer.setMaxFps(that.lowFps);
      that.raiseEvent("mouseup", {
        e: that,
        source: source
      });
    };

    this.canvas.addEventListener("pointerup", function (e) {
      pointerUpEvent(e);
    });
    this.canvas.addEventListener("pointercancel", function (e) {
      pointerUpEvent(e);
    });
    this.canvas.addEventListener("pointerleave", function (e) {
      pointerUpEvent(e);
    }); // this.canvas.addEventListener("mouseleave", function(e) {
    //   that.mouse.state.left = false;
    //   that.mouse.state.middle = false;
    //   that.mouse.state.right = false;
    //   that.mouse.previousPosition.x = null;
    //   that.mouse.previousPosition.y = null;
    //   that.renderer.setMaxFps(that.lowFps);
    //   that.raiseEvent("mouseleave", {
    //     e: that,
    //     source: that.canvas
    //   });
    // });
  }
  /**
   * Initialiizes WebVR, if the API is available and the device suppports it.
   */

  /*
  initWebVR() {
    if (navigator && navigator.getVRDevices) {
      navigator.getVRDisplays().then(function (displays) {
        if (displays.length === 0) {
          return;
        }
         for (var i = 0; i < displays.length; ++i) {
         }
      });
    }
  }
  */

  /**
   * Adds an event listener to this controls instance.
   *
   * @param {String} eventName The name of the event that is to be listened for.
   * @param {Function} callback A callback function to be called on the event being fired.
   */


  addEventListener(eventName, callback) {
    if (!this._eventListeners[eventName]) {
      this._eventListeners[eventName] = [];
    }

    this._eventListeners[eventName].push(callback);
  }
  /**
   * Remove an event listener from this controls instance.
   *
   * @param {String} eventName The name of the event that is to be listened for.
   * @param {Function} callback A callback function to be called on the event being fired.
   */


  removeEventListener(eventName, callback) {
    if (!this._eventListeners.hasOwnProperty(eventName)) {
      return;
    }

    let index = this._eventListeners[eventName].indexOf(callback);

    if (index > -1) {
      this._eventListeners[eventName].splice(index, 1);
    }
  }
  /**
   * Raises an event.
   *
   * @param {String} eventName The name of the event to be raised.
   * @param {*} [data={}] The data to be supplied to the callback function.
   */


  raiseEvent(eventName, data = {}) {
    if (this._eventListeners[eventName]) {
      for (let i = 0; i < this._eventListeners[eventName].length; i++) {
        this._eventListeners[eventName][i](data);
      }
    }
  }
  /**
   * Returns the current look at vector associated with this controls.
   *
   * @returns {Vector3f} The current look at vector.
   */


  getLookAt() {
    return this.lookAt;
  }
  /**
   * Sets the lookat vector, which is the center of the orbital camera sphere.
   *
   * @param {Vector3f} lookAt The lookat vector.
   * @returns {ControlsBase} Returns itself.
   */


  setLookAt(lookAt) {
    //this.camera.position = new Vector3f(this.radius, this.radius, this.radius);
    this.lookAt = lookAt.clone();
    this.update();
    return this;
  }
  /**
   * Update the camera (on mouse move, touch drag, mousewheel scroll, ...).
   *
   * @param {*} [e=null] A mouse or touch events data.
   * @param {String} [source=null] The source of the input ('left', 'middle', 'right', 'wheel', ...).
   * @returns {ControlsBase} Returns itself.
   */


  update(e = null, source = null) {
    return this;
  }
  /**
   * Checks whether the script is being run in an IFrame.
   *
   * @returns {Boolean} Returns whether the script is run in an IFrame.
   */


  isInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  /**
   * Removes a pointer event from the event cache.
   *
   * @param {PointerEvent} e
   */


  removeEvent(e) {
    // Remove this event from the target's cache
    for (var i = 0; i < this.mouse.pointerCache.length; i++) {
      if (this.mouse.pointerCache[i].pointerId == e.pointerId) {
        this.mouse.pointerCache.splice(i, 1);
        break;
      }
    }
  }

}

module.exports = ControlsBase;

},{"../Math/Vector3f":45}],7:[function(require,module,exports){
"use strict";

//@ts-check
const ControlsBase = require('../Controls/ControlsBase');

const Vector3f = require('../Math/Vector3f');
/** A class representing orbital controls. */


class FirstPersonControls extends ControlsBase {
  /**
   * Creates an instance of FirstPersonControls.
   * @param {Renderer} renderer An instance of a Lore renderer.
   */
  constructor(renderer, radius) {
    super(renderer);
    this.up = Vector3f.up();
    this.renderer = renderer;
    this.camera = renderer.camera;
    this.canvas = renderer.canvas;
    this.camera.position = new Vector3f(radius, radius, radius);
    this.camera.updateProjectionMatrix();
    this.camera.updateViewMatrix();
    this.rotationLocked = false;
    let that = this;
    this.addEventListener('mousedrag', function (e) {
      that.update(e.e, e.source);
    }); // Initial update

    this.update({
      x: 0,
      y: 0
    }, 'left');
  }
  /**
   * Update the camera (on mouse move, touch drag, mousewheel scroll, ...).
   * 
   * @param {any} e A mouse or touch events data.
   * @param {String} source The source of the input ('left', 'middle', 'right', 'wheel', ...).
   * @returns {FirstPersonControls} Returns itself.
   */


  update(e, source) {
    if (source === 'left') {} // Move forward here
    // Update the camera


    let offset = this.camera.position.clone().subtract(this.lookAt);
    this.camera.position.copyFrom(this.lookAt).add(offset);
    this.camera.setLookAt(this.lookAt);
    this.camera.updateViewMatrix();
    this.raiseEvent('updated');
    return this;
  }

}

module.exports = FirstPersonControls;

},{"../Controls/ControlsBase":6,"../Math/Vector3f":45}],8:[function(require,module,exports){
"use strict";

//@ts-check
const ControlsBase = require('../Controls/ControlsBase');

const Vector3f = require('../Math/Vector3f');

const SphericalCoords = require('../Math/SphericalCoords');
/** 
 * A class representing orbital controls.
 * 
 * @property {Vector3f} up The global up vector.
 * @property {Number} radius The distance from the camera to the lookat vector.
 * @property {Number} [yRotationLimit=Math.PI] The limit for the vertical rotation.
 * @property {SphericalCoords} spherical The spherical coordinates of the camera on the sphere around the lookat vector.
 * @property {Number} scale The sensitivity scale.
 * @property {CameraBase} camera The camera associated with these controls.
 */


class OrbitalControls extends ControlsBase {
  /**
   * Creates an instance of OrbitalControls.
   * @param {Renderer} renderer An instance of a Lore renderer.
   * @param {Number} radius The distance of the camera to the lookat vector.
   * @param {Vector3f} lookAt The lookat vector.
   */
  constructor(renderer, radius, lookAt = new Vector3f(0.0, 0.0, 0.0)) {
    super(renderer, lookAt);
    this.up = Vector3f.up();
    this.radius = radius;
    this.yRotationLimit = Math.PI;
    this._dPhi = 0.0;
    this._dTheta = 0.0;
    this._dPan = new Vector3f(0.0, 0.0, 0.0);
    this.spherical = new SphericalCoords();
    this.scale = 0.95;
    this.camera.position = new Vector3f(radius, radius, radius);
    this.camera.updateProjectionMatrix();
    this.camera.updateViewMatrix();
    this.rotationLocked = false;
    let that = this;
    this.addEventListener('mousedrag', function (e) {
      that.update(e.e, e.source);
    });
    this.addEventListener('mousewheel', function (e) {
      that.update({
        x: 0,
        y: -e.e
      }, 'wheel');
    }); // Initial update

    this.update({
      x: 0,
      y: 0
    }, 'left');
  }
  /**
   * Limit the vertical rotation to the horizon (the upper hemisphere).
   * 
   * @param {Boolean} limit A boolean indicating whether or not to limit the vertical rotation to the horizon.
   * @returns {OrbitalControls} Returns itself.
   */


  limitRotationToHorizon(limit) {
    if (limit) {
      this.yRotationLimit = 0.5 * Math.PI;
    } else {
      this.yRotationLimit = Math.PI;
    }

    return this;
  }
  /**
   * Sets the distance (radius of the sphere) from the lookat vector to the camera.
   * 
   * @param {Number} radius The radius.
   * @returns {OrbitalControls} Returns itself.
   */


  setRadius(radius) {
    this.radius = radius;
    this.camera.position = new Vector3f(0, 0, radius);
    this.camera.updateProjectionMatrix();
    this.camera.updateViewMatrix();
    this.update();
    return this;
  }
  /**
   * Update the camera (on mouse move, touch drag, mousewheel scroll, ...).
   * 
   * @param {*} [e=null] A mouse or touch events data.
   * @param {String} [source=null] The source of the input ('left', 'middle', 'right', 'wheel', ...).
   * @returns {OrbitalControls} Returns itself.
   */


  update(e = null, source = null) {
    if (source == 'left' && !this.rotationLocked) {
      // Rotate
      this._dTheta = -2 * Math.PI * e.x / (this.canvas.clientWidth * this.camera.zoom);
      this._dPhi = -2 * Math.PI * e.y / (this.canvas.clientHeight * this.camera.zoom); // It's just to fast like this ...
      // this._dTheta = -2 * Math.PI * e.x / this.canvas.clientWidth;
      // this._dPhi = -2 * Math.PI * e.y / this.canvas.clientHeight;
    } else if (source == 'right' || source == 'left' && this.rotationLocked) {
      // Translate
      let x = e.x * (this.camera.right - this.camera.left) / this.camera.zoom / this.canvas.clientWidth;
      let y = e.y * (this.camera.top - this.camera.bottom) / this.camera.zoom / this.canvas.clientHeight;
      let u = this.camera.getUpVector().components;
      let r = this.camera.getRightVector().components;
      this._dPan.components[0] = r[0] * -x + u[0] * y;
      this._dPan.components[1] = r[1] * -x + u[1] * y;
      this._dPan.components[2] = r[2] * -x + u[2] * y;
    } else if (source == 'middle' || source == 'wheel') {
      if (e.y > 0) {
        // Zoom Out
        this.camera.zoom = Math.max(0, this.camera.zoom * this.scale);
        this.camera.updateProjectionMatrix();
        this.raiseEvent('zoomchanged', this.camera.zoom);
      } else if (e.y < 0) {
        // Zoom In
        this.camera.zoom = Math.max(0, this.camera.zoom / this.scale);
        this.camera.updateProjectionMatrix();
        this.raiseEvent('zoomchanged', this.camera.zoom);
      }
    } // Update the camera


    let offset = this.camera.position.clone().subtract(this.lookAt);
    this.spherical.setFromVector(offset);
    this.spherical.components[1] += this._dPhi;
    this.spherical.components[2] += this._dTheta;
    this.spherical.limit(0, this.yRotationLimit, -Infinity, Infinity);
    this.spherical.secure(); // Limit radius here

    this.lookAt.add(this._dPan);
    offset.setFromSphericalCoords(this.spherical);
    this.camera.position.copyFrom(this.lookAt).add(offset);
    this.camera.setLookAt(this.lookAt);
    this.camera.updateViewMatrix();
    this._dPhi = 0.0;
    this._dTheta = 0.0;

    this._dPan.set(0, 0, 0);

    this.raiseEvent('updated');
    return this;
  }
  /**
   * Moves the camera around the sphere by spherical coordinates.
   * 
   * @param {Number} phi The phi component of the spherical coordinates.
   * @param {Number} theta The theta component of the spherical coordinates.
   * @returns {OrbitalControls} Returns itself.
   */


  setView(phi, theta) {
    let offset = this.camera.position.clone().subtract(this.lookAt);
    this.spherical.setFromVector(offset);
    this.spherical.components[1] = phi;
    this.spherical.components[2] = theta;
    this.spherical.secure();
    offset.setFromSphericalCoords(this.spherical);
    this.camera.position.copyFrom(this.lookAt).add(offset);
    this.camera.setLookAt(this.lookAt);
    this.camera.updateViewMatrix();
    this.raiseEvent('updated');
    return this;
  }
  /**
   * Zoom in on the lookat vector.
   * 
   * @returns {OrbitalControls} Returns itself.
   */


  zoomIn() {
    this.camera.zoom = Math.max(0, this.camera.zoom / this.scale);
    this.camera.updateProjectionMatrix();
    this.raiseEvent('zoomchanged', this.camera.zoom);
    this.raiseEvent('updated');
    return this;
  }
  /**
   * Zoom out from the lookat vector.
   * 
   * @returns {OrbitalControls} Returns itself.
   */


  zoomOut() {
    this.camera.zoom = Math.max(0, this.camera.zoom * this.scale);
    this.camera.updateProjectionMatrix();
    this.raiseEvent('zoomchanged', this.camera.zoom);
    this.raiseEvent('updated');
    return this;
  }
  /**
   * Set the zoom to a given value.
   * 
   * @param {Number} zoom The zoom value.
   * @returns {OrbitalControls} Returns itself.
   */


  setZoom(zoom) {
    this.camera.zoom = zoom;
    this.camera.updateProjectionMatrix();
    this.raiseEvent('zoomchanged', this.camera.zoom);
    this.update();
    return this;
  }
  /**
   * Get the zoom.
   * 
   * @returns {Number} The zoom value.
   */


  getZoom() {
    return this.camera.zoom;
  }
  /**
   * Set the camera to the top view (locks rotation).
   * 
   * @returns {OrbitalControls} Returns itself.
   */


  setTopView() {
    this.setView(0.0, 2.0 * Math.PI);
    this.rotationLocked = true;
    return this;
  }
  /**
   * Set the camera to the bottom view (locks rotation).
   * 
   * @returns {OrbitalControls} Returns itself.
   */


  setBottomView() {
    this.setView(0.0, 0.0);
    this.rotationLocked = true;
    return this;
  }
  /**
   * Set the camera to the right view (locks rotation).
   * 
   * @returns {OrbitalControls} Returns itself.
   */


  setRightView() {
    this.setView(0.5 * Math.PI, 0.5 * Math.PI);
    this.rotationLocked = true;
    return this;
  }
  /**
   * Set the camera to the left view (locks rotation).
   * 
   * @returns {OrbitalControls} Returns itself.
   */


  setLeftView() {
    this.setView(0.5 * Math.PI, -0.5 * Math.PI);
    this.rotationLocked = true;
    return this;
  }
  /**
   * Set the camera to the front view (locks rotation).
   * 
   * @returns {OrbitalControls} Returns itself.
   */


  setFrontView() {
    this.setView(0.5 * Math.PI, 2.0 * Math.PI);
    this.rotationLocked = true;
    return this;
  }
  /**
   * Set the camera to the back view (locks rotation).
   * 
   * @returns {OrbitalControls} Returns itself.
   */


  setBackView() {
    this.setView(0.5 * Math.PI, Math.PI);
    this.rotationLocked = true;
    return this;
  }
  /**
   * Set the camera to free view (unlocks rotation).
   * 
   * @returns {OrbitalControls} Returns itself.
   */


  setFreeView() {
    this.setView(0.25 * Math.PI, 0.25 * Math.PI);
    this.rotationLocked = false;
    return this;
  }

}

module.exports = OrbitalControls;

},{"../Controls/ControlsBase":6,"../Math/SphericalCoords":43,"../Math/Vector3f":45}],9:[function(require,module,exports){
"use strict";

const ControlsBase = require('./ControlsBase');

const FirstPersonControls = require('./FirstPersonControls');

const OrbitalControls = require('./OrbitalControls');

module.exports = {
  ControlsBase,
  FirstPersonControls,
  OrbitalControls
};

},{"./ControlsBase":6,"./FirstPersonControls":7,"./OrbitalControls":8}],10:[function(require,module,exports){
"use strict";

//@ts-check
const Vector3f = require('../Math/Vector3f');
/** 
 * A class representing an attribute. 
 * 
 * @property {String} type The type name of this object (Lore.Attribute).
 * @property {*} data The data represented by the attribute in a 1D array. Usually a Float32Array.
 * @property {Number} [attributeLength=3] The length of the attribute. '3' for Vector3f.
 * @property {String} name The name of this attribut. Must be the name used by the shader.
 * @property {Number} size The length of the attribute values (defined as data.length / attributeLength).
 * @property {WebGLBuffer} buffer The bound WebGLBuffer.
 * @property {GLint} attributeLocation The attribute location for this attribute.
 * @property {GLenum} bufferType The buffer target. As of WebGL 1: gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER.
 * @property {GLenum} drawMode The draw mode. As of WebGL 1: gl.STATIC_DRAW, gl.DYNAMIC_DRAW or gl.STREAM_DRAW.
 * @property {Boolean} stale A boolean indicating whether or not this attribute has changed and needs to be updated.
 */


class Attribute {
  /**
   * Creates an instance of Attribute.
   * @param {*} data The data represented by the attribute in a 1D array. Usually a Float32Array.
   * @param {Number} attributeLength The length of the attribute (3 for RGB, XYZ, ...).
   * @param {String} name The name of the attribute.
   */
  constructor(data, attributeLength, name) {
    this.type = 'Lore.Attribute';
    this.data = data;
    this.attributeLength = attributeLength || 3;
    this.name = name;
    this.size = this.data.length / this.attributeLength;
    this.buffer = null;
    this.attributeLocation;
    this.bufferType = null;
    this.drawMode = null;
    this.stale = false;
  }
  /**
   * Set the attribute value from a vector at a given index. The vector should have the same number of components as is the length of this attribute.
   * 
   * @param {Number} index The index at which to replace / set the value (is calculated as index * attributeLength).
   * @param {Vector3f} v A vector.
   */


  setFromVector(index, v) {
    this.data.set(v.components, index * this.attributeLength, v.components.length);
  }
  /**
   * Set the attribute values from vectors in an array.
   * 
   * @param {Vector3f[]} arr An array containing vectors. The number of components of the vectors must have the same length as the attribute length specified.
   */


  setFromVectorArray(arr) {
    if (this.attributeLength !== arr[0].components.length) throw 'The attribute has a length of ' + this.attributeLength + '. But the vectors have ' + arr[0].components.length + ' components.';

    for (let i = 0; i < arr.length; i++) {
      this.data.set(arr[i].components, i * this.attributeLength, arr[i].components.length);
    }
  }
  /**
   * Gets the x value at a given index.
   * 
   * @param {Number} index The index.
   * @returns {Number} The x value at a given index.
   */


  getX(index) {
    return this.data[index * this.attributeLength];
  }
  /**
   * Set the x value at a given index.
   * 
   * @param {Number} index The index.
   * @param {Number} value A number.
   */


  setX(index, value) {
    this.data[index * this.attributeLength];
  }
  /**
   * Gets the y value at a given index.
   * 
   * @param {Number} index The index.
   * @returns {Number} The y value at a given index.
   */


  getY(index) {
    return this.data[index * this.attributeLength + 1];
  }
  /**
   * Set the y value at a given index.
   * 
   * @param {Number} index The index.
   * @param {Number} value A number.
   */


  setY(index, value) {
    this.data[index * this.attributeLength + 1];
  }
  /**
   * Gets the z value at a given index.
   * 
   * @param {Number} index The index.
   * @returns {Number} The z value at a given index.
   */


  getZ(index) {
    return this.data[index * this.attributeLength + 2];
  }
  /**
   * Set the z value at a given index.
   * 
   * @param {Number} index The index.
   * @param {Number} value A number.
   */


  setZ(index, value) {
    this.data[index * this.attributeLength + 2];
  }
  /**
   * Gets the w value at a given index.
   * 
   * @param {Number} index The index.
   * @returns {Number} The w value at a given index.
   */


  getW(index) {
    return this.data[index * this.attributeLength + 3];
  }
  /**
   * Set the w value at a given index.
   * 
   * @param {Number} index The index.
   * @param {Number} value A number.
   */


  setW(index, value) {
    this.data[index * this.attributeLength + 3];
  }
  /**
   * Returns the gl type. Currently only float is supported.
   * 
   * @param {WebGLRenderingContext} gl The WebGL rendering context.
   * @returns {Number} The type.
   */


  getGlType(gl) {
    // Just floats for now
    // TODO: Add additional types.
    return gl.FLOAT;
  }
  /**
   * Update the attribute in order for changes to take effect.
   * 
   * @param {WebGLRenderingContext} gl The WebGL rendering context.
   */


  update(gl) {
    gl.bindBuffer(this.bufferType, this.buffer);
    gl.bufferData(this.bufferType, this.data, this.drawMode);
    this.stale = false;
  }
  /**
   * Create a new WebGL buffer.
   * 
   * @param {WebGLRenderingContext} gl The WebGL rendering context.
   * @param {WebGLProgram} program A WebGL program.
   * @param {GLenum} bufferType The buffer type.
   * @param {GLenum} drawMode The draw mode.
   */


  createBuffer(gl, program, bufferType, drawMode) {
    this.buffer = gl.createBuffer();
    this.bufferType = bufferType || gl.ARRAY_BUFFER;
    this.drawMode = drawMode || gl.STATIC_DRAW;
    gl.bindBuffer(this.bufferType, this.buffer);
    gl.bufferData(this.bufferType, this.data, this.drawMode);
    this.buffer.itemSize = this.attributeLength;
    this.buffer.numItems = this.size;
    this.attributeLocation = gl.getAttribLocation(program, this.name);
    gl.bindBuffer(this.bufferType, null);
  }
  /**
   * Bind the buffer of this attribute. The attribute must exist in the current shader.
   * 
   * @param {WebGLRenderingContext} gl The WebGL rendering context.
   */


  bind(gl) {
    gl.bindBuffer(this.bufferType, this.buffer); // Only enable attribute if it actually exists in the Shader

    if (this.attributeLocation >= 0) {
      gl.vertexAttribPointer(this.attributeLocation, this.attributeLength, this.getGlType(gl), gl.FALSE, 0, 0);
      gl.enableVertexAttribArray(this.attributeLocation);
    }
  }

}

module.exports = Attribute;

},{"../Math/Vector3f":45}],11:[function(require,module,exports){
"use strict";

//@ts-check

/** 
 * A class representing a Color. 
 * 
 * @property {Float32Array} components A typed array storing the components of this color (rgba).
 */
class Color {
  /**
   * Creates an instance of Color.
   * @param {Number} r The red component (0.0 - 1.0).
   * @param {Number} g The green component (0.0 - 1.0).
   * @param {Number} b The blue component (0.0 - 1.0).
   * @param {Number} [a=1.0] The alpha component (0.0 - 1.0).
   */
  constructor(r, g, b, a = 1.0) {
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
  /**
   * Set the red, green, blue and alpha components of the color.
   * 
   * @param {Number} r The red component (0.0 - 1.0).
   * @param {Number} g The green component (0.0 - 1.0).
   * @param {Number} b The blue component (0.0 - 1.0).
   * @param {Number} a The alpha component (0.0 - 1.0).
   * @returns {Color} Returns itself.
   */


  set(r, g, b, a) {
    this.components[0] = r;
    this.components[1] = g;
    this.components[2] = b;

    if (arguments.length == 4) {
      this.components[3] = a;
    }

    return this;
  }
  /**
   * Get the red component of the color.
   * 
   * @returns {Number} The red component of the color.
   */


  getR() {
    return this.components[0];
  }
  /**
   * Get the green component of the color.
   * 
   * @returns {Number} The green component of the color.
   */


  getG() {
    return this.components[0];
  }
  /**
   * Get the blue component of the color.
   * 
   * @returns {Number} The blue component of the color.
   */


  getB() {
    return this.components[0];
  }
  /**
   * Get the alpha component of the color.
   * 
   * @returns {Number} The alpha component of the color.
   */


  getA() {
    return this.components[0];
  }
  /**
   * Convert this colour to a float.
   * 
   * @returns {Number} A float representing this colour.
   */


  toFloat() {
    return Color.rgbToFloat(this.getR() * 255.0, this.getG() * 255.0, this.getB() * 255.0);
  }
  /**
   * Set the r,g,b components from a hex string.
   * 
   * @static
   * @param {String} hex A hex string in the form of #ABCDEF or #ABC.
   * @returns {Color} A color representing the hex string.
   */


  static fromHex(hex) {
    let rgb = Color.hexToRgb(hex);
    return new Color(rgb[0] / 255.0, rgb[1] / 255.0, rgb[2] / 255.0, 1.0);
  }
  /**
   * Create an rgb array from the r,g,b components from a hex string.
   * 
   * @static
   * @param {String} hex A hex string in the form of #ABCDEF or #ABC.
   * @returns {Array} Returns an array containing rgb values.
   */


  static hexToRgb(hex) {
    // Thanks to Tim Down
    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    return [r, g, b];
  }
  /**
   * Get the r, g or b value from a hue component.
   * 
   * @static
   * @param {Number} p 
   * @param {Number} q 
   * @param {Number} t 
   * @returns {Number} The r, g or b component value.
   */


  static hueToRgb(p, q, t) {
    if (t < 0) {
      t += 1;
    } else if (t > 1) {
      t -= 1;
    } else if (t < 0.1667) {
      return p + (q - p) * 6 * t;
    } else if (t < 0.5) {
      return q;
    } else if (t < 0.6667) {
      return p + (q - p) * (0.6667 - t) * 6;
    }

    return p;
  }
  /**
   * Converts HSL to RGB.
   * 
   * @static
   * @param {Number} h The hue component.
   * @param {Number} s The saturation component.
   * @param {Number} l The lightness component.
   * @returns {Number[]} An array containing the r, g and b values ([r, g, b]).
   */


  static hslToRgb(h, s, l) {
    let r, g, b;

    if (s == 0) {
      r = g = b = l;
    } else {
      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      r = Color._hue2rgb(p, q, h + 1 / 3);
      g = Color._hue2rgb(p, q, h);
      b = Color._hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  /**
   * Helper for HSL to RGB converter.
   */


  static _hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 0.16666666666) return p + (q - p) * 6 * t;
    if (t < 0.5) return q;
    if (t < 0.66666666666) return p + (q - p) * (0.66666666666 - t) * 6;
    return p;
  }
  /**
   * Converts HSL to Hex.
   * 
   * @static
   * @param {Number} h The hue component.
   * @param {Number} s The saturation component.
   * @param {Number} l The lightness component.
   * @returns {String} A hex string representing the color (#RRGGBB).
   */


  static hslToHex(h, s, l) {
    let [r, g, b] = Color.hslToRgb(h, s, l);
    return '#' + [r, g, b].map(e => {
      const hex = e.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  /**
   * Converts RGB to Hex.
   * 
   * @static
   * @param {Number} r The red component.
   * @param {Number} g The green component.
   * @param {Number} b The blue component.
   * @returns {String} A hex string representing the color (#RRGGBB).
   */


  static rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(e => {
      const hex = e.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  /**
   * Converts RGB to HSL.
   * 
   * @static
   * @param {Number} r The red component.
   * @param {Number} g The green component.
   * @param {Number} b The blue component.
   * @returns {Number[]} An array containing the h, s and l values ([h, s, l]).
   */


  static rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [h, s, l];
  }
  /**
   * Transform hsl to rgb colour values and then encode them as a 24-bit (highp) float.
   * 
   * @static
   * @param {Number} h 
   * @param {Number} [s=1.0] 
   * @param {Number} [l=0.5]
   * @returns {number} A RGB colour (NOT hsl) encoded as a float.
   */


  static hslToFloat(h, s = 1.0, l = 0.5) {
    let rgb = Color.hslToRgb(h, s, l);
    return Math.floor(rgb[0] + rgb[1] * 256.0 + rgb[2] * 256.0 * 256.0);
  }
  /**
   * Encode rgb colour values as a 24-bit (highp) float.
   * 
   * @static
   * @param {Number} r 
   * @param {Number} g 
   * @param {Number} b
   * @returns {number} A RGB colour encoded as a float.
   */


  static rgbToFloat(r, g, b) {
    return Math.floor(r + g * 256.0 + b * 256.0 * 256.0);
  }
  /**
   * Encode a hex colour values as a 24-bit (highp) float.
   * 
   * @static
   * @param {String} hex A hex value encoding a colour. 
   * @returns {number} A RGB colour encoded as a float.
   */


  static hexToFloat(hex) {
    let rgb = Color.hexToRgb(hex);
    return Color.rgbToFloat(rgb[0], rgb[1], rgb[2]);
  }
  /**
   * Decode rgb colour values from a 24-bit (highp) float.
   * 
   * @static
   * @param {Number} n 
   * @returns {*} An array containing rgb values. 
   */


  static floatToRgb(n) {
    let b = Math.floor(n / (256.0 * 256.0));
    let g = Math.floor((n - b * (256.0 * 256.0)) / 256.0);
    let r = Math.floor(n - b * (256.0 * 256.0) - g * 256.0);
    return [r, g, b];
  }
  /**
   * Decode hsl colour values from a 24-bit (highp) float.
   * 
   * @static
   * @param {Number} n 
   * @returns {*} An array containing hsl values. 
   */


  static floatToHsl(n) {
    let b = Math.floor(n / (256.0 * 256.0));
    let g = Math.floor((n - b * (256.0 * 256.0)) / 256.0);
    let r = Math.floor(n - b * (256.0 * 256.0) - g * 256.0);
    return Color.rgbToHsl(r, g, b);
  }
  /**
   * Shifts the hue so that 0.0 represents blue and 1.0 represents magenta.
   * 
   * @static
   * @param {Number} hue A hue component.
   * @returns {Number} The hue component shifted so that 0.0 is blue and 1.0 is magenta.
   */


  static gdbHueShift(hue) {
    hue = 0.85 * hue + 0.66;

    if (hue > 1.0) {
      hue = hue - 1.0;
    }

    hue = 1 - hue + 0.33;

    if (hue > 1.0) {
      hue = hue - 1.0;
    }

    return hue;
  }

}

module.exports = Color;

},{}],12:[function(require,module,exports){
"use strict";

//@ts-check

/** A map mapping draw modes as strings to their GLInt representations. */
let DrawModes = {
  points: 0,
  lines: 1,
  lineStrip: 2,
  lineLoop: 3,
  triangles: 4,
  traingleStrip: 5,
  triangleFan: 6
};
module.exports = DrawModes;

},{}],13:[function(require,module,exports){
"use strict";

//@ts-check
const Shaders = require('../Shaders');

class Effect {
  constructor(renderer, shaderName) {
    this.renderer = renderer;
    this.gl = this.renderer.gl;
    this.framebuffer = this.initFramebuffer();
    this.texture = this.initTexture();
    this.renderbuffer = this.initRenderbuffer();
    this.shader = Shaders[shaderName].clone();
    this.shader.init(this.renderer.gl);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  initBuffer() {
    let g = this.gl;
    let texCoordLocation = g.getAttribLocation(this.shader.program, 'v_coord'); // provide texture coordinates for the rectangle.

    let texCoordBuffer = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, texCoordBuffer);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]), g.STATIC_DRAW);
    g.enableVertexAttribArray(texCoordLocation);
    g.vertexAttribPointer(texCoordLocation, 2, g.FLOAT, false, 0, 0);
    return texCoordBuffer;
  }

  initTexture() {
    let g = this.gl;
    let texture = g.createTexture();
    g.bindTexture(g.TEXTURE_2D, texture);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
    g.bindTexture(g.TEXTURE_2D, texture);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, this.renderer.getWidth(), this.renderer.getHeight(), 0, g.RGBA, g.UNSIGNED_BYTE, null);
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0);
    return texture;
  }

  initFramebuffer() {
    let g = this.gl;
    let framebuffer = g.createFramebuffer();
    g.bindFramebuffer(g.FRAMEBUFFER, framebuffer);
    return framebuffer;
  }

  initRenderbuffer() {
    let g = this.gl;
    let renderbuffer = g.createRenderbuffer();
    g.bindRenderbuffer(g.RENDERBUFFER, renderbuffer);
    g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_COMPONENT16, this.renderer.getWidth(), this.renderer.getHeight());
    g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, renderbuffer); // g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_STENCIL, this.renderer.getWidth(), this.renderer.getHeight());
    // g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_STENCIL_ATTACHMENT, g.RENDERBUFFER, renderbuffer);

    return renderbuffer;
  }

  bind() {
    let g = this.gl;
    g.bindFramebuffer(g.FRAMEBUFFER, this.framebuffer);
    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
  }

  unbind() {
    let g = this.gl;
    g.bindRenderbuffer(g.RENDERBUFFER, null);
    g.bindFramebuffer(g.FRAMEBUFFER, null);
    this.initBuffer();
    this.shader.use();
    g.drawArrays(g.TRIANGLES, 0, 6);
  }

}

module.exports = Effect;

},{"../Shaders":57}],14:[function(require,module,exports){
"use strict";

//@ts-check
const DrawModes = require('./DrawModes');

const Attribute = require('./Attribute');

const Matrix4f = require('../Math/Matrix4f');

const Node = require('./Node');
/** 
 * A class representing a geometry.
 * 
 * @property {String} type The type name of this object (Lore.Geometry).
 * @property {String} name The name of this geometry.
 * @property {WebGLRenderingContext} gl A WebGL rendering context.
 * @property {Shader} shader An initialized shader.
 * @property {Object} attributes A map mapping attribute names to Lore.Attrubute objects.
 * @property {DrawMode} [drawMode=gl.POINTS] The current draw mode of this geometry.
 * @property {Boolean} isVisisble A boolean indicating whether or not this geometry is currently visible.
 */


class Geometry extends Node {
  constructor(name, gl, shader) {
    super();
    this.type = 'Lore.Geometry';
    this.name = name;
    this.gl = gl;
    this.shader = shader;
    this.attributes = {};
    this.drawMode = this.gl.POINTS;
    this.isVisible = true;
    this.stale = false;
  }

  addAttribute(name, data, length) {
    this.attributes[name] = new Attribute(data, length, name);
    this.attributes[name].createBuffer(this.gl, this.shader.program);
    return this;
  }

  updateAttribute(name, data) {
    if (data) {
      this.attributes[name].data = data;
    }

    this.attributes[name].update(this.gl);
    return this;
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  removeAttribute(name) {
    delete this.attributes[name];
    return this;
  }

  setMode(drawMode) {
    switch (drawMode) {
      case DrawModes.points:
        this.drawMode = this.gl.POINTS;
        break;

      case DrawModes.lines:
        this.drawMode = this.gl.LINES;
        break;

      case DrawModes.lineStrip:
        this.drawMode = this.gl.LINE_STRIP;
        break;

      case DrawModes.lineLoop:
        this.drawMode = this.gl.LINE_LOOP;
        break;

      case DrawModes.triangles:
        this.drawMode = this.gl.TRIANGLES;
        break;

      case DrawModes.triangleStrip:
        this.drawMode = this.gl.TRIANGLE_STRIP;
        break;

      case DrawModes.triangleFan:
        this.drawMode = this.gl.TRIANGLE_FAN;
        break;
    }

    return this;
  }

  size() {
    // Is this ok? All attributes should have the same length ...
    if (Object.keys(this.attributes).length > 0) {
      return this.attributes[Object.keys(this.attributes)[0]].size;
    }

    return 0;
  }

  hide() {
    this.isVisible = false;
  }

  show() {
    this.isVisible = true;
    this.stale = true;
  }

  draw(renderer) {
    if (!this.isVisible) return;

    for (let prop in this.attributes) if (this.attributes[prop].stale) this.attributes[prop].update(this.gl);

    this.shader.use(); // Update the modelView and projection matrices

    if (renderer.camera.isProjectionMatrixStale || this.stale) {
      this.shader.uniforms.projectionMatrix.setValue(renderer.camera.getProjectionMatrix());
    }

    if (renderer.camera.isViewMatrixStale || this.stale) {
      let modelViewMatrix = Matrix4f.multiply(renderer.camera.viewMatrix, this.modelMatrix);
      this.shader.uniforms.modelViewMatrix.setValue(modelViewMatrix.entries);
    }

    this.shader.updateUniforms();

    for (let prop in this.attributes) {
      this.attributes[prop].bind(this.gl);
    }

    this.gl.drawArrays(this.drawMode, 0, this.size());
    this.stale = false;
  }

}

module.exports = Geometry;

},{"../Math/Matrix4f":38,"./Attribute":10,"./DrawModes":12,"./Node":16}],15:[function(require,module,exports){
"use strict";

//@ts-check

/** 
 * A class representing the molecular graph. 
 * 
 * @property {Array[]} distanceMatrix The distance matrix of this graph.
 */
class Graph {
  /**
   * The constructor of the class Graph.
   * 
   * @param {Array[]} adjacencyMatrix The weighted adjacency matrix of a graph.
   */
  constructor(adjacencyMatrix) {
    this.adjacencyMatrix = adjacencyMatrix; // Replace zeros with infinity

    for (var i = 0; i < this.adjacencyMatrix.length; i++) {
      for (var j = 0; j < this.adjacencyMatrix.length; j++) {
        if (this.adjacencyMatrix[i][j] === 0) {
          this.adjacencyMatrix[i][j] = Infinity;
        }
      }
    }

    this.distanceMatrix = this.getDistanceMatrix();
    this.diameter = this.getDiameter();
  }
  /**
   * Returns the unweighted adjacency matrix of this graph.
   * 
   * @returns {Array} The unweighted adjacency matrix of this graph.
   */


  getUnweightedAdjacencyMatrix() {
    let length = this.adjacencyMatrix.length;
    let unweightedAdjacencyMatrix = Array(length);

    for (var i = 0; i < length; i++) {
      unweightedAdjacencyMatrix[i] = new Uint8Array(length);

      for (var j = 0; j < length; j++) {
        unweightedAdjacencyMatrix[i][j] = this.adjacencyMatrix[i][j] > 0 ? 1 : 0;
      }
    }

    return unweightedAdjacencyMatrix;
  }
  /**
   * Returns an edge list of this graph.
   * 
   * @returns {Array} An array of edges in the form of [vertexId, vertexId, edgeWeight].
   */


  getEdgeList() {
    let length = this.adjacencyMatrix.length;
    let edgeList = Array();

    for (var i = 0; i < length - 1; i++) {
      for (var j = i; j < length; j++) {
        if (this.adjacencyMatrix[i][j] !== Infinity) {
          edgeList.push([i, j, this.adjacencyMatrix[i][j]]);
        }
      }
    }

    return edgeList;
  }
  /**
   * 
   */


  forceLayout(radius = 1000, iterations = 1000, q = 1.5, k = 0.01, ke = 1000.0, zoom = 1.0) {
    let matDist = this.distanceMatrix.slice();
    let length = matDist.length;
    let nNeighbours = new Int16Array(length); // Get the number of neighbours

    for (var i = 0; i < length; i++) {
      nNeighbours[i] = this.adjacencyMatrix[i].reduce((acc, val) => val !== Infinity ? ++acc : acc, 0);
    } // Square distances


    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length; j++) {
        matDist[i][j] = Math.pow(matDist[i][j], q);
      }
    } // Normalize distance matrix


    let max = 0.0;

    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length; j++) {
        if (matDist[i][j] > max) {
          max = matDist[i][j];
        }
      }
    }

    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length; j++) {
        // Added math pow to decrease influence of long distances
        matDist[i][j] = matDist[i][j] / max;
      }
    } // Forces


    let fx = new Float32Array(length);
    let fy = new Float32Array(length); // Positions

    let px = new Float32Array(length);
    let py = new Float32Array(length); // Initialize positions to random values

    for (var i = 0; i < length; i++) {
      px[i] = Math.random() * radius;
      py[i] = Math.random() * radius;
    }

    for (var n = 0; n < iterations; n++) {
      // Spring forces
      for (var i = 0; i < length - 1; i++) {
        for (var j = i + 1; j < length; j++) {
          if (matDist[i][j] === Infinity) {
            continue;
          }

          let dx = px[i] - px[j];
          let dy = py[i] - py[j];
          let d = Math.sqrt(Math.pow(dx, 2.0) + Math.pow(dy, 2.0));

          if (d === 0) {
            d = 0.01;
          } // Normalize dx and dy to d


          dx /= d;
          dy /= d; // Hooke's law, F=kX, is the force between x and y

          let f = k * (matDist[i][j] * radius - d);

          if (this.adjacencyMatrix[i][j] !== Infinity) {
            f *= length;
          }

          fx[i] += f * dx;
          fy[i] += f * dy;
          fx[j] += -f * dx;
          fy[j] += -f * dy;
        }
      } // Repulsive forces between vertices


      for (var i = 0; i < length - 1; i++) {
        for (var j = i; j < length; j++) {
          for (var j = i; j < length; j++) {
            if (this.adjacencyMatrix[i][j] !== Infinity) {
              continue;
            }

            let dx = px[i] - px[j];
            let dy = py[i] - py[j];
            let dSquared = Math.pow(dx, 2.0) + Math.pow(dy, 2.0);
            let d = Math.sqrt(dSquared);

            if (d === 0) {
              d = 0.01;
            }

            if (dSquared === 0) {
              dSquared = 0.05;
            } // Normalize dx and dy to d


            dx /= d;
            dy /= d; // Coulomb's law, F = k_e * q1 * q2 / r^2, is the force between x and y

            let f = ke / dSquared;
            fx[i] += f * dx;
            fy[i] += f * dy;
            fx[j] += -f * dx;
            fy[j] += -f * dy;
          }
        }
      } // Move the vertices


      for (var i = 0; i < length; i++) {
        // fx[i] = Math.min(Math.max(-1, fx[i]), 1);
        // fy[i] = Math.min(Math.max(-1, fy[i]), 1);
        fx[i] = Math.sign(fx[i]) * Math.sqrt(Math.abs(fx[i]));
        fy[i] = Math.sign(fy[i]) * Math.sqrt(Math.abs(fy[i]));
        px[i] += fx[i];
        py[i] += fy[i];
      } // Reset force and position deltas


      for (var i = 0; i < length; i++) {
        fx[i] = 0.0;
        fy[i] = 0.0;
      }
    } // Move the graph to the center


    let avgX = 0.0;
    let avgY = 0.0;

    for (var i = 0; i < length; i++) {
      // Zoom
      px[i] *= zoom;
      py[i] *= zoom;
      avgX += px[i];
      avgY += py[i];
    }

    avgX /= length;
    avgY /= length;

    for (var i = 0; i < length; i++) {
      px[i] = px[i] - (avgX - radius / 2.0);
      py[i] = py[i] - (avgY - radius / 2.0);
    }

    let positions = Array(length);

    for (var i = 0; i < length; i++) {
      positions[i] = [px[i], py[i]];
    }

    return [positions, this.getEdgeList()];
  }
  /**
   * Positiones the (sub)graph using Kamada and Kawais algorithm for drawing general undirected graphs. https://pdfs.semanticscholar.org/b8d3/bca50ccc573c5cb99f7d201e8acce6618f04.pdf
   * 
   * @param {Number} radius The radius within which to initialize the vertices.
   * @param {Boolean} logWeights Apply log() to the weights before layouting.
   * @param {Boolean} squareWeights Apply pow(x,2) to the weights before layouting.
   * @param {Boolean} normalizeWeights Normalize the edge weights before layouting and after log() or exp().
   * @return {Array} An array of vertex positions of the form [ x, y ].
   */


  kkLayout(radius = 500, logWeights = false, squareWeights = false, normalizeWeights = false) {
    let edgeStrength = 50.0;
    let matDist = this.distanceMatrix;
    let length = this.distanceMatrix.length; // Transform data

    if (logWeights) {
      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (matDist[i][j] !== Infinity) {
            matDist[i][j] = Math.log(matDist[i][j]);
          }
        }
      }
    }

    if (normalizeWeights) {
      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (matDist[i][j] !== Infinity && matDist[i][j] !== 0) {
            matDist[i][j] = Math.pow(matDist[i][j], 2.0);
          }
        }
      }
    } // Normalize the edge weights


    if (normalizeWeights) {
      let maxWeight = 0;

      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (matDist[i][j] > maxWeight && matDist[i][j] !== Infinity) {
            maxWeight = matDist[i][j];
          }
        }
      }

      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (matDist[i][j] !== Infinity) {
            matDist[i][j] = matDist[i][j] / maxWeight;
          }
        }
      }
    } // Initialize the positions. Place all vertices on a ring around the center


    let halfR;
    let angle = 2 * Math.PI / length;
    let a = 0.0;
    let arrPositionX = new Float32Array(length);
    let arrPositionY = new Float32Array(length);
    let arrPositioned = Array(length);
    let l = radius / (2 * this.diameter);
    console.log('l: ' + l);
    console.log('diameter: ' + this.diameter);
    radius /= 2.0;
    var i = length;

    while (i--) {
      arrPositionX[i] = radius + Math.cos(a) * radius;
      arrPositionY[i] = radius + Math.sin(a) * radius;
      arrPositioned[i] = false;
      a += angle;
    } // Create the matrix containing the lengths


    let matLength = Array(length);
    i = length;

    while (i--) {
      matLength[i] = new Array(length);
      var j = length;

      while (j--) {
        matLength[i][j] = l * matDist[i][j];
      }
    } // Create the matrix containing the spring strenghts


    let matStrength = Array(length);
    i = length;

    while (i--) {
      matStrength[i] = Array(length);
      var j = length;

      while (j--) {
        matStrength[i][j] = edgeStrength * Math.pow(matDist[i][j], -2.0);
      }
    } // Create the matrix containing the energies


    let matEnergy = Array(length);
    let arrEnergySumX = new Float32Array(length);
    let arrEnergySumY = new Float32Array(length);
    i = length;

    while (i--) {
      matEnergy[i] = Array(length);
    }

    i = length;
    let ux, uy, dEx, dEy, vx, vy, denom;

    while (i--) {
      ux = arrPositionX[i];
      uy = arrPositionY[i];
      dEx = 0.0;
      dEy = 0.0;
      let j = length;

      while (j--) {
        if (i === j) {
          continue;
        }

        vx = arrPositionX[j];
        vy = arrPositionY[j];
        denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
        matEnergy[i][j] = [matStrength[i][j] * (ux - vx - matLength[i][j] * (ux - vx) * denom) || 0.0, matStrength[i][j] * (uy - vy - matLength[i][j] * (uy - vy) * denom) || 0.0];
        matEnergy[j][i] = matEnergy[i][j];
        dEx += matEnergy[i][j][0];
        dEy += matEnergy[i][j][1];
      }

      arrEnergySumX[i] = dEx;
      arrEnergySumY[i] = dEy;
    } // Utility functions, maybe inline them later


    let energy = function (index) {
      return [arrEnergySumX[index] * arrEnergySumX[index] + arrEnergySumY[index] * arrEnergySumY[index], arrEnergySumX[index], arrEnergySumY[index]];
    };

    let highestEnergy = function () {
      let maxEnergy = 0.0;
      let maxEnergyId = 0;
      let maxDEX = 0.0;
      let maxDEY = 0.0;
      i = length;

      while (i--) {
        let [delta, dEX, dEY] = energy(i);

        if (delta > maxEnergy) {
          maxEnergy = delta;
          maxEnergyId = i;
          maxDEX = dEX;
          maxDEY = dEY;
        }
      }

      return [maxEnergyId, maxEnergy, maxDEX, maxDEY];
    };

    let update = function (index, dEX, dEY) {
      let dxx = 0.0;
      let dyy = 0.0;
      let dxy = 0.0;
      let ux = arrPositionX[index];
      let uy = arrPositionY[index];
      let arrL = matLength[index];
      let arrK = matStrength[index];
      i = length;

      while (i--) {
        if (i === index) {
          continue;
        }

        let vx = arrPositionX[i];
        let vy = arrPositionY[i];
        let l = arrL[i];
        let k = arrK[i];
        let m = (ux - vx) * (ux - vx);
        let denom = 1.0 / Math.pow(m + (uy - vy) * (uy - vy), 1.5);
        dxx += k * (1 - l * (uy - vy) * (uy - vy) * denom) || 0.0;
        dyy += k * (1 - l * m * denom) || 0.0;
        dxy += k * (l * (ux - vx) * (uy - vy) * denom) || 0.0;
      } // Prevent division by zero


      if (dxx === 0) {
        dxx = 0.1;
      }

      if (dyy === 0) {
        dyy = 0.1;
      }

      if (dxy === 0) {
        dxy = 0.1;
      }

      let dy = dEX / dxx + dEY / dxy;
      dy /= dxy / dxx - dyy / dxy; // had to split this onto two lines because the syntax highlighter went crazy.

      let dx = -(dxy * dy + dEX) / dxx;
      arrPositionX[index] += dx;
      arrPositionY[index] += dy; // Update the energies

      let arrE = matEnergy[index];
      dEX = 0.0;
      dEY = 0.0;
      ux = arrPositionX[index];
      uy = arrPositionY[index];
      let vx, vy, prevEx, prevEy, denom;
      i = length;

      while (i--) {
        if (index === i) {
          continue;
        }

        vx = arrPositionX[i];
        vy = arrPositionY[i]; // Store old energies

        prevEx = arrE[i][0];
        prevEy = arrE[i][1];
        denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
        dx = arrK[i] * (ux - vx - arrL[i] * (ux - vx) * denom) || 0.0;
        dy = arrK[i] * (uy - vy - arrL[i] * (uy - vy) * denom) || 0.0;
        arrE[i] = [dx, dy];
        dEX += dx;
        dEY += dy;
        arrEnergySumX[i] += dx - prevEx;
        arrEnergySumY[i] += dy - prevEy;
      }

      arrEnergySumX[index] = dEX;
      arrEnergySumY[index] = dEY;
    }; // Setting parameters


    let threshold = 0.1;
    let innerThreshold = 0.1;
    let maxIteration = 6000;
    let maxInnerIteration = 10;
    let maxEnergy = 1e9; // Setting up variables for the while loops

    let maxEnergyId = 0;
    let dEX = 0.0;
    let dEY = 0.0;
    let delta = 0.0;
    let iteration = 0;
    let innerIteration = 0;

    while (maxEnergy > threshold && maxIteration > iteration) {
      iteration++;
      [maxEnergyId, maxEnergy, dEX, dEY] = highestEnergy();
      delta = maxEnergy;
      innerIteration = 0;

      while (delta > innerThreshold && maxInnerIteration > innerIteration) {
        innerIteration++;
        update(maxEnergyId, dEX, dEY);
        [delta, dEX, dEY] = energy(maxEnergyId);
      }
    }

    let positions = Array(length);
    i = length;

    while (i--) {
      positions[i] = [arrPositionX[i], arrPositionY[i]];
    }

    return [positions, this.getEdgeList()];
  }

  getDiameter() {
    let diameter = 0;

    for (var i = 0; i < this.distanceMatrix.length - 1; i++) {
      for (var j = i; j < this.distanceMatrix.length; j++) {
        if (this.distanceMatrix[i][j] > diameter && this.distanceMatrix[i][j] < Infinity) {
          diameter = this.distanceMatrix[i][j];
        }
      }
    }

    return diameter;
  }
  /**
   * Get the distance matrix of the graph.
   * 
   * @returns {Array[]} The distance matrix of the graph.
   */


  getDistanceMatrix() {
    let length = this.adjacencyMatrix.length;
    let dist = Array(length);

    for (var i = 0; i < length; i++) {
      dist[i] = new Float32Array(length);
      dist[i].fill(Infinity);
    }

    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length; j++) {
        if (this.adjacencyMatrix[i][j] < Infinity) {
          dist[i][j] = this.adjacencyMatrix[i][j];
        }
      }
    }

    for (var k = 0; k < length; k++) {
      for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }

    return dist;
  }
  /**
   * Returns a new graph object. Vertex ids have to be 0 to n.
   * 
   * @param {Array[]} edgeList An edge list in the form [ [ vertexId, vertexId, weight ], ... ].
   * @param {Boolean} invertWeights Whether or not to invert the weights.
   * @returns {Graph} A graph object.
   */


  static fromEdgeList(edgeList, invertWeights = false) {
    // Get the max vertex id.
    let max = 0;

    for (var i = 0; i < edgeList.length; i++) {
      if (edgeList[i][0] > max) {
        max = edgeList[i][0];
      }

      if (edgeList[i][1] > max) {
        max = edgeList[i][1];
      }
    }

    max++;

    if (invertWeights) {
      let maxWeight = 0;

      for (var i = 0; i < edgeList.length; i++) {
        if (edgeList[i][2] > maxWeight) {
          maxWeight = edgeList[i][2];
        }
      }

      maxWeight++;

      for (var i = 0; i < edgeList.length; i++) {
        edgeList[i][2] = maxWeight - edgeList[i][2];
      }
    }

    let adjacencyMatrix = Array(max);

    for (var i = 0; i < max; i++) {
      adjacencyMatrix[i] = new Float32Array(max);
      adjacencyMatrix[i].fill(0);
    }

    for (var i = 0; i < edgeList.length; i++) {
      let edge = edgeList[i];
      adjacencyMatrix[edge[0]][edge[1]] = edge[2];
      adjacencyMatrix[edge[1]][edge[0]] = edge[2];
    }

    return new Graph(adjacencyMatrix);
  }

}

module.exports = Graph;

},{}],16:[function(require,module,exports){
"use strict";

//@ts-check
const Vector3f = require('../Math/Vector3f');

const Quaternion = require('../Math/Quaternion');

const Matrix3f = require('../Math/Matrix3f');

const Matrix4f = require('../Math/Matrix4f');
/**
 * A class representing a node. A node is the base-class for all 3D objects.
 * 
 * @property {String} type The type name of this object (Node).
 * @property {String} id A GUID uniquely identifying the node.
 * @property {Boolean} isVisible A boolean indicating whether or not the node is visible (rendered).
 * @property {Vector3f} position The position of this node.
 * @property {Quaternion} rotation The rotation of this node.
 * @property {Vector3f} scale The scale of this node.
 * @property {Vector3f} up The up vector associated with this node.
 * @property {Matrix3f} normalMatrix The normal matrix of this node.
 * @property {Matrix4f} modelMatrix The model matrix associated with this node.
 * @property {Boolean} isStale A boolean indicating whether or not the modelMatrix of this node is stale.
 * @property {Node[]} children An array containing child-nodes.
 * @property {Node} parent The parent node.
 */


class Node {
  /**
   * Creates an instance of Node.
   */
  constructor() {
    this.type = 'Node';
    this.id = Node.createGUID();
    this.isVisible = true;
    this.position = new Vector3f(0.0, 0.0, 0.0);
    this.rotation = new Quaternion(0.0, 0.0, 0.0, 0.0);
    this.scale = new Vector3f(1.0, 1.0, 1.0);
    this.up = new Vector3f(0.0, 1.0, 0.0);
    this.normalMatrix = new Matrix3f();
    this.modelMatrix = new Matrix4f();
    this.isStale = false;
    this.children = new Array();
    this.parent = null;
  }
  /**
   * Apply a matrix to the model matrix of this node.
   * 
   * @param {Matrix4f} matrix A matrix.
   * @returns {Node} Itself.
   */


  applyMatrix(matrix) {
    this.modelMatrix.multiplyB(matrix);
    return this;
  }
  /**
   * Returns the up vector for this node.
   * 
   * @returns {Vector3f} The up vector for this node.
   */


  getUpVector() {
    let v = new Vector3f(0, 1, 0);
    return v.applyQuaternion(this.rotation);
  }
  /**
   * Returns the forward vector for this node.
   * 
   * @returns {Vector3f} The forward vector for this node.
   */


  getForwardVector() {
    let v = new Vector3f(0, 0, 1);
    return v.applyQuaternion(this.rotation);
  }
  /**
   * Returns the right vector for this node.
   * 
   * @returns {Vector3f} The right vector for this node.
   */


  getRightVector() {
    let v = new Vector3f(1, 0, 0);
    return v.applyQuaternion(this.rotation);
  }
  /**
   * Translates this node on an axis.
   * 
   * @param {Vector3f} axis A vector representing an axis.
   * @param {Number} distance The distance for which to move the node along the axis.
   * @returns {Node} Itself.
   */


  translateOnAxis(axis, distance) {
    // Axis should be normalized, following THREE.js
    let v = new Vector3f(axis.components[0], axis.components[1], axis.components[2]);
    v.applyQuaternion(this.rotation);
    v.multiplyScalar(distance);
    this.position.add(v);
    return this;
  }
  /**
   * Translates the node along the x-axis.
   * 
   * @param {Number} distance The distance for which to move the node along the x-axis.
   * @returns {Node} Itself.
   */


  translateX(distance) {
    this.position.components[0] = this.position.components[0] + distance;
    return this;
  }
  /**
   * Translates the node along the y-axis.
   * 
   * @param {Number} distance The distance for which to move the node along the y-axis.
   * @returns {Node} Itself.
   */


  translateY(distance) {
    this.position.components[1] = this.position.components[1] + distance;
    return this;
  }
  /**
   * Translates the node along the z-axis.
   * 
   * @param {Number} distance The distance for which to move the node along the z-axis.
   * @returns {Node} Itself.
   */


  translateZ(distance) {
    this.position.components[2] = this.position.components[2] + distance;
    return this;
  }
  /**
   * Set the translation (position) of this node.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Node} Itself.
   */


  setTranslation(v) {
    this.position = v;
    return this;
  }
  /**
   * Set the rotation from an axis and an angle.
   * 
   * @param {Vector3f} axis A vector representing an angle
   * @param {Number} angle An angle.
   * @returns {Node} Itself.
   */


  setRotation(axis, angle) {
    this.rotation.setFromAxisAngle(axis, angle);
    return this;
  }
  /**
   * Rotate this node by an angle on an axis.
   * 
   * @param {Vector3f} axis A vector representing an angle
   * @param {Number} angle An angle.
   * @returns {Node} Itself.
   */


  rotate(axis, angle) {
    let q = new Quaternion(axis, angle);
    this.rotation.multiplyA(q);
    return this;
  }
  /**
   * Rotate around the x-axis.
   * 
   * @param {Number} angle An angle.
   * @returns {Node} Itself.
   */


  rotateX(angle) {
    this.rotation.rotateX(angle);
    return this;
  }
  /**
   * Rotate around the y-axis.
   * 
   * @param {Number} angle An angle.
   * @returns {Node} Itself.
   */


  rotateY(angle) {
    this.rotation.rotateY(angle);
    return this;
  }
  /**
   * Rotate around the z-axis.
   * 
   * @param {Number} angle An angle.
   * @returns {Node} Itself.
   */


  rotateZ(angle) {
    this.rotation.rotateZ(angle);
    return this;
  }
  /**
   * Get the rotation matrix for this node.
   * 
   * @returns {Matrix4f} This nodes rotation matrix.
   */


  getRotationMatrix() {
    return this.rotation.toRotationMatrix();
  }
  /**
   * Update the model matrix of this node. Has to be called in order to apply scaling, rotations or translations.
   * 
   * @returns {Node} Itself.
   */


  update() {
    this.modelMatrix.compose(this.position, this.rotation, this.scale); // if parent... this.modelMatrix = Matrix4f.multiply(this.parent.modelMatrix, this.modelMatrix);

    this.isStale = true;
    return this;
  }
  /**
   * Returns the model matrix as an array. 
   * 
   * @returns {Float32Array} The model matrix.
   */


  getModelMatrix() {
    return this.modelMatrix.entries;
  }
  /**
   * Creates a GUID.
   * 
   * @returns {String} A GUID.
   */


  static createGUID() {
    // See:
    // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }

}

module.exports = Node;

},{"../Math/Matrix3f":37,"../Math/Matrix4f":38,"../Math/Quaternion":40,"../Math/Vector3f":45}],17:[function(require,module,exports){
"use strict";

//@ts-check
// const Lore = require('../Lore');
const Shaders = require('../Shaders');

const Effect = require('./Effect');

const Vector3f = require('../Math/Vector3f');

const Color = require('./Color');

const Utils = require('../Utils/Utils');

const Geometry = require('./Geometry');

const ControlsBase = require('../Controls/ControlsBase');

const OrbitalControls = require('../Controls/OrbitalControls');

const CameraBase = require('../Cameras/CameraBase');

const OrthographicCamera = require('../Cameras/OrthographicCamera');
/** 
 * A class representing the WebGL renderer. 
 * 
 * @property {Object} opts An object containing options.
 * @property {Any} camera The camera associated with this renderer.
 * @property {ControlsBase} controls The controls associated with this renderer.
 */


class Renderer {
  /**
   * Creates an instance of Renderer.
   * @param {String} targetId The id of a canvas element.
   * @param {any} options The options.
   */
  constructor(targetId, options) {
    this.defaults = {
      antialiasing: true,
      verbose: false,
      fpsElement: document.getElementById('fps'),
      clearColor: Color.fromHex('#000000'),
      clearDepth: 1.0,
      radius: 500,
      center: new Vector3f(0.0, 0.0, 0.0),
      enableDepthTest: true,
      alphaBlending: false,
      preserveDrawingBuffer: false
    };
    this.opts = Utils.extend(true, this.defaults, options);
    this.canvas = document.getElementById(targetId);
    this.webgl2 = true;
    this.parent = this.canvas.parentElement;
    this.fps = 0;
    this.fpsCount = 0;
    this.maxFps = 1000 / 30;
    this.devicePixelRatio = this.getDevicePixelRatio();
    this.camera = new OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / -2); // this.camera = new PerspectiveCamera(25.0, this.getWidth() / this.getHeight());

    this.geometries = {};
    this.ready = false;
    this.gl = null;

    this.render = function (camera, geometries) {};

    this.effect = null;
    this.lastTiming = performance.now();
    this.disableContextMenu();
    let that = this;
    that.init(); // Attach the controls last

    let center = options.center ? options.center : new Vector3f(0.0, 0.0, 0.0);
    this.controls = new OrbitalControls(that, this.opts.radius || 500, center);
  }
  /**
   * Initialize and start the renderer.
   */


  init() {
    let _this = this;

    let settings = {
      antialias: this.opts.antialiasing,
      preserveDrawingBuffer: this.opts.preserveDrawingBuffer
    };
    this.gl = this.canvas.getContext('webgl2', settings) || this.canvas.getContext('experimental-webgl2');

    if (!this.gl) {
      this.webgl2 = false;
      this.gl = this.canvas.getContext('webgl', settings) || this.canvas.getContext('experimental-webgl', settings);
    }

    if (!this.gl) {
      console.error('Could not initialize the WebGL context.');
      return;
    }

    let g = this.gl;

    if (this.opts.verbose) {
      let hasAA = g.getContextAttributes().antialias;
      let size = g.getParameter(g.SAMPLES);
      console.info('Antialiasing: ' + hasAA + ' (' + size + 'x)');
      let highp = g.getShaderPrecisionFormat(g.FRAGMENT_SHADER, g.HIGH_FLOAT);
      let hasHighp = highp.precision != 0;
      console.info('High precision support: ' + hasHighp);
      console.info('WebGL2 supported: ' + this.webgl2);
    } // Extensions


    let oes = 'OES_standard_derivatives';
    let extOes = g.getExtension(oes);

    if (extOes === null) {
      console.warn('Could not load extension: ' + oes + '.');
    }

    let wdb = 'WEBGL_draw_buffers';
    let extWdb = g.getExtension(wdb);

    if (extWdb === null) {
      console.warn('Could not load extension: ' + wdb + '.');
    }

    let wdt = 'WEBGL_depth_texture';
    let extWdt = g.getExtension(wdt);

    if (extWdt === null) {
      console.warn('Could not load extension: ' + wdt + '.');
    }

    let fgd = 'EXT_frag_depth';
    let extFgd = g.getExtension(fgd);

    if (extFgd === null) {
      console.warn('Could not load extension: ' + fgd + '.');
    }

    this.setClearColor(this.opts.clearColor); // Blending
    // if (!this.webgl2) {

    if (!this.opts.alphaBlending) {
      g.clearDepth(this.opts.clearDepth);

      if (this.opts.enableTransparency) {
        g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
        g.enable(g.BLEND);
        g.disable(g.DEPTH_TEST);
      } else if (this.opts.enableDepthTest) {
        g.enable(g.DEPTH_TEST);
        g.depthFunc(g.LEQUAL);

        if (this.opts.verbose) {
          console.log('enable depth test');
        }
      }
    } else {
      // Idea, write to fragdepth
      // https://www.reddit.com/r/opengl/comments/1fthbc/is_gl_fragdepth_ignored_when_depth_writes_are_off/
      // g.disable(g.DEPTH_TEST);
      // g.enable(g.BLEND);
      // g.blendFunc(g.ONE, g.ONE);
      g.disable(g.DEPTH_TEST);
      g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA); // To disable the background color of the canvas element

      g.blendFuncSeparate(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA, g.ZERO, g.ONE);
      g.enable(g.BLEND);
    }

    this.ready = true;
    this.animate();
  }
  /**
   * Disables the context menu on the canvas element. 
   */


  disableContextMenu() {
    // Disable context menu on right click
    this.canvas.addEventListener('contextmenu', function (e) {
      if (e.button === 2) {
        e.preventDefault();
        return false;
      }
    });
  }
  /**
   * Sets the clear color of this renderer.
   * 
   * @param {Color} color The clear color.
   */


  setClearColor(color) {
    this.opts.clearColor = color;
    let cc = this.opts.clearColor.components;
    this.gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
  }
  /**
   * Get the actual width of the canvas.
   * 
   * @returns {Number} The width of the canvas.
   */


  getWidth() {
    return this.canvas.offsetWidth;
  }
  /**
   * Get the actual height of the canvas.
   * 
   * @returns {Number} The height of the canvas.
   */


  getHeight() {
    return this.canvas.offsetHeight;
  }
  /**
   * Update the viewport. Should be called when the canvas is resized.
   * 
   * @param {Number} x The horizontal offset of the viewport.
   * @param {Number} y The vertical offset of the viewport.
   * @param {Number} width The width of the viewport.
   * @param {Number} height The height of the viewport.
   */


  updateViewport(x, y, width, height) {
    width *= this.devicePixelRatio;
    height *= this.devicePixelRatio;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(x, y, width, height);
    this.camera.updateViewport(width, height);
    this.camera.updateProjectionMatrix();
  }
  /**
   * The main rendering loop. 
   */


  animate() {
    this.updateViewport(0, 0, this.getWidth(), this.getHeight());
    let that = this;
    setTimeout(function () {
      requestAnimationFrame(function () {
        that.animate();
      });
    }, this.maxFps);

    if (this.opts.fpsElement) {
      let now = performance.now();
      let delta = now - this.lastTiming;
      this.lastTiming = now;

      if (this.fpsCount < 10) {
        this.fps += Math.round(1000.0 / delta);
        this.fpsCount++;
      } else {
        // 
        this.opts.fpsElement.innerHTML = Math.round(this.fps / this.fpsCount);
        this.fpsCount = 0;
        this.fps = 0;
      }
    } // this.effect.bind();


    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.render(this.camera, this.geometries); // this.effect.unbind();

    this.camera.isProjectionMatrixStale = false;
    this.camera.isViewMatrixStale = false;
  }
  /**
   * Creates and adds a geometry to the scene graph.
   * 
   * @param {String} name The name of the geometry.
   * @param {String} shaderName The name of the shader used to render the geometry.
   * @returns {Geometry} The created geometry.
   */


  createGeometry(name, shaderName) {
    let shader = Shaders[shaderName].clone();
    shader.init(this.gl, this.webgl2);
    let geometry = new Geometry(name, this.gl, shader);
    this.geometries[name] = geometry;
    return geometry;
  }
  /**
   * Set the maximum frames per second of this renderer.
   * 
   * @param {Number} fps Maximum frames per second.
   */


  setMaxFps(fps) {
    this.maxFps = fps;
  }
  /**
   * Get the device pixel ratio.
   * 
   * @returns {Number} The device pixel ratio.
   */


  getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
  }

}

module.exports = Renderer;

},{"../Cameras/CameraBase":2,"../Cameras/OrthographicCamera":3,"../Controls/ControlsBase":6,"../Controls/OrbitalControls":8,"../Math/Vector3f":45,"../Shaders":57,"../Utils/Utils":62,"./Color":11,"./Effect":13,"./Geometry":14}],18:[function(require,module,exports){
"use strict";

//@ts-check
const Uniform = require('./Uniform');

const Matrix4f = require('../Math/Matrix4f');
/**
 * A class representing a shader.
 * 
 * @property {String} name The name of the shader.
 * @property {Object} uniforms A map mapping uniform names to Lore Uniform instances.
 * 
 */


class Shader {
  constructor(name, glVersion, uniforms, vertexShader, fragmentShader) {
    this.name = name;
    this.uniforms = uniforms || {};
    this.vertexShader = vertexShader || [];
    this.fragmentShader = fragmentShader || [];
    this.glVersion = glVersion;
    this.gl = null;
    this.program = null;
    this.initialized = false;
    this.lastTime = new Date().getTime(); // Add the two default shaders (the same shaders as in getVertexShader)

    this.uniforms['modelViewMatrix'] = new Uniform('modelViewMatrix', new Matrix4f().entries, 'float_mat4');
    this.uniforms['projectionMatrix'] = new Uniform('projectionMatrix', new Matrix4f().entries, 'float_mat4');
  }

  clone() {
    let uniforms = {};

    for (let key in this.uniforms) {
      uniforms[key] = this.uniforms[key].clone();
    }

    return new Shader(this.name, this.glVersion, uniforms, this.vertexShader, this.fragmentShader);
  }

  getVertexShaderCode() {
    return this.vertexShader.join('\n');
  }

  getFragmentShaderCode() {
    return this.fragmentShader.join('\n');
  }

  getVertexShader(gl, isWebGL2 = false) {
    let shader = gl.createShader(gl.VERTEX_SHADER);
    let vertexShaderCode = '';

    if (!isWebGL2 && this.glVersion === 2) {
      throw 'The shader expects WebGL 2.0';
    } else if (this.glVersion === 2) {
      vertexShaderCode += '#version 300 es\n';
    }

    vertexShaderCode += 'uniform mat4 modelViewMatrix;\n' + 'uniform mat4 projectionMatrix;\n\n' + this.getVertexShaderCode();
    gl.shaderSource(shader, vertexShaderCode);
    gl.compileShader(shader);
    Shader.showCompilationInfo(gl, shader, this.name, 'Vertex Shader');
    return shader;
  }

  getFragmentShader(gl, isWebGL2 = false) {
    let shader = gl.createShader(gl.FRAGMENT_SHADER);
    let fragmentShaderCode = '';

    if (!isWebGL2 && this.glVersion === 2) {
      throw 'The shader expects WebGL 2.0';
    } else if (this.glVersion === 2) {
      fragmentShaderCode += '#version 300 es\n';
    } // Adding precision, see:
    // http://stackoverflow.com/questions/27058064/why-do-i-need-to-define-a-precision-value-in-webgl-shaders
    // and:
    // http://stackoverflow.com/questions/13780609/what-does-precision-mediump-float-mean


    fragmentShaderCode += '#ifdef GL_OES_standard_derivatives\n#extension GL_OES_standard_derivatives : enable\n#endif\n\n' + '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + this.getFragmentShaderCode();
    gl.shaderSource(shader, fragmentShaderCode);
    gl.compileShader(shader);
    Shader.showCompilationInfo(gl, shader, this.name, 'Fragment Shader');
    return shader;
  }

  init(gl, isWebGL2 = false) {
    this.gl = gl;
    this.program = this.gl.createProgram();
    let vertexShader = this.getVertexShader(this.gl, isWebGL2);
    let fragmentShader = this.getFragmentShader(this.gl, isWebGL2);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create the fragment or the vertex shader.');
      return null;
    }

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Could not link program.\n' + 'VALIDATE_STATUS: ' + this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS) + '\n' + 'ERROR: ' + this.gl.getError());
      return null;
    }

    this.initialized = true;
  }

  updateUniforms(renderer) {
    // Always update time uniform if it exists
    if (this.uniforms['time']) {
      let unif = this.uniforms['time'];
      let currentTime = new Date().getTime();
      unif.value += currentTime - this.lastTime;
      this.lastTime = currentTime;
      Uniform.Set(this.gl, this.program, unif);
      unif.stale = false;
    }

    for (let uniform in this.uniforms) {
      let unif = this.uniforms[uniform];

      if (unif.stale) {
        Uniform.Set(this.gl, this.program, unif);
      }
    }
  }

  use() {
    this.gl.useProgram(this.program);
    this.updateUniforms();
  }

  static showCompilationInfo(gl, shader, name, prefix) {
    prefix = prefix || 'Shader'; // This was stolen from THREE.js
    // https://github.com/mrdoob/three.js/blob/master/src/renderers/webgl/WebGLShader.js

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
      console.error(prefix + ' ' + name + ' did not compile.');
    }

    if (gl.getShaderInfoLog(shader) !== '') {
      console.warn(prefix + ' ' + name + ' info log: ' + gl.getShaderInfoLog(shader));
    }
  }

}

module.exports = Shader;

},{"../Math/Matrix4f":38,"./Uniform":20}],19:[function(require,module,exports){
"use strict";

//@ts-check

/** 
 * A class representing a tree. 
 * 
 * @property {Array} tree An array of arrays where the index is the node id and the inner arrays contain the neighbours.
 */
class Tree {
  /**
   * The constructor of the class Tree.
   * 
   * @param {Array[]} tree An array of arrays where the index is the node id and the inner arrays contain the neighbours.
   * @param {Array[]} weights An array of arrays where the index is the node id and the inner arrays contain the weights in the same order as tree contains neighbours.
   */
  constructor(tree, weights) {
    this.tree = tree;
    this.weights = weights;
  }
  /**
   * Layout the tree
   */


  layout() {
    let root = 0;
    let visited = new Uint8Array(this.tree.length);
    let pX = new Float32Array(this.tree.length);
    let pY = new Float32Array(this.tree.length);
    let queue = [root];
    visited[root] = 1;
    let current = null; // Position initial node

    pX[root] = 20.0;
    pY[root] = 10.0;

    while (queue.length > 0) {
      current = queue.shift();
      let offset = 0;

      for (var i = 0; i < this.tree[current].length; i++) {
        let child = this.tree[current][i];

        if (visited[child] === 0) {
          // Do some positioning
          pX[child] = pX[current] + this.weights[current][i] * 5.0;
          pY[child] = pY[current] + offset++ * 10.0 * this.weights[current][i];
          let fX = 0.0;
          let fY = 0.0;

          for (var j = 0; j < length; j++) {
            if (visited[j] === 0) {
              continue;
            }

            let distSquared = Math.pow(pX[j] - pX[child], 2.0) + Math.pow(pY[j] - pY[child], 2.0);
            let dist = Math.sqrt(distSquared);
            let fAttractive = 1000 / distSquared;
          } // Done with positioning


          visited[child] = 1;
          queue.push(child);
        }
      }
    }

    let positions = Array(this.tree.length);

    for (var i = 0; i < this.tree.length; i++) {
      positions[i] = [pX[i], pY[i]];
    }

    return positions;
  }
  /**
   * Create a tree from an edge list. 
   */


  static fromEdgeList(edgeList) {
    let length = 0;

    for (var i = 0; i < edgeList.length; i++) {
      if (edgeList[i][0] > length) {
        length = edgeList[i][0];
      }

      if (edgeList[i][1] > length) {
        length = edgeList[i][1];
      }
    }

    length++;
    let neighbours = Array(length);
    let weights = Array(length);

    for (var i = 0; i < length; i++) {
      neighbours[i] = Array();
      weights[i] = Array();
    }

    for (var i = 0; i < edgeList.length; i++) {
      neighbours[edgeList[i][0]].push(edgeList[i][1]);
      neighbours[edgeList[i][1]].push(edgeList[i][0]);
      weights[edgeList[i][0]].push(edgeList[i][2]);
      weights[edgeList[i][1]].push(edgeList[i][2]);
    }

    return new Tree(neighbours, weights);
  }

}

module.exports = Tree;

},{}],20:[function(require,module,exports){
"use strict";

//@ts-check

/**
 * A class representing a uniform.
 * 
 * @property {String} name The name of this uniform. Also the variable name in the shader.
 * @property {Number|number[]|Float32Array} value The value of this uniform.
 * @property {String} type The type of this uniform. Available types: int, int_vec2, int_vec3, int_vec4, int_array, float, float_vec2, float_vec3, float_vec4, float_array, float_mat2, float_mat3, float_mat4.
 * @property {Boolean} stale A boolean indicating whether or not this uniform is stale and needs to be updated.
 */
class Uniform {
  /**
   * Creates an instance of Uniform.
   * @param {String} name The name of this uniform. Also the variable name in the shader.
   * @param {Number|number[]|Float32Array} value The value of this uniform.
   * @param {String} type The type of this uniform. Available types: int, int_vec2, int_vec3, int_vec4, int_array, float, float_vec2, float_vec3, float_vec4, float_array, float_mat2, float_mat3, float_mat4.
   */
  constructor(name, value, type) {
    this.name = name;
    this.value = value;
    this.type = type;
    this.stale = true;
  }
  /**
   * Create and return a new instance of this uniform.
   * 
   * @returns {Uniform} A clone of this uniform.
   */


  clone() {
    return new Uniform(this.name, this.value, this.type);
  }
  /**
   * Set the value of this uniform.
   * 
   * @param {Number} value A number which is valid for the specified type.
   */


  setValue(value) {
    this.value = value;
    this.stale = true;
  }
  /**
   * Pushes the uniform to the GPU.
   * 
   * @param {WebGLRenderingContext} gl A WebGL rendering context.
   * @param {WebGLUniformLocation} program 
   * @param {Uniform} uniform 
   */


  static Set(gl, program, uniform) {
    let location = gl.getUniformLocation(program, uniform.name);

    if (uniform.type === 'int') {
      gl.uniform1i(location, uniform.value);
    } else if (uniform.type === 'int_vec2') {
      gl.uniform2iv(location, uniform.value);
    } else if (uniform.type === 'int_vec3') {
      gl.uniform3iv(location, uniform.value);
    } else if (uniform.type === 'int_vec4') {
      gl.uniform4iv(location, uniform.value);
    } else if (uniform.type === 'int_array') {
      gl.uniform1iv(location, uniform.value);
    } else if (uniform.type === 'float') {
      gl.uniform1f(location, uniform.value);
    } else if (uniform.type === 'float_vec2') {
      gl.uniform2fv(location, uniform.value);
    } else if (uniform.type === 'float_vec3') {
      gl.uniform3fv(location, uniform.value);
    } else if (uniform.type === 'float_vec4') {
      gl.uniform4fv(location, uniform.value);
    } else if (uniform.type === 'float_array') {
      gl.uniform1fv(location, uniform.value);
    } else if (uniform.type === 'float_mat2') {
      // false, see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix
      gl.uniformMatrix2fv(location, false, uniform.value);
    } else if (uniform.type === 'float_mat3') {
      gl.uniformMatrix3fv(location, false, uniform.value);
    } else if (uniform.type === 'float_mat4') {
      gl.uniformMatrix4fv(location, false, uniform.value);
    } // TODO: Add SAMPLER_2D and SAMPLER_CUBE
    // Had to set this to true because point sizes did not update...


    uniform.stale = true;
  }

}

module.exports = Uniform;

},{}],21:[function(require,module,exports){
"use strict";

const Attribute = require('./Attribute');

const Color = require('./Color');

const DrawModes = require('./DrawModes');

const Effect = require('./Effect');

const Geometry = require('./Geometry');

const Graph = require('./Graph');

const Node = require('./Node');

const Renderer = require('./Renderer');

const Shader = require('./Shader');

const Tree = require('./Tree');

const Uniform = require('./Uniform');

module.exports = {
  Attribute,
  Color,
  DrawModes,
  Effect,
  Geometry,
  Graph,
  Node,
  Renderer,
  Shader,
  Tree,
  Uniform
};

},{"./Attribute":10,"./Color":11,"./DrawModes":12,"./Effect":13,"./Geometry":14,"./Graph":15,"./Node":16,"./Renderer":17,"./Shader":18,"./Tree":19,"./Uniform":20}],22:[function(require,module,exports){
"use strict";

//@ts-check
const Geometry = require('../Core/Geometry');
/** 
 * An abstract class representing the base for filter implementations. 
 * 
 * @property {string} type The type name of this object (Lore.FilterBase).
 * @property {Geometry} geometry The Geometry associated with this filter.
 * @property {string} attribute The name of the attribute to filter on.
 * @property {number} attributeIndex The attribute-index to filter on.
 * @property {boolean} active Whether or not the filter is active.
 */


class FilterBase {
  /**
   * Creates an instance of FilterBase.
   * @param {string} attribute The name of the attribute to filter on.
   * @param {number} attributeIndex The attribute-index to filter on.
   */
  constructor(attribute, attributeIndex) {
    this.type = 'Lore.FilterBase';
    this.geometry = null;
    this.attribute = attribute;
    this.attributeIndex = attributeIndex;
    this.active = false;
  }
  /**
   * Returns the geometry associated with this filter.
   * 
   * @returns {Geometry} The geometry associated with this filter.
   */


  getGeometry() {
    return this.geometry;
  }
  /**
   * Sets the geometry associated with this filter.
   * 
   * @param {Geometry} value The geometry to be associated with this filter.
   */


  setGeometry(value) {
    this.geometry = value;
  }
  /**
   * Abstract method. 
   */


  filter() {}
  /**
   * Abstract method. 
   */


  reset() {}
  /**
   * Check whether or not a vertex with a given index is visible. A vertex is visible when its color attribute is > 0.0 at attribute-index 2 (the size in HSS).
   *
   * @param {Geometry} geometry A Lore.Geometry with a color attribute.
   * @param {number} index A vertex index.
   * @returns {boolean} A boolean indicating whether or not the vertex specified by index is visible (HSS size > 0.0).
   */


  static isVisible(geometry, index) {
    return geometry.attributes['color'].data[index * 3 + 2] > 0.0;
  }

}

module.exports = FilterBase;

},{"../Core/Geometry":14}],23:[function(require,module,exports){
"use strict";

//@ts-check
const FilterBase = require('./FilterBase');

const Color = require('../Core/Color');
/** 
 * A class representing an In-Range-Filter. It is used to filter a geometry based on a min and max value. 
 * @property {number} min The minimum value.
 * @property {number} max The maximum value.
 * */


class InRangeFilter extends FilterBase {
  /**
   * Creates an instance of InRangeFilter.
   * @param {string} attribute The name of the attribute to filter on.
   * @param {number} attributeIndex The attribute-index to filter on.
   * @param {number} min The minum value.
   * @param {number} max The maximum value.
   */
  constructor(attribute, attributeIndex, min, max) {
    super(attribute, attributeIndex);
    this.min = min;
    this.max = max;
  }
  /**
   * Get the minimum.
   * 
   * @returns {number} The minimum.
   */


  getMin() {
    return this.min;
  }
  /**
   * Set the minimum.
   * 
   * @param {number} value The minimum.
   */


  setMin(value) {
    this.min = value;
  }
  /**
   * Get the maximum.
   * 
   * @returns {number} The maximum.
   */


  getMax() {
    return this.max;
  }
  /**
   * Set the maximum.
   * 
   * @param {number} value The maximum.
   */


  setMax(value) {
    this.max = value;
  }
  /**
   * Execute the filter operation on the specified attribute and attribute-index. In order to filter, the HSS size value (attribute-index 2 of the color attribute) is set to its negative (1.0 -> -1.0, 2.5 -> -2.5).
   */


  filter() {
    let attribute = this.geometry.attributes[this.attribute];
    let isHue = this.attribute === 'color' && this.attributeIndex === 0;

    for (let i = 0; i < attribute.data.length; i += attribute.attributeLength) {
      let value = attribute.data[i + this.attributeIndex];

      if (isHue) {
        value = Color.floatToHsl(value)[0];
      }

      let size = this.geometry.attributes['color'].data[i + 2];

      if (value > this.max || value < this.min) {
        this.geometry.attributes['color'].data[i + 2] = -Math.abs(size);
      } else {
        this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
      }
    }

    this.geometry.updateAttribute('color');
  }
  /**
   * Resets the filter ("removes" it). The HSS size value is set back to its original value (-1.0 -> 1.0, -2.5 -> 2.5). 
   */


  reset() {
    let attribute = this.geometry.attributes[this.attribute];

    for (let i = 0; i < attribute.data.length; i += attribute.attributeLength) {
      let size = this.geometry.attributes['color'].data[i + 2];
      this.geometry.attributes['color'].data[i + 2] = Math.abs(size);
    }

    this.geometry.updateAttribute('color');
  }

}

module.exports = InRangeFilter;

},{"../Core/Color":11,"./FilterBase":22}],24:[function(require,module,exports){
"use strict";

const FilterBase = require('./FilterBase');

const InRangeFilter = require('./InRangeFilter');

module.exports = {
  FilterBase,
  InRangeFilter
};

},{"./FilterBase":22,"./InRangeFilter":23}],25:[function(require,module,exports){
"use strict";

//@ts-check
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
    super(renderer, geometryName, shaderName); // Create lines
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
      let p0 = [cx - r, cy - r, cz - r];
      let p1 = [cx - r, cy - r, cz + r];
      let p2 = [cx - r, cy + r, cz - r];
      let p3 = [cx - r, cy + r, cz + r];
      let p4 = [cx + r, cy - r, cz - r];
      let p5 = [cx + r, cy - r, cz + r];
      let p6 = [cx + r, cy + r, cz - r];
      let p7 = [cx + r, cy + r, cz + r];
      p[index++] = p0[0];
      p[index++] = p0[1];
      p[index++] = p0[2];
      p[index++] = p1[0];
      p[index++] = p1[1];
      p[index++] = p1[2];
      p[index++] = p0[0];
      p[index++] = p0[1];
      p[index++] = p0[2];
      p[index++] = p2[0];
      p[index++] = p2[1];
      p[index++] = p2[2];
      p[index++] = p0[0];
      p[index++] = p0[1];
      p[index++] = p0[2];
      p[index++] = p4[0];
      p[index++] = p4[1];
      p[index++] = p4[2];
      p[index++] = p1[0];
      p[index++] = p1[1];
      p[index++] = p1[2];
      p[index++] = p3[0];
      p[index++] = p3[1];
      p[index++] = p3[2];
      p[index++] = p1[0];
      p[index++] = p1[1];
      p[index++] = p1[2];
      p[index++] = p5[0];
      p[index++] = p5[1];
      p[index++] = p5[2];
      p[index++] = p2[0];
      p[index++] = p2[1];
      p[index++] = p2[2];
      p[index++] = p3[0];
      p[index++] = p3[1];
      p[index++] = p3[2];
      p[index++] = p2[0];
      p[index++] = p2[1];
      p[index++] = p2[2];
      p[index++] = p6[0];
      p[index++] = p6[1];
      p[index++] = p6[2];
      p[index++] = p3[0];
      p[index++] = p3[1];
      p[index++] = p3[2];
      p[index++] = p7[0];
      p[index++] = p7[1];
      p[index++] = p7[2];
      p[index++] = p4[0];
      p[index++] = p4[1];
      p[index++] = p4[2];
      p[index++] = p5[0];
      p[index++] = p5[1];
      p[index++] = p5[2];
      p[index++] = p4[0];
      p[index++] = p4[1];
      p[index++] = p4[2];
      p[index++] = p6[0];
      p[index++] = p6[1];
      p[index++] = p6[2];
      p[index++] = p5[0];
      p[index++] = p5[1];
      p[index++] = p5[2];
      p[index++] = p7[0];
      p[index++] = p7[1];
      p[index++] = p7[2];
      p[index++] = p6[0];
      p[index++] = p6[1];
      p[index++] = p6[2];
      p[index++] = p7[0];
      p[index++] = p7[1];
      p[index++] = p7[2];
    }

    this.opts = Utils.extend(true, AABBHelper.defaults, options);
    this.geometry.setMode(DrawModes.lines);
    this.setAttribute('position', p);
    this.setAttribute('color', c);
  }

}

module.exports = AABBHelper;

},{"../Core/DrawModes":12,"../Utils/Utils":62,"./HelperBase":27}],26:[function(require,module,exports){
"use strict";

//@ts-check
const Color = require('../Core/Color');

const HelperBase = require('./HelperBase');

const Vector3f = require('../Math/Vector3f');

const Utils = require('../Utils/Utils');

const DrawModes = require('../Core/DrawModes');

const PointHelper = require('./PointHelper');
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
  constructor(renderer, geometryName, shaderName = 'coordinates', options = {}) {
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
      }
    };
    this.opts = Utils.extend(true, this.defaults, options);
    this.geometry.setMode(DrawModes.lines);
    this.init();
  }
  /**
   * Initializes the coordinates system.
   */


  init() {
    let p = this.opts.position.components;
    let ao = this.opts.axis; // Setting the origin position of the axes

    let positions = [p[0], p[1], p[2], p[0] + ao.x.length, p[1], p[2], p[0], p[1], p[2], p[0], p[1] + ao.y.length, p[2], p[0], p[1], p[2], p[0], p[1], p[2] + ao.z.length]; // Setting the colors of the axes

    let cx = ao.x.color.components;
    let cy = ao.y.color.components;
    let cz = ao.z.color.components;
    let colors = [cx[0], cx[1], cx[2], cx[0], cx[1], cx[2], cy[0], cy[1], cy[2], cy[0], cy[1], cy[2], cz[0], cz[1], cz[2], cz[0], cz[1], cz[2]]; // Adding the box

    if (this.opts.box.enabled) {
      let bx = this.opts.box.x.color.components;
      let by = this.opts.box.y.color.components;
      let bz = this.opts.box.z.color.components;
      positions.push(p[0] + ao.x.length, p[1] + ao.y.length, p[2] + ao.z.length, p[0], p[1] + ao.y.length, p[2] + ao.z.length, p[0] + ao.x.length, p[1], p[2] + ao.z.length, p[0], p[1], p[2] + ao.z.length, p[0] + ao.x.length, p[1] + ao.y.length, p[2], p[0], p[1] + ao.y.length, p[2], p[0] + ao.x.length, p[1] + ao.y.length, p[2] + ao.z.length, p[0] + ao.x.length, p[1], p[2] + ao.z.length, p[0], p[1] + ao.y.length, p[2] + ao.z.length, p[0], p[1], p[2] + ao.z.length, p[0] + ao.x.length, p[1] + ao.y.length, p[2], p[0] + ao.x.length, p[1], p[2], p[0] + ao.x.length, p[1] + ao.y.length, p[2] + ao.z.length, p[0] + ao.x.length, p[1] + ao.y.length, p[2], p[0], p[1] + ao.y.length, p[2] + ao.z.length, p[0], p[1] + ao.y.length, p[2], p[0] + ao.x.length, p[1], p[2] + ao.z.length, p[0] + ao.x.length, p[1], p[2]);
      colors.push(bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], bx[0], bx[1], bx[2], by[0], by[1], by[2], by[0], by[1], by[2], by[0], by[1], by[2], by[0], by[1], by[2], by[0], by[1], by[2], by[0], by[1], by[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2], bz[0], bz[1], bz[2]);
    } // Adding the ticks


    if (this.opts.ticks.enabled) {
      let xTicks = this.opts.ticks.x,
          xTickOffset = ao.x.length / xTicks.count;
      let yTicks = this.opts.ticks.y,
          yTickOffset = ao.y.length / yTicks.count;
      let zTicks = this.opts.ticks.z,
          zTickOffset = ao.z.length / zTicks.count; // X ticks

      let pos = p[0];
      let col = xTicks.color.components;

      for (let i = 0; i < xTicks.count - 1; i++) {
        pos += xTickOffset; // From

        positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2], pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1] + xTicks.length, p[2] + xTicks.offset.components[2]);
        colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
      }

      pos = p[0];

      for (let i = 0; i < xTicks.count - 1; i++) {
        pos += xTickOffset; // From

        positions.push(pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2], pos + xTicks.offset.components[0], p[1] + xTicks.offset.components[1], p[2] + xTicks.offset.components[2] + xTicks.length);
        colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
      } // Y ticks


      pos = p[1];
      col = yTicks.color.components;

      for (let i = 0; i < yTicks.count - 1; i++) {
        pos += yTickOffset; // From

        positions.push(p[0] + yTicks.offset.components[0], pos + yTicks.offset.components[1], p[2] + yTicks.offset.components[2], p[0] + yTicks.offset.components[0] + yTicks.length, pos + yTicks.offset.components[1], p[2] + yTicks.offset.components[2]);
        colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
      }

      pos = p[1];

      for (let i = 0; i < yTicks.count - 1; i++) {
        pos += yTickOffset; // From

        positions.push(p[0] + yTicks.offset.components[0], pos + yTicks.offset.components[1], p[2] + yTicks.offset.components[2], p[0] + yTicks.offset.components[0], pos + yTicks.offset.components[1], p[2] + yTicks.offset.components[2] + yTicks.length);
        colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
      } // Z ticks


      pos = p[2];
      col = zTicks.color.components;

      for (let i = 0; i < zTicks.count - 1; i++) {
        pos += zTickOffset; // From

        positions.push(p[0] + zTicks.offset.components[0], p[1] + zTicks.offset.components[1], pos + zTicks.offset.components[2], p[0] + zTicks.offset.components[0], p[1] + zTicks.offset.components[1] + zTicks.length, pos + zTicks.offset.components[2]);
        colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
      }

      pos = p[2];

      for (let i = 0; i < zTicks.count - 1; i++) {
        pos += zTickOffset; // From

        positions.push(p[0] + zTicks.offset.components[0], p[1] + zTicks.offset.components[1], pos + zTicks.offset.components[2], p[0] + zTicks.offset.components[0] + zTicks.length, p[1] + zTicks.offset.components[1], pos + zTicks.offset.components[2]);
        colors.push(col[0], col[1], col[2], col[0], col[1], col[2]);
      }
    }

    this.setAttribute('position', new Float32Array(positions));
    this.setAttribute('color', new Float32Array(colors));
  }
  /**
   * Creates an instance of CoordinatesHelper from a PointHelper.
   * 
   * @param {PointHelper} pointHelper A Lore.Helpers.PointHelper object.
   */


  static fromPointHelper(pointHelper, options = {}) {
    let renderer = pointHelper.renderer;
    let geometryName = pointHelper.geometry.name + '_Coordinates';
    let opts = {
      axis: {
        x: {
          length: Math.abs(pointHelper.getDimensions().max.getX()) + Math.abs(pointHelper.getDimensions().min.getX())
        },
        y: {
          length: Math.abs(pointHelper.getDimensions().max.getY()) + Math.abs(pointHelper.getDimensions().min.getY())
        },
        z: {
          length: Math.abs(pointHelper.getDimensions().max.getZ()) + Math.abs(pointHelper.getDimensions().min.getZ())
        }
      }
    };
    opts = Utils.extend(true, opts, options);
    return new CoordinatesHelper(renderer, geometryName, opts);
  }

}

module.exports = CoordinatesHelper;

},{"../Core/Color":11,"../Core/DrawModes":12,"../Math/Vector3f":45,"../Utils/Utils":62,"./HelperBase":27,"./PointHelper":29}],27:[function(require,module,exports){
"use strict";

//@ts-check
const Shader = require('../Core/Shader');

const Geometry = require('../Core/Geometry');

const Node = require('../Core/Node');

const Shaders = require('../Shaders');
/** 
 * The base class for helper classes.
 * 
 * @property {Renderer} renderer An instance of Lore.Renderer.
 * @property {Shader} shader The shader associated with this helper.
 * @property {Geometry} geometry The geometry associated with this helper.
 */


class HelperBase extends Node {
  /**
   * Creates an instance of HelperBase.
   * 
   * @param {Renderer} renderer A Lore.Renderer object.
   * @param {String} geometryName The name of this geometry.
   * @param {String} shaderName The name of the shader used to render the geometry.
   */
  constructor(renderer, geometryName, shaderName) {
    super();
    this.renderer = renderer;
    this.shader = Shaders[shaderName].clone();
    this.geometry = this.renderer.createGeometry(geometryName, shaderName);
  }
  /**
   * Set the value (a typed array) of an attribute.
   * 
   * @param {String} name The name of the attribute. 
   * @param {number[]|Array|Float32Array} data A typed array containing the attribute values.
   */


  setAttribute(name, data) {
    this.geometry.addAttribute(name, data);
  }
  /**
   * Get the value of an attribute (usually a typed array).
   * 
   * @param {String} name The name of the attribute.
   * @returns {number[]|Array|Float32Array} Usually, a typed array containing the attribute values.
   */


  getAttribute(name) {
    return this.geometry.attributes[name].data;
  }
  /**
   * Update a the value of an attribute at a specific index and marks the attribute as stale.
   * 
   * @param {String} name The name of the attribute.
   * @param {Number} index The index of the value to be updated.
   * @param {number[]|Array|Float32Array} value Usually, a typed array or array with the length of the attribute values (3 for x, y, z coordinates) containing the new values.
   */


  updateAttribute(name, index, value) {
    let attr = this.geometry.attributes[name];
    let j = index * attr.attributeLength;

    for (let i = 0; i < attr.attributeLength; i++) {
      attr.data[j + i] = value[i] || attr.data[j + i];
    }

    attr.stale = true;
  }
  /**
   * Updates all the values in the attribute and marks the attribute as stale.
   * 
   * @param {String} name The name of the attribute.
   * @param {number[]|Array|Float32Array} values A typed array containing the new attribute values.
   */


  updateAttributeAll(name, values) {
    let attr = this.geometry.attributes[name];

    for (let i = 0; i < attr.data.length; i++) {
      attr.data[i] = values[i];
    }

    attr.stale = true;
  }
  /**
   * Calls the draw method of the underlying geometry.
   */


  draw() {
    this.geometry.draw(this.renderer);
  }
  /**
   * Destructor for the helper (mainly used for OctreeHelpers to clean up events).
   */


  destruct() {}

}

module.exports = HelperBase;

},{"../Core/Geometry":14,"../Core/Node":16,"../Core/Shader":18,"../Shaders":57}],28:[function(require,module,exports){
"use strict";

//@ts-check
const HelperBase = require('./HelperBase');

const PointHelper = require('./PointHelper');

const Octree = require('../Spice/Octree');

const Raycaster = require('../Spice/Raycaster');

const DrawModes = require('../Core/DrawModes');

const Utils = require('../Utils/Utils');

const Vector3f = require('../Math/Vector3f');

const AABB = require('../Spice/AABB');

const Matrix4f = require('../Math/Matrix4f');

const FilterBase = require('../Filters/FilterBase');

const Ray = require('../Math/Ray');
/** 
 * A helper class to create an octree associated with vertex data. 
 * 
 * @property {*} opts An object containing options.
 * @property {PointHelper} target The Lore.PointHelper object from which this octree is constructed.
 * @property {Renderer} renderer An instance of Lore.Renderer.
 * @property {Octree} octree The octree associated with the target.
 * @property {Raycaster} raycaster An instance of Lore.Raycaster.
 * @property {Object} hovered The currently hovered item.
 * @property {Object[]} selected The currently selected items.
 */


class OctreeHelper extends HelperBase {
  /**
   * Creates an instance of OctreeHelper.
   * 
   * @param {Renderer} renderer A Lore.Renderer object.
   * @param {String} geometryName The name of this geometry.
   * @param {String} shaderName The name of the shader used to render this octree.
   * @param {PointHelper} target The Lore.PointHelper object from which this octree is constructed.
   * @param {Object} options The options used to draw this octree.
   */
  constructor(renderer, geometryName, shaderName, target, options) {
    super(renderer, geometryName, shaderName);
    this.defaults = {
      visualize: false,
      multiSelect: true
    };
    this.opts = Utils.extend(true, this.defaults, options);
    this._eventListeners = {};
    this.target = target;
    this.renderer = renderer;
    this.octree = this.target.octree;
    this.raycaster = new Raycaster(1.0);
    this.hovered = null;
    this.selected = []; // Register this octreeHelper with the pointHelper

    this.target.octreeHelper = this;
    let that = this;

    this._dblclickHandler = function (e) {
      if (e.e.mouse.state.middle || e.e.mouse.state.right || !that.target.geometry.isVisible) {
        return;
      }

      let mouse = e.e.mouse.normalizedPosition;
      let result = that.getIntersections(mouse);

      if (result.length > 0) {
        if (that.selectedContains(result[0].index)) {
          return;
        }

        that.addSelected(result[0]);
      }
    };

    renderer.controls.addEventListener('dblclick', this._dblclickHandler);

    this._mousemoveHandler = function (e) {
      if (e.e.mouse.state.left || e.e.mouse.state.middle || e.e.mouse.state.right || !that.target.geometry.isVisible) {
        return;
      }

      let mouse = e.e.mouse.normalizedPosition;
      let result = that.getIntersections(mouse);

      if (result.length > 0) {
        if (that.hovered && that.hovered.index === result[0].index) {
          return;
        }

        that.hovered = result[0];
        that.hovered.screenPosition = that.renderer.camera.sceneToScreen(result[0].position, renderer);
        that.raiseEvent('hoveredchanged', {
          e: that.hovered
        });
      } else {
        that.hovered = null;
        that.raiseEvent('hoveredchanged', {
          e: null
        });
      }
    };

    renderer.controls.addEventListener('mousemove', this._mousemoveHandler);

    this._updatedHandler = function () {
      if (!that.target.geometry.isVisible) {
        return;
      }

      for (let i = 0; i < that.selected.length; i++) {
        that.selected[i].screenPosition = that.renderer.camera.sceneToScreen(that.selected[i].position, renderer);
      }

      if (that.hovered) {
        that.hovered.screenPosition = that.renderer.camera.sceneToScreen(that.hovered.position, renderer);
      }

      that.raiseEvent('updated');
    };

    renderer.controls.addEventListener('updated', this._updatedHandler);
    this.init();
  }
  /**
   * Initialize this octree.
   */


  init() {
    if (this.opts.visualize === 'centers') {
      this.drawCenters();
    } else if (this.opts.visualize === 'cubes') {
      this.drawBoxes();
    } else {
      this.geometry.isVisible = false;
    }
  }
  /**
   * Get the screen position of a vertex by its index.
   * 
   * @param {Number} index The index of a vertex.
   * @returns {Number[]} An array containing the screen position. E.g. [122, 290].
   */


  getScreenPosition(index) {
    let positions = this.target.geometry.attributes['position'].data;
    let k = index * 3;
    let p = new Vector3f(positions[k], positions[k + 1], positions[k + 2]);
    return this.renderer.camera.sceneToScreen(p, this.renderer);
  }
  /**
   * Adds an object to the selected collection of this Lore.OctreeHelper object.
   * 
   * @param {Object|Number} item Either an item (used internally) or the index of a vertex from the associated Lore.PointHelper object.
   */


  addSelected(item) {
    // If item is only the index, create a dummy item
    if (!isNaN(parseFloat(item))) {
      let positions = this.target.geometry.attributes['position'].data;
      let colors = this.target.geometry.attributes['color'].data;
      let k = item * 3;
      item = {
        distance: -1,
        index: item,
        locCode: -1,
        position: new Vector3f(positions[k], positions[k + 1], positions[k + 2]),
        color: colors ? [colors[k], colors[k + 1], colors[k + 2]] : null
      };
    }

    let index = this.selected.length;

    if (this.opts.multiSelect) {
      this.selected.push(item);
    } else {
      this.selected[0] = item;
      index = 0;
    }

    this.selected[index].screenPosition = this.renderer.camera.sceneToScreen(item.position, this.renderer);
    this.raiseEvent('selectedchanged', {
      e: this.selected
    });
  }
  /**
   * Remove an item from the selected collection of this Lore.OctreeHelper object.
   * 
   * @param {Number} index The index of the item in the selected collection.
   */


  removeSelected(index) {
    this.selected.splice(index, 1);
    this.raiseEvent('selectedchanged', {
      e: this.selected
    });
  }
  /**
   * Clear the selected collection of this Lore.OctreeHelper object.
   */


  clearSelected() {
    this.selected = [];
    this.raiseEvent('selectedchanged', {
      e: this.selected
    });
  }
  /**
   * Check whether or not the selected collection of this Lore.OctreeHelper object contains a vertex with a given index.
   * 
   * @param {Number} index The index of a vertex in the associated Lore.PointHelper object.
   * @returns {Boolean} A boolean indicating whether or not the selected collection of this Lore.OctreeHelper contains a vertex with a given index.
   */


  selectedContains(index) {
    for (let i = 0; i < this.selected.length; i++) {
      if (this.selected[i].index === index) {
        return true;
      }
    }

    return false;
  }
  /**
   * Adds a vertex with a given index to the currently hovered vertex of this Lore.OctreeHelper object.
   * 
   * @param {Number} index The index of a vertex in the associated Lore.PointHelper object.
   */


  setHovered(index) {
    if (this.hovered && this.hovered.index === index) {
      return;
    }

    let k = index * 3;
    let positions = this.target.geometry.attributes['position'].data;
    let colors = null;

    if ('color' in this.target.geometry.attributes) {
      colors = this.target.geometry.attributes['color'].data;
    }

    this.hovered = {
      index: index,
      position: new Vector3f(positions[k], positions[k + 1], positions[k + 2]),
      color: colors ? [colors[k], colors[k + 1], colors[k + 2]] : null
    };
    this.hovered.screenPosition = this.renderer.camera.sceneToScreen(this.hovered.position, this.renderer);
    this.raiseEvent('hoveredchanged', {
      e: this.hovered
    });
  }
  /**
   * Add the currently hovered vertex to the collection of selected vertices. 
   */


  selectHovered() {
    if (!this.hovered || this.selectedContains(this.hovered.index)) {
      return;
    }

    this.addSelected({
      distance: this.hovered.distance,
      index: this.hovered.index,
      locCode: this.hovered.locCode,
      position: this.hovered.position,
      color: this.hovered.color
    });
  }
  /**
   * Show the centers of the axis-aligned bounding boxes of this octree. 
   */


  showCenters() {
    this.opts.visualize = 'centers';
    this.drawCenters();
    this.geometry.isVisible = true;
  }
  /**
   * Show the axis-aligned boudning boxes of this octree as cubes. 
   */


  showCubes() {
    this.opts.visualize = 'cubes';
    this.drawBoxes();
    this.geometry.isVisible = true;
  }
  /**
   * Hide the centers or cubes of the axis-aligned bounding boxes associated with this octree.
   */


  hide() {
    this.opts.visualize = false;
    this.geometry.isVisible = false;
    this.setAttribute('position', new Float32Array([]));
    this.setAttribute('color', new Float32Array([]));
  }
  /**
   * Get the indices and distances of the vertices currently intersected by the ray sent from the mouse position.
   * 
   * @param {Object} mouse A mouse object containing x and y properties.
   * @returns {Object[]} A distance-sorted (ASC) array containing the interesected vertices.
   */


  getIntersections(mouse) {
    this.raycaster.set(this.renderer.camera, mouse.x, mouse.y);
    let tmp = this.octree.raySearch(this.raycaster);
    let result = this.rayIntersections(tmp);
    result.sort(function (a, b) {
      return a.distance - b.distance;
    });
    return result;
  }
  /**
   * Add an event listener to this Lore.OctreeHelper object.
   * 
   * @param {String} eventName The name of the event to listen for.
   * @param {Function} callback A callback function called when an event is fired.
   */


  addEventListener(eventName, callback) {
    if (!this._eventListeners[eventName]) {
      this._eventListeners[eventName] = [];
    }

    this._eventListeners[eventName].push(callback);
  }
  /**
   * Raise an event with a given name and send the data to the functions listening for this event.
   * 
   * @param {String} eventName The name of the event to be rised.
   * @param {*} [data={}] Data to be sent to the listening functions.
   */


  raiseEvent(eventName, data = {}) {
    if (!this._eventListeners[eventName]) {
      return;
    }

    for (let i = 0; i < this._eventListeners[eventName].length; i++) {
      this._eventListeners[eventName][i](data);
    }
  }
  /**
   * Adds a hoveredchanged event to multiple octrees and merges the event property e.
   * 
   * @param {OctreeHelper[]} octreeHelpers An array of octree helpers to join.
   * @param {Function} eventListener A event listener for hoveredchanged.
   */


  static joinHoveredChanged(octreeHelpers, eventListener) {
    for (let i = 0; i < octreeHelpers.length; i++) {
      octreeHelpers[i].addEventListener('hoveredchanged', function (e) {
        let result = {
          e: null,
          source: null
        };

        for (let j = 0; j < octreeHelpers.length; j++) {
          if (octreeHelpers[j].hovered !== null) {
            result = {
              e: octreeHelpers[j].hovered,
              source: j
            };
          }
        }

        eventListener(result);
      });
    }
  }
  /**
   * Draw the centers of the axis-aligned bounding boxes of this octree.
   */


  drawCenters() {
    this.geometry.setMode(DrawModes.points);
    let aabbs = this.octree.aabbs;
    let length = Object.keys(aabbs).length;
    let colors = new Float32Array(length * 3);
    let positions = new Float32Array(length * 3);
    let i = 0;

    for (var key in aabbs) {
      let c = aabbs[key].center.components;
      let k = i * 3;
      colors[k] = 1;
      colors[k + 1] = 1;
      colors[k + 2] = 1;
      positions[k] = c[0];
      positions[k + 1] = c[1];
      positions[k + 2] = c[2];
      i++;
    }

    this.setAttribute('position', new Float32Array(positions));
    this.setAttribute('color', new Float32Array(colors));
  }
  /**
   * Draw the axis-aligned bounding boxes of this octree.
   */


  drawBoxes() {
    this.geometry.setMode(DrawModes.lines);
    let aabbs = this.octree.aabbs;
    let length = Object.keys(aabbs).length;
    let c = new Float32Array(length * 24 * 3);
    let p = new Float32Array(length * 24 * 3);

    for (let i = 0; i < c.length; i++) {
      c[i] = 255.0;
    }

    let index = 0;

    for (var key in aabbs) {
      let corners = AABB.getCorners(aabbs[key]);
      p[index++] = corners[0][0];
      p[index++] = corners[0][1];
      p[index++] = corners[0][2];
      p[index++] = corners[1][0];
      p[index++] = corners[1][1];
      p[index++] = corners[1][2];
      p[index++] = corners[0][0];
      p[index++] = corners[0][1];
      p[index++] = corners[0][2];
      p[index++] = corners[2][0];
      p[index++] = corners[2][1];
      p[index++] = corners[2][2];
      p[index++] = corners[0][0];
      p[index++] = corners[0][1];
      p[index++] = corners[0][2];
      p[index++] = corners[4][0];
      p[index++] = corners[4][1];
      p[index++] = corners[4][2];
      p[index++] = corners[1][0];
      p[index++] = corners[1][1];
      p[index++] = corners[1][2];
      p[index++] = corners[3][0];
      p[index++] = corners[3][1];
      p[index++] = corners[3][2];
      p[index++] = corners[1][0];
      p[index++] = corners[1][1];
      p[index++] = corners[1][2];
      p[index++] = corners[5][0];
      p[index++] = corners[5][1];
      p[index++] = corners[5][2];
      p[index++] = corners[2][0];
      p[index++] = corners[2][1];
      p[index++] = corners[2][2];
      p[index++] = corners[3][0];
      p[index++] = corners[3][1];
      p[index++] = corners[3][2];
      p[index++] = corners[2][0];
      p[index++] = corners[2][1];
      p[index++] = corners[2][2];
      p[index++] = corners[6][0];
      p[index++] = corners[6][1];
      p[index++] = corners[6][2];
      p[index++] = corners[3][0];
      p[index++] = corners[3][1];
      p[index++] = corners[3][2];
      p[index++] = corners[7][0];
      p[index++] = corners[7][1];
      p[index++] = corners[7][2];
      p[index++] = corners[4][0];
      p[index++] = corners[4][1];
      p[index++] = corners[4][2];
      p[index++] = corners[5][0];
      p[index++] = corners[5][1];
      p[index++] = corners[5][2];
      p[index++] = corners[4][0];
      p[index++] = corners[4][1];
      p[index++] = corners[4][2];
      p[index++] = corners[6][0];
      p[index++] = corners[6][1];
      p[index++] = corners[6][2];
      p[index++] = corners[5][0];
      p[index++] = corners[5][1];
      p[index++] = corners[5][2];
      p[index++] = corners[7][0];
      p[index++] = corners[7][1];
      p[index++] = corners[7][2];
      p[index++] = corners[6][0];
      p[index++] = corners[6][1];
      p[index++] = corners[6][2];
      p[index++] = corners[7][0];
      p[index++] = corners[7][1];
      p[index++] = corners[7][2];
    }

    this.setAttribute('position', p);
    this.setAttribute('color', c);
  }
  /**
   * Set the threshold of the raycaster associated with this Lore.OctreeHelper object.
   * 
   * @param {Number} threshold The threshold (maximum distance to the ray) of the raycaster.
   */


  setThreshold(threshold) {
    this.raycaster.threshold = threshold;
  }
  /**
   * Execute a ray intersection search within this octree.
   * 
   * @param {Number[]} indices The indices of the octree nodes that are intersected by the ray.
   * @returns {*} An array containing the vertices intersected by the ray.
   */


  rayIntersections(indices) {
    let result = [];
    let inverseMatrix = Matrix4f.invert(this.target.modelMatrix); // this could be optimized, since the model matrix does not change

    let ray = new Ray();
    let threshold = this.raycaster.threshold * this.target.getPointScale();
    let positions = this.target.geometry.attributes['position'].data;
    let colors = null;

    if ('color' in this.target.geometry.attributes) {
      colors = this.target.geometry.attributes['color'].data;
    } // Only get points further away than the cutoff set in the point HelperBase


    let cutoff = this.target.getCutoff();
    ray.copyFrom(this.raycaster.ray).applyProjection(inverseMatrix);
    let localThreshold = threshold; // / ((pointCloud.scale.x + pointCloud.scale.y + pointCloud.scale.z) / 3);

    let localThresholdSq = localThreshold * localThreshold;

    for (let i = 0; i < indices.length; i++) {
      let index = indices[i].index;
      let locCode = indices[i].locCode;
      let k = index * 3;
      let v = new Vector3f(positions[k], positions[k + 1], positions[k + 2]);
      let rayPointDistanceSq = ray.distanceSqToPoint(v);

      if (rayPointDistanceSq < localThresholdSq) {
        let intersectedPoint = ray.closestPointToPoint(v);
        intersectedPoint.applyProjection(this.target.modelMatrix);
        let dist = this.raycaster.ray.source.distanceTo(intersectedPoint);
        let isVisible = FilterBase.isVisible(this.target.geometry, index);
        if (dist < this.raycaster.near || dist > this.raycaster.far || dist < cutoff || !isVisible) continue;
        result.push({
          distance: dist,
          index: index,
          locCode: locCode,
          position: v,
          color: colors ? [colors[k], colors[k + 1], colors[k + 2]] : null
        });
      }
    }

    return result;
  }
  /**
   * Remove eventhandlers from associated controls.
   */


  destruct() {
    this.renderer.controls.removeEventListener('dblclick', this._dblclickHandler);
    this.renderer.controls.removeEventListener('mousemove', this._mousemoveHandler);
    this.renderer.controls.removeEventListener('updated', this._updatedHandler);
  }

}

module.exports = OctreeHelper;

},{"../Core/DrawModes":12,"../Filters/FilterBase":22,"../Math/Matrix4f":38,"../Math/Ray":42,"../Math/Vector3f":45,"../Spice/AABB":58,"../Spice/Octree":59,"../Spice/Raycaster":60,"../Utils/Utils":62,"./HelperBase":27,"./PointHelper":29}],29:[function(require,module,exports){
"use strict";

//@ts-check
const HelperBase = require('./HelperBase');

const DrawModes = require('../Core/DrawModes');

const Color = require('../Core/Color');

const Utils = require('../Utils/Utils');

const Vector3f = require('../Math/Vector3f');

const AABB = require('../Spice/AABB');

const Octree = require('../Spice/Octree');

const FilterBase = require('../Filters/FilterBase');
/** 
 * A helper class wrapping a point cloud.
 * 
 * @property {Object} opts An object containing options.
 * @property {Number[]} indices Indices associated with the data.
 * @property {Octree} octree The octree associated with the point cloud.
 * @property {OctreeHelper} octreeHelper The octreeHelper associated with the pointHelper.
 * @property {Object} filters A map mapping filter names to Lore.Filter instances associated with this helper class.
 * @property {Number} pointSize The scaled and constrained point size of this data.
 * @property {Number} pointScale The scale of the point size.
 * @property {Number} rawPointSize The point size before scaling and constraints.
 * @property {Object} dimensions An object with the properties min and max, each a 3D vector containing the extremes.
 */


class PointHelper extends HelperBase {
  /**
   * Creates an instance of PointHelper.
   * @param {Renderer} renderer An instance of Lore.Renderer.
   * @param {String} geometryName The name of this geometry.
   * @param {String} shaderName The name of the shader used to render the geometry.
   * @param {Object} options An object containing options.
   */
  constructor(renderer, geometryName, shaderName, options) {
    super(renderer, geometryName, shaderName);
    let defaults = {
      octree: true,
      octreeThreshold: 500.0,
      octreeMaxDepth: 8,
      pointScale: 1.0,
      maxPointSize: 100.0
    };
    this.opts = Utils.extend(true, defaults, options);
    this.indices = null;
    this.octree = null;
    this.octreeHelper = null;
    this.geometry.setMode(DrawModes.points);
    this.initPointSize();
    this.filters = {};
    this.pointScale = this.opts.pointScale;
    this.rawPointSize = 1.0;
    this.pointSize = this.rawPointSize * this.pointScale;
    this.dimensions = {
      min: new Vector3f(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
      max: new Vector3f(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    };
    let that = this;

    this._zoomchangedHandler = function (zoom) {
      let threshold = that.setPointSize(zoom + 0.1);

      if (that.octreeHelper) {
        that.octreeHelper.setThreshold(threshold);
      }
    };

    renderer.controls.addEventListener('zoomchanged', this._zoomchangedHandler);
  }
  /**
   * Get the max length of the length of three arrays.
   * 
   * @param {Number[]|Array|Float32Array} x 
   * @param {Number[]|Array|Float32Array} y 
   * @param {Number[]|Array|Float32Array} z 
   * @returns {Number} The length of the largest array.
   */


  getMaxLength(x, y, z) {
    return Math.max(x.length, Math.max(y.length, z.length));
  }
  /**
   * Returns an object containing the dimensions of this point cloud.
   * 
   * @returns {Object} An object with the properties min and max, each a 3D vector containing the extremes.
   */


  getDimensions() {
    return this.dimensions;
  }
  /**
   * Get the center (average) of the point cloud.
   * 
   * @returns {Vector3f} The center (average) of the point cloud.
   */


  getCenter() {
    return new Vector3f((this.dimensions.max.getX() + this.dimensions.min.getX()) / 2.0, (this.dimensions.max.getY() + this.dimensions.min.getY()) / 2.0, (this.dimensions.max.getZ() + this.dimensions.min.getZ()) / 2.0);
  }
  /**
   * Gets the distance between the center and the point furthest from the center.
   * 
   * @return {Number} The maximal radius.
   */


  getMaxRadius() {
    let center = this.getCenter();
    return center.subtract(this.dimensions.max).length();
  }
  /**
   * Set the positions of points in this point cloud.
   * 
   * @param {Number[]|Array|Float32Array} positions The positions (linear array).
   * @returns {PointHelper} Itself.
   */


  setPositions(positions) {
    // Min, max will NOT be calculated as of now!
    // TODO?
    this.setAttribute('position', positions);
    return this;
  }
  /**
   * Set the positions of points in this point clouds.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @returns {PointHelper} Itself.
   */


  setPositionsXYZ(x, y, z) {
    const length = x.length;
    let positions = new Float32Array(length * 3);

    for (var i = 0; i < length; i++) {
      let j = 3 * i;
      positions[j] = x[i] || 0;
      positions[j + 1] = y[i] || 0;
      positions[j + 2] = z[i] || 0;

      if (x[i] > this.dimensions.max.getX()) {
        this.dimensions.max.setX(x[i]);
      }

      if (x[i] < this.dimensions.min.getX()) {
        this.dimensions.min.setX(x[i]);
      }

      if (y[i] > this.dimensions.max.getY()) {
        this.dimensions.max.setY(y[i]);
      }

      if (y[i] < this.dimensions.min.getY()) {
        this.dimensions.min.setY(y[i]);
      }

      if (z[i] > this.dimensions.max.getZ()) {
        this.dimensions.max.setZ(z[i]);
      }

      if (z[i] < this.dimensions.min.getZ()) {
        this.dimensions.min.setZ(z[i]);
      }
    }

    if (this.opts.octree) {
      let initialBounds = AABB.fromPoints(positions);
      let indices = new Uint32Array(length);

      for (var i = 0; i < length; i++) {
        indices[i] = i;
      }

      this.octree = new Octree(this.opts.octreeThreshold, this.opts.octreeMaxDepth);
      this.octree.build(indices, positions, initialBounds);
    }

    this.setAttribute('position', positions);
    return this;
  }
  /**
   * Set the positions (XYZ), the color (RGB) and size (S) of the points.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {Number[]|Array|Float32Array} r An array containing the r components.
   * @param {Number[]|Array|Float32Array} g An array containing the g components.
   * @param {Number[]|Array|Float32Array} b An array containing the b components.
   * @param {Number} [s=1.0] The size of the points.
   * @returns {PointHelper} Itself.
   */


  setXYZRGBS(x, y, z, r, g, b, s = 1.0) {
    const length = r.length;
    let c = new Float32Array(length);

    for (var i = 0; i < length; i++) {
      c[i] = Color.rgbToFloat(r[i], g[i], b[i]);
    }

    this._setValues(x, y, z, c, s);

    return this;
  }
  /**
   * Set the positions (XYZ), the color (RGB) and size (S) of the points.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {String} hex A hex value.
   * @param {Number} [s=1.0] The size of the points.
   * @returns {PointHelper} Itself.
   */


  setXYZHexS(x, y, z, hex, s = 1.0) {
    const length = x.length;
    let c = new Float32Array(length);
    let floatColor = Color.hexToFloat(hex);

    for (var i = 0; i < length; i++) {
      c[i] = floatColor;
    }

    this._setValues(x, y, z, c, s);

    return this;
  }
  /**
   * Set the positions (XYZ), the hue (H) and size (S) of the points.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {Number[]|Array|Float32Array|Number} [h=1.0] The hue as a number or an array.
   * @param {Number[]|Array|Float32Array|Number} [s=1.0] The size of the points.
   * @returns {PointHelper} Itself.
   */


  setXYZHS(x, y, z, h = 1.0, s = 1.0) {
    const length = x.length;
    let c = new Float32Array(length);

    if (typeof h !== 'number') {
      for (var i = 0; i < length; i++) {
        c[i] = Color.hslToFloat(h[i]);
      }
    } else if (typeof h) {
      h = Color.hslToFloat(h);

      for (var i = 0; i < length; i++) {
        c[i] = h;
      }
    }

    this._setValues(x, y, z, c, s);

    return this;
  } // TODO: Get rid of saturation


  _setValues(x, y, z, c, s) {
    let length = this.getMaxLength(x, y, z);
    let saturation = new Float32Array(length);

    for (var i = 0; i < length; i++) {
      saturation[i] = 0.0;
    }

    if (typeof s === 'number') {
      let tmpSize = new Float32Array(length);

      for (var i = 0; i < length; i++) {
        tmpSize[i] = s;
      }

      s = tmpSize;
    }

    this.setPositionsXYZ(x, y, z);
    this.setHSSFromArrays(c, saturation, s); // TODO: Check why the projection matrix update is needed

    this.renderer.camera.updateProjectionMatrix();
    this.renderer.camera.updateViewMatrix();
    return this;
  }
  /**
   * Set the positions and the HSS (Hue, Saturation, Size) values of the points in the point cloud.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {Number[]|Array|Float32Array|Number} hue An array containing the hues of the data points.
   * @param {Number[]|Array|Float32Array|Number} saturation An array containing the saturations of the data points.
   * @param {Number[]|Array|Float32Array|Number} size An array containing the sizes of the data points.
   * @returns {PointHelper} Itself.
   */


  setPositionsXYZHSS(x, y, z, hue, saturation, size) {
    console.warn('The method "setPositionsXYZHSS" is marked as deprecated.');
    let length = this.getMaxLength(x, y, z);
    saturation = new Float32Array(length);

    for (var i = 0; i < length; i++) {
      saturation[i] = 0.0;
    }

    if (typeof size === 'number') {
      let tmpSize = new Float32Array(length);

      for (var i = 0; i < length; i++) {
        tmpSize[i] = size;
      }

      size = tmpSize;
    }

    this.setPositionsXYZ(x, y, z);

    if (typeof hue === 'number' && typeof saturation === 'number' && typeof size === 'number') {
      let rgb = Color.hslToRgb(hue, 1.0, 0.5);
      this.setHSS(Color.rgbToFloat(rgb[0], rgb[1], rgb[2]), saturation, size, length);
    } else if (typeof hue !== 'number' && typeof saturation !== 'number' && typeof size !== 'number') {
      for (var i = 0; i < hue.length; i++) {
        let rgb = Color.hslToRgb(hue[i], 1.0, 0.5);
        hue[i] = Color.rgbToFloat(rgb[0], rgb[1], rgb[2]);
      }

      this.setHSSFromArrays(hue, saturation, size);
    } else {
      if (typeof hue === 'number') {
        let hueTmp = new Float32Array(length);
        let rgb = Color.hslToRgb(hue, 1.0, 0.5);
        hueTmp.fill(Color.rgbToFloat(rgb[0], rgb[1], rgb[2]));
        hue = hueTmp;
      } else if (typeof hue !== 'number') {
        for (var i = 0; i < hue.length; i++) {
          let rgb = Color.hslToRgb(hue[i], 1.0, 0.5);
          hue[i] = Color.rgbToFloat(rgb[0], rgb[1], rgb[2]);
        }

        this.setHSSFromArrays(hue, saturation, size);
      }

      if (typeof saturation === 'number') {
        let saturationTmp = new Float32Array(length);
        saturationTmp.fill(saturation);
        saturation = saturationTmp;
      }

      if (typeof size === 'number') {
        let sizeTmp = new Float32Array(length);
        sizeTmp.fill(size);
        size = sizeTmp;
      }

      this.setHSSFromArrays(hue, saturation, size);
    } // TODO: Check why the projection matrix update is needed


    this.renderer.camera.updateProjectionMatrix();
    this.renderer.camera.updateViewMatrix();
    return this;
  }
  /**
   * Set the colors (HSS) for the points.
   * 
   * @param {Number[]|Array|Float32Array} colors An array containing the HSS values.
   * @returns {PointHelper} Itself.
   */


  setColors(colors) {
    this.setAttribute('color', colors);
    return this;
  }
  /**
   * Update the colors (HSS) for the points.
   * 
   * @param {Number[]|Array|Float32Array} colors An array containing the HSS values.
   * @returns {PointHelper} Itself.
   */


  updateColors(colors) {
    this.updateAttributeAll('color', colors);
    return this;
  }
  /**
   * Update the color (HSS) at a specific index.
   * 
   * @param {Number} index The index of the data point.
   * @param {Color} color An instance of Lore.Color containing HSS values.
   * @returns {PointHelper} Itself.
   */


  updateColor(index, color) {
    console.warn('The method "updateColor" is marked as deprecated.');
    this.updateAttribute('color', index, color.components);
    return this;
  }
  /**
   * Update the color (HSS) at a specific index.
   * 
   * @param {Number} index The index of the data point.
   * @param {Color} color An instance of Lore.Color containing HSS values.
   * @returns {PointHelper} Itself.
   */


  setColor(index, color) {
    let c = new Color(color.toFloat(), this.getSaturation(index), this.getSize(index));
    this.updateAttribute('color', index, c.components);
    return this;
  }
  /**
   * Set the global point size.
   * 
   * @param {Number} size The global point size.
   * @returns {Number} The threshold for the raycaster.
   */


  setPointSize(size) {
    this.rawPointSize = size;
    this.updatePointSize();
    let pointSize = this.rawPointSize * this.opts.pointScale;

    if (pointSize > this.opts.maxPointSize) {
      return 0.5 * (this.opts.maxPointSize / pointSize);
    } else {
      return 0.5;
    }
  }
  /**
   * Updates the displayed point size.
   */


  updatePointSize() {
    let pointSize = this.rawPointSize * this.opts.pointScale;

    if (pointSize > this.opts.maxPointSize) {
      this.pointSize = this.opts.maxPointSize;
    } else {
      this.pointSize = pointSize;
    }

    this.geometry.shader.uniforms.size.value = this.pointSize;
  }
  /**
   * Get the global point size.
   * 
   * @returns {Number} The global point size.
   */


  getPointSize() {
    return this.geometry.shader.uniforms.size.value;
  }
  /**
   * Get the global point scale.
   * 
   * @returns {Number} The global point size.
   */


  getPointScale() {
    return this.opts.pointScale;
  }
  /**
   * Sets the global point scale.
   * 
   * @param {Number} pointScale The global point size.
   * @returns {PointHelper} Itself.
   */


  setPointScale(pointScale) {
    this.opts.pointScale = pointScale;
    this.updatePointSize();
    return this;
  }
  /**
   * Sets the fog colour and it's density, as seen from the camera.
   * 
   * @param {Array} color An array defining the rgba values of the fog colour.
   * @param {Number} fogDensity The density of the fog.
   * @returns {PointHelper} Itself.
   */


  setFog(color, fogDensity = 6.0) {
    if (!this.geometry.shader.uniforms.clearColor || !this.geometry.shader.uniforms.fogDensity) {
      console.warn('Shader "' + this.geometry.shader.name + '" does not support fog.');
      return this;
    }

    this.geometry.shader.uniforms.clearColor.value = color;
    this.geometry.shader.uniforms.fogDensity.value = fogDensity;
    return this;
  }
  /**
   * Initialize the point size based on the current zoom.
   * 
   * @returns {PointHelper} Itself.
   */


  initPointSize() {
    this.setPointSize(this.renderer.camera.zoom + 0.1);
    return this;
  }
  /**
   * Get the current cutoff value.
   * 
   * @returns {Number} The current cutoff value.
   */


  getCutoff() {
    return this.geometry.shader.uniforms.cutoff.value;
  }
  /**
   * Set the cutoff value.
   * 
   * @param {Number} cutoff A cutoff value.
   * @returns {PointHelper} Itself.
   */


  setCutoff(cutoff) {
    this.geometry.shader.uniforms.cutoff.value = cutoff;
    return this;
  }
  /**
   * Get the hue for a given index.
   * 
   * @param {Number} index An index.
   * @returns {Number} The hue of the specified index.
   */


  getHue(index) {
    console.warn('The method "getHue" is marked as deprecated. Please use "getColor".');
    let colors = this.getAttribute('color');
    return Color.floatToHsl(colors[index * 3]);
  }
  /**
  * Get the color for a given index.
  * 
  * @param {Number} index An index.
  * @returns {Number[]|Array} The color of the specified index in RGB.
  */


  getColor(index) {
    let colors = this.getAttribute('color');
    return Color.floatToRgb(colors[index * 3]);
  }
  /**
   * Get the saturation for a given index.
   * 
   * @param {Number} index An index.
   * @returns {Number} The saturation of the specified index.
   */


  getSaturation(index) {
    let colors = this.getAttribute('color');
    return colors[index * 3 + 1];
  }
  /**
   * Get the size for a given index.
   * 
   * @param {Number} index An index.
   * @returns {Number} The size of the specified index.
   */


  getSize(index) {
    let colors = this.getAttribute('color');
    return colors[index * 3 + 2];
  }
  /**
   * Get the position for a given index.
   * 
   * @param {Number} index An index.
   * @returns {Vector3f} The position of the specified index.
   */


  getPosition(index) {
    let positions = this.getAttribute('position');
    return new Vector3f(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2]);
  }
  /**
   * Set the hue. If a number is supplied, all the hues are set to the supplied number.
   * 
   * @param {Number[]|Array|Float32Array|Number} hue The hue to be set. If a number is supplied, all hues are set to its value.
   */


  setHue(hue) {
    let colors = this.getAttribute('color');
    let index = 0;

    if (typeof hue === 'number') {
      hue = Color.hslToFloat(hue);

      for (let i = 0; i < colors.length; i++) {
        colors[i * 3] = hue;
      }
    } else {
      for (let i = 0; i < hue.length; i++) {
        colors[i * 3] = Color.hslToFloat(hue[i]);
      }
    }

    this.setColors(colors);
  }
  /**
   * Set the saturation. If a number is supplied, all the saturations are set to the supplied number.
   * 
   * @param {Number[]|Array|Float32Array|Number} saturation The saturation to be set. If a number is supplied, all saturations are set to its value.
   */


  setSaturation(saturation) {
    let colors = this.getAttribute('color');
    let c = null;
    let index = 0;

    if (typeof saturation === 'number') {
      let length = colors.length;
      c = new Float32Array(length * 3);

      for (let i = 0; i < length * 3; i += 3) {
        c[i] = colors[i];
        c[i + 1] = saturation;
        c[i + 2] = colors[i + 2];
      }
    } else {
      let length = saturation.length;
      c = new Float32Array(length * 3);

      for (let i = 0; i < length * 3; i += 3) {
        c[i] = colors[i];
        c[i + 1] = saturation[index++];
        c[i + 2] = colors[i + 2];
      }
    }

    this.setColors(c);
  }
  /**
   * Set the size. If a number is supplied, all the sizes are set to the supplied number.
   * 
   * @param {Number[]|Array|Float32Array|Number} size The size to be set. If a number is supplied, all sizes are set to its value.
   */


  setSize(size) {
    let colors = this.getAttribute('color');
    let c = null;
    let index = 0;

    if (typeof size === 'number') {
      let length = colors.length;
      c = new Float32Array(length * 3);

      for (let i = 0; i < length * 3; i += 3) {
        c[i] = colors[i];
        c[i + 1] = colors[i + 1];
        c[i + 2] = size;
      }
    } else {
      let length = size.length;
      c = new Float32Array(length * 3);

      for (let i = 0; i < length * 3; i += 3) {
        c[i] = colors[i];
        c[i + 1] = colors[i + 1];
        c[i + 2] = size[index++];
      }
    }

    this.setColors(c);
  }
  /**
   * Set the HSS values. Sets all indices to the same values.
   * 
   * @param {Number} hue A hue value.
   * @param {Number} saturation A saturation value.
   * @param {Number} size A size value.
   * @param {Number} length The length of the arrays.
   */


  setHSS(hue, saturation, size, length) {
    let c = new Float32Array(length * 3);

    for (let i = 0; i < length * 3; i += 3) {
      c[i] = hue;
      c[i + 1] = saturation;
      c[i + 2] = size;
    }

    this.setColors(c);
  }
  /**
   * Set the color from RGB values. Sets all indices to the same values.
   * 
   * @param {Number} r The red colour component.
   * @param {Number} g The green colour component.
   * @param {Number} b The blue colour component.
   */


  setRGB(r, g, b) {
    let c = this.getAttribute('color');

    for (let i = 0; i < c.length; i++) {
      c[i * 3] = Color.rgbToFloat(r, g, b);
    }

    this.setColors(c);
  }
  /**
   * Set the color from RGB values. Sets all indices to the same values.
   * 
   * @param {Number[]|Array|Float32Array} r The red colour component.
   * @param {Number[]|Array|Float32Array} g The green colour component.
   * @param {Number[]|Array|Float32Array} b The blue colour component.
   */


  setRGBFromArrays(r, g, b) {
    const length = Math.min(Math.min(r.length, g.length), b.length);
    let c = this.getAttribute('color');

    for (let i = 0; i < length; i++) {
      c[i * 3] = Color.rgbToFloat(r[i], g[i], b[i]);
    }

    this.setColors(c);
  }
  /**
   * Set the HSS values.
   * 
   * @param {Number[]|Array|Float32Array} hue An array of hue values.
   * @param {Number[]|Array|Float32Array} saturation An array of saturation values.
   * @param {Number[]|Array|Float32Array} size An array of size values.
   */


  setHSSFromArrays(hue, saturation, size) {
    let length = hue.length;
    let c = new Float32Array(length * 3);
    let index = 0;

    if (hue.length !== length && saturation.length !== length && size.length !== length) {
      throw 'Hue, saturation and size have to be arrays of length "length" (' + length + ').';
    }

    for (let i = 0; i < length * 3; i += 3) {
      c[i] = hue[index];
      c[i + 1] = saturation[index];
      c[i + 2] = size[index];
      index++;
    }

    this.setColors(c);
  }
  /**
   * Add a filter to this point helper.
   * 
   * @param {String} name The name of the filter.
   * @param {FilterBase} filter A filter instance.
   * @returns {PointHelper} Itself.
   */


  addFilter(name, filter) {
    filter.setGeometry(this.geometry);
    this.filters[name] = filter;
    return this;
  }
  /**
   * Remove a filter by name.
   * 
   * @param {String} name The name of the filter to be removed.
   * @returns {PointHelper} Itself.
   */


  removeFilter(name) {
    delete this.filters[name];
    return this;
  }
  /**
   * Get a filter by name.
   * 
   * @param {String} name The name of a filter.
   * @returns {FilterBase} A filter instance.
   */


  getFilter(name) {
    return this.filters[name];
  }
  /**
   * Hide the geometry associated with this pointHelper.
   */


  show() {
    this.geometry.show();
  }
  /**
   * Show the geometry associated with this pointHelper.
   */


  hide() {
    this.geometry.hide();
  }
  /**
   * Remove eventhandlers from associated controls.
   */


  destruct() {
    this.renderer.controls.removeEventListener('zoomchanged', this._zoomchangedHandler);
  }

}

module.exports = PointHelper;

},{"../Core/Color":11,"../Core/DrawModes":12,"../Filters/FilterBase":22,"../Math/Vector3f":45,"../Spice/AABB":58,"../Spice/Octree":59,"../Utils/Utils":62,"./HelperBase":27}],30:[function(require,module,exports){
"use strict";

//@ts-check
const HelperBase = require('./HelperBase');

const DrawModes = require('../Core/DrawModes');

const Color = require('../Core/Color');

const Utils = require('../Utils/Utils');

class TreeHelper extends HelperBase {
  constructor(renderer, geometryName, shaderName, options) {
    super(renderer, geometryName, shaderName);
    this.defaults = {
      pointScale: 1.0,
      maxPointSize: 100.0
    };
    this.opts = Utils.extend(true, this.defaults, options);
    this.indices = null;
    this.geometry.setMode(DrawModes.lines);
    this.initPointSize();
    this.filters = {};
  }

  getMaxLength(x, y, z) {
    return Math.max(x.length, Math.max(y.length, z.length));
  }

  setPositions(positions) {
    this.setAttribute('position', positions);
  }

  setPositionsXYZ(x, y, z) {
    const length = x.length;
    let positions = new Float32Array(length * 3);

    for (let i = 0; i < length; i++) {
      let j = 3 * i;
      positions[j] = x[i] || 0;
      positions[j + 1] = y[i] || 0;
      positions[j + 2] = z[i] || 0;
    }

    this.setAttribute('position', positions);
  }
  /**
   * Set the positions (XYZ), the color (RGB) and size (S) of the points.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {Number[]|Array|Float32Array} r An array containing the r components.
   * @param {Number[]|Array|Float32Array} g An array containing the g components.
   * @param {Number[]|Array|Float32Array} b An array containing the b components.
   * @param {Number} [s=1.0] The size of the points.
   * @returns {TreeHelper} Itself.
   */


  setXYZRGBS(x, y, z, r, g, b, s = 1.0) {
    const length = r.length;
    let c = new Float32Array(length);

    for (var i = 0; i < length; i++) {
      c[i] = Color.rgbToFloat(r[i], g[i], b[i]);
    }

    this._setValues(x, y, z, c, s);

    return this;
  }
  /**
   * Set the positions (XYZ), the color (RGB) and size (S) of the points.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {String} hex A hex value.
   * @param {Number} [s=1.0] The size of the points.
   * @returns {TreeHelper} Itself.
   */


  setXYZHexS(x, y, z, hex, s = 1.0) {
    const length = x.length;
    let c = new Float32Array(length);
    let floatColor = Color.hexToFloat(hex);

    for (var i = 0; i < length; i++) {
      c[i] = floatColor;
    }

    this._setValues(x, y, z, c, s);

    return this;
  }
  /**
   * Set the positions (XYZ), the hue (H) and size (S) of the points.
   * 
   * @param {Number[]|Array|Float32Array} x An array containing the x components.
   * @param {Number[]|Array|Float32Array} y An array containing the y components.
   * @param {Number[]|Array|Float32Array} z An array containing the z components.
   * @param {Number[]|Array|Float32Array|Number} [h=1.0] The hue as a number or an array.
   * @param {Number[]|Array|Float32Array|Number} [s=1.0] The size of the points.
   * @returns {TreeHelper} Itself.
   */


  setXYZHS(x, y, z, h = 1.0, s = 1.0) {
    const length = x.length;
    let c = new Float32Array(length);

    if (typeof h !== 'number') {
      for (var i = 0; i < length; i++) {
        c[i] = Color.hslToFloat(h[i]);
      }
    } else if (typeof h) {
      h = Color.hslToFloat(h);

      for (var i = 0; i < length; i++) {
        c[i] = h;
      }
    }

    this._setValues(x, y, z, c, s);

    return this;
  } // TODO: Get rid of saturation


  _setValues(x, y, z, c, s) {
    let length = this.getMaxLength(x, y, z);
    let saturation = new Float32Array(length);

    for (var i = 0; i < length; i++) {
      saturation[i] = 0.0;
    }

    if (typeof s === 'number') {
      let tmpSize = new Float32Array(length);

      for (var i = 0; i < length; i++) {
        tmpSize[i] = s;
      }

      s = tmpSize;
    }

    this.setPositionsXYZ(x, y, z);
    this.setHSSFromArrays(c, saturation, s); // TODO: Check why the projection matrix update is needed

    this.renderer.camera.updateProjectionMatrix();
    this.renderer.camera.updateViewMatrix();
    return this;
  }

  setPositionsXYZHSS(x, y, z, hue, saturation, size) {
    console.warn('The method "setPositionsXYZHSS" is marked as deprecated.');
    let length = this.getMaxLength(x, y, z);
    this.setPositionsXYZ(x, y, z, length);
    this.setHSS(hue, saturation, size, length);
  }

  setColors(colors) {
    this.setAttribute('color', colors);
  }

  updateColors(colors) {
    this.updateAttributeAll('color', colors);
  }

  updateColor(index, color) {
    this.updateAttribute('color', index, color.components);
  }

  setPointSize(size) {
    if (size * this.opts.pointScale > this.opts.maxPointSize) {
      return;
    }

    this.geometry.shader.uniforms.size.value = size * this.opts.pointScale;
  }

  getPointSize() {
    return this.geometry.shader.uniforms.size.value;
  }

  setFogDistance(fogStart, fogEnd) {
    console.warn('This function is deprecated.'); // this.geometry.shader.uniforms.fogStart.value = fogStart;
    // this.geometry.shader.uniforms.fogEnd.value = fogEnd;
  }

  initPointSize() {
    this.geometry.shader.uniforms.size.value = this.renderer.camera.zoom * this.opts.pointScale;
  }

  getCutoff() {
    return this.geometry.shader.uniforms.cutoff.value;
  }

  setCutoff(cutoff) {
    this.geometry.shader.uniforms.cutoff.value = cutoff;
  }

  getHue(index) {
    let colors = this.getAttribute('color');
    return colors[index * 3];
  }

  setHSS(hue, saturation, size, length) {
    let c = new Float32Array(length * 3);

    for (let i = 0; i < length * 3; i += 3) {
      c[i] = hue;
      c[i + 1] = saturation;
      c[i + 2] = size;
    }

    this.setColors(c);
  }
  /**
   * Sets the fog colour and it's density, as seen from the camera.
   * 
   * @param {Array} color An array defining the rgba values of the fog colour.
   * @param {Number} fogDensity The density of the fog.
   * @returns {TreeHelper} Itself.
   */


  setFog(color, fogDensity = 6.0) {
    if (!this.geometry.shader.uniforms.clearColor || !this.geometry.shader.uniforms.fogDensity) {
      console.warn('Shader "' + this.geometry.shader.name + '" does not support fog.');
      return this;
    }

    this.geometry.shader.uniforms.clearColor.value = color;
    this.geometry.shader.uniforms.fogDensity.value = fogDensity;
    return this;
  }
  /**
   * Set the HSS values.
   * 
   * @param {Number[]|Array|Float32Array} hue An array of hue values.
   * @param {Number[]|Array|Float32Array} saturation An array of saturation values.
   * @param {Number[]|Array|Float32Array} size An array of size values.
   */


  setHSSFromArrays(hue, saturation, size) {
    let length = hue.length;
    let c = new Float32Array(length * 3);
    let index = 0;

    if (hue.length !== length && saturation.length !== length && size.length !== length) {
      throw 'Hue, saturation and size have to be arrays of length "length" (' + length + ').';
    }

    for (let i = 0; i < length * 3; i += 3) {
      c[i] = hue[index];
      c[i + 1] = saturation[index];
      c[i + 2] = size[index];
      index++;
    }

    this.setColors(c);
  }

  addFilter(name, filter) {
    filter.setGeometry(this.geometry);
    this.filters[name] = filter;
  }

  removeFilter(name) {
    delete this.filters[name];
  }

  getFilter(name) {
    return this.filters[name];
  }

}

module.exports = TreeHelper;

},{"../Core/Color":11,"../Core/DrawModes":12,"../Utils/Utils":62,"./HelperBase":27}],31:[function(require,module,exports){
"use strict";

const AABBHelper = require('./AABBHelper');

const CoordinatesHelper = require('./CoordinatesHelper');

const HelperBase = require('./HelperBase');

const OctreeHelper = require('./OctreeHelper');

const PointHelper = require('./PointHelper');

const TreeHelper = require('./TreeHelper');

module.exports = {
  AABBHelper,
  CoordinatesHelper,
  HelperBase,
  OctreeHelper,
  PointHelper,
  TreeHelper
};

},{"./AABBHelper":25,"./CoordinatesHelper":26,"./HelperBase":27,"./OctreeHelper":28,"./PointHelper":29,"./TreeHelper":30}],32:[function(require,module,exports){
"use strict";

//@ts-check
const FileReaderBase = require('./FileReaderBase');

const Utils = require('../Utils/Utils');
/** A class representing a CSV file reader. */


class CsvFileReader extends FileReaderBase {
  /**
   * Creates an instance of CsvFileReader.
   * @param {String} source The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true.
   * @param {any} options Options. See documentation for details.
   * @param {boolean} [local=true] A boolean indicating whether or not the source is local (a file input) or remote (a url).
   */
  constructor(source, options, local = true) {
    super(source, local);
    this.defaults = {
      separator: ',',
      cols: [],
      types: [],
      header: true
    };
    this.opts = Utils.extend(true, this.defaults, options);
    this.columns = {};
    this.headers = [];
    this.types = this.opts.types;
    this.cols = this.opts.cols;
  }
  /**
   * Called when the data is loaded, will raise the "loaded" event.
   * 
   * @param {any} data The data loaded from the file or url.
   * @returns {CsvFileReader} Itself.
   */


  loaded(data) {
    data = data.replace('\n\n', '\n');
    data = data.replace(/^\s+|\s+$/g, '');
    let lines = data.split('\n');
    let length = lines.length;
    let init = true;
    let h = this.opts.header ? 1 : 0;

    if (this.cols.length !== 0) {
      if (this.types.length !== this.cols.length) {
        throw 'Types and cols must have the same number of elements.';
      }
    } else {
      if (this.types.length !== this.cols.length || this.types.length + this.cols.length === 0) {
        let values = lines[h].split(this.opts.separator);
        this.types = [];

        for (let i = 0; i < values.length; i++) {
          if (Utils.isFloat(parseFloat(values[i], 10))) {
            this.types.push('Float32Array');
          } else if (Utils.isInt(parseFloat(values[i], 10))) {
            this.types.push('Int32Array');
          } else {
            this.types.push('StringArray');
          }
        }
      }
    }

    if (this.cols.length === 0) {
      let values = lines[0].split(this.opts.separator);

      for (let i = 0; i < values.length; i++) {
        this.cols.push(i);
      }
    }

    if (h) {
      let headerNames = lines[0].split(this.opts.separator);

      for (let i = 0; i < this.cols.length; i++) {
        this.headers[i] = headerNames[this.cols[i]].trim();
      }
    } else {
      for (let i = 0; i < this.cols.length; i++) {
        this.headers[i] = i;
      }
    }

    for (let i = h; i < length; i++) {
      let values = lines[i].split(this.opts.separator);
      if (this.cols.length == 0) for (let j = 0; j < values.length; j++) {
        this.cols.push[j];
      }

      if (init) {
        for (let j = 0; j < this.cols.length; j++) {
          this._createArray(this.headers[j], this.types[j], length - h);
        }

        init = false;
      }

      for (let j = 0; j < this.cols.length; j++) {
        this.columns[this.headers[j]][i - h] = values[this.cols[j]];
      }
    }

    this.raiseEvent('loaded', this.columns);
    return this;
  }

  _createArray(index, type, length) {
    if (type == 'Int8Array') {
      this.columns[index] = new Int8Array(length);
    } else if (type == 'Uint8Array') {
      this.columns[index] = new Uint8Array(length);
    } else if (type == 'Uint8ClampedArray') {
      this.columns[index] = new Uint8ClampedArray(length);
    } else if (type == 'Int16Array') {
      this.columns[index] = new Int16Array(length);
    } else if (type == 'Uint16Array') {
      this.columns[index] = new Uint16Array(length);
    } else if (type == 'Int32Array') {
      this.columns[index] = new Int32Array(length);
    } else if (type == 'Uint32Array') {
      this.columns[index] = new Uint32Array(length);
    } else if (type == 'Float32Array') {
      this.columns[index] = new Float32Array(length);
    } else if (type == 'Float64Array') {
      this.columns[index] = new Float64Array(length);
    } else {
      this.columns[index] = new Array(length);
    }

    return this;
  }

}

module.exports = CsvFileReader;

},{"../Utils/Utils":62,"./FileReaderBase":33}],33:[function(require,module,exports){
"use strict";

//@ts-check
const Utils = require('../Utils/Utils');
/** 
 * An abstract class representing the base for file reader implementations. 
 * 
 * @property {String} source The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true.
 * */


class FileReaderBase {
  /**
   * Creates an instance of FileReaderBase.
   * 
   * @param {String} source The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true.
   * @param {Boolean} [local=true] A boolean indicating whether or not the source is local (a file input) or remote (a url).
   */
  constructor(source, local = true) {
    this.source = source;
    this._eventListeners = {};
    let that = this;

    if (local) {
      this.element = document.getElementById(this.source);
      this.element.addEventListener('click', function () {
        this.value = null;
      });
      this.element.addEventListener('change', function () {
        let fileReader = new FileReader();

        fileReader.onload = function () {
          that.loaded(fileReader.result);
        };

        fileReader.readAsBinaryString(this.files[0]);
      });
    } else {
      Utils.jsonp(source, function (response) {
        that.loaded(response);
      });
    }
  }
  /**
   * Add an event listener.
   * 
   * @param {String} eventName The name of the event.
   * @param {Function} callback A callback function associated with the event name.
   */


  addEventListener(eventName, callback) {
    if (!this._eventListeners[eventName]) {
      this._eventListeners[eventName] = [];
    }

    this._eventListeners[eventName].push(callback);
  }
  /**
   * Raise an event. To be called by inheriting classes.
   * 
   * @param {String} eventName The name of the event.
   * @param {any} data Data to be passed to the handler.
   */


  raiseEvent(eventName, data) {
    if (!this._eventListeners[eventName]) {
      return;
    }

    for (let i = 0; i < this._eventListeners[eventName].length; i++) {
      this._eventListeners[eventName][i](data);
    }
  }
  /**
   * To be overwritten by inheriting classes.
   * 
   * @param {any} data 
   */


  loaded(data) {}

}

module.exports = FileReaderBase;

},{"../Utils/Utils":62}],34:[function(require,module,exports){
"use strict";

//@ts-check
const FileReaderBase = require('./FileReaderBase');

const Utils = require('../Utils/Utils');
/** A class representing a matrix file reader. */


class MatrixFileReader extends FileReaderBase {
  /**
   * Creates an instance of MatrixFileReader.
   * @param {String} source The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true.
   * @param {any} options Options. See documentation for details.
   * @param {boolean} [local=true] A boolean indicating whether or not the source is local (a file input) or remote (a url).
   */
  constructor(source, options, local = true) {
    super(source, local);
    this.defaults = {
      elementSeperator: '\t',
      valueSeparator: ';',
      replaceNaNWith: 'NaN',
      skipNaN: true,
      types: []
    };
    this.opts = Utils.extend(true, this.defaults, options);
    this.types = this.opts.types;
    this.columns = {};

    if (this.types.length === 0) {
      throw 'When reading data from a file, the types have to be specified.';
    } // Add the types for the indices


    this.opts.types.unshift('Int32Array');
    this.opts.types.unshift('Int32Array');
    this.opts.types.unshift('Int32Array');
  }
  /**
   * Called when the data is loaded, will raise the "loaded" event.
   * 
   * @param {any} data The data loaded from the file or url.
   * @returns {MatrixFileReader} Itself.
   */


  loaded(data) {
    data = data.replace('\n\n', '\n');
    data = data.replace(/^\s+|\s+$/g, '');

    if (this.opts.replaceNaNWith !== 'NaN') {
      data = data.replace('NaN', this.opts.replaceNaNWith);
    }

    let lines = data.split('\n');
    let nRows = lines.length;
    let nColumns = lines[0].split(this.opts.elementSeperator).length; // Including the indices (x, y, z), therefore + 3

    let nValues = lines[0].split(this.opts.elementSeperator)[0].split(this.opts.valueSeparator).length + 3;

    if (this.types.length !== nValues || this.types.length + nValues === 0) {
      let values = lines[0].split(this.opts.valueSeparator);
      this.types = [];

      for (let i = 0; i < values.length; i++) {
        if (Utils.isFloat(parseFloat(values[i], 10))) {
          this.types.push('Float32Array');
        } else if (Utils.isInt(parseFloat(values[i], 10))) {
          this.types.push('Int32Array');
        } else {
          this.types.push('StringArray');
        }
      }
    }

    for (var i = 0; i < nValues; i++) {
      this._createArray(i, this.types[i], nRows * nColumns);
    }

    let actualLength = 0;

    for (var i = 0; i < nRows; i++) {
      let row = lines[i].split(this.opts.elementSeperator);

      if (row.length === 0) {
        continue;
      }

      for (var j = 0; j < nColumns; j++) {
        if (!row[j]) {
          continue;
        }

        let values = row[j].split(this.opts.valueSeparator);

        if (this.opts.skipNaN) {
          let skip = false;

          for (var k = 0; k < values.length; k++) {
            if (isNaN(values[k])) {
              skip = true;
              break;
            }
          }

          if (skip) {
            continue;
          }
        }

        this.columns[0][actualLength] = i;
        this.columns[1][actualLength] = j; // Set zero for 2D matrix

        this.columns[2][actualLength] = 0;

        for (var k = 0; k < values.length; k++) {
          this.columns[k + 3][actualLength] = values[k];
        }

        actualLength++;
      }
    }

    this._resizeArrays(actualLength);

    this.raiseEvent('loaded', this.columns);
    return this;
  }

  _resizeArrays(length) {
    // Might need polyfill
    for (var i = 0; i < this.columns.length; i++) {
      this.columns[i] = this.columns[i].slice(0, length);
    }
  }

  _createArray(index, type, length) {
    if (type == 'Int8Array') {
      this.columns[index] = new Int8Array(length);
    } else if (type == 'Uint8Array') {
      this.columns[index] = new Uint8Array(length);
    } else if (type == 'Uint8ClampedArray') {
      this.columns[index] = new Uint8ClampedArray(length);
    } else if (type == 'Int16Array') {
      this.columns[index] = new Int16Array(length);
    } else if (type == 'Uint16Array') {
      this.columns[index] = new Uint16Array(length);
    } else if (type == 'Int32Array') {
      this.columns[index] = new Int32Array(length);
    } else if (type == 'Uint32Array') {
      this.columns[index] = new Uint32Array(length);
    } else if (type == 'Float32Array') {
      this.columns[index] = new Float32Array(length);
    } else if (type == 'Float64Array') {
      this.columns[index] = new Float64Array(length);
    } else {
      this.columns[index] = new Array(length);
    }

    return this;
  }

}

module.exports = MatrixFileReader;

},{"../Utils/Utils":62,"./FileReaderBase":33}],35:[function(require,module,exports){
"use strict";

const CsvFileReader = require('./CsvFileReader');

const FileReaderBase = require('./FileReaderBase');

const MatrixFileReader = require('./MatrixFileReader');

module.exports = {
  CsvFileReader,
  FileReaderBase,
  MatrixFileReader
};

},{"./CsvFileReader":32,"./FileReaderBase":33,"./MatrixFileReader":34}],36:[function(require,module,exports){
"use strict";

const Core = require('./Core');

const Controls = require('./Controls');

const Cameras = require('./Cameras');

const Filters = require('./Filters');

const Helpers = require('./Helpers');

const IO = require('./IO');

const Math = require('./Math');

const Shaders = require('./Shaders');

const Spice = require('./Spice');

const Utils = require('./Utils').Utils;

module.exports = {
  Cameras,
  Controls,
  Core,
  Filters,
  Helpers,
  IO,
  Math,
  Shaders,
  Spice,
  Utils
};

},{"./Cameras":5,"./Controls":9,"./Core":21,"./Filters":24,"./Helpers":31,"./IO":35,"./Math":46,"./Shaders":57,"./Spice":61,"./Utils":63}],37:[function(require,module,exports){
"use strict";

//@ts-check

/** A class representing a 3x3 float matrix */
class Matrix3f {
  /**
   * The constructor for the class Matrix3f.
   *
   * @param {Float32Array} [entries=new Float32Array()] The Float32Array to which the entries will be set. If no value is provided, the matrix will be initialized to the identity matrix.
   */
  constructor(entries = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])) {
    this.entries = entries;
  }
  /**
   * Clones the matrix and returns the clone as a new Matrix3f object.
   *
   * @returns {Matrix3f} The clone.
   */


  clone() {
    return new Matrix3f(new Float32Array(this.entries));
  }
  /**
   * Compares this matrix to another matrix.
   *
   * @param {Matrix3f} mat A matrix to be compared to this matrix.
   * @returns {boolean} A boolean indicating whether or not the two matrices are identical.
   */


  equals(mat) {
    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i] !== mat.entries[i]) {
        return false;
      }
    }

    return true;
  }

}

module.exports = Matrix3f;

},{}],38:[function(require,module,exports){
"use strict";

//@ts-check
const Vector3f = require('./Vector3f');
/** A class representing a 4x4 float matrix */


class Matrix4f {
  // Do NOT go double precision on GPUs!!!
  // See:
  // http://stackoverflow.com/questions/2079906/float-vs-double-on-graphics-hardware

  /**
   * Creates an instance of Matrix4f.
   * @param {Float32Array} [entries=new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])] 
   */
  constructor(entries = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])) {
    this.entries = entries;
  }
  /**
   * 
   * 
   * @param {Number} m00 A matrix entry.
   * @param {Number} m10 A matrix entry.
   * @param {Number} m20 A matrix entry.
   * @param {Number} m30 A matrix entry.
   * @param {Number} m01 A matrix entry.
   * @param {Number} m11 A matrix entry.
   * @param {Number} m21 A matrix entry.
   * @param {Number} m31 A matrix entry.
   * @param {Number} m02 A matrix entry.
   * @param {Number} m12 A matrix entry.
   * @param {Number} m22 A matrix entry.
   * @param {Number} m32 A matrix entry.
   * @param {Number} m03 A matrix entry.
   * @param {Number} m13 A matrix entry.
   * @param {Number} m23 A matrix entry.
   * @param {Number} m33 A matrix entry.
   * @returns {Matrix4f} Returns itself.
   */


  set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33) {
    this.entries.set([m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33]);
    return this;
  }
  /**
   * Sets all entries in the matrix to zero.
   * 
   * @returns {Matrix4f} Returns itself.
   */


  setZero() {
    return this;
  }
  /**
   * Multiplies this matrix with another matrix (a * b).
   * 
   * @param {any} b Another matrix.
   * @returns {Matrix4f} Returns itself.
   */


  multiplyA(b) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html
    let a00 = this.entries[0],
        a01 = this.entries[4],
        a02 = this.entries[8],
        a03 = this.entries[12];
    let a10 = this.entries[1],
        a11 = this.entries[5],
        a12 = this.entries[9],
        a13 = this.entries[13];
    let a20 = this.entries[2],
        a21 = this.entries[6],
        a22 = this.entries[10],
        a23 = this.entries[14];
    let a30 = this.entries[3],
        a31 = this.entries[7],
        a32 = this.entries[11],
        a33 = this.entries[15];
    let b00 = b.entries[0],
        b01 = b.entries[4],
        b02 = b.entries[8],
        b03 = b.entries[12];
    let b10 = b.entries[1],
        b11 = b.entries[5],
        b12 = b.entries[9],
        b13 = b.entries[13];
    let b20 = b.entries[2],
        b21 = b.entries[6],
        b22 = b.entries[10],
        b23 = b.entries[14];
    let b30 = b.entries[3],
        b31 = b.entries[7],
        b32 = b.entries[11],
        b33 = b.entries[15];
    this.entries[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    this.entries[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    this.entries[2] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
    this.entries[3] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    this.entries[4] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    this.entries[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    this.entries[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    this.entries[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
    this.entries[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    this.entries[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    this.entries[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    this.entries[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
    this.entries[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    this.entries[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    this.entries[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    this.entries[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
    return this;
  }
  /**
   * Multiplies another matrix with this matrix (a * b).
   * 
   * @param {any} a Another matrix.
   * @returns {Matrix4f} Returns itself.
   */


  multiplyB(a) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html
    let a00 = a.entries[0],
        a01 = a.entries[4],
        a02 = a.entries[8],
        a03 = a.entries[12];
    let a10 = a.entries[1],
        a11 = a.entries[5],
        a12 = a.entries[9],
        a13 = a.entries[13];
    let a20 = a.entries[2],
        a21 = a.entries[6],
        a22 = a.entries[10],
        a23 = a.entries[14];
    let a30 = a.entries[3],
        a31 = a.entries[7],
        a32 = a.entries[11],
        a33 = a.entries[15];
    let b00 = this.entries[0],
        b01 = this.entries[4],
        b02 = this.entries[8],
        b03 = this.entries[12];
    let b10 = this.entries[1],
        b11 = this.entries[5],
        b12 = this.entries[9],
        b13 = this.entries[13];
    let b20 = this.entries[2],
        b21 = this.entries[6],
        b22 = this.entries[10],
        b23 = this.entries[14];
    let b30 = this.entries[3],
        b31 = this.entries[7],
        b32 = this.entries[11],
        b33 = this.entries[15];
    this.entries[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    this.entries[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    this.entries[2] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
    this.entries[3] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    this.entries[4] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    this.entries[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    this.entries[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    this.entries[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
    this.entries[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    this.entries[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    this.entries[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    this.entries[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
    this.entries[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    this.entries[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    this.entries[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    this.entries[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
    return this;
  }
  /**
   * Set the scale component of this matrix.
   * 
   * @param {Vector3f} vec The scaling vector.
   * @returns {Matrix4f} Returns itself.
   */


  scale(vec) {
    let x = vec.components[0];
    let y = vec.components[1];
    let z = vec.components[2];
    this.entries[0] *= x;
    this.entries[1] *= x;
    this.entries[2] *= x;
    this.entries[3] *= x;
    this.entries[4] *= y;
    this.entries[5] *= y;
    this.entries[6] *= y;
    this.entries[7] *= y;
    this.entries[8] *= z;
    this.entries[9] *= z;
    this.entries[10] *= z;
    this.entries[11] *= z;
    return this;
  }
  /**
   * Set the position component of this matrix.
   * 
   * @param {any} vec The position vector.
   * @returns {Matrix4f} Returns itself.
   */


  setPosition(vec) {
    this.entries[12] = vec.components[0];
    this.entries[13] = vec.components[1];
    this.entries[14] = vec.components[2];
    return this;
  }
  /**
   * Set the rotation component of this matrix.
   * 
   * @param {Quaternion} q A quaternion representing the rotation.
   * @returns {Matrix4f} Returns itself.
   */


  setRotation(q) {
    let x = q.components[0];
    let y = q.components[1];
    let z = q.components[2];
    let w = q.components[3];
    let x2 = x + x,
        y2 = y + y,
        z2 = z + z;
    let xx = x * x2,
        xy = x * y2,
        xz = x * z2;
    let yy = y * y2,
        yz = y * z2,
        zz = z * z2;
    let wx = w * x2,
        wy = w * y2,
        wz = w * z2;
    this.entries[0] = 1 - (yy + zz);
    this.entries[1] = xy + wz;
    this.entries[2] = xz - wy;
    this.entries[4] = xy - wz;
    this.entries[5] = 1 - (xx + zz);
    this.entries[6] = yz + wx;
    this.entries[8] = xz + wy;
    this.entries[9] = yz - wx;
    this.entries[10] = 1 - (xx + yy);
    this.entries[3] = 0.0;
    this.entries[7] = 0.0;
    this.entries[11] = 0.0;
    this.entries[12] = 0.0;
    this.entries[13] = 0.0;
    this.entries[14] = 0.0;
    this.entries[15] = 1.0;
    return this;
  }
  /**
   * Get the determinant of the matrix.
   * 
   * @returns {Number} The determinant of this matrix.
   */


  determinant() {
    let a = this.entries;
    let a00 = a.entries[0],
        a01 = a.entries[4],
        a02 = a.entries[8],
        a03 = a.entries[12];
    let a10 = a.entries[1],
        a11 = a.entries[5],
        a12 = a.entries[9],
        a13 = a.entries[13];
    let a20 = a.entries[2],
        a21 = a.entries[6],
        a22 = a.entries[10],
        a23 = a.entries[14];
    let a30 = a.entries[3],
        a31 = a.entries[7],
        a32 = a.entries[11],
        a33 = a.entries[15];
    return a30 * (a03 * a12 * a21 - a02 * a13 * a21 - a03 * a11 * a22 + a01 * a13 * a22 + a02 * a11 * a23 - a01 * a12 * a23) + a31 * (a00 * a12 * a23 - a00 * a13 * a22 + a03 * a10 * a22 - a02 * a10 * a23 + a02 * a13 * a20 - a03 * a12 * a20) + a32 * (a00 * a13 * a21 - a00 * a11 * a23 - a03 * a10 * a21 + a01 * a10 * a23 + a03 * a11 * a20 - a01 * a13 * a20) + a33 * (-a02 * a11 * a20 - a00 * a12 * a21 + a00 * a11 * a22 + a02 * a10 * a21 - a01 * a10 * a22 + a01 * a12 * a20);
  }
  /**
   * Decomposes the matrix into its positional, rotational and scaling component.
   * 
   * @param {Vector3f} outPosition The positional component will be written to this vector.
   * @param {Quaternion} outQuaternion The rotational component will be written to this quaternion.
   * @param {Vector3f} outScale The scaling component will be written to this vector.
   * @returns {Matrix4f} Returns itself.
   */


  decompose(outPosition, outQuaternion, outScale) {
    let m = new Matrix4f(); // The position is the simple one

    outPosition.set(this.entries[12], this.entries[13], this.entries[14]); // Calculate the scale

    let sx = Math.sqrt(this.entries[0] * this.entries[0] + this.entries[1] * this.entries[1] + this.entries[2] * this.entries[2]);
    let sy = Math.sqrt(this.entries[4] * this.entries[4] + this.entries[5] * this.entries[5] + this.entries[6] * this.entries[6]);
    let sz = Math.sqrt(this.entries[8] * this.entries[8] + this.entries[9] * this.entries[9] + this.entries[10] * this.entries[10]);
    let det = this.determinant();

    if (det < 0) {
      sx = -sx;
    } // Set the scale


    outScale.set(sx, sy, sz); // Get the info for the quaternion, this involves scaling the rotation
    // See:
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/

    let isx = 1.0 / sx;
    let isy = 1.0 / sy;
    let isz = 1.0 / sz;
    m.entries.set(this.entries);
    m.entries[0] *= isx;
    m.entries[1] *= isx;
    m.entries[2] *= isx;
    m.entries[4] *= isy;
    m.entries[5] *= isy;
    m.entries[6] *= isy;
    m.entries[8] *= isz;
    m.entries[9] *= isz;
    m.entries[10] *= isz;
    outQuaternion.setFromMatrix(m);
    return this;
  }
  /**
   * Composes the matrix from the positional, rotational and scaling components.
   * 
   * @param {Vector3f} position The positional component.
   * @param {Quaternion} quaternion The rotational component.
   * @param {Vector3f} scale The scaling component.
   * @returns {Matrix4f} Returns itself.
   */


  compose(position, quaternion, scale) {
    this.setRotation(quaternion);
    this.scale(scale);
    this.setPosition(position);
    return this;
  }
  /**
   * Inverts this matrix.
   * 
   * @returns {Matrix4f} Returns itself.
   */


  invert() {
    // Fugly implementation lifted from MESA (originally in C++)
    let im = new Matrix4f();
    let m = this.entries;
    im.entries[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    im.entries[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    im.entries[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    im.entries[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    im.entries[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    im.entries[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    im.entries[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    im.entries[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    im.entries[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    im.entries[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    im.entries[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    im.entries[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    im.entries[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    im.entries[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    im.entries[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    im.entries[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
    let det = m[0] * im.entries[0] + m[1] * im.entries[4] + m[2] * im.entries[8] + m[3] * im.entries[12];

    if (det == 0) {
      throw 'Determinant is zero.';
    }

    det = 1.0 / det;

    for (let i = 0; i < 16; i++) {
      this.entries[i] = im.entries[i] * det;
    }

    return this;
  }
  /**
   * Projects the vector from world space into camera space.
   * 
   * @param {Vector3f} v A vector to project.
   * @param {CameraBase} camera A camera instance.
   * @returns {Vector3f} The vector in camera space.
   */


  static projectVector(v, camera) {
    return v.applyProjection(Matrix4f.multiply(camera.projectionMatrix, Matrix4f.invert(camera.modelMatrix)));
  }
  /**
   * Projects the vector from camera space into world space.
   * 
   * @param {Vector3f} v A vector to unproject.
   * @param {CameraBase} camera A camera instance.
   * @returns {Vector3f} The vector in world space.
   */


  static unprojectVector(v, camera) {
    return v.applyProjection(Matrix4f.multiply(camera.modelMatrix, Matrix4f.invert(camera.projectionMatrix)));
  }
  /**
   * Clones this matrix.
   * 
   * @returns {Matrix4f} A clone of the matrix.
   */


  clone() {
    return new Matrix4f(new Float32Array(this.entries));
  }
  /**
   * Checks whether or not the entries of the two matrices match.
   * 
   * @param {Matrix4f} a A matrix.
   * @returns {Boolean} A boolean indicating whether or not the entries of the two matrices match.
   */


  equals(a) {
    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i] !== a.entries[i]) return false;
    }

    return true;
  }
  /**
   * Returns a string representation of the matrix.
   * 
   * @returns {String} The string representation of this matrix.
   */


  toString() {
    let str = this.entries[0] + ', ' + this.entries[4] + ', ' + this.entries[8] + ', ' + this.entries[12] + '\n';
    str += this.entries[1] + ', ' + this.entries[5] + ', ' + this.entries[9] + ', ' + this.entries[13] + '\n';
    str += this.entries[2] + ', ' + this.entries[6] + ', ' + this.entries[10] + ', ' + this.entries[14] + '\n';
    str += this.entries[3] + ', ' + this.entries[7] + ', ' + this.entries[11] + ', ' + this.entries[15] + '\n';
    return str;
  }
  /**
   * Multiply the two matrices (a * b).
   * 
   * @static
   * @param {any} a A matrix to be multiplied.
   * @param {any} b A matrix to be multiplied.
   * @returns {Matrix4f} A matrix.
   */


  static multiply(a, b) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html
    let a00 = a.entries[0],
        a01 = a.entries[4],
        a02 = a.entries[8],
        a03 = a.entries[12];
    let a10 = a.entries[1],
        a11 = a.entries[5],
        a12 = a.entries[9],
        a13 = a.entries[13];
    let a20 = a.entries[2],
        a21 = a.entries[6],
        a22 = a.entries[10],
        a23 = a.entries[14];
    let a30 = a.entries[3],
        a31 = a.entries[7],
        a32 = a.entries[11],
        a33 = a.entries[15];
    let b00 = b.entries[0],
        b01 = b.entries[4],
        b02 = b.entries[8],
        b03 = b.entries[12];
    let b10 = b.entries[1],
        b11 = b.entries[5],
        b12 = b.entries[9],
        b13 = b.entries[13];
    let b20 = b.entries[2],
        b21 = b.entries[6],
        b22 = b.entries[10],
        b23 = b.entries[14];
    let b30 = b.entries[3],
        b31 = b.entries[7],
        b32 = b.entries[11],
        b33 = b.entries[15];
    return new Matrix4f(new Float32Array([a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30, a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30, a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30, a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30, a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31, a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31, a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31, a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31, a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32, a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32, a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32, a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32, a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33, a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33, a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33, a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33]));
  }
  /**
   * Initialize a matrix from a quaternion.
   * 
   * @static
   * @param {Quaternion} q A quaternion.
   * @returns {Matrix4f} A matrix.
   */


  static fromQuaternion(q) {
    // First, store the values in local variables.
    // See:
    // http://blog.tojicode.com/2010/06/stupidly-fast-webgl-matricies.html
    // https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation#Quaternion-derived_rotation_matrix
    let x = q.components[0],
        y = q.components[1],
        z = q.components[2],
        w = q.components[3];
    let x2 = x + x,
        y2 = y + y,
        z2 = z + z;
    let xx = x * x2,
        xy = x * y2,
        xz = x * z2;
    let yy = y * y2,
        yz = y * z2,
        zz = z * z2;
    let wx = w * x2,
        wy = w * y2,
        wz = w * z2;
    return new Matrix4f(new Float32Array([1 - (yy + zz), xy + wz, xz - wy, 0, xy - wz, 1 - (xx + zz), yz + wx, 0, xz + wy, yz - wx, 1 - (xx + yy), 0, 0, 0, 0, 1]));
  }
  /**
   * Create a lookat matrix for a camera.
   * 
   * @static
   * @param {Vector3f} cameraPosition The position of the camera.
   * @param {Vector3f} target The lookat (target) of the camera.
   * @param {Vector3f} up The up vector of the camera node.
   * @returns {Matrix4f} A matrix.
   */


  static lookAt(cameraPosition, target, up) {
    // See here in order to return a quaternion directly:
    // http://www.euclideanspace.com/maths/algebra/vectors/lookat/
    let z = Vector3f.subtract(cameraPosition, target).normalize();

    if (z.lengthSq() === 0.0) {
      z.components[2] = 1.0;
    }

    let x = Vector3f.cross(up, z).normalize();

    if (x.lengthSq() === 0.0) {
      z.components[2] += 0.0001;
      x = Vector3f.cross(up, z).normalize();
    }

    let y = Vector3f.cross(z, x);
    return new Matrix4f(new Float32Array([x.components[0], x.components[1], x.components[2], 0, y.components[0], y.components[1], y.components[2], 0, z.components[0], z.components[1], z.components[2], 0, 0, 0, 0, 1]));
  }
  /**
   * Composes a matrix from the positional, rotational and scaling components.
   * 
   * @param {Vector3f} position The positional component.
   * @param {Quaternion} quaternion The rotational component.
   * @param {Vector3f} scale The scaling component.
   * @returns {Matrix4f} A matrix.
   */


  static compose(position, quaternion, scale) {
    let m = new Matrix4f();
    m.setRotation(quaternion);
    m.scale(scale);
    m.setPosition(position);
    return m;
  }
  /**
   * Inverts a matrix.
   * 
   * @static
   * @param {Matrix4f} matrix A matrix to be inverted.
   * @returns The inverted matrix.
   */


  static invert(matrix) {
    // Fugly implementation lifted from MESA (originally in C++)
    let im = new Matrix4f();
    let m = matrix.entries;
    im.entries[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    im.entries[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    im.entries[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    im.entries[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    im.entries[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    im.entries[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    im.entries[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    im.entries[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    im.entries[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    im.entries[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    im.entries[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    im.entries[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    im.entries[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    im.entries[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    im.entries[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    im.entries[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
    let det = m[0] * im.entries[0] + m[1] * im.entries[4] + m[2] * im.entries[8] + m[3] * im.entries[12];

    if (det == 0) {
      throw 'Determinant is zero.';
    }

    det = 1.0 / det;

    for (let i = 0; i < 16; i++) {
      im.entries[i] = im.entries[i] * det;
    }

    return im;
  }

}

module.exports = Matrix4f;

},{"./Vector3f":45}],39:[function(require,module,exports){
"use strict";

//@ts-check
const Matrix4f = require('./Matrix4f');

const Utils = require('../Utils/Utils');
/** A class representing a projection matrix */


class ProjectionMatrix extends Matrix4f {
  /**
   * Set the projection matrix to an orthographic projection.
   *
   * @param {number} left The left edge.
   * @param {number} right The right edge.
   * @param {number} top The top edge.
   * @param {number} bottom The bottom edge.
   * @param {number} near The near-cutoff value.
   * @param {number} far The far-cutoff value.
   * @returns {ProjectionMatrix} Returns this projection matrix.
   */
  setOrthographic(left, right, top, bottom, near, far) {
    let w = 1.0 / (right - left);
    let h = 1.0 / (top - bottom);
    let d = 1.0 / (far - near);
    let x = (right + left) * w;
    let y = (top + bottom) * h;
    let z = (far + near) * d;
    this.setZero();
    this.entries[0] = 2 * w;
    this.entries[4] = 0;
    this.entries[8] = 0;
    this.entries[12] = -x;
    this.entries[1] = 0;
    this.entries[5] = 2 * h;
    this.entries[9] = 0;
    this.entries[13] = -y;
    this.entries[2] = 0;
    this.entries[6] = 0;
    this.entries[10] = -2 * d;
    this.entries[14] = -z;
    this.entries[3] = 0;
    this.entries[7] = 0;
    this.entries[11] = 0;
    this.entries[15] = 1;
    return this;
  }
  /**
   * Set the projection matrix to a perspective projection.
   *
   * @param {number} fov The field of view.
   * @param {number} aspect The aspect ratio (width / height).
   * @param {number} near The near-cutoff value.
   * @param {number} far The far-cutoff value.
   * @returns {ProjectionMatrix} Returns this projection matrix.
   */


  setPerspective(fov, aspect, near, far) {
    let range = near - far;
    let tanHalfFov = Math.tan(Utils.DEG2RAD * 0.5 * fov);
    let top = near * tanHalfFov;
    let height = 2.0 * top;
    let width = aspect * height;
    let left = -width / 2.0;
    let right = left + width;
    let bottom = top - height; // let bottom = -top;
    // let right = top * aspect;
    // let left = -right;

    let x = 2.0 * near / (right - left);
    let y = 2.0 * near / (top - bottom);
    let a = (right + left) / (right - left);
    let b = (top + bottom) / (top - bottom);
    let c = -(far + near) / (far - near);
    let d = -2 * far * near / (far - near);
    this.setZero();
    this.entries[0] = x;
    this.entries[4] = 0;
    this.entries[8] = a;
    this.entries[12] = 0;
    this.entries[1] = 0;
    this.entries[5] = y;
    this.entries[9] = b;
    this.entries[13] = 0;
    this.entries[2] = 0;
    this.entries[6] = 0;
    this.entries[10] = c;
    this.entries[14] = d;
    this.entries[3] = 0;
    this.entries[7] = 0;
    this.entries[11] = -1;
    this.entries[15] = 0;
    return this;
  }

}

module.exports = ProjectionMatrix;

},{"../Utils/Utils":62,"./Matrix4f":38}],40:[function(require,module,exports){
"use strict";

//@ts-check
const Vector3f = require('./Vector3f');

const Matrix4f = require('./Matrix4f');
/** 
 * A class representing a quaternion.
 * 
 * @property {Float32Array} components A typed array storing the components of this quaternion.
 */


class Quaternion {
  /**
   * Creates an instance of Quaternion.
   * @param {Number} x The x component of the quaternion.
   * @param {Number} y The y component of the quaternion.
   * @param {Number} z The z component of the quaternion.
   * @param {Number} w The w component of the quaternion.
   */
  constructor(x, y, z, w) {
    if (arguments.length === 1) {
      this.components = new Float32Array(x);
    } else if (arguments.length === 2) {
      this.components = new Float32Array(4);
      this.setFromAxisAngle(x, y);
    } else {
      this.components = new Float32Array(4);
      this.components[0] = x || 0.0;
      this.components[1] = y || 0.0;
      this.components[2] = z || 0.0;
      this.components[3] = w !== undefined ? w : 1.0;
    }
  }
  /**
   * Get the x component of this quaternion.
   * 
   * @returns {Number} The x component of this quaternion.
   */


  getX() {
    return this.components[0];
  }
  /**
   * Get the y component of this quaternion.
   * 
   * @returns {Number} The y component of this quaternion.
   */


  getY() {
    return this.components[1];
  }
  /**
   * Get the z component of this quaternion.
   * 
   * @returns {Number} The z component of this quaternion.
   */


  getZ() {
    return this.components[2];
  }
  /**
   * Get the w component of this quaternion.
   * 
   * @returns {Number} The w component of this quaternion.
   */


  getW() {
    return this.components[3];
  }
  /**
   * Set the components of this quaternion.
   * 
   * @param {Number} x The x component of this quaternion.
   * @param {Number} y The y component of this quaternion.
   * @param {Number} z The z component of this quaternion.
   * @param {Number} w The w component of this quaternion.
   * 
   * @returns {Quaternion} Returns itself.
   */


  set(x, y, z, w) {
    this.components[0] = x;
    this.components[1] = y;
    this.components[2] = z;
    this.components[3] = w;
    return this;
  }
  /**
   * Set the x component of this quaternion.
   * 
   * @param {Number} x The x component of this quaternion.
   * @returns {Quaternion} Returns itself.
   */


  setX(x) {
    this.components[0] = x;
    return this;
  }
  /**
   * Set the y component of this quaternion.
   * 
   * @param {Number} y The y component of this quaternion.
   * @returns {Quaternion} Returns itself.
   */


  setY(y) {
    this.components[1] = y;
    return this;
  }
  /**
   * Set the z component of this quaternion.
   * 
   * @param {Number} z The z component of this quaternion.
   * @returns {Quaternion} Returns itself.
   */


  setZ(z) {
    this.components[2] = z;
    return this;
  }
  /**
   * Set the w component of this quaternion.
   * 
   * @param {Number} w The w component of this quaternion.
   * @returns {Quaternion} Returns itself.
   */


  setW(w) {
    this.components[3] = w;
    return this;
  }
  /**
   * Sets the quaternion from the axis angle representation.
   * 
   * @param {Vector3f} axis The axis component.
   * @param {Number} angle The angle component.
   * @returns {Quaternion} Returns itself.
   */


  setFromAxisAngle(axis, angle) {
    // See:
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
    // Normalize the axis. The resulting quaternion will be normalized as well
    let normAxis = Vector3f.normalize(axis);
    let halfAngle = angle / 2.0;
    let sinHalfAngle = Math.sin(halfAngle);
    this.components[0] = normAxis.components[0] * sinHalfAngle;
    this.components[1] = normAxis.components[1] * sinHalfAngle;
    this.components[2] = normAxis.components[2] * sinHalfAngle;
    this.components[3] = Math.cos(halfAngle);
    return this;
  }
  /**
   * Sets the quaternion from unit vectors.
   * 
   * @param {Vector3f} from The from vector.
   * @param {Vector3f} to The to vector.
   * @returns {Quaternion} Returns itself.
   */


  setFromUnitVectors(from, to) {
    let v = null;
    let r = from.dot(to) + 1;

    if (r < 0.000001) {
      v = new Vector3f(0.0, 0.0, 0.0);
      r = 0;
      if (Math.abs(from.components[0]) > Math.abs(from.components[2])) v.set(-from.components[1], from.components[0], 0);else v.set(0, -from.components[2], from.components[1]);
    } else {
      v = Vector3f.cross(from, to);
    }

    this.set(v.components[0], v.components[1], v.components[2], r);
    this.normalize();
    return this;
  }
  /**
   * Set the quaternion based facing in a destionation direction.
   * 
   * @param {Vector3f} source The source vector (the position).
   * @param {Vector3f} dest The destination vector.
   * @param {Vector3f} up The up vector of the source.
   * @returns {Quaternion} Returns itself.
   */


  lookAt(source, dest, up) {
    this.setFromMatrix(Matrix4f.lookAt(source, dest, up));
    return this;
  }
  /**
   * Get the square length of the quaternion.
   * 
   * @returns {Number} The square of the length.
   */


  lengthSq() {
    return this.components[0] * this.components[0] + this.components[1] * this.components[1] + this.components[2] * this.components[2] + this.components[3] * this.components[3];
  }
  /**
   * Get the length of this quaternion.
   * 
   * @returns {Number} The length.
   */


  length() {
    return Math.sqrt(this.lengthSq());
  }
  /**
   * Get the inverse of this quaternion.
   * 
   * @returns {Quaternion} Returns itself.
   */


  inverse() {
    return this.conjugate().normalize();
  }
  /**
   * Normalizes this quaternion.
   * 
   * @returns {Quaternion} Returns itself.
   */


  normalize() {
    let length = this.length();

    if (length === 0) {
      this.components[0] = 0.0;
      this.components[1] = 0.0;
      this.components[2] = 0.0;
      this.components[3] = 1.0;
    } else {
      let inv = 1 / length;
      this.components[0] *= inv;
      this.components[1] *= inv;
      this.components[2] *= inv;
      this.components[3] *= inv;
    }

    return this;
  }
  /**
   * Get the dot product of this and another quaternion.
   * 
   * @param {Quaternion} q A quaternion.
   * @returns {Number} The dot product.
   */


  dot(q) {
    return this.components[0] * q.components[0] + this.components[1] * q.components[1] + this.components[2] * q.components[2] + this.components[3] * q.components[3];
  }
  /**
   * Multiply this quaternion with another (a * b).
   * 
   * @param {Quaternion} b Another quaternion.
   * @returns {Quaternion} Returns itself.
   */


  multiplyA(b) {
    // See:
    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
    let x = this.components[0] * b.components[3] + this.components[3] * b.components[0] + this.components[1] * b.components[2] - this.components[2] * b.components[1];
    let y = this.components[1] * b.components[3] + this.components[3] * b.components[1] + this.components[2] * b.components[0] - this.components[0] * b.components[2];
    let z = this.components[2] * b.components[3] + this.components[3] * b.components[2] + this.components[0] * b.components[1] - this.components[1] * b.components[0];
    let w = this.components[3] * b.components[3] - this.components[0] * b.components[0] - this.components[1] * b.components[1] - this.components[2] * b.components[2];
    this.components[0] = x;
    this.components[1] = y;
    this.components[2] = z;
    this.components[3] = w;
    return this;
  }
  /**
   * Multiply another with this quaternion (a * b).
   * 
   * @param {Quaternion} a Another quaternion.
   * @returns {Quaternion} Returns itself.
   */


  multiplyB(a) {
    // See:
    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
    let x = a.components[0] * this.components[3] + a.components[3] * this.components[0] + a.components[1] * this.components[2] - a.components[2] * this.components[1];
    let y = a.components[1] * this.components[3] + a.components[3] * this.components[1] + a.components[2] * this.components[0] - a.components[0] * this.components[2];
    let z = a.components[2] * this.components[3] + a.components[3] * this.components[2] + a.components[0] * this.components[1] - a.components[1] * this.components[0];
    let w = a.components[3] * this.components[3] - a.components[0] * this.components[0] - a.components[1] * this.components[1] - a.components[2] * this.components[2];
    this.components[0] = x;
    this.components[1] = y;
    this.components[2] = z;
    this.components[3] = w;
    return this;
  }
  /**
   * Multiply this quaternion with a scalar.
   * 
   * @param {Number} s A scalar.
   * @returns {Quaternion} Returns itself.
   */


  multiplyScalar(s) {
    this.components[0] *= s;
    this.components[1] *= s;
    this.components[2] *= s;
    this.components[3] *= s;
    return this;
  }
  /**
   * Conjugate (* -1) this quaternion.
   * 
   * @returns {Quaternion} Returns itself.
   */


  conjugate() {
    // See:
    // http://www.3dgep.com/understanding-quaternions/#Quaternion_Conjugate
    this.components[0] *= -1;
    this.components[1] *= -1;
    this.components[2] *= -1;
    return this;
  }
  /**
   * Add another quaternion to this one.
   * 
   * @param {Quaternion} q A quaternion.
   * @returns {Quaternion} Returns itself.
   */


  add(q) {
    this.components[0] += q.components[0];
    this.components[1] += q.components[1];
    this.components[2] += q.components[2];
    this.components[3] += q.components[3];
    return this;
  }
  /**
   * Subtract another quaternion from this one.
   * 
   * @param {Quaternion} q A quaternion.
   * @returns {Quaternion} Returns itself.
   */


  subtract(q) {
    this.components[0] -= q.components[0];
    this.components[1] -= q.components[1];
    this.components[2] -= q.components[2];
    this.components[3] -= q.components[3];
    return this;
  }
  /**
   * Rotate this quaternion around the x axis.
   * 
   * @param {Number} angle An angle in radians.
   * @returns {Quaternion} Returns itself.
   */


  rotateX(angle) {
    let halfAngle = angle / 2.0;
    return this.multiplyA(new Quaternion(Math.sin(halfAngle), 0.0, 0.0, Math.cos(halfAngle)));
  }
  /**
   * Rotate this quaternion around the y axis.
   * 
   * @param {Number} angle An angle in radians.
   * @returns {Quaternion} Returns itself.
   */


  rotateY(angle) {
    let halfAngle = angle / 2.0;
    return this.multiplyA(new Quaternion(0.0, Math.sin(halfAngle), 0.0, Math.cos(halfAngle)));
  }
  /**
   * Rotate this quaternion around the y axis.
   * 
   * @param {Number} angle An angle in radians.
   * @returns {Quaternion} Returns itself.
   */


  rotateZ(angle) {
    let halfAngle = angle / 2.0;
    return this.multiplyA(new Quaternion(0.0, 0.0, Math.sin(halfAngle), Math.cos(halfAngle)));
  }

  toAxisAngle() {
    // It seems like this isn't numerically stable. This could be solved
    // by some checks as described here:
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
    // or here:
    // https://www.flipcode.com/documents/matrfaq.html#Q57
    // However, this function currently isn't used.
    console.warn('The method toAxisAngle() has not been implemented.');
  }
  /**
   * Create a rotation matrix from this quaternion.
   * 
   * @returns {Matrix4f} A rotation matrix representation of this quaternion.
   */


  toRotationMatrix() {
    let i = this.components[0];
    let j = this.components[1];
    let k = this.components[2];
    let r = this.components[3];
    let ii = i * i;
    let ij = i * j;
    let ik = i * k;
    let ir = i * r;
    let jr = j * r;
    let jj = j * j;
    let jk = j * k;
    let kk = k * k;
    let kr = k * r;
    let mat = new Matrix4f();
    mat.entries[0] = 1 - 2 * (jj + kk);
    mat.entries[1] = 2 * (ij + kr);
    mat.entries[2] = 2 * (ik - jr);
    mat.entries[4] = 2 * (jk - kr);
    mat.entries[5] = 1 - 2 * (ii + kk);
    mat.entries[6] = 2 * (jk + ir);
    mat.entries[8] = 2 * (ik + jr);
    mat.entries[9] = 2 * (jk - ir);
    mat.entries[10] = 1 - 2 * (ii + jj);
    return mat;
  }
  /**
   * Set this quaternion from a (rotation) matrix.
   * 
   * @param {Matrix4f} m 
   * @returns {Quaternion} Returns itself.
   */


  setFromMatrix(m) {
    // As in three.js, this is an implementation straight from:
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
    // Get the rotation matrix (if m is a Matrix4f)
    let m00 = m.entries[0],
        m01 = m.entries[4],
        m02 = m.entries[8];
    let m10 = m.entries[1],
        m11 = m.entries[5],
        m12 = m.entries[9];
    let m20 = m.entries[2],
        m21 = m.entries[6],
        m22 = m.entries[10];
    let t = m00 + m11 + m22;

    if (t > 0) {
      let s = 0.5 / Math.sqrt(t + 1.0);
      this.components[0] = (m21 - m12) * s;
      this.components[1] = (m02 - m20) * s;
      this.components[2] = (m10 - m01) * s;
      this.components[3] = 0.25 / s;
    } else if (m00 > m11 && m00 > m22) {
      let s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
      this.components[0] = 0.25 * s;
      this.components[1] = (m01 + m10) / s;
      this.components[2] = (m02 + m20) / s;
      this.components[3] = (m21 - m12) / s;
    } else if (m11 > m22) {
      let s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
      this.components[0] = (m01 + m10) / s;
      this.components[1] = 0.25 * s;
      this.components[2] = (m12 + m21) / s;
      this.components[3] = (m02 - m20) / s;
    } else {
      let s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
      this.components[0] = (m02 + m20) / s;
      this.components[1] = (m12 + m21) / s;
      this.components[2] = 0.25 * s;
      this.components[3] = (m10 - m01) / s;
    }

    return this;
  }
  /**
   * Clone this quaternion.
   * 
   * @returns {Quaternion} A clone of this quaternion.
   */


  clone() {
    return new Quaternion(this.components[0], this.components[1], this.components[2], this.components[3]);
  }
  /**
   * Checks whether the entries of this quaternion match another one.
   * 
   * @param {Quaternion} q A quaternion.
   * @returns {Boolean} A boolean representing whether the entries of the two quaternions match.
   */


  equals(q) {
    return this.components[0] === q.components[0] && this.components[1] === q.components[1] && this.components[2] === q.components[2] && this.components[3] === q.components[3];
  }
  /**
   * Returns a string representation of this quaternion.
   * 
   * @returns {String} A string representing this quaternion.
   */


  toString() {
    return 'x: ' + this.getX() + ', y: ' + this.getY() + ', z: ' + this.getZ() + ', w: ' + this.getW();
  }
  /**
   * Calculate the dot product of two quaternions.
   * 
   * @static
   * @param {Quaternion} q A quaternion.
   * @param {Quaternion} p A quaternion.
   * @returns {Number} The dot product.
   */


  static dot(q, p) {
    return new Quaternion(q.components[0] * p.components[0] + q.components[1] * p.components[1] + q.components[2] * p.components[2] + q.components[3] * p.components[3]);
  }
  /**
   * Multiply (cross product) two quaternions.
   * 
   * @static
   * @param {Quaternion} a A quaternion.
   * @param {Quaternion} b A quaternion.
   * @returns {Quaternion} The cross product quaternion.
   */


  static multiply(a, b) {
    return new Quaternion(a.components[0] * b.components[3] + a.components[3] * b.components[0] + a.components[1] * b.components[2] - a.components[2] * b.components[1], a.components[1] * b.components[3] + a.components[3] * b.components[1] + a.components[2] * b.components[0] - a.components[0] * b.components[2], a.components[2] * b.components[3] + a.components[3] * b.components[2] + a.components[0] * b.components[1] - a.components[1] * b.components[0], a.components[3] * b.components[3] + a.components[0] * b.components[0] + a.components[1] * b.components[1] - a.components[2] * b.components[2]);
  }
  /**
   * Multiplies a quaternion with a scalar.
   * 
   * @static
   * @param {Quaternion} q A quaternion.
   * @param {Number} s A scalar.
   * @returns {Quaternion} The resulting quaternion.
   */


  static multiplyScalar(q, s) {
    return new Quaternion(q.components[0] * s, q.components[1] * s, q.components[2] * s, q.components[3] * s);
  }
  /**
   * Inverse a quaternion.
   * 
   * @static
   * @param {Quaternion} q A quaternion.
   * @returns {Quaternion} The resulting quaternion.
   */


  static inverse(q) {
    let p = new Quaternion(q.components);
    return p.conjugate().normalize();
  }
  /**
   * Normalize a quaternion.
   * 
   * @static
   * @param {Quaternion} q A quaternion.
   * @returns {Quaternion} The resulting quaternion.
   */


  static normalize(q) {
    let length = q.length();

    if (length === 0) {
      return new Quaternion(0.0, 0.0, 0.0, 1.0);
    } else {
      let inv = 1 / length;
      return new Quaternion(q.components[0] * inv, q.components[1] * inv, q.components[2] * inv, q.components[3] * inv);
    }
  }
  /**
   * Conjugate (* -1) a quaternion.
   * 
   * @static
   * @param {Quaternion} q A quaternion.
   * @returns {Quaternion} The resulting quaternion.
   */


  static conjugate(q) {
    return new Quaternion(q.components[0] * -1, q.components[1] * -1, q.components[2] * -1, q.components[3]);
  }
  /**
   * Sum two quaternions.
   * 
   * @static
   * @param {Quaternion} q A quaternion.
   * @param {Quaternion} p A quaternion.
   * @returns {Quaternion} The resulting quaternion.
   */


  static add(q, p) {
    return new Quaternion(q.components[0] + p.components[0], q.components[1] + p.components[1], q.components[2] + p.components[2], q.components[3] + p.components[3]);
  }
  /**
   * Subtract a quaternion from another (q - p).
   * 
   * @static
   * @param {Quaternion} q A quaternion.
   * @param {Quaternion} p A quaternion.
   * @returns {Quaternion} The resulting quaternion.
   */


  static subtract(q, p) {
    return new Quaternion(q.components[0] - p.components[0], q.components[1] - p.components[1], q.components[2] - p.components[2], q.components[3] - p.components[3]);
  }
  /**
   * Create a quaternion from a matrix.
   * 
   * @static
   * @param {Matrix4f} m A matrix.
   * @returns {Quaternion} The resulting quaternion.
   */


  static fromMatrix(m) {
    let q = new Quaternion();
    q.setFromMatrix(m);
    return q;
  }
  /**
   * Interpolate between two quaternions (t is between 0 and 1).
   * 
   * @static
   * @param {Quaternion} q The source quaternion.
   * @param {Quaternion} p The target quaternion.
   * @param {Number} t The interpolation value / percentage (between 0 an 1).
   * @returns {Quaternion} The resulting quaternion.
   */


  static slerp(q, p, t) {
    // See:
    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
    if (t === 0) return new Quaternion(q.components);
    if (t === 1) return new Quaternion(p.components);
    let tmp = new Quaternion(p.components); // The angle between quaternions

    let cosHalfTheta = q.components[0] * tmp.components[0] + q.components[1] * tmp.components[1] + q.components[2] * tmp.components[2] + q.components[3] * tmp.components[3];

    if (cosHalfTheta < 0) {
      tmp.multiplyScalar(-1);
      cosHalfTheta = -cosHalfTheta;
    }

    if (Math.abs(cosHalfTheta) >= 1.0) {
      return new Quaternion(q.components);
    }

    let halfTheta = Math.acos(cosHalfTheta);
    let sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
      return new Quaternion(q.components[0] * 0.5 + tmp.components[0] * 0.5, q.components[1] * 0.5 + tmp.components[1] * 0.5, q.components[2] * 0.5 + tmp.components[2] * 0.5, q.components[3] * 0.5 + tmp.components[3] * 0.5);
    }

    let ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    let ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    return new Quaternion(q.components[0] * ratioA + tmp.components[0] * ratioB, q.components[1] * ratioA + tmp.components[1] * ratioB, q.components[2] * ratioA + tmp.components[2] * ratioB, q.components[3] * ratioA + tmp.components[3] * ratioB);
  }

}

module.exports = Quaternion;

},{"./Matrix4f":38,"./Vector3f":45}],41:[function(require,module,exports){
"use strict";

//@ts-check

/** A class wrapping a radix sort for floats. */
class RadixSort {
  /**
   * Creates an instance of RadixSort.
   * 
   */
  constructor() {
    this.max = undefined;
    this.mask = undefined;
    this.histograms = undefined;
    this.indices = undefined;
    this.tmpIndices = undefined;
  }
  /**
   * Sorts a 32-bit float array using radix sort.
   * 
   * @param {Float32Array} arr The array to be sorted.
   * @param {Boolean} [copyArray=false] A boolean indicating whether to perform the sorting directly on the array or copy it.
   * @returns {Object} The result in the form { array: sortedArray, indices: sortedIndices }.
   * 
   */


  sort(arr, copyArray = false) {
    let array = null;

    if (copyArray) {
      array = new arr.constructor(arr.length);
      array.set(arr);
    } else {
      array = arr;
    }

    this.max = 1 << 11; // = 2^11 = 2048 = 0x00000800

    this.mask = this.max - 1; // = 2047 = 0x000007FF

    this.histograms = new Int32Array(this.max * Math.ceil(64 / 11));
    let input = new Int32Array(array.buffer, array.byteOffset, array.byteLength >> 2);
    let nPasses = Math.ceil(array.BYTES_PER_ELEMENT * 8 / 11);
    let maxOffset = this.max * (nPasses - 1);
    let msbMask = 1 << (array.BYTES_PER_ELEMENT * 8 - 1) % 11;
    let lastMask = (msbMask << 1) - 1;
    let tmp = null;
    let aux = new input.constructor(input.length); // In order to keep track of the indices

    this.indices = new Uint32Array(input.length);
    this.tmpIndices = new Uint32Array(input.length);
    let normIndices = new Uint32Array(input.length);
    let n = this.max * nPasses;

    for (let i = 0; i < n; i++) {
      this.histograms[i] = 0;
    } // Create the histogram


    this.initHistograms(input, maxOffset, lastMask); // Create the offset table

    for (let i = 0; i <= maxOffset; i += this.max) {
      let sum = 0;

      for (let j = i; j < i + this.max; j++) {
        let tmpSum = this.histograms[j] + sum;
        this.histograms[j] = sum - 1;
        sum = tmpSum;
      }
    } // Sort by least significant byte


    this.lsbPass(input, aux);
    tmp = aux;
    aux = input;
    input = tmp;
    this.pass(input, aux);
    tmp = aux;
    aux = input;
    input = tmp; // Sort by most significant byte

    this.msbPass(input, aux, msbMask); // This part is not needed, why was it still in???
    // "Normalize" the indices, since they are split up just like the floats
    // so 0, 1 -> 0, 2, 3 -> 2, etc.
    // use multiplications not divisions for the second index -> speeeeed
    // Also, invert it
    // for(let i = 0; i < normIndices.length; i++) {
    // 	normIndices[normIndices.length - i] = this.indices[i];
    // }

    return {
      array: new Float32Array(aux.buffer, aux.byteOffset, array.length),
      indices: this.indices // instead of normIndices

    };
  }
  /**
   * The lsb (least significant bit) pass of the algorithm.
   * 
   * @param {Float32Array} arr The array.
   * @param {Float32Array} aux An auxilliary array.
   * 
   */


  lsbPass(arr, aux) {
    for (let i = 0, n = arr.length; i < n; i++) {
      let val = arr[i];
      let sign = val >> 31;
      val ^= sign | 0x80000000;
      let x = ++this.histograms[val & this.mask];
      this.indices[x] = i;
      aux[x] = val;
    }
  }
  /**
   * The main pass of the algorithm.
   * 
   * @param {Float32Array} arr The array.
   * @param {Float32Array} aux An auxilliary array.
   * 
   */


  pass(arr, aux) {
    let n = arr.length;

    for (let i = 0; i < n; i++) {
      let val = arr[i];
      let x = ++this.histograms[this.max + (val >>> 11 & this.mask)];
      this.tmpIndices[x] = this.indices[i];
      aux[x] = val;
    }

    this.indices.set(this.tmpIndices);
  }
  /**
   * The msb (most significant bit) pass of the algorithm.
   * 
   * @param {Float32Array} arr The array.
   * @param {Float32Array} aux An auxilliary array.
   * 
   */


  msbPass(arr, aux, msbMask) {
    let lastMask = (msbMask << 1) - 1;
    let n = arr.length;
    let offset = 2 * this.max;

    for (let i = 0; i < n; i++) {
      let val = arr[i];
      let sign = val >> 31;
      let x = ++this.histograms[offset + (val >>> 22 & lastMask)];
      this.tmpIndices[x] = this.indices[i];
      aux[x] = val ^ (~sign | 0x80000000);
    }

    this.indices.set(this.tmpIndices);
  }
  /**
   * Initialize the histogram used by the algorithm.
   * 
   * @param {Float32Array} arr The array to be sorted.
   * @param {Number} maxOffset The maximum offset.
   * @param {Number} lastMask The last max, based on the msb (most significant bit) mask.
   * 
   */


  initHistograms(arr, maxOffset, lastMask) {
    let n = arr.length;

    for (let i = 0; i < n; i++) {
      let val = arr[i];
      let sign = val >> 31;
      val ^= sign | 0x80000000;
      let j = 0;
      let k = 0;

      for (; j < maxOffset; j += this.max, k += 11) {
        this.histograms[j + (val >>> k & this.mask)]++;
      }

      this.histograms[j + (val >>> k & lastMask)]++;
    }
  }

}

module.exports = RadixSort;

},{}],42:[function(require,module,exports){
"use strict";

//@ts-check
const Vector3f = require('./Vector3f');

const ProjectionMatrix = require('./ProjectionMatrix');

const Matrix4f = require('./Matrix4f');
/** A class representing a ray */


class Ray {
  /**
   * Creates an instance of Ray.
   * @param {Vector3f} [source = new Vector3f(0.0, 0.0, 0.0)] The source of the ray.
   * @param {Vector3f} [direction = new Vector3f(0.0, 0.0, 0.0)] The direction of the ray.
   */
  constructor(source = new Vector3f(0.0, 0.0, 0.0), direction = new Vector3f(0.0, 0.0, 0.0)) {
    this.source = source;
    this.direction = direction;
  }
  /**
   * Copy the values from another ray.
   * 
   * @param {Ray} r A ray.
   * @returns {Ray} Returns itself.
   */


  copyFrom(r) {
    this.source.copyFrom(r.source);
    this.direction.copyFrom(r.direction);
    return this;
  }
  /**
   * Apply a projection matrix to this ray.
   * 
   * @param {Matrix4f|ProjectionMatrix} m A matrix / projection matrix.
   * @returns {Ray} Returns itself.
   */


  applyProjection(m) {
    this.direction.add(this.source).applyProjection(m);
    this.source.applyProjection(m);
    this.direction.subtract(this.source);
    this.direction.normalize();
    return this;
  } // See if the two following functions can be optimized

  /**
   * The square of the distance of a vector to this ray.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Number} The square pf the distance between the point and this ray.
   */


  distanceSqToPoint(v) {
    let tmp = Vector3f.subtract(v, this.source);
    let directionDistance = tmp.dot(this.direction);

    if (directionDistance < 0) {
      return this.source.distanceToSq(v);
    }

    tmp.copyFrom(this.direction).multiplyScalar(directionDistance).add(this.source);
    return tmp.distanceToSq(v);
  }
  /**
   * Find a point on the ray that is closest to a supplied vector.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Vector3f} The cloest point on the ray to the supplied point.
   */


  closestPointToPoint(v) {
    let result = Vector3f.subtract(v, this.source);
    let directionDistance = result.dot(this.direction);

    if (directionDistance < 0) {
      return result.copyFrom(this.source);
    }

    return result.copyFrom(this.direction).multiplyScalar(directionDistance).add(this.source);
  }

}

module.exports = Ray;

},{"./Matrix4f":38,"./ProjectionMatrix":39,"./Vector3f":45}],43:[function(require,module,exports){
"use strict";

//@ts-check
const Vector3f = require('./Vector3f');
/** A class representing spherical coordinates. */


class SphericalCoords {
  /**
   * Creates an instance of SphericalCoords.
   * @param {Number} [radius=1.0] The radius.
   * @param {Number} [phi=0.0] Phi in radians.
   * @param {Number} [theta=0.0] Theta in radians.
   */
  constructor(radius = 1.0, phi = 0.0, theta = 0.0) {
    this.components = new Float32Array(3);
    this.radius = radius;
    this.phi = phi;
    this.theta = theta;
  }
  /**
   * Set the spherical coordinates from the radius, the phi angle and the theta angle.
   * 
   * @param {Number} radius 
   * @param {Number} phi 
   * @param {Number} theta 
   * @returns {SphericalCoords} Returns itself.
   */


  set(radius, phi, theta) {
    this.components[0] = radius;
    this.components[1] = phi;
    this.components[2] = theta;
    return this;
  }
  /**
   * Avoid overflows.
   * 
   * @returns {SphericalCoords} Returns itself.
   */


  secure() {
    this.components[1] = Math.max(0.000001, Math.min(Math.PI - 0.000001, this.components[1]));
    return this;
  }
  /**
   * Set the spherical coordaintes from a vector.
   * 
   * @param {Vector3f} v A vector.
   * @returns {SphericalCoords} Returns itself.
   */


  setFromVector(v) {
    this.components[0] = v.length();

    if (this.components[0] === 0.0) {
      this.components[1] = 0.0;
      this.components[2] = 0.0;
    } else {
      this.components[1] = Math.acos(Math.max(-1.0, Math.min(1.0, v.components[1] / this.components[0])));
      this.components[2] = Math.atan2(v.components[0], v.components[2]);
    }

    return this;
  }
  /**
   * Limit the rotation by setting maxima and minima for phi and theta.
   * 
   * @param {Number} phiMin The minimum for phi.
   * @param {Number} phiMax The maximum for phi.
   * @param {Number} thetaMin The minimum for theta.
   * @param {Number} thetaMax The maximum for theta.
   * @returns {SphericalCoords} Returns itself.
   */


  limit(phiMin, phiMax, thetaMin, thetaMax) {
    // Limits for orbital controls
    this.components[1] = Math.max(phiMin, Math.min(phiMax, this.components[1]));
    this.components[2] = Math.max(thetaMin, Math.min(thetaMax, this.components[2]));
    return this;
  }
  /**
   * Clone this spherical coordinates object.
   * 
   * @returns {SphericalCoords} A clone of the spherical coordinates object.
   */


  clone() {
    return new SphericalCoords(this.radius, this.phi, this.theta);
  }
  /**
   * Returns a string representation of these spherical coordinates.
   * 
   * @returns {String} A string representing spherical coordinates.
   */


  toString() {
    return '(' + this.components[0] + ', ' + this.components[1] + ', ' + this.components[2] + ')';
  }

}

module.exports = SphericalCoords;

},{"./Vector3f":45}],44:[function(require,module,exports){
"use strict";

//@ts-check

/** A helper class containing statistics methods. */
class Statistics {
  /**
   * Transposes an array of arrays (2d array).
   
   * @param {Array} arr The 2d array to be transposed.
   * @returns {Array} The transpose of the 2d array.
   */
  static transpose2dArray(arr) {
    return arr[0].map((col, i) => arr.map(row => row[i]));
  }
  /**
   * Returns a normally distributed (pseudo) random number.
   * 
   * @returns {Number} A normally distributed (pseudo) random number.
   */


  static randomNormal() {
    let val, u, v, s, mul;

    if (Statistics.spareRandomNormal !== null) {
      val = Statistics.spareRandomNormal;
      Statistics.spareRandomNormal = null;
    } else {
      do {
        u = Math.random() * 2 - 1;
        v = Math.random() * 2 - 1;
        s = u * u + v * v;
      } while (s === 0 || s >= 1);

      mul = Math.sqrt(-2 * Math.log(s) / s);
      val = u * mul;
      Statistics.spareRandomNormal = v * mul;
    }

    return val / 14;
  }
  /**
   * Returns a normally distributed (pseudo) random number within a range.
   * 
   * @param {Number} a The start of the range.
   * @param {Number} b The end of the range.
   * @returns {Number} A normally distributed (pseudo) random number within a range.
   */


  static randomNormalInRange(a, b) {
    let val;

    do {
      val = Statistics.randomNormal();
    } while (val < a || val > b);

    return val;
  }
  /**
   * Returns a normally distributed (pseudo) random number around a mean with a standard deviation.
   * 
   * @param {Number} mean The mean.
   * @param {Number} sd The standard deviation.
   * @returns {Number} A normally distributed (pseudo) random number around a mean with a standard deviation.
   */


  static randomNormalScaled(mean, sd) {
    let r = Statistics.randomNormalInRange(-1, 1);
    return r * sd + mean;
  }
  /**
   * Normalize / scale an array between 0 and 1.
   * 
   * @param {Number[]} arr An array.
   * @returns {Number[]} The normalized / scaled array.
   */


  static normalize(arr) {
    let newArr = arr.slice();
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;

    for (let i = 0; i < newArr.length; i++) {
      let val = newArr[i];
      if (val > max) max = val;
      if (val < min) min = val;
    }

    let diff = max - min;

    for (let i = 0; i < newArr.length; i++) {
      newArr[i] = (newArr[i] - min) / diff;
    }

    return newArr;
  }
  /**
   * Normalize / scale an array between 0 and 1 (outliers will be set to max or min respectively).
   * The IQR method is used for outlier detection.
   * 
   * @param {Number[]} arr An array.
   * @param {Number} q1 The q1 percentage.
   * @param {Number} q3 The q3 percentage.
   * @param {Number} k The IQR scaling factor.
   * @returns {Number[]} The normalized / scaled array.
   */


  static normalizeNoOutliers(arr, q1 = 0.25, q3 = 0.75, k = 1.5) {
    let newArr = arr.slice();
    newArr.sort((a, b) => a - b);
    let a = Statistics.getPercentile(newArr, q1);
    let b = Statistics.getPercentile(newArr, q3);
    let iqr = b - a;
    let lower = a - iqr * k;
    let upper = b + iqr * k;
    let diff = upper - lower;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] < lower) {
        newArr[i] = 0.0;
      } else if (arr[i] > upper) {
        newArr[i] = 1.0;
      } else {
        newArr[i] = (arr[i] - lower) / diff;
      }
    }

    return newArr;
  }
  /**
   * Gets the percentile from a sorted array.
   * 
   * @param {Number[]} arr A sorted array.
   * @param {Number} percentile The percentile (e.g. 0.25).
   * @returns {Number} The percentile value.
   */


  static getPercentile(arr, percentile) {
    let index = percentile * arr.length;

    if (Math.floor(index) === index) {
      return (arr[index - 1] + arr[index]) / 2.0;
    } else {
      return arr[Math.floor(index)];
    }
  }
  /**
   * Scales a number to within a given scale.
   * 
   * @param {Number} value The number.
   * @param {Number} oldMin The current minimum.
   * @param {Number} oldMax The current maximum.
   * @param {Number} newMin The cnew minimum.
   * @param {Number} newMax The new maximum.
   * @returns {Number} The scaled number.
   */


  static scale(value, oldMin, oldMax, newMin, newMax) {
    return (newMax - newMin) * (value - oldMin) / (oldMax - oldMin) + newMin;
  }

}

Statistics.spareRandomNormal = null;
module.exports = Statistics;

},{}],45:[function(require,module,exports){
"use strict";

//@ts-check
const SphericalCoordinates = require('./SphericalCoords');
/** 
 * A class representing 3D float vector.
 * 
 * @property {Float32Array} components A typed array storing the components of this vector.
 */


class Vector3f {
  /**
   * Creates an instance of Vector3f.
   * @param {Number} x The x component of the vector.
   * @param {Number} y The y component of the vector.
   * @param {Number} z The z component of the vector.
   */
  constructor(x, y, z) {
    if (arguments.length === 1) {
      this.components = new Float32Array(x);
    } else {
      this.components = new Float32Array(3);
      this.components[0] = x || 0.0;
      this.components[1] = y || 0.0;
      this.components[2] = z || 0.0;
    }
  }
  /**
   * Sets the x, y and z components of this vector.
   * 
   * @param {Number} x The x component of the vector.
   * @param {Number} y The y component of the vector.
   * @param {Number} z The z component of the vector.
   * @returns {Vector3f} Returns itself.
   */


  set(x, y, z) {
    this.components[0] = x;
    this.components[1] = y;
    this.components[2] = z;
    return this;
  }
  /**
   * Gets the x component of this vector.
   * 
   * @returns {Number} The x component of this vector.
   */


  getX() {
    return this.components[0];
  }
  /**
  * Gets the y component of this vector.
  * 
  * @returns {Number} The y component of this vector.
  */


  getY() {
    return this.components[1];
  }
  /**
  * Gets the z component of this vector.
  * 
  * @returns {Number} The z component of this vector.
  */


  getZ() {
    return this.components[2];
  }
  /**
   * Sets the x component of this vector.
   * 
   * @param {Number} x The value to which the x component of this vectors will be set.
   * @returns {Vector3f} Returns itself.
   */


  setX(x) {
    this.components[0] = x;
    return this;
  }
  /**
   * Sets the y component of this vector.
   * 
   * @param {Number} y The value to which the y component of this vectors will be set.
   * @returns {Vector3f} Returns itself.
   */


  setY(y) {
    this.components[1] = y;
    return this;
  }
  /**
   * Sets the z component of this vector.
   * 
   * @param {Number} z The value to which the z component of this vectors will be set.
   * @returns {Vector3f} Returns itself.
   */


  setZ(z) {
    this.components[2] = z;
    return this;
  }
  /**
   * Sets this vector from spherical coordinates.
   * 
   * @param {SphericalCoordinates} s A spherical coordinates object.
   * @returns {Vector3f} Returns itself.
   */


  setFromSphericalCoords(s) {
    var radius = s.components[0];
    var phi = s.components[1];
    var theta = s.components[2];
    var t = Math.sin(phi) * radius;
    this.components[0] = Math.sin(theta) * t;
    this.components[1] = Math.cos(phi) * radius;
    this.components[2] = Math.cos(theta) * t;
    return this;
  }
  /**
   * Copies the values from another vector
   * 
   * @param {Vector3f} v A vector.
   * @returns {Vector3f} Returns itself.
   */


  copyFrom(v) {
    this.components[0] = v.components[0];
    this.components[1] = v.components[1];
    this.components[2] = v.components[2];
    return this;
  }
  /**
   * Set the length / magnitude of the vector.
   * 
   * @param {Number} length The length / magnitude to set the vector to.
   * @returns {Vector3f} Returns itself.
   */


  setLength(length) {
    return this.multiplyScalar(length / this.length());
  }
  /**
   * Get the square of the length / magnitude of the vector.
   * 
   * @returns {Number} The square of length / magnitude of the vector.
   */


  lengthSq() {
    return this.components[0] * this.components[0] + this.components[1] * this.components[1] + this.components[2] * this.components[2];
  }
  /**
   * The length / magnitude of the vector.
   * 
   * @returns {Number} The length / magnitude of the vector.
   */


  length() {
    return Math.sqrt(this.lengthSq());
  }
  /**
   * Normalizes the vector.
   * 
   * @returns {Vector3f} Returns itself.
   */


  normalize() {
    return this.divideScalar(this.length());
  }
  /**
   * Multiply the vector with another vector.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Vector3f} Returns itself.
   */


  multiply(v) {
    this.components[0] *= v.components[0];
    this.components[1] *= v.components[1];
    this.components[2] *= v.components[2];
    return this;
  }
  /**
   * Multiplies this vector with a scalar.
   * 
   * @param {Number} s A scalar.
   * @returns {Vector3f} Returns itself.
   */


  multiplyScalar(s) {
    this.components[0] *= s;
    this.components[1] *= s;
    this.components[2] *= s;
    return this;
  }
  /**
   * Divides the vector by another vector.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Vector3f} Returns itself.
   */


  divide(v) {
    this.components[0] /= v.components[0];
    this.components[1] /= v.components[1];
    this.components[2] /= v.components[2];
    return this;
  }
  /**
   * Divides the vector by a scalar.
   * 
   * @param {Number} s A scalar.
   * @returns {Vector3f} Returns itself.
   */


  divideScalar(s) {
    this.components[0] /= s;
    this.components[1] /= s;
    this.components[2] /= s;
    return this;
  }
  /**
   * Sums the vector with another.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Vector3f} Returns itself.
   */


  add(v) {
    this.components[0] += v.components[0];
    this.components[1] += v.components[1];
    this.components[2] += v.components[2];
    return this;
  }
  /**
   * Substracts a vector from this one.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Vector3f} Returns itself.
   */


  subtract(v) {
    this.components[0] -= v.components[0];
    this.components[1] -= v.components[1];
    this.components[2] -= v.components[2];
    return this;
  }
  /**
   * Calculates the dot product for the vector with another vector.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Number} The dot product of the two vectors.
   */


  dot(v) {
    return this.components[0] * v.components[0] + this.components[1] * v.components[1] + this.components[2] * v.components[2];
  }
  /**
   * Calculates the cross product for the vector with another vector.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Vector3f} The cross product of the two vectors.
   */


  cross(v) {
    return new Vector3f(this.components[1] * v.components[2] - this.components[2] * v.components[1], this.components[2] * v.components[0] - this.components[0] * v.components[2], this.components[0] * v.components[1] - this.components[1] * v.components[0]);
  }
  /**
   * Applies a projection matrix to the vector.
   * 
   * @param {Matrix4f} m A (projection) matrix.
   * @returns {Vector3f} Returns itself.
   */


  applyProjection(m) {
    var x = this.components[0];
    var y = this.components[1];
    var z = this.components[2];
    var e = m.entries;
    var p = 1.0 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    this.components[0] = (e[0] * x + e[4] * y + e[8] * z + e[12]) * p;
    this.components[1] = (e[1] * x + e[5] * y + e[9] * z + e[13]) * p;
    this.components[2] = (e[2] * x + e[6] * y + e[10] * z + e[14]) * p;
    return this;
  }
  /**
   * Rotates the vector into the direction defined by the rotational component of a matrix.
   * 
   * @param {Matrix4f} m A matrix.
   * @returns {Vector3f} Returns itself.
   */


  toDirection(m) {
    var x = this.components[0];
    var y = this.components[1];
    var z = this.components[2];
    var e = m.entries;
    this.components[0] = e[0] * x + e[4] * y + e[8] * z;
    this.components[1] = e[1] * x + e[5] * y + e[9] * z;
    this.components[2] = e[2] * x + e[6] * y + e[10] * z;
    this.normalize();
    return this;
  }
  /**
   * Applies a quaternion to the vector (usually a rotation).
   * 
   * @param {Quaternion} q Quaternion.
   * @returns {Vector3f} Returns itself.
   */


  applyQuaternion(q) {
    var x = this.components[0];
    var y = this.components[1];
    var z = this.components[2];
    var qx = q.components[0];
    var qy = q.components[1];
    var qz = q.components[2];
    var qw = q.components[3];
    var ix = qw * x + qy * z - qz * y;
    var iy = qw * y + qz * x - qx * z;
    var iz = qw * z + qx * y - qy * x;
    var iw = -qx * x - qy * y - qz * z;
    this.components[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.components[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.components[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  }
  /**
   * Calculates the square of the distance to another vector.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Number} The square of the distance to the other vector.
   */


  distanceToSq(v) {
    var dx = this.components[0] - v.components[0];
    var dy = this.components[1] - v.components[1];
    var dz = this.components[2] - v.components[2];
    return dx * dx + dy * dy + dz * dz;
  }
  /**
   * Calculates the distance to another vector.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Number} The distance to the other vector.
   */


  distanceTo(v) {
    return Math.sqrt(this.distanceToSq(v));
  }
  /**
   * Clones this vector.
   * 
   * @returns {Vector3f} A clone of this vector.
   */


  clone() {
    return new Vector3f(this.components[0], this.components[1], this.components[2]);
  }
  /**
   * Compares the components of the vector to those of another.
   * 
   * @param {Vector3f} v A vector.
   * @returns {Boolean} A vector indicating whether or not the two vectors are equal.
   */


  equals(v) {
    return this.components[0] === v.components[0] && this.components[1] === v.components[1] && this.components[2] === v.components[2];
  }
  /**
   * Returns a string representation of the vector.
   * 
   * @returns {String} A string representation of the vector.
   */


  toString() {
    return '(' + this.components[0] + ', ' + this.components[1] + ', ' + this.components[2] + ')';
  }
  /**
   * Normalizes a vector.
   * 
   * @static
   * @param {Vector3f} v A vector. 
   * @returns {Vector3f} The noramlized vector.
   */


  static normalize(v) {
    return Vector3f.divideScalar(v, v.length());
  }
  /**
   * Multiplies two vectors.
   * 
   * @static
   * @param {Vector3f} u A vector. 
   * @param {Vector3f} v A vector. 
   * @returns {Vector3f} The product of the two vectors.
   */


  static multiply(u, v) {
    return new Vector3f(u.components[0] * v.components[0], u.components[1] * v.components[1], u.components[2] * v.components[2]);
  }
  /**
   * Multiplies a vector with a scalar.
   * 
   * @static
   * @param {Vector3f} v A vector. 
   * @param {Number} s A scalar.
   * @returns {Vector3f} The vector multiplied by the scalar.
   */


  static multiplyScalar(v, s) {
    return new Vector3f(v.components[0] * s, v.components[1] * s, v.components[2] * s);
  }
  /**
   * Divides a vector by another vector (u / v).
   * 
   * @static
   * @param {Vector3f} u A vector. 
   * @param {Vector3f} v A vector. 
   * @returns {Vector3f} The fraction vector.
   */


  static divide(u, v) {
    return new Vector3f(u.components[0] / v.components[0], u.components[1] / v.components[1], u.components[2] / v.components[2]);
  }
  /**
   * Divides a vector by a scalar.
   * 
   * @static
   * @param {Vector3f} v A vector. 
   * @param {Number} s A scalar.
   * @returns {Vector3f} The vector divided by the scalar.
   */


  static divideScalar(v, s) {
    return new Vector3f(v.components[0] / s, v.components[1] / s, v.components[2] / s);
  }
  /**
   * Sums two vectors.
   * 
   * @static
   * @param {Vector3f} u A vector. 
   * @param {Vector3f} v A vector. 
   * @returns {Vector3f} The sum of the two vectors.
   */


  static add(u, v) {
    return new Vector3f(u.components[0] + v.components[0], u.components[1] + v.components[1], u.components[2] + v.components[2]);
  }
  /**
   * Subtracts one scalar from another (u - v)
   * 
   * @static
   * @param {Vector3f} u A vector. 
   * @param {Vector3f} v A vector. 
   * @returns {Vector3f} The difference between the two vectors.
   */


  static subtract(u, v) {
    return new Vector3f(u.components[0] - v.components[0], u.components[1] - v.components[1], u.components[2] - v.components[2]);
  }
  /**
   * Calculates the cross product of two vectors.
   * 
   * @static
   * @param {Vector3f} u A vector. 
   * @param {Vector3f} v A vector. 
   * @returns {Vector3f} The cross product of the two vectors.
   */


  static cross(u, v) {
    return new Vector3f(u.components[1] * v.components[2] - u.components[2] * v.components[1], u.components[2] * v.components[0] - u.components[0] * v.components[2], u.components[0] * v.components[1] - u.components[1] * v.components[0]);
  }
  /**
   * Calculates the dot product of two vectors.
   * 
   * @static
   * @param {Vector3f} u A vector. 
   * @param {Vector3f} v A vector. 
   * @returns {Number} The dot product of the two vectors.
   */


  static dot(u, v) {
    return u.components[0] * v.components[0] + u.components[1] * v.components[1] + u.components[2] * v.components[2];
  }
  /**
   * Returns the forward vector (0, 0, 1).
   * 
   * @static
   * @returns {Vector3f} The forward vector.
   */


  static forward() {
    return new Vector3f(0, 0, 1);
  }
  /**
   * Returns the up vector (0, 1, 0).
   * 
   * @static
   * @returns {Vector3f} The up vector.
   */


  static up() {
    return new Vector3f(0, 1, 0);
  }
  /**
   * Returns the right vector (1, 0, 0).
   * 
   * @static
   * @returns {Vector3f} The right vector.
   */


  static right() {
    return new Vector3f(1, 0, 0);
  }

}

module.exports = Vector3f;

},{"./SphericalCoords":43}],46:[function(require,module,exports){
"use strict";

const Matrix3f = require('./Matrix3f');

const Matrix4f = require('./Matrix4f');

const ProjectionMatrix = require('./ProjectionMatrix');

const Quaternion = require('./Quaternion');

const RadixSort = require('./RadixSort');

const Ray = require('./Ray');

const SphericalCoords = require('./SphericalCoords');

const Statistics = require('./Statistics');

const Vector3f = require('./Vector3f');

module.exports = {
  Matrix3f,
  Matrix4f,
  ProjectionMatrix,
  Quaternion,
  RadixSort,
  Ray,
  SphericalCoords,
  Statistics,
  Vector3f
};

},{"./Matrix3f":37,"./Matrix4f":38,"./ProjectionMatrix":39,"./Quaternion":40,"./RadixSort":41,"./Ray":42,"./SphericalCoords":43,"./Statistics":44,"./Vector3f":45}],47:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('circle', 1, {
  size: new Uniform('size', 5.0, 'float'),
  cutoff: new Uniform('cutoff', 0.0, 'float'),
  clearColor: new Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4'),
  fogDensity: new Uniform('fogDensity', 6.0, 'float')
}, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 floatToRgb(float n) {', 'float b = floor(n / 65536.0);', 'float g = floor((n - b * 65536.0) / 256.0);', 'float r = floor(n - b * 65536.0 - g * 256.0);', 'return vec3(r / 255.0, g / 255.0, b / 255.0);', '}', 'void main() {', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = floatToRgb(color.r);', '}'], ['uniform vec4 clearColor;', 'uniform float fogDensity;', 'varying vec3 vColor;', 'varying float vDiscard;', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'if(vDiscard > 0.5) discard;', 'vec3 N;', 'N.xy = gl_PointCoord * 2.0 - vec2(1.0);', 'float mag = dot(N.xy, N.xy);', 'if (mag > 1.0) discard;   // discard fragments outside circle', 'float z = gl_FragCoord.z / gl_FragCoord.w;', 'float fog_factor = clamp(exp2(-fogDensity * fogDensity * z * z * 1.442695), 0.025, 1.0);', 'gl_FragColor = mix(clearColor, vec4(vColor, 1.0), fog_factor);', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],48:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('coordinates', 1, {}, ['attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'void main() {', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'gl_PointSize = 1.0;', 'vColor = color;', '}'], ['varying vec3 vColor;', 'void main() {', 'gl_FragColor = vec4(vColor, 1.0);', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],49:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('default', 1, {
  size: new Uniform('size', 5.0, 'float'),
  type: new Uniform('type', 0.0, 'float'),
  cutoff: new Uniform('cutoff', 0.0, 'float'),
  clearColor: new Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4'),
  fogDensity: new Uniform('fogDensity', 6.0, 'float')
}, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 floatToRgb(float n) {', 'float b = floor(n / 65536.0);', 'float g = floor((n - b * 65536.0) / 256.0);', 'float r = floor(n - b * 65536.0 - g * 256.0);', 'return vec3(r / 255.0, g / 255.0, b / 255.0);', '}', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = floatToRgb(color.r);', '}'], ['uniform vec4 clearColor;', 'uniform float fogDensity;', 'varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'float z = gl_FragCoord.z / gl_FragCoord.w;', 'float fog_factor = clamp(exp2(-fogDensity * fogDensity * z * z * 1.442695), 0.025, 1.0);', 'gl_FragColor = mix(clearColor, vec4(vColor, 1.0), fog_factor);', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],50:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('defaultAnimated', 1, {
  size: new Uniform('size', 5.0, 'float'),
  cutoff: new Uniform('cutoff', 0.0, 'float'),
  time: new Uniform('time', 0.0, 'float'),
  clearColor: new Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4'),
  fogDensity: new Uniform('fogDensity', 6.0, 'float')
}, ['uniform float size;', 'uniform float cutoff;', 'uniform float time;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 rgb2hsv(vec3 c) {', 'vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);', 'vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));', 'vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));', 'float d = q.x - min(q.w, q.y);', 'float e = 1.0e-10;', 'return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);', '}', 'vec3 hsv2rgb(vec3 c) {', 'vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);', 'vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);', 'return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);', '}', 'void main() {', 'vec3 hsv = vec3(color.r, color.g, 1.0);', 'float saturation = color.g;', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = size;', 'hsv.g *= max(0.15, abs(sin(time * 0.002)));', 'vColor = hsv2rgb(hsv);', '}'], ['uniform vec4 clearColor;', 'uniform float fogDensity;', 'varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'float z = gl_FragCoord.z / gl_FragCoord.w;', 'float fog_factor = clamp(exp2(-fogDensity * fogDensity * z * z * 1.442695), 0.025, 1.0);', 'gl_FragColor = mix(clearColor, vec4(vColor, 1.0), fog_factor);', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],51:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('defaultEffect', 1, {}, ['attribute vec2 v_coord;', 'uniform sampler2D fbo_texture;', 'varying vec2 f_texcoord;', 'void main() {', 'gl_Position = vec4(v_coord, 0.0, 1.0);', 'f_texcoord = (v_coord + 1.0) / 2.0;', '}'], ['uniform sampler2D fbo_texture;', 'varying vec2 f_texcoord;', 'void main(void) {', 'vec4 color = texture2D(fbo_texture, f_texcoord);', 'gl_FragColor = color;', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],52:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('FXAAEffect', 1, {
  resolution: new Uniform('resolution', [500.0, 500.0], 'float_vec2')
}, ['attribute vec2 v_coord;', 'uniform sampler2D fbo_texture;', 'uniform vec2 resolution;', 'varying vec2 f_texcoord;', 'void main() {', 'gl_Position = vec4(v_coord, 0.0, 1.0);', 'f_texcoord = (v_coord + 1.0) / 2.0;', '}'],
/*
[
 '#define FXAA_REDUCE_MIN   (1.0/ 128.0)',
 '#define FXAA_REDUCE_MUL   (1.0 / 8.0)',
 '#define FXAA_SPAN_MAX     8.0',
  'vec4 applyFXAA(vec2 fragCoord, sampler2D tex, vec2 resolution)',
 '{',
     'fragCoord = fragCoord * resolution;',
     'vec2 inverseVP = vec2(1.0 / 500.0, 1.0 / 500.0);',
     'vec3 rgbNW = texture2D(tex, (fragCoord.xy + vec2(-1.0, -1.0)) * inverseVP).xyz;',
     'vec3 rgbNE = texture2D(tex, (fragCoord.xy + vec2(1.0, -1.0)) * inverseVP).xyz;',
     'vec3 rgbSW = texture2D(tex, (fragCoord.xy + vec2(-1.0, 1.0)) * inverseVP).xyz;',
     'vec3 rgbSE = texture2D(tex, (fragCoord.xy + vec2(1.0, 1.0)) * inverseVP).xyz;',
     'vec4 rgbaM  = texture2D(tex, fragCoord.xy  * inverseVP);',
     'vec3 rgbM = rgbaM.xyz;',
     'float opacity = rgbaM.w;',
     'vec3 luma = vec3(0.299, 0.587, 0.114);',
     'float lumaNW = dot(rgbNW, luma);',
     'float lumaNE = dot(rgbNE, luma);',
     'float lumaSW = dot(rgbSW, luma);',
     'float lumaSE = dot(rgbSE, luma);',
     'float lumaM  = dot(rgbM,  luma);',
     'float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));',
     'float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));',
      'vec2 dir;',
     'dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));',
     'dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));',
      'float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);',
     'float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);',
      'dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) * inverseVP;',
      'vec3 rgbA = 0.5 * (texture2D(tex, fragCoord.xy * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +',
                        'texture2D(tex, fragCoord.xy * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);',
      'vec3 rgbB = rgbA * 0.5 + 0.25 * (texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +',
                                      'texture2D(tex, fragCoord.xy * inverseVP + dir * 0.5).xyz);',
      'float lumaB = dot(rgbB, luma);',
     'if ((lumaB < lumaMin) || (lumaB > lumaMax))',
         'return vec4(rgbA, 1.0);',
     'else',
         'return vec4(rgbB, 1.0);',
 '}',
  'uniform sampler2D fbo_texture;',
 'varying vec2 f_texcoord;',
 'void main(void) {',
     'gl_FragColor = applyFXAA(f_texcoord, fbo_texture, vec2(500.0, 500.0));',
 '}'
]);
*/
['#define fxaaTexture2D(t, p, o, r) texture2D(t, p + (o * r), 0.0)', '#define fxaaSat(x) clamp(x, 0.0, 1.0)', '#define FXAA_QUALITY_PS 8', '#define FXAA_QUALITY_P0 1.0', '#define FXAA_QUALITY_P1 1.5', '#define FXAA_QUALITY_P2 2.0', '#define FXAA_QUALITY_P3 2.0', '#define FXAA_QUALITY_P4 2.0', '#define FXAA_QUALITY_P5 2.0', '#define FXAA_QUALITY_P6 4.0', '#define FXAA_QUALITY_P7 12.0', 'vec4 fxaa(vec2 pos, sampler2D tex, vec2 resolution,', 'float subpixQuality, float edgeThreshold, float edgeThresholdMin) {', 'vec2 posM;', 'posM.x = pos.x;', 'posM.y = pos.y;', 'vec4 rgbyM = texture2D(tex, posM);', 'vec3 luma = vec3(0.299, 0.587, 0.114);', 'float lumaM = dot(rgbyM.xyz, luma);', 'float lumaS = dot(fxaaTexture2D(tex, posM, vec2(0, 1), resolution.xy).xyz, luma);', 'float lumaE = dot(fxaaTexture2D(tex, posM, vec2(1, 0), resolution.xy).xyz, luma);', 'float lumaN = dot(fxaaTexture2D(tex, posM, vec2(0, -1), resolution.xy).xyz, luma);', 'float lumaW = dot(fxaaTexture2D(tex, posM, vec2(-1, 0), resolution.xy).xyz, luma);', 'float maxSM = max(lumaS, lumaM);', 'float minSM = min(lumaS, lumaM);', 'float maxESM = max(lumaE, maxSM);', 'float minESM = min(lumaE, minSM);', 'float maxWN = max(lumaN, lumaW);', 'float minWN = min(lumaN, lumaW);', 'float rangeMax = max(maxWN, maxESM);', 'float rangeMin = min(minWN, minESM);', 'float rangeMaxScaled = rangeMax * edgeThreshold;', 'float range = rangeMax - rangeMin;', 'float rangeMaxClamped = max(edgeThresholdMin, rangeMaxScaled);', 'bool earlyExit = range < rangeMaxClamped;', '// maybe return rgbyM -> leave unchanged', 'if(earlyExit) return rgbyM;', 'float lumaNW = dot(fxaaTexture2D(tex, posM, vec2(-1, -1), resolution.xy).xyz, luma);', 'float lumaSE = dot(fxaaTexture2D(tex, posM, vec2(1, 1), resolution.xy).xyz, luma);', 'float lumaNE = dot(fxaaTexture2D(tex, posM, vec2(1, -1), resolution.xy).xyz, luma);', 'float lumaSW = dot(fxaaTexture2D(tex, posM, vec2(-1, 1), resolution.xy).xyz, luma);', 'float lumaNS = lumaN + lumaS;', 'float lumaWE = lumaW + lumaE;', 'float subpixRcpRange = 1.0 / range;', 'float subpixNSWE = lumaNS + lumaWE;', 'float edgeHorz1 = (-2.0 * lumaM) + lumaNS;', 'float edgeVert1 = (-2.0 * lumaM) + lumaWE;', 'float lumaNESE = lumaNE + lumaSE;', 'float lumaNWNE = lumaNW + lumaNE;', 'float edgeHorz2 = (-2.0 * lumaE) + lumaNESE;', 'float edgeVert2 = (-2.0 * lumaN) + lumaNWNE;', 'float lumaNWSW = lumaNW + lumaSW;', 'float lumaSWSE = lumaSW + lumaSE;', 'float edgeHorz4 = (abs(edgeHorz1) * 2.0) + abs(edgeHorz2);', 'float edgeVert4 = (abs(edgeVert1) * 2.0) + abs(edgeVert2);', 'float edgeHorz3 = (-2.0 * lumaW) + lumaNWSW;', 'float edgeVert3 = (-2.0 * lumaS) + lumaSWSE;', 'float edgeHorz = abs(edgeHorz3) + edgeHorz4;', 'float edgeVert = abs(edgeVert3) + edgeVert4;', 'float subpixNWSWNESE = lumaNWSW + lumaNESE;', 'float lengthSign = resolution.x;', 'bool horzSpan = edgeHorz >= edgeVert;', 'float subpixA = subpixNSWE * 2.0 + subpixNWSWNESE;', 'if(!horzSpan) lumaN = lumaW;', 'if(!horzSpan) lumaS = lumaE;', 'if(horzSpan) lengthSign = resolution.y;', 'float subpixB = (subpixA * (1.0/12.0)) - lumaM;', 'float gradientN = lumaN - lumaM;', 'float gradientS = lumaS - lumaM;', 'float lumaNN = lumaN + lumaM;', 'float lumaSS = lumaS + lumaM;', 'bool pairN = abs(gradientN) >= abs(gradientS);', 'float gradient = max(abs(gradientN), abs(gradientS));', 'if(pairN) lengthSign = -lengthSign;', 'float subpixC = fxaaSat(abs(subpixB) * subpixRcpRange);', 'vec2 posB;', 'posB.x = posM.x;', 'posB.y = posM.y;', 'vec2 offNP;', 'offNP.x = (!horzSpan) ? 0.0 : resolution.x;', 'offNP.y = ( horzSpan) ? 0.0 : resolution.y;', 'if(!horzSpan) posB.x += lengthSign * 0.5;', 'if( horzSpan) posB.y += lengthSign * 0.5;', 'vec2 posN;', 'posN.x = posB.x - offNP.x * FXAA_QUALITY_P0;', 'posN.y = posB.y - offNP.y * FXAA_QUALITY_P0;', 'vec2 posP;', 'posP.x = posB.x + offNP.x * FXAA_QUALITY_P0;', 'posP.y = posB.y + offNP.y * FXAA_QUALITY_P0;', 'float subpixD = ((-2.0)*subpixC) + 3.0;', 'float lumaEndN = texture2D(tex, posN).w;', 'float subpixE = subpixC * subpixC;', 'float lumaEndP = texture2D(tex, posP).w;', 'if(!pairN) lumaNN = lumaSS;', 'float gradientScaled = gradient * 1.0/4.0;', 'float lumaMM = lumaM - lumaNN * 0.5;', 'float subpixF = subpixD * subpixE;', 'bool lumaMLTZero = lumaMM < 0.0;', 'lumaEndN -= lumaNN * 0.5;', 'lumaEndP -= lumaNN * 0.5;', 'bool doneN = abs(lumaEndN) >= gradientScaled;', 'bool doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P1;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P1;', 'bool doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P1;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P1;', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P2;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P2;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P2;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P2;', '#if (FXAA_QUALITY_PS > 3)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P3;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P3;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P3;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P3;', '#if (FXAA_QUALITY_PS > 4)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P4;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P4;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P4;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P4;', '#if (FXAA_QUALITY_PS > 5)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P5;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P5;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P5;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P5;', '#if (FXAA_QUALITY_PS > 6)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P6;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P6;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P6;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P6;', '#if (FXAA_QUALITY_PS > 7)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P7;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P7;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P7;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P7;', '#if (FXAA_QUALITY_PS > 8)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P8;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P8;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P8;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P8;', '#if (FXAA_QUALITY_PS > 9)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P9;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P9;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P9;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P9;', '#if (FXAA_QUALITY_PS > 10)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P10;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P10;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P10;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P10;', '#if (FXAA_QUALITY_PS > 11)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P11;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P11;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P11;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P11;', '#if (FXAA_QUALITY_PS > 12)', 'if(doneNP) {', 'if(!doneN) lumaEndN = dot(texture2D(tex, posN.xy).xyz, luma);', 'if(!doneP) lumaEndP = dot(texture2D(tex, posP.xy).xyz, luma);', 'if(!doneN) lumaEndN = lumaEndN - lumaNN * 0.5;', 'if(!doneP) lumaEndP = lumaEndP - lumaNN * 0.5;', 'doneN = abs(lumaEndN) >= gradientScaled;', 'doneP = abs(lumaEndP) >= gradientScaled;', 'if(!doneN) posN.x -= offNP.x * FXAA_QUALITY_P12;', 'if(!doneN) posN.y -= offNP.y * FXAA_QUALITY_P12;', 'doneNP = (!doneN) || (!doneP);', 'if(!doneP) posP.x += offNP.x * FXAA_QUALITY_P12;', 'if(!doneP) posP.y += offNP.y * FXAA_QUALITY_P12;', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', '#endif', '}', 'float dstN = posM.x - posN.x;', 'float dstP = posP.x - posM.x;', 'if(!horzSpan) dstN = posM.y - posN.y;', 'if(!horzSpan) dstP = posP.y - posM.y;', 'bool goodSpanN = (lumaEndN < 0.0) != lumaMLTZero;', 'float spanLength = (dstP + dstN);', 'bool goodSpanP = (lumaEndP < 0.0) != lumaMLTZero;', 'float spanLengthRcp = 1.0 / spanLength;', 'bool directionN = dstN < dstP;', 'float dst = min(dstN, dstP);', 'bool goodSpan = directionN ? goodSpanN : goodSpanP;', 'float subpixG = subpixF * subpixF;', 'float pixelOffset = (dst * (-spanLengthRcp)) + 0.5;', 'float subpixH = subpixG * subpixQuality;', 'float pixelOffsetGood = goodSpan ? pixelOffset : 0.0;', 'float pixelOffsetSubpix = max(pixelOffsetGood, subpixH);', 'if(!horzSpan) posM.x += pixelOffsetSubpix * lengthSign;', 'if( horzSpan) posM.y += pixelOffsetSubpix * lengthSign;', '// maybe return vec4(texture2D(tex, posM).xyz, lumaM);', 'return texture2D(tex, posM);', '}', 'uniform sampler2D fbo_texture;', 'uniform vec2 resolution;', 'varying vec2 f_texcoord;', 'void main(void) {', 'gl_FragColor = fxaa(f_texcoord, fbo_texture, vec2(1.0 / resolution.x, 1.0 / resolution.y), 0.75, 0.166, 0.0833);', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],53:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('simpleSphere', 1, {
  size: new Uniform('size', 5.0, 'float'),
  cutoff: new Uniform('cutoff', 0.0, 'float'),
  clearColor: new Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4'),
  fogDensity: new Uniform('fogDensity', 6.0, 'float')
}, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 floatToRgb(float n) {', 'float b = floor(n / 65536.0);', 'float g = floor((n - b * 65536.0) / 256.0);', 'float r = floor(n - b * 65536.0 - g * 256.0);', 'return vec3(r / 255.0, g / 255.0, b / 255.0);', '}', 'void main() {', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = floatToRgb(color.r);', '}'], ['uniform vec4 clearColor;', 'uniform float fogDensity;', 'varying vec3 vColor;', 'varying float vDiscard;', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'if(vDiscard > 0.5) discard;', 'vec3 N;', 'N.xy = gl_PointCoord * 2.0 - vec2(1.0);', 'float mag = dot(N.xy, N.xy);', 'if (mag > 1.0) discard;   // discard fragments outside circle', 'N.z = sqrt(1.0 - mag);', 'vec3 light_dir = vec3(0.25, -0.25, 1.0);', 'float diffuse = max(0.25, dot(light_dir, N));', 'float z = gl_FragCoord.z / gl_FragCoord.w;', 'float fog_factor = clamp(exp2(-fogDensity * fogDensity * z * z * 1.442695), 0.025, 1.0);', 'vec3 color = vColor * diffuse;', 'gl_FragColor = mix(clearColor, vec4(color, 1.0), fog_factor);', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],54:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('smoothCircle', 2, {
  size: new Uniform('size', 5.0, 'float'),
  cutoff: new Uniform('cutoff', 0.0, 'float'),
  clearColor: new Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4'),
  fogDensity: new Uniform('fogDensity', 6.0, 'float')
}, ['uniform float size;', 'uniform float cutoff;', 'in vec3 position;', 'in vec3 color;', 'out vec3 vColor;', 'out float vDiscard;', 'vec3 floatToRgb(float n) {', 'float b = floor(n / 65536.0);', 'float g = floor((n - b * 65536.0) / 256.0);', 'float r = floor(n - b * 65536.0 - g * 256.0);', 'return vec3(r / 255.0, g / 255.0, b / 255.0);', '}', 'void main() {', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = floatToRgb(color.r);', '}'], ['uniform vec4 clearColor;', 'uniform float fogDensity;', 'in vec3 vColor;', 'in float vDiscard;', 'out vec4 fragColor;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'float dist = distance(gl_PointCoord, vec2(0.5)) * 1.25;', 'float delta = fwidth(dist);', 'float a = 1.0 - smoothstep(0.5 - delta, 0.5 + delta, dist);', 'fragColor = vec4(vColor, a);', 'if (fogDensity > 0.0) {', 'float z = gl_FragCoord.z / gl_FragCoord.w;', 'float fog_factor = clamp(exp2(-fogDensity * fogDensity * z * z * 1.442695), 0.025, 1.0);', 'fragColor = mix(vec4(clearColor.rgb, a), fragColor, fog_factor);', '}', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],55:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('sphere', 1, {
  size: new Uniform('size', 5.0, 'float'),
  cutoff: new Uniform('cutoff', 0.0, 'float'),
  clearColor: new Uniform('clearColor', [1.0, 1.0, 1.0, 1.0], 'float_vec4'),
  fogDensity: new Uniform('fogDensity', 6.0, 'float')
}, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 floatToRgb(float n) {', 'float b = floor(n / 65536.0);', 'float g = floor((n - b * 65536.0) / 256.0);', 'float r = floor(n - b * 65536.0 - g * 256.0);', 'return vec3(r / 255.0, g / 255.0, b / 255.0);', '}', 'void main() {', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0 || mv_pos.z > 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'gl_PointSize = point_size * size;', 'vColor = floatToRgb(color.r);', '}'], ['uniform vec4 clearColor;', 'uniform float fogDensity;', 'varying vec3 vColor;', 'varying float vDiscard;', 'float rand(vec2 co) {', 'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);', '}', 'void main() {', 'if(vDiscard > 0.5) discard;', 'vec3 N;', 'N.xy = gl_PointCoord * 2.0 - vec2(1.0);', 'float mag = dot(N.xy, N.xy);', 'if (mag > 1.0) discard;   // discard fragments outside circle', 'N.z = sqrt(1.0 - mag);', 'vec3 light_dir = vec3(0.25, -0.25, 1.0);', 'float diffuse = max(0.25, dot(light_dir, N));', 'vec3 v = normalize(vec3(0.1, -0.2, 1.0));', 'vec3 h = normalize(light_dir + v);', 'float specular = pow(max(0.0, dot(N, h)), 100.0);', '// specular += 0.1 * rand(gl_PointCoord);', 'float z = gl_FragCoord.z / gl_FragCoord.w;', 'float fog_factor = clamp(exp2(-fogDensity * fogDensity * z * z * 1.442695), 0.025, 1.0);', 'vec3 color = vColor * diffuse + specular * 0.5;', 'gl_FragColor = mix(clearColor, vec4(color, 1.0), fog_factor);', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],56:[function(require,module,exports){
"use strict";

const Shader = require('../Core/Shader');

const Uniform = require('../Core/Uniform');

module.exports = new Shader('tree', 1, {
  size: new Uniform('size', 5.0, 'float'),
  cutoff: new Uniform('cutoff', 0.0, 'float'),
  clearColor: new Uniform('clearColor', [0.0, 0.0, 0.0, 1.0], 'float_vec4'),
  fogDensity: new Uniform('fogDensity', 6.0, 'float')
}, ['uniform float size;', 'uniform float cutoff;', 'attribute vec3 position;', 'attribute vec3 color;', 'varying vec3 vColor;', 'varying float vDiscard;', 'vec3 floatToRgb(float n) {', 'float b = floor(n / 65536.0);', 'float g = floor((n - b * 65536.0) / 256.0);', 'float r = floor(n - b * 65536.0 - g * 256.0);', 'return vec3(r / 255.0, g / 255.0, b / 255.0);', '}', 'void main() {', 'float point_size = color.b;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', 'vec4 mv_pos = modelViewMatrix * vec4(position, 1.0);', 'vDiscard = 0.0;', 'if(-mv_pos.z < cutoff || point_size <= 0.0) {', 'vDiscard = 1.0;', 'return;', '}', 'vColor = floatToRgb(color.r);', '}'], ['uniform vec4 clearColor;', 'uniform float fogDensity;', 'varying vec3 vColor;', 'varying float vDiscard;', 'void main() {', 'if(vDiscard > 0.5) discard;', 'float z = gl_FragCoord.z / gl_FragCoord.w;', 'float fog_factor = clamp(exp2(-fogDensity * fogDensity * z * z * 1.442695), 0.025, 1.0);', 'gl_FragColor = mix(clearColor, vec4(vColor, 1.0), fog_factor);', '}']);

},{"../Core/Shader":18,"../Core/Uniform":20}],57:[function(require,module,exports){
"use strict";

var circle = require('./Circle');

var coordinates = require('./Coordinates');

var defaultSquare = require('./Default');

var defaultAnimated = require('./DefaultAnimated');

var defaultEffect = require('./DefaultEffect');

var simpleSphere = require('./SimpleSphere');

var smoothCircle = require('./SmoothCircle');

var sphere = require('./Sphere');

var tree = require('./Tree');

var fxaaEffect = require('./FXAAEffect');

module.exports = {
  circle,
  coordinates,
  defaultSquare,
  defaultAnimated,
  defaultEffect,
  simpleSphere,
  smoothCircle,
  sphere,
  tree,
  fxaaEffect
};

},{"./Circle":47,"./Coordinates":48,"./Default":49,"./DefaultAnimated":50,"./DefaultEffect":51,"./FXAAEffect":52,"./SimpleSphere":53,"./SmoothCircle":54,"./Sphere":55,"./Tree":56}],58:[function(require,module,exports){
"use strict";

//@ts-check
const Vector3f = require('../Math/Vector3f');
/**
* @class
* Axis-aligned bounding boxes with the constraint that they are cubes with equal sides.
* @property {Vector3f} center - The center of this axis-aligned bounding box.
* @property {number} radius - The radius of this axis-aligned bounding box.
* @property {number} locCode - The location code of this axis-aligned bounding box in the octree.
* @property {number} left - The distance of the left plane to the world ZY plane.
* @property {number} right - The distance of the right plane to the world ZY plane.
* @property {number} back - The distance of the back plane to the world XY plane.
* @property {number} front - The distance of the front plane to the world XY plane.
* @property {number} bottom - The distance of the bottom plane to the world XZ plane.
* @property {number} top - The distance of the top plane to the world XZ plane.
* @property {Array} neighbours - The neighbours of this axis-aligned bounding box in an an octree.
* @property {Float32Array} min - An array specifying the minimum corner point (x, y, z) of the axis-aligned bounding box.
* @property {Float32Array} max - An array specifying the maximum corner point (x, y, z) of the axis-aligned bounding box.
* @constructor
* @param {Vector3f} center - A radius for this axis-aligned bounding box.
* @param {number} radius - A radius for this axis-aligned bounding box.
*/


class AABB {
  constructor(center, radius) {
    this.center = center || new Vector3f(0.0, 0.0, 0.0);
    this.radius = radius || 0;
    this.locCode = 0;
    this.left = 0;
    this.right = 0;
    this.back = 0;
    this.front = 0;
    this.bottom = 0;
    this.top = 0;
    this.neighbours = new Array(6);
    this.min = new Float32Array(3);
    this.max = new Float32Array(3);
    this.updateDimensions();
  }
  /**
   * Calculates the distance of the axis-aligned bounding box's planes to the world planes.
   */


  updateDimensions() {
    let cx = this.center.components[0];
    let cy = this.center.components[1];
    let cz = this.center.components[2];
    this.min[0] = cx - this.radius;
    this.min[1] = cy - this.radius;
    this.min[2] = cz - this.radius;
    this.max[0] = cx + this.radius;
    this.max[1] = cy + this.radius;
    this.max[2] = cz + this.radius; // Precalculate to simplify ray test

    this.left = cx - this.radius;
    this.right = cx + this.radius;
    this.back = cz - this.radius;
    this.front = cz + this.radius;
    this.bottom = cy - this.radius;
    this.top = cy + this.radius;
    return this;
  }
  /**
   * Sets the location code of this axis-aligned bounding box.
   * 
   * @param {number} locCode - The location code.
   */


  setLocCode(locCode) {
    this.locCode = locCode;
    return this;
  }
  /**
   * Gets the location code of this axis-aligned bounding box.
   * 
   * @returns {number} The location code.
   */


  getLocCode() {
    return this.locCode;
  }
  /**
   * Tests whether or not this axis-aligned bounding box is intersected by a ray.
   * 
   * @param {Vector3f} source - The source of the ray.
   * @param {Vector3f} inverseDir - A normalized vector of the direction of the ray.
   * @param {number} dist - The maximum distance from the source that still counts as an intersect (the far property of the Lore.Raycaster object).
   * @returns {boolean} - Whether or not there is an intersect.
   */


  rayTest(source, inverseDir, dist) {
    // dir is the precomputed inverse of the direction of the ray,
    // this means that the costly divisions can be omitted
    let oc = source.components;
    let ic = inverseDir.components;
    let t0 = (this.left - oc[0]) * ic[0];
    let t1 = (this.right - oc[0]) * ic[0];
    let t2 = (this.bottom - oc[1]) * ic[1];
    let t3 = (this.top - oc[1]) * ic[1];
    let t4 = (this.back - oc[2]) * ic[2];
    let t5 = (this.front - oc[2]) * ic[2];
    let maxT = Math.min(Math.max(t0, t1), Math.max(t2, t3), Math.max(t4, t5)); // Ray intersects in reverse direction, which means
    // that the box is behind the camera

    if (maxT < 0) {
      return false;
    }

    let minT = Math.max(Math.min(t0, t1), Math.min(t2, t3), Math.min(t4, t5));

    if (minT > maxT || minT > dist) {
      return false;
    } // Intersection happens when minT is larger or equal to maxT
    // and minT is smaller than the distance (distance == radius == ray.far)


    return true;
  }
  /**
   * Tests whether or not this axis-aligned bounding box is intersected by a cylinder. CAUTION: If this runs multi-threaded, it might fail.
   * 
   * @param {Vector3f} source - The source of the ray.
   * @param {Vector3f} inverseDir - A normalized vector of the direction of the ray.
   * @param {number} dist - The maximum distance from the source that still counts as an intersect (the far property of the Lore.Raycaster object).
   * @param {number} radius - The radius of the cylinder
   * @returns {boolean} - Whether or not there is an intersect.
   */


  cylinderTest(source, inverseDir, dist, radius) {
    // Instead of testing an actual cylinder against this aabb, we simply
    // expand the radius of the box temporarily.
    this.radius += radius;
    this.updateDimensions(); // Do the normal ray intersection test

    let result = this.rayTest(source, inverseDir, dist);
    this.radius -= radius;
    this.updateDimensions();
    return result;
  }
  /**
   * Returns the square distance of this axis-aligned bounding box to the point supplied as an argument.
   * 
   * @param {number} x - The x component of the point coordinate.
   * @param {number} y - The y component of the point coordinate.
   * @param {number} z - The z component of the point coordinate.
   * @returns {number} The square distance of this axis-aligned bounding box to the input point.
   */


  distanceToPointSq(x, y, z) {
    // From book, real time collision detection
    let sqDist = 0;
    let p = [x, y, z]; // Add the distances for each axis

    for (var i = 0; i < 3; i++) {
      if (p[i] < this.min[i]) sqDist += Math.pow(this.min[i] - p[i], 2);
      if (p[i] > this.max[i]) sqDist += Math.pow(p[i] - this.max[i], 2);
    }

    return sqDist;
  }
  /**
   * Returns the box that is closest to the point (measured from center).
   * 
   * @param {number} x - The x component of the point coordinate.
   * @param {number} y - The y component of the point coordinate.
   * @param {number} z - The z component of the point coordinate.
   * @returns {number} The square distance of this axis-aligned bounding box to the input point.
   */


  distanceFromCenterToPointSq(x, y, z) {
    let center = this.center.components;
    return Math.pow(center[0] - x, 2) + Math.pow(center[1] - y, 2) + Math.pow(center[2] - z, 2);
  }
  /**
   * Tests whether or not this axis-aligned bounding box overlaps or shares an edge or a vertex with another axis-aligned bounding box.
   * This method can also be used to assert whether or not two boxes are neighbours.
   * 
   * @param {AABB} aabb - The axis-aligned bounding box to test against.
   * @returns {boolean} - Whether or not there is an overlap.
   */


  testAABB(aabb) {
    for (var i = 0; i < 3; i++) {
      if (this.max[i] < aabb.min[i] || this.min[i] > aabb.max[i]) {
        return false;
      }
    }

    return true;
  }
  /**
   * Creates a axis-aligned bounding box surrounding a set of vertices.
   * 
   * @param {Float32Array} vertices - The vertices which will all be inside the axis-aligned bounding box.
   * @returns {AABB} An axis-aligned bounding box surrounding the vertices.
   */


  static fromPoints(vertices) {
    let x = vertices[0];
    let y = vertices[1];
    let z = vertices[2];
    let min = new Vector3f(x, y, z);
    let max = new Vector3f(x, y, z);
    let minc = min.components;
    let maxc = max.components;

    for (var i = 1; i < vertices.length / 3; i++) {
      if (vertices[i * 3 + 0] < minc[0]) minc[0] = vertices[i * 3 + 0];
      if (vertices[i * 3 + 1] < minc[1]) minc[1] = vertices[i * 3 + 1];
      if (vertices[i * 3 + 2] < minc[2]) minc[2] = vertices[i * 3 + 2];
      if (vertices[i * 3 + 0] > maxc[0]) maxc[0] = vertices[i * 3 + 0];
      if (vertices[i * 3 + 1] > maxc[1]) maxc[1] = vertices[i * 3 + 1];
      if (vertices[i * 3 + 2] > maxc[2]) maxc[2] = vertices[i * 3 + 2];
    } // Calculate the radius in each direction


    let radii = Vector3f.subtract(max, min);
    radii.multiplyScalar(0.5);
    let rx = radii.components[0];
    let ry = radii.components[1];
    let rz = radii.components[2];
    let center = new Vector3f(rx, ry, rz);
    center.add(min); // Since the octree always stores cubes, there is of course only
    // one radius - take the biggest one

    let radius = Math.max(rx, ry, rz);
    return new AABB(center, radius);
  }
  /**
   * Returns an array representing the 8 corners of the axis-aligned bounding box.
   * 
   * @param {AABB} aabb An axis-aligned bounding box.
   * @returns {Array} An array containing the 8 corners of the axisa-aligned bunding box. E.g [[x, y, z], [x, y, z], ...]
   */


  static getCorners(aabb) {
    let c = aabb.center.components;
    let x = c[0];
    let y = c[1];
    let z = c[2];
    let r = aabb.radius;
    return [[x - r, y - r, z - r], [x - r, y - r, z + r], [x - r, y + r, z - r], [x - r, y + r, z + r], [x + r, y - r, z - r], [x + r, y - r, z + r], [x + r, y + r, z - r], [x + r, y + r, z + r]];
  }
  /**
   * Clones an axis-aligned bounding box.
   * 
   * @param {AABB} original - The axis-aligned bounding box to be cloned.
   * @returns {AABB} The cloned axis-aligned bounding box.
   */


  static clone(original) {
    let clone = new AABB();
    clone.back = original.back;
    clone.bottom = original.bottom;
    clone.center = new Vector3f(original.center.components[0], original.center.components[1], original.center.components[2]);
    clone.front = original.front;
    clone.left = original.left;
    clone.locCode = original.locCode;
    clone.max = original.max;
    clone.min = original.min;
    clone.radius = original.radius;
    clone.right = original.right;
    clone.top = original.top;
    return clone;
  }

}

module.exports = AABB;

},{"../Math/Vector3f":45}],59:[function(require,module,exports){
"use strict";

//@ts-check
const AABB = require('./AABB');

const Vector3f = require('../Math/Vector3f');

const Utils = require('../Utils/Utils');

const Raycaster = require('./Raycaster');

const RadixSort = require('../Math/RadixSort');
/** 
 * @class
 * An octree constructed using the point cloud.
 * @property {number} threshold - A threshold indicating whether or not a further subdivision is needed based on the number of data points in the current node.
 * @property {number} maxDepth - A maximum depth of the octree.
 * @property {Object} points - An object storing the points belonging to each node indexed by the location id of the node.
 * @property {Object} aabbs - An object storing the axis-aligned bounding boxes belonging to each node indexed by the location id of the node.
 * @constructor
 * @param {number} threshold - A threshold indicating whether or not a further subdivision is needed based on the number of data points in the current node.
 * @param {number} maxDepth - A maximum depth of the octree.
 */


class Octree {
  constructor(threshold, maxDepth) {
    this.threshold = threshold || 500;
    this.maxDepth = maxDepth || 8;
    this.points = {};
    this.aabbs = {};
    this.offsets = [[-0.5, -0.5, -0.5], [-0.5, -0.5, +0.5], [-0.5, +0.5, -0.5], [-0.5, +0.5, +0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5]];
  }
  /**
   * Builds the octree by assigning the indices of data points and axis-aligned bounding boxes to assoziative arrays indexed by the location code.
   * @param {Uint32Array} pointIndices - An set of points that are either sub-divided into sub nodes or assigned to the current node.
   * @param {Float32Array} vertices - An array containing the positions of all the vertices.
   * @param {AABB} aabb - The bounding box of the current node.
   * @param {number} [locCode=1] - A binary code encoding the id and the level of the current node.
   */


  build(pointIndices, vertices, aabb, locCode = 1) {
    // Set the location code of the axis-aligned bounding box
    aabb.setLocCode(locCode); // Store the axis aligned bounding box of this node
    // and set the points belonging to the node to null

    this.points[locCode] = null;
    this.aabbs[locCode] = aabb; // Check if this node reaches the maximum depth or the threshold

    let depth = this.getDepth(locCode);

    if (pointIndices.length <= this.threshold || depth >= this.maxDepth) {
      this.points[locCode] = new Uint32Array(pointIndices.length);

      for (var i = 0; i < pointIndices.length; i++) {
        this.points[locCode][i] = pointIndices[i];
      }

      return true;
    }

    let childPointCounts = new Uint32Array(8);
    let codes = new Float32Array(pointIndices.length);

    for (var i = 0; i < pointIndices.length; i++) {
      // Points are indices to the vertices array
      // which stores x,y,z coordinates linear
      let k = pointIndices[i] * 3; // Assign point to subtree, this gives a code
      // 000, 001, 010, 011, 100, 101, 110, 111
      // (-> 8 possible subtrees)

      if (vertices[k + 0] >= aabb.center.components[0]) codes[i] |= 4;
      if (vertices[k + 1] >= aabb.center.components[1]) codes[i] |= 2;
      if (vertices[k + 2] >= aabb.center.components[2]) codes[i] |= 1;
      childPointCounts[codes[i]]++;
    }

    let nextPoints = new Array(8);
    let nextAabb = new Array(8);

    for (var i = 0; i < 8; i++) {
      if (childPointCounts[i] == 0) continue;
      nextPoints[i] = new Uint32Array(childPointCounts[i]);

      for (var j = 0, k = 0; j < pointIndices.length; j++) {
        if (codes[j] == i) {
          nextPoints[i][k++] = pointIndices[j];
        }
      }

      let o = this.offsets[i];
      let offset = new Vector3f(o[0], o[1], o[2]);
      offset.multiplyScalar(aabb.radius);
      nextAabb[i] = new AABB(aabb.center.clone().add(offset), 0.5 * aabb.radius);
    }

    for (var i = 0; i < 8; i++) {
      if (childPointCounts[i] == 0) {
        continue;
      }

      let nextLocCode = this.generateLocCode(locCode, i);
      this.build(nextPoints[i], vertices, nextAabb[i], nextLocCode);
    }

    return this;
  }
  /**
   * Returns an array containing the location codes of all the axis-aligned
   * bounding boxes inside this octree.
   */


  getLocCodes() {
    return Object.keys(this.aabbs);
  }
  /**
   * Calculates the depth of the node from its location code.
   * @param {number} locCode - A binary code encoding the id and the level of the current node.
   * @returns {number} The depth of the node with the provided location code.
   */


  getDepth(locCode) {
    // If the msb is at position 6 (e.g. 1000000) the
    // depth is 2, since the locCode contains two nodes (2 x 3 bits)
    return Utils.msb(locCode) / 3;
  }
  /**
   * Generates a location code for a node based on the full code of the parent and the code of the current node.
   * @param {number} parentCode The full location code of the parent node.
   * @param {number} nodeCode The 3 bit code of the current node.
   * @returns {number} The full location code for the current node.
   */


  generateLocCode(parentCode, nodeCode) {
    // Insert the code of this new node, just before the msb (that is set to 1)
    // of the parents code
    let msb = Utils.msb(parentCode);

    if (msb == -1) {
      return nodeCode | 8;
    } else {
      // Left-shift the parent code by msb
      parentCode = parentCode <<= 3; // OR parent code with node code

      return parentCode | nodeCode;
    }
  }
  /**
   * Traverses the octree depth-first.
   * @param {Function} traverseCallback - Is called for each node where a axis-aligned bounding box exists.
   * @param {number} [locCode=1] - The location code of the node that serves as the starting node for the traversion.
   */


  traverse(traverseCallback, locCode = 1) {
    for (var i = 0; i < 8; i++) {
      let next = locCode << 3 | i; // If it has an aabb, it exists

      if (this.aabbs[next]) {
        traverseCallback(this.points[next], this.aabbs[next], next);
        this.traverse(traverseCallback, next);
      }
    }
  }
  /**
   * Traverses the octree depth-first, does not visit nodes / subtrees if a condition is not met.
   * @param {Function} traverseIfCallback - Is called for each node where a axis-aligned bounding box exists and returns either true or false, with false stopping further exploration of the subtree.
   * @param {Function} conditionCallback - Is called to test whether or not a subtree should be explored.
   * @param {number} [locCode=1] - The location code of the node that serves as the starting node for the traversion.
   */


  traverseIf(traverseIfCallback, conditionCallback, locCode = 1) {
    for (var i = 0; i < 8; i++) {
      let next = locCode << 3 | i; // If it has an aabb, it exists

      if (this.aabbs[next]) {
        if (!conditionCallback(this.aabbs[next], next)) {
          continue;
        }

        traverseIfCallback(this.points[next], this.aabbs[next], next);
        this.traverseIf(traverseIfCallback, conditionCallback, next);
      }
    }
  }
  /**
   * Searches for octree nodes that are intersected by the ray and returns all the points associated with those nodes.
   * @param {Raycaster} raycaster - The raycaster used for checking for intersects.
   * @returns {Array} A set of points which are associated with octree nodes intersected by the ray.
   */


  raySearch(raycaster) {
    let result = []; // Info: shouldn't be necessary any more
    // Always add the points from the root
    // The root has the location code 1
    // ... looks like it's still necessary

    if (this.points[1]) {
      for (var i = 0; i < this.points[1].length; i++) {
        result.push({
          index: this.points[1][i],
          locCode: 1
        });
      }
    } // Calculate the direction, and the percentage
    // of the direction, of the ray


    let dir = raycaster.ray.direction.clone();
    dir.normalize();
    let inverseDir = new Vector3f(1, 1, 1);
    inverseDir.divide(dir);
    this.traverseIf(function (points, aabb, locCode) {
      // If there is an aabb, that contains no points but only
      // nodes, skip here
      if (!points) {
        return;
      }

      for (var i = 0; i < points.length; i++) {
        result.push({
          index: points[i],
          locCode: locCode
        });
      }
    }, function (aabb, locCode) {
      return aabb.cylinderTest(raycaster.ray.source, inverseDir, raycaster.far, raycaster.threshold);
    });
    return result;
  }
  /**
   * Returns an array containing all the centers of the axis-aligned bounding boxes
   * in this octree that have points associated with them.
   * @returns {Array} An array containing the centers as Lore.Vector3f objects.
   */


  getCenters(threshold) {
    threshold = threshold || 0;
    let centers = new Array();
    this.traverse(function (points, aabb, next) {
      if (points && points.length > threshold) {
        centers.push(aabb.center);
      }
    });
    return centers;
  }
  /**
   * This function returns the closest box in the octree to the point given as an argument.
   * @param {Vector3f} point - The point.
   * @param {number} threshold - The minimum number of points an axis-aligned bounding box should contain to count as a hit.
   * @param {number} [locCode=1] - The starting locCode, if not set, starts at the root.
   * @returns {AABB} The closest axis-aligned bounding box to the input point.
   */


  getClosestBox(point, threshold, locCode = 1) {
    let closest = -1;
    let minDist = Number.MAX_VALUE;

    for (var i = 0; i < 8; i++) {
      let next = locCode << 3 | i; // If it has an aabb, it exists

      if (this.aabbs[next]) {
        // Continue if under threshold
        if (this.points[next] && this.points[next].length < threshold) {
          continue;
        }

        let dist = this.aabbs[next].distanceToPointSq(point.components[0], point.components[1], point.components[2]);

        if (dist < minDist) {
          minDist = dist;
          closest = next;
        }
      }
    }

    if (closest < 0) {
      return this.aabbs[locCode];
    } else {
      return this.getClosestBox(point, threshold, closest);
    }
  }
  /**
   * This function returns the closest box in the octree to the point given as an argument. The distance measured is to the
   * box center.
   * @param {Vector3f} point - The point.
   * @param {number} threshold - The minimum number of points an axis-aligned bounding box should contain to count as a hit.
   * @param {number} [locCode=1] - The starting locCode, if not set, starts at the root.
   * @returns {AABB} The closest axis-aligned bounding box to the input point.
   */


  getClosestBoxFromCenter(point, threshold, locCode = 1) {
    let closest = -1;
    let minDist = Number.MAX_VALUE;

    for (var i = 0; i < 8; i++) {
      let next = locCode << 3 | i; // If it has an aabb, it exists

      if (this.aabbs[next]) {
        // Continue if under threshold
        if (this.points[next] && this.points[next].length < threshold) {
          continue;
        }

        let dist = this.aabbs[next].distanceFromCenterToPointSq(point.components[0], point.components[1], point.components[2]);

        if (dist < minDist) {
          minDist = dist;
          closest = next;
        }
      }
    }

    if (closest < 0) {
      return this.aabbs[locCode];
    } else {
      return this.getClosestBox(point, threshold, closest);
    }
  }
  /**
   * This function returns the farthest box in the octree to the point given as an argument.
   * @param {Vector3f} point - The point.
   * @param {number} threshold - The minimum number of points an axis-aligned bounding box should contain to count as a hit.
   * @param {number} [locCode=1] - The starting locCode, if not set, starts at the root.
   * @returns {AABB} The farthest axis-aligned bounding box to the input point.
   */


  getFarthestBox(point, threshold, locCode) {
    let farthest = -1;
    let maxDist = Number.MIN_VALUE;

    for (var i = 0; i < 8; i++) {
      let next = locCode << 3 | i; // If it has an aabb, it exists

      if (this.aabbs[next]) {
        // Continue if under threshold
        if (this.points[next] && this.points[next].length < threshold) {
          continue;
        }

        let dist = this.aabbs[next].distanceToPointSq(point.components[0], point.components[1], point.components[2]);

        if (dist > maxDist) {
          maxDist = dist;
          farthest = next;
        }
      }
    }

    if (farthest < 0) {
      return this.aabbs[locCode];
    } else {
      return this.getFarthestBox(point, threshold, farthest);
    }
  }
  /**
   * Finds the closest point inside the octree to the point provided as an argument.
   * @param {Vector3f} point - The point.
   * @param {Float32Array} positions - An array containing the positions of the points.
   * @param {number} threshold - Only consider points inside a axis-aligned bounding box with a minimum of [threshold] points.
   * @param {number} locCode - If specified, the axis-aligned bounding box in which the point is searched for. If not set, all boxes are searched.
   * @returns {Vector3f} The position of the closest point.
   */


  getClosestPoint(point, positions, threshold, locCode) {
    threshold = threshold || 0;
    let minDist = Number.MAX_VALUE;
    let result = null;
    let box = null;

    if (locCode) {
      box = this.aabbs[locCode];
    } else {
      box = this.getClosestBox(point, threshold);
    }

    let boxPoints = this.points[box.getLocCode()]; // If the box does not contain any points

    if (!boxPoints) {
      return null;
    }

    for (var i = 0; i < boxPoints.length; i++) {
      let index = boxPoints[i];
      index *= 3;
      let x = positions[index];
      let y = positions[index + 1];
      let z = positions[index + 2];
      let pc = point.components;
      let distSq = Math.pow(pc[0] - x, 2) + Math.pow(pc[1] - y, 2) + Math.pow(pc[2] - z, 2);

      if (distSq < minDist) {
        minDist = distSq;
        result = {
          x: x,
          y: y,
          z: z
        };
      }
    }

    if (!result) {
      return null;
    }

    return new Vector3f(result.x, result.y, result.z);
  }
  /**
   * Finds the farthest point inside the octree to the point provided as an argument.
   * @param {Vector3f} point - The point.
   * @param {Float32Array} positions - An array containing the positions of the points.
   * @param {number} threshold - Only consider points inside a axis-aligned bounding box with a minimum of [threshold] points.
   * @param {number} locCode - If specified, the axis-aligned bounding box in which the point is searched for. If not set, all boxes are searched.
   * @returns {Vector3f} The position of the farthest point.
   */


  getFarthestPoint(point, positions, threshold, locCode) {
    threshold = threshold || 0;
    let maxDist = Number.MIN_VALUE;
    let result = null; // Get farthest box

    let box = null;

    if (locCode) {
      box = this.aabbs[locCode];
    } else {
      box = this.getFarthestBox(point, threshold);
    }

    let boxPoints = this.points[box.getLocCode()]; // If the box does not contain any points

    if (!boxPoints) {
      return null;
    }

    for (var i = 0; i < boxPoints.length; i++) {
      let index = boxPoints[i];
      index *= 3;
      let x = positions[index];
      let y = positions[index + 1];
      let z = positions[index + 2];
      let pc = point.components;
      let distSq = Math.pow(pc[0] - x, 2) + Math.pow(pc[1] - y, 2) + Math.pow(pc[2] - z, 2);

      if (distSq > maxDist) {
        maxDist = distSq;
        result = {
          x: x,
          y: y,
          z: z
        };
      }
    }

    if (!result) {
      return null;
    }

    return new Vector3f(result.x, result.y, result.z);
  }
  /**
   * Returns the parent of a given location code by simply shifting it to the right by tree, removing the current code.
   * @param {number} locCode - The location code of a node.
   */


  getParent(locCode) {
    return locCode >>> 3;
  }
  /**
   * Find neighbouring axis-aligned bounding boxes.
   * @param {number} locCode - The location code of the axis-aligned bounding box whose neighbours will be returned
   * @returns {Array} An array of location codes of the neighbouring axis-aligned bounding boxes.
   */


  getNeighbours(locCode) {
    let self = this;
    let locCodes = new Array();
    this.traverseIf(function (points, aabbs, code) {
      if (points && points.length > 0 && code != locCode) {
        locCodes.push(code);
      }
    }, function (aabb, code) {
      // Exit branch if this node is not a neighbour
      return aabb.testAABB(self.aabbs[locCode]);
    });
    return locCodes;
  }
  /**
   * Returns the k-nearest neighbours of a vertex.
   * @param {number} k - The number of nearest neighbours to return.
   * @param {number} point - The index of a vertex or a vertex.
   * @param {number} locCode - The location code of the axis-aligned bounding box containing the vertex. If not set, the box is searched for.
   * @param {Float32Array} positions - The position information for the points indexed in this octree.
   * @param {Function} kNNCallback - The callback that is called after the k-nearest neighbour search has finished.
   */


  kNearestNeighbours(k, point, locCode, positions, kNNCallback) {
    k += 1; // Account for the fact, that the point itself should be returned as well.

    let length = positions.length / 3;
    let p = point; // TODO: WTF is happening here

    if (!isNaN(parseFloat(point))) {
      let p = {
        x: positions[p * 3],
        y: positions[p * 3 + 1],
        z: positions[p * 3 + 2]
      };
    }

    if (locCode === null) {
      locCode = this.getClosestBoxFromCenter(new Vector3f(p.x, p.y, p.z), 0).locCode;
    } // Calculte the distances to the other cells


    let cellDistances = this.getCellDistancesToPoint(p.x, p.y, p.z, locCode); // Calculte the distances to the other points in the same cell

    let pointDistances = this.pointDistancesSq(p.x, p.y, p.z, locCode, positions); // Sort the indices according to distance

    let radixSort = new RadixSort();
    let sortedPointDistances = radixSort.sort(pointDistances.distancesSq, true); // Sort the neighbours according to distance

    let sortedCellDistances = radixSort.sort(cellDistances.distancesSq, true); // Since the closest points always stay the closest points event when adding
    // the points of another cell, instead of resizing the array, just define
    // an offset

    let pointOffset = 0; // Get all the neighbours from this cell that are closer than the nereast box

    let indexCount = 0;
    let indices = new Uint32Array(k);

    for (var i = 0; indexCount < k && i < sortedPointDistances.array.length; i++) {
      // Break if closest neighbouring cell is closer than the closest remaining point
      if (sortedPointDistances.array[i] > sortedCellDistances.array[0]) {
        // Set the offset to the most distant closest member
        pointOffset = i;
        break;
      }

      indices[i] = pointDistances.indices[sortedPointDistances.indices[i]];
      indexCount++;
    } // If enough neighbours have been found in the same cell, no need to continue


    if (indexCount == k) {
      return indices;
    }

    for (var i = 0; i < sortedCellDistances.array.length; i++) {
      // Get the points from the cell and merge them with the already found ones
      let locCode = cellDistances.locCodes[sortedCellDistances.indices[i]];
      let newPointDistances = this.pointDistancesSq(p.x, p.y, p.z, locCode, positions);
      pointDistances = Octree.mergePointDistances(pointDistances, newPointDistances); // Sort the merged points

      let sortedNewPointDistances = radixSort.sort(pointDistances.distancesSq, true);

      for (var j = pointOffset; indexCount < k && j < sortedNewPointDistances.array.length; j++) {
        if (sortedNewPointDistances.array[j] > sortedCellDistances.array[i + 1]) {
          pointOffset = j;
          break;
        }

        indices[j] = pointDistances.indices[sortedNewPointDistances.indices[j]];
        indexCount++;
      }

      if (indexCount == k || indexCount >= length - 1) {
        // kNNCallback(indices);
        return indices;
      }
    } //kNNCallback(indices);


    return indices;
  }
  /**
   * Calculates the distances from a given point to all of the cells containing points
   * @param {number} x - The x-value of the coordinate.
   * @param {number} y - The y-value of the coordinate.
   * @param {number} z - The z-value of the coordinate.
   * @param {number} locCode - The location code of the cell containing the point.
   * @returns {Object} An object containing arrays for the locCodes and the squred distances.
   */


  getCellDistancesToPoint(x, y, z, locCode) {
    let locCodes = new Array();
    this.traverse(function (points, aabb, code) {
      if (points && points.length > 0 && code != locCode) {
        locCodes.push(code);
      }
    });
    let dists = new Float32Array(locCodes.length);

    for (var i = 0; i < locCodes.length; i++) {
      dists[i] = this.aabbs[locCodes[i]].distanceToPointSq(x, y, z);
    }

    return {
      locCodes: locCodes,
      distancesSq: dists
    };
  }
  /**
   * Expands the current neighbourhood around the cell where the point specified by x, y, z is in.
   * @param {number} x - The x-value of the coordinate.
   * @param {number} y - The y-value of the coordinate.
   * @param {number} z - The z-value of the coordinate.
   * @param {number} locCode - The location code of the cell containing the point.
   * @param {Object} cellDistances - The object containing location codes and distances.
   * @returns {number} The number of added location codes.
   */


  expandNeighbourhood(x, y, z, locCode, cellDistances) {
    let locCodes = cellDistances.locCodes;
    let distancesSq = cellDistances.distancesSq;
    let length = locCodes.length;

    for (var i = length - 1; i >= 0; i--) {
      let neighbours = this.getNeighbours(locCodes[i]);

      for (var j = 0; j < neighbours.length; j++) {
        if (neighbours[j] !== locCode && !Utils.arrayContains(locCodes, neighbours[j])) {
          locCodes.push(neighbours[j]);
        }
      }
    } // Update the distances


    let l1 = locCodes.length;
    let l2 = distancesSq.length;

    if (l1 === l2) {
      return;
    }

    let dists = new Float32Array(l1 - l2);

    for (var i = l2, c = 0; i < l1; i++, c++) {
      dists[c] = this.aabbs[locCodes[i]].distanceToPointSq(x, y, z);
    }

    cellDistances.distancesSq = Utils.concatTypedArrays(distancesSq, dists);
    return locCodes.length - length;
  }
  /**
   * Returns a list of the cells neighbouring the cell with the provided locCode and the point specified by x, y and z.
   * @param {number} x - The x-value of the coordinate.
   * @param {number} y - The y-value of the coordinate.
   * @param {number} z - The z-value of the coordinate.
   * @param {number} locCode - The number of the axis-aligned bounding box.
   * @returns {Object} An object containing arrays for the locCodes and the squred distances.
   */


  cellDistancesSq(x, y, z, locCode) {
    let locCodes = this.getNeighbours(locCode);
    let dists = new Float32Array(locCodes.length);

    for (var i = 0; i < locCodes.length; i++) {
      dists[i] = this.aabbs[locCodes[i]].distanceToPointSq(x, y, z);
    }

    return {
      locCodes: locCodes,
      distancesSq: dists
    };
  }
  /**
   * Returns a list of the the squared distances of the points contained in the axis-aligned bounding box to the provided coordinates.
   * @param {number} x - The x-value of the coordinate.
   * @param {number} y - The y-value of the coordinate.
   * @param {number} z - The z-value of the coordinate.
   * @param {number} locCode - The number of the axis-aligned bounding box.
   * @param {Float32Array} positions - The array containing the vertex coordinates.
   * @returns {Object} An object containing arrays for the indices and distances.
   */


  pointDistancesSq(x, y, z, locCode, positions) {
    let points = this.points[locCode];
    let indices = new Uint32Array(points.length);
    let dists = new Float32Array(points.length);

    for (var i = 0; i < points.length; i++) {
      let index = points[i] * 3;
      let x2 = positions[index];
      let y2 = positions[index + 1];
      let z2 = positions[index + 2];
      indices[i] = points[i];
      dists[i] = Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2) + Math.pow(z2 - z, 2);
    }

    return {
      indices: indices,
      distancesSq: dists
    };
  }
  /**
   * Concatenates the two typed arrays a and b and returns a new array. The two arrays have to be of the same type.
   * Due to performance reasons, there is no check whether the types match.
   * @param {Array} a - The first array.
   * @param {Array} b - The second array.
   * @returns {Array} The concatenated array.
   */


  static concatTypedArrays(a, b) {
    let c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }
  /**
   * Merges the two arrays (indices and distancesSq) in the point distances object.
   * @param {Object} a - The first point distances object.
   * @param {Object} b - The second point distances object.
   * @returns {Object} The concatenated point distances object.
   */


  static mergePointDistances(a, b) {
    let newObj = {};
    newObj.indices = Octree.concatTypedArrays(a.indices, b.indices);
    newObj.distancesSq = Octree.concatTypedArrays(a.distancesSq, b.distancesSq);
    return newObj;
  }
  /**
   * Merges the two arrays (locCodes and distancesSq) in the cell distances object.
   * @param {Object} a - The first cell distances object.
   * @param {Object} b - The second cell distances object.
   * @returns {Object} The concatenated cell distances object.
   */


  static mergeCellDistances(a, b) {
    let newObj = {};
    newObj.locCodes = Octree.concatTypedArrays(a.locCodes, b.locCodes);
    newObj.distancesSq = Octree.concatTypedArrays(a.distancesSq, b.distancesSq);
    return newObj;
  }
  /**
   * Clones an octree.
   * @param {Octree} original - The octree to be cloned.
   * @returns {Octree} The cloned octree.
   */


  static clone(original) {
    let clone = new Octree();
    clone.threshold = original.threshold;
    clone.maxDepth = original.maxDepth;
    clone.points = original.points;

    for (var property in original.aabbs) {
      if (original.aabbs.hasOwnProperty(property)) {
        clone.aabbs[property] = AABB.clone(original.aabbs[property]);
      }
    }

    return clone;
  }

}

module.exports = Octree;

},{"../Math/RadixSort":41,"../Math/Vector3f":45,"../Utils/Utils":62,"./AABB":58,"./Raycaster":60}],60:[function(require,module,exports){
"use strict";

//@ts-check
const Ray = require('../Math/Ray');

const Matrix4f = require('../Math/Matrix4f');
/** A class representing a raycaster. */


class Raycaster {
  /**
   * Creates an instance of Raycaster.
   * 
   * @param {Number} [threshold=0.1] Data to be sent to the listening functions.
   */
  constructor(threshold = 0.1) {
    this.ray = new Ray();
    this.near = 0;
    this.far = 1000;
    this.threshold = threshold;
  }
  /**
   * Set the raycaster based on a camera and the current mouse coordinates.
   * 
   * @param {CameraBase} camera A camera object which extends Lore.CameraBase.
   * @param {number} mouseX The x coordinate of the mouse.
   * @param {number} mouseY The y coordinate of the mouse.
   * @returns {Raycaster} Itself.
   */


  set(camera, mouseX, mouseY) {
    this.near = camera.near;
    this.far = camera.far;
    this.ray.source.set(mouseX, mouseY, (camera.near + camera.far) / (camera.near - camera.far));
    Matrix4f.unprojectVector(this.ray.source, camera);
    this.ray.direction.set(0.0, 0.0, -1.0);
    this.ray.direction.toDirection(camera.modelMatrix);
    return this;
  }

}

module.exports = Raycaster;

},{"../Math/Matrix4f":38,"../Math/Ray":42}],61:[function(require,module,exports){
"use strict";

const AABB = require('./AABB');

const Octree = require('./Octree');

const Raycaster = require('./Raycaster');

module.exports = {
  AABB,
  Octree,
  Raycaster
};

},{"./AABB":58,"./Octree":59,"./Raycaster":60}],62:[function(require,module,exports){
"use strict";

//@ts-check

/** A utility class containing static methods. */
class Utils {
  /**
   * Merges two objects, overriding probierties set in both objects in the first one.
   * 
   * @returns {object} The merged object.
   */
  static extend() {
    let extended = {};
    let deep = false;
    let i = 0;
    let length = arguments.length;

    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0];
      i++;
    }

    let merge = function (obj) {
      for (let prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = Utils.extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    for (; i < length; i++) {
      let obj = arguments[i];
      merge(obj);
    }

    return extended;
  }
  /**
   * Checks whether or not an array contains a given value.
   * 
   * @param {Array} array An array.
   * @param {object} value An object.
   * @returns {boolean} A boolean whether or not the array contains the value.
   */


  static arrayContains(array, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === value) {
        return true;
      }
    }

    return false;
  }
  /**
   * Concatinate two typed arrays.
   * 
   * @param {Array|Float32Array} arrA A typed array.
   * @param {Array|Float32Array} arrB A typed array.
   * @returns {Array|Float32Array} The concatinated typed array.
   */


  static concatTypedArrays(arrA, arrB) {
    let arrC = new arrA.constructor(arrA.length + arrB.length);
    arrC.set(arrA);
    arrC.set(arrB, arrA.length);
    return arrC;
  }

  /**
   * Get the most significant bit (MSB) of a number.
   * 
   * @param {Number} n A number. 
   * @returns {Number} The most significant bit (0 or 1).
   */
  static msb(n) {
    return n & 0x80000000 ? 31 : Utils.msb(n << 1 | 1) - 1;
  }
  /**
   *  An utility method to merge two point distance objects containing arrays of indices and squared distances.
   * 
   * @static
   * @param {object} a An object in the form of { indices: TypedArray, distancesSq: TypedArray }.
   * @param {object} b An object in the form of { indices: TypedArray, distancesSq: TypedArray }.
   * @returns  {object} The object with merged indices and squared distances.
   */


  static mergePointDistances(a, b) {
    let newObj = {};
    newObj.indices = Utils.concatTypedArrays(a.indices, b.indices);
    newObj.distancesSq = Utils.concatTypedArrays(a.distancesSq, b.distancesSq);
    return newObj;
  }
  /**
   * Checks whether or not the number is an integer.
   * 
   * @param {number} n A number.
   * @returns A boolean whether or not the number is an integer.
   */


  static isInt(n) {
    return Number(n) === n && n % 1 === 0;
  }
  /**
   * Checks whether or not the number is a float.
   * 
   * @param {number} n A number.
   * @returns A boolean whether or not the number is a float.
   */


  static isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }
  /**
   * A helper method enabling JSONP requests to an url.
   * 
   * @param {String} url An url.
   * @param {Function} callback The callback to be called when the data is loaded.
   */


  static jsonp(url, callback) {
    let callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

    window[callbackName] = function (response) {
      delete window[callbackName];
      document.body.removeChild(script);
      callback(response);
    };

    let script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
  }

}

Utils.DEG2RAD = Math.PI / 180.0;
module.exports = Utils;

},{}],63:[function(require,module,exports){
"use strict";

const Utils = require('./Utils');

module.exports = {
  Utils
};

},{"./Utils":62}]},{},[1])

