Lore.Statistics = function() {

}

Lore.Statistics.prototype = {
    constructor: Lore.Vector2f,

}

// Using Marsaglia polar
Lore.Statistics.spareRandomNormal = null;
Lore.Statistics.randomNormal = function() {
    var val, u, v, s, mul;

  	if(Lore.Statistics.spareRandomNormal !== null) {
    		val = Lore.Statistics.spareRandomNormal;
    		Lore.Statistics.spareRandomNormal = null;
  	}
  	else {
    		do {
      			u = Math.random() * 2 - 1;
      			v = Math.random() * 2 - 1;

      			s = u * u + v * v;
    		} while(s === 0 || s >= 1);

    		mul = Math.sqrt(-2 * Math.log(s) / s);
    		val = u * mul;
    		Lore.Statistics.spareRandomNormal = v * mul;
  	}

  	return val / 14;
}

Lore.Statistics.randomNormalInRange = function(a, b) {
    var val;

    do {
      val = Lore.Statistics.randomNormal();
    } while(val < a || val > b);

    return val;
}

Lore.Statistics.randomNormalScaled = function(mean, sd) {
    var r = Lore.Statistics.randomNormalInRange(-1, 1);
    return r * sd + mean;
}
