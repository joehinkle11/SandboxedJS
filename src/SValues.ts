import { MaybeSValueMetadata } from "./SValueMetadata";
import { $$ts, $$typeToString } from "ts-macros";

export interface SValue<M extends MaybeSValueMetadata> {
  value: any;
  metadata: M;
  toNativeJS(): any;
  sUnaryNegate(): SValue<M>;
  sUnaryMakePositive(): SValue<M>;
}

export interface SPrimitiveValue<
  M extends MaybeSValueMetadata,
  P extends SPrimitiveValueType
> extends SValue<M> {
  value: P;
  metadata: M;
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
}
