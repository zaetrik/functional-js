import fs from "fs";
import readline from "readline";

const createCounter = (type: string, condition: string) => ({
  [condition.toUpperCase()]: { [type]: condition, count: 0 },
  set: function(item) {
    if (item && item.toUpperCase() === condition.toUpperCase()) {
      this[condition.toUpperCase()].count++;
      return this[condition.toUpperCase()];
    }
  },
  get: function() {
    return this[condition.toUpperCase()];
  }
});

const companyToFilter = "JPMORGAN CHASE & CO.";
const regexMatchFilter = new RegExp(companyToFilter.toUpperCase());
const companies = createCounter("company", companyToFilter);

const clearLine = x => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  return x;
};

const writeLine = data => process.stdout.write(data);

// data download => https://files.consumerfinance.gov/ccdb/complaints.csv.zip
const stream = fs.createReadStream("../assets/complaints.csv", "utf8");
stream.on("end", () => {
  writeLine("\n");
  stream.close();
});

// create a read line by line stream
const lineStream = readline.createInterface({
  input: stream,
  terminal: false
});
lineStream.on("close", lineStream.close);

lineStream.on("line", data =>
  [data]
    .map(line =>
      line.toUpperCase().match(regexMatchFilter)
        ? line.toUpperCase().match(regexMatchFilter)[0]
        : undefined
    )
    .filter(item => item)
    .map(item => companies.set(item))
    .map(clearLine)
    .forEach(() => writeLine(JSON.stringify(companies.get())))
);
