import type { SMetadataProvider } from "../../SMetadataProvider";
import { SValues } from "../AllSValues";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SBooleanValue } from "../SPrimitiveValues/SBooleanValue";
import type { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import type { SPrimitiveValue } from "../SPrimitiveValues/SPrimitiveValue";
import type { SValue } from "../SValue";
import type { SObjectValue } from "./SObjectValue";
import type { SDynamicSwizzleEntry, SObjectProperties, SObjectPropertyAccessThis, SObjectSwizzleAndWhiteList } from "./SObjectValueDef";
import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { SNullValue } from "../SPrimitiveValues/SNullValue";
import SUserError from "../../Models/SUserError";
import type { WeakRefToSValue } from "../WeakRefToSValue";
import type { SReceiver, SReceiverOrTarget } from "../SValueDef";

export function sGetOwn<M extends MaybeSValueMetadata>(
  this: SObjectValue<M, any, any>,
  p: string | symbol,
  receiver: SReceiverOrTarget<M>,
  sTable: SLocalSymbolTable<M>
): SValue<M> {
  const actualReceiver: SReceiver<M> = receiver === "target" ? this : receiver;
  const sObjectPropertyAccessThis: SObjectPropertyAccessThis = {
    sReceiver: actualReceiver,
    sTable: sTable
  };
  const result: unknown = Reflect.get(this.sStorage, p, sObjectPropertyAccessThis);
  if (result instanceof SValues.SValue) {
    return result;
  } else {
    // todo: make sure this is a whitelisted property
    // must be a primitive or we fail
    const sPrimitive = SValues.SPrimitiveValue.newPrimitiveFromJSValue(result, sTable.newMetadataForRuntimeTimeEmergingValue());
    if (sPrimitive === null) {
      throw new Error(`Unexpected non s-wrapped property value '${p.toString()}' in s-object (value was ${result}).`);
    }
    return sPrimitive;
  }
}

export function sGet(
  this: SObjectValue<any, any, any>,
  p: string | symbol,
  receiver: SReceiverOrTarget<any>,
  sTable: SLocalSymbolTable<any>
): SValue<any> {
  const actualReceiver: SReceiver<any> = receiver === "target" ? this : receiver;
  if (Reflect.has(this.sStorage, p)) {
    // we have this property
    return sGetOwn.call(this, p, actualReceiver, sTable);
  } else {
    // check prototype
    if (this.sPrototype instanceof SValues.SObjectValue) {
      return this.sPrototype.sGet(p, actualReceiver, sTable)
    } else {
      // get prototype if needed
      if (typeof this.sPrototype === "function") {
        this.sPrototype = this.sPrototype();
        if (this.sPrototype instanceof SValues.SObjectValue) {
          return this.sPrototype.sGet(p, actualReceiver, sTable);
        }
      }
      return new SValues.SUndefinedValue(sTable.newMetadataForRuntimeTimeEmergingValue());
    }
  }
}

export function sUnaryNegate<M extends MaybeSValueMetadata>(
  this: SObjectValue<M, any, any>
): SValue<M> {
  let p: SObjectValue<M, any, any> | SNullValue<M> = this;
  while (p instanceof SValues.SObjectValue) {
    const sUnaryNegateInternal = p.sUnaryNegateInternal;
    if (sUnaryNegateInternal !== undefined) {
      return sUnaryNegateInternal(this);
    }
    if (typeof p.sPrototype === "function") {
      p = p.sPrototype();
    } else {
      p = p.sPrototype;
    }
  }
  throw SUserError.cannotConvertObjectToPrimitive;
};
export function sUnaryMakePositive<M extends MaybeSValueMetadata>(
  this: SObjectValue<M, any, any>
): SValue<M> {
  let p: SObjectValue<M, any, any> | SNullValue<M> = this;
  while (p instanceof SValues.SObjectValue) {
    const sUnaryMakePositiveInternal = p.sUnaryMakePositiveInternal;
    if (sUnaryMakePositiveInternal !== undefined) {
      return sUnaryMakePositiveInternal(this);
    }
    if (typeof p.sPrototype === "function") {
      p = p.sPrototype();
    } else {
      p = p.sPrototype;
    }
  }
  throw SUserError.cannotConvertObjectToPrimitive;
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
      if (value instanceof SValues.SValue) {
        sValue = value;
      } else {
        const primitiveValue = SValues.SPrimitiveValue.newPrimitiveFromJSValue(
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
  rootSTable: SRootSymbolTable<any>
): any {
  const proxy = new Proxy(startingElement, {
    apply(target, thisArg, argArray) {
      const sValueArgs: SValue<any>[] = argArray.map((v) => {
        return 0 as any
      })
      const __raw_s_value: SValue<any> | undefined = thisArg.__raw_s_value
      if (__raw_s_value) {
        return sObject.sApply(__raw_s_value, sValueArgs, rootSTable).getNativeJsValue(rootSTable);
      } else {
        throw new Error("Failed to find an s-value as this.");
      }
    },
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
      if (p === "__raw_s_value") {
        return sObject;
      }
      return sObject.sGet(p, receiver, rootSTable).getNativeJsValue(rootSTable);
    },
    // getOwnPropertyDescriptor(target, p) {
    //   return Reflect.getOwnPropertyDescriptor(target, p);
    // },
    getPrototypeOf(target) {
      // check prototype
      if (sObject.sPrototype instanceof SValues.SObjectValue) {
        return sObject.sPrototype.getNativeJsValue(rootSTable);
      } else {
        // get prototype if needed
        if (typeof sObject.sPrototype === "function") {
          sObject.sPrototype = sObject.sPrototype();
          return sObject.sPrototype.getNativeJsValue(rootSTable);
        }
        return null;
      }
    },
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
    if (typeof sObject.sPrototype === "function") {
      sObject.sPrototype = sObject.sPrototype();
    }
    const nativePrototype = sObject.sPrototype.getNativeJsValue(rootSTable);
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
  weakRefToSValue: WeakRefToSValue
) {
  const swizzleOrWhitelistKeys = Reflect.ownKeys(sSwizzleAndWhiteList);
  for (const swizzleOrWhitelistKey of swizzleOrWhitelistKeys) {
    if ((swizzleOrWhitelistKey === "swizzled_apply_raw") || (swizzleOrWhitelistKey === "swizzled_apply_proxied") ||
        (swizzleOrWhitelistKey === "swizzled_construct_raw") || (swizzleOrWhitelistKey === "swizzled_construct_proxied")) {
      continue
    } else if (typeof swizzleOrWhitelistKey === "string") {
      if (swizzleOrWhitelistKey.startsWith("whitelist_")) {
        const whitelistKey = swizzleOrWhitelistKey.slice("whitelist_".length)
        Object.defineProperty(safeObject, whitelistKey, {
          get() {
            return Reflect.get(nativeObject, whitelistKey);
          },
        })
        continue;
      } else if (swizzleOrWhitelistKey.startsWith("swizzle_static_")) {
        const swizzledKey = swizzleOrWhitelistKey.slice("swizzle_static_".length)
        const staticSwizzledValue: SValue<any> = (sSwizzleAndWhiteList as any)[swizzleOrWhitelistKey];
        (safeObject as any)[swizzledKey] = staticSwizzledValue;
        continue;
      } else if (swizzleOrWhitelistKey.startsWith("swizzle_dynamic_")) {
        const swizzledKey = swizzleOrWhitelistKey.slice("swizzle_dynamic_".length)
        const staticSwizzledValue: SDynamicSwizzleEntry<any> = (sSwizzleAndWhiteList as any)[swizzleOrWhitelistKey];
        Object.defineProperty(safeObject, swizzledKey, {
          get() {
            const sValue = weakRefToSValue.deref();
            if (sValue === undefined) {
              throw new Error("Object no longer exits...");
            }
            return staticSwizzledValue(sValue);
          },
        });
        continue;
      }
    }
    throw "Handle swizzle or whitelist key '" + swizzleOrWhitelistKey.toString() + "'";
  }
}