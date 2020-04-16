// Some of this is taken from https://jrsinclair.com/articles/2019/algebraic-structures-what-i-wish-someone-had-explained-about-functional-programming/
// A 'Functor' is an algebraic structure
// A Functor structure must have .map() method
// map :: Functor f => f a ~> (a -> b) -> f b

interface Functor<A> {
  map<B>(f: (a: A) => B): Functor<B>;
  // Not necessary but used here to add util methods like emit()
  [x: string]: any;
}

// This map method doesn't do anything special
// map() takes a function that transforms a -> b (a & b could be the same but they could also be different types)
// When you call .map() on a Functor a you get a Functor b back

// Example for (a -> b)
// It takes a number and returns a string
const explainNumber = (a: number) => `This is a ${a}`;

// This is exactly what Array.prototype.map does => So an array is also a functor

// Let's create a functor
const MyFunctor = (x): Functor<any> => ({
  map: (f) => MyFunctor(f(x)),
  emit: () => x,
});

// We create a functor with the number 3 in it
const FunctorWithNumber: Functor<number> = MyFunctor(3);

// We use .map() of FunctorWithNumber with the function explainNumber() to get a new functor with a string in it
const FunctorWithString: Functor<string> = FunctorWithNumber.map(explainNumber);
// FunctorWithString now has "This is a 3" inside of it.

const FunctorWithArray: Functor<string[]> = FunctorWithString.map((x) =>
  x.split(" ")
);
// FunctorWithArray has [ 'This', 'is', 'a', '3' ] inside of it

// Anything you could imagine can be inside of a functor.
// When we put a value inside of a functor we say that we "lift" the value into the functor.

// We could  also create a functor that may or may not have a value inside of it
// Such a functor is called Maybe

const Just = (x): Functor<any> => ({
  emit: () => `Just(${x})`,
  map: (f) => Maybe(f(x)),
  isJust: true,
  isNothing: false,
});

const Nothing = (x?): Functor<any> => ({
  map: (_) => Nothing(),
  isJust: false,
  isNothing: true,
  emit: () => `Nothing`,
});

const Maybe = (x): Functor<any> =>
  x === null || x === undefined || x.isNothing ? Nothing() : Just(x);

// The Maybe functor can either be Just(x) or Nothing()
// When the Maybe functor contains a Just(x) value it means x is not undefined or null
// When the Maybe functor contains a Nothing() value it means x is undefined or null
// This is very useful when working with functions that may or may not return a value

// Let's try the Maybe functor out
const numbers: Functor<number[]> = Maybe([1, 2, 3, 4, 5]);

// Here we have a function that returns a value that is NOT null or undefined
// So we get back a Just() with the wanted value in it
// First we get the value from the array at the index 2 (=> 3) and then we add 10 to that number
const successfulOperation = numbers.map((x) => x[2]).map((x) => x + 10); // => Just(13)

// Here we have a function that returns a value that is null or undefined
// So we get back a Nothing
// First we try to get the number at the idnex 5. This number does not exist, so we get back a Nothing.
// Then we go to the second .map() where we try to add 10 to the number we got on the previous .map()
// Because we got a Nothing, we don't try to map over an undefined value but instead don't execute the function at all and just return Nothing again
// This is super useful for error handling and we also don't have to write weird if else statements to detect undefined or null values in our code
const failedOperation = numbers.map((x) => x[5]).map((x) => x + 10); // => Nothing
console.log(successfulOperation.emit(), failedOperation.emit());

// There are a ton of other functors that handle other things, e.g. Either
// Either has a Left and Right value
// This is also useful for actions that might fail
// The benefit of Either is that we can pass along the error message in Left and if there is no error we just put the value inside of Right

/**
 *
 * Functor Laws
 *
 */

// Functors must obey some laws to be considered a functor
// You can think of the laws as some kind of interface specification
// These laws are there to make sure that we can make some assumptions abput functors

/**
 *
 * First Law
 * Identity
 *
 */

// functor.map(x => x) === functor
// If we have an identity function (x => x) .map() has to return the same functor

/**
 *
 * Second Law
 * Composition
 *
 */

// functor.map(f).map(g) === u.map(x => g(f(x)))
// Calling .map() twice with first f() and then g() should be the same as calling .map() once with g(f(x)) (the result of f(x) applied to g())
// This makes sense if think about it. A quick more concrete example:

const add = (x) => (y) => x + y;
const addTwo = add(2);

const multiply = (x) => (y) => x * y;
const double = multiply(2);

const f = MyFunctor(5);
const doubleMap = f.map(addTwo).map(double); // => (5 + 2) * 2 = 14
const singleMap = f.map((x) => double(addTwo(5))); // => (5 + 2) * 2 = 14

export {};
