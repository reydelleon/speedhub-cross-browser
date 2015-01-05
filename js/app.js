/**
 * @module      app
 * @author      Reydel Leon Machado
 * @copyright   (c) 2014 Reydel Leon-Machado
 * @license     Licensed under MIT license
 */

requirejs.config({
    //By default load any module IDs from js/ext
    baseUrl: 'js/ext',
    //except, if the module ID starts with 'app, etc.',
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a '.js' extension since
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

// Define the Global Object that will hold the extension functionality
var SPEEDHUB = SPEEDHUB || {};

// Start the main app logic.
requirejs(['chrome.storage', 'chrome.core'],
    function (chromeStorage, chromeCore) {
        'use strict';

        var getLocalRepos;

        /**
         * Executes the callback with an array of repositories as the parameter.
         * @param {function} callback
         */
        getLocalRepos = function (callback) {
            chromeStorage.get('localRepos', function (items) {
                callback(items.localRepos);
            });
        };

        // Take care of the extension lifecycle.
        //chrome.runtime.onInstalled.addListener(function (details) {
        // Create dummy data to populate the local storage for testing purposes.
        var dummyData = [
            {
                name: 'repo1',
                description: 'description1',
                username: 'reydel',
                age: 'theAge'
            },
            {
                name: 'repo2',
                description: 'description2',
                username: 'reydel',
                age: 'theAge'
            }
        ];

        //switch (details.reason) {
        //    case 'install':
        chromeStorage.set({ localRepos: dummyData }, function () {
            console.log('dummyData saved');
        });
        //break;
        //}
        //});

        // Bind all functions to an object in the Global Space to make them accessible from the outside scripts
        // referencing the BackgroundPage object
        SPEEDHUB.getLocalRepos = getLocalRepos;
    });