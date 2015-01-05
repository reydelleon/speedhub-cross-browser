module.exports = function (grunt) {
    grunt.initConfig({
        requirejs: {
            compile: {
                options: {
                    baseUrl: "js/ext",
                    mainConfigFile: "js/app.js",
                    name: "../app",
                    include: [
                        "../lib/almond"
                    ],
                    skipModuleInsertion: true,
                    out: "js/apps.build.js",
                    wrap: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
};