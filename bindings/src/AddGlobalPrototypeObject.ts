import { InterfaceDeclaration } from "ts-morph";

export function addGlobalPrototypeObject(
  interfaceDecl: InterfaceDeclaration,
  appendToFile: (appendStr: string) => void
) {
  const interfaceDeclType = interfaceDecl.getType();
  const interfaceDeclTypeStr = interfaceDeclType.getText();


  appendToFile(`
/// Support for ${interfaceDeclTypeStr}
`);
}