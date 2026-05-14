import p5 from "p5";
import VectorViz from "./vectorviz.js";

class Vector {

    /**
     * Creates a new vector ready to be drawn 
     * @param {VectorViz} vvInst - the vector space to draw into 
     * @param {p5.Vector} vector - the vector being drawn 
     * @param {string|p5.Color} [color=red] - the color in which to draw the vector. Defaults to red
     * @param {boolean} [arrow=true] - whether to add an arrow to the vector. Defaults to true
     */
    constructor(vvInst, vector, color='red', arrow=true) {

        if (vvInst instanceof VectorViz) {
            this.vv = vvInst;
        } else {
            throw new TypeError(`Invalid Argument: vvInst must be instance of VectorViz`);
        }

        if (vector instanceof p5.Vector) {
            this.vector = vector;
        } else {
            throw new TypeError(`Invalid Argument: vector must be instance of p5.Vector`);
        }

        if (typeof color === 'string') {
            try {
                this.color = vvInst.s.color(color);
            } catch (error) {
                throw error;
            }
        } else if (color instanceof p5.Color) {
            this.color = color;
        } else {
            throw new TypeError(`Invalid Argument: 'color' must be instance of 'p5.Color'`);
        }

        this.arrow = arrow;
    }

    /** Draws the vector object 
     * @param {number} [weight=2] - how thick to draw the vector
    */
    draw(weight=2) {
        let s = this.vv.s;

        let r, theta, phi;
        [r, theta, phi] = Vector.getSpherical(this.vector);

        s.push();
            s.noStroke();
            s.ambientMaterial(this.color);
            s.rotateZ(-s.HALF_PI + phi);
            s.rotateX(s.HALF_PI - theta);
            s.translate(0, r/2, 0);
            s.cylinder(weight, r, 7);
            if (this.arrow) {
                s.translate(0, r/2, 0);
                s.cone(weight*2, 10, 8); 
            }
        s.pop();
    }

    /**
     * Labels the vector
     * @param {string} str - text to display 
     * @param {boolean} [pretty=true] - try to position labels 'nicely'
     */
    label(str, pretty=true) {
        let vv = this.vv;
        if (vv.current_font) {
            let s = vv.s;
            s.push();
                s.translate(this.vector);
                if (pretty) {
                    s.translate(p5.Vector.mult(this.vector, 0.05));
                }
                s.textFont(vv.current_font);
                s.fill(this.color);
                if (vv.parity === 'RIGHT') {
                    s.scale(1, -1, 1);
                }
                if (vv.transform) {
                    s.applyMatrix(this.space.transform);
                }
                s.text(str, 0, 0);
            s.pop();
        }
    }

    /**
     * Takes an xyz vector and calculates r theta phi components
     * (uses physics convention)
     * @param {p5.Vector} vector 
     * @returns {number[]} 
     */
    static getSpherical(vector) {
        let r = vector.mag();
        let theta = Math.acos(vector.z/r);
        let phi = Math.atan2(vector.y, vector.x);

        return [r, theta, phi];
    }
}

export { Vector };