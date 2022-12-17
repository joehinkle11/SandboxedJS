

export type SProxiedNativeArray<E extends SValue<M>, M extends MaybeSValueMetadata> = Omit<E[], "length"> & {length: SNumberValue<M, number>};