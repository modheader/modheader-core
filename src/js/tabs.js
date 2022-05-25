let tabInfo = {};

export async function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
        windowType: 'normal'
      },
      (tabs) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (tabs && tabs.length > 0) {
          resolve(tabs[0]);
        } else {
          resolve(undefined);
        }
      }
    );
  });
}

export async function queryTabs(queryParams) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(queryParams, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tabs || []);
      }
    });
  });
}

export async function getTab(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tab);
      }
    });
  });
}

export function lookupTabInfo(tabId) {
  return tabInfo[tabId];
}

async function refreshTabInfo() {
  const tabs = await queryTabs({});
  tabInfo = {};
  for (const tab of tabs) {
    tabInfo[tab.id] = {
      groupId: tab.groupId,
      windowId: tab.windowId
    };
  }
}

export function openUrl({ url, path, params = {} }) {
  if (url && path) {
    throw new Error('Only one of url or path should be set.');
  }
  let parsedUrl;
  if (path) {
    parsedUrl = new URL(`${process.env.URL_BASE}${path}`);
  } else {
    parsedUrl = new URL(url);
  }
  if (Object.keys(params).length > 0) {
    for (const [key, value] of Object.entries(params)) {
      parsedUrl.searchParams.set(key, value);
    }
  }
  chrome.tabs.create({ url: parsedUrl.href }, () => {
    window.close();
  });
}

export async function setupTabUpdatedListener() {
  chrome.tabs.onAttached.addListener(refreshTabInfo);
  chrome.tabs.onUpdated.addListener(refreshTabInfo);
  await refreshTabInfo();
}
