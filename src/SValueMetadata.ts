

export interface SValueMetadata {

  mixWithReferencedMetadata(metadataOnReference: SValueMetadata): SValueMetadata;
}

export type MaybeSValueMetadata = SValueMetadata | undefined;