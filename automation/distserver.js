import express from "express";
import chalk from "chalk";
import compression from "compression";

const app = express();
app.use(compression());
app.use(express.static('dist'));

// compress

const port = 8002;
app.listen(port, function(err) {
    if (err) {
        console.log(err);
    } else  {
        console.log(chalk.bold('Listening on port %s\n'), port);
    }
})