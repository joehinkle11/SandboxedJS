import SUserError from "../../Models/SUserError";
import { SValues } from "../AllSValues";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SBooleanValue } from "./SBooleanValue";
import type { SPrimitiveValue } from "./SPrimitiveValue";
import type { SPrimitiveValueType } from "./SPrimitiveValueDef";



export function primitiveSUnaryLogicalNot<M extends MaybeSValueMetadata>(
  this: SPrimitiveValue<M, any>
): SBooleanValue<M, boolean> {
  try {
    return new SValues.SBooleanValue(!this.nativeJsValue, this.metadata);
  } catch {
    throw SUserError.cannotPerformLogicalOp("!", this);
  }
}

export function newPrimitiveFromJSValue<M extends MaybeSValueMetadata, P extends SPrimitiveValueType>(
  jsValue: P | unknown,
  metaData: M
): SPrimitiveValue<M, P | undefined | null> | null {
  switch (typeof jsValue) {
  case "number":
    return new SValues.SNumberValue(jsValue as P & number, metaData);
  case "boolean":
    return new SValues.SBooleanValue(jsValue as P & boolean, metaData);
  case "string":
    return new SValues.SStringValue(jsValue as P & string, metaData);
  case "bigint":
    return new SValues.SBigIntValue(jsValue as P & bigint, metaData);
  case "undefined":
    return new SValues.SUndefinedValue(metaData);
  case "function":
  case "object":
    if (jsValue === null) {
      return new SValues.SNullValue(metaData);
    } else {
      // not a primitive actually
      return null;
    }
  case "symbol":
    return new SValues.SSymbolValue(jsValue as P & symbol, metaData);
  }
}