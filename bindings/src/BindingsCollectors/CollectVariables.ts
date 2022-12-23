import { SourceFile, Type } from "ts-morph";
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
  declType: Type<ts.Type>
): string {
  if (declType.isNumber() || declType.isBoolean() || declType.isLiteral() || declType.isNull() || declType.isString() || declType.isUndefined() ) {
    return makeSPrimitiveValueOfGlobalVariable(globalVariableName, declType);
  } else {
    return "'todo " + globalVariableName + "'";
  }
}

// dynamic means that the value will change during the course of the program execution, and so the binding much always reach outside the sandbox to get the latest value whenever the user gets the value. most likely in the future this will be implemented by doing a special access property descriptor on `globalThis`.
function createDynamicBindingCodeForGlobalVar(): string {
  throw new Error("todo");
}