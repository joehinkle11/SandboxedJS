import { Type } from "ts-morph";
import { ImplementationModal } from "../Models/BuiltInBinding";

export function makeSPrimitiveValueOfGlobalVariable(
  globalVariableName: string,
  nativeType: Type<ts.Type>
): ImplementationModal {
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
  return {
    implementation_kind: "hardcoded",
    code: `new SValues.${sPrimitiveClass}(${globalVariableName}, rootSTable.newMetadataForCompileTimeLiteral())`
  };
}