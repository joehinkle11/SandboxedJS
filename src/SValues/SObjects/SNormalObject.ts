import type { SLocalSymbolTable, SRootSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValues } from "../AllSValues";
import { SNonFunctionObjectValue } from "./SNonFunctionObjectValue";
import type { BaseSObjectStorage, SObjectProperties, SObjectSwizzleAndWhiteList, SPrototypeDeterminedType, SPrototypeType } from "./SObjectValueDef";
import { applySwizzleToObj } from "./SObjectValueImpl";

export class SNormalObject<M extends MaybeSValueMetadata> extends SNonFunctionObjectValue<M, "normal", BaseSObjectStorage> {
  declare getNativeJsValue: (rootSTable: SRootSymbolTable<M>) => any;
  declare readonly sStorage: BaseSObjectStorage;

  private constructor(
    properties: SObjectProperties,
    sPrototype: SPrototypeType,
    metadata: M,
    exportNativeJsValueAsCopiedBuiltIn: boolean
  ) {
    super(properties, sPrototype, metadata, exportNativeJsValueAsCopiedBuiltIn);
  }

  static create<M extends MaybeSValueMetadata>(
    anySObject: BaseSObjectStorage,
    sPrototype: SPrototypeDeterminedType,
    sTable: SLocalSymbolTable<M>
  ): SNormalObject<M> {
    return new SNormalObject<M>(anySObject, sPrototype, sTable.newMetadataForObjectValue(), false);
  }
  static createFromNative<O extends object, M extends MaybeSValueMetadata>(
    nativeJsObject: O,
    sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<O>,
    sPrototype: SPrototypeType,
    metadata: M
  ): SNormalObject<M> {
    let safeObject: any = {}; 
    const weakRefToSValue = new SValues.WeakRefToSValue();
    applySwizzleToObj(safeObject, nativeJsObject, sSwizzleAndWhiteList, weakRefToSValue);
    const newObj = new SNormalObject<M>(safeObject, sPrototype, metadata, false);
    weakRefToSValue.setSValue(newObj);
    return newObj;
  }
  // not properties are allowed, mainly for build-in objects like [object Number]
  static exposeNativeBuiltIn<O extends object, M extends MaybeSValueMetadata>(
    nativeJsObjectToExpose: O,
    sPrototype: SPrototypeType,
    metadata: M,
  ): SNormalObject<M> {
    if (Reflect.ownKeys(nativeJsObjectToExpose).length > 0) {
      throw new Error(`You cannot expose a native object which contains any properties, see exposeNativeBuiltIn in SNormalObject.`)
    }
    return new SNormalObject<M>(nativeJsObjectToExpose as any, sPrototype, metadata, true);
  }
}
