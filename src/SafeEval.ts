import { SandboxedJSRunner } from "./Runner";


export function safeEval(
  unsafeJs: string
): any {
  return SandboxedJSRunner.newRunnerWithoutMetadata().evalJs(unsafeJs).toNativeJS();
}