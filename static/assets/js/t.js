window.addEventListener("load", () => {
  navigator.serviceWorker.register("../sw.js?v=10-02-2024", { scope: "/a/" });

  const form = document.getElementById("fv");
  const input = document.getElementById("iv");

  if (form && input) {
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const formValue = input.value.trim();
      const url = isUrl(formValue)
        ? prependHttps(formValue)
        : `https://www.google.com/search?q=${formValue}`;
      processUrl(url);
    });
  }

  function processUrl(url) {
    sessionStorage.setItem("GoUrl", __uv$config.encodeUrl(url));
    // Instead of updating iframe, we directly navigate the page.
    window.location.href = `/a/${__uv$config.encodeUrl(url)}`;
    input.value = url;
    console.log(url);
  }

  function isUrl(val = "") {
    if (
      /^http(s?):\/\//.test(val) ||
      (val.includes(".") && val.substr(0, 1) !== " ")
    ) {
      return true;
    }
    return false;
  }

  function prependHttps(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  }
});

document.addEventListener("DOMContentLoaded", event => {
  const addTabButton = document.getElementById("add-tab");
  const tabList = document.getElementById("tab-list");
  let tabCounter = 1;

  addTabButton.addEventListener("click", () => {
    createNewTab();
  });

  function createNewTab() {
    const newTab = document.createElement("li");
    const tabTitle = document.createElement("span");
    tabTitle.textContent = `New Tab ${tabCounter}`;
    tabTitle.className = "t";
    newTab.dataset.tabId = tabCounter;
    newTab.addEventListener("click", switchTab);
    newTab.setAttribute("draggable", true);
    const closeButton = document.createElement("button");
    closeButton.classList.add("close-tab");
    closeButton.innerHTML = "&#10005;";
    closeButton.addEventListener("click", closeTab);
    newTab.appendChild(tabTitle);
    newTab.appendChild(closeButton);
    tabList.appendChild(newTab);

    const allTabs = Array.from(tabList.querySelectorAll("li"));
    for (const tab of allTabs) {
      tab.classList.remove("active");
    }
    newTab.classList.add("active");
    tabCounter += 1;
  }

  function closeTab(event) {
    event.stopPropagation();
    const tabId = event.target.closest("li").dataset.tabId;
    const tabToRemove = tabList.querySelector(`[data-tab-id='${tabId}']`);
    if (tabToRemove) {
      tabToRemove.remove();
      const remainingTabs = Array.from(tabList.querySelectorAll("li"));
      if (remainingTabs.length > 0) {
        const nextTabIndex = remainingTabs.findIndex(tab => tab.dataset.tabId !== tabId);
        if (nextTabIndex > -1) {
          const nextTabToActivate = remainingTabs[nextTabIndex];
          nextTabToActivate.classList.add("active");
        }
      }
    }
  }

  function switchTab(event) {
    const tabId = event.target.closest("li").dataset.tabId;
    const allTabs = Array.from(tabList.querySelectorAll("li"));
    for (const tab of allTabs) {
      tab.classList.remove("active");
    }
    const selectedTab = tabList.querySelector(`[data-tab-id='${tabId}']`);
    if (selectedTab) {
      selectedTab.classList.add("active");
    } else {
      console.log("No selected tab found with ID:", tabId);
    }
  }
});

