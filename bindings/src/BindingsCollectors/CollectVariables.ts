import { SourceFile, Type } from "ts-morph";
import { makeSFunctionOfGlobalVariable } from "../CodeGen/MakeSFunctionOfGlobalVariable";
import { makeSPrimitiveValueOfGlobalVariable } from "../CodeGen/MakeSPrimitiveValueOfGlobalVariable";
import { BindingEntry, BuiltInBinding, BuiltInBindingStore } from "../Models/BuiltInBinding";



export function collectVariables(
  filesToDoWorkOn: SourceFile[],
  builtInBindingStore: BuiltInBindingStore
) {
  for (const file of filesToDoWorkOn) {
    const decls = file.getVariableDeclarations();
    for (const decl of decls) {
      const globalVariableName = decl.getStructure().name;
      const declType = decl.getType();
      const implementationCode = createStaticBindingCodeForGlobalVar(globalVariableName, declType);
      const builtInBinding = builtInBindingStore.getBindingForType(declType);
      const bindingEntry = new BindingEntry(
        "static",
        "global_" + globalVariableName,
        implementationCode
      );
      bindingEntry.globalVariableName = globalVariableName;
      builtInBinding.entries.push(bindingEntry);
    }
  }
}

// static means that the value will never change during the course of the program execution
function createStaticBindingCodeForGlobalVar(
  globalVariableName: string,
  nativeType: Type<ts.Type>
): string {
  if (nativeType.isNumber() || nativeType.isBoolean() || nativeType.isLiteral() || nativeType.isNull() || nativeType.isString() || nativeType.isUndefined() ) {
    return makeSPrimitiveValueOfGlobalVariable(globalVariableName, nativeType);
  } else {
    if (nativeType.isObject()) {
      const isCallable = nativeType.getCallSignatures().length > 0;
      const isConstructor = nativeType.getConstructSignatures().length > 0;
      // todo: we need to make a distinction between callables and constructables
      if (isCallable || isConstructor) {
        return makeSFunctionOfGlobalVariable(globalVariableName, nativeType);
      } else {
        return "'obj " + globalVariableName + "'"; 
      }
    }
    return "'todo " + globalVariableName + "'";
  }
}

// dynamic means that the value will change during the course of the program execution, and so the binding much always reach outside the sandbox to get the latest value whenever the user gets the value. most likely in the future this will be implemented by doing a special access property descriptor on `globalThis`.
function createDynamicBindingCodeForGlobalVar(): string {
  throw new Error("todo");
}