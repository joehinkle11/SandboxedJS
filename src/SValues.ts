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
  abstract sUnaryNegate(): SValue<M>;
  abstract sUnaryMakePositive(): SValue<M>;
  abstract sUnaryTypeOf(): SStringValue<M, JSTypeOfString>;
  abstract sUnaryLogicalNot(): SBooleanValue<M, boolean>;
  abstract sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryMult(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryDiv(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryExpo(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBinaryMod(right: SValue<M>, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sBitwiseAND(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M, number> | SBigIntValue<M, bigint>;
  abstract sBitwiseOR(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M, number> | SBigIntValue<M, bigint>;
  abstract sBitwiseNOT(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M, number> | SBigIntValue<M, bigint>;
  abstract sBitwiseXOR(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M, number> | SBigIntValue<M, bigint>;
  abstract sBitwiseLeftShift(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M, number> | SBigIntValue<M, bigint>;
  abstract sBitwiseRightShift(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M, number> | SBigIntValue<M, bigint>;
  abstract sBitwiseUnsignedRight(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M, number> | SBigIntValue<M, bigint>;
  abstract sCompEqualValue(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean>;
  abstract sCompEqualValueAndEqualType(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean>;
  abstract sCompNotEqualValue(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean>;
  abstract sCompNotEqualValueAndEqualType(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean>;
  abstract sCompGreaterThan(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean>;
  abstract sCompLessThan(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean>;
  abstract sCompGreaterThanOrEqualTo(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean>;
  abstract sCompLessThanOrEqualTo(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean>;
  abstract sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue;
  abstract sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue;
  abstract sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue;
  abstract sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M>;
  combineMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): M {
    const valueMetadataSystem = transpileContext.valueMetadataSystem;
    return valueMetadataSystem === null ? undefined : valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue);
  }
  abstract addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this;
}

export type JSTypeOfString = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export type SObjectValueInitArgs<M extends MaybeSValueMetadata> = {
  kind: SBuiltInObjectKind
  props: SOwnProperties<M>
}
// modeled after documentation on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
export type SObjectValueInitEntry<M extends MaybeSValueMetadata> = (SObjectValueInitDataEntry<M> | SObjectValueInitAccessorEntry<M>) & {
  configurable: boolean | undefined // defaults to false
  enumerable: boolean | undefined // defaults to false
  isAccessorEntry: true | undefined // defaults to undefined (which is false)
};
export type SObjectValueInitDataEntry<M extends MaybeSValueMetadata> = {
  value: SValue<M>
  writable: boolean | undefined // defaults to false
  isAccessorEntry: undefined
}
export type SObjectValueInitAccessorEntry<M extends MaybeSValueMetadata> = {
  get: unknown // todo
  set: unknown // todo
  isAccessorEntry: true
};

export type SBuiltInObjectKind = "normal";
export type SBuiltInObjectInfo = null;
type SOwnProperties<M extends MaybeSValueMetadata> = Record<string, SObjectValueInitEntry<M> | undefined>
export class SObjectValue<M extends MaybeSValueMetadata, O extends SBuiltInObjectInfo> extends SValue<M> {
  get sValueKind(): "s-object" { return "s-object" };
  metadata!: M;

  readonly sBuiltInObjectInfo: O;
  // sIsExtensible: boolean;
  // sIsSealed: boolean;
  // sIsFrozen: boolean;
  sOwnProperties: SOwnProperties<M>;

  constructor(initArgs: SObjectValueInitArgs<M>, transpileContext: TranspileContext<M>) {
    super();
    switch (initArgs.kind) {
    case "normal":
      this.sBuiltInObjectInfo = null as O;
      break;
    default:
      throw Error(`Unknown builtin object kind "${initArgs.kind}"`)
    }
    this.sOwnProperties = initArgs.props;
    this.metadata = transpileContext.newMetadataForObjectValue();
  }
  toNativeJS(): any { 
    throw Error("todo")
  };
  sUnaryNegate(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryTypeOf(): SStringValue<M, "object" | "function"> {
    // todo: determine if this object is a function
    return new SStringValue("object", this.metadata);
  }
  sUnaryLogicalNot(): SBooleanValue<M, false> {
    return new SBooleanValue(false, this.metadata);
  }
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    // lookup own first
    const ownResult = this.sOwnProperties[name];
    if (ownResult !== undefined) {
      // hit on own properties
      if (ownResult.isAccessorEntry) {
        throw Error("Todo: handle accessor property entry lookup")
      } else {
        return ownResult.value.addingMetadata(this, transpileContext);
      }
    }
    // todo: lookup in protocol chain
    return new SUndefinedValue<M>(this.metadata);
  }
  sBinaryAdd(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("+", this, right);
  }
  sBinarySubtract(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("-", this, right);
  }
  sBinaryMult(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("*", this, right);
  }
  sBinaryDiv(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("/", this, right);
  }
  sBinaryExpo(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("**", this, right);
  }
  sBinaryMod(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("%", this, right);
  }
  sBitwiseAND(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("&", this, right);
  }
  sBitwiseOR(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("|", this, right);
  }
  sBitwiseNOT(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("~", this, right);
  }
  sBitwiseXOR(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("^", this, right);
  }
  sBitwiseLeftShift(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp("<<", this, right);
  }
  sBitwiseRightShift(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp(">>", this, right);
  }
  sBitwiseUnsignedRight(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformBinaryOp(">>>", this, right);
  }
  sCompEqualValue(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformComparison("==", this, right);
  }
  sCompEqualValueAndEqualType(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformComparison("===", this, right);
  }
  sCompNotEqualValue(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformComparison("!=", this, right);
  }
  sCompNotEqualValueAndEqualType(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformComparison("!==", this, right);
  }
  sCompGreaterThan(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformComparison(">", this, right);
  }
  sCompLessThan(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformComparison("<", this, right);
  }
  sCompGreaterThanOrEqualTo(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformComparison(">=", this, right);
  }
  sCompLessThanOrEqualTo(right: SValue<M>, transpileContext: TranspileContext<M>): never {
    throw SUserError.cannotPerformComparison("<=", this, right);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): RSValue {
    return getRight().addingMetadata(this, transpileContext);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this {
    return this;
  }
  addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this {
    if (transpileContext.valueMetadataSystem === null) {
      return this;
    }
    throw Error("toddddooo addingMetadata on s-object")
  }
}
function $sBinaryOpOnPrimitives(binaryOp: "+" | "-" | "*" | "/" | "**" | "%") {
  $$ts!(`
    try {
      if (right instanceof SPrimitiveValue) {
        const resultingMetadata = this.combineMetadata(right, transpileContext);
        const opResult = this.value ${binaryOp} right.value;
        const newSPrimitive = SPrimitiveValue.newPrimitiveFromJSValue(opResult, resultingMetadata);
        if (newSPrimitive !== null) {
          return newSPrimitive;
        }
      }
    } catch {}
    throw SUserError.cannotPerformBinaryOp("${binaryOp}", this, right);
  `);
}
function $sBitwiseOpOnPrimitive(bitwise: "&" | "|" | "~" | "^" | "<<" | ">>" | ">>>") {
  $$ts!(`
    try {
      if (right instanceof SPrimitiveValue) {
        const resultingMetadata = this.combineMetadata(right, transpileContext);
        const bitwiseResult = this.value ${bitwise} right.value;
        if (typeof bitwiseResult === "number") {
          const newSNumber = new SNumberValue(bitwiseResult, resultingMetadata);
          if (newSNumber !== null) {
            return newSNumber;
          }
        } else {
          // probably is a bigint
          const newSBigInt = new SBigIntValue(bitwiseResult, resultingMetadata);
          if (newSBigInt !== null) {
            return newSBigInt;
          }
        }
      }
    } catch {}
    throw SUserError.cannotPerformBitwiseOp("${bitwise}", this, right);
  `);
}

function $sComparisonOpOnPrimitive(comparison: "==" | "===" | "!=" | "!==" | ">" | "<" | ">=" | "<=") {
  $$ts!(`
    try {
      if (right instanceof SPrimitiveValue) {
        const resultingMetadata = this.combineMetadata(right, transpileContext);
        const comparisonResult = this.value ${comparison} right.value;
        const newSBoolean = new SBooleanValue(comparisonResult, resultingMetadata);
        if (newSBoolean !== null) {
          return newSBoolean;
        }
      }
    } catch {}
    throw SUserError.cannotPerformBitwiseOp("${comparison}", this, right);
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
  sUnaryLogicalNot(): SBooleanValue<M, boolean> {
    try {
      return new SBooleanValue(!this.value, this.metadata);
    } catch {
      throw SUserError.cannotPerformLogicalOp("!", this);
    }
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
  // @ts-expect-error
  sBitwiseAND(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("&")
  }
  // @ts-expect-error
  sBitwiseOR(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("|")
  }
  // @ts-expect-error
  sBitwiseNOT(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("~")
  }
  // @ts-expect-error
  sBitwiseXOR(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("^")
  }
  // @ts-expect-error
  sBitwiseLeftShift(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("<<")
  }
  // @ts-expect-error
  sBitwiseRightShift(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!(">>")
  }
  // @ts-expect-error
  sBitwiseUnsignedRight(right: SValue<M>, transpileContext: TranspileContext<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!(">>>")
  }
  // @ts-expect-error
  sCompEqualValue(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("==")
  }
  // @ts-expect-error
  sCompEqualValueAndEqualType(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("===")
  }
  // @ts-expect-error
  sCompNotEqualValue(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("!=")
  }
  // @ts-expect-error
  sCompNotEqualValueAndEqualType(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("!==")
  }
  // @ts-expect-error
  sCompGreaterThan(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!(">")
  }
  // @ts-expect-error
  sCompLessThan(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("<")
  }
  // @ts-expect-error
  sCompGreaterThanOrEqualTo(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!(">=")
  }
  // @ts-expect-error
  sCompLessThanOrEqualTo(right: SValue<M>, transpileContext: TranspileContext<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("<=")
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

export class SBooleanValue<M extends MaybeSValueMetadata, V extends boolean> extends SPrimitiveValue<M, V> {
  get sValueKind(): "s-boolean" { return "s-boolean" };
  readonly value!: V;
  readonly metadata!: M;
  constructor(value: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<boolean>();
    $sPrimitiveConstructor!();
  }
  sUnaryNegate(): SNumberValue<M, number> {
    const negatedBool = -this.value;
    return new SNumberValue(negatedBool, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, number> {
    const boolMadePositive = +this.value;
    return new SNumberValue(boolMadePositive, this.metadata);
  };
  sUnaryTypeOf(): SStringValue<M, "boolean"> {
    return new SStringValue("boolean", this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    const r = (this.value as boolean) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, transpileContext);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    const r = (this.value as boolean) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, transpileContext);
    } else {
      return this;
    }
  }
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SBoolean prototype");
  }
  addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this {
    if (transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SBooleanValue(this.value, this.combineMetadata(anotherValue, transpileContext)) as this;
  }
}

export class SNumberValue<M extends MaybeSValueMetadata, V extends number> extends SPrimitiveValue<M, V> {
  get sValueKind(): "s-number" { return "s-number" };
  readonly value!: V;
  readonly metadata!: M;
  constructor(value: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<number>();
    $sPrimitiveConstructor!();
  }
  sUnaryNegate(): SNumberValue<M, number> {
    const negatedNumber = -this.value;
    return new SNumberValue(negatedNumber, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, V> {
    return this;
  };
  sUnaryTypeOf(): SStringValue<M, "number"> {
    return new SStringValue("number", this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    const r = (this.value as number) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, transpileContext);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    const r = (this.value as number) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, transpileContext);
    } else {
      return this;
    }
  }
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SNumberValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this {
    if (transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SNumberValue(this.value, this.combineMetadata(anotherValue, transpileContext)) as this;
  }
}
export class SStringValue<M extends MaybeSValueMetadata, V extends string> extends SPrimitiveValue<M, V> {
  get sValueKind(): "s-string" { return "s-string" };
  readonly value!: V;
  readonly metadata!: M;
  constructor(value: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<string>();
    $sPrimitiveConstructor!();
  }
  sUnaryNegate(): SNumberValue<M, number> {
    const stringMadeNegative = -this.value;
    return new SNumberValue(stringMadeNegative, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, number> {
    const stringMadePositive = +this.value;
    return new SNumberValue(stringMadePositive, this.metadata);
  };
  sUnaryTypeOf(): SStringValue<M, "string"> {
    return new SStringValue("string", this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    const r = (this.value as string) && 2;
    if (r === 2) {
      return getRight().addingMetadata(this, transpileContext);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    const r = (this.value as string) || 2;
    if (r === 2) {
      return getRight().addingMetadata(this, transpileContext);
    } else {
      return this;
    }
  }
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SStringValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this {
    if (transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SStringValue(this.value, this.combineMetadata(anotherValue, transpileContext)) as this;
  }
}
export class SBigIntValue<M extends MaybeSValueMetadata, V extends bigint> extends SPrimitiveValue<M, V> {
  get sValueKind(): "s-bigint" { return "s-bigint" };
  readonly value!: V;
  readonly metadata!: M;
  constructor(value: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<bigint>();
    $sPrimitiveConstructor!();
  }
  sUnaryNegate(): SBigIntValue<M, bigint> {
    const stringMadeNegative: bigint = -(this.value as bigint);
    return new SBigIntValue(stringMadeNegative, this.metadata);
  };
  sUnaryMakePositive(): never {
    throw SUserError.cannotConvertBigIntToNumber
  };
  sUnaryTypeOf(): SStringValue<M, "bigint"> {
    return new SStringValue("bigint", this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    const r = (this.value as bigint) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, transpileContext);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    const r = (this.value as bigint) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, transpileContext);
    } else {
      return this;
    }
  }
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SBigIntValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this {
    if (transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SBigIntValue(this.value, this.combineMetadata(anotherValue, transpileContext)) as this;
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
  sUnaryNegate(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryTypeOf(): SStringValue<M, "undefined"> {
    return new SStringValue("undefined", this.metadata);
  }
  sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): RSValue {
    return getRight().addingMetadata(this, transpileContext);
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this {
    return this;
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): RSValue {
    return getRight().addingMetadata(this, transpileContext);
  }
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SUndefinedValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this {
    if (transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SUndefinedValue(this.combineMetadata(anotherValue, transpileContext)) as this;
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
  sUnaryNegate(): SNumberValue<M, -0> {
    return new SNumberValue(-0, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, 0> {
    return new SNumberValue(0, this.metadata);
  };
  sUnaryTypeOf(): SStringValue<M, "object"> {
    return new SStringValue("object", this.metadata);
  }
  sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): RSValue {
    return getRight().addingMetadata(this, transpileContext);
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this {
    return this;
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): RSValue {
    return getRight().addingMetadata(this, transpileContext);
  }
  sLookup(name: string, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: lookup on SNullValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this {
    if (transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SNullValue(this.combineMetadata(anotherValue, transpileContext)) as this;
  }
}