import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { $$ts, $$typeToString } from "ts-macros";
import SUserErrorImport from "./Models/SUserError";
import { emptySMetadataProvider, SMetadataProvider } from "./SMetadataProvider";
const SUserError = SUserErrorImport;

function $sBinaryOpOnPrimitives(binaryOp: "+" | "-" | "*" | "/" | "**" | "%") {
  $$ts!(`
    const resultingMetadata = this.combineMetadata(right, mProvider);
    const opResult = this.nativeJsValue ${binaryOp} right.nativeJsValue;
    const newSPrimitive = SPrimitiveValue.newPrimitiveFromJSValue(opResult, resultingMetadata);
    if (newSPrimitive !== null) {
      return newSPrimitive;
    }
    throw SUserError.cannotPerformBinaryOp("${binaryOp}", this, right);
  `);
}
function $sBitwiseOpOnPrimitive(bitwise: "&" | "|" | "~" | "^" | "<<" | ">>" | ">>>") {
  $$ts!(`
    const resultingMetadata = this.combineMetadata(right, mProvider);
    const bitwiseResult = this.nativeJsValue ${bitwise} right.nativeJsValue;
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
    const resultingMetadata = this.combineMetadata(right, mProvider);
    const comparisonResult = this.nativeJsValue ${comparison} right.nativeJsValue;
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
  get sContext(): this { return this }
  abstract get sValueKind(): SValueKind;
  abstract metadata: M;
  abstract nativeJsValue: any;
  abstract sToPropertyKey(): string | symbol;
  abstract sUnaryNegate(): SValue<M>;
  abstract sUnaryMakePositive(): SValue<M>;
  abstract sUnaryTypeOf(): SStringValue<M, JSTypeOfString>;
  abstract sUnaryLogicalNot(): SBooleanValue<M, boolean>;
  abstract sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue;
  abstract sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue;
  abstract sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue;
  abstract sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SUndefinedValue<M> | SValue<M>;
  abstract sOwnKeysNative(): (string | symbol)[];
  sOwnKeys(): SArrayObject<M, SStringValue<M, string> | SSymbolValue<M, symbol>> {
    const array: (SStringValue<M, string> | SSymbolValue<M, symbol>)[] = this.sOwnKeysNative().map((r) => {
      if (typeof r === "string") {
        return new SStringValue(r, this.metadata);
      } else {
        return new SSymbolValue(r, this.metadata);
      }
    });
    return SArrayObject.createWithMetadata(array, this.metadata);
  }
  abstract sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M>;
  abstract sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean>;
  abstract sApply(thisArg: SValue<M>, args: SValue<M>[], mProvider: SMetadataProvider<M>): SValue<M>;
  combineMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): M {
    const valueMetadataSystem = mProvider.valueMetadataSystem;
    return valueMetadataSystem === null ? undefined : valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue);
  }
  abstract addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this;

  // @ts-expect-error
  sBinaryAdd(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M, any> {
    $sBinaryOpOnPrimitives!("+");
  }
  // @ts-expect-error
  sBinarySubtract(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("-");
  }
  // @ts-expect-error
  sBinaryMult(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M, any> {
    $sBinaryOpOnPrimitives!("*");
  }
  // @ts-expect-error
  sBinaryDiv(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("/");
  }
  // @ts-expect-error
  sBinaryExpo(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("**");
  }
  // @ts-expect-error
  sBinaryMod(right: SValue<M>, mProvider: SMetadataProvider<M>): SPrimitiveValue<M> {
    $sBinaryOpOnPrimitives!("%");
  }
  // @ts-expect-error
  sBitwiseAND(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("&")
  }
  // @ts-expect-error
  sBitwiseOR(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("|")
  }
  // @ts-expect-error
  sBitwiseNOT(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("~")
  }
  // @ts-expect-error
  sBitwiseXOR(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("^")
  }
  // @ts-expect-error
  sBitwiseLeftShift(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!("<<")
  }
  // @ts-expect-error
  sBitwiseRightShift(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!(">>")
  }
  // @ts-expect-error
  sBitwiseUnsignedRight(right: SValue<M>, mProvider: SMetadataProvider<M>): SNumberValue<M> {
    $sBitwiseOpOnPrimitive!(">>>")
  }
  // @ts-expect-error
  sCompEqualValue(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("==")
  }
  // @ts-expect-error
  sCompEqualValueAndEqualType(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("===")
  }
  // @ts-expect-error
  sCompNotEqualValue(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("!=")
  }
  // @ts-expect-error
  sCompNotEqualValueAndEqualType(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("!==")
  }
  // @ts-expect-error
  sCompGreaterThan(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!(">")
  }
  // @ts-expect-error
  sCompLessThan(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("<")
  }
  // @ts-expect-error
  sCompGreaterThanOrEqualTo(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!(">=")
  }
  // @ts-expect-error
  sCompLessThanOrEqualTo(right: SValue<M>, mProvider: SMetadataProvider<M>): SBooleanValue<M> {
    $sComparisonOpOnPrimitive!("<=")
  }
}

export type SWhiteListEntry = true;
export type SSwizzleEntry<V> = MapNativeValueTypeToSType<V>;
export type SDynamicSwizzleEntry<V> = (nativeValue: V) => MapNativeValueTypeToSType<V>;
export type SSwizzleOrWhiteListEntry<V> = V extends SPrimitiveValueType ? SWhiteListEntry | SSwizzleEntry<V> : SSwizzleEntry<V>;
export type SObjectSwizzleAndWhiteList<O extends object> = {
  [P in keyof O as O[P] extends SPrimitiveValueType ? `whitelist_${string & P}` : never]?: SWhiteListEntry;
} & {
  [P in keyof O as `swizzle_static_${string & P}`]?: SSwizzleEntry<O[P]>;
} & {
  [P in keyof O as `swizzle_dynamic_${string & P}`]?: SDynamicSwizzleEntry<O[P]>;
} & (O extends UnknownFunction ? SFunctionSwizzleAndWhiteList : unknown);
export type SFunctionSwizzleAndWhiteList = {
  swizzled_apply_raw: SandboxedFunctionCall
  swizzled_apply_proxied?: never
} | {
  swizzled_apply_raw?: never
  swizzled_apply_proxied: UnknownFunction
}
export type AnySObjectSwizzleAndWhiteList = SObjectSwizzleAndWhiteList<any>;

export type JSTypeOfString = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
export type SBuiltInFunctionObjectKind = "function" | "arrow-function";
export type SBuiltInNonFunctionObjectKind = "normal" | "array";
export type SBuiltInObjectKind = SBuiltInFunctionObjectKind | SBuiltInNonFunctionObjectKind;
export type SObjectProperties = Record<PropertyKey, SValue<any> | undefined>;
export type BaseSObjectStorage = SObjectProperties & object;
type MapSBuiltInObjectKindToSObjectStorage<K extends SBuiltInObjectKind> =
  K extends "normal" ? BaseSObjectStorage
    : K extends "array" ? Array<any>
    : K extends "function" ? AnySFunction
    : K extends "arrow-function" ? AnySFunction
    : BaseSObjectStorage;
function buildNativeJsValueForSObject<M extends MaybeSValueMetadata, S extends object, O extends SObjectValue<M, any, S>>(
  sObject: O,
  startingElement: S
): any { 
  return new Proxy(startingElement, {
    // apply(target, thisArg, argArray) {
    //   throw Error("SandboxedJS todo proxy s-object apply");
    // },
    // construct(target, argArray, newTarget) {
    //   throw Error("SandboxedJS todo proxy s-object construct");
    // },
    // defineProperty(target, property, attributes) {
    //   throw Error("SandboxedJS todo proxy s-object defineProperty");
    // },
    // deleteProperty(target, p) {
    //   throw Error("SandboxedJS todo proxy s-object deleteProperty");
    // },
    get(target, p, receiver) {
      return sObject.sGet(p, receiver, emptySMetadataProvider).nativeJsValue;
    },
    // getOwnPropertyDescriptor(target, p) {
    //   return Reflect.getOwnPropertyDescriptor(target, p);
    // },
    getPrototypeOf(target) {
      // throw Error("SandboxedJS todo proxy s-object getPrototypeOf");
      return Object.prototype;
    },
    // has(target, p) {
    //   return Reflect.has(target, p);
    // },
    // isExtensible(target) {
    //   throw Error("SandboxedJS todo proxy s-object isExtensible");
    // },
    // ownKeys(target) {
    //   return Reflect.ownKeys(target);
    // },
    // preventExtensions(target) {
    //   throw Error("SandboxedJS todo proxy s-object preventExtensions");
    // },
    // set(target, p, newValue, receiver) {
    //   throw Error("SandboxedJS todo proxy s-object set");
    // },
    // setPrototypeOf(target, v) {
    //   throw Error("SandboxedJS todo proxy s-object setPrototypeOf");
    // },
  });
};
export abstract class SObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  get sValueKind(): "s-object" { return "s-object" };
  abstract readonly sStorage: S & object;
  metadata: M;
  sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<S & any> | undefined;

  abstract readonly nativeJsValue: object;

  constructor(sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<S & any> | undefined, metadata: M) {
    super();
    this.sSwizzleAndWhiteList = sSwizzleAndWhiteList;
    this.metadata = metadata;
  }
  sOwnKeysNative(): string[] {
    throw Error("todo sOwnKeysNative on object") 
  }
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    if (this.sSwizzleAndWhiteList !== undefined) {
      if (typeof p === "symbol") {
        return new SUndefinedValue<M>(this.metadata);
      }
      const isWhiteListed = this.sSwizzleAndWhiteList[`whitelist_${p}`];
      if (isWhiteListed === true) {
        // must be a primitive
        const primitiveValue: SPrimitiveValueType = Reflect.get(this.sStorage, p, receiver) as any;
        const sPrimitive = SPrimitiveValue.newPrimitiveFromJSValue(primitiveValue, mProvider.newMetadataForRuntimeTimeEmergingValue());
        if (sPrimitive === null) {
          throw new Error(`Failed to convert expected primitive value ${primitiveValue?.toString()} to s-primitive.`)
        }
        return sPrimitive;
      }
      const staticSwizzle = this.sSwizzleAndWhiteList[`swizzle_static_${p}`];
      if (staticSwizzle !== undefined) {
        return staticSwizzle;
      }
      const dynamicSwizzle = this.sSwizzleAndWhiteList[`swizzle_dynamic_${p}`];
      if (dynamicSwizzle !== undefined) {
        return dynamicSwizzle(Reflect.get(this.sStorage, p, receiver));
      }
      return new SUndefinedValue<M>(this.metadata);
    }
    const result = Reflect.get(this.sStorage, p, receiver);
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
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SValue<M> {
    return this.sGet(p, this, mProvider);
  }
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
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this {
    return this;
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    this.metadata = mProvider.valueMetadataSystem.newMetadataForCombiningValues(this, anotherValue)
    return this;
  }
}
export abstract class SNonFunctionObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInNonFunctionObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SObjectValue<M, K, S> {
  sUnaryTypeOf(): SStringValue<M, "object"> {
    return new SStringValue("object", this.metadata);
  }
  sApply(): never {
    throw SUserError.cannotCall(this.sToPropertyKey().toString());
  }
}
export function convertAllPropertiesToSValues<O extends SObjectProperties, R extends Record<PropertyKey, any>>(
  newObject: O,
  record: R,
  mProvider: SMetadataProvider<any>
): O & Record<keyof R, SValue<any>> {
  const propDescriptors = Object.getOwnPropertyDescriptors(record);
  const propDescriptorsKeys = [...Object.getOwnPropertyNames(propDescriptors), ...Object.getOwnPropertySymbols(propDescriptors)];
  for (const key of propDescriptorsKeys) {
    const propDescriptor = propDescriptors[key];
    if (propDescriptor.writable !== undefined) {
      // data descriptor
      const value = propDescriptor.value;
      let sValue: SValue<any>;
      if (value instanceof SValue) {
        sValue = value;
      } else {
        const primitiveValue = SPrimitiveValue.newPrimitiveFromJSValue(
          value,
          mProvider.newMetadataForRuntimeTimeEmergingValue()
        );
        if (primitiveValue !== null) {
          sValue = primitiveValue;
        } else {
          // todo: convert to s-objects
          continue;
        }
      }
      Object.defineProperty(newObject, key, {
        configurable: propDescriptor.configurable,
        enumerable: propDescriptor.enumerable,
        writable: propDescriptor.writable,
        value: sValue
      });
    } else {
      // access descriptor...todo
      continue;
    }
  }
  return newObject as O & Record<keyof R, SValue<any>>;
}
export class SNormalObject<M extends MaybeSValueMetadata> extends SNonFunctionObjectValue<M, "normal", BaseSObjectStorage> {
  
  readonly nativeJsValue: any;
  readonly sStorage: BaseSObjectStorage;

  sToPropertyKey(): string {
    return "[object Object]";
  }

  constructor(properties: SObjectProperties, mProvider: SMetadataProvider<M>) {
    super(undefined, mProvider.newMetadataForObjectValue());
    const obj = {};
    Object.setPrototypeOf(obj, null);
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(properties));
    this.sStorage = obj;
    this.nativeJsValue = buildNativeJsValueForSObject(this, this.sStorage);
  }
}
export type SProxiedNativeArray<E extends SValue<M>, M extends MaybeSValueMetadata> = Omit<E[], "length"> & {length: SNumberValue<M, number>};
function createProxiedNativeArray<M extends MaybeSValueMetadata, E extends SValue<M>>(
  array: E[],
  weakSArrayObject: {weakRef?: WeakRef<SArrayObject<M, SValue<M>>>}
): SProxiedNativeArray<E, M> {
  return new Proxy(array, {
    get(target, p, receiver) {
      const r = Reflect.get(target, p, receiver);
      if (p === "length") {
        return new SNumberValue<M, number>(r as number, weakSArrayObject.weakRef!.deref()!.metadata);
      }
      return r;
    },
    set(target, p, newValue, receiver) {
      if (p === "length") {
        if (newValue instanceof SNumberValue) {
          return Reflect.set(target, p, newValue.nativeJsValue as number, receiver);
        } else {
          throw new Error(`Expected SNumberValue but received ${typeof newValue} (${newValue}) when trying to set the length of the SProxiedNativeArray.`)
        }
      }
      return Reflect.set(target, p, newValue, receiver);
    },
  }) as any;
}
export class SArrayObject<M extends MaybeSValueMetadata, E extends SValue<M>> extends SNonFunctionObjectValue<M, "array", SProxiedNativeArray<E, M>> {
  readonly nativeJsValue: any[];
  readonly sStorage: SProxiedNativeArray<E, M>;

  sToPropertyKey(): string {
    return Array.prototype.map(v=>v.sToPropertyKey(), this.sStorage).join(",");
  }

  private constructor(sStorage: SProxiedNativeArray<E, M>, metadata: M) {
    super(undefined, metadata);
    Object.setPrototypeOf(sStorage, null);
    this.sStorage = sStorage;
    this.nativeJsValue = buildNativeJsValueForSObject(this, this.sStorage);
  }

  static createWithMetadata<M extends MaybeSValueMetadata, E extends SValue<M>>(
    array: E[],
    metadata: M
  ): SArrayObject<M, E> {
    const weakSArrayObject: {weakRef?: WeakRef<SArrayObject<M, E>>} = {};
    const proxiedArray = createProxiedNativeArray(array, weakSArrayObject);
    Object.setPrototypeOf(proxiedArray, null);
    const sArrayObj = new SArrayObject<M, E>(proxiedArray, metadata);
    weakSArrayObject.weakRef = new WeakRef(sArrayObj);
    return sArrayObj;
  }

  static create<M extends MaybeSValueMetadata, E extends SValue<M>>(
    array: E[],
    mProvider: SMetadataProvider<M>
  ): SArrayObject<M, E> {
    return this.createWithMetadata(array, mProvider.newMetadataForObjectValue());
  }

  // static createFromNative<M extends MaybeSValueMetadata>(
  //   array: any[],
  //   mProvider: SMetadataProvider<M>
  // ): SArrayObject<M> {
  //   const fixedAnySFunction = convertAllPropertiesToSValues(anySFunction, anySFunction, mProvider);
  //   Object.setPrototypeOf(fixedAnySFunction, null);
  //   return new SFunction<M>(fixedAnySFunction, functionAsString, undefined, mProvider.newMetadataForObjectValue());
  // }
}
export type SandboxedFunctionCall = (sThisArg: SValue<any>, sArgArray: SValue<any>[], mProvider: SMetadataProvider<any>) => SValue<any>;
export type AnySFunction = SandboxedFunctionCall & SObjectProperties & UnknownFunction;
export abstract class SFunctionObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInFunctionObjectKind> extends SObjectValue<M, K, AnySFunction> {
  sUnaryTypeOf(): SStringValue<M, "function"> {
    return new SStringValue("function", this.metadata);
  }
  sApply(thisArg: SValue<M>, args: SValue<M>[], mProvider: SMetadataProvider<M>): SValue<M> {
    if (this.sSwizzleAndWhiteList !== undefined) {
      const sSwizzleAndWhiteList = this.sSwizzleAndWhiteList as SObjectSwizzleAndWhiteList<UnknownFunction>
      const swizzledApplyRaw = sSwizzleAndWhiteList.swizzled_apply_raw;
      if (swizzledApplyRaw !== undefined) {
        return swizzledApplyRaw(thisArg, args, mProvider);
      }
      const swizzledApplyProxied = sSwizzleAndWhiteList.swizzled_apply_proxied;
      const nativeJsResult = swizzledApplyProxied(3,4)
      throw new Error(`Todo: convert native result ${nativeJsResult} to sandboxed value`);
    }
    return this.sStorage(thisArg, args, mProvider);
  }
}

type UnknownFunction = (...args: unknown[]) => unknown;
export class SFunction<M extends MaybeSValueMetadata> extends SFunctionObjectValue<M, "function"> {
  readonly nativeJsValue: () => {};
  readonly sStorage: AnySFunction;
  readonly functionAsString: string;

  sToPropertyKey(): string {
    return this.functionAsString;
  }

  private constructor(sStorage: AnySFunction, functionAsString: string, sSwizzleAndWhiteList: AnySObjectSwizzleAndWhiteList | undefined, metadata: M) {
    super(sSwizzleAndWhiteList, metadata);
    this.sStorage = sStorage;
    this.functionAsString = functionAsString;
    this.nativeJsValue = buildNativeJsValueForSObject(this, this.sStorage);
  }

  static create<M extends MaybeSValueMetadata>(anySFunction: AnySFunction, functionAsString: string, mProvider: SMetadataProvider<M>): SFunction<M> {
    const fixedAnySFunction = convertAllPropertiesToSValues(anySFunction, anySFunction, mProvider);
    Object.setPrototypeOf(fixedAnySFunction, null);
    return new SFunction<M>(fixedAnySFunction, functionAsString, undefined, mProvider.newMetadataForObjectValue());
  }
  static createFromNative<O extends UnknownFunction, M extends MaybeSValueMetadata>(
    nativeJsFunction: O,
    sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<O>,
    // sSwizzleProtocol: SObjectValue<M, any, any>, // todo
    metadata: M
  ): SFunction<M> {
    const functionAsString = Function.bind(nativeJsFunction).toString();
    return new SFunction<M>(nativeJsFunction as any, functionAsString, sSwizzleAndWhiteList, metadata);
  }
}

export function createSNormalObjectFromJSPrimitive<M extends MaybeSValueMetadata, P extends Record<string | symbol, any>> (
  jsValue: P,
  metaDataForAllProperties: M,
  mProvider: SMetadataProvider<M>
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
  return new SNormalObject<M>(properties, mProvider)
}


export abstract class SPrimitiveValue<
  M extends MaybeSValueMetadata,
  P extends SPrimitiveValueType
> extends SValue<M> {
  abstract get sValueKind(): SValuePrimitiveKind;
  abstract readonly nativeJsValue: P;
  abstract readonly metadata: M;
  sOwnKeysNative(): string[] {
    throw Error("todo sOwnKeysNative on primitive")
  }
  sApply(): never {
    throw Error("todo sApply on primitive")
  }
  sUnaryLogicalNot(): SBooleanValue<M, boolean> {
    try {
      return new SBooleanValue(!this.nativeJsValue, this.metadata);
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

type MapNativeValueTypeToSType<V> = V extends SPrimitiveValueType ? MapSPrimitiveValueTypeToSType<V, any> : SObjectValue<any, any, any>
type MapSPrimitiveValueTypeToSType<P extends SPrimitiveValueType, M extends MaybeSValueMetadata> = P extends bigint ? SBigIntValue<M, P> : P extends boolean ? SBooleanValue<M, P> : P extends number ? SNumberValue<M, P> : P extends string ? SStringValue<M, P> : P extends undefined ? SUndefinedValue<M> : P extends null ? SNullValue<M> : P extends symbol ? SSymbolValue<M, P> : never;
type SPrimitiveValueType = bigint | boolean | number | string | undefined | null | symbol;

function $sPrimitiveConstructorNotNullOrUndefined<P extends SPrimitiveValueType>() {
  $$ts!(`
    if (typeof nativeJsValue !== "${$$typeToString!<P>()}") {
      throw Error(\`Expected "${$$typeToString!<P>()}" value but received "\${typeof nativeJsValue}".\`);
    }
    this.nativeJsValue = nativeJsValue;
  `)
}

function $sPrimitiveConstructor() {
  $$ts!(`
    this.metadata = metadata;
    Object.freeze(this);
  `)
}

export class SBooleanValue<M extends MaybeSValueMetadata, V extends boolean> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-boolean" { return "s-boolean" };
  readonly nativeJsValue!: V;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<boolean>();
    $sPrimitiveConstructor!();
  }
  sToPropertyKey(): string {
    return this.nativeJsValue.toString();
  }
  sUnaryNegate(): SNumberValue<M, number> {
    const negatedBool = -this.nativeJsValue;
    return new SNumberValue(negatedBool, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, number> {
    const boolMadePositive = +this.nativeJsValue;
    return new SNumberValue(boolMadePositive, this.metadata);
  };
  sUnaryTypeOf(): SStringValue<M, "boolean"> {
    return new SStringValue("boolean", this.metadata);
  }
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on boolean")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as boolean) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as boolean) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SBoolean prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SBooleanValue(this.nativeJsValue, this.combineMetadata(anotherValue, mProvider)) as this;
  }
}

export class SNumberValue<M extends MaybeSValueMetadata, V extends number> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-number" { return "s-number" };
  readonly nativeJsValue!: V & number;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<number>();
    $sPrimitiveConstructor!();
  }
  sToPropertyKey(): string {
    return this.nativeJsValue.toString();
  }
  sUnaryNegate(): SNumberValue<M, number> {
    const negatedNumber = -this.nativeJsValue;
    return new SNumberValue(negatedNumber, this.metadata);
  };
  sUnaryMakePositive(): SNumberValue<M, V> {
    return this;
  };
  sUnaryTypeOf(): SStringValue<M, "number"> {
    return new SStringValue("number", this.metadata);
  }
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on number")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as number) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as number) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SNumberValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SNumberValue(this.nativeJsValue, this.combineMetadata(anotherValue, mProvider)) as this;
  }
}
export class SStringValue<M extends MaybeSValueMetadata, V extends string> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-string" { return "s-string" };
  readonly nativeJsValue!: V;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<string>();
    $sPrimitiveConstructor!();
  }
  sToPropertyKey(): string {
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
  sUnaryTypeOf(): SStringValue<M, "string"> {
    return new SStringValue("string", this.metadata);
  }
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on string")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as string) && 2;
    if (r === 2) {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as string) || 2;
    if (r === 2) {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SStringValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SStringValue(this.nativeJsValue, this.combineMetadata(anotherValue, mProvider)) as this;
  }
}
export class SBigIntValue<M extends MaybeSValueMetadata, V extends bigint> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-bigint" { return "s-bigint" };
  readonly nativeJsValue!: V;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<bigint>();
    $sPrimitiveConstructor!();
  }
  sToPropertyKey(): string {
    return this.nativeJsValue.toString();
  }
  sUnaryNegate(): SBigIntValue<M, bigint> {
    const stringMadeNegative: bigint = -(this.nativeJsValue as bigint);
    return new SBigIntValue(stringMadeNegative, this.metadata);
  };
  sUnaryMakePositive(): never {
    throw SUserError.cannotConvertBigIntToNumber
  };
  sUnaryTypeOf(): SStringValue<M, "bigint"> {
    return new SStringValue("bigint", this.metadata);
  }
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SUndefinedValue<M> | SValue<M> {
    throw new Error("todo sChainExpression on bigint")
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as bigint) && "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    const r = (this.nativeJsValue as bigint) || "right";
    if (r === "right") {
      return getRight().addingMetadata(this, mProvider);
    } else {
      return this;
    }
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SBigIntValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SBigIntValue(this.nativeJsValue, this.combineMetadata(anotherValue, mProvider)) as this;
  }
}

