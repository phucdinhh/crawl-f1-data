const axios = require("axios");
const cheerio = require("cheerio");
const _ = require("lodash");

const driversPageURLTemplate =
  "https://www.formula1.com/en/results.html/${ year }/drivers.html";

async function crawlDriverByYear(year) {
  try {
    const compiled = _.template(driversPageURLTemplate);
    const driversPageURL = compiled({ year });
    const response = await axios.get(driversPageURL);

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
            case 1: // pos
              result.pos = parseInt($(td).text().trim());
              break;
            case 2: // driver
              result.driver =
                $(td).find("span.hide-for-tablet").first().text() +
                " " +
                $(td).find("span.hide-for-mobile").first().text();
              break;
            case 3: // nationality
              result.nationality = $(td).text().trim();
              break;
            case 4: // car
              result.car = $(td).text().trim();
              break;
            case 5: // pts
              result.pts = parseInt($(td).text().trim());
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

module.exports = { crawlDriverByYear };
