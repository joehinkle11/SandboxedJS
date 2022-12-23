import { Type } from "ts-morph";



export function nativeTypeToSType(
  nativeType: Type<ts.Type>
): STypeString {
  if (nativeType.isNumber()) {
    return "SNumberValue<any, number>";
  } else if (nativeType.isBoolean()) {
    return "SBooleanValue<any, number>";
  } else if (nativeType.isObject()) {
    return "SObjectValue<any, any, any>";
  } else {
    throw new Error("Todo nativeTypeToSType for: " + nativeType.getText())
  }
}

export type STypeString = "SBooleanValue<any, number>" | "SNumberValue<any, number>" | "SObjectValue<any, any, any>";