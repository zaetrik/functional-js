// trace() is a utility to let you easily inspect the contents.
// trace :: String -> String -> Effect String
export const trace = (label: string) => (x: any) => {
  console.log(`${label}: ${x}`);
  return x;
};
