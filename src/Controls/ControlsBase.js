Lore.ControlsBase = class ControlsBase {

    constructor(renderer) {
        this.renderer = renderer;
        this.canvas = renderer.canvas;
        this.lowFps = 15;
        this.highFps = 30;
        this.eventListeners = {};
        this.renderer.setMaxFps(this.lowFps);
        this.touchMode = 'drag';

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
        }

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
    }

    addEventListener(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }

        this.eventListeners[eventName].push(callback);
    }

    raiseEvent(eventName, data) {
        if (!this.eventListeners[eventName]) {
            return;
        }

        for (let i = 0; i < this.eventListeners[eventName].length; i++) {
            this.eventListeners[eventName][i](data);
        }
    }
}
