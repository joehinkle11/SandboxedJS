
import { compareNativeToSandboxedEval } from './helpers.mjs';

export async function runArrayLookupsBenchmark(benchmark) {
  await compareNativeToSandboxedEval({
    jsCode: "[][0]",
    benchmark: benchmark
  });
  await compareNativeToSandboxedEval({
    jsCode: "[1,2,3,4,5,[12,123,[123]]][5][2]",
    benchmark: benchmark
  });
}