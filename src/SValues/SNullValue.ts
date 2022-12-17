import { SMetadataProvider } from "../SMetadataProvider";
import { MaybeSValueMetadata } from "../SValueMetadata";
import { SPrimitiveValue, SValue, SBooleanValue, SNumberValue, SStringValue, SUndefinedValue, $sPrimitiveConstructor } from "./SValues";

export class SNullValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, null> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-null" { return "s-null" };
  readonly nativeJsValue: null = null;
  readonly metadata!: M;
  constructor(metadata: M) {
    super();
    $sPrimitiveConstructor!();
  }
  sUnaryNegate(): SNumberValue<M, -0> {
    return new SNumberValue(-0, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, 0> {
    return new SNumberValue(0, this.metadata);
  };
  sUnaryTypeOf(): SStringValue<M, "object"> {
    return new SStringValue("object", this.metadata);
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
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SNullValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SNullValue(this.combineMetadata(anotherValue, mProvider)) as this;
  }
}