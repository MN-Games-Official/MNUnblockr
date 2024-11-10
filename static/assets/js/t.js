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
    
    // Instead of using iframe, we directly change the window location to show the page
    window.location.href = `/a/${__uv$config.encodeUrl(url)}`;
    
    input.value = url;
    console.log(`Redirecting to: ${url}`);
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
  const iframeContainer = document.getElementById("frame-container");
  let tabCounter = 1;

  addTabButton.addEventListener("click", () => {
    createNewTab();
    Load();
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

    const newIframe = document.createElement("iframe");
    newIframe.src = "/a/"; // Initial URL for new tab
    newIframe.classList.add("active");
    iframeContainer.appendChild(newIframe);
  }

  function closeTab(event) {
    event.stopPropagation();
    const tabId = event.target.closest("li").dataset.tabId;
    const tabToRemove = tabList.querySelector(`[data-tab-id='${tabId}']`);
    const iframeToRemove = iframeContainer.querySelector(`[data-tab-id='${tabId}']`);
    if (tabToRemove && iframeToRemove) {
      tabToRemove.remove();
      iframeToRemove.remove();

      const remainingTabs = Array.from(tabList.querySelectorAll("li"));
      if (remainingTabs.length === 0) {
        tabCounter = 0;
      } else {
        const nextTabIndex = remainingTabs.findIndex(
          tab => tab.dataset.tabId !== tabId
        );
        if (nextTabIndex > -1) {
          const nextTabToActivate = remainingTabs[nextTabIndex];
          for (const tab of remainingTabs) {
            tab.classList.remove("active");
          }
          remainingTabs[nextTabIndex].classList.add("active");
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

      const allIframes = Array.from(iframeContainer.querySelectorAll("iframe"));
      for (const iframe of allIframes) {
        iframe.classList.remove("active");
      }
      const selectedIframe = iframeContainer.querySelector(`[data-tab-id='${tabId}']`);
      if (selectedIframe) {
        selectedIframe.classList.add("active");
      }
    }
  }

  // Reload function (reload current page)
  function reload() {
    const goUrl = sessionStorage.getItem("GoUrl");
    if (goUrl) {
      window.location.href = `/a/${goUrl}`;
    }
  }

  // Popout function (open the current iframe in a new window)
  function popout() {
    const goUrl = sessionStorage.getItem("GoUrl");
    if (goUrl) {
      window.open(`/a/${goUrl}`, "_blank");
    }
  }

  // Fullscreen toggle
  function FS() {
    const activeIframe = document.querySelector("#frame-container iframe.active");
    if (activeIframe) {
      if (activeIframe.contentDocument.fullscreenElement) {
        activeIframe.contentDocument.exitFullscreen();
      } else {
        activeIframe.contentDocument.documentElement.requestFullscreen();
      }
    }
  }

  const fullscreenButton = document.getElementById("fullscreen-button");
  fullscreenButton.addEventListener("click", FS);

  // Home button (redirect to the home page)
  function Home() {
    window.location.href = "./";
  }

  const homeButton = document.getElementById("home-page");
  homeButton.addEventListener("click", Home);

  // Back button (go back in history)
  function goBack() {
    window.history.back();
  }

  const backButton = document.getElementById("back-button");
  backButton.addEventListener("click", goBack);

  // Forward button (go forward in history)
  function goForward() {
    window.history.forward();
  }

  const forwardButton = document.getElementById("forward-button");
  forwardButton.addEventListener("click", goForward);

  // Initial Tab Creation
  createNewTab();
});

// Reload
function Load() {
  const activeIframe = document.querySelector("#frame-container iframe.active");
  if (activeIframe) {
    const website = activeIframe.contentWindow.document.location.href;
    if (website.includes("/a/")) {
      const websitePath = website.replace(window.location.origin, "").replace("/a/", "");
      localStorage.setItem("decoded", websitePath);
      const decodedValue = decodeXor(websitePath);
      document.getElementById("iv").value = decodedValue;
    }
  }
}

// Decode function for XOR encoding
function decodeXor(input) {
  if (!input) return input;
  const [str, ...search] = input.split("?");
  return (
    decodeURIComponent(str)
      .split("")
      .map((char, ind) =>
        ind % 2 ? String.fromCharCode(char.charCodeAt(Number.NaN) ^ 2) : char
      )
      .join("") + (search.length ? `?${search.join("?")}` : "")
  );
}
