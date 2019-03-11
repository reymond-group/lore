//@ts-check

/** A helper class containing statistics methods. */
class Statistics {
    /**
     * Transposes an array of arrays (2d array).
     
     * @param {Array} arr The 2d array to be transposed.
     * @returns {Array} The transpose of the 2d array.
     */
    static transpose2dArray(arr) {
      return arr[0].map((col, i) => arr.map(row => row[i]));
    }

    /**
     * Returns a normally distributed (pseudo) random number.
     * 
     * @returns {Number} A normally distributed (pseudo) random number.
     */
    static randomNormal() {
        let val, u, v, s, mul;

        if (Statistics.spareRandomNormal !== null) {
            val = Statistics.spareRandomNormal;
            Statistics.spareRandomNormal = null;
        } else {
            do {
                u = Math.random() * 2 - 1;
                v = Math.random() * 2 - 1;

                s = u * u + v * v;
            } while (s === 0 || s >= 1);

            mul = Math.sqrt(-2 * Math.log(s) / s);
            val = u * mul;
            Statistics.spareRandomNormal = v * mul;
        }

        return val / 14;
    }

    /**
     * Returns a normally distributed (pseudo) random number within a range.
     * 
     * @param {Number} a The start of the range.
     * @param {Number} b The end of the range.
     * @returns {Number} A normally distributed (pseudo) random number within a range.
     */
    static randomNormalInRange(a, b) {
        let val;

        do {
            val = Statistics.randomNormal();
        } while (val < a || val > b);

        return val;
    }

    /**
     * Returns a normally distributed (pseudo) random number around a mean with a standard deviation.
     * 
     * @param {Number} mean The mean.
     * @param {Number} sd The standard deviation.
     * @returns {Number} A normally distributed (pseudo) random number around a mean with a standard deviation.
     */
    static randomNormalScaled(mean, sd) {
        let r = Statistics.randomNormalInRange(-1, 1);
        
        return r * sd + mean;
    }

    /**
     * Normalize / scale an array between 0 and 1.
     * 
     * @param {Number[]} arr An array.
     * @returns {Number[]} The normalized / scaled array.
     */
    static normalize(arr) {
        let newArr = arr.slice();
        let max = Number.NEGATIVE_INFINITY;
        let min = Number.POSITIVE_INFINITY;

        for (let i = 0; i < newArr.length; i++) {
            let val = newArr[i];
            if (val > max) max = val;
            if (val < min) min = val;
        }

        let diff = max - min;

        for (let i = 0; i < newArr.length; i++) {
            newArr[i] = (newArr[i] - min) / diff;
        }
        
        return newArr;
    }

    /**
     * Normalize / scale an array between 0 and 1 (outliers will be set to max or min respectively).
     * The IQR method is used for outlier detection.
     * 
     * @param {Number[]} arr An array.
     * @param {Number} q1 The q1 percentage.
     * @param {Number} q3 The q3 percentage.
     * @param {Number} k The IQR scaling factor.
     * @returns {Number[]} The normalized / scaled array.
     */
    static normalizeNoOutliers(arr, q1 = 0.25, q3 = 0.75, k = 1.5) {
        let newArr = arr.slice();

        newArr.sort((a, b) => a - b);

        let a = Statistics.getPercentile(newArr, q1);
        let b = Statistics.getPercentile(newArr, q3);
        let iqr = b - a;
        let lower = a - (iqr * k);
        let upper = b + (iqr * k);
        
        let diff = upper - lower;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < lower) {
                newArr[i] = 0.0;
            } else if (arr[i] > upper) {
                newArr[i] = 1.0;
            } else {
                newArr[i] = (arr[i] - lower) / diff;
            }
        }
        
        return newArr;
    }

    /**
     * Gets the percentile from a sorted array.
     * 
     * @param {Number[]} arr A sorted array.
     * @param {Number} percentile The percentile (e.g. 0.25).
     * @returns {Number} The percentile value.
     */
    static getPercentile(arr, percentile) {
        let index = percentile * arr.length;

        if (Math.floor(index) === index) {
            return (arr[index - 1] + arr[index]) / 2.0;
        } else {
            return arr[Math.floor(index)];
        }
    }

    /**
     * Scales a number to within a given scale.
     * 
     * @param {Number} value The number.
     * @param {Number} oldMin The current minimum.
     * @param {Number} oldMax The current maximum.
     * @param {Number} newMin The cnew minimum.
     * @param {Number} newMax The new maximum.
     * @returns {Number} The scaled number.
     */
    static scale(value, oldMin, oldMax, newMin, newMax) {
        return (newMax - newMin) * (value - oldMin) / (oldMax - oldMin) + newMin;
    }
}

Statistics.spareRandomNormal = null;

module.exports = Statistics
