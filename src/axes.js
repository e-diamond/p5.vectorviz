import p5 from "p5";
import VectorViz from "./vectorviz.js";

class Axes {
    constructor(vvInst, range, color) {
        if (vvInst instanceof VectorViz) {
            this.vv = vvInst;
        } else {
            throw new TypeError(`Invalid Argument: vvInst must be instance of VectorViz`);
        }

        if (Array.isArray(range) && range.length == 2) {
            range.forEach(limit => {
                if (typeof limit !== 'number') {
                    throw new TypeError(`Invalid Argument: range must contain only number values`);
                }
            });
            this.start = range[0];
            var size = range[1] - range[0];
        } else {
            throw new Error(`Invalid Argument: range must be an array of length 2`);
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
            throw new TypeError(`Invalid Argument: color must be instance of p5.Color`);
        }

        let s = vvInst.s;
        this.axes = [];
        if (vvInst.dimension === '2D') {
            this.axes.push(
                vvInst.createVector(s.createVector(size, 0), this.color)
            );
            this.axes.push(
                vvInst.createVector(s.createVector(0, size), this.color)
            );
        } else if (vvInst.dimension === '3D') {
            this.axes.push(
                vvInst.createVector(s.createVector(size, 0, 0), this.color)
            );
            this.axes.push(
                vvInst.createVector(s.createVector(0, size, 0), this.color)
            );
            this.axes.push(
                vvInst.createVector(s.createVector(0, 0, size), this.color)
            );
        }
    }

    /** Draws the axes */
    draw() {
        let s = this.vv.s;
        this.axes.forEach(axis => {
            s.push();
            this.moveToStart(axis);
            axis.draw();
            s.pop();
        });
    }

    /**
     * Labels the axes.
     * @param {string[]} [labels=[x, y, z]] - how to label the axes. Defaults to x, y, z
     */
    label(labels=['x', 'y', 'z']) {
        let s = this.vv.s;
        this.axes.forEach((axis, i) => {
            s.push();
            this.moveToStart(axis);
            axis.label(labels[i]);
            s.pop();
        });
    }

    /**
     * Moves the origin to the axis start point.
     * @param {Vector} axis - the axis to be drawn 
     */
    moveToStart(axis) {
        let s = this.vv.s;
        let p5v = p5.Vector;
        s.translate(p5v.mult(p5v.normalize(axis.vector), this.start));
    }
}

export { Axes }