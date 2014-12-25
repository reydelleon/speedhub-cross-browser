/**
 * @module      agent
 * @author      Reydel Leon-Machado
 * @copyright   (c) 2014 Reydel Leon-Machado
 * @license     Licensed under MIT license
 *
 * This script is intended to be included in every non-background page file. It creates the BROWSER_AGENT module, that
 * provides useful methods to get a reference to the global page object and the agent.
 */

/**
 * @module
 */
var BROWSER_AGENT = (function () {
    var agent,
        globalPage;

    /**
     * Returns the browser name as a string.
     * @returns {Object | undefined} - An object representing the browser agent or <tt>undefined</tt> if the agent is not detected.
     * The browser name can be accessed doing:
     *
     * <tt>AGENT.agent</tt>
     */
    agent = (function () {
        switch (true) {
            case (typeof safari !== "undefined"):
                return { name: "safari" };
                break;
            case (typeof chrome !== "undefined"):
                return { name: "chrome" };
                break;
            case (typeof require !== "undefined"):
                return { name: "firefox-require" };
                break;
            case (typeof addon !== "undefined"):
                return { name: "firefox-addon" };
                break;
            default:
                return undefined;
        }
    }());

    /**
     * Returns the global page object for the extension.
     * @returns {Object} - The global page object for the extension.
     */
    globalPage = (function () {
        switch (agent.name) {
            case ("safari"):
                console.log("Safari");
                // Reach the global page using safari.extension.globalPage.contentWindow
                return safari.extension.globalPage.contentWindow;
                break;
            case ("chrome"):
                console.log("Chrome");
                // Reach the global page using chrome.extension.getBackgroundPage()
                return chrome.extension.getBackgroundPage(); //TODO: Refactor to use Event Pages (runtime.getBackgroundPage)
                break;
            case ("firefox-require"):
                console.log("Firefox - background");
            // Listen for a message using addon.port.on(messagename, callback);
            // Send a message using addon.port.emit(messagename, message);
                break;
            case ("firefox-addon"):
                console.log("Firefox - popup");
            // Listen for a message using addon.port.on(messagename, callback);
            // Send a message using addon.port.emit(messagename, message);
                break;
        }
    }());

    return {
        agent: agent,
        globalPage: globalPage
    };
}());