export class SUndefinedValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, undefined> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-undefined" { return "s-undefined" };
  readonly nativeJsValue: undefined;
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
  sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this {
    return this;
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sChainExpression(): SUndefinedValue<M> {
    return this;
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SUndefinedValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SUndefinedValue(this.combineMetadata(anotherValue, mProvider)) as this;
  }
}
export class SNullValue<M extends MaybeSValueMetadata> extends SPrimitiveValue<M, null> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-null" { return "s-null" };
  readonly nativeJsValue: null = null;
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
  sChainExpression(): SUndefinedValue<M> {
    return new SUndefinedValue<M>(this.metadata);
  }
  sLogicalNullish<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this {
    return this;
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SNullValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SNullValue(this.combineMetadata(anotherValue, mProvider)) as this;
  }
}
export class SSymbolValue<M extends MaybeSValueMetadata, V extends symbol> extends SPrimitiveValue<M, V> {
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    throw new Error("Method not implemented.");
  }
  get sValueKind(): "s-symbol" { return "s-symbol" };
  readonly nativeJsValue!: V;
  readonly metadata!: M;
  constructor(nativeJsValue: V, metadata: M) {
    super();
    $sPrimitiveConstructorNotNullOrUndefined!<symbol>();
    $sPrimitiveConstructor!();
  }
  sToPropertyKey(): symbol {
    return this.nativeJsValue;
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
  sChainExpression(): SUndefinedValue<M> {
    return new SUndefinedValue<M>(this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this | RSValue {
    return this;
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    throw Error("Todo: sGet on SSymbolValue prototype");
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    if (mProvider.valueMetadataSystem === null) {
      return this;
    }
    return new SSymbolValue(this.nativeJsValue, this.combineMetadata(anotherValue, mProvider)) as this;
  }
}


// Everything passes through this object, is used to make it possible to add metadata
// to a reference to an object without effecting the metadata on other references to
// the same object.
export class SReferencedObjectValue<M extends SValueMetadata, K extends SBuiltInObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SValue<M> {
  wrappedObject: SObjectValue<M, K, S>

  addedMetadata: M;
  get nativeJsValue(): object {
    return this.wrappedObject.nativeJsValue;
  }
  get metadata(): M {
    return this.wrappedObject.metadata.mixWithReferencedMetadata(this.addedMetadata) as M;
  }
  sOwnKeysNative(): (string | symbol)[] {
    throw new Error("Method not implemented.");
  }
  sApply(): never {
    throw Error("todo sApply on SReferencedObjectValue")
  }

  constructor(wrappedObject: SObjectValue<M, K, S>, addedMetadata: M) {
    super();
    this.wrappedObject = wrappedObject;
    this.addedMetadata = addedMetadata;
  }

  get sValueKind(): SValueKind {
    throw new Error("Method not implemented.");
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
    const unaryTypeOf = this.wrappedObject.sUnaryTypeOf().nativeJsValue;
    return new SStringValue<M, JSTypeOfString>(unaryTypeOf, this.metadata);
  }
  sUnaryLogicalNot(): SBooleanValue<M, boolean> {
    return new SBooleanValue(false, this.metadata);
  }
  sLogicalNullish(): this {
    return this;
  }
  sLogicalAnd<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): RSValue {
    return getRight().addingMetadata(this, mProvider);
  }
  sLogicalOr<RSValue extends SValue<M>>(getRight: () => RSValue, mProvider: SMetadataProvider<M>): this {
    return this;
  }
  sChainExpression(p: string | symbol, mProvider: SMetadataProvider<M>): SValue<M> {
    // todo: add proper metadata
    return this.wrappedObject.sChainExpression(p, mProvider);
  }
  sGet(p: string | symbol, receiver: SValue<M>, mProvider: SMetadataProvider<M>): SValue<M> {
    // todo: add proper metadata
    return this.wrappedObject.sGet(p, receiver, mProvider);
  }
  sSet(p: string | symbol, newValue: SValue<M>, receiver: SValue<M>): SBooleanValue<M, boolean> {
    // todo: add proper metadata
    return this.wrappedObject.sSet(p, newValue, receiver);
  }
  addingMetadata(anotherValue: SValue<M>, mProvider: SMetadataProvider<M>): this {
    throw new Error("Method not implemented.");
  }
}


function addMetadataToPropertyAccess<M extends MaybeSValueMetadata>(
  property: SValue<M>,
  sObject: SObjectValue<M, any, any>,
  mProvider: SMetadataProvider<M>
): SReferencedObjectValue<any, any, any> | SPrimitiveValue<M, any> {
  if (property instanceof SPrimitiveValue || property instanceof SReferencedObjectValue) {
    return property.addingMetadata(sObject, mProvider);
  } else if (property instanceof SObjectValue) {
    return new SReferencedObjectValue(property as SObjectValue<any, any, any>, sObject.metadata);
  } else {
    throw Error("Unknown property type in addMetadataToPropertyAccess.");
  }
}