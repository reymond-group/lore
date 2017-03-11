Lore.Statistics = class Statistics {
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

    static randomNormalInRange(a, b) {
        let val;

        do {
            val = Lore.Statistics.randomNormal();
        } while (val < a || val > b);

        return val;
    }

    static randomNormalScaled(mean, sd) {
        let r = Lore.Statistics.randomNormalInRange(-1, 1);
        
        return r * sd + mean;
    }

    static normalize(arr) {
        let max = Number.MIN_VALUE;
        let min = Number.MAX_VALUE;

        for (let i = 0; i < arr.length; i++) {
            let val = arr[i];
            if (val > max) max = val;
            if (val < min) min = val;
        }

        let diff = max - min;

        for (let i = 0; i < arr.length; i++) {
            arr[i] = (arr[i] - min) / diff;
        }

        return [min, max];
    }

    static scale(value, oldMin, oldMax, newMin, newMax) {
        return (newMax - newMin) * (value - oldMin) / (oldMax - oldMin) + newMin;
    }
}

Lore.Statistics.spareRandomNormal = null;
