import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { ValueMetadataSystem } from "./TranspileContext";


export interface SMetadataProvider<M extends MaybeSValueMetadata> {
  newMetadataForRuntimeTimeEmergingValue(): M
  newMetadataForCompileTimeLiteral(): M
  newMetadataForObjectValue(): M
  valueMetadataSystem: M extends SValueMetadata ? ValueMetadataSystem<any> : null
}