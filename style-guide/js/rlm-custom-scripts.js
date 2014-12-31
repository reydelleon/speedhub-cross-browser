/**
 * @module rlm0-custom-scripts
 * @author      Reydel Leon-Machado
 * @copyright   (c) 2014 Reydel Leon-Machado
 * @license     Licensed under MIT license
 */
window.addEventListener('HTMLImportsLoaded', function () {
    "use strict";

    var links,
        i,
        item,
        content,
        parent,
        developLinks,//TODO: Delete?
        turns;//TODO: Delete?

    links = document.querySelectorAll('link[rel="import"]');

    for (i = 0; i < links.length; i += 1) {
        item = links[i];  // Calling myNodeList.item(i) isn't necessary in JavaScript
        content = item.import;

        parent = item.parentNode;
        parent.removeChild(item);
        parent.appendChild(content.querySelector(item.getAttribute("data-action")));
    }

    /**
     *
     * @param {HTMLDocument} child_link
     */
    //developLinks = function (document, index) {
    //
    //    links = document.querySelectorAll('link[rel="import"]');
    //
    //    turns = links.length;
    //
    //    if (index <= turns) {
    //        developLinks(links[index].import, index + 1);
    //    } else {
    //        for (i = 0; i < links.length; i += 1) {
    //            item = links[i];  // Calling myNodeList.item(i) isn't necessary in JavaScript
    //            content = item.import;
    //
    //            parent = item.parentNode;
    //            parent.removeChild(item);
    //            parent.appendChild(content.querySelector(item.getAttribute("data-action")));
    //        }
    //    }
    //};
    //
    //developLinks(document, 0);
});
