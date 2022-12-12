import { MaybeSValueMetadata } from "./SValueMetadata";
import { $$ts, $$typeToString } from "ts-macros";
import { TranspileContext } from "./TranspileContext";
import SUserErrorImport from "./Models/SUserError";
const SUserError = SUserErrorImport;

export type SValueKind = "s-object" | SValuePrimitiveKind;
export type SValuePrimitiveKind = "s-boolean" | "s-number" | "s-bigint" | "s-string" | "s-undefined" | "s-null";
export abstract class SValue<M extends MaybeSValueMetadata> {
  abstract get sValueKind(): SValueKind;
  abstract metadata: M;
  abstract toNativeJS(): any;
  abstract sUnaryNegate(transpileContext: TranspileContext<M>): SValue<M>;
  abstract sUnaryMakePositive(transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryMult(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryDiv(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryExpo(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryMod(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
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
  get sValueKind(): "s-object" { return "s-object" };
  metadata!: M;

  // sIsExtensible: boolean;
  // sIsSealed: boolean;
  // sIsFrozen: boolean;

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
    
    return new SUndefinedValue<M>(this.metadata);
  }
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    throw SUserError.cannotPerformBinaryOp("+", this, right);
  }
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    throw SUserError.cannotPerformBinaryOp("-", this, right);
  }
  sBinaryMult(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    throw SUserError.cannotPerformBinaryOp("*", this, right);
  }
  sBinaryDiv(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    throw SUserError.cannotPerformBinaryOp("/", this, right);
  }
  sBinaryExpo(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    throw SUserError.cannotPerformBinaryOp("**", this, right);
  }
  sBinaryMod(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M> {
    const resultingMetadata = this.combineMetadata(right, transpileContext);
    throw SUserError.cannotPerformBinaryOp("%", this, right);
  }
}
function $sBinaryOpOnPrimitives(binaryOp: "+" | "-" | "*" | "/" | "**" | "%") {
  $$ts!(`
    try {
      if (right instanceof SPrimitiveValue) {
        const resultingMetadata = this.combineMetadata(right, transpileContext);
        const addResult = this.value ${binaryOp} right.value;
        const newSPrimitive = SPrimitiveValue.newPrimitiveFromJSValue(addResult, resultingMetadata);
        if (newSPrimitive !== null) {
          return newSPrimitive;
        }
      }
    } catch {}
    throw SUserError.cannotPerformBinaryOp("${binaryOp}", this, right);
  `);
}
export abstract class SPrimitiveValue<
  M extends MaybeSValueMetadata,
  P extends SPrimitiveValueType
> extends SValue<M> {
  abstract get sValueKind(): SValuePrimitiveKind;
  abstract readonly value: P;
  abstract readonly metadata: M;
  toNativeJS(): P {
    return this.value
  }
  // @ts-expect-error
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SPrimitiveValue<M, any> {
    $sBinaryOpOnPrimitives!("+");
  }
  // @ts-expect-error
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("-");
  }
  // @ts-expect-error
  sBinaryMult(right: SValue<M>, transpileContext: TranspileContext<M>): SPrimitiveValue<M, any> {
    $sBinaryOpOnPrimitives!("*");
  }
  // @ts-expect-error
  sBinaryDiv(right: SValue<M>, transpileContext: TranspileContext<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("/");
  }
  // @ts-expect-error
  sBinaryExpo(right: SValue<M>, transpileContext: TranspileContext<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("**");
  }
  // @ts-expect-error
  sBinaryMod(right: SValue<M>, transpileContext: TranspileContext<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("%");
  }
  static newPrimitiveFromJSValue<M extends MaybeSValueMetadata>(
    jsValue: any,
    metaData: M
  ): SPrimitiveValue<M, any> | null {
    switch (typeof jsValue) {
    case "number":
      return new SNumberValue(jsValue, metaData);
    case "boolean":
      return new SBooleanValue(jsValue, metaData);
    case "string":
      return new SStringValue(jsValue, metaData);
    case "bigint":
      return new SBigIntValue(jsValue, metaData);
    case "undefined":
      return new SUndefinedValue(metaData);
    case "function":
    case "object":
      if (jsValue === null) {
        return new SUndefinedValue(metaData);
      } else {
        // not a primitive actually
        return null;
      }
    case "symbol":
      // todo
      return null
    }
  }
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

export class SBooleanValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, boolean> {
  get sValueKind(): "s-boolean" { return "s-boolean" };
  readonly value!: boolean;
  readonly metadata!: M;
  constructor(value: boolean, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<boolean>();
    $sPrimitiveConstructor!();
  }
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

export class SNumberValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, number> {
  get sValueKind(): "s-number" { return "s-number" };
  readonly value!: number;
  readonly metadata!: M;
  constructor(value: number, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<number>();
    $sPrimitiveConstructor!();
  }
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
export class SStringValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, string> {
  get sValueKind(): "s-string" { return "s-string" };
  readonly value!: string;
  readonly metadata!: M;
  constructor(value: string, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<string>();
    $sPrimitiveConstructor!();
  }
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
export class SBigIntValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, bigint> {
  get sValueKind(): "s-bigint" { return "s-bigint" };
  readonly value!: bigint;
  readonly metadata!: M;
  constructor(value: bigint, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<bigint>();
    $sPrimitiveConstructor!();
  }
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

export class SUndefinedValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, undefined> {
  get sValueKind(): "s-undefined" { return "s-undefined" };
  readonly value: undefined;
  readonly metadata!: M;
  constructor(metadata: M) {
    super();
    $sPrimitiveConstructor!();
  }
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
export class SNullValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, null> {
  get sValueKind(): "s-null" { return "s-null" };
  readonly value: null = null;
  readonly metadata!: M;
  constructor(metadata: M) {
    super();
    $sPrimitiveConstructor!();
  }
  sUnaryNegate(): SNumberValue<M> {
    return new SNumberValue(-0, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M> {
    return new SNumberValue(0, this.metadata);
  };
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SNullValue prototype");
  }
}