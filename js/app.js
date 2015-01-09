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

        var getLocalRepos,
            getRepo,
            githubClient;

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

        /**
         * Passes the repository associated with the id to the callback function.
         * @param {number} id The id of the repository that is being retrieved.
         * @param {function} callback Callback to execute with the repository retrieved as a parameter.
         */
        getRepo = function (id, callback) {
            chromeStorage.get(
                'localRepos',
                function (items) {
                    var repo = items.localRepos.filter(function (repo) {
                        if (repo.id === parseInt(id, 10)) {
                            return repo;
                        }
                    })[0];

                    callback(repo);
                },
                'chrome.local');
        };

        // Event listeners
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
                        githubClient = new Github({
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

                        githubClient.getUser().notifications(
                            function (err, notifications) {
                                if (err) {
                                    throw new Error("Couldn't retrieve notifications");
                                }

                                if (notifications && notifications.length !== 0) {
                                    chrome.browserAction.setBadgeText({ text: notifications.length.toString(10) });
                                }
                            }
                        );

                        break;
                    default:
                        break;
                }
            });

        // Listen to messages from the popup or other parts of the extension
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                switch (request.cmd) {
                    case "update_cache":
                        //updateView();
                        sendResponse({ 200: "OK" });
                        break;
                    case "open-repo":
                        getRepo(request.id, function (repo) {
                            chromeTabs.create({ url: repo.html_url });
                        });
                        break;
                    case 'download':
                        getRepo(request.id, function (repo) {
                            var url = repo.html_url + '/archive/master.zip';
                            chromeTabs.create({ url: url });
                        });
                        break;
                    default:
                        throw new Error('Unknown command: ' + request.cmd);
                }
            });

        // Bind all functions to an object in the Global Space to make them accessible from the outside scripts
        // referencing the BackgroundPage object
        SPEEDHUB.getLocalRepos = getLocalRepos;
    });