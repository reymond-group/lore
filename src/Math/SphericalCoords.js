Lore.SphericalCoords = function(radius, phi, theta) {
    this.components = new Float32Array(3);
    this.radius = (radius !== undefined) ? radius : 1.0;
    this.phi = phi ? phi : 0.0;
    this.theta = theta ? theta : 0.0;
}

Lore.SphericalCoords.prototype = {
    constructor: Lore.SphericalCoords,

    set: function(radius, phi, theta) {
        this.components[0] = radius;
        this.components[1] = phi;
        this.components[2] = theta;
        
        return this;
    },

    secure: function() {
        this.components[1] = Math.max(0.000001, Math.min(Math.PI - 0.000001, this.components[1]));
        return this;
    },

    setFromVector: function(v) {
        this.components[0] = v.length();
        
        if(this.components[0] === 0.0) {
            this.components[1] = 0.0;
            this.components[2] = 0.0;
        }
        else {
            this.components[1] = Math.acos(Math.max(-1.0, Math.min(1.0, v.components[1] / this.components[0])));
            this.components[2] = Math.atan2(v.components[0], v.components[2]);
        }

        return this;
    },

    limit: function() {
        // Limits for orbital controls
        this.components[1] = Math.max(0.0, Math.min(Math.PI, this.components[1]));
        this.components[2] = Math.max(-Infinity, Math.min(Infinity, this.components[2]));
    },

    clone: function() {
        return new Lore.SphericalCoords(this.radius, this.phi, this.theta);
    },

    toString: function() {
        return '(' + this.components[0] + ', ' + this.components[1] + ', ' + this.components[2] + ')';
    }
}
