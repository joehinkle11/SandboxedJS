// import { hiddenSObjectStorageSymbol } from "./HiddenSymbols";
import SUserError from "./Models/SUserError";
import { SValues } from "./SValues/AllSValues";
import type { SFunction } from "./SValues/SObjects/SFunction";
import type { SObjectValue } from "./SValues/SObjects/SObjectValue";
import type { SObjectPropertyAccessThis } from "./SValues/SObjects/SObjectValueDef";
// import type { SObjectHiddenFromUserData } from "./SValues/SObjects/SObjectValueDef";
import type { SValue } from "./SValues/SValue";



export function makeSGetter(
  getterFunc: SFunction<any>
): () => SValue<any> {
  return function(this: SObjectPropertyAccessThis) {
    return getterFunc.sApply(this.sReceiver, [], this.sTable);
  }
}
export function makeSSetter(
  getterFunc: SFunction<any>
): (newValue: SValue<any>) => void {
  return function(this: SObjectPropertyAccessThis, newValue: SValue<any>) {
    getterFunc.sApply(this.sReceiver, [newValue], this.sTable);
  }
}
