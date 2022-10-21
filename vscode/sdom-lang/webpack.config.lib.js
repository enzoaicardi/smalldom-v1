const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, '../../lib/sdom.js'),
    output: {
        filename: 'sdom.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: true
    },
};