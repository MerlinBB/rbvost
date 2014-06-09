module.exports = function (grunt) {

    "use strict";

    // this saves us having to load each plugin individually
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        less: {
            development: {
                options: {
                    strictMath: true,
                    strictUnits: true,
                    cleancss: true
                },
                files: {
                    "style.css": "styles/style.less"
                }
            }
        },

        autoprefixer: {
            single_file: {
                options: {
                    browsers: ["last 2 version"]
                },
                src: "style.css",
                dest: "style.css"
            },
        },

        csslint: {
            options: {
                csslintrc: ".csslintrc"
            },
            strict: {
                src: ["style.css"]
            }
        },

        cssmin: {
            minify: {
                src: "style.css",
                dest: "style.css"
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [
                ".jshintrc",
                "Gruntfile.js",
                "js/project.js"
            ]
        },

        concat: {
            dist: {
                src: [
                    "js/bower/jquery/jquery.js",
                    "js/bower/modernizr/modernizr.js",
                    "js/bower/jquery-smartresize/jquery.debouncedresize.js",
                    "js/bower/underscore/underscore.js",
                    "js/bower/moment/moment.js",
                    "js/bower/eventEmitter/EventEmitter.js",
                    "js/bower/imagesloaded/imagesloaded.js",
                    "js/bower/isotope/jquery.isotope.js",
                    "js/bower/clndr/src/clndr.js",
                    "js/bower/flexslider/jquery.flexslider.js",
                    "js/project.js"
                ],
                dest: "js/production.js"
            }
        },

        uglify: {
            my_target: {
                files: {
                    "js/production.js": ["js/production.js"]
                }
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: "img/",
                    src: ["*.{png,jpg,gif}"],
                    dest: "img/"
                }]
            }
        },

        watch: {
            css: {
                files: "styles/*.less",
                tasks: "buildcss"
            },
            scripts: {
                files: ["js/project.js", "Gruntfile.js"],
                tasks: "buildjs"
            }
        }

    });

    // List of available tasks
    grunt.registerTask("default", []);
    grunt.registerTask("buildcss", ["less", "autoprefixer", "csslint", "cssmin"]);
    grunt.registerTask("buildjs", ["jshint", "concat", "uglify"]);
    grunt.registerTask("buildimg", ["imagemin"]);

};
