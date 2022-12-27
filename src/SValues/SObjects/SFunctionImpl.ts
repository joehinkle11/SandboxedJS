import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../AllSValues";
import type { SValue } from "../SValue";
import type { SFunction, SFunctionObjectValue } from "./SFunction";
import type { SandboxedConstructorFunctionCall, SandboxedFunctionCall } from "./SFunctionDef";
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
  return (this.sStorage as SandboxedFunctionCall)(thisArg, args, undefined, sTable);
}

export function sConstruct<M extends MaybeSValueMetadata>(
  this: SFunction<M>,
  args: SValue<M>[],
  newTarget: SFunction<any>,
  sTable: SLocalSymbolTable<M>
): SObjectValue<M, any, any> {
  const prototypeProperty = this.getSFunctionPrototypeProperty();
  let newSThisProto: SObjectValue<M, any, any>
  if (prototypeProperty instanceof SValues.SObjectValue) {
    newSThisProto = prototypeProperty;
  } else {
    newSThisProto = sTable.sGlobalProtocols.ObjectProtocol;
  }
  const newSThis = SValues.SNormalObject.create({}, newSThisProto, sTable);
  const result = (this.sStorage as SandboxedConstructorFunctionCall)(newSThis, args, newTarget, sTable);
  if (result instanceof SValues.SObjectValue) {
    return result;
  } else {
    return newSThis;
  }
}