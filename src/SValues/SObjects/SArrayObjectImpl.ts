
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SNumberValue } from "../SPrimitiveValues/SNumberValue";
import type { SValue } from "../SValue";
import type { SArrayObject } from "./SArrayObject";
import type { SProxiedNativeArray } from "./SArrayObjectDef";

export function createProxiedNativeArray<M extends MaybeSValueMetadata, E extends SValue<M>>(
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