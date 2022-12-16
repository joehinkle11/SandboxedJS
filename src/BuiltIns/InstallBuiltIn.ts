import { SLocalSymbolTable } from "../SLocalSymbolTable"
import { MaybeSValueMetadata } from "../SValueMetadata"


export type InstallBuiltIn<M extends MaybeSValueMetadata> = (sTable: SLocalSymbolTable<M>) => void