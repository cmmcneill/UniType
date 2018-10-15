/**
 * Copyright (c) 2018 Craig McNeill. All rights reserved.
 * Released under the MIT license (see LICENSE).
 */

// Initialize page state
let btnToggle = document.getElementById('toggle');
let fontButtons = document.getElementsByClassName('btn-font');
let btnCombos = document.getElementById('combos');
setEnabled();
setFont();
setCombos();

// Enable/disable unitype
btnToggle.addEventListener('mousedown', function() {
    localStorage.enabled = localStorage.enabled == 1 ? 0 : 1;
    setEnabled();
    chrome.runtime.sendMessage({action: 'updateEnabled'});
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
    fontButtons[i].addEventListener('mousedown', btnFontClicked);
}
function btnFontClicked(e) {
    let btn = e.target;
    localStorage.font = btn.id;
    setFont();
    chrome.runtime.sendMessage({action: 'updateFont'});
}
function setFont() {
    btns = Array.from(fontButtons);
    btns.forEach(btn => btn.classList.remove('on'));
    btns.filter(btn => btn.id === localStorage.font)[0].classList.add('on');
}

// Enable/disable special combination characters
btnCombos.addEventListener('mousedown', function() {
    localStorage.combos = localStorage.combos == 1 ? 0 : 1;
    setCombos();
    chrome.runtime.sendMessage({action: 'updateCombos'});
});
function setCombos() {
    if (localStorage.combos == 1) {
        btnText = 'Combos are ON';
        btnCombos.classList.add('on');
    } else {
        btnText = 'Combos are OFF';
        btnCombos.classList.remove('on');
    }
    btnCombos.innerText = btnText;
}