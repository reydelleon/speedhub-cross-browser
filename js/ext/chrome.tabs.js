/**
 * @module      chrome.tabs
 * @author      Reydel Leon Machado
 * @copyright   (c) 2014 Reydel Leon-Machado
 * @license     Licensed under MIT license
 */

if (typeof define === 'function' && define.amd) {
    define([], function () {
        "use strict";

        var create;

        /**
         * Creates a new tab.
         * @param {Object} properties An object containing the properties for the tab to be created.
         * @param {function} callback Optional callback.
         * If you specify the callback parameter, it should be a function that looks like this:
         *
         * function( Tab tab) {...};
         * @see https://developer.chrome.com/extensions/tabs for more details on the properties object.
         */
        create = function (properties, callback) {
            chrome.tabs.create(properties, callback); //TODO: This is not working at all
        };

        return {
            create: create
        };
    });
}