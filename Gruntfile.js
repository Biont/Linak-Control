const ejs = require('./ejsCompile');
module.exports = function (grunt) {
    grunt.initConfig({
        config: {
            scripts: {
                src: 'src/js/',
                dest: 'app/'
            },
            tpl: {
                src: 'src/tpl/',
                dest: 'app/tpl/'
            }
        },
        babel: {
            options: {
                sourceMap: true,
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.scripts.src %>',
                        src: ['**/*.js'],
                        dest: '<%= config.scripts.dest %>'
                    }
                ]
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
                    'babel'
                ]
            },
            tpl: {
                files: [
                    '<%= config.tpl.src %>**/*.ejs'
                ],
                tasks: [
                    'ejs'
                ]
            }
        },
        electron: {
            linux: {
                options: {
                    name: 'LinakControl',
                    dir: '.',
                    out: 'dist',
                    platform: 'linux',
                    arch: 'x64'
                }
            }
        }
    });
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.registerTask('default', ['babel', 'ejs']);
    grunt.registerTask('electron', ['electron']);

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
                var compiled = ejs.compile(value);
                var dest = file.dest.substr(0, file.dest.lastIndexOf(".")) + ".js";
                // Write joined contents to destination filepath.
                grunt.file.write(dest, compiled);
                // Print a success message.
            });

        });
        grunt.log.writeln('ejs done.');

    });
};