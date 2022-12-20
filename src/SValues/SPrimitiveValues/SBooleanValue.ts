import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import { SNumberValue } from "./SNumberValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SUndefinedValue } from "./SUndefinedValue";

export class SBooleanValue<M extends MaybeSValueMetadata, V extends boolean> extends SPrimitiveValue<M, V> {
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SValue<M>): T {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-boolean" { return "s-boolean" };
  readonly nativeJsValue!: V;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    if (typeof nativeJsValue !== "boolean") {
      throw Error(`Expected "boolean" value but received "${typeof nativeJsValue}".`);
    }
    this.nativeJsValue = nativeJsValue;
    this.metadata = metadata;
    Object.freeze(this);
  }
  sUnaryNegate(): SNumberValue<M, number> {
    const negatedBool = -this.nativeJsValue;
    return new SNumberValue(negatedBool, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, number> {
    const boolMadePositive = +this.nativeJsValue;
    return new SNumberValue(boolMadePositive, this.metadata);
  };
  sUnaryTypeOfAsNative(): "boolean" {
    return "boolean";
  }
  sChainExpression(p: string | symbol, sTable: SLocalSymbolTable<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on boolean")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as boolean) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as boolean) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SValue<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SBoolean prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SBooleanValue(this.nativeJsValue, this.combineMetadata(anotherValue, mProvider)) as this;
  }
}
