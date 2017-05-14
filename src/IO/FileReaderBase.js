Lore.FileReaderBase = class FileReaderBase {

    constructor(elementId) {
        this.elementId = elementId;
        this.element = document.getElementById(this.elementId);
        this.eventListeners = {};
        
        let that = this;

        this.element.addEventListener('click', function() {
            this.value = null;
        });

        this.element.addEventListener('change', function() {
            let fileReader = new FileReader();

            fileReader.onload = function() {
                that.loaded(fileReader.result);
            }

            fileReader.readAsBinaryString(this.files[0]);
        });
    }

    addEventListener(eventName, callback) {
        if(!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }

        this.eventListeners[eventName].push(callback);
    }

    raiseEvent(eventName, data) {
        if(!this.eventListeners[eventName]) {
            return;
        }

        for(let i = 0; i < this.eventListeners[eventName].length; i++) {
            this.eventListeners[eventName][i](data);
        }
    }

    loaded(data) {

    }
}
