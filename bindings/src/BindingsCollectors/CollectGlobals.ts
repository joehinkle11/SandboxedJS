import { SourceFile, Type } from "ts-morph";
import { blackListTypes, blackListVars } from "../Blacklist";
import { makeSObjectOfGlobalVariable } from "../CodeGen/MakeSObjectOfGlobalVariable";
import { makeSPrimitiveValueOfGlobalVariable } from "../CodeGen/MakeSPrimitiveValueOfGlobalVariable";
import { ifIsIdenticalReferenceReturnMainRef } from "../IdenticalValueReferences";
import { BuiltInBindingStore, ImplementationModal } from "../Models/BuiltInBinding";



export function collectGlobals(
  filesToDoWorkOn: SourceFile[],
  builtInBindingStore: BuiltInBindingStore
) {
  for (const file of filesToDoWorkOn) {
    function processGlobal(globalVariableName: string, declType: Type<ts.Type>) {
      if (blackListTypes.includes(globalVariableName) || blackListVars.includes(globalVariableName)) {
        console.log(`Skipping ${globalVariableName} as it is on the blacklist.`);
        return;
      }
      const mainRef = ifIsIdenticalReferenceReturnMainRef(globalVariableName);
      if (mainRef !== undefined) {
        console.log(`Implementation for ${globalVariableName} is skipped as it is just a duplicated reference to ${mainRef}.`);
        const identicalVarRef = builtInBindingStore.getOrCreateVariableEntry(
          mainRef,
          createStaticBindingCodeForGlobalVar(globalVariableName, globalVariableName, declType, builtInBindingStore, 0)
        );
        identicalVarRef.identicalGlobalVariableNames.push(globalVariableName);
        return;
      }
      builtInBindingStore.getOrCreateVariableEntry(
        globalVariableName,
        createStaticBindingCodeForGlobalVar(globalVariableName, globalVariableName, declType, builtInBindingStore, 0)
      );
    }
    const varDecls = file.getVariableDeclarations();
    for (const decl of varDecls) {
      processGlobal(decl.getStructure().name, decl.getType());
    }
    const funcDecls = file.getFunctions();
    for (const decl of funcDecls) {
      processGlobal(decl.getName()!, decl.getType());
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
      implementation_kind: "todo"
    };
  }
}

// dynamic means that the value will change during the course of the program execution, and so the binding much always reach outside the sandbox to get the latest value whenever the user gets the value. most likely in the future this will be implemented by doing a special access property descriptor on `globalThis`.
function createDynamicBindingCodeForGlobalVar(): string {
  throw new Error("todo");
}