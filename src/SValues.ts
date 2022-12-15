import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { $$ts, $$typeToString } from "ts-macros";
import { TranspileContext } from "./TranspileContext";
import SUserErrorImport from "./Models/SUserError";
import { SLocalSymbolTable } from "./SLocalSymbolTable";
const SUserError = SUserErrorImport;

function $sBinaryOpOnPrimitives(binaryOp: "+" | "-" | "*" | "/" | "**" | "%") {
  $$ts!(`
    const resultingMetadata = this.combineMetadata(right, sTable);
    const opResult = this.value ${binaryOp} right.value;
    const newSPrimitive = SPrimitiveValue.newPrimitiveFromJSValue(opResult, resultingMetadata);
    if (newSPrimitive !== null) {
      return newSPrimitive;
    }
    throw SUserError.cannotPerformBinaryOp("${binaryOp}", this, right);
  `);
}
function $sBitwiseOpOnPrimitive(bitwise: "&" | "|" | "~" | "^" | "<<" | ">>" | ">>>") {
  $$ts!(`
    const resultingMetadata = this.combineMetadata(right, sTable);
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
    throw SUserError.cannotPerformBitwiseOp("${bitwise}", this, right);
  `);
}

function $sComparisonOpOnPrimitive(comparison: "==" | "===" | "!=" | "!==" | ">" | "<" | ">=" | "<=") {
  $$ts!(`
    const resultingMetadata = this.combineMetadata(right, sTable);
    const comparisonResult = this.value ${comparison} right.value;
    const newSBoolean = new SBooleanValue(comparisonResult, resultingMetadata);
    if (newSBoolean !== null) {
      return newSBoolean;
    }
    throw SUserError.cannotPerformBitwiseOp("${comparison}", this, right);
  `);
}



export type SValueKind = "s-object" | SValuePrimitiveKind;
export type SValuePrimitiveKind = "s-boolean" | "s-number" | "s-bigint" | "s-string" | "s-undefined" | "s-null" | "s-symbol";

