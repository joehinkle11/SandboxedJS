import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import type { SFunctionObjectValue } from "./SFunction";
import type { UnknownFunction } from "./SFunctionDef";
import type { SObjectSwizzleAndWhiteList } from "./SObjectValueDef";


export function sApply<M extends MaybeSValueMetadata>(
  this: SFunctionObjectValue<M, any>,
  thisArg: SValue<M>, args: SValue<M>[],
  mProvider: SMetadataProvider<M>
): SValue<M> {
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