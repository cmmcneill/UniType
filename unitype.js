/**
 * Copyright (c) 2018 Craig McNeill. All rights reserved.
 * Released under the MIT license (see LICENSE).
 */
(function() {
    let charMap = {
        ' ': ' ',
        '!': '！',
        '"': '＂',
        '#': '＃',
        '$': '＄',
        '%': '％',
        '&': '＆',
        '\'': '＇',
        '(': '（',
        ')': '）',
        '*': '＊',
        '+': '＋',
        ',': '，',
        '-': '－',
        '.': '．',
        '/': '／',
        '0': '０',
        '1': '１',
        '2': '２',
        '3': '３',
        '4': '４',
        '5': '５',
        '6': '６',
        '7': '７',
        '8': '８',
        '9': '９',
        ':': '：',
        ';': '；',
        '<': '＜',
        '=': '＝',
        '>': '＞',
        '?': '？',
        '@': '＠',
        'A': 'Ａ',
        'B': 'Ｂ',
        'C': 'Ｃ',
        'D': 'Ｄ',
        'E': 'Ｅ',
        'F': 'Ｆ',
        'G': 'Ｇ',
        'H': 'Ｈ',
        'I': 'Ｉ',
        'J': 'Ｊ',
        'K': 'Ｋ',
        'L': 'Ｌ',
        'M': 'Ｍ',
        'N': 'Ｎ',
        'O': 'Ｏ',
        'P': 'Ｐ',
        'Q': 'Ｑ',
        'R': 'Ｒ',
        'S': 'Ｓ',
        'T': 'Ｔ',
        'U': 'Ｕ',
        'V': 'Ｖ',
        'W': 'Ｗ',
        'X': 'Ｘ',
        'Y': 'Ｙ',
        'Z': 'Ｚ',
        '[': '［',
        '\\': '＼',
        ']': '］',
        '^': '＾',
        '_': '＿',
        '`': '｀',
        'a': 'ａ',
        'b': 'ｂ',
        'c': 'ｃ',
        'd': 'ｄ',
        'e': 'ｅ',
        'f': 'ｆ',
        'g': 'ｇ',
        'h': 'ｈ',
        'i': 'ｉ',
        'j': 'ｊ',
        'k': 'ｋ',
        'l': 'ｌ',
        'm': 'ｍ',
        'n': 'ｎ',
        'o': 'ｏ',
        'p': 'ｐ',
        'q': 'ｑ',
        'r': 'ｒ',
        's': 'ｓ',
        't': 'ｔ',
        'u': 'ｕ',
        'v': 'ｖ',
        'w': 'ｗ',
        'x': 'ｘ',
        'y': 'ｙ',
        'z': 'ｚ',
        '{': '｛',
        '|': '｜',
        '}': '｝',
        '~': '～'
    };
    function unitype(e) {
        let tag = e.target;
        let tagName = tag.tagName;
        console.log(tag);
        if (e.which && (tagName === 'INPUT' || tagName === 'TEXTAREA')) {
            let char = String.fromCharCode(e.which);
            console.log(char);
            if (charMap.hasOwnProperty(char)) {
                let start = tag.selectionStart, end = tag.selectionEnd, val = tag.value, newChar;
                let lChar = start > 0 ? val.slice(start - 1, start) : false;
                let rChar = end < val.length ? val.slice(end, end + 1) : false;
                if (char ==='(' && (lChar === '（' || rChar === '（')) {
                    newChar = '｟';
                    if (lChar === '（') {
                        start--;
                    } else {
                        end++;
                    }
                } else if (char === ')' && (lChar === '）' || rChar === '）')) {
                    newChar = '｠';
                    if (lChar === '）') {
                        start--;
                    } else {
                        end++;
                    }
                } else {
                    newChar = charMap[char];
                }
                console.log(char + ' => ' + newChar);
                tag.value = val.slice(0, start) + newChar + val.slice(end);
                tag.selectionStart = tag.selectionEnd = start + 1;
                e.preventDefault();
                return false;
            }
        }
    }
    window.addEventListener('keypress', unitype);
})();