import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../AllSValues";
import type { SValue } from "../SValue";
import type { SFunctionObjectValue } from "./SFunction";
import type { SandboxedFunctionCall } from "./SFunctionDef";
import type { SObjectValue } from "./SObjectValue";


export function sApply<M extends MaybeSValueMetadata>(
  this: SFunctionObjectValue<M, any>,
  thisArg: SValue<M>, args: SValue<M>[],
  sTable: SLocalSymbolTable<M>
): SValue<M> {
  // if (this.sSwizzleAndWhiteList !== undefined) {
  //   const sSwizzleAndWhiteList = this.sSwizzleAndWhiteList as SObjectSwizzleAndWhiteList<UnknownFunction>
  //   const swizzledApplyRaw = sSwizzleAndWhiteList.swizzled_apply_raw;
  //   if (swizzledApplyRaw !== undefined) {
  //     return swizzledApplyRaw(thisArg, args, mProvider);
  //   }
  //   const swizzledApplyProxied = sSwizzleAndWhiteList.swizzled_apply_proxied;
  //   const nativeJsResult = swizzledApplyProxied(3,4)
  //   throw new Error(`Todo: convert native result ${nativeJsResult} to sandboxed value`);
  // }
  // throw new Error("todo sApply");
  return (this.sStorage as SandboxedFunctionCall)(thisArg, args, sTable);
}

export function sConstruct<M extends MaybeSValueMetadata>(
  this: SFunctionObjectValue<M, any>,
  args: SValue<M>[],
  sTable: SLocalSymbolTable<M>
): SObjectValue<M, any, any> {
  let newThisPrototype: SObjectValue<M, any, any>;
  if (this.sPrototype instanceof SValues.SObjectValue) {
    newThisPrototype = this.sPrototype;
  } else {
    newThisPrototype = sTable.sGlobalProtocols.ObjectProtocol;
  }
  const newThis = SValues.SNormalObject.create({}, newThisPrototype, sTable);
  const result = this.sApply(newThis, args, sTable);
  if (result instanceof SValues.SObjectValue) {
    return result;
  } else {
    return newThis;
  }
}