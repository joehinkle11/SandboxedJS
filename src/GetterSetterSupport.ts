// import { hiddenSObjectStorageSymbol } from "./HiddenSymbols";
import SUserError from "./Models/SUserError";
import { SValues } from "./SValues/AllSValues";
import type { SFunction } from "./SValues/SObjects/SFunction";
import type { SObjectValue } from "./SValues/SObjects/SObjectValue";
import type { SObjectPropertyAccessThis } from "./SValues/SObjects/SObjectValueDef";
// import type { SObjectHiddenFromUserData } from "./SValues/SObjects/SObjectValueDef";
import type { SValue } from "./SValues/SValue";



export function makeSGetter(
  object2: SObjectValue<any, any, any>,
  getterFunc: SFunction<any>
): () => SValue<any> {
  // const weakRef = new WeakRef(object);
  return function(this: SObjectPropertyAccessThis) {
    return getterFunc.sApply(this.sReceiver, [], this.sTable);
    // const sThis = sObjectHiddenFromUserData?.getSThis();
    // if (sThis instanceof SValues.SObjectValue) {
    //   return getterFunc.sApply(sThis, [], "todostable" as any);
    // } else {
    //   console.log("sThis", sThis, sObjectHiddenFromUserData, this);
    //   throw SUserError.corruptObjectPropertyFail;
    // }
  }
}