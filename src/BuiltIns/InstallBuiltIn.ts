import { SRootSymbolTable } from "../SLocalSymbolTable"
import { MaybeSValueMetadata } from "../SValueMetadata"


export type InstallBuiltIn<M extends MaybeSValueMetadata> = (sTable: SRootSymbolTable<M>) => void