/**
 * @module      app
 * @author      Reydel Leon Machado
 * @copyright   (c) 2014 Reydel Leon-Machado
 * @license     Licensed under MIT license
 */

requirejs.config({
    //By default load any module IDs from js/ext
    baseUrl: 'js/ext',
    //except, if the module ID starts with "app, etc.",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        lib: '../lib',
        bower: '../../bower_components'
    },

    //Shim config
    shim: {
        'lib/handlebars': {
            exports: 'Handlebar'
        },

        'lib/underscore': {
            exports: '_'
        },

        'lib/github': {
            deps: ['lib/underscore'],
            exports: 'Github'
        },

        'bower/moment/moment': {
            exports: 'moment'
        }
    }
});

// Start the main app logic.
requirejs(['chrome.storage', 'chrome.settings', 'chrome.tabs', 'lib/handlebars', 'bower/moment/moment', 'lib/github', 'lib/underscore'],
    function (chromeStorage, chromeSettings, chromeTabs, handlebars, moment, github, _) {
        //jQuery, canvas and the app/sub module are all
        //loaded and can be used here now.
        console.log(chromeSettings);
    });