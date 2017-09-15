/** A helper class containing statistics methods. */
Lore.Statistics = class Statistics {
    /**
     * Returns a normally distributed (pseudo) random number.
     * 
     * @returns {Number} A normally distributed (pseudo) random number.
     */
    static randomNormal() {
        let val, u, v, s, mul;

        if (Lore.Statistics.spareRandomNormal !== null) {
            val = Lore.Statistics.spareRandomNormal;
            Lore.Statistics.spareRandomNormal = null;
        } else {
            do {
                u = Math.random() * 2 - 1;
                v = Math.random() * 2 - 1;

                s = u * u + v * v;
            } while (s === 0 || s >= 1);

            mul = Math.sqrt(-2 * Math.log(s) / s);
            val = u * mul;
            Lore.Statistics.spareRandomNormal = v * mul;
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
            val = Lore.Statistics.randomNormal();
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
        let r = Lore.Statistics.randomNormalInRange(-1, 1);
        
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

Lore.Statistics.spareRandomNormal = null;
