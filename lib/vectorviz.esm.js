import p5 from 'p5';

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

class VectorViz {

    static insts = new WeakSet();
    static init(dimension='3D', parity='RIGHT', matrix=null, sketch=p5.instance) {
        let vv;
        try {
            vv = new VectorViz(dimension, parity, matrix, sketch);
            this.insts.add(vv);
        } catch (error) {
            throw error;
        }
        return vv;
    }

    static dimensions = ['2D', '3D'];
    static parity = ['LEFT', 'RIGHT'];
    /**
     * Create a vector space to draw new vectors into.
     * @param {string} [dimension=3D] - the dimension of the space (either 2D or 3D)
     * @param {string} [parity=RIGHT] - the handedness of the coordinate system (either LEFT or RIGHT)
     * @param {null|number[]} [matrix=null] - transformation matrix to apply 
     * @param {p5} [sketch=p5.instance] - the p5 instance. Defaults to the global instance
     */
    constructor(dimension='3D', parity='RIGHT', matrix=null, sketch=p5.instance) {
        
        // set dimension to 2D OR 3D 
        if (VectorViz.dimensions.includes(dimension)) {
            this.dimension = dimension;
        } else {
            throw new Error(`Invalid argument: 'dimension' must be one of the values ${VectorViz.dimensions}`);
        }

        // set parity to LEFT or RIGHT 
        if (VectorViz.parity.includes(parity)) {
            this.parity = parity;
        } else {
            throw new Error(`Invalid argument: 'parity' must be one of the values ${VectorViz.parity}`);
        }

        // apply transformation matrix 
        if (matrix) {
            if (Array.isArray(matrix)) {
                if ((dimension === '2D' && matrix.length == 6) || (dimension === '3D' && matrix.length == 16)) {
                    matrix.forEach(element => {
                        if (typeof element !== 'number') {
                            throw new TypeError(`Invalid Argument: transformation matrix must contain only number values`);
                        }
                    });
                    this.transform = matrix;
                } else {
                    throw new RangeError(`Transformation matrix should contain 6 elements for a 2D space or 16 elements for a 3D space`)
                }
            } else {
                throw new TypeError(`Invalid argument: transformation matrix must be of type Array`);
            }
        }

        // check for a p5 instance 
        if (sketch instanceof p5) {
            this.s = sketch;
        } else {
            throw new TypeError(`Invalid argument: sketch must be instance of p5`);
        }

        // initialize set to hold vectors 
        this.vectors = new WeakSet();
        this.axes = new WeakSet();

        // font handling 
        this.fonts = new Map();
        this.current_font;
    }

    /** Flips the y-axis for right-handed coordinate systems 
     * and applies a transformation matrix if provided 
    */
    setup() {
        this.s.ambientLight(255);
        if (this.parity === 'RIGHT') {
            this.s.scale(1, -1, 1);
        }
        if (this.transform) {
            this.s.applyMatrix(this.transform);
        }
    }

    /** Creates a new vector object within the vector space.
     * @param {p5.Vector} vector - the vector to be drawn 
     * @param {string|p5.Color} [color=red] - the color in which to draw the vector. Defaults to red
     * @param {boolean} [arrow=true] - whether to add an arrow to the vector. Defaults to true
     */
    createVector(vector, color='red', arrow=true) {
        let v;
        try {
            v = new Vector(this, vector, color, arrow);
            this.vectors.add(v);
            return v;
        } catch (error) {
            throw error;
        }
    }

    createAxes(range, color) {
        let axes;
        try {
            axes = new Axes(this, range, color);
            this.axes.add(axes);
            return axes;
        } catch (error) {
            throw error;
        }
    }

    /** Sets the font to be used for labels
     * @param {string} font - the path to the font file.
     */
    setFont(font) {
        let status = this.fonts.get(font);
        if (status) {
            if (status.loaded) {
                this.current_font = status.obj;
            }
        } else {
            this.loadFont(font);
        }
    }

    /** Loads a new font into the fonts map
     * @param {string} font - the path to the font file.
     */
    async loadFont(font) {
        this.fonts.set(font, {
            loaded: false,
            obj: null
        });
        let obj = await this.s.loadFont(font);
        this.fonts.set(font, {
            loaded: true,
            obj: obj
        });
    }
}

export { VectorViz as default };
