/**
 * @module      browser.action
 * @author      Reydel Leon-Machado
 * @copyright   (c) 2014 Reydel Leon-Machado
 * @license     Licensed under MIT license
 */

window.onload = function () {
    "use strict";

    var handleListItemClick;

    /**
     * Handles the onClick events in a listing (i.e a <tt>li</tt> element).
     * This method covers all the possible actions derived from an click event in the listing. It relies in the data-action attribute of the affected element to decide which action to execute.
     * @param {MouseEvent} event The mouse event that triggered the function invocation.
     */
    handleListItemClick = function (event) {
        var repoLI,
            action;

        event.stopPropagation();
        event.preventDefault();

        repoLI = event.currentTarget;
        action = event.target.getAttribute('data-action');

        if (action) {
            chrome.runtime.sendMessage({ cmd: "open_tab", id: repoLI.id });
        }
    };

    chrome.runtime.getBackgroundPage(
        function (backgrondPageObject) {
            var SPEEDHUB = backgrondPageObject.SPEEDHUB,
                context = {},
                templateHTML,
                templateFunction;

            SPEEDHUB.getLocalRepos(function (items) {
                context.items = items;

                templateHTML = document.querySelector('#listing_tmpl').innerHTML;
                templateFunction = Handlebars.compile(templateHTML);
                document.querySelector('#repo-listings').innerHTML = templateFunction(context);

                [].forEach.call(document.querySelectorAll('#repo-listings li'), function (item) {
                    item.onclick = handleListItemClick;
                });
            });
        });

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