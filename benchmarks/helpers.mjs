import { SandboxedJSRunner } from '../lib/Runner.js';

export async function compareNativeToSandboxedEval(params) {
  const jsCode = params.jsCode;
  const benchmark = params.benchmark;
  const suitName = params.suitName === undefined ? `Eval "${jsCode}"` : params.suitName;
  const sandboxedJSRunner = SandboxedJSRunner.newRunnerWithoutMetadata();
  const transpiledJsCode = sandboxedJSRunner.transpile(jsCode);

  const runTranspile = () => {
    sandboxedJSRunner.transpile(jsCode);
  }
  const runJsEvalOnTranspiledResult = () => {
    return sandboxedJSRunner.evalTranspiledCode(transpiledJsCode);
  }
  const runTranspileAndEval = () => {
    return sandboxedJSRunner.evalJs(jsCode, {returnNativeJSValue: true});
  }
  const runNativeJsEval = () => {
    return eval(jsCode);
  }

  // Create a test suite
  const bench1 = benchmark.createSuite(suitName);
  
  // Add first func
  bench1.add("transpile time", runTranspile);
  bench1.add("transpiled code run time", runJsEvalOnTranspiledResult);
  bench1.add("transpile and code run time", runTranspileAndEval);
  
  // Add second func. This result will be the reference
  bench1.ref("native eval", runNativeJsEval);
  
  await bench1.run();
}