export abstract class SValue<M extends MaybeSValueMetadata> {
  abstract get sValueKind(): SValueKind;
  abstract metadata: M;
  abstract toNativeJS(sTable: SLocalSymbolTable<M>): any;
  abstract sToPropertyKey(): string | symbol;
  abstract sUnaryNegate(): SValue<M>;
  abstract sUnaryMakePositive(): SValue<M>;
  abstract sUnaryTypeOf(): SStringValue<M, JSTypeOfString>;
  abstract sUnaryLogicalNot(): SBooleanValue<M, boolean>;
  abstract sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue;
  abstract sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue;
  abstract sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue;
  abstract sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M>;
  abstract sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean>;
  // abstract sApply(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M>;
  combineMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): M {
    const valueMetadataSystem = sTable.transpileContext.valueMetadataSystem;
    return valueMetadataSystem === null ? undefined : valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue);
  }
  abstract addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this;

  // @ts-expect-error
  sBinaryAdd(right: SValue<M>, sTable: SLocalSymbolTable<M>): SPrimitiveValue<M, any> {
    $sBinaryOpOnPrimitives!("+");
  }
  // @ts-expect-error
  sBinarySubtract(right: SValue<M>, sTable: SLocalSymbolTable<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("-");
  }
  // @ts-expect-error
  sBinaryMult(right: SValue<M>, sTable: SLocalSymbolTable<M>): SPrimitiveValue<M, any> {
    $sBinaryOpOnPrimitives!("*");
  }
  // @ts-expect-error
  sBinaryDiv(right: SValue<M>, sTable: SLocalSymbolTable<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("/");
  }
  // @ts-expect-error
  sBinaryExpo(right: SValue<M>, sTable: SLocalSymbolTable<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("**");
  }
  // @ts-expect-error
  sBinaryMod(right: SValue<M>, sTable: SLocalSymbolTable<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("%");
  }
  // @ts-expect-error
  sBitwiseAND(right: SValue<M>, sTable: SLocalSymbolTable<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("&")
  }
  // @ts-expect-error
  sBitwiseOR(right: SValue<M>, sTable: SLocalSymbolTable<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("|")
  }
  // @ts-expect-error
  sBitwiseNOT(right: SValue<M>, sTable: SLocalSymbolTable<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("~")
  }
  // @ts-expect-error
  sBitwiseXOR(right: SValue<M>, sTable: SLocalSymbolTable<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("^")
  }
  // @ts-expect-error
  sBitwiseLeftShift(right: SValue<M>, sTable: SLocalSymbolTable<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("<<")
  }
  // @ts-expect-error
  sBitwiseRightShift(right: SValue<M>, sTable: SLocalSymbolTable<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!(">>")
  }
  // @ts-expect-error
  sBitwiseUnsignedRight(right: SValue<M>, sTable: SLocalSymbolTable<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!(">>>")
  }
  // @ts-expect-error
  sCompEqualValue(right: SValue<M>, sTable: SLocalSymbolTable<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("==")
  }
  // @ts-expect-error
  sCompEqualValueAndEqualType(right: SValue<M>, sTable: SLocalSymbolTable<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("===")
  }
  // @ts-expect-error
  sCompNotEqualValue(right: SValue<M>, sTable: SLocalSymbolTable<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("!=")
  }
  // @ts-expect-error
  sCompNotEqualValueAndEqualType(right: SValue<M>, sTable: SLocalSymbolTable<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("!==")
  }
  // @ts-expect-error
  sCompGreaterThan(right: SValue<M>, sTable: SLocalSymbolTable<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!(">")
  }
  // @ts-expect-error
  sCompLessThan(right: SValue<M>, sTable: SLocalSymbolTable<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("<")
  }
  // @ts-expect-error
  sCompGreaterThanOrEqualTo(right: SValue<M>, sTable: SLocalSymbolTable<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!(">=")
  }
  // @ts-expect-error
  sCompLessThanOrEqualTo(right: SValue<M>, sTable: SLocalSymbolTable<M>): SBooleanValue<M> {
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

  constructor(metadata: M) {
    super();
    this.metadata = metadata;
  }
  sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M> {
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
  toNativeJS(sTable: SLocalSymbolTable<M>): object { 
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
        return sObject.sGet(p, receiver, sTable).toNativeJS(sTable);
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
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this {
    return this;
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.transpileContext.valueMetadataSystem === null) {
      return this;
    }
    this.metadata = sTable.transpileContext.valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue)
    return this;
  }
}
export abstract class SNonFunctionObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SObjectValue<M, K, S> {
  sUnaryTypeOf(): SStringValue<M, "object"> {
    return new SStringValue("object", this.metadata);
  }
}

export class SNormalObject<M extends MaybeSValueMetadata> extends SNonFunctionObjectValue<M, "normal", BaseSObjectStorage> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  readonly storage: BaseSObjectStorage;

  sToPropertyKey(): string {
    return "[object Object]";
  }

  constructor(properties: SObjectProperties, sTable: SLocalSymbolTable<M>) {
    super(sTable.newMetadataForObjectValue());
    const obj = {};
    Object.setPrototypeOf(obj, null);
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(properties));
    this.storage = obj;
  }
}
export class SArrayObject<M extends MaybeSValueMetadata> extends SNonFunctionObjectValue<M, "array", SValue<any>[]> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  readonly storage: SValue<any>[] & {length: SNumberValue<M, number>};

  sToPropertyKey(): string {
    throw Error("todo sToPropertyKey array obj")
  }

  constructor(array: SValue<any>[], sTable: SLocalSymbolTable<M>) {
    super(sTable.newMetadataForObjectValue());
    Object.setPrototypeOf(array, null);
    this.storage = new Proxy(array, {
      get(target, p, receiver) {
        const r = Reflect.get(target, p, receiver);
        if (p === "length") {
          return new SNumberValue<M, number>(r as number, sTable.newMetadataForRuntimeTimeEmergingValue());
        }
        return r;
      },
    }) as any;
  }
}

export function createSNormalObjectFromJSPrimitive<M extends MaybeSValueMetadata, P extends Record<string | symbol, any>> (
  jsValue: P,
  metaDataForAllProperties: M,
  sTable: SLocalSymbolTable<M>
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
  return new SNormalObject<M>(properties, sTable)
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
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
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
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.value as boolean) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.value as boolean) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SBoolean prototype");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SBooleanValue(this.value, this.combineMetadata(anotherValue, sTable)) as this;
  }
}

