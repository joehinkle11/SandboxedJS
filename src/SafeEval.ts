import { SandboxedJSRunner } from "./Runner";


export function safeEval(
  unsafeJs: string
): any {
  const sandboxedJSRunner = SandboxedJSRunner.newRunnerWithoutMetadata();
  return sandboxedJSRunner.evalJs(unsafeJs).toNativeJS(sandboxedJSRunner.transpileContext);
}