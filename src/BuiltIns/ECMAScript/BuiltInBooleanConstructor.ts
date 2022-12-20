import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../../SValues/AllSValues";
import type { SBooleanValue } from "../../SValues/SPrimitiveValues/SBooleanValue";
import type { SValue } from "../../SValues/SValue";

export function sBuiltInBooleanConstructor<M extends MaybeSValueMetadata>(
  sTable: SLocalSymbolTable<M>
) {
  const extractNativeBoxedBoolean = (value: SValue<any>) => {
    if (value instanceof SValues.SBooleanValue) {
      return new Boolean(value.nativeJsValue);
    } else if (value instanceof SValues.SObjectValue) {
      return value.sStorage;
    }
    throw new Error("todo good error could not do extractNativeBoxedBoolean");
  }
  const s_BoxBoolean = (bool: boolean, metadata: MaybeSValueMetadata) => {
    const boolObj = new Boolean(bool);
    return SValues.SNormalObject.exposeNativeBuiltIn<any, any>(
      boolObj,
      sTable.sGlobalProtocols.BooleanProtocol,
      metadata,
    );
  }
  sTable.assign("Boolean", SValues.SFunction.createFromNative(
    Boolean as BooleanConstructor & Function,
    {
      swizzled_apply_raw(sThisArg: SValue<any>, sArgArray: SValue<any>[], mProvider: SMetadataProvider<any>): SValue<any> {
        // todo: safety
        const sBool = sArgArray[0] as SBooleanValue<M, boolean>;
        return s_BoxBoolean(
          sBool.nativeJsValue,
          mProvider.newMetadataForRuntimeTimeEmergingValue()
        );
      }
    },
    () => sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  ), "const");

  const s_valueOf = SValues.SFunction.createFromNative(
    Boolean.prototype.valueOf,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        try {
          const boxedBool = extractNativeBoxedBoolean(sThis);
          const bool = Boolean.prototype.valueOf.bind(boxedBool)();
          return new SValues.SBooleanValue(bool, mProvider.newMetadataForRuntimeTimeEmergingValue());
        } catch (e: any) {
          throw new Error("todo sensible error2 swizzled_apply_raw " + e.toString());
        }
        throw new Error("todo sensible error1 swizzled_apply_raw " + sThis.sValueKind);
      },
    },
    () => sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  const s_toString = SValues.SFunction.createFromNative(
    (Boolean.prototype as ExtraBooleanDefs).toString,
    {
      swizzled_apply_raw(sThis, sArgs, mProvider) {
        try {
          const boxedBool = extractNativeBoxedBoolean(sThis);
          const str = Boolean.prototype.toString.bind(boxedBool)();
          return new SValues.SStringValue(str, mProvider.newMetadataForRuntimeTimeEmergingValue());
        } catch (e: any) {
          throw new Error("todo sensible error2 swizzled_apply_raw " + e.toString());
        }
      },
    },
    sTable.sGlobalProtocols.FunctionProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
  sTable.sGlobalProtocols.BooleanProtocol = SValues.SNormalObject.createFromNative(
    Boolean.prototype as ExtraBooleanDefs & Boolean,
    {
      swizzle_static_valueOf: s_valueOf,
      swizzle_static_toString: s_toString
    },
    sTable.sGlobalProtocols.ObjectProtocol,
    sTable.newMetadataForCompileTimeLiteral()
  );
}

// typescript is missing some definitions

declare interface ExtraBooleanDefs {
  toString(): string;
}