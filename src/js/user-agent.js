export const BrowserType = {
  CHROME: 'chrome',
  FIREFOX: 'firefox',
  EDGE: 'edge',
  OPERA: 'opera'
};

export const CURRENT_BROWSER = process.env.BROWSER;

export function isChromiumBasedBrowser() {
  return CURRENT_BROWSER !== BrowserType.FIREFOX;
}
