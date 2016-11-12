Lore.Ray = function(source, direction) {
    this.source = source || new Lore.Vector3f();
    this.direction = direction || new Lore.Vector3f();
}

Lore.Ray.prototype = {
    constructor: Lore.Ray,

    copyFrom: function(r) {
        this.source.copyFrom(r.source);
        this.direction.copyFrom(r.direction);

        return this;
    },

    applyProjection: function(m) {
        this.direction.add(this.source).applyProjection(m);
		this.source.applyProjection(m);
		this.direction.subtract(this.source);
		this.direction.normalize();

		return this;
    },


    // See if the two following functions can be optimized
    distanceSqToPoint: function(v) {
        var tmp = Lore.Vector3f.subtract(v, this.source);
        var directionDistance = tmp.dot(this.direction);

        if (directionDistance < 0)
            return this.source.distanceToSq(v);
            
        tmp.copyFrom(this.direction).multiplyScalar(directionDistance).add(this.source);
        
        return tmp.distanceToSq(v);
    },

    closestPointToPoint: function(v) {
        var result = Lore.Vector3f.subtract(v, this.source);
		var directionDistance = result.dot(this.direction);

		if (directionDistance < 0)
			return result.copyFrom(this.source);

		return result.copyFrom(this.direction).multiplyScalar(directionDistance).add(this.source);
    }
}
