Lore.FileReaderBase = function(elementId) {
    this.elementId = elementId;
    this.element = document.getElementById(this.elementId);
    this.eventListeners = {};
    var that = this;
    this.element.addEventListener('change', function() {
        var fileReader = new FileReader();

        fileReader.onload = function() {
            that.loaded(fileReader.result);
        }

        fileReader.readAsBinaryString(this.files[0]);
    });
}

Lore.FileReaderBase.prototype = {
    constructor: Lore.FileReaderBase,

    addEventListener: function(eventName, callback) {
        if(!this.eventListeners[eventName]) this.eventListeners[eventName] = [];
        this.eventListeners[eventName].push(callback);
    },

    raiseEvent: function(eventName, data) {
        if(!this.eventListeners[eventName]) return;

        for(var i = 0; i < this.eventListeners[eventName].length; i++)
            this.eventListeners[eventName][i](data);
    },

    loaded: function(data) {

    }
}
