# UniType
UniType is a browser extension that allows you to easily type in special unicode fonts on any site (as long as it supports unicode).

# Browser Compatibility
- Firefox: Working (v.62)
- Chrome: Working (v.69)
- Edge: Not tested
- Opera: Not tested
- Safari: Not tested

# Changelog
- 1.1.0
  - Added support for `contenteditable` elements
  - Fixed buggy behaviour with certain frameworks/websites

# How to package extension for Firefox
Open bash terminal, cd to the project directory and run:
```
zip -r -FS ../unitype-VERSION.zip * -x \*.git\* .gitignore README.md
```