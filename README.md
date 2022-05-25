# ModHeader browser extension

<h3 align="center">
  ModHeader is a browser extension that allow you to modify HTTP request and response headers.
</h3>
<h3 align="center">
  <a href="https://modheader.com/">
    <img src="https://static.modheader.com/logo_2x.png" width="24px" alt="ModHeader" /> ModHeader official website
  </a>
</h3>
<p align="center">
  <a href="https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj">
    <img src="https://static.modheader.com/chrome.svg" width="48">
  </a>
  <a href="https://addons.mozilla.org/firefox/addon/modheader-firefox/">
    <img src="https://static.modheader.com/firefox_1x.png" srcset="https://static.modheader.com/firefox_2x.png 2x" width="48">
  </a>
  <a href="https://addons.opera.com/en/extensions/details/modheader/">
    <img src="https://static.modheader.com/opera.png" srcset="https://static.modheader.com/opera_2x.png 2x" width="48">
  </a>
  <a href="https://microsoftedge.microsoft.com/addons/detail/opgbiafapkbbnbnjcdomjaghbckfkglc">
    <img src="https://static.modheader.com/edge.svg" width="48">
  </a>
  
</p>

## Stats

<a href="https://chrome-stats.com/d/idgpnmonknjnojddfkpgkljpfnnfcklj">ModHeader stats</a>

## What can ModHeader do?
- Add/modify/remove request headers and response headers (you can use this to set X-Forwarded-For, Authorization, Access-Control-Allow-Origin: *)
- Modify individual cookies in Cookie request header / Set-Cookie response header
- Redirect URL with another
- Conditionally enable header modification based on URL and/or resource type
- Advanced filtering by tab, tab group, or window

## Why ModHeader
- ModHeader is fast, efficient, and light-weight. You can quickly enable/disable header modification with just 1-2 clicks.
- ModHeader provides you with many convenient features that will help you increase your development velocity with the least amount of frictions. Check out the big list the features below!
- ModHeader is free to use, with a paid option to unlock even more features.
- ModHeader works on Chrome, Firefox, Edge, and Opera.
- ModHeader is used by over 550,000+ users on Chrome Web Store!

## ModHeader features
- Add comments to header
- One-click "undo" if you made a mistake
- Support having multiple profiles with quick switching between profiles
- Export and import profile
- Easily share your profiles with others
- Customize autocomplete names and values
- Dark mode support
- Sorting headers and name, value, or comments
- Append value to existing request or response header
- Customizable profile badge
- Clone profile
- Cloud backup
  ...and more!!!

## Screenshots

<img src="https://static.modheader.com/screenshots/screenshot-caption-1.png">
<img src="https://static.modheader.com/screenshots/screenshot-caption-2.png">
<img src="https://static.modheader.com/screenshots/screenshot-caption-3.png">
<img src="https://static.modheader.com/screenshots/screenshot-caption-4.png">
<img src="https://static.modheader.com/screenshots/screenshot-caption-5.png">

## License

Although ModHeader is open source on GitHub, we do not want developers to fork and redistribute it without our
permissions. This is to protect our efforts as well as prevent spread of malicious extensions that pretend to be
ModHeader. You are free to fork and modify ModHeader for personal use. However, please reach out to us at
support@modheader.com before redistributing your own version of ModHeader to other people.

For more details on our terms of use and license, please consult https://modheader.com/terms. If you have
questions, please reach out to us at support@modheader.com.

## Installation

Run `npm install` first, then run `npm run start` to start development. The built packages will be in the dist/ directory.

## Selenium usage

If you need to use ModHeader for Selenium tests, please visit: [modheader_selenium](https://github.com/bewisse/modheader_selenium)

## Testing

ModHeader has two sets of tests: unit tests and e2e tests.

- Unit tests:

  - Run using `npm run test` command.
  - This will run all the unit tests (`*.test.js` files) in src/js/.

- E2E tests:
  - Before running this, before to build ModHeader using `npm run start-local-be`
  - Run using `npm run test-e2e` command.
  - This will run all the e2e-tests (`*.test.e2e.js` files) in e2e-tests/.
  - This will bring up Chrome WebDriver and load the ModHeader extension in a browser to make
    sure all features are still working correctly.
