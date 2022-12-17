import SUserError from "../../Models/SUserError";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import type { SBooleanValue } from "./SBooleanValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import { SStringValue } from "./SStringValue";
import type { SUndefinedValue } from "./SUndefinedValue";


export class SBigIntValue<M extends MaybeSValueMetadata, V extends bigint> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
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
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on bigint")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as bigint) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as bigint) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SBigIntValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SBigIntValue(this.nativeJsValue, this.combineMetadata(anotherValue, mProvider)) as this;
  }
}
