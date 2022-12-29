import SUserError from "../../Models/SUserError";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SValue } from "../SValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import { SUndefinedValue } from "./SUndefinedValue";
import { SValues } from "../AllSValues";
import { SNormalObject } from "../SObjects/SNormalObject";
import type { SReceiverOrTarget } from "../SValueDef";

export class SSymbolValue<M extends MaybeSValueMetadata, V extends symbol> extends SPrimitiveValue<M, V> {

  // Since the sandbox uses actual JS symbols, we add a prefix to help us distinguish user created symbols and host created symbols.
  static sandboxedSymbolPrefix = "Sandboxed-";

  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SReceiverOrTarget<M>): T {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-symbol" { return "s-symbol" };
  readonly nativeJsValue!: V;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    if (typeof nativeJsValue !== "symbol") {
      throw Error(`Expected "symbol" value but received "${typeof nativeJsValue}".`);
    }
    this.nativeJsValue = nativeJsValue;
    this.metadata = metadata;
    Object.freeze(this);
  }
  sToBooleanNative(): boolean {
    return Boolean(this.nativeJsValue);
  }
  sConvertToObject(sTable: SLocalSymbolTable<M>): SNormalObject<M> {
    return SValues.SNormalObject.exposeNativeBuiltIn<Symbol, M>(Object(this.nativeJsValue), sTable.sGlobalProtocols.NumberProtocol, sTable.newMetadataForRuntimeTimeEmergingValue())
  }
  sToPropertyKey: () => symbol = () => {
    return this.nativeJsValue;
  }
  sUnaryNegate(): never {
    throw SUserError.cannotPerformUnaryOp("-", this);
  };
  sUnaryMakePositive(): never {
    throw SUserError.cannotPerformUnaryOp("+", this);
  };
  sUnaryTypeOfAsNative(): "symbol" {
    return "symbol";
  }
  sChainExpression(): SUndefinedValue<M> {
    return new SUndefinedValue<M>(this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    return this;
  }
  sGet(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    // auto-boxing
    return sTable.sGlobalProtocols.SymbolProtocol.sGet(p, receiver === "target" ? this : receiver, sTable);
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.valueMetadataSystem === null) {
      return this;
    }
    return new SSymbolValue(this.nativeJsValue, this.combineMetadata(anotherValue, sTable)) as this;
  }
  
  // Conversions to primitives
  sConvertToBooleanPrimitive(): never { throw SUserError.cannotConvertToPrimitive("boolean") }
  sConvertToBigIntPrimitive(): never { throw SUserError.cannotConvertToPrimitive("bigint") }
  sConvertToStringPrimitive(): never { throw SUserError.cannotConvertToPrimitive("string") }
  sConvertToNumberPrimitive(): never { throw SUserError.cannotConvertToPrimitive("number") }
  sConvertToSymbolPrimitive(): this { return this }
}
