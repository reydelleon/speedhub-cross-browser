/**
 * @module      chrome.storage
 * @author      Reydel Leon Machado
 * @copyright   (c) 2014 Reydel Leon Machado
 * @license     Licensed under MIT license
 */

if (typeof define === 'function' && define.amd) {
    define([], function () {
            "use strict";

            var webStorage,
                localStorage = chrome.storage.local, //This is Chrome's specific API (Not the W3C specification implementation)
                syncStorage = chrome.storage.sync, //This is Chrome's specific API (Not the W3C specification implementation)
                set,
                get;

            /**
             * Sets multiple items.
             * @param {Object} items An object which gives each key/value pair to update storage with. Any other key/value pairs
             * in storage will not be affected.
             * Primitive values such as numbers will serialize as expected. Values with a typeof "object" and "function" will
             * typically serialize to {}, with the exception of Array (serializes as expected), Date, and Regex (serialize using
             * their String representation).
             * @param {function} callback Callback on success, or on failure (in which case runtime.lastError will be set).
             *
             * If you specify the callback parameter, it should be a function that looks like this:
             *
             * <tt>function() {...};</tt>
             *
             * @param {string} storageType Defines what type of storage will be used to store the data. Accepted values are:
             * <tt>'local.storage'</tt> (HTML Web Storage specification); <tt>'chrome.local'</tt> (chrome.storage.local) and
             * <tt>'chrome.sync'</tt> (chrome.storage.sync). Standard HTML Storage specification ('local.storage') is assumed if no value
             * is provided.
             */
            set = function (items, callback, storageType) {
                storageType = storageType || 'local.storage';

                switch (storageType) {
                    case 'chrome.local':
                        localStorage.set(items, callback);
                        break;
                    default:
                        throw new Error('The storage type provided is not valid. Accepted values are: "local.storage", "chrome.local" and "chrome.sync"');
                }

            };

            /**
             * Gets one or more keys from storage.
             * @param {string | string[] | Object} keys A single key to get, list of keys to get, or a dictionary specifying default
             * values. An empty list or object will return an empty result object. Pass in <tt>null</tt>
             * to get the entire contents of storage.
             * @param {function} callback Callback with storage keys, or on failure (in which case runtime.lastError will be set).
             *
             * The callback parameter should be a function that looks like this:
             * <tt>function(object items) {...};</tt>
             *
             * @param {string} storageType Defines from which type of storage will the data be retrieved. Accepted values are:
             * <tt>'local.storage'</tt> (HTML Web Storage specification); <tt>'chrome.local'</tt> (chrome.storage.local) and
             * <tt>'chrome.sync'</tt> (chrome.storage.sync). Standard HTML Storage specification ('local.storage') is assumed if no value
             * is provided.
             */
            get = function (keys, callback, storageType) {
                storageType = storageType || 'local.storage';

                switch (storageType) {
                    case 'chrome.local':
                        localStorage.get(keys, callback);
                        break;
                    default:
                        throw new Error('The storage type provided is not valid. Accepted values are: "local.storage", "chrome.local" and "chrome.sync"');
                }
            };

            return {
                set: set,
                get: get
            };
        }
    )
    ;
}