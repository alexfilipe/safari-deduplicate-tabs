const api = globalThis.browser ?? globalThis.chrome;

const TITLE_LIMIT = 72;
const URL_LIMIT = 84;

const summaryElement = document.getElementById("summary");
const duplicatesListElement = document.getElementById("duplicates-list");
const emptyStateElement = document.getElementById("empty-state");
const confirmButton = document.getElementById("confirm-button");
const cancelButton = document.getElementById("cancel-button");

let duplicateGroups = [];

cancelButton.addEventListener("click", () => {
  window.close();
});

confirmButton.addEventListener("click", async () => {
  if (duplicateGroups.length === 0) {
    return;
  }

  confirmButton.disabled = true;
  cancelButton.disabled = true;
  summaryElement.textContent = "Closing duplicate tabs...";

  const tabIdsToClose = duplicateGroups.flatMap((group) =>
    group.tabs.slice(1).map((tab) => tab.id),
  );

  try {
    await removeTabs(tabIdsToClose);

    const closedTabsCount = tabIdsToClose.length;
    summaryElement.textContent = `Closed ${closedTabsCount} duplicate tab${closedTabsCount === 1 ? "" : "s"} across ${duplicateGroups.length} repeated URL${duplicateGroups.length === 1 ? "" : "s"}.`;
    confirmButton.textContent = "Done";
  } catch (error) {
    console.error("Failed to close duplicate tabs", error);
    summaryElement.textContent = "Safari could not close the duplicate tabs. Please try again.";
    cancelButton.disabled = false;
  }
});

void loadDuplicateTabs();

async function loadDuplicateTabs() {
  try {
    const tabs = await queryTabs({ currentWindow: true });
    duplicateGroups = collectDuplicateGroups(tabs);
    renderDuplicateGroups(duplicateGroups);
  } catch (error) {
    console.error("Failed to inspect tabs", error);
    duplicateGroups = [];
    confirmButton.disabled = true;
    emptyStateElement.hidden = false;
    summaryElement.textContent = "Safari could not inspect tabs in the current window.";
  }
}

function collectDuplicateGroups(tabs) {
  const groupsByUrl = new Map();

  for (const tab of tabs) {
    if (!tab.url || typeof tab.id !== "number") {
      continue;
    }

    const existingGroup = groupsByUrl.get(tab.url);

    if (existingGroup) {
      existingGroup.tabs.push(tab);
      continue;
    }

    groupsByUrl.set(tab.url, { url: tab.url, tabs: [tab] });
  }

  return Array.from(groupsByUrl.values())
    .filter((group) => group.tabs.length > 1)
    .sort((left, right) => {
      const leftIndex = left.tabs[0]?.index ?? Number.MAX_SAFE_INTEGER;
      const rightIndex = right.tabs[0]?.index ?? Number.MAX_SAFE_INTEGER;
      return leftIndex - rightIndex;
    });
}

function renderDuplicateGroups(groups) {
  duplicatesListElement.replaceChildren();

  if (groups.length === 0) {
    confirmButton.disabled = true;
    emptyStateElement.hidden = false;
    summaryElement.textContent = "No duplicate URLs found. Nothing needs to be closed.";
    return;
  }

  emptyStateElement.hidden = true;
  confirmButton.disabled = false;

  const duplicateTabsCount = groups.reduce((total, group) => total + group.tabs.length - 1, 0);

  summaryElement.textContent = `One tab per URL will stay open. ${duplicateTabsCount} duplicate tab${duplicateTabsCount === 1 ? "" : "s"} can be removed from ${groups.length} repeated URL${groups.length === 1 ? "" : "s"}.`;

  for (const group of groups) {
    const representativeTab = group.tabs.find((tab) => tab.title) ?? group.tabs[0];
    const item = document.createElement("li");
    item.textContent = formatGroupLine(
      representativeTab.title || group.url,
      group.url,
      group.tabs.length,
    );
    duplicatesListElement.appendChild(item);
  }
}

function formatGroupLine(title, url, count) {
  return `${truncate(title, TITLE_LIMIT)} - (${truncate(url, URL_LIMIT)}) (${count})`;
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}…`;
}

function queryTabs(queryInfo) {
  if (globalThis.browser?.tabs?.query) {
    return globalThis.browser.tabs.query(queryInfo);
  }

  return new Promise((resolve, reject) => {
    api.tabs.query(queryInfo, (tabs) => {
      const runtimeError = api.runtime?.lastError;

      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }

      resolve(tabs);
    });
  });
}

function removeTabs(tabIds) {
  if (globalThis.browser?.tabs?.remove) {
    return globalThis.browser.tabs.remove(tabIds);
  }

  return new Promise((resolve, reject) => {
    api.tabs.remove(tabIds, () => {
      const runtimeError = api.runtime?.lastError;

      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }

      resolve();
    });
  });
}
