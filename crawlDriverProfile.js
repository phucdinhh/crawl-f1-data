const axios = require("axios");
const cheerio = require("cheerio");
const _ = require("lodash");

const driverProfileURLTemplate =
  "https://www.formula1.com/en/drivers/${ driverName }.html";

async function crawlDriverProfile(driverName) {
  try {
    const compiled = _.template(driverProfileURLTemplate);
    const driverProfilePageURL = compiled({ driverName });
    const response = await axios.get(driverProfilePageURL);

    // Get the HTML code of the webpage
    const html = response.data;
    const $ = cheerio.load(html);

    const result = {};
    const tds = $("table.stat-list tbody tr td");
    tds.each((idx, td) => {
      switch (idx) {
        case 0: // team
          result.team = $(td).text().trim();
          break;
        case 1: // country
          result.country = $(td).text().trim();
          break;
        case 2: // podiums
          result.podiums = parseInt($(td).text().trim());
          break;
        case 3: // points
          result.points = parseFloat($(td).text().trim());
          break;
        case 4: // Grands Prix entered
          result.grandsPrixEntered = parseInt($(td).text().trim());
          break;
        case 5: // World Championships
          result.worldChampionships = parseInt($(td).text().trim());
          break;
        case 6: // Highest race finish
          result.highestRaceFinish = $(td).text().trim();
          break;
        case 7: // Highest grid position
          result.highestGridPosition = parseInt($(td).text().trim());
          break;
        case 8: // Date of birth
          result.dateOfBirth = $(td).text().trim();
          break;
        case 9: // Place of birth
          result.placeOfBirth = $(td).text().trim();
          break;
      }
    });

    return result;
  } catch (error) {}
}

module.exports = { crawlDriverProfile };
