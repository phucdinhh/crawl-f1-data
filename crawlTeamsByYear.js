const axios = require("axios");
const cheerio = require("cheerio");
const _ = require("lodash");

const teamsPageURLTemplate =
  "https://www.formula1.com/en/results.html/${ year }/team.html";

async function crawlTeamsByYear(year) {
  try {
    const compiled = _.template(teamsPageURLTemplate);
    const teamsPageURL = compiled({ year });
    const response = await axios.get(teamsPageURL);

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
            case 2: // team
              result.team = $(td).text().trim();
              break;
            case 3: // pts
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

module.exports = { crawlTeamsByYear };
