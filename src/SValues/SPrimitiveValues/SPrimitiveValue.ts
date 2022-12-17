import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValue } from "../SValue";
import type { SValuePrimitiveKind } from "../SValueDef";
import type { SBooleanValue } from "./SBooleanValue";
import { SPrimitiveValueType } from "./SPrimitiveValueDef";
import { newPrimitiveFromJSValue, primitiveSUnaryLogicalNot } from "./SPrimitiveValueImpl";

export abstract class SPrimitiveValue<
  M extends MaybeSValueMetadata,
  P extends SPrimitiveValueType
> extends SValue<M> {
  abstract get sValueKind(): SValuePrimitiveKind;
  abstract readonly nativeJsValue: P;
  abstract readonly metadata: M;
  sOwnKeysNative(): (string | symbol)[] {
    throw Error("todo sOwnKeysNative on primitive")
  }
  sApply(): never {
    throw Error("todo sApply on primitive")
  }
  sUnaryLogicalNot: () => SBooleanValue<M, boolean> = primitiveSUnaryLogicalNot;
  static newPrimitiveFromJSValue: <M extends MaybeSValueMetadata, P extends SPrimitiveValueType>(
    jsValue: P,
    metaData: M
  ) => SPrimitiveValue<M, P | undefined | null> | null = newPrimitiveFromJSValue;
}