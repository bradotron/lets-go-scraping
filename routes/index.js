var express = require("express");
var router = express.Router();

// axios will handle our http requests
var axios = require("axios");
// cheerio is our scraping tool
var cheerio = require("cheerio");

/* GET home page. */
router.get("/", function(req, res, next) {
  // do an axios to a website
  axios.get("http://www.echojs.com/").then(function(response) {
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

    // send the scraped articles to the client
    res.render("index", { title: "Scraped Articles", articles: articles });
  });
});

router.get("/signin", function(req, res, next) {
  res.render("signin", {title: "Sign In"});
});

router.post("/signin", function(req, res) {
  // console.log(req.body.email);
  // console.log(req.body.password);
  res.redirect("/");
});

module.exports = router;
