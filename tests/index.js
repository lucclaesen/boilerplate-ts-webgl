// This will search for files ending in .test.ts and require them
// so that they are added to the webpack bundle
var context = require.context('.', true, /.+\.test\.ts?$/);
context.keys().forEach(context);
module.exports = context;

// require("./firstTest.test.js");