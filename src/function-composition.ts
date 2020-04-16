// compose multiple functions from right to left => compose(lastFunction, firstFunction) => return value from firstFunction gets passed to lastFunction
// all functions must be unary (take one parameter)
// compose :: [(a -> b)] -> c -> (a -> c)
export const compose = (...fns: ((data?: any) => any)[]) => (startData: any) =>
  fns.reduceRight(
    (
      previousFunction: (data?: any) => any,
      currentFunction: (data?: any) => any
    ) => currentFunction(previousFunction),
    startData
  );

// pipe multiple functions from left to right => pipe(firstFunction, lastFunction) => return value from firstFunction gets passed to lastFunction
// all functions must be unary (take one parameter)
// pipe :: [(a -> b)] -> c -> (a -> c)
export const pipe = (...fns: ((data?: any) => any)[]) => (startData: any) =>
  fns.reduce(
    (
      previousFunction: (data?: any) => any,
      currentFunction: (data?: any) => any
    ) => currentFunction(previousFunction),
    startData
  );

/**
 * pipe() and compose() are used for function composition => Making more complex functions from simple functions, e.g. const h = x => f(g(x))
 * Function composition is a very important and powerful concept in functional programming.
 */

// With compose() and pipe() we were only able to compose unary functions (functions that take only one parameter). But how do we compose functions that take multiple parameters?
// In order to compose functions with multiple parameters we have to use something called "lift". The lift functions takes as many unary functions as parameters the n-ary (polyadic) function takes.
// In the case of a binary function we would have a lift2() function that takes two unary functions and one binary function. The two unary functions are then passed as parameters to the binary function.
// We could also have a lift3, lift4, ... function to compose ternary, quaternary, ... functions.

// lift2() takes three functions as parameters. Two unary functions (g, h) and a binary function (f).
// lift2() then returns a function that takes a parameter x an passes that to the two unary function (g, h).
// lift2 :: (a -> b -> c) -> (a -> b) -> (a -> b) -> (a -> c)
export const lift2 = (f) => (g) => (h) => (x) => f(g(x))(h(x));

/**
 *
 * Examples
 *
 */

/**
 *
 * Composition with unary functions
 *
 */

// add :: Number -> Number -> Number
const add = (x) => (y) => x + y;

// multiply :: Number -> Number -> Number
const multiply = (x) => (y) => x * y;

const addTen = add(10);
const double = multiply(2);

// We are taking two simple functions addTen() and double() and compose a new function that combines them both together. We created a more complex function from multiple simple functions. => Function Composition
// The difference between pipe() and compose() is the order in which the arguments (functions) are called. In pipe() the functions are called from left to right. In compose() the functions are called from right to left.

// pipeAddTenThenDouble :: Number -> Number
const pipeAddTenThenDouble: (x: number) => number = pipe(addTen, double);
pipeAddTenThenDouble(5); // => (5 + 10) * 2 = 30

// composeDoubleThenAddTen :: Number -> Number
const composeDoubleThenAddTen: (x: number) => number = compose(addTen, double);
composeDoubleThenAddTen(5); // => 5 * 2 + 10 = 20

// To show how compose or pipe works we could log the intermediary results
import { trace } from "./utils";
compose(trace("After addTen: "), addTen, trace("After double: "), double)(5);

/**
 *
 * Composition with n-ary (polyadic) functions
 *
 */

// Example is inspired by https://jrsinclair.com/articles/2019/compose-js-functions-multiple-parameters/

// greet :: String -> String -> String - String
const greet = (greeting) => (firstname) => (lastname) =>
  `${greeting}, ${firstname} ${lastname}`;

// We create a function that takes two parameters
// northernGermanGreeting :: String -> String -> String
const northernGermanGreeting = greet("Moin Moin");

// We create our two unary functions
const firstname = ({ firstname, _ }) => firstname;
const lastname = ({ _, lastname }) => lastname;

// lift2() returns a function that takes an object.
// That object is then passed two firstname() and lastname().
// The result of those two functions is then used as parameters for the northernGermanGreeting function.
const greetAgent = lift2(northernGermanGreeting)(firstname)(lastname);

const agent007 = {
  firstname: "James",
  lastname: "Bond",
};
greetAgent(agent007); // => Moin Moin, James Bond

export {};
