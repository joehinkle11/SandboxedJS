

export type SwizzleOrWhiteListEntry = (HardCodedSwizzleOrWhiteListEntry | WhiteListEntry | SwizzledRawApply | SwizzledDynamicProperty | SwizzledRawConstruct | SwizzledStaticProperty) & {
  kind: string
};
interface SwizzledRawApply {
  kind: "swizzled_raw_apply"
  code_body: string
}
interface SwizzledRawConstruct {
  kind: "swizzled_raw_construct"
  code_body: string
}
interface HardCodedSwizzleOrWhiteListEntry {
  kind: "hardcoded"
  code: string
}
interface WhiteListEntry {
  kind: "whitelist"
  property: string
}
interface SwizzledStaticProperty {
  kind: "swizzled_static_property"
  property: string
  code_body: string
}
interface SwizzledDynamicProperty {
  kind: "swizzled_dynamic_property"
  property: string
  code_body: string
}
