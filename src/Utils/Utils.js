Lore.Utils = {};

Lore.Utils.extend = function () {
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0];
        i++;
    }

    var merge = function (obj) {
        for (var prop in obj) {
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
        var obj = arguments[i];
        merge(obj);
    }

    return extended;
};

Lore.Utils.arrayContains = function(array, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i] === value) return true;
    }

    return false;
};

Lore.Utils.concatTypedArrays = function(a, b) {
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);

    return c;
};

Lore.Utils.msb = function(n) {
    return (n & 0x80000000) ? 31 : Lore.Utils.msb((n << 1) | 1) - 1;
};

Lore.Utils.mergePointDistances = function(a, b) {
    var newObj = {};

    newObj.indices = Lore.Utils.concatTypedArrays(a.indices, b.indices);
    newObj.distancesSq = Lore.Utils.concatTypedArrays(a.distancesSq, b.distancesSq);
    return newObj;
};
