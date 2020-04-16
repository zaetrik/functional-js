// Currying means we create function that returns a new function.
// Currying is a powerful concept in functional programming.
// With currying we can create abstract functions and the partially apply those functions to create more specialized ones.

// A very basic example would be an add function

// Normally we would write it like this:
const add = (x, y) => x + y; // We can call it like that: add(1, 2)

// We now have binary function that takes two parameters
// In functional programming it is useful two have unary functions (functions that take exactly one parameter).
// Unary functions can be used for function composition, which is another powerful and important concept in functional programming.

// The curried version of our add function would look like this:
// curriedAdd :: Number -> Number -> Number
const curriedAdd = (x) => (y) => x + y; // We can call it like that: add(1)(2)

// curriedAdd() takes one parameter x, which is the first number.
// curriedAdd(1) then returns another function that takes the next parameter y. The function is now partially applied, that means we have given the function a part of its needed parameters.
// As soon as we supply curriedAdd with the second parameter it is fully applied and the function gets executed and in our case it calculates the sum of x and y.

// partiallyAppliedCurriedAdd :: Number -> Number
const partiallyAppliedCurriedAdd = curriedAdd(1); // curriedAdd(1) returns a function where x = 1. The parameter x is fixed in the closure of the function. That means if we call partiallyAppliedCurriedAdd(y) we can still access the parameter x.
// fullyAppliedCurriedAdd :: Number
const fullyAppliedCurriedAdd = partiallyAppliedCurriedAdd(2); // We now supplied all parameters to the function and the sum of x and y gets calculated => x = 1, y = 2 => 1 + 2 = 3

// With currying we can creatte specialized version of functions
// addOne :: Number -> Number
const addOne = curriedAdd(1); // This will add one to whatever number we pass to addOne()
// addTwo :: Number -> Number
const addTwo = curriedAdd(2); // This will add two to whatever number we pass to addOne()

// three :: Number
const three = curriedAdd(1)(2);
