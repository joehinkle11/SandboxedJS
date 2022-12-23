import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../AllSValues";
import type { SValue } from "../SValue";
import type { AnySFunction, SandboxedConstructorFunctionCall, SandboxedConstructorFunctionCallAsNormalCall, SandboxedFunctionCall, UnknownConstructorFunction, UnknownFunction } from "./SFunctionDef";
import { sApply, sConstruct } from "./SFunctionImpl";
import { SObjectValue } from "./SObjectValue";
import type { SObjectSwizzleAndWhiteList, SBuiltInFunctionObjectKind, SPrototypeType } from "./SObjectValueDef";
import { applySwizzleToObj, convertAllPropertiesToSValues } from "./SObjectValueImpl";

// todo: remove this class and just represent constructors, functions and arrow functions the same way...?
export abstract class SFunctionObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInFunctionObjectKind> extends SObjectValue<M, K, AnySFunction> {
  abstract readonly sStorage: AnySFunction;
  sUnaryTypeOfAsNative(): "function" { return "function" }
  sApply: (thisArg: SValue<M>, args: SValue<M>[], sTable: SLocalSymbolTable<M>) => SValue<M> = sApply;
}

export class SFunction<M extends MaybeSValueMetadata> extends SFunctionObjectValue<M, "function"> {
  declare getNativeJsValue: (rootSTable: SRootSymbolTable<M>) => () => {};
  declare readonly sStorage: AnySFunction & SandboxedConstructorFunctionCall;
  readonly functionAsString: string;

  private constructor(
    sStorage: AnySFunction,
    sPrototype: SPrototypeType,
    functionAsString: string,
    metadata: M
  ) {
    super(sStorage, sPrototype, metadata, false);
    this.functionAsString = functionAsString;
  }

  sConstruct: (args: SValue<M>[], newTarget: SFunction<any>, sTable: SLocalSymbolTable<M>) => SObjectValue<M, any, any> = sConstruct;

  static create<M extends MaybeSValueMetadata>(
    anySFunction: AnySFunction,
    functionAsString: string,
    mProvider: SMetadataProvider<M>
  ): SFunction<M> {
    const fixedAnySFunction = convertAllPropertiesToSValues(anySFunction, anySFunction, mProvider);
    const sPrototype = new SValues.SNullValue(mProvider.newMetadataForRuntimeTimeEmergingValue()); // todo: sPrototype
    return new SFunction<M>(fixedAnySFunction, sPrototype, functionAsString, mProvider.newMetadataForObjectValue());
  }
  static createFromNative<O extends UnknownConstructorFunction | UnknownFunction, M extends MaybeSValueMetadata>(
    nativeJsFunction: O,
    sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<O & UnknownConstructorFunction & UnknownFunction>,
    sPrototype: SPrototypeType,
    metadata: M
  ): SFunction<M> {
    const functionAsString = Function.bind(nativeJsFunction).toString();
    let safeFunction: AnySFunction; 
    if (sSwizzleAndWhiteList.swizzled_apply_raw === undefined) {
      // const swizzledApplyProxied: UnknownFunction = sSwizzleAndWhiteList.swizzled_apply_proxied;
      // safeFunction = {[nativeJsFunction.name]: function() {
      //   // return swizzledApplyProxied.apply(undefined, arguments as any);
        throw new Error("todo swizzledApplyProxied");
      // }}[nativeJsFunction.name] as AnySFunction
    } else {
      const swizzledApplyRaw: SandboxedFunctionCall = sSwizzleAndWhiteList.swizzled_apply_raw;
      if (sSwizzleAndWhiteList.swizzled_construct_raw === undefined) {
        throw new Error("todo swizzled_construct_raw");
      } else {
        const swizzledConstructRaw: SandboxedConstructorFunctionCallAsNormalCall = sSwizzleAndWhiteList.swizzled_construct_raw;
        safeFunction = {[nativeJsFunction.name]: function(sThisArg: SValue<any> | undefined, sArgArray: SValue<any>[], newTarget: SFunction<any> | undefined, sTable: SLocalSymbolTable<any>): SValue<any> {
          if (new.target === undefined) {
            return swizzledApplyRaw.call(undefined, sThisArg, sArgArray, undefined, sTable);
          } else {
            return swizzledConstructRaw.call(undefined, undefined, sArgArray, newTarget!, sTable);
          }
        }}[nativeJsFunction.name] as AnySFunction 
      }
    }
    applySwizzleToObj(safeFunction, nativeJsFunction, sSwizzleAndWhiteList);
    return new SFunction<M>(safeFunction, sPrototype, functionAsString, metadata);
  }
}