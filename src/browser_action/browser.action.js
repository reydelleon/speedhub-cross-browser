/**
 * @module      browser.action
 * @author      Reydel Leon-Machado
 * @copyright   (c) 2014 Reydel Leon-Machado
 * @license     Licensed under MIT license
 */

window.onload = function () {
    var reposList,
        goChrome;

    goChrome = function () {
        chrome.runtime.sendMessage({ cmd: "update_cache"}, function (response) {
            console.log('Update cache response: ' + response[200]);
        });

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.cmd === "update_view") {
                    var context = {},
                        items = request.items;

                        context.items = items.map(function (item) {
                            return item;
                        });

                        var templateHTML = document.querySelector('#listing_tmpl').innerHTML;
                        var templateFunction = Handlebars.compile(templateHTML);
                    var x = templateFunction(context);
                        document.querySelector('#repo-listings').innerHTML = x;
                }
            });
    };

    switch (BROWSER_AGENT.agent.name) {
        case ("safari"):
            console.log("Safari Storage");
            // Reach the global page using safari.extension.globalPage.contentWindow
            //return safariStorageAPI;
            break;
        case ("chrome"):
            goChrome();
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
};