//@ts-check

/** 
 * A class representing a Color. 
 * 
 * @property {Float32Array} components A typed array storing the components of this color (rgba).
 */
class Color {
    /**
     * Creates an instance of Color.
     * @param {Number} r The red component (0.0 - 1.0).
     * @param {Number} g The green component (0.0 - 1.0).
     * @param {Number} b The blue component (0.0 - 1.0).
     * @param {Number} [a=1.0] The alpha component (0.0 - 1.0).
     */
    constructor(r, g, b, a = 1.0) {
        if (arguments.length === 1) {
            this.components = new Float32Array(r);
        } else {
            this.components = new Float32Array(4);
            this.components[0] = r || 0.0;
            this.components[1] = g || 0.0;
            this.components[2] = b || 0.0;
            this.components[3] = a || 1.0;
        }
    }

    /**
     * Set the red, green, blue and alpha components of the color.
     * 
     * @param {Number} r The red component (0.0 - 1.0).
     * @param {Number} g The green component (0.0 - 1.0).
     * @param {Number} b The blue component (0.0 - 1.0).
     * @param {Number} a The alpha component (0.0 - 1.0).
     * @returns {Color} Returns itself.
     */
    set(r, g, b, a) {
        this.components[0] = r;
        this.components[1] = g;
        this.components[2] = b;

        if (arguments.length == 4) {
            this.components[3] = a;
        }

        return this;
    }

    /**
     * Set the r,g,b,a components from a hex string.
     * 
     * @static
     * @param {String} hex A hex string in the form of #ABCDEF or #ABC.
     * @returns {Color} A color representing the hex string.
     */
    static fromHex(hex) {
        // Thanks to Tim Down
        // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);

        return result ? new Color(r / 255.0, g / 255.0, b / 255.0, 1.0) : null;
    }

    /**
     * Get the r, g or b value from a hue component.
     * 
     * @static
     * @param {Number} p 
     * @param {Number} q 
     * @param {Number} t 
     * @returns {Number} The r, g or b component value.
     */
    static hueToRgb(p, q, t) {
        if (t < 0) {
            t += 1;
        } else if (t > 1) {
            t -= 1;
        } else if (t < 0.1667) {
            return p + (q - p) * 6 * t;
        } else if (t < 0.5) {
            return q;
        } else if (t < 0.6667) {
            return p + (q - p) * (0.6667 - t) * 6;
        }

        return p;
    }

    /**
     * Converts HSL to RGB.
     * 
     * @static
     * @param {Number} h The hue component.
     * @param {Number} s The saturation component.
     * @param {Number} l The lightness component.
     * @returns {Number[]} An array containing the r, g and b values ([r, g, b]).
     */
    static hslToRgb(h, s, l) {
        let r, g, b;

        if (s == 0) {
            r = g = b = l;
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            
            r = Color.hueToRgb(p, q, h + 0.3333);
            g = Color.hueToRgb(p, q, h);
            b = Color.hueToRgb(p, q, h - 0.3333);
        }

        return [r, g, b];
    }

    /**
     * Converts HSL to RGB.
     * 
     * @static
     * @param {Number} h The hue component.
     * @param {Number} s The saturation component.
     * @param {Number} l The lightness component.
     * @returns {String} A hex string representing the color (#RRGGBB).
     */
    static hslToHex(h, s, l) {
      let [r, g, b] = Color.hslToRgb(h, s, l);
      return '#' + [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)].map(e => {
        const hex = e.toString(16);
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }

    /**
     * Converts RGB to HSL.
     * 
     * @static
     * @param {Number} r The red component.
     * @param {Number} g The green component.
     * @param {Number} b The blue component.
     * @returns {Number[]} An array containing the h, s and l values ([h, s, l]).
     */
    static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    /**
     * Shifts the hue so that 0.0 represents blue and 1.0 represents magenta.
     * 
     * @static
     * @param {Number} hue A hue component.
     * @returns {Number} The hue component shifted so that 0.0 is blue and 1.0 is magenta.
     */
    static gdbHueShift(hue) {
        hue = 0.85 * hue + 0.66;
        
        if (hue > 1.0) {
            hue = hue - 1.0;
        }

        hue = (1 - hue) + 0.33
        
        if (hue > 1.0) {
            hue = hue - 1.0
        }

        return hue;
    }
}

module.exports = Color