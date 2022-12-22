import { Type } from "ts-morph";




export function globalPrimitiveDeclaration(
  globalVariableName: string,
  declType: Type<ts.Type>,
  appendToFile: (appendStr: string) => void
) {
  const primitiveTypeString = declType.getText();
  let sPrimitiveClass: string;
  switch (primitiveTypeString) {
  case "number":
    sPrimitiveClass = "SNumberValue";
    break;
  default:
    throw new Error(`Unsupported primitive type ${primitiveTypeString}.`);
  }
  appendToFile(`
/// Native binding to global variable "${globalVariableName}".
rootSTable.assign("${globalVariableName}", new SValues.${sPrimitiveClass}(${globalVariableName}, rootSTable.newMetadataForCompileTimeLiteral()), "const");
`);
}