// import type { SValue } from "./SValue";


// export class WeakRefToSValue {
//   private weakRef: WeakRef<SValue<any>> | undefined;
//   deref(): SValue<any> | undefined {
//     return this.weakRef?.deref();
//   }
//   setSValue(sValue: SValue<any>) {
//     this.weakRef = new WeakRef(sValue);
//   }
// }