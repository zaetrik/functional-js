// trace() is a utility to let you easily inspect the contents.
const trace = label => x => {
  console.log(`${label}: ${x}`);
  return x;
};

// pipe multiple functions from left to right => pipe(firstFunction, lastFunction) => return value from firstFunction gets passed to lastFunction
// all functions must be unary (take one parameter)
export const pipe = (...fns: ((data?: any) => any)[]) => (startData: any) =>
  fns.reduce(
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

// pipe functions => f(g(x)) => executed from left to right
// double the input => pass doubled input to trace("after double") => pass doubled value to inc5 => pass inc5 return value to trace("after inc5")
const pipeAdd5ThenDouble = pipe(
  trace("after inc5"),
  inc5,
  trace("after double"),
  double
);

console.log(pipeAdd5ThenDouble(10)); // => (10 + 5) * 2 = 30
