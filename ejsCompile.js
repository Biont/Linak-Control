const fs = require('fs');
const ejs = require('ejs');

function compile(filename) {
    var options = {filename: filename, client: true, compileDebug: true};
    var template = fs.readFileSync(filename).toString().replace(/^\uFEFF/, '');
    var fn = ejs.compile(template, options);
    return 'module.exports = ' + fn.toString() + ';';
};

module.exports = {compile: compile};