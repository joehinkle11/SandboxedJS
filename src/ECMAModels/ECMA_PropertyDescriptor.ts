import type { SFunction } from "../SValues/SObjects/SFunction";
import type { SValue } from "../SValues/SValue";
import type { ECMA_Record } from "./ECMA_Record";

/// https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-property-descriptor-specification-type
export interface ECMA_PropertyDescriptor extends ECMA_Record {

  // accessor
  __Get__: SFunction<any> | undefined
  __Set__: SFunction<any> | undefined

  // data
  __Value__: SValue<any> | undefined
  __Writable__: boolean | undefined

  // shared
  __Enumerable__: boolean
  __Configurable__: boolean
}