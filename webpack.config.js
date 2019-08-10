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
          title: 'Pixi.js playable_dev'
        }),
        new CopyPlugin([
          { from: 'src/assets', to: 'assets' },
        ]),
        new webpack.ProvidePlugin({
          PIXI: 'pixi.js'
        })
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
            { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
             // 'pixi-spine': path.resolve(__dirname, 'src/scripts/vendor/pixijs/pixi-spine/pixi-spine'),
          ],
          
 
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


    externals: {
      "pixi.js": "PIXI"
  },
};

module.exports = (env, options) => {
    conf.devtool = options.mode === "production" ?
                    false:
                    "cheap-module-eval-source-map" // в дев билде проверяет по соурс мапе
    console.log(options.mode);

    return conf;
};