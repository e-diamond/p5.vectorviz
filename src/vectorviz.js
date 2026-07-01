import p5 from "p5";
import { Vector } from "./vector.js";
import { Axes } from "./axes.js";

class VectorViz {

    static insts = new WeakSet();
    static init(dimension='3D', parity='RIGHT', sketch=p5.instance) {
        let vv;
        try {
            vv = new VectorViz(dimension, parity, sketch);
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
     * @param {p5} [sketch=p5.instance] - the p5 instance. Defaults to the global instance
     */
    constructor(dimension='3D', parity='RIGHT', sketch=p5.instance) {
        
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

        // check for a p5 instance 
        if (sketch instanceof p5) {
            this.s = sketch;
        } else {
            throw new TypeError(`Invalid argument: sketch must be instance of p5`);
        }

        // holds array to be used in p5 applyMatrix
        this.transform;

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
    }

    /**
     * Applies a transformation matrix
     * and saves so can be used by other methods
     * @param {p5.Matrix|number[]} matrix - the transformation matrix to be applied
     */
    applyMatrix(matrix) {
        // p5.Matrix
        if (matrix instanceof p5.Matrix) {
            let arr;
            // if 3x3 matrix
            if (arr = matrix.mat3) {
                this.transform = [];
                for (let i = 0; i < arr.length; i++) {
                    if (i % 3 !== 2) {
                        this.transform.push(arr[i]);
                    } 
                }
            // if 4x4 matrix
            } else if (arr = matrix.mat4) {
                this.transform = arr;
            } else {
                throw new Error(`matrix must be of size 3x3 or 4x4`);
            }
        // Array
        } else if (Array.isArray(matrix)) {
            let valid_lengths = [6, 9, 16];
            if (valid_lengths.includes(matrix.length)) {
                this.transform = matrix;
            } else {
                throw new Error(`matrix must be of length 6, 9, or 16`);
            }
        } else {
            throw new TypeError(`Invalid argument: matrix must be p5.Matrix or Array`);
        }
        // apply matrix
        this.s.applyMatrix(this.transform);
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

export default VectorViz;