import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import type { SUndefinedValue } from "./SUndefinedValue";

export class SNumberValue<M extends MaybeSValueMetadata, V extends number> extends SPrimitiveValue<M, V> {
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SValue<M>): T {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-number" { return "s-number" };
  readonly nativeJsValue!: V & number;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    if (typeof nativeJsValue !== "number") {
      throw Error(`Expected "number" value but received "${typeof nativeJsValue}".`);
    }
    this.nativeJsValue = nativeJsValue;
    this.metadata = metadata;
    Object.freeze(this);
  }
  sUnaryTypeOfAsNative(): "number" {
    return "number";
  }
  sUnaryNegate(): SNumberValue<M, number> {
    const negatedNumber = -this.nativeJsValue;
    return new SNumberValue(negatedNumber, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, V> {
    return this;
  };
  sChainExpression(p: string | symbol, sTable: SLocalSymbolTable<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on number")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as number) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as number) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SValue<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    return sTable.sGlobalProtocols.NumberProtocol.sGet(p, receiver, sTable);
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SNumberValue(this.nativeJsValue, this.combineMetadata(anotherValue, mProvider)) as this;
  }
}
