const ejsPrecompiler = require('./ejsCompile');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const walkFolder = function (value, folder, callback) {
    var fileContents = fs.readdirSync(folder);
    fileContents.forEach(function (fileName) {
        stats = fs.lstatSync(folder + '/' + fileName);

        if (stats.isDirectory()) {
            value = walkFolder(value, folder + fileName, callback);
        } else {
            value = callback(value, folder + fileName);
        }
    });
    return value;
};
const getTemplates = function (folder, filter) {
    filter = filter || function (v) {
            return v
        };

    return walkFolder('', folder, function (str, file) {
        return str + filter(fs.readFileSync(file).toString(), file);
    });
};
module.exports = function (grunt) {
    var baseCfg = {
        scripts: {
            src: 'src/js/',
            dest: 'js/'
        },
        tpl: {
            src: 'src/tpl/',
            dest: 'js/tpl/'
        }
    };
    grunt.initConfig({
        config: baseCfg,
        browserify: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.scripts.src %>',
                        src: ['index.js'],
                        dest: '<%= config.scripts.dest %>'
                    }
                ],
                options: {
                    transform: ['babelify'],
                    alias: {
                        'biont-backbone': './node_modules/biont-backbone/dist/js/biont-backbone.js',
                        // 'backbone': './bower_components/backbone/backbone-min.js',
                        // 'underscore': './bower_components/underscore/underscore-min.js'
                    },
                    // require: walkFolder([], baseCfg.tpl.dest, function (arr, file) {
                    //     console.log([file, {expose: file}]);
                    //     return arr.push([file, {expose: 'schnarf'}]);
                    // }),
                    // debug: true
                }
            }

        },
        ejs: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.tpl.src %>',
                        src: ['**/*.ejs'],
                        dest: '<%= config.tpl.dest %>'
                    }
                ]
            }

        },
        indexHtml: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: './',
                        src: ['index.ejs'],
                        dest: './'
                    }
                ],
                tplData: {
                    test: 'yeah',
                    getTemplates: function () {
                        return getTemplates(baseCfg.tpl.dest, function (v, n) {
                            var name = path.basename(n, '.js')
                            return 'templates["' + name + '"] = ' + v + ';';
                        });
                    }
                }
            }
        },
        watch: {
            options: {
                spawn: false
            },
            scripts: {
                files: [
                    '.eslintrc',
                    '<%= config.scripts.src %>**/*.js'
                ],
                tasks: [
                    'browserify'
                ]
            },
            tpl: {
                files: [
                    '<%= config.tpl.src %>**/*.ejs'
                ],
                tasks: [
                    'ejs','indexHtml'
                ]
            },
            indexHtml: {
                files: ['./index.ejs'],
                tasks: ['indexHtml']
            }
        }
    });
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.registerTask('default', ['browserify', 'ejs']);

    grunt.registerMultiTask('ejs', 'My "foo" task.', function (a, b) {
        this.files.forEach(function (file) {
            var contents = file.src.filter(function (filepath) {
                // Remove nonexistent files (it's up to you to filter or warn here).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function (value, index, array) {
                var compiled = ejsPrecompiler.compile(value);
                var dest = file.dest.substr(0, file.dest.lastIndexOf(".")) + ".js";
                // Write joined contents to destination filepath.
                grunt.file.write(dest, compiled);
                // Print a success message.
            });

        });
        grunt.log.writeln('ejs done.');

    });

    grunt.registerMultiTask('indexHtml', 'My "foo" task.', function (a, b) {
        var tplData = this.data.tplData || {};
        this.files.forEach(function (file) {
            var contents = file.src.filter(function (filepath) {
                // Remove nonexistent files (it's up to you to filter or warn here).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function (value, index, array) {
                var options = {filename: value, client: true, compileDebug: false};
                var template = fs.readFileSync(value).toString().replace(/^\uFEFF/, '');
                var fn = ejs.compile(template, options);
                var result = fn(tplData);

                var dest = file.dest.substr(0, file.dest.lastIndexOf(".")) + ".html";
                // Write joined contents to destination filepath.
                grunt.file.write(dest, result);
                // Print a success message.
            });

        });
        grunt.log.writeln('ejs done.');

    });
};