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
  constructor(
    renderer,
    lookAt = new Vector3f(0.0, 0.0, 0.0),
    enableVR = false
  ) {
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
      state: {
        left: false,
        middle: false,
        right: false
      },
      normalizedPosition: {
        x: 0.0,
        y: 0.0
      },
      moved: false,
      touches: 0,
      pointerCache: [],
      pinchDiff: 0
    };

    this.keyboard = {
      alt: false,
      ctrl: false,
      shift: false
    };

    this.VR = {};

    let that = this;

    // Set the touch action of the canvas
    this.canvas.style.touchAction = 'none';

    this.canvas.addEventListener("pointermove", function(e) {
      // Find this event in the cache and update its record with this event
      for (var i = 0; i < that.mouse.pointerCache.length; i++) {
        if (e.pointerId == that.mouse.pointerCache[i].pointerId) {
          that.mouse.pointerCache[i] = e;
          break;
        }
      }
      
      // Get the current average / center of mass pointer location
      let pointerLoc = that.getPointerLocation();
      
      // Handle touch gestures and mouse events
      // If there are two pointer events, it has to be touch
      if (that.mouse.pointerCache.length === 2) {
        var diff = Math.pow(that.mouse.pointerCache[1].clientX - that.mouse.pointerCache[0].clientX, 2) +
                   Math.pow(that.mouse.pointerCache[1].clientY - that.mouse.pointerCache[0].clientY, 2);

        if (that.mouse.pinchDiff > 0) {
          if (diff > that.mouse.pinchDiff) {
            that.raiseEvent("touch", {
              e: { x: -1, y: -1, speed: 0.5 },
              source: "pinch"
            });
          }
          else if (diff < that.mouse.pinchDiff) {
            that.raiseEvent("touch", {
              e: { x: 1, y: 1, speed: 0.5 },
              source: "pinch"
            });
          }
        }

        that.mouse.pinchDiff = diff;
      } else if (that.mouse.previousPosition.x !== null && that.mouse.pointerCache.length === 3) {
        that.mouse.delta.x = pointerLoc[0] - that.mouse.previousPosition.x;
        that.mouse.delta.y = pointerLoc[1] - that.mouse.previousPosition.y;

        that.mouse.moved = true;

        that.raiseEvent("mousedrag", {
          e: that.mouse.delta,
          source: "right"
        });
      } else if (
        that.mouse.previousPosition.x !== null && (that.mouse.state.left ||
        that.mouse.state.middle ||
        that.mouse.state.right)
      ) {
        that.mouse.delta.x = pointerLoc[0] - that.mouse.previousPosition.x;
        that.mouse.delta.y = pointerLoc[1] - that.mouse.previousPosition.y;

        that.mouse.moved = true;

        // Give priority to left, then middle, then right
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
      }

      // Set normalized mouse position
      let rect = that.canvas.getBoundingClientRect();
      let s = that.renderer.devicePixelRatio;
      that.mouse.normalizedPosition.x =
        ((e.clientX - rect.left * s) / that.canvas.width) * s * 2 - 1;
      that.mouse.normalizedPosition.y =
        -(((e.clientY - rect.top * s) / that.canvas.height) * s) * 2 + 1;
        
      that.raiseEvent("mousemove", {
        e: that
      });

      that.mouse.previousPosition.x = pointerLoc[0];
      that.mouse.previousPosition.y = pointerLoc[1];
    });

    let wheelevent = "mousewheel";
    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1)
      wheelevent = "DOMMouseScroll";

    this.canvas.addEventListener(wheelevent, function(e) {
      if (that.isInIframe() && !e.ctrlKey) {
        return;
      }

      e.preventDefault();

      let delta = "wheelDelta" in e ? e.wheelDelta : -40 * e.detail;
      that.raiseEvent("mousewheel", {
        e: delta
      });
    });

    this.canvas.addEventListener("keydown", function(e) {
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

    this.canvas.addEventListener("keyup", function(e) {
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

    this.canvas.addEventListener("pointerdown", function(e) {
      let btn = e.button;
      let source = "left";
      that.mouse.pointerCache.push(e);

      // Only handle single button events
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
      that.mouse.moved = false;

      that.raiseEvent("mousedown", {
        e: that,
        source: source
      });
    });

    this.canvas.addEventListener("click", function(e) {
      let btn = e.button;
      let source = "left";
      
      if (!that.mouse.moved) {
        that.raiseEvent("click", {
          e: that,
          source: source
        });
      }      
    });

    this.canvas.addEventListener("dblclick", function(e) {
      let btn = e.button;
      let source = "left";

      that.raiseEvent("dblclick", {
        e: that,
        source: source
      });
    });

    // This function is added to multiple pointer events
    let pointerUpEvent = function(e) {
      let btn = e.button;
      let source = "left";
      that.removeEvent(e);
      that.mouse.pinchDiff = 0;

      // Only handle single button events
      if (btn == 0) {
        that.mouse.state.left = false;
      } else if (btn == 1) {
        that.mouse.state.middle = false;
        source = "middle";
      } else if (btn == 2) {
        that.mouse.state.right = false;
        source = "right";
      }

      // Reset the previous position and delta of the mouse
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

    this.canvas.addEventListener("pointerup", function(e) {
      pointerUpEvent(e);
    });

    this.canvas.addEventListener("pointercancel", function(e) {
      pointerUpEvent(e);
    });

    this.canvas.addEventListener("pointerleave", function(e) {
      pointerUpEvent(e);
    });
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
   * Virtual method. Sets the lookat vector, which is the center of the orbital camera sphere.
   *
   * @param {Vector3f} lookAt The lookat vector.
   * @returns {ControlsBase} Returns itself.
   */
  setLookAt(lookAt) {
    return null;
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
   * @param {PointerEvent} e The pointer event
   */
  removeEvent(e) {
    for (var i = 0; i < this.mouse.pointerCache.length; i++) {
      if (this.mouse.pointerCache[i].pointerId == e.pointerId) {
        this.mouse.pointerCache.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Get the position of the pointer (e.g. the mouse). In case of multi-
   * touch, the center of mass is returned.
   * 
   * @returns {Number[]} The pointer position
   */
  getPointerLocation() {
    let x = 0;
    let y = 0;
    let n = this.mouse.pointerCache.length;

    if (n === 0) return [null, null];

    for (var i = 0; i < n; i++) {
      x += this.mouse.pointerCache[i].pageX;
      y += this.mouse.pointerCache[i].pageY;
    }

    return [x, y];
  }
}

module.exports = ControlsBase;
