import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import type { SBooleanValue } from "./SBooleanValue";
import { SNumberValue } from "./SNumberValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import type { SUndefinedValue } from "./SUndefinedValue";

export class SStringValue<M extends MaybeSValueMetadata, V extends string> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-string" { return "s-string" };
  readonly nativeJsValue!: V & string;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    if (typeof nativeJsValue !== "string") {
      throw Error(`Expected "string" value but received "${typeof nativeJsValue}".`);
    }
    this.nativeJsValue = nativeJsValue;
    this.metadata = metadata;
    Object.freeze(this);
  }
  sUnaryNegate(): SNumberValue<M, number> {
    const stringMadeNegative = -this.nativeJsValue;
    return new SNumberValue(stringMadeNegative, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, number> {
    const stringMadePositive = +this.nativeJsValue;
    return new SNumberValue(stringMadePositive, this.metadata);
  };
  sUnaryTypeOfAsNative(): "string" {
    return "string";
  }
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on string")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as string) && 2;
    if (r === 2) {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as string) || 2;
    if (r === 2) {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SStringValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SStringValue(this.nativeJsValue, this.combineMetadata(anotherValue, mProvider)) as this;
  }
}

