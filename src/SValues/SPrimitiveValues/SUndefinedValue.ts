import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import { SNumberValue } from "./SNumberValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import SUserError from "../../Models/SUserError";
import type { SReceiverOrTarget } from "../SValueDef";

export class SUndefinedValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, undefined> {
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SReceiverOrTarget<M>): T {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-undefined" { return "s-undefined" };
  readonly nativeJsValue: undefined;
  readonly metadata!: M;
  constructor(metadata: M) {
    super();
    this.metadata = metadata;
    Object.freeze(this);
  }
  sToBooleanNative(): boolean {
    return Boolean(this.nativeJsValue);
  }
  sConvertToObject(): never {
    throw SUserError.cannotConvertToObject;
  }
  sUnaryNegate(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryTypeOfAsNative(): "undefined" {
    return "undefined";
  }
  sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this {
    return this;
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sChainExpression(): SUndefinedValue<M> {
    return this;
  }
  sGet(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SUndefinedValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.valueMetadataSystem === null) {
      return this;
    }
    return new SUndefinedValue(this.combineMetadata(anotherValue, sTable)) as this;
  }
  
  // Conversions to primitives
  sConvertToBooleanPrimitive(): never { throw SUserError.cannotConvertToPrimitive("boolean") }
  sConvertToBigIntPrimitive(): never { throw SUserError.cannotConvertToPrimitive("bigint") }
  sConvertToStringPrimitive(): never { throw SUserError.cannotConvertToPrimitive("string") }
  sConvertToNumberPrimitive(): never { throw SUserError.cannotConvertToPrimitive("number") }
  sConvertToSymbolPrimitive(): never { throw SUserError.cannotConvertToPrimitive("symbol") }
}


