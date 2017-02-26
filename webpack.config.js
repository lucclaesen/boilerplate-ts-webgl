var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

/** The basic idea behind this factory is to support incremental addition of features. Webpack configuration is hard. So hard, that, once
 * a setup is complete, you tend forget how it evolved. 
 * 
 * So why not implement a factory that sort of reflects its stepwise genesis? It won't be the most efficient factory, but it's maintainability
 * will be higher.
 */
const configFactory = {

    config: {},

    init(options) {

        // basic entry section
        this.config.entry = [];
        if (options.run === 'tests') {
            this.config.entry.push('./tests/index.js');
        }
        else {
            this.config.entry.push('./src/js/index.ts');
        }
        
        // basic output section
        this.config.output = {};
        if (options.run === 'tests') {
            this.config.output = {
                filename: 'test.bundle.js',
                path: path.join(__dirname, 'tests')
            };
        }
        else {
            this.config.output = {
                path: path.join(__dirname, 'dist'),
                filename: 'bundle.js'
            };
        }

        this.config.resolve = {};
        this.config.resolve.extensions = [
            "\*", ".js", ".json",  ".ts", ".glsl"
        ];

        // basic plugin config
        this.config.plugins = [];
        const htmlPluginOptions = (options.run === 'tests') ?
            {
                    cache: true,
                    filename: "index.html",
                    showErrors: true,
                    template: "tests/support/index-template.html",
                    title: "Mocha browser test"
            } :
            {
                template : "./src/index-template.html",
                filename: "index.html",
                showErrors: true
            };
        this.config.plugins.push(new HtmlWebpackPlugin(htmlPluginOptions));

        // basic loader config
        this.config.module = {};

        // basic rules config
        this.config.module.rules = [];
        this.config.module.rules.push({
                test: /\.glsl$/,
                loader: 'webpack-glsl-loader'
            });

        this.config.module.rules.push({
                        test: /\.ts$/,
                        loader: "awesome-typescript-loader"
                    });

        if (options.run === 'tests') {
            this.config.module.rules.push({
                        test: /(\.css|\.less)$/,
                        loader: 'null-loader',
                        exclude: [
                            /dist/, 
                            /node-modules/
                        ]
                    });
        }


        // basic devTools config
        this.config.devtool = "source-map";

        // basic devServer config
        if (options.run === 'tests') {
            this.config.devServer = {
                host: "localhost",
                port: 8001
            };
        }
        else {
            this.config.devServer = {
                host: "localhost",
                port: 8000
            }
        }

        return this;
    },

    addHRMSupport(options) {
         if (options.target === "development") {
            this.config.entry.push('webpack-hot-middleware/client');
            this.config.plugins.push(new webpack.HotModuleReplacementPlugin());
        }
        return this;
    },

    addUglificationSupport(options) {
         if (options.target === "production") {
            this.config.plugins.push(new webpack.optimize.UglifyJsPlugin({
                sourceMap: true // this option is required to combine uglification and source maps
            }));
        }
        return this;
    },

    /** Adds a basic chunk split between own and vendor provided code */
    addChunkSplitting(options) {
        if (options.target === "production") {
            // replace the single production entry point by a dictionary of entry points
            const oldEntryPoint = this.config.entry;
            this.config.entry = {
                main: oldEntryPoint,
                vendor: "./src/js/vendor.ts"
            };

            // make sure that code that overlaps between the chunks only gets placed in the vendor chunk
            this.config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
                name: "vendor"
            }));

            // change the fixed bundle names into names equal to those of their entry points
            this.config.output.filename = "[name].js";
        }
        return this;
    },

    addCacheBustingSupport(options) {
        if (options.target === "production") {
            // hash the bundle filename
            this.config.output.filename = "[name].[hash].js";
        }
        return this;
    },

    addStyleModuleSupport(options) {
        if (options.run === "app") {
            const stylesheetName = (options.target === "development") ? "app.css" : "[hash].css";
            this.config.plugins.push(new ExtractTextPlugin(stylesheetName));
            this.config.module.rules.push( {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            });

        }
        return this;
    }
};

const optionsDefaults = {
    target : 'development',
    run: 'app'
}

module.exports = function (options = optionsDefaults) {

    if (options.target === "production")
        process.env.NODE_ENV = "production";

    return configFactory
        .init(options)
        .addHRMSupport(options)
        .addUglificationSupport(options)
        .addChunkSplitting(options)
        .addCacheBustingSupport(options)
        .addStyleModuleSupport(options)
        .config;
};


