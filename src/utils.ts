// trace() is a utility to let you easily inspect the contents.
// trace :: String -> String -> Effect String
// Taken from Composing Software by Eric Elliott
export const trace = (label: string) => (x: any) => {
  console.log(`${label}: ${x}`);
  return x;
};
