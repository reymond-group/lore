/** A utility class containing static methods. */
Lore.Utils = class Utils {
    /**
     * Merges two objects, overriding probierties set in both objects in the first one.
     * 
     * @returns {object} The merged object.
     */
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

    /**
     * Checks whether or not an array contains a given value.
     * 
     * @param {Array} array An array.
     * @param {object} value An object.
     * @returns {boolean} A boolean whether or not the array contains the value.
     */
    static arrayContains(array, value) {
        for(let i = 0; i < array.length; i++) {
            if(array[i] === value) {
                return true;
            }
        }

        return false;
    }

    /**
     * Concatinate two typed arrays.
     * 
     * @param {TypedArray} arrA A typed array.
     * @param {TypedArray} arrB A typed array.
     * @returns {TypedArray} The concatinated typed array.
     */
    static concatTypedArrays(arrA, arrB) {
        let arrC = new a.constructor(arrA.length + arrB.length);
        
        arrC.set(arrA);
        arrC.set(arrB, arrA.length);

        return arrC;
    };

    /**
     * Get the most significant bit (MSB) of a number.
     * 
     * @param {Number} n A number. 
     * @returns {Number} The most significant bit (0 or 1).
     */
    static msb(n) {
        return (n & 0x80000000) ? 31 : Lore.Utils.msb((n << 1) | 1) - 1;
    }

    /**
     *  An utility method to merge two point distance objects containing arrays of indices and squared distances.
     * 
     * @static
     * @param {object} a An object in the form of { indices: TypedArray, distancesSq: TypedArray }.
     * @param {object} b An object in the form of { indices: TypedArray, distancesSq: TypedArray }.
     * @returns  {object} The object with merged indices and squared distances.
     */
    static mergePointDistances(a, b) {
        let newObj = {};

        newObj.indices = Lore.Utils.concatTypedArrays(a.indices, b.indices);
        newObj.distancesSq = Lore.Utils.concatTypedArrays(a.distancesSq, b.distancesSq);
        
        return newObj;
    }

    /**
     * Checks whether or not the number is an integer.
     * 
     * @param {number} n A number.
     * @returns A boolean whether or not the number is an integer.
     */
    static isInt(n){
        return Number(n) === n && n % 1 === 0;
    }

    /**
     * Checks whether or not the number is a float.
     * 
     * @param {number} n A number.
     * @returns A boolean whether or not the number is a float.
     */
    static isFloat(n){
        return Number(n) === n && n % 1 !== 0;
    }

    /**
     * A helper method enabling JSONP requests to an url.
     * 
     * @param {String} url An url.
     * @param {Function} callback The callback to be called when the data is loaded.
     */
    static jsonp(url, callback) {
        let callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = function(response) {
            delete window[callbackName];
            document.body.removeChild(script);
            callback(response);
        };

        let script = document.createElement('script');
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(script);
    }
}

Lore.Utils.DEG2RAD = Math.PI / 180.0; 