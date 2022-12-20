import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import { SNumberValue } from "./SNumberValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";

export class SUndefinedValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, undefined> {
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SValue<M>): T {
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
  sUnaryNegate(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryTypeOfAsNative(): "undefined" {
    return "undefined";
  }
  sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this {
    return this;
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sChainExpression(): SUndefinedValue<M> {
    return this;
  }
  sGet(p: string | symbol, receiver: SValue<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SUndefinedValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SUndefinedValue(this.combineMetadata(anotherValue, mProvider)) as this;
  }
}


