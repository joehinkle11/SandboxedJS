
import { compareNativeToSandboxedEval } from './helpers.mjs';

export async function runObjectIntrospectionBenchmark(benchmark) {
  await compareNativeToSandboxedEval({
    jsCode: "const o = {};const o2 = Object.create(o); Object.setPrototypeOf(o2, null);Object.getPrototypeOf(o2) !== o",
    benchmark: benchmark
  });
  // await compareNativeToSandboxedEval({
  //   jsCode: "Object.getOwnPropertyNames({})",
  //   benchmark: benchmark
  // });
  // await compareNativeToSandboxedEval({
  //   jsCode: "Object.getOwnPropertyNames({a:true,b:true})",
  //   benchmark: benchmark
  // });
}