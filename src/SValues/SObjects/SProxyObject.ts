import { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValue } from "../SValue";
import { SReceiverOrTarget } from "../SValueDef";
import { SFunction } from "./SFunction";
import { SObjectValue } from "./SObjectValue";
import { SPrototypeType, SPrototypeDeterminedType } from "./SObjectValueDef";









export class SProxyObject<M extends MaybeSValueMetadata> extends SObjectValue<M, any, any> {
  get sPrototype(): SPrototypeType {
    throw new Error("todo proxyy")
  }
  get determinedSPrototype(): SPrototypeDeterminedType {
    throw new Error("todo proxyy")
  }
  get exportNativeJsValueAsCopiedBuiltIn(): boolean {
    return false;
  }
  sUnaryNegateInternal: (() => SValue<M> | undefined) = () => {
    return this.proxiedObject.sUnaryNegateInternal?.();
  }
  sUnaryMakePositiveInternal: (() => SValue<M> | undefined) = () => {
    return this.proxiedObject.sUnaryMakePositiveInternal?.();
  }
  sGetNativeAsBoolean(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): boolean {
    throw new Error("Method not implemented. sGetNativeAsBoolean");
  }
  sDefineOwnPropertyOrThrowNative(p: string | symbol, desc: PropertyDescriptor, sTable: SLocalSymbolTable<any>): void {
    throw new Error("Method not implemented. sDefineOwnPropertyOrThrowNative");
  }
  sDefineProperty(propertyKey: string | symbol, attributes: SObjectValue<M, any, any>, sTable: SLocalSymbolTable<M>): this {
    throw new Error("Method not implemented. sDefineProperty");
  }
  getNativeJsValue(rootSTable: SRootSymbolTable<M>) {
    throw new Error("Method not implemented. getNativeJsValue");
  }
  sOwnKeysNative(): (string | symbol)[] {
    throw new Error("Method not implemented. sOwnKeysNative");
  }
  sHasNative(p: string | symbol): boolean {
    throw new Error("Method not implemented. sHasNative");
  }
  sGet(p: string | symbol, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): SValue<M> {
    
    return this.proxiedObject.sGet(p, receiver, sTable);
  }
  sSet<T extends SValue<M>>(p: string | symbol, newValue: T, receiver: SReceiverOrTarget<M>, sTable: SLocalSymbolTable<M>): T {
    throw new Error("Method not implemented. sSet");
  }

  readonly proxiedObject: SObjectValue<M, any, any>;

  /// https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-proxycreate
  constructor(proxiedObject: SObjectValue<M, any, any>) {
    super(proxiedObject.metadata);
    this.proxiedObject = proxiedObject;
  }

  sUnaryTypeOfAsNative(): "object" | "function" {
    return this.proxiedObject.sUnaryTypeOfAsNative();
  }
  sApply(thisArg: SValue<M>, args: SValue<M>[], sTable: SLocalSymbolTable<M>): SValue<M> {
    throw new Error("Method not implemented. sApply");
  }
  sConstruct(args: SValue<M>[], newTarget: SFunction<any>, sTable: SLocalSymbolTable<M>): SObjectValue<M, any, any> {
    throw new Error("Method not implemented. sConstruct");
  }




}