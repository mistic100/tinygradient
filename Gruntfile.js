module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner:
            '/*!\n'+
            ' * TinyGradient <%= pkg.version %>\n'+
            ' * Copyright 2014-<%= grunt.template.today("yyyy") %> Damien "Mistic" Sorel (http://www.strangeplanet.fr)\n'+
            ' * Licensed under MIT (http://opensource.org/licenses/MIT)\n'+
            ' */',

        // compress js
        uglify: {
            options: {
                banner: '<%= banner %>\n'
            },
            dist: {
                src: 'tinygradient.js',
                dest: 'tinygradient.min.js'
            }
        },

        // jshint tests
        jshint: {
            lib: {
                src: 'tinygradient.js'
            }
        },

        // mocha tests
        mochaTest: {
            unit: {
                src: 'tests/*.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', [
        'uglify'
    ]);

    grunt.registerTask('test', [
        'mochaTest',
        'jshint'
    ]);
};