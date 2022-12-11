
import { compareNativeToSandboxedEval } from './helpers';

export async function runBinaryOpsBenchmark(benchmark) {
  compareNativeToSandboxedEval({
    jsCode: "true + false + true", 
    benchmark: benchmark
  });
  await compareNativeToSandboxedEval({
    jsCode: "1 + 2 + 3", 
    benchmark: benchmark
  });
  await compareNativeToSandboxedEval({
    jsCode: "NaN + 2 + Infinity", 
    benchmark: benchmark
  });
  await compareNativeToSandboxedEval({
    jsCode: "4n + 2n + (-100n + 393n) + -5n", 
    benchmark: benchmark
  });
}