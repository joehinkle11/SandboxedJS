import { ExposedGlobal, SandboxedJSRunner } from "./Runner";


export function safeEval(
  unsafeJs: string,
  options: SafeEvalOptions = {}
): any {
  const sandboxedJSRunner = SandboxedJSRunner.newRunnerWithoutMetadata();
  if (options.exposing) {
    sandboxedJSRunner.exposeGlobals(options.exposing);
  }
  const result = sandboxedJSRunner.evalJs(unsafeJs, {
    returnNativeJSValue: options.returnNativeJSValue ?? true
  });
  return result;
}

export interface SafeEvalOptions {
  returnNativeJSValue?: boolean
  exposing?: Partial<Record<PropertyKey, ExposedGlobal>>
}