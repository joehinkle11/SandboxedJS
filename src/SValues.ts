import { MaybeSValueMetadata } from "./SValueMetadata";
import { $$ts, $$typeToString } from "ts-macros";
import { TranspileContext } from "./TranspileContext";
import SUserErrorImport from "./Models/SUserError";
const SUserError = SUserErrorImport;



function $sBinaryOpOnPrimitives(binaryOp: "+" | "-" | "*" | "/" | "**" | "%") {
  $$ts!(`
  // try {
      // if (right instanceof SPrimitiveValue) {
        const resultingMetadata = this.combineMetadata(right, transpileContext);
        const opResult = this.value ${binaryOp} right.value;
        const newSPrimitive = SPrimitiveValue.newPrimitiveFromJSValue(opResult, resultingMetadata);
        if (newSPrimitive !== null) {
          return newSPrimitive;
        }
        // }
      // } catch {}
    throw SUserError.cannotPerformBinaryOp("${binaryOp}", this, right);
  `);
}
function $sBitwiseOpOnPrimitive(bitwise: "&" | "|" | "~" | "^" | "<<" | ">>" | ">>>") {
  $$ts!(`
    // try {
      // if (right instanceof SPrimitiveValue) {
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
        // }
    // } catch {}
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



export type SValueKind = "s-object" | SValuePrimitiveKind;
export type SValuePrimitiveKind = "s-boolean" | "s-number" | "s-bigint" | "s-string" | "s-undefined" | "s-null" | "s-symbol";

export abstract class SValue<M extends MaybeSValueMetadata> {
  abstract get sValueKind(): SValueKind;
  abstract metadata: M;
  abstract toNativeJS(transpileContext: TranspileContext<M>): any;
  abstract sToPropertyKey(): string | symbol;
  abstract sUnaryNegate(): SValue<M>;
  abstract sUnaryMakePositive(): SValue<M>;
  abstract sUnaryTypeOf(): SStringValue<M, JSTypeOfString>;
  abstract sUnaryLogicalNot(): SBooleanValue<M, boolean>;
  abstract sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue;
  abstract sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue;
  abstract sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue;
  abstract sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M>;
  combineMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): M {
    const valueMetadataSystem = transpileContext.valueMetadataSystem;
    return valueMetadataSystem === null ? undefined : valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue);
  }
  abstract addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this;

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
}

export type JSTypeOfString = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

export type SObjectValueInitArgs<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind> = {
  kind: K
} & K extends "normal" ? {
  props: Record<string, SObjectValueInitEntry<M> | undefined>
} : {

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

export type SBuiltInObjectKind = "normal" | "array" | "function";
export type SObjectProperties = Record<PropertyKey, SValue<any> | undefined>;
export type BaseSObjectStorage = SObjectProperties & object;
type MapSBuiltInObjectKindToSObjectStorage<K extends SBuiltInObjectKind> = K extends "normal" ? BaseSObjectStorage : Array<any>;

export abstract class SObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  get sValueKind(): "s-object" { return "s-object" };
  abstract readonly storage: S & object;
  metadata: M;

  // Where primitives store their primitive value in `value`, objects cannot do so, as this would expose SValue types to the user code. We use an empty object when we wish to use SObjects as a primitive value in other work (when the contents of the object is unimportant).
  get value(): {} { return {} }

  constructor(metadata: M, transpileContext: TranspileContext<M>) {
    super();
    this.metadata = metadata;
  }
  sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M> {
    const result = Reflect.get(this.storage, p, receiver);
    if (result instanceof SValue) {
      return result;
    } else if (result === undefined) {
      return new SUndefinedValue<M>(this.metadata);
    } else if (p === "__proto__") {
      throw new Error("getting __proto__");
    } else {
      throw new Error(`Unexpected non s-wrapped property value '${p.toString()}' in s-object (value was ${result}).`);
    }
  }
  toNativeJS(transpileContext: TranspileContext<M>): object { 
    const sObject = this;
    return new Proxy(this.storage, {
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
        return sObject.sGet(p, receiver, transpileContext).toNativeJS(transpileContext);
      },
      getOwnPropertyDescriptor(target, p) {
        return Reflect.getOwnPropertyDescriptor(target, p);
      },
      getPrototypeOf(target) {
        throw Error("SandboxedJS todo proxy s-object getPrototypeOf");
      },
      has(target, p) {
        return Reflect.has(target, p);
      },
      isExtensible(target) {
        throw Error("SandboxedJS todo proxy s-object isExtensible");
      },
      ownKeys(target) {
        return Reflect.ownKeys(target);
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
  abstract sUnaryTypeOf(): SStringValue<M, "object" | "function">;
  sUnaryNegate(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, typeof NaN> {
    return new SNumberValue(NaN, this.metadata);
  };
  sUnaryLogicalNot(): SBooleanValue<M, false> {
    return new SBooleanValue(false, this.metadata);
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
    this.metadata = transpileContext.valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue)
    return this;
  }
}
export abstract class SNonFunctionObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SObjectValue<M, K, S> {
  sUnaryTypeOf(): SStringValue<M, "object"> {
    return new SStringValue("object", this.metadata);
  }
}

export class SNormalObject<M extends MaybeSValueMetadata> extends SNonFunctionObjectValue<M, "normal", BaseSObjectStorage> {
  readonly storage: BaseSObjectStorage;

  sToPropertyKey(): string {
    return "[object Object]";
  }

  constructor(properties: SObjectProperties, transpileContext: TranspileContext<M>) {
    super(transpileContext.newMetadataForObjectValue(), transpileContext);
    const obj = {};
    Object.setPrototypeOf(obj, null);
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(properties));
    this.storage = obj;
  }
}
export class SArrayObject<M extends MaybeSValueMetadata> extends SNonFunctionObjectValue<M, "array", SValue<any>[]> {
  readonly storage: SValue<any>[] & {length: SNumberValue<M, number>};

  sToPropertyKey(): string {
    throw Error("todo sToPropertyKey array obj")
  }

  constructor(array: SValue<any>[], transpileContext: TranspileContext<M>) {
    super(transpileContext.newMetadataForObjectValue(), transpileContext);
    Object.setPrototypeOf(array, null);
    this.storage = new Proxy(array, {
      get(target, p, receiver) {
        const r = Reflect.get(target, p, receiver);
        if (p === "length") {
          return new SNumberValue<M, number>(r as number, transpileContext.newMetadataForRuntimeTimeEmergingValue());
        }
        return r;
      },
    }) as any;
  }
}

export function createSNormalObjectFromJSPrimitive<M extends MaybeSValueMetadata, P extends Record<string | symbol, any>> (
  jsValue: P,
  metaDataForAllProperties: M,
  transpileContext: TranspileContext<M>
): SNormalObject<M> {
  const properties: SObjectProperties = {};
  const keyStrings = Object.getOwnPropertyNames(jsValue);
  function addProperty<K extends string | symbol>(key: K, jsPropValue: any) {
    const result = SPrimitiveValue.newPrimitiveFromJSValue(jsPropValue, metaDataForAllProperties);
    if (result === null) {
      throw Error("Sub-objects not supported in createFromJSPrimitive");
    }
    properties[key] = result;
  }
  for (const keyString of keyStrings) {
    const jsPropValue = jsValue[keyString];
    addProperty(keyString, jsPropValue);
  }
  const keySymbols = Object.getOwnPropertySymbols(jsValue);
  for (const keySymbol of keySymbols) {
    const jsPropValue = jsValue[keySymbol];
    addProperty(keySymbol, jsPropValue);
  }
  return new SNormalObject<M>(properties, transpileContext)
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
      return new SSymbolValue(jsValue, metaData);
    }
  }
}
type SPrimitiveValueType = bigint | boolean | number | string | undefined | null | symbol;

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
export class SSymbolValue<M extends MaybeSValueMetadata, V extends symbol> extends SPrimitiveValue<M, V> {
  get sValueKind(): "s-symbol" { return "s-symbol" };
  readonly value!: V;
  readonly metadata!: M;
  constructor(value: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<symbol>();
    $sPrimitiveConstructor!();
  }
  sToPropertyKey(): symbol {
    return this.value;
  }
  sUnaryNegate(): never {
    throw SUserError.cannotPerformUnaryOp("-", this);
  };
  sUnaryMakePositive(): never {
    throw SUserError.cannotPerformUnaryOp("+", this);
  };
  sUnaryTypeOf(): SStringValue<M, "symbol"> {
    return new SStringValue("symbol", this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    return getRight().addingMetadata(this, transpileContext);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, transpileContext: TranspileContext<M>): this | RSValue {
    return this;
  }
  sGet(p: string | symbol, receiver: any, transpileContext: TranspileContext<M>): SValue<M> {
    throw Error("Todo: sGet on SSymbolValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, transpileContext: TranspileContext<M>): this {
    if (transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SSymbolValue(this.value, this.combineMetadata(anotherValue, transpileContext)) as this;
  }
}