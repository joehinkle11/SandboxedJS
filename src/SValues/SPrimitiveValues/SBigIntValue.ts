import SUserError from "../../Models/SUserError";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { SPrimitiveValue } from "./SPrimitiveValue";
import type { SUndefinedValue } from "./SUndefinedValue";
import type { SNormalObject } from "../SObjects/SNormalObject";
import { SValues } from "../AllSValues";
import type { SReceiverOrTarget } from "../SValueDef";

export class SBigIntValue<M extends MaybeSValueMetadata, V extends bigint> extends SPrimitiveValue<M, V> {
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SReceiverOrTarget<M>): T {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-bigint" { return "s-bigint" };
  readonly nativeJsValue!: V;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    if (typeof nativeJsValue !== "bigint") {
      throw Error(`Expected "bigint" value but received "${typeof nativeJsValue}".`);
    }
    this.nativeJsValue = nativeJsValue;
    this.metadata = metadata;
    Object.freeze(this);
  }
  sToBooleanNative(): boolean {
    return Boolean(this.nativeJsValue);
  }
  sConvertToObject(sTable: SLocalSymbolTable<M>): SNormalObject<M> {
    return SValues.SNormalObject.exposeNativeBuiltIn<BigInt, M>(Object(this.nativeJsValue), sTable.sGlobalProtocols.NumberProtocol, sTable.newMetadataForRuntimeTimeEmergingValue())
  }
  sUnaryNegate(): SBigIntValue<M, bigint> {
    const stringMadeNegative: bigint = -(this.nativeJsValue as bigint);
    return new SBigIntValue(stringMadeNegative, this.metadata);
  };
  sUnaryMakePositive(): never {
    throw SUserError.cannotConvertBigIntToNumber
  };
  sUnaryTypeOfAsNative(): "bigint" {
    return "bigint";
  }
  sChainExpression(p: string | symbol, sTable: SLocalSymbolTable<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on bigint")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.nativeJsValue as bigint) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.nativeJsValue as bigint) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    // auto-boxing
    return sTable.sGlobalProtocols.BigIntProtocol.sGet(p, receiver === "target" ? this : receiver, sTable);
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.valueMetadataSystem === null) {
      return this;
    }
    return new SBigIntValue(this.nativeJsValue, this.combineMetadata(anotherValue, sTable)) as this;
  }
  
  // Conversions to primitives
  sConvertToBooleanPrimitive(): never { throw SUserError.cannotConvertToPrimitive("boolean") }
  sConvertToBigIntPrimitive(): this { return this }
  sConvertToStringPrimitive(): never { throw SUserError.cannotConvertToPrimitive("string") }
  sConvertToNumberPrimitive(): never { throw SUserError.cannotConvertToPrimitive("number") }
  sConvertToSymbolPrimitive(): never { throw SUserError.cannotConvertToPrimitive("symbol") }
}
