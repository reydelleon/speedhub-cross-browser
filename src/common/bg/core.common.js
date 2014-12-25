/**
 * @module      core.common
 * @author      Reydel Leon-Machado
 * @copyright   (c) 2014 Reydel Leon-Machado
 * @license     Licensed under MIT license
 */

// This module serves as a background page.

var settings = new Store("settings", {
    "sample_setting": "This is how you use Store.js to remember values"
});

var SPEEDHUB = SPEEDHUB || {};

/**
 * Provides a way to create namespaces with any level of nesting (e.g. MYAPP.module1.methodX)
 * @function
 * @param {string} ns_string The namespace that will be created. Support nested namespaces (e.g. MYAPP.module1.methodX).
 */
SPEEDHUB.namespace = function (ns_string) {
    "use strict";

    var parts = ns_string.split('.'),
        parent = SPEEDHUB,
        i;

//    Strip unnecessary leading global
    if (parts[0] === "SPEEDHUB") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        //Create a property if it doesn't exists
        if (parent[parts[i]] === undefined) {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }

    return parent;
};

SPEEDHUB.namespace('SPEEDHUB.storage');

/**
 * Provides methods to interact with the underlying storage. This methods are browser agnostic.
 */
SPEEDHUB.storage = (function () {
    switch (BROWSER_AGENT.agent.name) {
        case ("safari"):
            console.log("Safari Storage");
            // Reach the global page using safari.extension.globalPage.contentWindow
            //return safariStorageAPI;
            break;
        case ("chrome"):
            console.log("Chrome Storage");
            // Reach the global page using chrome.extension.getBackgroundPage()
            return chromeStorageAPI;
            break;
        case ("firefox-require"):
            console.log("Firefox Storage");
        case ("firefox-addon"):
            console.log("Firefox Storage");
            //return firefoxStorageAPI;
            break;
        default:
            throw Error('Could not detect underlying storage API!');
    }
}());

SPEEDHUB.namespace('SPEEDHUB.github');

/**
 * Creates a module to wrap the API provided by Github.js and hold github related data and methods
 */
SPEEDHUB.github = (function () {
    "use strict";

    var storageHandle = SPEEDHUB.storage,
        githubClient,
        getRepo,
        getRepoCache,
        updateCache;
    /**
     * @type {Window.Github}
     */
    githubClient = new Github({
        token: 'ddd',
        oauth: "oauth"
    });

    /**
     * Returns the repository object with the specified id.
     * If refresh is set to <tt>true</tt> the repository will be retrieved from Github directly and updated in the local cache. Otherwise, the repository will be taken from the local cache.
     * @param {number} id The id of the repository that is being retrieved.
     * @param {boolean} refresh Whether or not the object should be retrieved from Github. If missing, the repository will be taken from the local cache.
     * @returns {Object} - The repository with the specified id.
     */
    getRepo = function (id, refresh) {
        var repo = reposCache.filter(function (repo) {
            if (repo.id === parseInt(id, 10)) {
                return repo;
            }
        })[0];

        if (refresh) {
            repo = githubClient.getRepo(repo.owner.login, repo.name);
        }

        return repo;
    };

    /**
     * Returns an array with the repositories in cache.
     * @returns {Array | undefined} - An array of repository objects or <tt>undefined</tt> if no repositories are recovered.
     */
    getRepoCache = function () {
        return storageHandle.get('reposCache', function (items) {
            if (items.reposCache) {
                return items.reposCache;
            } else {
                return undefined;
            }
        });
    };

    /**
     * Updates the repositories cache from Github. It will post a notification if the operation fails.
     * @param callback Callback with the repositories pulled from Github.
     *
     * The callback parameter should be a function that looks like this:
     * <tt>function(Error err, object items) {...};</tt>
     */
    updateCache = function (callback) {
        githubClient.getUser().repos(function (err, items) {
            if (err) {
                callback(err);
            }

            SPEEDHUB.storage.set({ reposCache: items }, function () {
                callback(err, items);
            });
        });
    };

    return {
        //Public API
        client: githubClient,
        getRepo: getRepo,
        getRepoCache: getRepoCache,
        updateCache: updateCache
    };
}());

SPEEDHUB.namespace('SPEEDHUB.util');

/**
 * Provides useful support methods.
 */
SPEEDHUB.util = (function () {
    "use strict";

    return {};
}());

SPEEDHUB.namespace('SPEEDHUB.util.moment');

SPEEDHUB.util.moment = (function () {
    "use strict";

    return moment;
});

SPEEDHUB.namespace('SPEEDHUB.notifications');

/**
 * Provides notification logic.
 */
SPEEDHUB.notifications = (function () {
    "use strict";

    var notifications = Object.create(Object);

    //Define the public API
    /**
     * Shows a notification to the user using the underlying Notifications API.
     * @type {Function}
     */
    notifications.prototype.postOSNotification = (function (title, options) {
        //TODO: Display notification with the underlying system.
    });

    return notifications;
}());

//Initialize the extension
(function () {
    var initChrome;

    initChrome = function () {
        //Listen to messages from the popup or other parts of the extension
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.cmd === "update_cache") {
                    updateView();
                    sendResponse({200: "OK"});
                }
            });

        function updateView() {
            SPEEDHUB.github.updateCache(function (err, items) {
                if (err) {
                    console.log("I'm having problems to update the cache");
                }

                chrome.runtime.sendMessage({ cmd: "update_view", items: items});
            });
        }
    };

    switch (BROWSER_AGENT.agent.name) {
        case ("safari"):
            console.log("Safari Storage");
            // Reach the global page using safari.extension.globalPage.contentWindow
            //return safariStorageAPI;
            break;
        case ("chrome"):
            initChrome();
            break;
        case ("firefox-require"):
            console.log("Firefox Storage");
        case ("firefox-addon"):
            console.log("Firefox Storage");
            //return firefoxStorageAPI;
            break;
        default:
            throw Error('Could not detect underlying storage API!');
    }
}());