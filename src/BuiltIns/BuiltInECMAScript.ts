import type { SValue } from "../SValues/SValue";
import type { InstallBuiltIn } from "./InstallBuiltIn";
import SUserError from "../Models/SUserError";
import { SRootSymbolTable } from "../SLocalSymbolTable";
import { SValues } from "../SValues/AllSValues";

export const installHardcodedEcmaScriptBindings: InstallBuiltIn<any> = (rootTable: SRootSymbolTable<any>) => {
  rootTable.sGlobalProtocols.ObjectProtocol.sUnaryMakePositiveInternal = (self) => {
    return new SValues.SNumberValue(NaN, self.metadata);
  }
  rootTable.sGlobalProtocols.ObjectProtocol.sUnaryNegateInternal = (self) => {
    return new SValues.SNumberValue(NaN, self.metadata);
  }
  rootTable.sGlobalProtocols.ArrayProtocol.sUnaryMakePositiveInternal = (self) => {
    if (self instanceof SValues.SArrayObject) {
      const length: unknown = self.sStorage.length.nativeJsValue
      if (typeof length === "number") {
        if (length > 1) {
          return new SValues.SNumberValue(NaN, self.metadata);
        } else if (length === 1) {
          const firstEl: SValue<any> = self.sStorage[0]
          return firstEl.sUnaryMakePositive();
        } else {
          return new SValues.SNumberValue(0, self.metadata);
        }
      }
    }
    throw SUserError.cannotConvertObjectToPrimitive;
  }
  rootTable.sGlobalProtocols.ArrayProtocol.sUnaryNegateInternal = (self) => {
    if (self instanceof SValues.SArrayObject) {
      const length: unknown = self.sStorage.length.nativeJsValue
      if (typeof length === "number") {
        if (length > 1) {
          return new SValues.SNumberValue(NaN, self.metadata);
        } else if (length === 1) {
          const firstEl: SValue<any> = self.sStorage[0]
          return firstEl.sUnaryNegate();
        } else {
          return new SValues.SNumberValue(-0, self.metadata);
        }
      }
    }
    throw SUserError.cannotConvertObjectToPrimitive;
  }
  rootTable.assign("undefined", new SValues.SUndefinedValue(rootTable.newMetadataForCompileTimeLiteral()), "const");
}