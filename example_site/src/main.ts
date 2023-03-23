
if (window.location.href.endsWith("/native")) {
  // return the native response
  import('./app');
} else if (window.location.href.endsWith("/next")) {
  // if the path is "/next"
  import('./next');
} else {
  document.body.innerText = "Go to /native or /next";
}