Lore.SphericalCoords = class SphericalCoords {
    constructor(radius, phi, theta) {
        this.components = new Float32Array(3);
        this.radius = (radius !== undefined) ? radius : 1.0;
        this.phi = phi ? phi : 0.0;
        this.theta = theta ? theta : 0.0;
    }

    set(radius, phi, theta) {
        this.components[0] = radius;
        this.components[1] = phi;
        this.components[2] = theta;

        return this;
    }

    secure() {
        this.components[1] = Math.max(0.000001, Math.min(Math.PI - 0.000001, this.components[1]));

        return this;
    }

    setFromVector(v) {
        this.components[0] = v.length();

        if (this.components[0] === 0.0) {
            this.components[1] = 0.0;
            this.components[2] = 0.0;
        } else {
            this.components[1] = Math.acos(Math.max(-1.0, Math.min(1.0, v.components[1] /
                this.components[0])));
            this.components[2] = Math.atan2(v.components[0], v.components[2]);
        }

        return this;
    }

    limit(phiMin, phiMax, thetaMin, thetaMax) {
        // Limits for orbital controls
        this.components[1] = Math.max(phiMin, Math.min(phiMax, this.components[1]));
        this.components[2] = Math.max(thetaMin, Math.min(thetaMax, this.components[2]));
    }

    clone() {
        return new Lore.SphericalCoords(this.radius, this.phi, this.theta);
    }

    toString() {
        return '(' + this.components[0] + ', ' +
            this.components[1] + ', ' + this.components[2] + ')';
    }
}
