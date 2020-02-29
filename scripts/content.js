/**
 * Copyright (c) 2018 Craig McNeill. All rights reserved.
 * Released under the MIT license (see LICENSE).
 */

(function() {
    // Ask the background script for the current settings
    let unitypeEnabled, currentFont, combosEnabled;
    chrome.runtime.sendMessage({action: 'getState'}, function(res) {
        // Set the enabled status and current font using the response
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            unitypeEnabled = res.enabled;
            currentFont = res.font;
            combosEnabled = res.combos;
        }
    });

    // Listen for keypress events targeting text fields
    function unitype(e) {
        if (!unitypeEnabled || e.ctrlKey || e.metaKey || e.altKey) return;
        let tag = e.target;
        let tagName = tag.tagName;
        if (e.which && (tagName === 'INPUT' || tagName === 'TEXTAREA' || tag.isContentEditable)) {
            let char = String.fromCharCode(e.which);
            let map = unitypeFonts[currentFont];
            if (map.hasOwnProperty(char)) {
                // Get the selection start and end positions within the text of the element
                let start, end, val, newChar, sel, range;
                if (tag.isContentEditable) {
                    sel = window.getSelection();
                    if (!sel.rangeCount) return;
                    range = sel.getRangeAt(0);
                    let temp = range.cloneRange();
                    temp.setStart(tag, 0);
                    end = temp.toString().length;
                    temp.setEnd(range.startContainer, range.startOffset);
                    start = temp.toString().length;
                    temp.detach();
                    val = tag.textContent;
                } else {
                    start = tag.selectionStart;
                    end = tag.selectionEnd;
                    val = tag.value;
                }
                
                // Check if this font has special combinations
                let combo = checkCombo(char, map, val, start, end);
                if (combo) {
                    newChar = combo.char;
                    start = combo.start;
                    end = combo.end;
                } else {
                    newChar = map[char];
                }

                // Replace the selection with the special character(s)
                if (tag.isContentEditable) {
                    if (combo) {
                        // Modify the current selection to include the adjacent combo chars
                        let rel = getRelativeOffset(tag, start);
                        range.setStart(rel.node, rel.offset);
                        rel = getRelativeOffset(tag, end);
                        range.setEnd(rel.node, rel.offset);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                    document.execCommand('insertText', false, newChar);
                } else {
                    tag.value = val.slice(0, start) + newChar + val.slice(end);
                    tag.selectionStart = tag.selectionEnd = start + newChar.length;
                }

                // Trigger an input event on the control
                tag.dispatchEvent(new Event('input', {bubbles: true}));

                e.preventDefault();
                return false;
            }
        }
    }
    window.addEventListener('keypress', unitype);

    // Check for special character combos and resolve them
    function checkCombo(char, map, val, start, end) {
        if (!combosEnabled || !map.hasOwnProperty('combo')) return false;
        let newChar;
        for (let seq in map.combo) {
            let found = false;
            let shiftLeft = shiftRight = 0;
            if (char === seq[seq.length - 1] && start >= seq.length - 1) {
                found = true;
                for (let i = seq.length - 2; i >= 0; i--) {
                    shiftLeft++;
                    let lPos = start - shiftLeft;
                    let lChar = lPos >= 0 ? val.slice(lPos, lPos + 1) : false;
                    if (seq[i] !== lChar) {
                        found = false;
                        shiftLeft = 0;
                        break;
                    }
                }
            }
            if (!found && char === seq[0] && val.length - end + 2 >= seq.length) {
                found = true;
                for (let i = 1; i < seq.length; i++) {
                    shiftRight++;
                    let rPos = end + shiftRight - 1;
                    let rChar = rPos < val.length ? val.slice(rPos, rPos + 1) : false;
                    if (seq[i] !== rChar) {
                        found = false;
                        shiftRight = 0;
                        break;
                    }
                }
            }
            if (found) {
                return {
                    char: map.combo[seq],
                    start: start - shiftLeft,
                    end: end + shiftRight
                };
            }
        }
        return false;
    }

    // Translate an absolute selection offset into one relative to a text node
    function getRelativeOffset(container, offset, sub = false) {
        for (let node of container.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                let len = node.textContent.length;
                if (offset <= len) {
                    return {node, offset};
                }
                offset -= len;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                let rel = getRelativeOffset(node, offset, true);
                if (rel.node) {
                    return rel;
                }
                offset = rel.offset;
            }
        }
        if (sub) {
            return {node: false, offset};
        }
        return {node: container, offset: 0};
    }

    // Listen for messages from the background control script
    function handleMessage(msg) {
        if (msg.hasOwnProperty('enabled')) {
            unitypeEnabled = msg.enabled;
        }
        if (msg.hasOwnProperty('font')) {
            currentFont = msg.font;
        }
        if (msg.hasOwnProperty('combos')) {
            combosEnabled = msg.combos;
        }
    }
    chrome.runtime.onMessage.addListener(handleMessage);
})();