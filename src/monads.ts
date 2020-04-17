// A Monad is an "extension" of functors and applicative functors
// Besides .map(), .ap() & .of() Monads have two additional methods that must be defined
// => .join() & .chain()

import { Applicative } from "./applicative-functors";

interface Monad<A> extends Applicative<A> {
  join: () => A;
  chain<B>(f: (a: A) => B): Monad<B>;
}

const MyMonad = (x?): Monad<any> => ({
  of: (value) => MyMonad(value),
  map: (f) => MyMonad(f(x)),
  ap: (someOtherFunctor) => someOtherFunctor.map(x),
  join: () => x,
  chain: (f) => MyMonad(x).map(f).join(),
  // emit is not needed but useful for inspecting the current value
  emit: () => x,
});

// With .join() we can return the current value inside of a monad
// With .chain() we can "chain" the .map() & the .join() function together
// This way we can "chain" functions together that also return Functors/Applicative Functors/Monads etc. (e.g. x => Monad(x))
// Otherwise we would have nested Monads => If we map over a Monad with a function that also returns a Monad we would end up with Monad(Monad(x))
// To unwrap the inner Monad we can use .join() => Monad(x)
// It becomes tedious to always write .join() after we used .map() with a Monad returning function
// So .chain() got introduced. It abstracts away .map(x => Monad(x)).join() and we just have to call .chain(x => Monad(x))

// Example taken from http://www.tomharding.me/2017/05/15/fantas-eel-and-specification-13/

// Utility function prop() for the example
const prop = (k) => (xs) => (k in xs ? MyMonad(xs[k]) : MyMonad(null));

const data = { a: { b: { c: 2 } } };

// How do we get to the 2?
const withoutJoinOrChain = prop("a")(data) // MyMonad({ b: { c: 2 } })
  .map(prop("b")) // MyMonad(MyMonad({ c: 2 }))
  .map((x) => x.map(prop("c"))); // MyMonad(MyMonad(MyMonad(2))) // Here we have to write a nested .map() because we want to map over the Monad that is inside of the Moand => MyMonad(MyMonad({ c: 2 }))

const withJoin = prop("a")(data) // MyMonad({ b: { c: 2 } })
  .map(prop("b")) // MyMonad(MyMonad({ c: 2 }))
  .join() // MyMonad({ c: 2 })
  .map(prop("c")) // MyMonad(MyMonad(2))
  .join(); // MyMonad(2)

const withChain = prop("a")(data) // MyMonad({ b: { c: 2 } })
  .chain(prop("b")) // MyMonad({ c: 2 })
  .chain(prop("c")); // MyMonad(2)
