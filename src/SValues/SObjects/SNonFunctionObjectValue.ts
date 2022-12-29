import SUserError from "../../Models/SUserError";
import type { SLocalSymbolTable } from "../../SLocalSymbolTable";
import type { MaybeSValueMetadata } from "../../SValueMetadata";
import type { SValue } from "../SValue";
import { SNonProxyObject } from "./SNonProxyObject";
import type { SBuiltInNonFunctionObjectKind, MapSBuiltInObjectKindToSObjectStorage } from "./SObjectValueDef";

export abstract class SNonFunctionObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInNonFunctionObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SNonProxyObject<M, K, S> {
  sUnaryTypeOfAsNative(): "object" {
    return "object";
  }
  sApply(thisArg: SValue<M>, args: SValue<M>[], sTable: SLocalSymbolTable<M>): never {
    throw SUserError.cannotCall(this.sToPropertyKey(sTable).toString());
  }
  sConstruct(): never {
    throw Error("todo sConstruct on SNonFunctionObjectValue")
  }
}