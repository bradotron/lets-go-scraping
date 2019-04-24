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
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/scrapingArticles";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function(err, res) {
  if (err) {
    console.log("ERROR connecting to: " + MONGODB_URI + ". " + err);
  } else {
    console.log("Succeeded connected to: " + MONGODB_URI);
  }
});

/* GET home page. */
router.get("/", function(req, res, next) {
  // get all articles currently in the database
  // Grab every document in the Articles collection
  db.Article.find({})
    .populate("comments")
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

// these route adds a comment to an article
router.post("/comments/comment", function(req, res) {
  // console.log(req.body);
  // { articleId: '5cbe52220c90d12f5c66b018', comment: "i'm a dumb" }
  db.Comment.create({
    author: req.body.author,
    comment: req.body.comment
  })
    .then(dbComment => {
      return db.Article.findOneAndUpdate(
        { _id: req.body.articleId },
        { $push: { comments: dbComment._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(err => {
      res.json(err);
    });
});

// this is the route to scrape new articles
router.get(`/articles/scrape`, function(req, res) {
  // pass the url to scrap in req.body.url
  // do an axios to a website
  let url = "https://www.dailywire.com";
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
      result.url =
        url +
        $(this)
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
      result.url =
        url +
        $(this)
          .children("a")
          .attr("href");

      articles.push(result);
    });

    articles.forEach(article => db.Article.create(article));

    res.sendStatus(200);
  });
});

router.delete("/articles/article/:id", function(req, res, next) {
  console.log(req.params.id);
  db.Article.findByIdAndDelete(req.params.id)
    .then(function(dbArticle) {
      res.sendStatus(200);
    })
    .catch(function(error) {
      res.sendStatus(500);
    });
});

router.get("/signin", function(req, res, next) {
  res.render("signin", { title: "Sign In" });
});

router.post("/signin", function(req, res) {
  // console.log(req.body.email);
  // console.log(req.body.password);
  res.redirect("/");
});

module.exports = router;
