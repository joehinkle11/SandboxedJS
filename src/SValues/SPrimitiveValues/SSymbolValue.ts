import SUserError from "../../Models/SUserError";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SValue } from "../SValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import { SUndefinedValue } from "./SUndefinedValue";

export class SSymbolValue<M extends MaybeSValueMetadata, V extends symbol> extends SPrimitiveValue<M, V> {
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SValue<M>): T {
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
  sGet(p: string | symbol, receiver: SValue<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SSymbolValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.valueMetadataSystem === null) {
      return this;
    }
    return new SSymbolValue(this.nativeJsValue, this.combineMetadata(anotherValue, sTable)) as this;
  }
}