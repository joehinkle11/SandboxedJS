
import { compareNativeToSandboxedEval } from './helpers';

export async function runBinaryOpsBenchmark(benchmark) {
  // compareNativeToSandboxedEval({
  //   jsCode: "true + false + true", 
  //   benchmark: benchmark
  // });
  await compareNativeToSandboxedEval({
    jsCode: "1 + 2 + 3", 
    benchmark: benchmark
  });
  await compareNativeToSandboxedEval({
    jsCode: "NaN + 2 + Infinity", 
    benchmark: benchmark
  });
}