import SUserError from "../../Models/SUserError";
import { SMetadataProvider } from "../../SMetadataProvider";
import { MaybeSValueMetadata } from "../../SValueMetadata";
import { SValue } from "../SValue";
import { SObjectValue } from "./SObjectValue";
import { SBuiltInNonFunctionObjectKind, MapSBuiltInObjectKindToSObjectStorage } from "./SObjectValueDef";

export abstract class SNonFunctionObjectValue<M extends MaybeSValueMetadata, K extends SBuiltInNonFunctionObjectKind, S = MapSBuiltInObjectKindToSObjectStorage<K>> extends SObjectValue<M, K, S> {
  sUnaryTypeOfAsNative(): "object" {
    return "object";
  }
  sApply(thisArg: SValue<M>, args: SValue<M>[], mProvider: SMetadataProvider<M>): never {
    throw SUserError.cannotCall(this.sToPropertyKey(mProvider).toString());
  }
}