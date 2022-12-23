import { SourceFile } from "ts-morph";
import { BuiltInBindingStore } from "../Models/BuiltInBinding";



export function collectInterfaces(
  filesToDoWorkOn: SourceFile[],
  builtInBindingStore: BuiltInBindingStore
) {
  for (const file of filesToDoWorkOn) {
    const interfaceDecls = file.getInterfaces();
    for (const interfaceDecl of interfaceDecls) {
      const interfaceDeclType = interfaceDecl.getType();
      const interfaceDeclTypeStr = interfaceDeclType.getText();
      builtInBindingStore[interfaceDeclTypeStr] = {};
    }
  }
}