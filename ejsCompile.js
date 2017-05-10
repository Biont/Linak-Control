const fs = require('fs');
const ejs = require('ejs');

function compile(filename, filter) {
    filter = filter || function (v, n) {
                return v
            },
        options = {filename: filename, client: true, compileDebug: false},
        template = fs.readFileSync(filename).toString().replace(/^\uFEFF/, ''),
        fn = ejs.compile(template, options);
    return filter(fn.toString(), filename);
};

module.exports = {compile: compile};