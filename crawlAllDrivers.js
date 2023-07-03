const axios = require("axios");
const cheerio = require("cheerio");
const _ = require("lodash");

const allDriversURLTemplate = "https://www.formula1.com/en/drivers.html";

async function crawlAllDrivers() {
  try {
    const compiled = _.template(allDriversURLTemplate);
    const driverProfilePageURL = compiled({});
    const response = await axios.get(driverProfilePageURL);

    // Get the HTML code of the webpage
    const html = response.data;
    const $ = cheerio.load(html);

    const result = [];
    const divs = $("div.container.driver > div.row fieldset div.container");
    divs.each((idx, div) => {
      const fullName = [];
      $(div)
        .find("span")
        .each((idx, span) => fullName.push($(span).text().trim()));
      result.push(fullName.join(" "));
    });

    return result;
  } catch (error) {
    console.log(error)
  }
}

module.exports = { crawlAllDrivers };
