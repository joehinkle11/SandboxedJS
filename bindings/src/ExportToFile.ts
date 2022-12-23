import { fileStream, makeAppendToFileWithIndentationFunction } from "./FileWriting";
import { BuiltInBinding, BuiltInBindingStore } from "./Models/BuiltInBinding";

const makeAppendToFileWithIndentation = makeAppendToFileWithIndentationFunction((str)=>fileStream.write(str));

export function exportToFile(builtInBindingStore: BuiltInBindingStore) {

  fileStream.write(`///
/// THIS FILE HAS BEEN AUTOGENERATED
///
/// DO NOT EDIT MANUALLY
///

/// Imports
import { SValues } from "../SValues/AllSValues";
import type { InstallBuiltIn } from "../BuiltIns/InstallBuiltIn";
import type { SLocalSymbolTable, SRootSymbolTable } from "../SLocalSymbolTable";
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

/// Helpers
const getArg: (sArgArray: SValue<any>[], index: number, sTable: SLocalSymbolTable<any>) => SValue<any> = (sArgArray, index, sTable) => {
  return sArgArray[index] ?? new SValues.SUndefinedValue(sTable.newMetadataForRuntimeTimeEmergingValue());
}

/// Main entry point for installing all generated bindings.
export const installGeneratedBindings: InstallBuiltIn<any> = (rootSTable: SRootSymbolTable<any>) => {
`);

const appendToInstallGeneratedBindings = makeAppendToFileWithIndentation(1);
  for (const builtInBindingKey in builtInBindingStore) {
    const builtInBinding: BuiltInBinding = builtInBindingStore[builtInBindingKey]!;
    appendToInstallGeneratedBindings(`
/// ${builtInBindingKey}
`);
  }
 
  fileStream.write(`
};`); 
}