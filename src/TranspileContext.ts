import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { SValue } from "./SValues";

export interface TranspileContextSetup<M extends MaybeSValueMetadata> {
  valueMetadataSystem: M extends SValueMetadata ? ValueMetadataSystem<M> : null
}

export class TranspileContext<M extends MaybeSValueMetadata> {
  valueMetadataSystem: ValueMetadataSystem<any> | null


  constructor(params: TranspileContextSetup<M>) {
    this.valueMetadataSystem = params.valueMetadataSystem;
  }

  newMetadataJsCodeForCompileTimeLiteral(): string {
    if (this.valueMetadataSystem === null) {
      return "";
    }
    return ",transpileContext.newMetadataForCompileTimeLiteral()";
  }
  newMetadataForRuntimeTimeEmergingValue(): M {
    if (this.valueMetadataSystem === null) {
      return undefined as M;
    }
    return this.valueMetadataSystem.newMetadataForRuntimeTimeEmergingValue();
  }
  newMetadataForCompileTimeLiteral(): M {
    return this.valueMetadataSystem!.newMetadataForCompileTimeLiteral();
  }
  newMetadataForObjectValue(): M {
    if (this.valueMetadataSystem === null) {
      return undefined as M;
    }
    return this.valueMetadataSystem.newMetadataForObjectValue();
  }
  newMetadataForFunctionValue(): M {
    if (this.valueMetadataSystem === null) {
      return undefined as M;
    }
    return this.valueMetadataSystem.newMetadataForFunctionValue();
  }
}

export interface ValueMetadataSystem<MetaDataModel extends SValueMetadata> {
  newMetadataForCompileTimeLiteral(): MetaDataModel;
  newMetadataForRuntimeTimeEmergingValue(): MetaDataModel;
  newMetadataForObjectValue(): MetaDataModel;
  newMetadataForFunctionValue(): MetaDataModel;
  newMetadataForCombiningValues(left: SValue<MetaDataModel>, right: SValue<MetaDataModel>): MetaDataModel;
}