export class SNumberValue<M extends MaybeSValueMetadata, V extends number> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
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
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.value as number) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.value as number) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SNumberValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SNumberValue(this.value, this.combineMetadata(anotherValue, sTable)) as this;
  }
}
export class SStringValue<M extends MaybeSValueMetadata, V extends string> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
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
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.value as string) && 2;
    if (r === 2) {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.value as string) || 2;
    if (r === 2) {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SStringValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SStringValue(this.value, this.combineMetadata(anotherValue, sTable)) as this;
  }
}
export class SBigIntValue<M extends MaybeSValueMetadata, V extends bigint> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
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
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.value as bigint) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    const r = (this.value as bigint) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, sTable);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SBigIntValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SBigIntValue(this.value, this.combineMetadata(anotherValue, sTable)) as this;
  }
}

export class SUndefinedValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, undefined> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
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
  sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this {
    return this;
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SUndefinedValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SUndefinedValue(this.combineMetadata(anotherValue, sTable)) as this;
  }
}
export class SNullValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, null> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
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
  sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this {
    return this;
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SNullValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SNullValue(this.combineMetadata(anotherValue, sTable)) as this;
  }
}
export class SSymbolValue<M extends MaybeSValueMetadata, V extends symbol> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
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
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this | RSValue {
    return this;
  }
  sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw Error("Todo: sGet on SSymbolValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    if (sTable.transpileContext.valueMetadataSystem === null) {
      return this;
    }
    return new SSymbolValue(this.value, this.combineMetadata(anotherValue, sTable)) as this;
  }
}


// Everything passes through this object, is used to make it possible to add metadata
// to a reference to an object without effecting the metadata on other references to
// the same object.
export class SReferencedObjectValue<M extends SValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  
  wrappedObject: SObjectValue<M, K, S>

  addedMetadata: M;
  get metadata(): M {
    return this.wrappedObject.metadata.mixWithReferencedMetadata(this.addedMetadata) as M;
  }

  constructor(wrappedObject: SObjectValue<M, K, S>, addedMetadata: M) {
    super();
    this.wrappedObject = wrappedObject;
    this.addedMetadata = addedMetadata;
  }

  get sValueKind(): SValueKind {
    throw new Error("Method not implemented.");
  }
  toNativeJS(sTable: SLocalSymbolTable<M>) {
    return this.wrappedObject.toNativeJS(sTable);
  }
  sToPropertyKey(): string | symbol {
    return this.wrappedObject.sToPropertyKey();
  }
  sUnaryNegate(): SValue<M> {
    return new SNumberValue(NaN, this.metadata);
  }
  sUnaryMakePositive(): SValue<M> {
    return new SNumberValue(NaN, this.metadata);
  }
  sUnaryTypeOf(): SStringValue<M, JSTypeOfString> {
    const unaryTypeOf = this.wrappedObject.sUnaryTypeOf().value;
    return new SStringValue<M, JSTypeOfString>(unaryTypeOf, this.metadata);
  }
  sUnaryLogicalNot(): SBooleanValue<M, boolean> {
    return new SBooleanValue(false, this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): RSValue {
    return getRight().addingMetadata(this, sTable);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, sTable: SLocalSymbolTable<M>): this {
    return this;
  }
  sGet(p: string | symbol, receiver: any, sTable: SLocalSymbolTable<M>): SValue<M> {
    throw new Error("Method not implemented.");
  }
  sSet(p: string | symbol, newValue: SValue<M>, receiver: any): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  addingMetadata(anotherValue: SValue<M>, sTable: SLocalSymbolTable<M>): this {
    throw new Error("Method not implemented.");
  }
}


function addMetadataToPropertyAccess<M extends MaybeSValueMetadata>(
  property: SValue<M>,
  sObject: SObjectValue<M, any, any>,
  sTable: SLocalSymbolTable<M>
): SReferencedObjectValue<any, any, any> | SPrimitiveValue<M, any> {
  if (property instanceof SPrimitiveValue || property instanceof SReferencedObjectValue) {
    return property.addingMetadata(sObject, sTable);
  } else if (property instanceof SObjectValue) {
    return new SReferencedObjectValue(property as SObjectValue<any, any, any>, sObject.metadata);
  } else {
    throw Error("Unknown property type in addMetadataToPropertyAccess.");
  }
}