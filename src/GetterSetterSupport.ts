import type { SLocalSymbolTable } from "./SLocalSymbolTable";
import { SValues } from "./SValues/AllSValues";
import type { SFunction } from "./SValues/SObjects/SFunction";
import type { AnySFunction, SandboxedFunctionGetterCall } from "./SValues/SObjects/SFunctionDef";
import type { SObjectPropertyGetterAccessThis, SObjectPropertySetterAccessInfo } from "./SValues/SObjects/SObjectValueDef";
import type { SValue } from "./SValues/SValue";



export function makeSGetter(
  getterFunc: SFunction<any>
): () => SValue<any> {
  return function(this: SObjectPropertyGetterAccessThis) {
    return getterFunc.sApply(this.sReceiver, [], this.sTable);
  }
}
export function makeSGetterEasy(
  easyGetterFunc: SandboxedFunctionGetterCall,
  sTable: SLocalSymbolTable<any>
): () => SValue<any> {
  const getterFunc: SFunction<any> = SValues.SFunction.create(easyGetterFunc as AnySFunction, "function () { [native code] }", sTable);
  return makeSGetter(getterFunc);
}
export function makeSSetter(
  getterFunc: SFunction<any>
): (newValue: SObjectPropertySetterAccessInfo) => void {
  return function(info: SObjectPropertySetterAccessInfo) {
    getterFunc.sApply(info.sReceiver, [info.newValue], info.sTable);
  }
}
