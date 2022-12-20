import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import { SNumberValue } from "./SNumberValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { SUndefinedValue } from "./SUndefinedValue";


export class SNullValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, null> {
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SValue<M>): T {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-null" { return "s-null" };
  readonly nativeJsValue: null = null;
  readonly metadata!: M;
  constructor(metadata: M) {
    super();
    this.metadata = metadata;
    Object.freeze(this);
  }
  sUnaryNegate(): SNumberValue<M, -0> {
    return new SNumberValue(-0, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, 0> {
    return new SNumberValue(0, this.metadata);
  };
  sUnaryTypeOfAsNative(): "object" {
    return "object";
  }
  sChainExpression(): SUndefinedValue<M> {
    return new SUndefinedValue<M>(this.metadata);
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
  sGet(p: string | symbol, receiver: SValue<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SNullValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SNullValue(this.combineMetadata(anotherValue, mProvider)) as this;
  }
}