var express = require("express");
var router = express.Router();
// axios will handle our http requests
var axios = require("axios");
// cheerio is our scraping tool
var cheerio = require("cheerio");
// mongoose is our ODM
var mongoose = require("mongoose");
var db = require("../models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapingArticles", { useNewUrlParser: true });


/* GET home page. */
router.get("/", function(req, res, next) {
  // get all articles currently in the database
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      //send the scraped articles to the client
      res.render("index", { title: "Scraped Articles", articles: dbArticle });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// this is the route to scrape new articles
router.get(`/articles/scrape`, function(req, res ) {
  // pass the url to scrap in req.body.url
  // do an axios to a website
  let url = "https://www.dailywire.com/";
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
      result.url = $(this)
        .children("a")
        .attr("href");

      articles.push(result);
    });
    
    $("article h3").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.url = $(this)
        .children("a")
        .attr("href");

      articles.push(result);
    });

    articles.forEach((article) => db.Article.create(article));

    res.send(200);
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
