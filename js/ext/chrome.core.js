/**
 * @module      chrome.core
 * @author      Reydel Leon Machado
 * @copyright   (c) 2014 Reydel Leon Machado
 * @license     Licensed under MIT license
 */

if (typeof define === 'function' && define.amd) {
    define([],
        function () {
            "use strict";

            var onInstall,
                onBackgroundPageLoad;

            onInstall = function () {
                console.log('Implement initialization logic');
            };
            
            onBackgroundPageLoad = function () {
                console.log('Implement onBackgroundPageLoad logic');
            };

            return {
                onInstall: onInstall,
                onBackgroundPageLoad: onBackgroundPageLoad
            };
        });
}