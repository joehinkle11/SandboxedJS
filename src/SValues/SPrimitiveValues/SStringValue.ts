import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { SNumberValue } from "./SNumberValue";
import { SPrimitiveValue } from "./SPrimitiveValue";
import type { SUndefinedValue } from "./SUndefinedValue";

export class SStringValue<M extends MaybeSValueMetadata, V extends string> extends SPrimitiveValue<M, V> {
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SValue<M>): T {
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
  sToPropertyKey: () => string = () => {
    return this.nativeJsValue;
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
  sChainExpression(p: string | symbol, sTable: SLocalSymbolTable<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on string")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.nativeJsValue as string) && 2;
    if (r === 2) {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.nativeJsValue as string) || 2;
    if (r === 2) {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SValue<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    if (typeof p === "string") {
      const num = parseInt(p);
      if (num >= 0) {
        const result = this.nativeJsValue[num];
        return new SStringValue(result, this.metadata);
      }
    }
    // auto-boxing
    return sTable.sGlobalProtocols.StringProtocol.sGet(p, receiver, sTable);
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.valueMetadataSystem === null) {
      return this;
    }
    return new SStringValue(this.nativeJsValue, this.combineMetadata(anotherValue, sTable)) as this;
  }
}

