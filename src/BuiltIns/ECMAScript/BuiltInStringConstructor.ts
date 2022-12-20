import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";
import type { SStringValue } from "../../SValues/SPrimitiveValues/SStringValue";
import type { SValue } from "../../SValues/SValue";

export function sBuiltInStringConstructor<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  const extractNativeBoxedString = (value: SValue<any>) => {
    if (value instanceof SValues.SStringValue) {
      return new String(value.nativeJsValue);
    } else if (value instanceof SValues.SObjectValue) {
      return value.sStorage;
    }
    throw new Error("todo good error could not do extractNativeBoxedString");
  }
  const s_BoxString = (str: string, metadata: MaybeSValueMetadata) => {
    const strObj = new String(str);
    return SValues.SNormalObject.exposeNativeBuiltIn<any, any>(
      strObj,
      sTable.sGlobalProtocols.StringProtocol,
      metadata,
    );
  }
  sTable.assign("String", SValues.SFunction.createFromNative(
    String as StringConstructor,
    {
      swizzled_apply_raw(sThisArg: SValue<any>, sArgArray: SValue<any>[], mProvider: SMetadataProvider<any>): SValue<any> {
        // todo: safety
        const sStr = sArgArray[0] as SStringValue<M, string>;
        return s_BoxString(
          sStr.nativeJsValue,
          mProvider.newMetadataForRuntimeTimeEmergingValue()
        );
      }
    },
    () => sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  ), "const");

  const s_valueOf = SValues.SFunction.createFromNative(
    String.prototype.valueOf,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        try {
          const boxedStr = extractNativeBoxedString(sThis);
          const str = String.prototype.valueOf.bind(boxedStr)();
          return new SValues.SStringValue(str, mProvider.newMetadataForRuntimeTimeEmergingValue());
        } catch (e: any) {
          throw new Error("todo sensible error2 swizzled_apply_raw " + e.toString());
        }
      },
    },
    () => sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  const s_toString = SValues.SFunction.createFromNative(
    String.prototype.toString,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        try {
          const boxedStr = extractNativeBoxedString(sThis);
          const str = String.prototype.toString.bind(boxedStr)();
          return new SValues.SStringValue(str, mProvider.newMetadataForRuntimeTimeEmergingValue());
        } catch (e: any) {
          throw new Error("todo sensible error2 swizzled_apply_raw " + e.toString());
        }
      },
    },
    sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  sTable.sGlobalProtocols.StringProtocol = SValues.SNormalObject.createFromNative(
    String.prototype,
    {
      swizzle_static_valueOf: s_valueOf,
      swizzle_static_toString: s_toString
    },
    sTable.sGlobalProtocols.ObjectProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
}
