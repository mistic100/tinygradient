import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

const pkg = require('./package.json');

export default {
    input   : 'index.js',
    output  : {
        file     : 'browser.js',
        name     : 'tinygradient',
        format   : 'umd',
        sourcemap: true,
        globals  : {
            'tinycolor2': 'tinycolor'
        },
        banner   : `/*!
 * ${pkg.name} (v${pkg.version})
 * @copyright 2014-${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.email}>
 * @licence ${pkg.license}
 */`,
    },
    external: [
        'tinycolor2',
    ],
    plugins : [
        commonjs(),
        babel({
            exclude: 'node_modules/**',
        }),
    ]
};
