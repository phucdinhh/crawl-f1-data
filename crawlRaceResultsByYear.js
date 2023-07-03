const axios = require("axios");
const cheerio = require("cheerio");
const _ = require("lodash");

const resultsPageURLTemplate =
  "https://www.formula1.com/en/results.html/${ year }/races.html";

async function crawlResultsByYear(year) {
  try {
    const compiled = _.template(resultsPageURLTemplate);
    const resultsPageURL = compiled({ year });
    const response = await axios.get(resultsPageURL);

    // Get the HTML code of the webpage
    const html = response.data;
    const $ = cheerio.load(html);

    // Create array to contain race results
    const results = [];

    const trs = $("table.resultsarchive-table tbody tr");
    trs.each((idx, tr) => {
      const result = {};
      $(tr)
        .find("td")
        .each((idx, td) => {
          switch (idx) {
            case 1: // grand prix
              result.grand_prix = $(td).find("a").first().text().trim();
              break;
            case 2: // date
              result.date = $(td).text().trim();
              break;
            case 3: // winner
              result.winner =
                $(td).find("span.hide-for-tablet").first().text() +
                " " +
                $(td).find("span.hide-for-mobile").first().text();
              break;
            case 4: // car
              result.car = $(td).text().trim();
              break;
            case 5: // laps
              result.laps = parseInt($(td).text().trim());
              break;
            case 6: // time
              result.time = $(td).text().trim();
              break;
          }
        });
      results.push(result);
    });

    return results;
  } catch (error) {
    throw error;
  }
}

module.exports = { crawlResultsByYear };
