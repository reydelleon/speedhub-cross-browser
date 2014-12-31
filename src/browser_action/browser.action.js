/**
 * @module      browser.action
 * @author      Reydel Leon-Machado
 * @copyright   (c) 2014 Reydel Leon-Machado
 * @license     Licensed under MIT license
 */

window.onload = function () {
    var reposList,
        goChrome,
        handleListingClick;

    /**
     * Handles the onClick events in a listing (i.e a <tt>li</tt> element).
     * This method covers all the possible actions derived from an click event in the listing. It relies in the data-action attribute of the affected element to decide which action to execute.
     * @param {MouseEvent} event The mouse event that triggered the function invocation.
     */
    handleListItemClick = function (event) {
        var listingLI,
            action;

        event.stopPropagation();
        event.preventDefault();

        listingLI = event.currentTarget;
        action = event.target.getAttribute('data-action');

        if (action) {
            chrome.runtime.sendMessage({ cmd: "open_tab", id: listingLI.id });
        }
    };

    goChrome = function () {
        chrome.runtime.sendMessage({ cmd: "update_cache" }, function (response) {
            console.log('Update cache response: ' + response[200]);
        });

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.cmd === "update_view") {
                    var context = {};

                    context.items = request.items;

                    var templateHTML = document.querySelector('#listing_tmpl').innerHTML;
                    var templateFunction = Handlebars.compile(templateHTML);
                    document.querySelector('#repo-listings').innerHTML = templateFunction(context);

                    //Set the onclick event
                    [].forEach.call(document.querySelectorAll('#repo-listings li'), function (item) {
                        item.onclick = handleListItemClick;
                    });
                }
            });
    };

    switch (BROWSER_AGENT.agent.name) {
        case ("safari"):
            console.log("Safari Storage");
            // Reach the global page using safari.extension.globalPage.contentWindow
            //return safariStorageAPI;
            break;
        case "chrome":
            goChrome();
            break;
        case "firefox-require":
            console.log("Firefox Storage");
        case "firefox-addon":
            console.log("Firefox Storage");
            //return firefoxStorageAPI;
            break;
        default:
            throw Error('Could not detect underlying storage API!');
    }

    Handlebars.registerHelper("languageIcon", function (languaje) {
        "use strict";

        switch (languaje) {
            case "JavaScript":
                return "icon ion-social-javascript";
                break;
            case "CSS":
                return "icon ion-social-css3";
                break;
            case "PHP":
                return "icon ion-social-php";
                break;
            default:
                return "";
        }
    });
};