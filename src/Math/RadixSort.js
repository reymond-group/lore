function RadixSort() {
    this.max = undefined;
    this.mask = undefined;
    this.histograms = undefined;
    this.indices = undefined;
    this.tmpIndices = undefined;
}

RadixSort.prototype.sort = function(arr, copyArray) {
    var array = null;
    if(copyArray) {
        array = new arr.constructor(arr.length);
        array.set(arr);
    }
    else {
        array = arr;
    }

    this.max = 1 << 11; // = 2^11 = 2048 = 0x00000800
    this.mask = this.max - 1; // = 2047 = 0x000007FF
    this.histograms = new Int32Array(this.max * Math.ceil(64 / 11));

    var input = new Int32Array(array.buffer, array.byteOffset, array.byteLength >> 2);

    var nPasses = Math.ceil(array.BYTES_PER_ELEMENT * 8 / 11);
    var maxOffset = this.max * (nPasses - 1);
    var msbMask = 1 << ((array.BYTES_PER_ELEMENT * 8 - 1) % 11);
    var lastMask = (msbMask << 1) - 1;
    var tmp = null;

    var aux = new input.constructor(input.length);

    // In order to keep track of the indices
    this.indices = new Uint32Array(input.length);
    this.tmpIndices = new Uint32Array(input.length);
    var normIndices = new Uint32Array(input.length);


    var n = this.max * nPasses;
    for (var i = 0; i < n; i++) this.histograms[i] = 0;

    // Create the histogram
    this.initHistograms(input, maxOffset, lastMask);

    // Create the offset table
    for (var i = 0; i <= maxOffset; i += this.max) {
        var sum = 0;
        for (var j = i; j < i + this.max; j++) {
            var tmpSum = this.histograms[j] + sum;
            this.histograms[j] = sum - 1;
            sum = tmpSum;
        }
    }

    // Sort by least significant byte
    this.lsbPass(input, aux);
    tmp = aux;
    aux = input;
    input = tmp;

    this.pass(input, aux);
    tmp = aux;
    aux = input;
    input = tmp;

    // Sort by most significant byte
    this.msbPass(input, aux, msbMask);

    // This part is not needed, why was it still in???

    // "Normalize" the indices, since they are split up just like the floats
    // so 0, 1 -> 0, 2, 3 -> 2, etc.
    // use multiplications not divisions for the second index -> speeeeed
    // Also, invert it
    // for(var i = 0; i < normIndices.length; i++) {
    // 	normIndices[normIndices.length - i] = this.indices[i];
    // }

    return {
        array: new Float32Array(aux.buffer, aux.byteOffset, array.length),
        indices: this.indices // instead of normIndices
    };
}

RadixSort.prototype.lsbPass = function(arr, aux) {
    for (var i = 0, n = arr.length; i < n; i++) {
        var val = arr[i];
        var sign = val >> 31;
        val ^= sign | 0x80000000;
        var x = ++this.histograms[val & this.mask];
        this.indices[x] = i;
        aux[x] = val;
    }
}

RadixSort.prototype.pass = function(arr, aux) {
    var n = arr.length;

    for (var i = 0; i < n; i++) {
        var val = arr[i];
        var x = ++this.histograms[this.max + (val >>> 11 & this.mask)];
        this.tmpIndices[x] = this.indices[i];
        aux[x] = val;
    }

    this.indices.set(this.tmpIndices);
}

RadixSort.prototype.msbPass = function(arr, aux, msbMask) {
    var lastMask = (msbMask << 1) - 1;
    var n = arr.length;
    var offset = 2 * this.max;

    for (var i = 0; i < n; i++) {
        var val = arr[i];
        var sign = val >> 31;
        var x = ++this.histograms[offset + (val >>> 22 & lastMask)];
        this.tmpIndices[x] = this.indices[i];
        aux[x] = val ^ (~sign | 0x80000000);
    }

    this.indices.set(this.tmpIndices);
}

RadixSort.prototype.initHistograms = function(arr, maxOffset, lastMask) {
    var n = arr.length;

    for (var i = 0; i < n; i++) {
        var val = arr[i];
        var sign = val >> 31;
        val ^= sign | 0x80000000;

        for (var j = 0, k = 0; j < maxOffset; j += this.max, k += 11) {
            this.histograms[j + (val >>> k & this.mask)]++;
        }

        this.histograms[j + (val >>> k & lastMask)]++;
    }
}
