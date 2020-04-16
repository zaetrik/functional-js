// Some of the content is taken from http://www.tomharding.me/2017/04/10/fantas-eel-and-specification-8/

import { Functor } from "./functors";
// Applicative Functors are as the name suggests also functors
// Applicative Functors have a few extra functionalities compared to normal functors

// One of those extra functionalities is the so called .ap() method
// ap :: f a ~> f (a -> b) -> f b
// This function signature should ring some bells
// If we remove the f's from the signature we get:
// => a -> (a -> b) -> b
// That is a basic function application.
// The difference of .ap() is that the function that gets applicated is wrapped in a context (here this means the function is wrapped inside some functor context, e.g. a Maybe => Just((x) => x + 1)))

// `Apply` can be used to lift functions of two or more arguments to work on values wrapped with the functor.

export interface Apply<A> extends Functor<A> {
  ap<B>(functor): Apply<B>;
}

const MyApply = (x): Apply<any> => ({
  map: (f) => MyApply(f(x)),
  ap: (someOtherFunctor) => someOtherFunctor.map(x),
  emit: () => x,
});

const numberApplicative: Apply<number> = MyApply(5);
const funcApplicative: Apply<(n: number) => string> = MyApply(
  (x: number): string => `${x} is the number in the Applicative`
);

funcApplicative.ap(numberApplicative); // => 5 is the number in the Applicative
// funcApplicative.ap(numberApplicative) === numberApplicative.map(Function inside of funcApplicative)

// So with .ap() we can apply a function that is inside a functor context to a value that is also inside of a functor context
// In this example "someOtherFunctor" is the Applicative Functor with the number 5 inside of it and the "x" that is used in .map() of it is a function that is inside of another Applicative Functor

// This way of executing a function that is inside of a functor context is not so convenient
// There is another way how to do it:
// lift2 :: Applicative f =>  (a -> b -> c) -> f a -> f b -> f c
// lift2 takes three parameters:
// 1. A function that takes two parameters (binary function)
// 2. An Applicative f a
// 3. An Applicative f b
// Then it returns a new Applicative f c
// So it lifts a binary function up to the context of Applicatives, so it can be applied to values inside of other Applicatives
// lift2 is just the exact implementation for lifting a binary function there is also lift3, lift4, etc.
// lift1 would be just functor.map(f)

const lift2 = (fn) => (fa) => (fb) => fa.map(fn).ap(fb);

// An applicative functor lets us merge contexts

// This function will be lifted. It has to be curried. It is binary.
const doubleThentell = (x: number) => (y: number): string =>
  `${x + y} is the number in the Applicative`;

// Here take our normal (so not in a functor context) function and apply two values that are in the Applicative Functor context to it
const y: Apply<string> = lift2(doubleThentell)(numberApplicative)(
  numberApplicative
); // => 10 is the number in the Applicative

// Here doubleThentell is curried
// When we look at lift2 we see that as soon as it is fully applied
// we take the first passed functor (fa) and map our function over it that we lifted (here doubleThentell).
// doubleThentell is curried so after fa.map(fn) we have a partially applied function inside of a new Applicative Functor.
// Then we apply the second functor (fb) to the function that is wrapped inside of fa with .ap(fb).
// Which is nothing else than .map() but this time we map over fb with the function inside of fa.
// fa.map(doubleThenTell) => IntermediaryApplicativeFunctor(doubleThenTell(fa)) => fa.ap(fb) === fb.map(doubleThenTell(fa)) ( => value inside of IntermediaryApplicativeFunctor)

// An amazing use case of the lift2 function is that we can this:
// Example taken from http://www.tomharding.me/2017/04/10/fantas-eel-and-specification-8/

// getJSON() fetches something from an API
// Returns also an Applicative Functor => Task => which is a lot like a Promise
// const getJSON = (url) => {};

// renderPage takes the users and posts which come from external APIs
// const renderPage = (users) => (posts) => {};

// This returns the fully rendered page
// const page = lift2(renderPage)(getJSON("/users"))(getJSON("/posts"));

// The amazing thing here is that both getJSON API calls are executed in parallel. Just like that!
// This is because lift2's second and third arguments have no dependencies on one another.
// Because of this, the arguments to lift2 can always be calculated in parallel
// Disclaimer => Task Functor has to be implemented in such a way that they can run in parallel

// Actually what we worked with before is just an Apply Functor
// For an Apply Functor to become an Applicative Functor we need another method
// of :: Applicative f => a -> f a
// .of() takes a value and lifts it into the Applicative context

export interface Applicative<A> extends Apply<A> {
  of: <B>(b: B) => Applicative<B>;
}

const MyApplicative = (x?): Applicative<any> => ({
  of: (value) => MyApplicative(value),
  map: (f) => MyApplicative(f(x)),
  ap: (someOtherFunctor) => someOtherFunctor.map(x),
  emit: () => x,
});

const newApplicative: Applicative<number> = MyApplicative().of(5); // => Applicative with 5 inside of it

/**
 *
 * Applicative Functor Laws
 *
 */

// For some applicative A

/**
 *
 * Identity Law
 *
 */

// Identity.
// v.ap(A.of((x) => x)) === v;

/**
 *
 * Homomorphism Law
 *
 */
// A.of(x).ap(A.of(f)) === A.of(f(x));

/**
 *
 * Interchange Law
 *
 */
// A.of(y).ap(u) === u.ap(A.of((f) => f(y)));
