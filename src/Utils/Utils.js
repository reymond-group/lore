Lore.Utils = class Utils {
    static extend() {
        let extended = {};
        let deep = false;
        let i = 0;
        let length = arguments.length;

        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }

        let merge = function (obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = Lore.Utils.extend(true, extended[prop], obj[prop]);
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        for ( ; i < length; i++) {
            let obj = arguments[i];
            merge(obj);
        }

        return extended;
    }

    static arrayContains(array, value) {
        for(let i = 0; i < array.length; i++) {
            if(array[i] === value) {
                return true;
            }
        }

        return false;
    }

    static concatTypedArrays(a, b) {
        let c = new a.constructor(a.length + b.length);
        
        c.set(a);
        c.set(b, a.length);

        return c;
    };

    static msb(n) {
        return (n & 0x80000000) ? 31 : Lore.Utils.msb((n << 1) | 1) - 1;
    }

    static mergePointDistances(a, b) {
        let newObj = {};

        newObj.indices = Lore.Utils.concatTypedArrays(a.indices, b.indices);
        newObj.distancesSq = Lore.Utils.concatTypedArrays(a.distancesSq, b.distancesSq);
        
        return newObj;
    }
}
