// trace() is a utility to let you easily inspect the contents.
const trace = label => x => {
  console.log(`${label}: ${x}`);
  return x;
};

// compose multiple functions from right to left => compose(lastFunction, firstFunction) => return value from firstFunction gets passed to lastFunction
// all functions must be unary (take one parameter)
export const compose = (...fns: ((data?: any) => any)[]) => (startData: any) =>
  fns.reduceRight(
    (
      previousFunction: (data?: any) => any,
      currentFunction: (data?: any) => any
    ) => currentFunction(previousFunction),
    startData
  );

// see curry.ts for explaination
const inc = (a: number): ((b: number) => number) => (b: number): number =>
  a + b;
const inc5 = inc(5);

const multiply = (a: number): ((b: number) => number) => (b: number): number =>
  a * b;
const double = multiply(2);

// compose our pipeline => g(f(x)) => executed from right to left
// double the input => pass doubled input to trace("after double") => pass doubled value to inc5 => pass inc5 return value to trace("after inc5")
const composeDoubleThenAdd5 = compose(
  trace("after inc5"),
  inc5,
  trace("after double"),
  double
);

console.log(composeDoubleThenAdd5(10)); // => 10 * 2 + 5 = 25
