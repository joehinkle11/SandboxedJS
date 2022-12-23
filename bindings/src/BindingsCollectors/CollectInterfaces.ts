import { SourceFile } from "ts-morph";
import { BuiltInBindingStore } from "../Models/BuiltInBinding";

function getHiddenName(typeStr: string): string {
  switch (typeStr) {
  case "Symbol":
    return "SymbolProtocol";
  default:
    throw new Error(`Cannot get hidden name for ${typeStr}`);
  }
}

Object.getOwnPropertyDescriptor

export function collectInterfaces(
  filesToDoWorkOn: SourceFile[],
  builtInBindingStore: BuiltInBindingStore
) {
  for (const file of filesToDoWorkOn) {
    const interfaceDecls = file.getInterfaces();
    for (const interfaceDecl of interfaceDecls) {
      const interfaceDeclType = interfaceDecl.getType();
      const builtInBinding = builtInBindingStore.getBindingForType(interfaceDeclType);
      // already added
      // Determine if this is a primitive box type
      // switch (interfaceDeclTypeStr) {
      // case "Number":
      //   builtInBinding.internalName = "NumberProtocol";
      //   break;
      // }
      continue;
    }
  }
}