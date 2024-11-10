window.addEventListener("load", () => {
  navigator.serviceWorker.register("/sw.js?v=10-02-2024", {
    scope: "/", // Ensure this works for all paths relative to the iframe's base URL
  });
});

const form = document.getElementById("fv");
const input = document.getElementById("iv");

if (form && input) {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (window.location.pathname === "/rx") { // Use window.location instead of window.top.location
      processUrl(input.value, ""); // Pass empty string to avoid adding '/rx' path
    } else {
      processUrl(input.value, "/rx"); // Add '/rx' path for other cases
    }
  });
}

function processUrl(value, path) {
  let url = value.trim();
  const engine = localStorage.getItem("engine");
  const searchUrl = engine ? engine : "https://www.google.com/search?q=";

  if (!isUrl(url)) {
    url = searchUrl + url;
  } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
    url = `https://${url}`;
  }

  sessionStorage.setItem("GoUrl", __uv$config.encodeUrl(url));
  const dy = localStorage.getItem("dy");

  // Dynamically resolve the base URL using window.location.origin
  const baseUrl = window.location.origin;

  if (dy === "true") {
    // Redirect with dynamic path
    window.location.href = `${baseUrl}/a/q/${__uv$config.encodeUrl(url)}`;
  } else if (path) {
    window.location.href = `${baseUrl}${path}`; // Correctly resolve path based on the iframe's origin
  } else {
    window.location.href = `${baseUrl}/a/${__uv$config.encodeUrl(url)}`;
  }
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
