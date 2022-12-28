import SUserError from "./Models/SUserError";
import { SValues } from "./SValues/AllSValues";
import type { SFunction } from "./SValues/SObjects/SFunction";
import type { SObjectValue } from "./SValues/SObjects/SObjectValue";
import type { SObjectPropertyGetterAccessThis, SObjectPropertySetterAccessInfo } from "./SValues/SObjects/SObjectValueDef";
// import type { SObjectHiddenFromUserData } from "./SValues/SObjects/SObjectValueDef";
import type { SValue } from "./SValues/SValue";



export function makeSGetter(
  getterFunc: SFunction<any>
): () => SValue<any> {
  return function(this: SObjectPropertyGetterAccessThis) {
    return getterFunc.sApply(this.sReceiver, [], this.sTable);
  }
}
export function makeSSetter(
  getterFunc: SFunction<any>
): (newValue: SObjectPropertySetterAccessInfo) => void {
  return function(info: SObjectPropertySetterAccessInfo) {
    getterFunc.sApply(info.sReceiver, [info.newValue], info.sTable);
  }
}
