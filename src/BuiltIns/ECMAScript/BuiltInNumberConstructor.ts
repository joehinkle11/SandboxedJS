import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";
import type { SValue } from "../../SValues/SValue";

export function sBuiltInNumberConstructor<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  const extractNativeBoxedNumber = (value: SValue<any>) => {
    if (value instanceof SValues.SNumberValue) {
      return new Number(value.nativeJsValue);
    } else if (value instanceof SValues.SObjectValue) {
      return value.sStorage;
    }
    throw new Error("todo good error could not do extractNativeBoxedNumber");
  }
  const s_BoxNumber = (num: number, metadata: MaybeSValueMetadata) => {
    const numObj = new Number(num);
    return SValues.SNormalObject.exposeNativeBuiltIn<any, any>(
      numObj,
      sTable.sGlobalProtocols.NumberProtocol,
      metadata,
    );
  }
  sTable.assign("Number", SValues.SFunction.createFromNative(
    Number as NumberConstructor,
    {
      swizzled_apply_raw(sThisArg: SValue<any>, sArgArray: SValue<any>[], mProvider: SMetadataProvider<any>): SValue<any> {
        // todo: safety
        const firstArg = sArgArray[0];
        if (firstArg instanceof SValues.SNumberValue) {
          return s_BoxNumber(
            firstArg.nativeJsValue,
            mProvider.newMetadataForRuntimeTimeEmergingValue()
          );
        }
        if (sArgArray.length === 0) {
          return s_BoxNumber(
            0,
            mProvider.newMetadataForRuntimeTimeEmergingValue()
          );
        } else {
          return s_BoxNumber(
            NaN,
            mProvider.newMetadataForRuntimeTimeEmergingValue()
          );
        }
      },
      whitelist_MAX_VALUE: true,
      whitelist_MIN_VALUE: true,
      whitelist_EPSILON: true,
      whitelist_NaN: true,
      whitelist_MAX_SAFE_INTEGER: true,
      whitelist_MIN_SAFE_INTEGER: true,
      whitelist_NEGATIVE_INFINITY: true,
      whitelist_POSITIVE_INFINITY: true,
    },
    new SValues.SNullValue(sTable.newMetadataForCompileTimeLiteral()), // todo: change to function
    sTable.newMetadataForCompileTimeLiteral()
  ), "const");

  const s_toString = SValues.SFunction.createFromNative(
    Number.prototype.toString,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        try {
          let arg: number | undefined;
          const sArg = sArgs[0];
          if (sArg instanceof SValues.SNumberValue) {
            arg = sArg.nativeJsValue;
          }
          const boxedNum = extractNativeBoxedNumber(sThis);
          const str = Number.prototype.toString.bind(boxedNum)(arg);
          return new SValues.SStringValue(str, mProvider.newMetadataForRuntimeTimeEmergingValue());
        } catch (e: any) {
          throw new Error("todo sensible error2 swizzled_apply_raw " + e.toString());
        }
      },
    },
    sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  const s_valueOf = SValues.SFunction.createFromNative(
    Number.prototype.valueOf,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        try {
          const boxedNum = extractNativeBoxedNumber(sThis);
          const num = Number.prototype.valueOf.bind(boxedNum)();
          return new SValues.SNumberValue(num, mProvider.newMetadataForRuntimeTimeEmergingValue());
        } catch (e: any) {
          throw new Error("todo sensible error2 swizzled_apply_raw " + e.toString());
        }
      },
    },
    sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  sTable.sGlobalProtocols.NumberProtocol = SValues.SNormalObject.createFromNative(
    Number.prototype,
    {
      swizzle_static_valueOf: s_valueOf,
      swizzle_static_toString: s_toString
    },
    sTable.sGlobalProtocols.ObjectProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
}