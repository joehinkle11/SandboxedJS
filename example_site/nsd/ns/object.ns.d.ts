interface ObjectConstructor {
  getUserDataSources(o: any): string
  getOrigin(o: any): string
  isUserData(o: any): boolean
  getOwnPropertyNames(o: any): string[];
 }
