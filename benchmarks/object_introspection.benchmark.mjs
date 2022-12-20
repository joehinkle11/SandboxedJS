
import { compareNativeToSandboxedEval } from './helpers.mjs';

export async function runObjectIntrospectionBenchmark(benchmark) {
  await compareNativeToSandboxedEval({
    jsCode: "Object.getOwnPropertyNames({})",
    benchmark: benchmark
  });
  // await compareNativeToSandboxedEval({
  //   jsCode: "Object.getOwnPropertyNames({a:true,b:true})",
  //   benchmark: benchmark
  // });
}