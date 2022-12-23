import { Type } from "ts-morph";

export function makeSPrimitiveValueOfGlobalVariable(
  globalVariableName: string,
  nativeType: Type<ts.Type>
): string {
  const primitiveTypeString = nativeType.getText();
  let sPrimitiveClass: string;
  switch (primitiveTypeString) {
  case "number":
    sPrimitiveClass = "SNumberValue";
    break;
  case "boolean":
    sPrimitiveClass = "SBooleanValue";
    break;
  case "string":
    sPrimitiveClass = "SStringValue";
    break;
  default:
    throw new Error(`Unsupported primitive type ${primitiveTypeString}.`);
  }
  return `new SValues.${sPrimitiveClass}(${globalVariableName}, rootSTable.newMetadataForCompileTimeLiteral())`;
}