
export function isValidJsPropertyName(str: string): boolean {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code === 95) && // _
        !(code === 36) && // $
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};


export function evenlyRemovingLeadingSpaces(str: string): string {
  const lines = str.split("\n");
  let smallestLeadingSpacesAmt = Infinity;
  for (const line of lines) {
    if (line !== "") {
      let count = 0;
      for (const char of line) {
        if (char === " ") {
          count += 1;
        }
      }
      if (count < smallestLeadingSpacesAmt) {
        smallestLeadingSpacesAmt = count;
      }
    }
  }
  if (smallestLeadingSpacesAmt !== Infinity) {
    let spacesStr = "";
    for (let i = 0; i < smallestLeadingSpacesAmt; i++) {
      spacesStr += " ";
    }
    return lines.map(l => l.replace(spacesStr, "")).join("\n");
  }
  return str;
}