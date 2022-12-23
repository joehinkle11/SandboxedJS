import { SourceFile, Type } from "ts-morph";
import { blackListTypes } from "../Blacklist";
import { makeSObjectOfGlobalVariable } from "../CodeGen/MakeSObjectOfGlobalVariable";
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
      if (blackListTypes.includes(globalVariableName)) {
        console.log(`Skipping ${globalVariableName} as it is on the blacklist.`);
        continue;
      }
      const declType = decl.getType();
      const implementationCode = createStaticBindingCodeForGlobalVar(globalVariableName, declType, builtInBindingStore, 0);
      const builtInBinding = builtInBindingStore.getBindingForType(declType);
      const bindingEntry = new BindingEntry(
        builtInBinding,
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
export function createStaticBindingCodeForGlobalVar(
  globalVariableName: string,
  nativeType: Type<ts.Type>,
  builtInBindingStore: BuiltInBindingStore,
  ourOrder: number
): string {
  if (nativeType.isNumber() || nativeType.isBoolean() || nativeType.isLiteral() || nativeType.isNull() || nativeType.isString() || nativeType.isUndefined() ) {
    return makeSPrimitiveValueOfGlobalVariable(globalVariableName, nativeType);
  } else {
    if (nativeType.isObject()) {
      return makeSObjectOfGlobalVariable(globalVariableName, nativeType, builtInBindingStore, ourOrder);
    }
    return "'todo " + globalVariableName + "' as any";
  }
}

// dynamic means that the value will change during the course of the program execution, and so the binding much always reach outside the sandbox to get the latest value whenever the user gets the value. most likely in the future this will be implemented by doing a special access property descriptor on `globalThis`.
function createDynamicBindingCodeForGlobalVar(): string {
  throw new Error("todo");
}