import { Type } from "ts-morph";


export function nativeTypeToSTypeSimple(
  nativeType: Type<ts.Type>
): STypeStringSimple {
  if (nativeType.isNumber()) {
    return "SNumberValue<any, number>";
  } else if (nativeType.isBoolean()) {
    return "SBooleanValue<any, boolean>";
  } else if (nativeType.isObject()) {
    const isCallable = nativeType.getCallSignatures().length > 0;
    const isConstructor = nativeType.getConstructSignatures().length > 0;
    // todo: we need to make a distinction between callables and constructables
    if (isCallable || isConstructor) {
      return "SFunction<any>"
    } else {
      return "SObjectValue<any, any, any>";
    }
  } else if (nativeType.isUndefined() || (nativeType.getText() === "void")) {
    return "SUndefinedValue<any>";
  } else if (nativeType.isBoolean() || nativeType.isBooleanLiteral()) {
    return "SBooleanValue<any, boolean>";
  } else if (nativeType.isNull()) {
    return "SNullValue<any>";
  } else if (nativeType.isString()) {
    return "SStringValue<any, string>";
  } else if (nativeType.isAny()) {
    return "SValue<any>";
  } else {
    throw new Error("Todo nativeTypeToSType for: " + nativeType.getText())
  }
}

export function nativeTypeToSType(
  nativeType: Type<ts.Type>
): STypeString {
  if (nativeType.isUnion()) {
    const unionTypes = nativeType.getUnionTypes();
    if (unionTypes.length > 2) {
      console.log("Union types of 3 or more not supported yet. Found: " + nativeType.getText());
      return "SValue<any>";
    }
    const sType1 = nativeTypeToSTypeSimple(unionTypes[0]);
    const sType2 = nativeTypeToSTypeSimple(unionTypes[1]);
    return `${sType1} | ${sType2}`;
  } else if (nativeType.isIntersection()) {
    const intersectionTypes = nativeType.getIntersectionTypes();
    if (intersectionTypes.length > 2) {
      console.log("Intersection types of 3 or more not supported yet. Found: " + nativeType.getText());
      return "SValue<any>";
    }
    const sType1 = nativeTypeToSTypeSimple(intersectionTypes[0]);
    const sType2 = nativeTypeToSTypeSimple(intersectionTypes[1]);
    return `${sType1} & ${sType2}`;
  } else {
    return nativeTypeToSTypeSimple(nativeType);
  }
}

export type STypeStringSimple = "SValue<any>" | "SBooleanValue<any, boolean>" | "SUndefinedValue<any>" | "SBooleanValue<any, number>" | "SNumberValue<any, number>" | "SObjectValue<any, any, any>" | "SFunction<any>" | "SNullValue<any>" | "SStringValue<any, string>";
export type STypeStringUnion = `${STypeStringSimple} | ${STypeStringSimple}`;
export type STypeStringIntersection = `${STypeStringSimple} & ${STypeStringSimple}`;
export type STypeString = STypeStringSimple | STypeStringUnion | STypeStringIntersection;