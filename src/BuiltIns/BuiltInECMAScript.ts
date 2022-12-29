import type { SValue } from "../SValues/SValue";
import type { InstallBuiltIn } from "./InstallBuiltIn";
import SUserError from "../Models/SUserError";
import type { SLocalSymbolTable, SRootSymbolTable } from "../SLocalSymbolTable";
import { SValues } from "../SValues/AllSValues";
import { makeSGetterEasy } from "../GetterSetterSupport";
import type { SFunction } from "../SValues/SObjects/SFunction";
import type { SObjectValue } from "../SValues/SObjects/SObjectValue";

export const installHardcodedEcmaScriptBindings: InstallBuiltIn<any> = (rootTable: SRootSymbolTable<any>) => {
  rootTable.sGlobalProtocols.ObjectProtocol.sUnaryMakePositiveInternal = function (this: SObjectValue<any, any, any>) {
    return new SValues.SNumberValue(NaN, this.metadata);
  }
  rootTable.sGlobalProtocols.ObjectProtocol.sUnaryNegateInternal = function (this: SObjectValue<any, any, any>) {
    return new SValues.SNumberValue(NaN, this.metadata);
  }
  rootTable.sGlobalProtocols.ArrayProtocol.sUnaryMakePositiveInternal = function (this: SObjectValue<any, any, any>) {
    if (this instanceof SValues.SArrayObject) {
      const length: unknown = this.sStorage.length.nativeJsValue
      if (typeof length === "number") {
        if (length > 1) {
          return new SValues.SNumberValue(NaN, this.metadata);
        } else if (length === 1) {
          const firstEl: SValue<any> = this.sStorage[0]
          return firstEl.sUnaryMakePositive();
        } else {
          return new SValues.SNumberValue(0, this.metadata);
        }
      }
    }
    throw SUserError.cannotConvertObjectToPrimitive;
  }
  rootTable.sGlobalProtocols.ArrayProtocol.sUnaryNegateInternal = function (this: SObjectValue<any, any, any>) {
    if (this instanceof SValues.SArrayObject) {
      const length: unknown = this.sStorage.length.nativeJsValue
      if (typeof length === "number") {
        if (length > 1) {
          return new SValues.SNumberValue(NaN, this.metadata);
        } else if (length === 1) {
          const firstEl: SValue<any> = this.sStorage[0]
          return firstEl.sUnaryNegate();
        } else {
          return new SValues.SNumberValue(-0, this.metadata);
        }
      }
    }
    throw SUserError.cannotConvertObjectToPrimitive;
  }
  rootTable.assign("undefined", new SValues.SUndefinedValue(rootTable.newMetadataForCompileTimeLiteral()), "const");
  rootTable.sGlobalProtocols.ObjectProtocol.sDefineOwnPropertyOrThrowNative("__proto__", {
    get: makeSGetterEasy((sThisArg: SValue<any>, sArgArray: [], newTarget: undefined, sTable: SLocalSymbolTable<any>) => {
      const sThisArgObj = sThisArg.sConvertToObject(sTable);
      return sThisArgObj.determinedSPrototype;
    }, rootTable),
    set(v) {
      
    },
    configurable: false,
    enumerable: false,
  }, rootTable);
  rootTable.assign("Proxy", SValues.SFunction.createFromNative(
    Proxy,
    {
      swizzled_construct_raw(_: undefined, sArgArray: SValue<any>[], newTarget: SFunction<any>, sTable: SLocalSymbolTable<any>) {
        if (sArgArray.length < 2) {
          throw SUserError.missingRequiredArgument;
        }
        const objToProxy = sArgArray[0].sConvertToObject(sTable);
        return new SValues.SProxyObject(objToProxy);
      },
      swizzled_apply_raw: () => {
        throw SUserError.requiresNew("Proxy");
      },
    },
    rootTable.sGlobalProtocols.FunctionProtocol,
    rootTable.newMetadataForCompileTimeLiteral(),
    rootTable,
  ), "const");
}