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

function $sPrimitiveConstructorNotNullOrUndefined<P extends SPrimitiveValueType>() {
  $$ts!(`
    if (typeof value !== "${$$typeToString!<P>()}") {
      throw Error(\`Expected "${$$typeToString!<P>()}" value but received "\${typeof value}".\`);
    }
    this.value = value;
  `)
}

function $sPrimitiveConstructor() {
  $$ts!(`
    this.metadata = metadata;
    Object.freeze(this);
  `)
}

export class SBooleanValue<M extends MaybeSValueMetadata> implements SPrimitiveValue<M, boolean> {
  readonly value!: boolean;
  readonly metadata!: M;
  constructor(value: boolean, metadata: M) {
    $sPrimitiveConstructorNotNullOrUndefined!<boolean>();
    $sPrimitiveConstructor!();
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
    $sPrimitiveConstructorNotNullOrUndefined!<number>();
    $sPrimitiveConstructor!();
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
export class SStringValue<M extends MaybeSValueMetadata> implements SPrimitiveValue<M, string> {
  readonly value!: string;
  readonly metadata!: M;
  constructor(value: string, metadata: M) {
    $sPrimitiveConstructorNotNullOrUndefined!<string>();
    $sPrimitiveConstructor!();
  }
  toNativeJS(): string { return this.value };
  sUnaryNegate(): SNumberValue<M> {
    const stringMadeNegative = -this.value;
    return new SNumberValue(stringMadeNegative, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M> {
    const stringMadePositive = +this.value;
    return new SNumberValue(stringMadePositive, this.metadata);
  };
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SStringValue prototype");
  }
}
export class SBigIntValue<M extends MaybeSValueMetadata> implements SPrimitiveValue<M, bigint> {
  readonly value!: bigint;
  readonly metadata!: M;
  constructor(value: bigint, metadata: M) {
    $sPrimitiveConstructorNotNullOrUndefined!<bigint>();
    $sPrimitiveConstructor!();
  }
  toNativeJS(): bigint { return this.value };
  sUnaryNegate(): SBigIntValue<M> {
    const stringMadeNegative = -this.value;
    return new SBigIntValue(stringMadeNegative, this.metadata);
  };
  sUnaryMakePositive(): SBigIntValue<M> {
    throw Error("Todo: throw a user error (not an error with the transpiler)");
  };
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SBigIntValue prototype");
  }
}

export class SUndefinedValue<M extends MaybeSValueMetadata> implements SPrimitiveValue<M, undefined> {
  readonly value: undefined;
  readonly metadata!: M;
  constructor(metadata: M) {
    $sPrimitiveConstructor!();
  }
  toNativeJS(): undefined { return undefined };
  sUnaryNegate(): SNumberValue<M> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M> {
    return new SNumberValue(NaN, this.metadata);
  };
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SUndefinedValue prototype");
  }
}