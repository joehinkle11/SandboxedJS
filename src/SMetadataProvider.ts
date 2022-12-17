import { MaybeSValueMetadata, SValueMetadata } from "./SValueMetadata";
import { ValueMetadataSystem } from "./TranspileContext";


export interface SMetadataProvider<M extends MaybeSValueMetadata> {
  newMetadataForRuntimeTimeEmergingValue(): M
  newMetadataForCompileTimeLiteral(): M
  newMetadataForObjectValue(): M
  valueMetadataSystem: M extends SValueMetadata ? ValueMetadataSystem<any> : null
}

export const emptySMetadataProvider: SMetadataProvider<any> = {
  newMetadataForRuntimeTimeEmergingValue(): null {
    return null;
  },
  newMetadataForCompileTimeLiteral(): null {
    return null;
  },
  newMetadataForObjectValue(): null {
    return null;
  },
  get valueMetadataSystem(): null { return null }
}