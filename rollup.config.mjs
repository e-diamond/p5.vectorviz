import terser from '@rollup/plugin-terser';

export default [
    // for use in a module - vectorviz.esm.js
    {
        input: 'src/vectorviz.js',
        external: ['p5'],
        output: {
            file: 'lib/vectorviz.esm.js',
            format: 'es'
        }
    },
    // for use in a module (minified) - vectorviz.esm.min.js
    {
        input: 'src/vectorviz.js',
        external: ['p5'],
        output: {
            file: 'lib/vectorviz.esm.min.js',
            format: 'es',
            plugins: [terser()]
        }
    },
    // for use as a <script> - vectorviz.js 
    {
        input: 'src/vectorviz.js',
        external: ['p5'],
        output: {
            file: 'lib/vectorviz.js',
            format: 'iife',
            globals: {
                p5: 'p5'
            },
            name: 'VectorViz'
        }
    },
    // for use as a <script> (minified) - vectorviz.js 
    {
        input: 'src/vectorviz.js',
        external: ['p5'],
        output: {
            file: 'lib/vectorviz.min.js',
            format: 'iife',
            globals: {
                p5: 'p5'
            },
            name: 'VectorViz',
            plugins: [terser()]
        }
    }
]