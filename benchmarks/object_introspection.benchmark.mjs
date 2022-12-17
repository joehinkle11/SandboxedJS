
import { compareNativeToSandboxedEval } from './helpers';

export async function runObjectIntrospectionBenchmark(benchmark) {
  await compareNativeToSandboxedEval({
    jsCode: "Object.getOwnPropertyNames({a:true,b:true})",
    benchmark: benchmark
  });
}