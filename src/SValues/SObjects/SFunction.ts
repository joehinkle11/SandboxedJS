import SUserError from "../../Models/SUserError";
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
  readonly sFunctionNameNative: string;

  getSFunctionPrototypeProperty(receiver: SValue<M> = this): SValue<M> {
    const result: unknown = Reflect.get(this.sStorage, "prototype", receiver);
    if (result instanceof SValues.SValue) {
      return result;
    }
    throw new Error(`Unexpectedly found non-s-value for function prototype property.`);
  }

  private constructor(
    sStorage: AnySFunction,
    sPrototype: SPrototypeType,
    sFunctionNameNative: string,
    functionAsString: string,
    metadata: M
  ) {
    super(sStorage, sPrototype, metadata, false);
    this.sFunctionNameNative = sFunctionNameNative;
    this.functionAsString = functionAsString;
  }

  sConstruct: (args: SValue<M>[], newTarget: SFunction<any>, sTable: SLocalSymbolTable<M>) => SObjectValue<M, any, any> = sConstruct;

  /// the provided anySFunction.protocol will be discard
  static create<M extends MaybeSValueMetadata>(
    anySFunction: AnySFunction,
    functionAsString: string,
    sTable: SLocalSymbolTable<M>
  ): SFunction<M> {
    const sFunctionNameNative = anySFunction.name;
    anySFunction.prototype = SValues.SNormalObject.create({}, sTable.sGlobalProtocols.ObjectProtocol, sTable);
    const fixedAnySFunction = convertAllPropertiesToSValues(anySFunction, anySFunction, sTable);
    const sPrototype = sTable.sGlobalProtocols.FunctionProtocol;
    return new SFunction<M>(fixedAnySFunction, sPrototype, sFunctionNameNative, functionAsString, sTable.newMetadataForObjectValue());
  }
  static createFromNative<O extends UnknownConstructorFunction | UnknownFunction, M extends MaybeSValueMetadata>(
    nativeJsFunction: O,
    sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<O & UnknownConstructorFunction & UnknownFunction>,
    sPrototype: SPrototypeType,
    metadata: M
  ): SFunction<M> {
    const sFunctionNameNative = nativeJsFunction.name;
    const functionAsString = Function.bind(nativeJsFunction).toString();
    let safeFunction: AnySFunction; 
    if (sSwizzleAndWhiteList.swizzled_apply_raw === undefined) {
      // const swizzledApplyProxied: UnknownFunction = sSwizzleAndWhiteList.swizzled_apply_proxied;
      // safeFunction = {[sFunctionNameNative]: function() {
      //   // return swizzledApplyProxied.apply(undefined, arguments as any);
        throw new Error("todo swizzledApplyProxied");
      // }}[sFunctionNameNative] as AnySFunction
    } else {
      const swizzledApplyRaw: SandboxedFunctionCall = sSwizzleAndWhiteList.swizzled_apply_raw;
      if (sSwizzleAndWhiteList.swizzled_construct_raw === undefined) {
        throw new Error("todo swizzled_construct_raw");
      } else {
        const swizzledConstructRaw: SandboxedConstructorFunctionCallAsNormalCall = sSwizzleAndWhiteList.swizzled_construct_raw;
        safeFunction = {[sFunctionNameNative]: function(sThisArg: SValue<any> | undefined, sArgArray: SValue<any>[], newTarget: SFunction<any> | undefined, sTable: SLocalSymbolTable<any>): SValue<any> {
          if (new.target === undefined) {
            return swizzledApplyRaw.call(undefined, sThisArg, sArgArray, undefined, sTable);
          } else {
            return swizzledConstructRaw.call(undefined, undefined, sArgArray, newTarget!, sTable);
          }
        }}[sFunctionNameNative] as AnySFunction 
      }
    }
    applySwizzleToObj(safeFunction, nativeJsFunction, sSwizzleAndWhiteList);
    return new SFunction<M>(safeFunction, sPrototype, sFunctionNameNative, functionAsString, metadata);
  }
}