import { MaybeSValueMetadata } from "./SValueMetadata";
import { $$ts, $$typeToString } from "ts-macros";
import { TranspileContext } from "./TranspileContext";

export interface SValue<M extends MaybeSValueMetadata> {
  metadata: M;
  toNativeJS(): any;
  sUnaryNegate(transpileContext: TranspileContext<M>): SValue<M>;
  sUnaryMakePositive(transpileContext: TranspileContext<M>): SValue<M>;
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M>;
}

export type SObjectValueInitArgs = {

}
export type SObjectValueInitEntry = {

}

export class SObjectValue<M extends MaybeSValueMetadata> implements SValue<M> {
  
  metadata!: M;
  constructor(initArgs: SObjectValueInitArgs, transpileContext: TranspileContext<M>) {
    this.metadata = transpileContext.newMetadataForObjectValue();
  }
  toNativeJS(): any { 
    throw Error("todo")
  };
  sUnaryNegate(transpileContext: TranspileContext<M>): SNumberValue<M> {
    return new SNumberValue(NaN, transpileContext.newMetadataForRuntimeTimeEmergingValue());
  };
  sUnaryMakePositive(transpileContext: TranspileContext<M>): SNumberValue<M> {
    return new SNumberValue(NaN, transpileContext.newMetadataForRuntimeTimeEmergingValue());
  };
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SObjectValue");
  }
}

export interface SPrimitiveValue<
  M extends MaybeSValueMetadata,
  P extends SPrimitiveValueType
> extends SValue<M> {
  readonly value: P;
  readonly metadata: M;
  toNativeJS(): P;
}
type SPrimitiveValueType = bigint | boolean | number | string | undefined | null;

function $sPrimitiveConstructor<P extends SPrimitiveValueType>() {
  return $$ts!(`
    if (typeof value !== "${$$typeToString!<P>()}") {
      throw Error(\`Expected "${$$typeToString!<P>()}" value but received "\${typeof value}".\`);
    }
    this.value = value;
    this.metadata = metadata;
    Object.freeze(this);
  `);
}

export class SBooleanValue<M extends MaybeSValueMetadata> implements SPrimitiveValue<M, boolean> {
  readonly value!: boolean;
  readonly metadata!: M;
  constructor(value: boolean, metadata: M) {
    $sPrimitiveConstructor!<boolean>();
  }
  toNativeJS(): boolean { return this.value };
  sUnaryNegate(): SNumberValue<M> {
    const negatedBool = -this.value;
    return new SNumberValue(negatedBool, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M> {
    const boolMadePositive = +this.value;
    return new SNumberValue(boolMadePositive, this.metadata);
  };
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SBoolean prototype");
  }
}

export class SNumberValue<M extends MaybeSValueMetadata> implements SPrimitiveValue<M, number> {
  readonly value!: number;
  readonly metadata!: M;
  constructor(value: number, metadata: M) {
    $sPrimitiveConstructor!<number>();
  }
  toNativeJS(): number { return this.value };
  sUnaryNegate(): SNumberValue<M> {
    const negatedNumber = -this.value;
    return new SNumberValue(negatedNumber, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M> {
    return this;
  };
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SNumberValue prototype");
  }
}
