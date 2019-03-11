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
        }

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
                throw 'Types and cols must have the same number of elements.'
            }
        } else {
            if (this.types.length !== this.cols.length || this.types.length + this.cols.length === 0) {
                let values = lines[h].split(this.opts.separator);
                
                this.types = [];
                for (let i = 0; i < values.length; i++) {
                    if(Utils.isFloat(parseFloat(values[i], 10))) {
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

            if (this.cols.length == 0)
                for (let j = 0; j < values.length; j++) {
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

module.exports = CsvFileReader