Lore.UI = function(renderCanvas) {
    this.canvas = document.createElement('canvas');
    this.renderCanvasElement = document.getElementById(renderCanvas);

    this.init();
    this.resize();
}

Lore.UI.prototype = {
    constructor: Lore.UI,

    init: function() {
        this.canvas.style.cssText = 'position: absolute; pointer-events: none;';

        // Append the UI canvas before the render canvas
        this.renderCanvasElement.parentNode.insertBefore(this.canvas, this.renderCanvasElement);
    },

    setWidth: function(value) {
        this.canvas.width = value;
    },

    setHeight: function(value) {
        this.canvas.height = value;
    },

    setTop: function(value) {
        this.canvas.style.top = value;
    },

    setLeft: function(value) {
        this.canvas.style.left = value;
    },

    resize: function() {
        this.setWidth(this.renderCanvasElement.width);
        this.setHeight(this.renderCanvasElement.height);
        this.setTop(this.renderCanvasElement.offsetTop);
        this.setLeft(this.renderCanvasElement.offsetLeft);
    }
}
