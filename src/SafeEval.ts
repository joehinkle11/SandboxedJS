import { SandboxedJSRunner } from "./Runner";


export function safeEval(
  unsafeJs: string
): any {
  const sandboxedJSRunner = SandboxedJSRunner.newRunnerWithoutMetadata();
  const result = sandboxedJSRunner.evalJs(unsafeJs, {returnNativeJSValue: true});
  return result;
}