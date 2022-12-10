
import { compareNativeToSandboxedEval } from './helpers';

export async function runPrimitivesBenchmark(benchmark) {
  await compareNativeToSandboxedEval({
    jsCode: "true", 
    benchmark: benchmark
  });
  await compareNativeToSandboxedEval({
    jsCode: "123", 
    benchmark: benchmark
  });
  await compareNativeToSandboxedEval({
    jsCode: "NaN", 
    benchmark: benchmark
  });
}