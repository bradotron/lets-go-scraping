var express = require("express");
var router = express.Router();
// axios will handle our http requests
var axios = require("axios");
// cheerio is our scraping tool
var cheerio = require("cheerio");

// this is the scrape router, all routes will be prefaced with /scrape
router.get(`/`, function(req, res, next) {
  // pass the url to scrap in req.body.url
  // do an axios to a website
  let url = req.body.url || "http://www.echojs.com/";
  axios.get(url).then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var articles = [];

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      articles.push(result);
    });
  });
});

module.exports = router;