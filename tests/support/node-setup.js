
// Register tsc to transpile before tests are run
require ("ts-node").register();


// Disable webpack features that Mocha does not understand
require.extensions[".css"] = function() {};

// aidtionally, setup jsdom here if needed ..