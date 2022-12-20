import SUserError from "../../Models/SUserError";
import type { SRootSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";
import type { SArrayObject } from "../../SValues/SObjects/SArrayObject";
import type { SNumberValue } from "../../SValues/SPrimitiveValues/SNumberValue";
import type { SValue } from "../../SValues/SValue";

export function sBuiltInArrayConstructor<M extends MaybeSValueMetadata>(
  sTable: SRootSymbolTable<M>
) {
  const extractNativeArray = (value: SValue<any>) => {
    if (value instanceof SValues.SArrayObject) {
      return value.getNativeJsValue(sTable);
    }
    throw new Error("todo good error could not do extractNativeArray");
  }
  // sTable.assign("Array", SValues.SFunction.createFromNative(
  //   Array,
  //   {
  //     swizzled_apply_raw(sThisArg: SValue<any>, sArgArray: SValue<any>[], mProvider: SMetadataProvider<any>): SValue<any> {
  //       // todo: safety
  //       const sNum = sArgArray[0] as SNumberValue<M, number>;
  //       return s_BoxNumber(
  //         sNum.nativeJsValue,
  //         mProvider.newMetadataForRuntimeTimeEmergingValue()
  //       );
  //     }
  //   },
  //   new SValues.SNullValue(sTable.newMetadataForCompileTimeLiteral()), // todo: change to function
  //   sTable.newMetadataForCompileTimeLiteral()
  // ), "const");

  const s_toString = SValues.SFunction.createFromNative(
    Array.prototype.toString,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        try {
          const nativeArray = extractNativeArray(sThis);
          const str = Array.prototype.toString.bind(nativeArray)();
          return new SValues.SStringValue(str, mProvider.newMetadataForRuntimeTimeEmergingValue());
        } catch (e: any) {
          throw new Error("todo sensible error2 swizzled_apply_raw " + e.toString());
        }
      },
    },
    sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  const s_join = SValues.SFunction.createFromNative(
    Array.prototype.join,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        try {
          const sArg = sArgs[0];
          let arg: string | undefined;
          if (sArg instanceof SValues.SStringValue) {
            arg = sArg.nativeJsValue;
          }
          const nativeArray = extractNativeArray(sThis);
          const str = Array.prototype.join.bind(nativeArray)(arg);
          return new SValues.SStringValue(str, mProvider.newMetadataForRuntimeTimeEmergingValue());
        } catch (e: any) {
          throw new Error("todo sensible error2 swizzled_apply_raw " + e.toString());
        }
      },
    },
    sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  sTable.sGlobalProtocols.ArrayProtocol = SValues.SNormalObject.createFromNative(
    Array.prototype,
    {
      swizzle_static_toString: s_toString,
      swizzle_static_join: s_join
    },
    sTable.sGlobalProtocols.ObjectProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  sTable.sGlobalProtocols.ArrayProtocol.sUnaryMakePositiveInternal = (self) => {
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
  sTable.sGlobalProtocols.ArrayProtocol.sUnaryNegateInternal = (self) => {
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
}