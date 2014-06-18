module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner:
            '/*!\n'+
            ' * jQuery TinyGradient <%= pkg.version %>\n'+
            ' * Copyright <%= grunt.template.today("yyyy") %> Damien "Mistic" Sorel (http://www.strangeplanet.fr)\n'+
            ' * Licensed under MIT (http://opensource.org/licenses/MIT)\n'+
            ' */',

        // compress js
        uglify: {
            options: {
                banner: '<%= banner %>\n'
            },
            dist: {
                files: {
                    'tinygradient.min.js': [
                        'tinygradient.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'uglify'
    ]);
};