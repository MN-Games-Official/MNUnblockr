// Register the service worker when the page loads
window.addEventListener("load", () => {
  navigator.serviceWorker.register("../sw.js?v=10-02-2024", {
    scope: "/a/",
  });
});

// Select the form and input elements
const form = document.getElementById("fv");
const input = document.getElementById("iv");

// If the form and input elements are found, set up event listener
if (form && input) {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    // Get the current pathname of the top-level window
    const pathname = await getParentPathname();
    processUrl(input.value, pathname);
  });
}

// Function to request the parent pathname via postMessage
function getParentPathname() {
  return new Promise((resolve) => {
    // Send a message to the parent to get the pathname
    window.parent.postMessage("getPathname", "https://zealous-meadow-04d0ae41e.5.azurestaticapps.net");

    // Listen for the response from the parent page
    window.addEventListener('message', function(event) {
      if (event.origin === "https://zealous-meadow-04d0ae41e.5.azurestaticapps.net" && event.data.pathname) {
        resolve(event.data.pathname);
      }
    });
  });
}

// Function to process the URL based on the value and pathname
function processUrl(value, path) {
  let url = value.trim();
  const engine = localStorage.getItem("engine");
  const searchUrl = engine ? engine : "https://www.google.com/search?q=";

  // Check if the value is a valid URL, otherwise search
  if (!isUrl(url)) {
    url = searchUrl + url;
  } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
    url = `https://${url}`;
  }

  // Save the encoded URL to session storage
  sessionStorage.setItem("GoUrl", __uv$config.encodeUrl(url));

  const dy = localStorage.getItem("dy");

  // Redirect based on "dy" value
  if (dy === "true") {
    window.location.href = `/a/q/${__uv$config.encodeUrl(url)}`;
  } else if (path) {
    window.location.href = path;
  } else {
    window.location.href = `/a/${__uv$config.encodeUrl(url)}`;
  }
}

// Helper function to determine if a value is a valid URL
function isUrl(val = "") {
  return /^http(s?):\/\//.test(val) || (val.includes(".") && val.substr(0, 1) !== " ");
}

// Helper functions for specific URL processing
function go(value) {
  processUrl(value, "/rx");
}

function blank(value) {
  processUrl(value);
}

function dy(value) {
  processUrl(value, `/a/q/${__uv$config.encodeUrl(value)}`);
}
