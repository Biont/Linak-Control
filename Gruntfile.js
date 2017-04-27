module.exports = function (grunt) {
    grunt.initConfig({
        config: {
            scripts: {
                src: 'src/js/',
                dest: 'app/'
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

    grunt.registerTask('default', ['babel']);
    grunt.registerTask('electron', ['electron']);
};