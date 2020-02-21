import * as Ramda from "ramda";

const isEven = x => x % 2 === 0;
const isOdd = Ramda.complement(isEven);

const y = Ramda.find(isOdd, [1, 3, 4, 5, 6]);

console.log(y);

/******************+
 *******************/

const createPerson = ({
  birthCountry = "",
  naturalizationDate = "",
  age = 0
}) => ({
  birthCountry,
  naturalizationDate,
  age
});

const wasBornInCountry = person => person.birthCountry === "GERMANY";
const wasNaturalized = person => Boolean(person.naturalizationDate);
const isOver18 = person => person.age >= 18;

const isCitizen = Ramda.either(wasBornInCountry, wasNaturalized);

const isEligibleToVote = Ramda.both(isOver18, isCitizen);

const dude = createPerson({
  birthCountry: "MOT_GERMANY",
  naturalizationDate: "10-10-2018",
  age: 18
});

console.log(isEligibleToVote(dude));

/******************+
 *******************/

const multiply = (a, b) => a * b;
const add = x => y => x + y;
const addOne = add(1);
const square = x => x * x;

const operatePipe = Ramda.pipe(multiply, addOne, square);
const operateCompose = Ramda.compose(square, addOne, multiply);

console.log(operatePipe(3, 4), operateCompose(3, 4));

/******************+
 *******************/

const publishedInYear = Ramda.curry((year, book) => book.year === year);

const titlesForYear = (year, books) =>
  Ramda.pipe(
    Ramda.filter(publishedInYear(year)),
    Ramda.map(Ramda.prop("title"))
  )(books);

const books = [
  { title: "My Book", year: 1975 },
  { title: "Another Book", year: 2020 }
];
console.log(titlesForYear(1975, books));
