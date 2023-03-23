
Promise.all([import("./app?raw"), import("sandboxedjs")]).then(([app, sandboxedjs]) => {
  const code = app.default;
  const safeEval = sandboxedjs.default.safeEval;
  const result = safeEval(code);
  console.log(result);
});