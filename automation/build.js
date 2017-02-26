import webpack from "webpack";
import configFunction from "../webpack.config";
import chalk from "chalk";
import yargs from "yargs";

const config = configFunction(yargs.argv.env);

webpack(config).run((err, stats) => {
    if (err) {
        console.log(chalk.red(err));
        return 1;
    }

    const jsonStats = stats.toJson();
    if (jsonStats.hasErrors) {
        return jsonStats.errors.map(err => console.log(chalk.red(err)));
    }

    if (jsonStats.hasWarnings) {
        console.log(chalk.yellow("Webpack generated the following warnings:"));
        jsonStats.warnings.map(w => console.log(chalk.yellow(w)));
    }

    console.log(`Webpack stats: ${stats}`);

    console.log(chalk.green("Build for prod done"));
    return 0;
});