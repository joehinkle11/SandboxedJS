import { SMetadataProvider } from "../../SMetadataProvider";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SNonFunctionObjectValue } from "./SNonFunctionObjectValue";
import { BaseSObjectStorage, SObjectProperties } from "./SObjectValueDef";

export class SNormalObject<M extends MaybeSValueMetadata> extends SNonFunctionObjectValue<M, "normal", BaseSObjectStorage> {
  get nativeJsValue(): any { return this.getNativeJsValue() }
  readonly sStorage: BaseSObjectStorage;

  constructor(properties: SObjectProperties, mProvider: SMetadataProvider<M>) {
    super(undefined, mProvider.newMetadataForObjectValue());
    this.sStorage = properties;
  }
}
