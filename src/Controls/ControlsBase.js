Lore.ControlsBase = function(renderer) {
    this.canvas = renderer.canvas;
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
        }
    };

    this.keyboard = {
        alt: false,
        ctrl: false,
        shift: false
    }

    this.mousemove = function(e) {};
    this.mouseup = function(e, source) {};
    this.mousedown = function(e, source) {};
    this.mousedrag = function(e, source) {};

    var that = this;
    this.canvas.addEventListener('mousemove', function(e) {
        if (that.mouse.previousPosition.x !== null && that.mouse.state.left) {
            that.mouse.delta.x = e.pageX - that.mouse.previousPosition.x;
            that.mouse.delta.y = e.pageY - that.mouse.previousPosition.y;

            that.mouse.position.x += 0.01 * that.mouse.delta.x;
            that.mouse.position.y += 0.01 * that.mouse.delta.y;

            that.mousemove(that.mouse.delta);

            // Give priority to left, then middle, then right
            if (that.mouse.state.left) {
                that.mousedrag(that.mouse.delta, 'left');
            } else if (that.mouse.state.middle) {
                that.mousedrag(that.mouse.delta, 'middle');
            } else if (that.mouse.state.right) {
                that.mousedrag(that.mouse.delta, 'right');
            }
        }

        that.mouse.previousPosition.x = e.pageX;
        that.mouse.previousPosition.y = e.pageY;
    });

    this.canvas.addEventListener('keydown', function(e) {
        if (e.which == 16) {
            that.keyboard.shift = true;
        } else if (e.which == 17) {
            that.keyboard.ctrl = true;
        } else if (e.which == 18) {
            that.keyboard.alt = true;
        }
    });

    this.canvas.addEventListener('keyup', function(e) {
        if (e.which == 16) {
            that.keyboard.shift = false;
        } else if (e.which == 17) {
            that.keyboard.ctrl = false;
        } else if (e.which == 18) {
            that.keyboard.alt = false;
        }
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

        that.mousedown(that, source);
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

        that.mouseup(that, source);
    });
}

Lore.ControlsBase.prototype = {
    constructor: Lore.ControlsBase,
}
