// We use the fp-ts library so we don't have to define the monads ourselves
// fp-ts also gets us some neat utility functions
import { either, taskEither } from "fp-ts";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import axios from "axios";
import { task } from "fp-ts/lib/Task";

/**
 * In this real life example we fetch data from an API and validate the result with the usage of Either and TaskEither
 */

enum CountryCode {
  EUR = "EUR",
  USD = "USD",
  CAD = "CAD",
  HKD = "HKD",
  ISK = "ISK",
  PHP = "PHP",
  DKK = "DKK",
  HUF = "HUF",
  CZK = "CZK",
  GBP = "GBP",
  RON = "RON",
  SEK = "SEK",
  IDR = "IDR",
  INR = "INR",
  BRL = "BRL",
  RUB = "RUB",
  HRK = "HRK",
  JPY = "JPY",
  THB = "THB",
  CHF = "CHF",
  MYR = "MYR",
  BGN = "BGN",
  TRY = "TRY",
  CNY = "CNY",
  NOK = "NOK",
  NZD = "NZD",
  ZAR = "ZAR",
  MXN = "MXN",
  SGD = "SGD",
  AUD = "AUD",
  ILS = "ILS",
  KRW = "KRW",
  PLN = "PLN",
}

interface ExchangeRates {
  rates: {
    [key in CountryCode]: number;
  };
  base: CountryCode;
  date: string;
}

// We create a function that could fail & returns a Promise
const fetchExchangeRatesForCountry = async (
  cc: CountryCode
): Promise<ExchangeRates> => {
  const res = await axios.get(
    `https://api.exchangeratesapi.io/latest?base=${cc}`
  );
  return res.data as ExchangeRates;
};

const validateExchangeRates = (countryCode: CountryCode) => (
  response: ExchangeRates
): either.Either<Error, ExchangeRates> => {
  return response.base === countryCode
    ? either.right(response as ExchangeRates)
    : either.left(
        Error(
          `Invalid exchange rates data! Expected ${countryCode} but got ${response.base}`
        )
      );
};

const getExchangeRatesForCountry = (countryCode: CountryCode) =>
  pipe(
    // tryCatch transforms our Promise that may reject to a Promise that never rejects and returns an Either instead
    taskEither.tryCatch(
      // We need an anonymous function here because we can only use tryCatch with functions that return Lazy<Promise<any>>
      () => fetchExchangeRatesForCountry(countryCode),
      either.toError
    ),
    taskEither.chain(
      // flow => function composition (from left to right)
      // could also be written without flow() => taskEither.fromEither(validateExchangeRates(countryCode))
      // we validate our response
      // => returns Either
      // => transform Either to TaskEither
      flow(validateExchangeRates(countryCode), taskEither.fromEither)
    ),
    taskEither.getOrElse((e) => {
      // error handling (putting it to the console, sending to logging service, whatever is needed for you app)
      return task.of(undefined);
    })
  )();

//getExchangeRatesForCountry(CountryCode.GGG).then(console.log);
getExchangeRatesForCountry(CountryCode.AUD).then(console.log);
