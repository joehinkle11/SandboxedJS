import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../AllSValues";
import type { SValue } from "../SValue";
import type { SReceiverOrTarget } from "../SValueDef";
import type { AnySFunction, SandboxedConstructorFunctionCall, SandboxedConstructorFunctionCallAsNormalCall, SandboxedFunctionCall, UnknownConstructorFunction, UnknownFunction } from "./SFunctionDef";
import { sApply, sConstruct } from "./SFunctionImpl";
import { SNonProxyObject } from "./SNonProxyObject";
import type { SObjectValue } from "./SObjectValue";
import type { SObjectSwizzleAndWhiteList, SBuiltInFunctionObjectKind, SPrototypeType, SPrototypeDeterminedType } from "./SObjectValueDef";
import { applySwizzleToObj, convertAllPropertiesToSValues } from "./SObjectValueImpl";

// todo: remove this class and just represent constructors, functions and arrow functions the same way...?
export abstract class SFunctionObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInFunctionObjectKind> extends SNonProxyObject<M, K, AnySFunction> {
  abstract readonly sStorage: AnySFunction;
  sUnaryTypeOfAsNative(): "function" { return "function" }
  sApply: (thisArg: SValue<M>, args: SValue<M>[], sTable: SLocalSymbolTable<M>) => SValue<M> = sApply;
}

export class SFunction<M extends MaybeSValueMetadata> extends SFunctionObjectValue<M, "function"> {
  declare getNativeJsValue: (rootSTable: SRootSymbolTable<M>) => () => {};
  declare readonly sStorage: AnySFunction & SandboxedConstructorFunctionCall;
  readonly functionAsString: string;
  readonly sFunctionNameNative: string;

  // sIsCallableNative(): boolean {
  //   return true;
  // }

  getSFunctionPrototypeProperty(receiver: SReceiverOrTarget<M> = this): SValue<M> {
    const result: unknown = Reflect.get(this.sStorage, "prototype", receiver);
    if (result instanceof SValues.SValue) {
      return result;
    } else if (result !== null && typeof result === "object" && "binding_pointing_to" in result) {
      const bindingPointingTo = result.binding_pointing_to;
      if (bindingPointingTo instanceof SValues.SFunction) {
        return bindingPointingTo.getSFunctionPrototypeProperty(receiver);
      }
    }
    throw new Error(`Unexpectedly found non-s-value for function prototype property. Found '${result}'.`);
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
  
  static createBinding<M extends MaybeSValueMetadata>(
    sFunctionToBind: SFunction<M>,
    thingToBind: SValue<M>,
    sTable: SLocalSymbolTable<M>
  ): SFunction<M> {
    const boundSFunctionNameNative = "bound " + sFunctionToBind.sFunctionNameNative;
    const actualFunction: AnySFunction = {[boundSFunctionNameNative]: ((_1, newSArgArray, _2, newSTable) => {
      return sFunctionToBind.sApply(thingToBind, newSArgArray, newSTable);
    }) as AnySFunction}[boundSFunctionNameNative];
    actualFunction.prototype = {
      binding_pointing_to: sFunctionToBind
    }
    let sPrototype: SPrototypeDeterminedType;
    const sFunctionToBindSPrototype = sFunctionToBind.determinedSPrototype;
    if (sFunctionToBindSPrototype instanceof SValues.SObjectValue) {
      sPrototype = sFunctionToBindSPrototype;
    } else {
      sPrototype = sTable.sGlobalProtocols.FunctionProtocol;
    }
    return new SFunction<M>(actualFunction, sPrototype, boundSFunctionNameNative, "function () { [native code] }", sTable.newMetadataForObjectValue());
  }

  static createFromNative<O extends UnknownConstructorFunction | UnknownFunction, M extends MaybeSValueMetadata>(
    nativeJsFunction: O,
    sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<O & UnknownConstructorFunction & UnknownFunction>,
    sPrototype: SPrototypeType,
    metadata: M,
    sTable: SLocalSymbolTable<M>
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
          if (newTarget === undefined) {
            return swizzledApplyRaw.call(undefined, sThisArg, sArgArray, undefined, sTable);
          } else {
            return swizzledConstructRaw.call(undefined, undefined, sArgArray, newTarget!, sTable);
          }
        }}[sFunctionNameNative] as AnySFunction 
      }
    }
    const safeFunctionPrototype = safeFunction.prototype;
    if ((safeFunctionPrototype instanceof SValues.SValue === false) && ((safeFunctionPrototype !== null && typeof safeFunctionPrototype === "object" && "binding_pointing_to" in safeFunctionPrototype) === false)) {
      // there is no s function prototype, make a default
      safeFunction.prototype = SValues.SNormalObject.create({}, sTable.sGlobalProtocols.ObjectProtocol, sTable);
    }
    applySwizzleToObj(safeFunction, nativeJsFunction, sSwizzleAndWhiteList, sTable);
    const newFunc = new SFunction<M>(safeFunction, sPrototype, sFunctionNameNative, functionAsString, metadata);
    return newFunc;
  }
}