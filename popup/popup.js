/**
 * Copyright (c) 2018 Craig McNeill. All rights reserved.
 * Released under the MIT license (see LICENSE).
 */

// Initialize page state
let btnToggle = document.getElementById('toggle');
let fontButtons = document.getElementsByClassName('btn-font');
setEnabled();
setFont();

// Enable/disable unitype
btnToggle.addEventListener('mousedown', function() {
    localStorage.enabled = localStorage.enabled == 1 ? 0 : 1;
    setEnabled();
    browser.runtime.sendMessage({action: 'updateEnabled'});
});
function setEnabled() {
    if (localStorage.enabled == 1) {
        btnText = 'UniType is ON';
        btnToggle.classList.add('on');
    } else {
        btnText = 'UniType is OFF';
        btnToggle.classList.remove('on');
    }
    btnToggle.innerText = btnText;
}


// Font selection
for (let i = 0; i < fontButtons.length; i++) {
    fontButtons[i].addEventListener('mousedown', function(e) {
        let btn = e.target;
        localStorage.font = btn.id;
        setFont();
    });
}
function setFont() {
    btns = Array.from(fontButtons);
    btns.forEach(btn => btn.classList.remove('on'));
    btns.filter(btn => btn.id === localStorage.font)[0].classList.add('on');
    browser.runtime.sendMessage({action: 'updateFont'});
}