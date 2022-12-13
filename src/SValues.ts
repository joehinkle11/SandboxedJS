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
  abstract toNativeJS(transpileContext: TranspileContext<M>): any;
  abstract sToPropertyKey(): string;
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
  abstract sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M>;
  abstract sHas(p: string | symbol, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean>;
  abstract sGetOwnPropertyDescriptor(p: string | symbol, transpileContext: TranspileContext<M>): SObjectValue<M, "normal"> | SUndefinedValue<M>;
  combineMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): M {
    const valueMetadataSystem = transpileContext.valueMetadataSystem;
    return valueMetadataSystem === null ? undefined : valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue);
  }
  abstract addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this;
}

export type JSTypeOfString = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export type SObjectValueInitArgs<M extends MaybeSValueMetadata> = {
  kind: SBuiltInObjectKind
  props: Record<string, SObjectValueInitEntry<M> | undefined>
}
// modeled after documentation on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
export type SObjectValueInitEntry<M extends MaybeSValueMetadata> = (SObjectValueInitDataEntry<M> | SObjectValueInitAccessorEntry<M>) & {
  configurable: boolean | undefined // defaults to true
  enumerable: boolean | undefined // defaults to true
  isAccessorEntry: boolean | undefined // defaults to true
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
export type SObjectValuePropEntry<M extends MaybeSValueMetadata> = (SObjectValuePropDataEntry<M> | SObjectValuePropAccessorEntry<M>) & {
  configurable: boolean
  enumerable: boolean
  isAccessorEntry: boolean
};
export type SObjectValuePropDataEntry<M extends MaybeSValueMetadata> = {
  value: SValue<M>
  writable: boolean
  isAccessorEntry: false
}
export type SObjectValuePropAccessorEntry<M extends MaybeSValueMetadata> = {
  get: unknown // todo
  set: unknown // todo
  isAccessorEntry: true
};

function createSObjectValueInitDataEntryFromJSPrimitive<M extends MaybeSValueMetadata, P extends SPrimitiveValueType>(
  jsValue: P,
  meta: M,
  configurable: boolean | undefined = true,
  enumerable: boolean | undefined = true,
  writable: boolean | undefined = true
): SObjectValueInitEntry<M> & SObjectValueInitDataEntry<M> {
  const value = SPrimitiveValue.newPrimitiveFromJSValue<M, P>(jsValue, meta);
  if (value === null) {
    throw Error("Failed to convert js value into sandboxed js value.")
  }
  return {
    configurable: configurable,
    enumerable: enumerable,
    writable: writable,
    value: value,
    isAccessorEntry: undefined
  };
}
function createSObjectValueInitDataEntry<M extends MaybeSValueMetadata>(
  value: SValue<M>,
  configurable: boolean | undefined = true,
  enumerable: boolean | undefined = true,
  writable: boolean | undefined = true
): SObjectValueInitEntry<M> & SObjectValueInitDataEntry<M> {
  return {
    configurable: configurable,
    enumerable: enumerable,
    writable: writable,
    value: value,
    isAccessorEntry: undefined
  };
}

export type SBuiltInObjectKind = "normal";
export type SBuiltInObjectInfo = null;
type MapSBuiltInObjectKindToSBuiltInObjectInfo<K extends SBuiltInObjectKind> = K extends "normal" ? null : never;
type SOwnProperties<M extends MaybeSValueMetadata> = Record<string, SObjectValuePropEntry<M> | undefined>
export class SObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, O = MapSBuiltInObjectKindToSBuiltInObjectInfo<K>> extends SValue<M> {
  get sValueKind(): "s-object" { return "s-object" };
  metadata!: M;

  readonly sBuiltInObjectInfo: O;
  // sIsExtensible: boolean;
  // sIsSealed: boolean;
  // sIsFrozen: boolean;
  sOwnProperties: SOwnProperties<M>;



  sToPropertyKey(): string {
    // todo: return function code if it is a function
    return "[object Object]";
  }

  constructor(initArgs: SObjectValueInitArgs<M>, transpileContext: TranspileContext<M>) {
    super();
    switch (initArgs.kind) {
    case "normal":
      this.sBuiltInObjectInfo = null as O;
      break;
    default:
      throw Error(`Unknown builtin object kind "${initArgs.kind}"`)
    }
    this.sOwnProperties = {};
    const keys = Object.getOwnPropertyNames(initArgs.props);
    for (const key of keys) {
      const initEntry = initArgs.props[key]!;
      if (initEntry.isAccessorEntry) {
        this.sOwnProperties[key] = {
          isAccessorEntry: true,
          set: initEntry.set,
          get: initEntry.get,
          enumerable: initEntry.enumerable ?? true,
          configurable: initEntry.configurable ?? true
        }
      } else {
        this.sOwnProperties[key] = {
          isAccessorEntry: false,
          value: initEntry.value,
          writable: initEntry.writable ?? true,
          enumerable: initEntry.enumerable ?? true,
          configurable: initEntry.configurable ?? true
        }
      }
    }
    this.metadata = transpileContext.newMetadataForObjectValue();
  }
  sOwnKeys(): string[] {
    // todo: this must be done properly
    const keys: string[] = []
    const sOwnPropertyKeys = Object.getOwnPropertyNames(this.sOwnProperties);
    for (const sOwnPropertyKey of sOwnPropertyKeys) {
      // todo: check if enumerable (i think?)
      keys.push(sOwnPropertyKey);
    }
    return keys;
  }
  sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M> {
    // lookup own first
    if (typeof p === "symbol") {
      throw Error("todo: handle symbol lookups on s-objects")
    } else {
      const ownResult = this.sOwnProperties[p];
      if (ownResult !== undefined) {
        // hit on own properties
        if (ownResult.isAccessorEntry) {
          throw Error("Todo: handle accessor property entry lookup")
        } else {
          return ownResult.value.addingMetadata(this, transpileContext);
        }
      }
    }
    // todo: lookup in protocol chain
    return new SUndefinedValue<M>(this.metadata);
  }
  sHas(p: string | symbol, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean> {
    // lookup own first
    if (typeof p === "symbol") {
      throw Error("todo: handle symbol lookups on s-objects")
    } else {
      const ownResult = this.sOwnProperties[p];
      if (ownResult !== undefined) {
        return new SBooleanValue<M, true>(true, this.metadata);
      }
    }
    // todo: lookup in protocol chain
    return new SBooleanValue<M, false>(false, this.metadata);
  }
  sGetOwnPropertyDescriptor(p: string | symbol, transpileContext: TranspileContext<M>): SObjectValue<M, "normal"> | SUndefinedValue<M> {
    if (typeof p === "symbol") {
      throw Error("todo: handle symbol lookups on s-objects")
    } else {
      const ownResult = this.sOwnProperties[p];
      if (ownResult !== undefined) {
        // hit on own properties
        if (ownResult.isAccessorEntry) {
          throw Error("Todo: handle accessor property entry sGetOwnPropertyDescriptor")
          // return new SObjectValue<M, "normal">(
          //   {
          //     kind: "normal",
          //     props: {
          //       configurable?: boolean;
          //       enumerable?: boolean;
          //       get?(): any;
          //       set?(v: any): void;
          //     }
          //   },
          //   transpileContext
          // );
        } else {
          return new SObjectValue<M, "normal">(
            {
              kind: "normal",
              props: {
                configurable: createSObjectValueInitDataEntryFromJSPrimitive<M, boolean>(ownResult.configurable, this.metadata),
                enumerable: createSObjectValueInitDataEntryFromJSPrimitive<M, boolean>(ownResult.enumerable, this.metadata),
                value: createSObjectValueInitDataEntry(ownResult.value),
                writable: createSObjectValueInitDataEntryFromJSPrimitive<M, boolean>(ownResult.writable, this.metadata),
              }
            },
            transpileContext
          );
        }
      }
    }
    return new SUndefinedValue<M>(this.metadata);
  }
  toNativeJS(transpileContext: TranspileContext<M>): object { 
    const weakTranspileContext = new WeakRef(transpileContext);
    return new Proxy(new WeakRef(this), {
      apply(target, thisArg, argArray) {
        throw Error("SandboxedJS todo proxy s-object apply");
      },
      construct(target, argArray, newTarget) {
        throw Error("SandboxedJS todo proxy s-object construct");
      },
      defineProperty(target, property, attributes) {
        throw Error("SandboxedJS todo proxy s-object defineProperty");
      },
      deleteProperty(target, p) {
        throw Error("SandboxedJS todo proxy s-object deleteProperty");
      },
      get(target, p, receiver) {
        const tContext = weakTranspileContext.deref();
        if (tContext === undefined) {
          return undefined;
        }
        return target.deref()?.sGet(p, receiver, tContext).toNativeJS(tContext) ?? undefined;
      },
      getOwnPropertyDescriptor(target, p) {
        const tContext = weakTranspileContext.deref();
        if (tContext === undefined) {
          return undefined;
        }
        return target.deref()?.sGetOwnPropertyDescriptor(p, tContext).toNativeJS(tContext) ?? undefined;
      },
      getPrototypeOf(target) {
        throw Error("SandboxedJS todo proxy s-object getPrototypeOf");
      },
      has(target, p) {
        const tContext = weakTranspileContext.deref();
        if (tContext === undefined) {
          return false;
        }
        return target.deref()?.sHas(p, tContext).toNativeJS() ?? false;
      },
      isExtensible(target) {
        throw Error("SandboxedJS todo proxy s-object isExtensible");
      },
      ownKeys(target) {
        return target.deref()?.sOwnKeys() ?? [];
      },
      preventExtensions(target) {
        throw Error("SandboxedJS todo proxy s-object preventExtensions");
      },
      set(target, p, newValue, receiver) {
        throw Error("SandboxedJS todo proxy s-object set");
      },
      setPrototypeOf(target, v) {
        throw Error("SandboxedJS todo proxy s-object setPrototypeOf");
      },
    });
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
  sGetOwnPropertyDescriptor(p: string | symbol, transpileContext: TranspileContext<M>): SUndefinedValue<M> {
    return new SUndefinedValue<M>(this.metadata);
  }
  sHas(p: string | symbol, transpileContext: TranspileContext<M>): SBooleanValue<M, boolean> {
    throw Error("Todo sHas for s primitive value")
  }
  static newPrimitiveFromJSValue<M extends MaybeSValueMetadata, P extends SPrimitiveValueType>(
    jsValue: P,
    metaData: M
  ): SPrimitiveValue<M, P | undefined> | null {
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
  sToPropertyKey(): string {
    return this.value.toString();
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
  sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: sGet on SBoolean prototype");
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
  sToPropertyKey(): string {
    return this.value.toString();
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
  sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: sGet on SNumberValue prototype");
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
  sToPropertyKey(): string {
    return this.value;
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
  sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: sGet on SStringValue prototype");
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
  sToPropertyKey(): string {
    return this.value.toString();
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
  sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: sGet on SBigIntValue prototype");
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
  sToPropertyKey(): string {
    return "undefined";
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
  sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: sGet on SUndefinedValue prototype");
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
  sToPropertyKey(): string {
    return "null";
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
  sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: sGet on SNullValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this {
    if (transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SNullValue(this.combineMetadata(anotherValue, transpileContext)) as this;
  }
}