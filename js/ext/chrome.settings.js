/**
 * @module      chrome.settings
 * @author      Reydel Leon Machado
 * @copyright   (c) 2014 Reydel Leon Machado
 * @license     Licensed under MIT license
 */

if (typeof define === 'function' && define.amd) {
    define(['chrome.storage'], function (chromeStorage) {
        "use strict";

        var getPersonalKey;

        /**
         * Retrieves the Github personal key and passes it as a parameter to the callback function.
         * @param {function} callback with personal key.
         *
         * The callback parameter should be a function that looks like this:
         * <tt>function(object items) {...};</tt>
         */
        getPersonalKey = function (callback) {
            chromeStorage.get('store.settings.personalKey', callback);
        };

        return {
            getPersonalKey: getPersonalKey
        };
    });
}