const fs = require("fs");

const { crawlResultsByYear } = require("./crawlRaceResultsByYear");
const { crawlDriverByYear } = require("./crawlDriverByYear");
const { crawlTeamsByYear } = require("./crawlTeamsByYear");
const { crawlDriverProfile } = require("./crawlDriverProfile");
const { crawlAllDrivers } =require("./crawlAllDrivers");

const allDrivers = require('./data/all-drivers/drivers')

function crawlData(yearFrom, yearTo) {
  if (yearFrom > yearTo) {
    throw new Error("from is greater to");
  }

  console.log("Starting crawl data from https://www.formula1.com/...");

  for (let year = yearFrom; year <= yearTo; year++) {
    const dir = `data/${year}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    crawlResultsByYear(year).then((rs) => {
      fs.writeFile(
        `${dir}/race-results.json`,
        JSON.stringify(rs, null, 2),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
    });

    crawlDriverByYear(year).then((rs) => {
      fs.writeFile(
        `${dir}/drivers.json`,
        JSON.stringify(rs, null, 2),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
    });

    crawlTeamsByYear(year).then((rs) => {
      fs.writeFile(
        `${dir}/teams.json`,
        JSON.stringify(rs, null, 2),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
    });
  }
}

function crawDriverData(driverName) {
  console.log("Starting crawl driver data from https://www.formula1.com/...");

  const dir = `data/all-drivers/detail/${driverName}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  crawlDriverProfile(driverName).then((rs) => {
    fs.writeFile(
      `${dir}/stat.json`,
      JSON.stringify(rs, null, 2),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  });
}

function crawlAllDriversData() {
  console.log("Starting crawl all drivers data from https://www.formula1.com/...");

  const dir = `data/all-drivers`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  crawlAllDrivers().then((rs) => {
    fs.writeFile(
      `${dir}/drivers.json`,
      JSON.stringify(rs, null, 2),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  }).then(() => {
    for(driver of allDrivers) {
      crawDriverData(driver.toLowerCase().split(' ').join('-'))
    }
  });
}

crawlAllDriversData();

// crawDriverData("max-verstappen");

// crawlData(2020, 2023);
