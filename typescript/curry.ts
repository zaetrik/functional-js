const add = (a: number): ((b: number) => number) => (b: number): number =>
  a + b;

// add() can be curried => pass the first parameter "a" and add(a) then returns a new function with the value of the parameter "a" fixed in the closure of the function
// we can now create specialized functions
const add1 = add(1);
const add2 = add(2);

console.log(add1(2)); // => 3
console.log(add2(2)); // => 4

// we can also call the add() this way add(a)(b)
console.log(add(1)(2)); // => 3
