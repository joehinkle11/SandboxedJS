import { SourceFile, Type } from "ts-morph";
import { blackListTypes } from "../Blacklist";
import { BuiltInBindingStore } from "../Models/BuiltInBinding";
import { createStaticBindingCodeForGlobalVar } from "./CollectVariables";

function getPrimitiveBoxInternalName(type: Type<ts.Type>): string | undefined {
  if (type.isArray()) {
    return "ArrayProtocol";
  }
  const typeStr = type.getText();
  switch (typeStr) {
  case "Number":
    return "NumberProtocol";
  case "Function":
    return "FunctionProtocol";
  case "Boolean":
    return "BooleanProtocol";
  case "String":
    return "StringProtocol";
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
      if (blackListTypes.includes(interfaceDeclTypeStr)) {
        console.log(`Skipping ${interfaceDeclTypeStr} as it is on the blacklist.`);
        continue;
      }
      completedInterfaces[interfaceDeclTypeStr] = true;
      // Determine if this is a primitive box type
      const primitiveBoxInternalName = getPrimitiveBoxInternalName(interfaceDeclType);
      if (primitiveBoxInternalName !== undefined) {
        const builtInBinding = builtInBindingStore.getBindingForType(interfaceDeclType);
        const entry = builtInBinding.getOrCreateSingletonEntry(
          // createStaticBindingCodeForGlobalVar(
          //   "'idk' as any",
          //   interfaceDeclType,
          //   builtInBindingStore,
          //   0
          // )
          undefined
        );
        entry.internalName = primitiveBoxInternalName;
      }
    }
  }
}