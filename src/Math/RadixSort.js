class RadixSort {
    constructor() {
        this.max = undefined;
        this.mask = undefined;
        this.histograms = undefined;
        this.indices = undefined;
        this.tmpIndices = undefined;
    }

    sort(arr, copyArray) {
        let array = null;

        if (copyArray) {
            array = new arr.constructor(arr.length);
            array.set(arr);
        } else {
            array = arr;
        }

        this.max = 1 << 11; // = 2^11 = 2048 = 0x00000800
        this.mask = this.max - 1; // = 2047 = 0x000007FF
        this.histograms = new Int32Array(this.max * Math.ceil(64 / 11));

        let input = new Int32Array(array.buffer, array.byteOffset, array.byteLength >> 2);
        let nPasses = Math.ceil(array.BYTES_PER_ELEMENT * 8 / 11);
        let maxOffset = this.max * (nPasses - 1);
        let msbMask = 1 << ((array.BYTES_PER_ELEMENT * 8 - 1) % 11);
        let lastMask = (msbMask << 1) - 1;
        let tmp = null;
        let aux = new input.constructor(input.length);

        // In order to keep track of the indices
        this.indices = new Uint32Array(input.length);
        this.tmpIndices = new Uint32Array(input.length);

        let normIndices = new Uint32Array(input.length);
        let n = this.max * nPasses;

        for (let i = 0; i < n; i++) {
            this.histograms[i] = 0;
        }

        // Create the histogram
        this.initHistograms(input, maxOffset, lastMask);

        // Create the offset table
        for (let i = 0; i <= maxOffset; i += this.max) {
            let sum = 0;

            for (let j = i; j < i + this.max; j++) {
                let tmpSum = this.histograms[j] + sum;

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
        // for(let i = 0; i < normIndices.length; i++) {
        // 	normIndices[normIndices.length - i] = this.indices[i];
        // }

        return {
            array: new Float32Array(aux.buffer, aux.byteOffset, array.length),
            indices: this.indices // instead of normIndices
        };
    }

    lsbPass(arr, aux) {
        for (let i = 0, n = arr.length; i < n; i++) {
            let val = arr[i];
            let sign = val >> 31;

            val ^= sign | 0x80000000;

            let x = ++this.histograms[val & this.mask];

            this.indices[x] = i;
            aux[x] = val;
        }
    }

    pass(arr, aux) {
        let n = arr.length;

        for (let i = 0; i < n; i++) {
            let val = arr[i];
            let x = ++this.histograms[this.max + (val >>> 11 & this.mask)];

            this.tmpIndices[x] = this.indices[i];
            aux[x] = val;
        }

        this.indices.set(this.tmpIndices);
    }

    msbPass(arr, aux, msbMask) {
        let lastMask = (msbMask << 1) - 1;
        let n = arr.length;
        let offset = 2 * this.max;

        for (let i = 0; i < n; i++) {
            let val = arr[i];
            let sign = val >> 31;
            let x = ++this.histograms[offset + (val >>> 22 & lastMask)];

            this.tmpIndices[x] = this.indices[i];
            aux[x] = val ^ (~sign | 0x80000000);
        }

        this.indices.set(this.tmpIndices);
    }

    initHistograms(arr, maxOffset, lastMask) {
        let n = arr.length;

        for (let i = 0; i < n; i++) {
            let val = arr[i];
            let sign = val >> 31;

            val ^= sign | 0x80000000;

            for (let j = 0, k = 0; j < maxOffset; j += this.max, k += 11) {
                this.histograms[j + (val >>> k & this.mask)]++;
            }

            this.histograms[j + (val >>> k & lastMask)]++;
        }
    }
}
