let enabled = false;
function toggleUnitype() {
    // Update the toolbar button's icon and title
    let path, title;
    enabled = !enabled;
    if (enabled) {
        path = {
            "16": "icons/unitype_on_16.png",
            "32": "icons/unitype_on_32.png"
        };
        title = 'Turn UniType off';
    } else {
        path = {
            "16": "icons/unitype_off_16.png",
            "32": "icons/unitype_off_32.png"
        };
        title = 'Turn UniType on';
    }
    browser.browserAction.setIcon({path: path});
    browser.browserAction.setTitle({title: title});

    // Enable/disable the unitype content scripts
    sendMessageToAllTabs({enabled: enabled});
}
browser.browserAction.onClicked.addListener(toggleUnitype);

// Sends a message to all tabs in any window
function sendMessageToAllTabs(msg) {
    browser.tabs.query({}).then(function(tabs) {
        for (let tab of tabs) {
            browser.tabs.sendMessage(tab.id, msg).catch(function() {});
        }
    });
}