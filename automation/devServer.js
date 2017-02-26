import express from "express";
import webpack from "webpack";
import webPackDevMiddleware from "webpack-dev-middleware";
import webPackHotMiddleware from "webpack-hot-middleware";
import configFunc from "../webpack.config.js";
import yargs from "yargs";
import chalk from "chalk";


const config = configFunc(yargs.argv.env);
const app = express();
const compiler = webpack(config);

console.dir(config);

app.use(webPackDevMiddleware(compiler, {
    publicPath : config.output.publicPath,
    
}));

app.use(webPackHotMiddleware(compiler));

app.listen(config.devServer.port, function(err) {
    if (err) {
        console.log(err);
    } else  {
        console.log(chalk.bold('Listening on port %s\n'), config.devServer.port);
    }
})