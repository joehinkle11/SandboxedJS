import { SourceFile } from "ts-morph";
import { BuiltInBindingStore } from "../Models/BuiltInBinding";



export function collectVariables(
  filesToDoWorkOn: SourceFile[],
  builtInBindingStore: BuiltInBindingStore
) {
  for (const file of filesToDoWorkOn) {
    const decls = file.getVariableDeclarations();
    for (const decl of decls) {
      const globalVariableName = decl.getStructure().name;
      const declType = decl.getType();
      builtInBindingStore[globalVariableName] = {};
    }
  }
}