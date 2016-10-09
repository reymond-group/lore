Lore.CsvFileReader = function(elementId, options) {
    Lore.FileReaderBase.call(this, elementId);

    this.opts = Lore.Utils.extend(true, Lore.CsvFileReader.defaults, options);
    this.columns = [];
}

Lore.CsvFileReader.prototype = Object.assign(Object.create(Lore.FileReaderBase.prototype), {
    constructor: Lore.CsvFileReader,

    loaded: function(data) {
        data = data.replace('\n\n', '\n');
        data = data.replace(/^\s+|\s+$/g, '');
        var lines = data.split('\n');
        var length = lines.length;
        var init = true;
        var loadCols = this.opts.cols;

        var h = this.opts.header ? 1 : 0;
        for(var i = h; i < length; i++) {
            var values = lines[i].split(this.opts.separator);

            if(loadCols.length == 0)
                for(var j = 0; j < values.length; j++) loadCols.push[j];

            if(init) {
                for(var j = 0; j < loadCols.length; j++) this.createArray(j, this.opts.types[j], length - h);
                init = false;
            }

            for(var j = 0; j < loadCols.length; j++) {
                this.columns[j][i - h] = values[loadCols[j]];
            }
        }

        this.raiseEvent('loaded', this.columns);
    },

    createArray: function(index, type, length) {
        if(type == 'Int8Array')
            this.columns[index] = new Int8Array(length);
        else if(type == 'Uint8Array')
            this.columns[index] = new Uint8Array(length);
        else if(type == 'Uint8ClampedArray')
            this.columns[index] = new Uint8ClampedArray(length);
        else if(type == 'Int16Array')
            this.columns[index] = new Int16Array(length);
        else if(type == 'Uint16Array')
            this.columns[index] = new Uint16Array(length);
        else if(type == 'Int32Array')
            this.columns[index] = new Int32Array(length);
        else if(type == 'Uint32Array')
            this.columns[index] = new Uint32Array(length);
        else if(type == 'Float32Array')
            this.columns[index] = new Float32Array(length);
        else if(type == 'Float64Array')
            this.columns[index] = new Float64Array(length);
        else
            this.columns[index] = new Array(length);
    }
});

Lore.CsvFileReader.defaults = {
    separator: ',',
    cols: [],
    types: [],
    header: true
}
