Lore.CsvFileReader = class CsvFileReader extends Lore.FileReaderBase {
    constructor(elementId, options) {
        super(elementId);

        this.defaults = {
            separator: ',',
            cols: [],
            types: [],
            header: true
        }

        this.opts = Lore.Utils.extend(true, this.defaults, options);
        this.columns = {};
        this.headers = [];
        this.types = this.opts.types;
        this.cols = this.opts.cols;
    }

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
            if (this.types.length !== this.cols.length) {
                let values = lines[0].split(this.opts.separator);
                
                this.types = [];

                for (let i = 0; i < values.length; i++) {
                    this.types.push('Float32Array');
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

            for (let j = 0; j < this.cols.length; j++) {
                this.headers[j] = headerNames[this.cols[j]];
            }
        } else {
            for (let j = 0; j < this.cols.length; j++) {
                this.headers[j] = j;
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
                    this.createArray(this.headers[j], this.opts.types[j], length - h);
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

    createArray(index, type, length) {
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
