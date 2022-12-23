import { SourceFile } from "ts-morph";
import { BindingEntry, BuiltInBindingStore } from "../Models/BuiltInBinding";

function getPrimitiveBoxInternalName(typeStr: string): string | undefined {
  switch (typeStr) {
  case "Number":
    return "NumberProtocol";
  case "Function":
    return "FunctionProtocol";
  case "Boolean":
    return "BooleanProtocol";
  case "String":
    return "StringProtocol";
  case "Array":
    return "ArrayProtocol";
  case "Object":
    return "ObjectProtocol";
  // case "Symbol":
  //   return "SymbolProtocol";
  default:
    return undefined;
  }
}


export function collectInterfaces(
  filesToDoWorkOn: SourceFile[],
  builtInBindingStore: BuiltInBindingStore
) {
  const completedInterfaces: Record<string, true | undefined> = {};
  for (const file of filesToDoWorkOn) {
    const interfaceDecls = file.getInterfaces();
    for (const interfaceDecl of interfaceDecls) {
      const interfaceDeclType = interfaceDecl.getType();
      const interfaceDeclTypeStr = interfaceDeclType.getText();
      if (completedInterfaces[interfaceDeclTypeStr]) {
        continue
      }
      completedInterfaces[interfaceDeclTypeStr] = true;
      // Determine if this is a primitive box type
      const primitiveBoxInternalName = getPrimitiveBoxInternalName(interfaceDeclTypeStr);
      if (primitiveBoxInternalName !== undefined) {
        const builtInBinding = builtInBindingStore.getBindingForType(interfaceDeclType);
        const entry = builtInBinding.getOrCreateSingletonEntry(undefined);
        entry.internalName = primitiveBoxInternalName;
      }
    }
  }
}