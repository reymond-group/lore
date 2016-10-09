Lore.ControlsBase = function(renderer) {
    this.canvas = renderer.canvas;
    this.eventListeners = {};
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
        }
    };

    this.keyboard = {
        alt: false,
        ctrl: false,
        shift: false
    }

    var that = this;
    this.canvas.addEventListener('mousemove', function(e) {
        if (that.mouse.previousPosition.x !== null && that.mouse.state.left
                                                      || that.mouse.state.middle
                                                      || that.mouse.state.right) {
            that.mouse.delta.x = e.pageX - that.mouse.previousPosition.x;
            that.mouse.delta.y = e.pageY - that.mouse.previousPosition.y;

            that.mouse.position.x += 0.01 * that.mouse.delta.x;
            that.mouse.position.y += 0.01 * that.mouse.delta.y;

            that.raiseEvent('mousemove', { e: that.mouse.delta });
            // Give priority to left, then middle, then right
            if (that.mouse.state.left) {
                that.raiseEvent('mousedrag', { e: that.mouse.delta, source: 'left' });
            } else if (that.mouse.state.middle) {
                that.raiseEvent('mousedrag', { e: that.mouse.delta, source: 'middle' });
            } else if (that.mouse.state.right) {
                that.raiseEvent('mousedrag', { e: that.mouse.delta, source: 'right' });
            }
        }

        that.mouse.previousPosition.x = e.pageX;
        that.mouse.previousPosition.y = e.pageY;
    });

    var wheelevent = 'mousewheel';
    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) wheelevent = 'DOMMouseScroll';

    this.canvas.addEventListener(wheelevent, function(e) {
        that.raiseEvent('mousewheel', { e: e.wheelDelta });
    });

    this.canvas.addEventListener('keydown', function(e) {
        if (e.which == 16) {
            that.keyboard.shift = true;
        } else if (e.which == 17) {
            that.keyboard.ctrl = true;
        } else if (e.which == 18) {
            that.keyboard.alt = true;
        }

        that.raiseEvent('keydown', { e: e.which })
    });

    this.canvas.addEventListener('keyup', function(e) {
        if (e.which == 16) {
            that.keyboard.shift = false;
        } else if (e.which == 17) {
            that.keyboard.ctrl = false;
        } else if (e.which == 18) {
            that.keyboard.alt = false;
        }

        that.raiseEvent('keyup', { e: e.which });
    });

    this.canvas.addEventListener('mousedown', function(e) {
        var btn = e.button;
        var source = 'left';

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

        // Set normalized mouse position
        var rect = that.canvas.getBoundingClientRect();
        that.mouse.normalizedPosition.x =  ((e.clientX - rect.left) / that.canvas.width) * 2 - 1;
        that.mouse.normalizedPosition.y = -((e.clientY - rect.top) / that.canvas.height) * 2 + 1;

        that.raiseEvent('mousedown', { e: that, source: source });
    });

    this.canvas.addEventListener('mouseup', function(e) {
        var btn = e.button;
        var source = 'left';

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

        that.raiseEvent('mouseup', { e: that, source: source });
    });
}

Lore.ControlsBase.prototype = {
    constructor: Lore.ControlsBase,

    addEventListener: function(eventName, callback) {
        if(!this.eventListeners[eventName]) this.eventListeners[eventName] = [];
        this.eventListeners[eventName].push(callback);
    },

    raiseEvent: function(eventName, data) {
        if(!this.eventListeners[eventName]) return;

        for(var i = 0; i < this.eventListeners[eventName].length; i++)
            this.eventListeners[eventName][i](data);
    }
}
