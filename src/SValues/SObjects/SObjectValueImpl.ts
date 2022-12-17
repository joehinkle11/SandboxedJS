import { emptySMetadataProvider, SMetadataProvider } from "../../SMetadataProvider";
import { SValues } from "../AllSValues";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import { SPrimitiveValue } from "../SPrimitiveValues/SPrimitiveValue";
import type { SPrimitiveValueType } from "../SPrimitiveValues/SPrimitiveValueDef";
import { SValue } from "../SValue";
import type { SNormalObject } from "./SNormalObject";
import type { SObjectValue } from "./SObjectValue";
import type { SObjectProperties } from "./SObjectValueDef";

export function sGet<M extends MaybeSValueMetadata>(
  this: SObjectValue<M, any, any>,
  p: string | symbol,
  receiver: SValue<M>,
  mProvider: SMetadataProvider<M>
  ): SValue<M> {
  if (this.sSwizzleAndWhiteList !== undefined) {
    if (typeof p === "symbol") {
      return new SValues.SUndefinedValue<M>(this.metadata);
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
    return new SValues.SUndefinedValue<M>(this.metadata);
  }
  const result = Reflect.get(this.sStorage, p, receiver);
  if (result instanceof SValue) {
    return result;
  } else if (result === undefined) {
    return new SValues.SUndefinedValue<M>(this.metadata);
  } else if (p === "__proto__") {
    throw new Error("getting _proto__");
  } else {
    throw new Error(`Unexpected non s-wrapped property value '${p.toString()}' in s-object (value was ${result}).`);
  }
}

export function sUnaryNegate<M extends MaybeSValueMetadata>(
  this: SObjectValue<M, any, any>
): SNumberValue<M, typeof NaN> {
  return new SValues.SNumberValue(NaN, this.metadata);
};
export function sUnaryMakePositive<M extends MaybeSValueMetadata>(
  this: SObjectValue<M, any, any>
): SNumberValue<M, typeof NaN> {
  return new SValues.SNumberValue(NaN, this.metadata);
};
export function sUnaryLogicalNot<M extends MaybeSValueMetadata>(
  this: SObjectValue<M, any, any>
): SBooleanValue<M, false> {
  return new SValues.SBooleanValue(false, this.metadata);
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
  return new SValues.SNormalObject<M>(properties, mProvider)
}


export function buildNativeJsValueForSObject<S extends object, O extends SObjectValue<any, any, S>>(
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

