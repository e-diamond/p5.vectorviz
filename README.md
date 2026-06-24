# p5.VectorViz
p5.VectorViz is a p5 library for visualising vectors. It contains methods to draw a representation of p5.Vector objects. It's good for making interactive maths demonstrations.

## Installation 
p5.VectorViz is designed to work with p5.js 2.x or later. Features will break if used with p5.js 1.x!

VectorViz can be included in your project either via a standard `<script>` tag or as an ES module.

### Using the `<script>` tag 
To set up your project, add `p5.min.js` and `vectorviz.min.js` to your HTML file. You can download the latest version of the VectorViz library in the [lib][lib] folder. Place the script tags in the following order:

```
<script src="path_to/p5.min.js"></script>
<script src="path_to/vectorviz.min.js"></script>
```
Replace `path_to` with the actual path to the script in your project directory.

### As an ES Module 
At the top of your javascript module, import the VectorViz module:

```
import VectorViz from "path_to/vectorviz.esm.min.js";
```
You can download the latest version of `vectorviz.esm.min.js` in the [lib][lib] folder.

Please note that the ESM version of the library uses the **bare specifier** for the p5 dependency. You can change this manually to your preferred version, or, alternatively, you can include an `importmap` in the head of your HTML file specifying your preferred version:

```
<script type="importmap">
    {
        "imports": {
            "p5": "path_to/p5.min.js@2.x.x"
        }
    }
</script>
```

## Getting Started 
p5.VectorViz runs in WEBGL mode only, so be sure to set up your p5 sketch correctly. For more information on how to set up p5, please refer to [p5.js reference][create-canvas].

p5.VectorViz contains three main objects:
* `VectorViz`: This sets up your vector space and provides functions for creating vector objects within it - you should have one instance of this object per sketch
* `Vector`: The vector objects that are created within your sketch
* `Axes`: A set of axes that can be created within your sketch



### Example setup
An simple example showing a sketch with a set of axes and one vector.
```
let vv;
let axes;
let vector;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    vv = VectorViz.init();

    axes = vv.createAxes([-300, 300], 'white');
    vector = vv.createVector(createVector(100, 100, 100), 'red);
}

function draw() {
    background(50);
    vv.setup();

    axes.draw();
    vector.draw();
}
```

## Reference 
### VectorViz
A class to set up and manage the vector drawing space. You should create one instance of this class per sketch. Create using `VectorViz.init()` in `setup()`.

#### Static Methods
##### `init()`
Creates an instance of `VectorViz`. Should be called in `setup()`.

**Parameters:**
| Parameter | Data Type | Description |
| :---: | --- | --- |
|**dimension** | string | Whether the drawing space is 2-dimensional (`'2D'`) or 3-dimensional (`'3D'`). Defaults to `'3D'`. |
| **parity** | string | Whether to use a left-handed (`'LEFT'`) or right-handed (`'RIGHT'`) coordinate system. Defaults to `'RIGHT'`. |
| **sketch** | p5 | The p5 instance (if using in instance mode). Defaults to the global instance. |

**Syntax:**

`vv = VectorViz.init([dimension], [parity], [sketch])`

#### Instance Methods 
##### `setup`
Sets up the drawing space to be the correct parity and applies any transformations. You should call this at the start of the `draw()` loop.

**Syntax:**

`vv.setup()`

##### `applyMatrix`
Applies a transformation matrix to the drawing space. Use this over p5's native applyMatrix method in order to orient vector labels correctly. Please note that repeated calls of this method do not stack - calling `applyMatrix()` with a new parameter overwrites the previous usage.

**Parameters:**
| Parameter | Data Type | Description |
| :---: | --- | --- |
| **matrix** | p5.Matrix\|number[] | The transformation matrix to apply.  For a 3D space, this should be a 4x4 p5 matrix or an array of length 16 (The array should use column-major order). For a 2D space, this should be a 3x3 p5 Matrix or an array of length 9 or 6. For more information, see the [p5 reference for applyMatrix][matrix]. |

**Syntax:**

`vv.applyMatrix(matrix)`

##### `createVector`
Creates a new `Vector` object.

**Parameters:**
| Parameter | Data Type | Description |
| :---: | --- | --- |
| **vector** | p5.Vector | The p5 vector you want to draw to the screen. |
| **color** | string\|p5.Color | The color you want the vector to be drawn in. Should be a CSS color string or a p5.Color object. Defaults to `'red'`. |
| **arrow** | boolean | If the vector should be drawn with an arrow. Defaults to `true`. |

**Syntax:**

`vv.createVector(vector, [color], [arrow])`

##### `createAxes`
Creates a new set of axes. Returns an `Axes` object.

**Parameters:**
| Parameter | Data Type | Description |
| :---: | --- | --- |
| **range** | number[] | An array of length 2 specifying the start and end values which each axis spans.
| **color** | string\|p5.Color | The color you want the axes to be drawn in. Should be a CSS color string or a p5.Color object. |

**Syntax:**

`vv.createAxes(range, color)`

##### `setFont`
Sets the font to be used when displaying labels. If the requested font has not been loaded, it calls `loadFont()`.

**Parameters:**
| Parameter | Data Type | Description |
| :---: | --- | --- |
| **font** | string | The path to the font file. |

**Syntax:**

`vv.setFont(font)`

##### `loadFont` 
Async function. Loads a font object to be used when displaying labels.

**Parameters:**
| Parameter | Data Type | Description |
| :---: | --- | --- |
| **font** | string | The path to the font file. |

**Syntax:**

`vv.loadFont(font)`

<!-- #### Properties

| Property | Data Type | Description |
| :---: | --- | --- |
|**dimension** | String | Whether the drawing space is 2-dimensional (`"2D"`) or 3-dimensional (`"3D"`) |
| **parity** | String | Whether to use a left-handed (`"LEFT"`) or right-handed (`"RIGHT"`) coordinate system |
| **s** | p5 | The p5 instance which the VectorViz instance lives within |
| **transform** | null\|Array | The array to be used when a transformation matrix is applied |
| **vectors** | WeakSet | A set of all vectors created within the vector space |
| **axes** | WeakSet | A set of all sets of axes created within the vector space |
| **fonts** | Map | A map of all loaded p5.Font objects |
| **current_font** | p5.Font | The p5.Font object currently being used to draw text | -->

[create-canvas]: https://beta.p5js.org/reference/p5/createCanvas/
[lib]: https://github.com/e-diamond/p5.vectorviz/tree/main/lib
[matrix]: https://beta.p5js.org/reference/p5/applyMatrix/