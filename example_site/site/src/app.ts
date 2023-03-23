import "./nspolyfill.js";
import helperValueObj from "./helper.js";
import {h} from "./helper.js";
 
// function x(value: number) {
//   return value * 100;
// }
const x = function(value: number) {
  return value * 100;
}

const a = 1;
const b = 2;
const c = a + b;
// alert(c - x(c));
console.log(helperValueObj);
const {helperValue} = helperValueObj;
alert(helperValue)
alert(h)


// document.body.innerText = "<p>dfdoo</p>"

// const path = prompt("enter name")
// const path = prompt("https://cdn.crate.as/user_content%2FKLIh9Dh2mcRXEg9mbv6VBkhaB3N2%2Fpublic%2FFE35B93B-0319-43F4-87E6-C63E3C52D4B6.png?alt=media&class=author")

// hashResponseContract({
//   description: "An image",
//   path: path,
// })

// const url = "http://localhost:3000/" + path
// const jsonObj: {success: boolean} = contract.applyTo(url).then((unlockedUrl) => {
//   // return fetch(unlockedUrl).then((res) => res.json()).then((jsonObj) => {
//   //   console.log("OUR JSON OBJ" , jsonObj)
//   // })
//   return {success: true}
// })