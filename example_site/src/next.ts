
const scriptUrl = new URL('../public/site/app.js', import.meta.url).href
Promise.all([fetch(scriptUrl).then(r => r.text()), import("sandboxedjs")]).then(([code, sandboxedjs]) => {
  const safeEval = sandboxedjs.default.safeEval;
  const result = safeEval(code);
  console.log(result);
});