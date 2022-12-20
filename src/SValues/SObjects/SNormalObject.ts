import type { SRootSymbolTable } from "../../SLocalSymbolTable";
import type { SMetadataProvider } from "../../SMetadataProvider";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import { SNonFunctionObjectValue } from "./SNonFunctionObjectValue";
import type { BaseSObjectStorage, SObjectProperties, SObjectSwizzleAndWhiteList, SPrototypeType } from "./SObjectValueDef";
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
    sPrototype: SPrototypeType,
    mProvider: SMetadataProvider<M>
  ): SNormalObject<M> {
    return new SNormalObject<M>(anySObject, sPrototype, mProvider.newMetadataForObjectValue(), false);
  }
  static createFromNative<O extends object, M extends MaybeSValueMetadata>(
    nativeJsObject: O,
    sSwizzleAndWhiteList: SObjectSwizzleAndWhiteList<O>,
    sPrototype: SPrototypeType,
    metadata: M
  ): SNormalObject<M> {
    let safeObject: any = {}; 
    applySwizzleToObj(safeObject, nativeJsObject, sSwizzleAndWhiteList);
    return new SNormalObject<M>(safeObject, sPrototype, metadata, false);
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
    return new SNormalObject<M>(nativeJsObjectToExpose, sPrototype, metadata, true);
  }
}
