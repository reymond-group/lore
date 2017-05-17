/** An abstract class representing the base for controls implementations. */
Lore.ControlsBase = class ControlsBase {

    /**
     * Creates an instance of ControlsBase.
     * @param {Renderer} renderer An instance of a Lore renderer.
     * @param {boolean} [lookAt=new Lore.Vector3f()] The look at vector of the controls.
     * @param {boolean} [enableVR=false] Whether or not to track phone spatial information using the WebVR API.
     */
    constructor(renderer, lookAt = new Lore.Vector3f(), enableVR = false) {
        this.renderer = renderer;
        this.camera = renderer.camera;
        this.canvas = renderer.canvas;
        this.lowFps = 15;
        this.highFps = 30;
        this.eventListeners = {};
        this.renderer.setMaxFps(this.lowFps);
        this.touchMode = 'drag';
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
            touches: 0
        };

        this.keyboard = {
            alt: false,
            ctrl: false,
            shift: false
        };

        this.VR = {};

        let that = this;
        this.canvas.addEventListener('mousemove', function (e) {
            if (that.mouse.previousPosition.x !== null && that.mouse.state.left ||
                that.mouse.state.middle ||
                that.mouse.state.right) {
                that.mouse.delta.x = e.pageX - that.mouse.previousPosition.x;
                that.mouse.delta.y = e.pageY - that.mouse.previousPosition.y;

                that.mouse.position.x += 0.01 * that.mouse.delta.x;
                that.mouse.position.y += 0.01 * that.mouse.delta.y;

                // Give priority to left, then middle, then right
                if (that.mouse.state.left) {
                    that.raiseEvent('mousedrag', {
                        e: that.mouse.delta,
                        source: 'left'
                    });
                } else if (that.mouse.state.middle) {
                    that.raiseEvent('mousedrag', {
                        e: that.mouse.delta,
                        source: 'middle'
                    });
                } else if (that.mouse.state.right) {
                    that.raiseEvent('mousedrag', {
                        e: that.mouse.delta,
                        source: 'right'
                    });
                }
            }

            // Set normalized mouse position
            let rect = that.canvas.getBoundingClientRect();
            that.mouse.normalizedPosition.x = ((e.clientX - rect.left) / that.canvas.width) * 2 - 1;
            that.mouse.normalizedPosition.y = -((e.clientY - rect.top) / that.canvas.height) * 2 + 1;

            that.raiseEvent('mousemove', {
                e: that
            });

            that.mouse.previousPosition.x = e.pageX;
            that.mouse.previousPosition.y = e.pageY;
        });

        this.canvas.addEventListener('touchstart', function (e) {
            that.mouse.touches++;
            let touch = e.touches[0];
            e.preventDefault();

            that.mouse.touched = true;

            that.renderer.setMaxFps(that.highFps);

            // This is for selecting stuff when touching but not moving

            // Set normalized mouse position
            let rect = that.canvas.getBoundingClientRect();
            that.mouse.normalizedPosition.x = ((touch.clientX - rect.left) / that.canvas.width) * 2 - 1;
            that.mouse.normalizedPosition.y = -((touch.clientY - rect.top) / that.canvas.height) * 2 + 1;

            if (that.touchMode !== 'drag')
                that.raiseEvent('mousemove', {
                    e: that
                });

            that.raiseEvent('mousedown', {
                e: that,
                source: 'touch'
            });
        });

        this.canvas.addEventListener('touchend', function (e) {
            that.mouse.touches--;
            e.preventDefault();

            that.mouse.touched = false;

            // Reset the previous position and delta of the mouse
            that.mouse.previousPosition.x = null;
            that.mouse.previousPosition.y = null;

            that.renderer.setMaxFps(that.lowFps);

            that.raiseEvent('mouseup', {
                e: that,
                source: 'touch'
            });
        });

        this.canvas.addEventListener('touchmove', function (e) {
            let touch = e.touches[0];
            let source = 'left';

            if (that.mouse.touches == 2) source = 'right';

            e.preventDefault();
            console.log(touch.pageX, touch.pageY);
            if (that.mouse.previousPosition.x !== null && that.mouse.touched) {
                that.mouse.delta.x = touch.pageX - that.mouse.previousPosition.x;
                that.mouse.delta.y = touch.pageY - that.mouse.previousPosition.y;

                that.mouse.position.x += 0.01 * that.mouse.delta.x;
                that.mouse.position.y += 0.01 * that.mouse.delta.y;

                if (that.touchMode === 'drag')
                    that.raiseEvent('mousedrag', {
                        e: that.mouse.delta,
                        source: source
                    });
            }

            // Set normalized mouse position
            let rect = that.canvas.getBoundingClientRect();
            that.mouse.normalizedPosition.x = ((touch.clientX - rect.left) / that.canvas.width) * 2 - 1;
            that.mouse.normalizedPosition.y = -((touch.clientY - rect.top) / that.canvas.height) * 2 + 1;

            if (that.touchMode !== 'drag')
                that.raiseEvent('mousemove', {
                    e: that
                });

            that.mouse.previousPosition.x = touch.pageX;
            that.mouse.previousPosition.y = touch.pageY;
        });

        let wheelevent = 'mousewheel';
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) wheelevent = 'DOMMouseScroll';

        this.canvas.addEventListener(wheelevent, function (e) {
            e.preventDefault();

            let delta = 'wheelDelta' in e ? e.wheelDelta : -40 * e.detail;
            that.raiseEvent('mousewheel', {
                e: delta
            });
        });

        this.canvas.addEventListener('keydown', function (e) {
            if (e.which == 16) {
                that.keyboard.shift = true;
            } else if (e.which == 17) {
                that.keyboard.ctrl = true;
            } else if (e.which == 18) {
                that.keyboard.alt = true;
            }

            that.raiseEvent('keydown', {
                e: e.which
            })
        });

        this.canvas.addEventListener('keyup', function (e) {
            if (e.which == 16) {
                that.keyboard.shift = false;
            } else if (e.which == 17) {
                that.keyboard.ctrl = false;
            } else if (e.which == 18) {
                that.keyboard.alt = false;
            }

            that.raiseEvent('keyup', {
                e: e.which
            });
        });

        this.canvas.addEventListener('mousedown', function (e) {
            let btn = e.button;
            let source = 'left';

            // Only handle single button events
            if (btn == 0) {
                that.mouse.state.left = true;
            } else if (btn == 1) {
                that.mouse.state.middle = true;
                source = 'middle';
            } else if (btn == 2) {
                that.mouse.state.right = true;
                source = 'right';
            }

            that.renderer.setMaxFps(that.highFps);

            that.raiseEvent('mousedown', {
                e: that,
                source: source
            });
        });

        this.canvas.addEventListener('click', function (e) {
            let btn = e.button;
            let source = 'left';

            that.raiseEvent('click', {
                e: that,
                source: source
            });
        });

        this.canvas.addEventListener('dblclick', function (e) {
            let btn = e.button;
            let source = 'left';

            that.raiseEvent('dblclick', {
                e: that,
                source: source
            });
        });

        this.canvas.addEventListener('mouseup', function (e) {
            let btn = e.button;
            let source = 'left';

            // Only handle single button events
            if (btn == 0) {
                that.mouse.state.left = false;
            } else if (btn == 1) {
                that.mouse.state.middle = false;
                source = 'middle';
            } else if (btn == 2) {
                that.mouse.state.right = false;
                source = 'right';
            }

            // Reset the previous position and delta of the mouse
            that.mouse.previousPosition.x = null;
            that.mouse.previousPosition.y = null;

            that.renderer.setMaxFps(that.lowFps);

            that.raiseEvent('mouseup', {
                e: that,
                source: source
            });
        });

        this.canvas.addEventListener('mouseleave', function(e) {
            that.mouse.state.left = false;
            that.mouse.state.middle = false;
            that.mouse.state.right = false;

            that.mouse.previousPosition.x = null;
            that.mouse.previousPosition.y = null;

            that.renderer.setMaxFps(that.lowFps);

            that.raiseEvent('mouseleave', {
                e: that,
                source: that.canvas
            });
        });


    }

    /**
     * Initialiizes WebVR, if the API is available and the device suppports it.
     * 
     */
    initWebVR() {
        if (navigator.getVRDevices) {
            navigator.getVRDisplays().then(function (displays) {
                if (displays.length === 0) {
                    return;
                }
                
                for (var i = 0; i < displays.length; ++i) {
                    
                }
            });
        }
    }

    /**
     * Adds an event listener to this controls instance.
     * 
     * @param {String} eventName The name of the event that is to be listened for.
     * @param {Function} callback A callback function to be called on the event being fired.
     */
    addEventListener(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }

        this.eventListeners[eventName].push(callback);
    }

    /**
     * Raises an event.
     * 
     * @param {any} eventName The name of the event to be raised.
     * @param {any} data The data to be supplied to the callback function.
     */
    raiseEvent(eventName, data) {
        if (this.eventListeners[eventName]) {
            for (let i = 0; i < this.eventListeners[eventName].length; i++) {
                this.eventListeners[eventName][i](data);
            }
        }
    }

    /**
     * Returns the current look at vector associated with this controls.
     * 
     * @returns {Lore.Vector3f} The current look at vector.
     */
    getLookAt() {
        return this.lookAt;
    }

    /**
     * Sets the lookat vector, which is the center of the orbital camera sphere.
     * 
     * @param {Vector3f} lookAt The lookat vector.
     * @returns {OrbitalControls} Returns itself.
     */
    setLookAt(lookAt) {
        //this.camera.position = new Lore.Vector3f(this.radius, this.radius, this.radius);
        this.lookAt = lookAt.clone();
        this.update();
        
        return this;
    }

    /**
     * Update the camera (on mouse move, touch drag, mousewheel scroll, ...).
     * 
     * @param {any} e A mouse or touch events data.
     * @param {String} source The source of the input ('left', 'middle', 'right', 'wheel', ...).
     * @returns {Lore.ControlsBase} Returns itself.
     */
    update(e, source) {
        return this;
    }
}
