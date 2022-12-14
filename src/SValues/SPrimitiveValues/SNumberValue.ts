import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../AllSValues";
import type { SNormalObject } from "../SObjects/SNormalObject";
import type { SValue } from "../SValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import type { SUndefinedValue } from "./SUndefinedValue";
import type { SReceiverOrTarget } from "../SValueDef";
import SUserError from "../../Models/SUserError";

export class SNumberValue<M extends MaybeSValueMetadata, V extends number> extends SPrimitiveValue<M, V> {
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SReceiverOrTarget<M>): T {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-number" { return "s-number" };
  readonly nativeJsValue!: V & number;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    if (typeof nativeJsValue !== "number") {
      throw Error(`Expected "number" value but received "${typeof nativeJsValue}".`);
    }
    this.nativeJsValue = nativeJsValue;
    this.metadata = metadata;
    Object.freeze(this);
  }
  sToBooleanNative(): boolean {
    return Boolean(this.nativeJsValue);
  }
  sToPropertyKey: () => string = () => {
    return String(this.nativeJsValue);
  }
  sUnaryTypeOfAsNative(): "number" {
    return "number";
  }
  sUnaryNegate(): SNumberValue<M, number> {
    const negatedNumber = -this.nativeJsValue;
    return new SNumberValue(negatedNumber, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, V> {
    return this;
  };
  sChainExpression(p: string | symbol, sTable: SLocalSymbolTable<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on number")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.nativeJsValue as number) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.nativeJsValue as number) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sConvertToObject(sTable: SLocalSymbolTable<M>): SNormalObject<M> {
    return SValues.SNormalObject.exposeNativeBuiltIn<Number, M>(new Number(this.nativeJsValue), sTable.sGlobalProtocols.NumberProtocol, sTable.newMetadataForRuntimeTimeEmergingValue())
  }
  sGet(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    // auto-boxing
    return sTable.sGlobalProtocols.NumberProtocol.sGet(p, receiver === "target" ? this : receiver, sTable);
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.valueMetadataSystem === null) {
      return this;
    }
    return new SNumberValue(this.nativeJsValue, this.combineMetadata(anotherValue, sTable)) as this;
  }
  
  // Conversions to primitives
  sConvertToBooleanPrimitive(): never { throw SUserError.cannotConvertToPrimitive("boolean") }
  sConvertToBigIntPrimitive(): never { throw SUserError.cannotConvertToPrimitive("bigint") }
  sConvertToStringPrimitive(): never { throw SUserError.cannotConvertToPrimitive("string") }
  sConvertToNumberPrimitive(): this { return this }
  sConvertToSymbolPrimitive(): never { throw SUserError.cannotConvertToPrimitive("symbol") }
}
