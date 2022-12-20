
import { compareNativeToSandboxedEval } from './helpers.mjs';

export async function runObjectLookupsBenchmark(benchmark) {
  await compareNativeToSandboxedEval({
    jsCode: "({})",
    benchmark: benchmark
  });
  await compareNativeToSandboxedEval({
    jsCode: "({a:4})",
    benchmark: benchmark
  });
  await compareNativeToSandboxedEval({
    jsCode: "({a:4}.a)",
    benchmark: benchmark
  });
  // await compareNativeToSandboxedEval({
  //   jsCode: "({a:4,b:6,{a:{c:-.4},b:6,'3':42}}.a.c:{a:4,b:6,'3':42}})",
  //   benchmark: benchmark
  // });
}