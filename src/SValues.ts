import { MaybeSValueMetadata } from "./SValueMetadata";
import { $$ts, $$typeToString } from "ts-macros";
import { TranspileContext } from "./TranspileContext";
import { SUserError } from "./Models/SUserError";

export abstract class SValue<M extends MaybeSValueMetadata> {
  abstract metadata: M;
  abstract toNativeJS(): any;
  abstract sUnaryNegate(transpileContext: TranspileContext<M>): SValue<M>;
  abstract sUnaryMakePositive(transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M>;
  combineMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): M {
    const valueMetadataSystem = transpileContext.valueMetadataSystem;
    return valueMetadataSystem === null ? undefined : valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue);
  }
}

export type SObjectValueInitArgs = {

}
export type SObjectValueInitEntry = {

}

export class SObjectValue<M extends MaybeSValueMetadata> extends SValue<M> {
  
  metadata!: M;
  constructor(initArgs: SObjectValueInitArgs, transpileContext: TranspileContext<M>) {
    super();
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
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    throw SUserError.cannotPerformBinaryOp("+", this, right);
  }
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    throw SUserError.cannotPerformBinaryOp("-", this, right);
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

export class SBooleanValue<M extends MaybeSValueMetadata> extends SValue<M> implements SPrimitiveValue<M, boolean> {
  readonly value!: boolean;
  readonly metadata!: M;
  constructor(value: boolean, metadata: M) {
    super();
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
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SNumberValue) {
      return new SNumberValue(Number(this.value) + right.value, resultingMetadata);
    } else if (right instanceof SStringValue) {
      return new SStringValue(this.value + right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(Number(this.value) + Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(Number(this.value), resultingMetadata);
    }
    throw SUserError.cannotPerformBinaryOp("+", this, right);
  }
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SNumberValue) {
      return new SNumberValue(Number(this.value) - right.value, resultingMetadata);
    } else if (right instanceof SStringValue) {
      return new SNumberValue(Number(this.value) - Number(right.value), resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(Number(this.value) - Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(Number(this.value), resultingMetadata);
    }
    throw SUserError.cannotPerformBinaryOp("-", this, right);
  }
}

export class SNumberValue<M extends MaybeSValueMetadata> extends SValue<M> implements SPrimitiveValue<M, number> {
  readonly value!: number;
  readonly metadata!: M;
  constructor(value: number, metadata: M) {
    super();
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
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SNumberValue) {
      return new SNumberValue(this.value + right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(this.value + Number(right.value), resultingMetadata);
    } else if (right instanceof SStringValue) {
      return new SStringValue(this.value + right.value, resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(this.value, resultingMetadata);
    }
    throw SUserError.cannotPerformBinaryOp("+", this, right);
  }
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SNumberValue) {
      return new SNumberValue(this.value - right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(this.value - Number(right.value), resultingMetadata);
    } else if (right instanceof SStringValue) {
      return new SNumberValue(this.value - Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(this.value, resultingMetadata);
    }
    throw SUserError.cannotPerformBinaryOp("-", this, right);
  }
}
export class SStringValue<M extends MaybeSValueMetadata> extends SValue<M> implements SPrimitiveValue<M, string> {
  readonly value!: string;
  readonly metadata!: M;
  constructor(value: string, metadata: M) {
    super();
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
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SStringValue) {
      return new SStringValue(this.value + right.value, resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SStringValue(this.value + right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SStringValue(this.value + right.value, resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SStringValue(this.value + right.value, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SStringValue(this.value + right.value, resultingMetadata);
    }
    throw SUserError.cannotPerformBinaryOp("+", this, right);
  }
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SStringValue) {
      return new SNumberValue(Number(this.value) - Number(right.value), resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SNumberValue(Number(this.value) - right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(Number(this.value) - Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(NaN, resultingMetadata);
    }
    throw SUserError.cannotPerformBinaryOp("-", this, right);
  }
}
export class SBigIntValue<M extends MaybeSValueMetadata> extends SValue<M> implements SPrimitiveValue<M, bigint> {
  readonly value!: bigint;
  readonly metadata!: M;
  constructor(value: bigint, metadata: M) {
    super();
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
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SBigIntValue) {
      return new SBigIntValue(this.value + right.value, resultingMetadata);
    } else {
      throw SUserError.invalidMixBigInt;
    }
  }
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SBigIntValue) {
      return new SBigIntValue(this.value - right.value, resultingMetadata);
    } else {
      throw SUserError.invalidMixBigInt
    }
  }
}

export class SUndefinedValue<M extends MaybeSValueMetadata> extends SValue<M> implements SPrimitiveValue<M, undefined> {
  readonly value: undefined;
  readonly metadata!: M;
  constructor(metadata: M) {
    super();
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
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SStringValue) {
      return new SStringValue(this.value + right.value, resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(NaN, resultingMetadata);
    }
    throw SUserError.cannotPerformBinaryOp("+", this, right);
  }
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SBigIntValue) {
      throw SUserError.invalidMixBigInt;
    } else {
      return new SNumberValue(NaN, resultingMetadata);
    }
  }
}
export class SNullValue<M extends MaybeSValueMetadata> extends SValue<M> implements SPrimitiveValue<M, null> {
  readonly value: null = null;
  readonly metadata!: M;
  constructor(metadata: M) {
    super();
    $sPrimitiveConstructor!();
  }
  toNativeJS(): null { return null };
  sUnaryNegate(): SNumberValue<M> {
    return new SNumberValue(-0, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M> {
    return new SNumberValue(0, this.metadata);
  };
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SNullValue prototype");
  }
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SStringValue) {
      return new SStringValue(this.value + right.value, resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SNumberValue(right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SNullValue) {
      return new SNumberValue(0, resultingMetadata);
    }
    throw SUserError.cannotPerformBinaryOp("+", this, right);
  }
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    if (right instanceof SStringValue) {
      return new SNumberValue(-Number(right.value), resultingMetadata);
    } else if (right instanceof SNumberValue) {
      return new SNumberValue(-right.value, resultingMetadata);
    } else if (right instanceof SBooleanValue) {
      return new SNumberValue(-Number(right.value), resultingMetadata);
    } else if (right instanceof SUndefinedValue) {
      return new SNumberValue(NaN, resultingMetadata);
    } else if (right instanceof SBigIntValue) {
      throw SUserError.invalidMixBigInt;
    } else if (right instanceof SNullValue) {
      return new SNumberValue(0, resultingMetadata);
    }
    throw SUserError.cannotPerformBinaryOp("-", this, right);
  }
}