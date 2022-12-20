import { SMetadataProvider } from "../../SMetadataProvider";
import { SValues } from "../AllSValues";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import { SPrimitiveValue } from "../SPrimitiveValues/SPrimitiveValue";
import { SValue } from "../SValue";
import type { SObjectValue } from "./SObjectValue";
import type { SObjectProperties, SObjectSwizzleAndWhiteList } from "./SObjectValueDef";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SandboxedJSRunner } from "../../Runner";

export function sGet<M extends MaybeSValueMetadata>(
  this: SObjectValue<M, any, any>,
  p: string | symbol,
  receiver: SValue<M>,
  sTable: SLocalSymbolTable<M>
  ): SValue<M> {
  if (Reflect.has(this.sStorage, p)) {
    // we have this property
    const result: unknown = Reflect.get(this.sStorage, p, receiver);
    if (result instanceof SValue) {
      return result;
    } else {
      // todo: make sure this is a whitelisted property
      // must be a primitive or we fail
      const sPrimitive = SPrimitiveValue.newPrimitiveFromJSValue(result, sTable.newMetadataForRuntimeTimeEmergingValue());
      if (sPrimitive === null) {
        throw new Error(`Unexpected non s-wrapped property value '${p.toString()}' in s-object (value was ${result}).`);
      }
      return sPrimitive;
    }
  } else {
    // get prototype if needed
    if (typeof this.sPrototype === "function") {
      this.sPrototype = this.sPrototype();
    }
    // check prototype
    if (this.sPrototype instanceof SValues.SObjectValue) {
      return this.sPrototype.sGet(p, receiver, sTable);
    } else {
      return new SValues.SUndefinedValue(sTable.newMetadataForRuntimeTimeEmergingValue());
    }
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



// export function createSNormalObjectFromJSPrimitive<M extends MaybeSValueMetadata, P extends Record<string | symbol, any>> (
//   jsValue: P,
//   metaDataForAllProperties: M,
//   sTable: SLocalSymbolTable<M>
// ): SNormalObject<M> {
//   const properties: SObjectProperties = {};
//   const keyStrings = Object.getOwnPropertyNames(jsValue);
//   function addProperty<K extends string | symbol>(key: K, jsPropValue: any) {
//     const result = SPrimitiveValue.newPrimitiveFromJSValue(jsPropValue, metaDataForAllProperties);
//     if (result === null) {
//       throw Error("Sub-objects not supported in createFromJSPrimitive");
//     }
//     properties[key] = result;
//   }
//   for (const keyString of keyStrings) {
//     const jsPropValue = jsValue[keyString];
//     addProperty(keyString, jsPropValue);
//   }
//   const keySymbols = Object.getOwnPropertySymbols(jsValue);
//   for (const keySymbol of keySymbols) {
//     const jsPropValue = jsValue[keySymbol];
//     addProperty(keySymbol, jsPropValue);
//   }
//   const sPrototype = sTable.sGlobalProtocols.ObjectProtocol;
//   return SValues.SNormalObject.create<M>(properties, sPrototype, sTable)
// }


export function buildNativeJsValueForSObject<S extends object, O extends SObjectValue<any, any, S>>(
  sObject: O,
  startingElement: S,
  runner: SandboxedJSRunner<any>
): any {
  const proxy = new Proxy(startingElement, {
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
      return sObject.sGet(p, receiver, runner.sTable).getNativeJsValue(runner);
    },
    // getOwnPropertyDescriptor(target, p) {
    //   return Reflect.getOwnPropertyDescriptor(target, p);
    // },
    // getPrototypeOf(target) {
    //   // throw Error("SandboxedJS todo proxy s-object getPrototypeOf");
    //   return Object.prototype;
    // },
    // has(target, p) {
    //   // return Reflect.has(target, p);
    //   return false;
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
  // Built-In objects cannot be put into a proxy without changing some of their special behavior
  if (sObject.exportNativeJsValueAsCopiedBuiltIn) {
    const copy = structuredClone(startingElement);
    const nativePrototype = sObject.sPrototype.getNativeJsValue(runner);
    if (nativePrototype !== null) {
      Object.setPrototypeOf(copy, proxy);  
      // basically we will do a little hack to cause it to inherit from two protocols,
      // this allows things like [object Number] to use both its user defined protocol
      // AND the builtin ...wait, this hack probably isn't needed now lol, brb
      // Object.setPrototypeOf(copy, new Proxy(sObject.sPrototype.nativeJsValue, {
      //   get(target, p, receiver) {
      //     if (Reflect.has(target, p)) {
      //       return Reflect.get(target, p, receiver);
      //     } else {
      //       return Reflect.get(proxy, p, receiver);
      //     }
      //   },
      // }));
    }
    return copy;
  } else {
    return proxy;
  }
};


export function applySwizzleToObj<O extends object>(
  safeObject: O,
  nativeObject: any,
  sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<O>,
) {
  const swizzleOrWhitelistKeys = Reflect.ownKeys(sSwizzleAndWhiteList);
  for (const swizzleOrWhitelistKey of swizzleOrWhitelistKeys) {
    if ((swizzleOrWhitelistKey === "swizzled_apply_raw") || swizzleOrWhitelistKey === "swizzled_apply_proxied") {
      continue
    } else if (typeof swizzleOrWhitelistKey === "string") {
      if (swizzleOrWhitelistKey.startsWith("whitelist_")) {
        const whitelistKey = swizzleOrWhitelistKey.slice("whitelist_".length)
        // if (whitelistKey === "name") {
        //   // set by declaration
        //   // sanity check
        //   if (nativeObject.name === safeObject.name) {
        //     continue
        //   } else {
        //     throw new Error(`SFunction.createFromNative failed to create function with name ${nativeObject.name} found ${safeFunction.name}.`)
        //   }
        // } else {
          Object.defineProperty(safeObject, whitelistKey, {
            get() {
              return Reflect.get(nativeObject, whitelistKey);
            },
          })
          continue;
        // }
      } else if (swizzleOrWhitelistKey.startsWith("swizzle_static_")) {
        const swizzledKey = swizzleOrWhitelistKey.slice("swizzle_static_".length)
        const staticSwizzledValue: SValue<any> = (sSwizzleAndWhiteList as any)[swizzleOrWhitelistKey];
        (safeObject as any)[swizzledKey] = staticSwizzledValue;
        continue;
      }
    }
    throw "Handle swizzle or whitelist key '" + swizzleOrWhitelistKey.toString() + "'";
  }
}