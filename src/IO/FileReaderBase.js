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
        } else {
            Utils.jsonp(source, function(response) {
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
        if(!this._eventListeners[eventName]) {
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
        if(!this._eventListeners[eventName]) {
            return;
        }

        for(let i = 0; i < this._eventListeners[eventName].length; i++) {
            this._eventListeners[eventName][i](data);
        }
    }

    /**
     * To be overwritten by inheriting classes.
     * 
     * @param {any} data 
     */
    loaded(data) {

    }
}

module.exports = FileReaderBase