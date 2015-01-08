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

// Define the entry-point module
define(['chrome.storage', 'chrome.tabs', 'lib/github'],
    function (chromeStorage, chromeTabs) {
        'use strict';

        // Define the Global Object that will hold the extension functionality
        SPEEDHUB = {};

        var getLocalRepos;

        /**
         * Executes the callback with an array of repositories as the parameter.
         * @param {function} callback
         */
        getLocalRepos = function (callback) {
            chromeStorage.get('localRepos',
                function (items) {
                    callback(items.localRepos);
                },
                'chrome.local');
        };

        // Take care of the extension lifecycle.
        chrome.runtime.onInstalled.addListener(
            function (details) {
                // Create dummy data to populate the local storage for testing purposes.
                var dummyData = [
                    {
                        name: 'speedhub-cross-browser',
                        description: 'Provides easy access to basic Github operations and notifications in the browser toolbar',
                        username: 'reydelleon',
                        language: 'CSS',
                        age: '20 Days'
                    },
                    {
                        name: 'advanced-magento-tax-report',
                        description: 'Adds a tax report aggregated by cities/states (using a grid) in Magento',
                        username: 'reydelleon',
                        language: 'JavaScript',
                        age: 'last month'
                    }
                ];

                switch (details.reason) {
                    case 'install':
                        chromeStorage.set({ localRepos: dummyData },
                            function () {
                                console.log('dummyData saved');
                            },
                            'chrome.local');

                        // Show the options page to the user
                        chromeTabs.create({
                                active: true,
                                url: 'src/chrome/options_custom/index.html'
                            },
                            null);
                        break;
                }
            });

        chrome.storage.onChanged.addListener(
            function (changes, namespace) {
                var key,
                    storageChange;

                for (key in changes) {
                    storageChange = changes[key];
                    console.log('Storage key "%s" in namespace "%s" changed. ' +
                        'Old value was "%s", new value is "%s".',
                        key,
                        namespace,
                        storageChange.oldValue,
                        storageChange.newValue);
                }
            });

        window.addEventListener(
            'storage',
            function (e) {
                switch (e.key) {
                    case 'store.settings.personalKey':
                        console.log(JSON.parse(e.newValue));
                        var githubClient = new Github({
                            token: JSON.parse(e.newValue),
                            oauth: "oauth"
                        });

                        githubClient.getUser().repos(
                            function (err, items) {
                                if (err) {
                                    throw new Error(err.message);
                                }

                                chromeStorage.set(
                                    { localRepos: items },
                                    null,
                                    'chrome.local'
                                );
                            });
                        break;
                }
            });

        // Bind all functions to an object in the Global Space to make them accessible from the outside scripts
        // referencing the BackgroundPage object
        SPEEDHUB.getLocalRepos = getLocalRepos;
    });