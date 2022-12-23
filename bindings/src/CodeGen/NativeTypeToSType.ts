import { Type } from "ts-morph";



export function nativeTypeToSType(
  nativeType: Type<ts.Type>
): STypeString {
  if (nativeType.isNumber()) {
    return "SNumberValue<any, number>";
  } else if (nativeType.isBoolean()) {
    return "SBooleanValue<any, number>";
  } else if (nativeType.isObject()) {
    const isCallable = nativeType.getCallSignatures().length > 0;
    const isConstructor = nativeType.getConstructSignatures().length > 0;
    // todo: we need to make a distinction between callables and constructables
    if (isCallable || isConstructor) {
      return "SFunction<any>"
    } else {
      return "SObjectValue<any, any, any>";
    }
  } else {
    throw new Error("Todo nativeTypeToSType for: " + nativeType.getText())
  }
}

export type STypeString = "SBooleanValue<any, number>" | "SNumberValue<any, number>" | "SObjectValue<any, any, any>" | "SFunction<any>";