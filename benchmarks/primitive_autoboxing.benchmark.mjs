
import { compareNativeToSandboxedEval } from './helpers.mjs';

export async function runPrimitiveAutoboxingBenchmark(benchmark) {
  await compareNativeToSandboxedEval({
    jsCode: "({[1]:true})",
    benchmark: benchmark
  });
}