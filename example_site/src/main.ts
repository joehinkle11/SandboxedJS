
if (window.location.href.endsWith("/native")) {
  // return the native response
  const scriptUrl = new URL('../public/site/app.js', import.meta.url).href
  import(scriptUrl);
} else if (window.location.href.endsWith("/next")) {
  // if the path is "/next"
  import('./next');
} else {
  document.body.innerText = "Go to /native or /next";
}