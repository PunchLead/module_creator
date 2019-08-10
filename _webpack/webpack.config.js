const path = require('path');
const glob = require('glob');
var libraryName = 'library';
var outputFile = libraryName + '.js';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
var pixiModule = path.join(__dirname, '/node_modules/pixi.js/');

module.exports = {
 entry: {
    js: glob.sync("./src/**/*.js"),  
 },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Pixi.js Demo'
    }),
    new CopyPlugin([
      { from: 'src/assets', to: 'assets' },
    ])
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    library: "myLibrary",   // Important
    libraryTarget: 'umd',   // Important
    umdNamedDefine: true
  },
  devServer: {
    overlay: true,
    hot: true
},
module: {
  rules: [
      { test: /\.js$/, loader: 'babel-loader', include: path.join(__dirname, 'src') },
      { test: /\.json$/, include: path.join(__dirname, 'node_modules', 'pixi.js'),loader: 'json'},
      //We expose the non minified pixi file as a global. The minified one was not working with our solution
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
       // 'pixi-spine': path.resolve(__dirname, 'src/scripts/vendor/pixijs/pixi-spine/pixi-spine'),
    ]
  },
  resolve: {
    alias: {
      'pixi': pixiModule,
      'pixi-spine': path.resolve(__dirname, 'src/scripts/vendor/pixijs/pixi-spine/pixi-spine'),
    },
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.tsx', '.css', '.scss', '.json']
},
performance: { hints: false },


};