import { SourceFile, Type } from "ts-morph";
import { blackListTypes } from "../Blacklist";
import { makeSObjectOfGlobalVariable } from "../CodeGen/MakeSObjectOfGlobalVariable";
import { makeSPrimitiveValueOfGlobalVariable } from "../CodeGen/MakeSPrimitiveValueOfGlobalVariable";
import { ifIsIdenticalReferenceReturnMainRef } from "../IdenticalValueReferences";
import { BuiltInBindingStore, ImplementationModal } from "../Models/BuiltInBinding";



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
      const builtInBinding = builtInBindingStore.getBindingForType(declType);
      const mainRef = ifIsIdenticalReferenceReturnMainRef(globalVariableName);
      if (mainRef !== undefined) {
        console.log(`Implementation for ${globalVariableName} is skipped as it is just a duplicated reference to ${mainRef}.`);
        const identicalVarRef = builtInBinding.getOrCreateVariableEntry(
          mainRef,
          createStaticBindingCodeForGlobalVar(globalVariableName, globalVariableName, declType, builtInBindingStore, 0)
        );
        identicalVarRef.identicalGlobalVariableNames.push(globalVariableName);
        continue;
      }
      builtInBinding.getOrCreateVariableEntry(
        globalVariableName,
        createStaticBindingCodeForGlobalVar(globalVariableName, globalVariableName, declType, builtInBindingStore, 0)
      );
    }
  }
}

// static means that the value will never change during the course of the program execution
export function createStaticBindingCodeForGlobalVar(
  globalVariableName: string,
  mainGlobalVariableName: string,
  nativeType: Type<ts.Type>,
  builtInBindingStore: BuiltInBindingStore,
  ourOrder: number
): ImplementationModal {
  if (nativeType.isNumber() || nativeType.isBoolean() || nativeType.isLiteral() || nativeType.isNull() || nativeType.isString() || nativeType.isUndefined() ) {
    return makeSPrimitiveValueOfGlobalVariable(globalVariableName, nativeType);
  } else {
    if (nativeType.isObject()) {
      return makeSObjectOfGlobalVariable(globalVariableName, mainGlobalVariableName, nativeType, builtInBindingStore, ourOrder);
    }
    return {
      implementation_kind: "hardcoded",
      code: "'todo " + globalVariableName + "' as any"
    };
  }
}

// dynamic means that the value will change during the course of the program execution, and so the binding much always reach outside the sandbox to get the latest value whenever the user gets the value. most likely in the future this will be implemented by doing a special access property descriptor on `globalThis`.
function createDynamicBindingCodeForGlobalVar(): string {
  throw new Error("todo");
}