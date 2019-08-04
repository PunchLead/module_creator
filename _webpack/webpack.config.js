let path = require('path');
const glob = require('glob');
var libraryName = 'library';
var outputFile = libraryName + '.js';
var webpack = require('webpack');
// require('./src/lib/anime.js');
// require('./lib/howler.js');


var projectRoot = path.resolve(__dirname, '../')
var pixiModule = path.join(__dirname, '/node_modules/pixi.js/')

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let conf = {
  entry: {
    js: glob.sync("./src/**/*.js"),  
 },
 
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
          title: 'Pixi.js playable'
        }),
        new CopyPlugin([
          { from: 'src/assets', to: 'assets' },
        ])
      ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './dist'),
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
            { test: pixiModule, loader: 'expose-loader?pixi' },
          ],
          
 
    },
    
    resolve: {
        alias: {
          'pixi': pixiModule
        }
    },
    performance: { hints: false },
    externals: {
      // Don't bundle giant dependencies, instead assume they're available in
      // the html doc as global variables node module name -> JS global
      // through which it is available
      "pixi.js": "PIXI",
      "pixi-spine.js": "PIXI",
  },
};

module.exports = (env, options) => {
    conf.devtool = options.mode === "production" ?
                    false:
                    "cheap-module-eval-source-map" // в дев билде проверяет по соурс мапе
    console.log(options.mode);

    return conf;
};