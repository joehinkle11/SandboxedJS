import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import type { AnySFunction, UnknownFunction } from "./SFunctionDef";
import { sApply } from "./SFunctionImpl";
import { SObjectValue } from "./SObjectValue";
import type { AnySObjectSwizzleAndWhiteList, SObjectSwizzleAndWhiteList, SBuiltInFunctionObjectKind } from "./SObjectValueDef";
import { convertAllPropertiesToSValues } from "./SObjectValueImpl";

// todo: remove this class and just represent constructors, functions and arrow functions the same way...?
export abstract class SFunctionObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInFunctionObjectKind> extends SObjectValue<M, K, AnySFunction> {
  sUnaryTypeOfAsNative(): "function" { return "function" }
  sApply: (thisArg: SValue<M>, args: SValue<M>[], mProvider: SMetadataProvider<M>) => SValue<M> = sApply;
}

export class SFunction<M extends MaybeSValueMetadata> extends SFunctionObjectValue<M, "function"> {
  get nativeJsValue(): () => {} { return this.getNativeJsValue() }
  readonly sStorage: AnySFunction;
  readonly functionAsString: string;

  private constructor(sStorage: AnySFunction, functionAsString: string, sSwizzleAndWhiteList: AnySObjectSwizzleAndWhiteList | undefined, metadata: M) {
    super(sSwizzleAndWhiteList, metadata);
    this.sStorage = sStorage;
    this.functionAsString = functionAsString;
  }

  static create<M extends MaybeSValueMetadata>(anySFunction: AnySFunction, functionAsString: string, mProvider: SMetadataProvider<M>): SFunction<M> {
    const fixedAnySFunction = convertAllPropertiesToSValues(anySFunction, anySFunction, mProvider);
    Object.setPrototypeOf(fixedAnySFunction, null);
    return new SFunction<M>(fixedAnySFunction, functionAsString, undefined, mProvider.newMetadataForObjectValue());
  }
  static createFromNative<O extends UnknownFunction, M extends MaybeSValueMetadata>(
    nativeJsFunction: O,
    sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<O>,
    // sSwizzleProtocol: SObjectValue<M, any, any>, // todo
    metadata: M
  ): SFunction<M> {
    const functionAsString = Function.bind(nativeJsFunction).toString();
    return new SFunction<M>(nativeJsFunction as any, functionAsString, sSwizzleAndWhiteList, metadata);
  }
}