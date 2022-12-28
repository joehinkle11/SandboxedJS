import type { ECMA_PropertyDescriptor } from "../../ECMAModels/ECMA_PropertyDescriptor";
import { makeSGetter, makeSSetter } from "../../GetterSetterSupport";
import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import { SValues } from "../../SValues/AllSValues";
import type { SObjectValue } from "../../SValues/SObjects/SObjectValue";
import type { SValue } from "../../SValues/SValue";

// note: this function could probably be optimized by skipping the `sHasNative` calls.

/// https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-topropertydescriptor
export function ECMA_ToPropertyDescriptor(
  obj: SObjectValue<any, any, any>,
  sTable: SLocalSymbolTable<any>
): PropertyDescriptor {
// ): ECMA_PropertyDescriptor {
  // 1. If Obj is not an Object, throw a TypeError exception.
  if (!(obj instanceof SValues.SObjectValue)) {
    throw SUserError.cannotConvertToObject;
  }

  // 2. Let desc be a new Property Descriptor that initially has no fields.
  const desc: Partial<PropertyDescriptor> = {};

  // 3. Let hasEnumerable be ? HasProperty(Obj, "enumerable").
  const hasEnumerable: boolean = obj.sHasNative("enumerable");

  // 4. If hasEnumerable is true, then
  if (hasEnumerable) {
    // a. Let enumerable be ToBoolean(? Get(Obj, "enumerable")).
    const enumerable: boolean = obj.sGetNativeAsBoolean("enumerable", obj, sTable);

    // b. Set desc.[[Enumerable]] to enumerable.
    desc.enumerable = enumerable;
  }

  // 5. Let hasConfigurable be ? HasProperty(Obj, "configurable").
  const hasConfigurable: boolean = obj.sHasNative("configurable");

  // 6. If hasConfigurable is true, then
  if (hasConfigurable) {
    // a. Let configurable be ToBoolean(? Get(Obj, "configurable")).
    const configurable: boolean = obj.sGetNativeAsBoolean("configurable", obj, sTable);

    // b. Set desc.[[Configurable]] to configurable.
    desc.configurable = configurable;
  }

  // 7. Let hasValue be ? HasProperty(Obj, "value").
  const hasValue = obj.sHasNative("value");

  // 8. If hasValue is true, then
  if (hasValue) {
    // a. Let value be ? Get(Obj, "value").
    const value: SValue<any> = obj.sGet("value", obj, sTable);

    // b. Set desc.[[Value]] to value.
    desc.value = value;
  }
  
  // 9. Let hasWritable be ? HasProperty(Obj, "writable").
  const hasWritable = obj.sHasNative("writable");

  // 10. If hasWritable is true, then
  if (hasWritable) {
    // a. Let writable be ToBoolean(? Get(Obj, "writable")).
    const writable: boolean = obj.sGetNativeAsBoolean("writable", obj, sTable);

    // b. Set desc.[[Writable]] to writable.
    desc.writable = writable;
  }

  // 11. Let hasGet be ? HasProperty(Obj, "get").
  const hasGet = obj.sHasNative("get");

  // 12. If hasGet is true, then
  if (hasGet) {
    // a. Let getter be ? Get(Obj, "get").
    const getter = obj.sGet("get", obj, sTable);

    // b. If IsCallable(getter) is false and getter is not undefined, throw a TypeError exception.
    if (getter instanceof SValues.SFunction) {
      // c. Set desc.[[Get]] to getter.
      desc.get = makeSGetter(getter)

    } else if (getter instanceof SValues.SUndefinedValue === false) {
      throw SUserError.expectedCallable("get");
    }
  }
  
  // 13. Let hasSet be ? HasProperty(Obj, "set").
  const hasSet = obj.sHasNative("set");

  // 14. If hasSet is true, then
  if (hasSet) {
    // a. Let setter be ? Get(Obj, "set").
    const setter = obj.sGet("set", obj, sTable);

    // b. If IsCallable(setter) is false and setter is not undefined, throw a TypeError exception.
    if (setter instanceof SValues.SFunction) {
      // c. Set desc.[[Set]] to setter.
      desc.set = makeSSetter(setter)

    } else if (setter instanceof SValues.SUndefinedValue === false) {
      throw SUserError.expectedCallable("set");
    }
  }

  // 15. If desc has a [[Get]] field or desc has a [[Set]] field, then
  if (desc.get !== undefined || desc.set !== undefined) {
    // a. If desc has a [[Value]] field or desc has a [[Writable]] field, throw a TypeError exception.
    if (desc.value !== undefined || desc.writable !== undefined) {
      throw SUserError.invalidPropertyDescriptor;
    }
  }

  // 16. Return desc.
  return desc as PropertyDescriptor;
}