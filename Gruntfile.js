module.exports = function (grunt) {
    grunt.initConfig({
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js/ext',
                    mainConfigFile: 'js/app.js',
                    name: '../app',
                    include: [
                        '../lib/almond'
                    ],
                    skipModuleInsertion: true,
                    out: 'js/app.build.js',
                    wrap: {
                        start: '(function(){',
                        end: 'require(["../app"], null, null, true);})();'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
};