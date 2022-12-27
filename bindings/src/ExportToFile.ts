import { fileStream, makeAppendToFileWithIndentationFunction } from "./FileWriting";
import { BuiltInBinding, BuiltInBindingStore } from "./Models/BuiltInBinding";

const makeAppendToFileWithIndentation = makeAppendToFileWithIndentationFunction((str)=>fileStream.write(str));

export function exportToFile(builtInBindingStore: BuiltInBindingStore, extraHardcodedTypeDefs: string) {

  fileStream.write(`///
/// THIS FILE HAS BEEN AUTOGENERATED
///
/// DO NOT EDIT MANUALLY
///

// Extra hardcoded type defs
${extraHardcodedTypeDefs}

/// Imports
import { SValues } from "../SValues/AllSValues";
import type { InstallBuiltIn } from "../BuiltIns/InstallBuiltIn";
import type { SLocalSymbolTable, SRootSymbolTable } from "../SLocalSymbolTable";
import type { SObjectValue } from "../SValues/SObjects/SObjectValue";
import type { SNormalObject } from "../SValues/SObjects/SNormalObject";
import type { SFunction } from "../SValues/SObjects/SFunction";
import type { SNumberValue } from "../SValues/SPrimitiveValues/SNumberValue";
import type { SBooleanValue } from "../SValues/SPrimitiveValues/SBooleanValue";
import type { SStringValue } from "../SValues/SPrimitiveValues/SStringValue";
import type { SUndefinedValue } from "../SValues/SPrimitiveValues/SUndefinedValue";
import type { SNullValue } from "../SValues/SPrimitiveValues/SNullValue";
import type { SBigIntValue } from "../SValues/SPrimitiveValues/SBigIntValue";
import type { SSymbolValue } from "../SValues/SPrimitiveValues/SSymbolValue";
import type { SValue } from "../SValues/SValue";
import SUserError from "../Models/SUserError";

/// Main entry point for installing all generated bindings.
export const installGeneratedBindings: InstallBuiltIn<any> = (rootSTable: SRootSymbolTable<any>) => {
`);

  const appendToInstallGeneratedBindings = makeAppendToFileWithIndentation(1);
  const builtInBindingEntriesSorted = builtInBindingStore.getAllBindingEntries().sort((a, b) => {
    return b.sortOrder - a.sortOrder;
  });
  for (const entry of builtInBindingEntriesSorted) {
    const builtInBinding = entry.builtInBinding;
    appendToInstallGeneratedBindings(`// builtInBinding id: ${builtInBinding.id}`);
    appendToInstallGeneratedBindings("// private implementation..." + entry.sortOrder);
    if (entry.implementationCode !== undefined) {
      appendToInstallGeneratedBindings(`const ${entry.privateName}: ${builtInBinding.sType} = ${entry.implementationCode};`);
    } else {
      appendToInstallGeneratedBindings(`// Cannot make private binding for "${entry.privateName}: ${builtInBinding.sType}" as no implementation code was found.`);
    }
  }
  for (const builtInBinding of builtInBindingStore.getAllBindings()) {
    for (const entry of builtInBinding.entries) {
      if (entry.globalVariableName !== undefined) {
        appendToInstallGeneratedBindings(`// builtInBinding id: ${builtInBinding.id}`);
        appendToInstallGeneratedBindings(`rootSTable.assign("${entry.globalVariableName}", ${entry.privateName} as ${builtInBinding.sType} as SValue<any>, "const");`);
      }
    }
  }
  for (const builtInBinding of builtInBindingStore.getAllBindings()) {
    for (const entry of builtInBinding.entries) {
      if (entry.internalName !== undefined) {
        appendToInstallGeneratedBindings(`// builtInBinding id: ${builtInBinding.id}`);
        appendToInstallGeneratedBindings(`rootSTable.sGlobalProtocols.${entry.internalName} = ${entry.privateName} as SNormalObject<any>;`); 
      }
    }
  }

  fileStream.write(`
};`); 
}