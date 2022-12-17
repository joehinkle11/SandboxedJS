import { SMetadataProvider } from "../../SMetadataProvider";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SNonFunctionObjectValue } from "./SNonFunctionObjectValue";
import { BaseSObjectStorage, SObjectProperties } from "./SObjectValueDef";
import { buildNativeJsValueForSObject } from "./SObjectValueImpl";

export class SNormalObject<M extends MaybeSValueMetadata> extends SNonFunctionObjectValue<M, "normal", BaseSObjectStorage> {
  
  readonly nativeJsValue: any;
  readonly sStorage: BaseSObjectStorage;

  constructor(properties: SObjectProperties, mProvider: SMetadataProvider<M>) {
    super(undefined, mProvider.newMetadataForObjectValue());
    const obj = {};
    Object.setPrototypeOf(obj, null);
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(properties));
    this.sStorage = obj;
    this.nativeJsValue = buildNativeJsValueForSObject(this, this.sStorage);
  }
}
