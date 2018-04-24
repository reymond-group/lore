//@ts-check

const FileReaderBase = require('./FileReaderBase');
const Utils = require('../Utils/Utils');

/** A class representing a matrix file reader. */
class MatrixFileReader extends FileReaderBase {
    /**
     * Creates an instance of MatrixFileReader.
     * @param {String} source The source of the file. This is either a input element (type=file) or a URL. If it is a URL, set local to true.
     * @param {any} options Options. See documentation for details.
     * @param {boolean} [local=true] A boolean indicating whether or not the source is local (a file input) or remote (a url).
     */
    constructor(source, options, local = true) {
        super(source, local);

        this.defaults = {
            elementSeperator: '\t',
            valueSeparator: ';',
            replaceNaNWith: 'NaN',
            skipNaN: true,
            types: []
        }

        this.opts = Utils.extend(true, this.defaults, options);
        this.types = this.opts.types;
        this.columns = {};

        if (this.types.length === 0) {
            throw('When reading data from a file, the types have to be specified.');
        }

        // Add the types for the indices
        this.opts.types.unshift('Int32Array');
        this.opts.types.unshift('Int32Array');
        this.opts.types.unshift('Int32Array');
    }

    /**
     * Called when the data is loaded, will raise the "loaded" event.
     * 
     * @param {any} data The data loaded from the file or url.
     * @returns {MatrixFileReader} Itself.
     */
    loaded(data) {
        data = data.replace('\n\n', '\n');
        data = data.replace(/^\s+|\s+$/g, '');

        if (this.opts.replaceNaNWith !== 'NaN') {
            data = data.replace('NaN', this.opts.replaceNaNWith);
        }

        let lines = data.split('\n');
        let nRows = lines.length;
        let nColumns = lines[0].split(this.opts.elementSeperator).length;
        // Including the indices (x, y, z), therefore + 3
        let nValues = lines[0].split(this.opts.elementSeperator)[0].split(this.opts.valueSeparator).length + 3;
        
        if (this.types.length !== nValues || this.types.length + nValues === 0) {
            let values = lines[0].split(this.opts.valueSeparator);
            
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
        
        for (var i = 0; i < nValues; i++) {
            this._createArray(i, this.types[i], nRows * nColumns);
        }

        let actualLength = 0;

        for (var i = 0; i < nRows; i++) {
            let row = lines[i].split(this.opts.elementSeperator);

            if (row.length === 0) {
                continue;
            }

            for (var j = 0; j < nColumns; j++) {
                if(!row[j]) {
                    continue;
                }
                
                let values = row[j].split(this.opts.valueSeparator);

                if (this.opts.skipNaN) {
                    let skip = false;

                    for (var k = 0; k < values.length; k++) {
                        if (isNaN(values[k])) {
                            skip = true;
                            break;
                        }
                    }

                    if (skip) {
                        continue;
                    }
                }

                this.columns[0][actualLength] = i;
                this.columns[1][actualLength] = j;
                // Set zero for 2D matrix
                this.columns[2][actualLength] = 0;

                for (var k = 0; k < values.length; k++) {
                    this.columns[k + 3][actualLength] = values[k];
                }

                actualLength++;
            }
        }

        this._resizeArrays(actualLength);

        this.raiseEvent('loaded', this.columns);
        
        return this;
    }

    _resizeArrays(length) {
        // Might need polyfill
        for (var i = 0; i < this.columns.length; i++) {
            this.columns[i] = this.columns[i].slice(0, length);
        }
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

module.exports = MatrixFileReader