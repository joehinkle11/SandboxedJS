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
  newMetadataForCompileTimeLiteral(): any {
    return this.valueMetadataSystem!.newMetadataForCompileTimeLiteral();
  }
}

export interface ValueMetadataSystem<MetaDataModel extends SValueMetadata> {
  newMetadataForCompileTimeLiteral(): MetaDataModel;
  newMetadataForBinaryOperation(left: SValue<MetaDataModel>, right: SValue<MetaDataModel>): MetaDataModel;
}